/**
 * Real browser diagnosis over the Chrome DevTools Protocol.
 * Zero dependencies: Node 24 has a global WebSocket, and Chrome is installed.
 * Collects console errors, uncaught exceptions, failed/4xx/5xx requests,
 * pending requests, and the final DOM state.
 */
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = process.argv[2] || "http://localhost:5173/perfumes/creed-aventus";
const PORT = 9333;
const WAIT_MS = Number(process.argv[3] || 30000);
/**
 * `--login` completes the local developer sign-in before measuring.
 *
 * The dev server puts a login wall in front of every page, so a headless run
 * without this lands on /sign-in and reports that instead of the page under
 * test. The button only exists on localhost and only exists to make local
 * development possible; clicking it is what a developer does manually before
 * looking at anything.
 */
const DO_LOGIN = process.argv.includes("--login");

const profile = mkdtempSync(join(tmpdir(), "cdp-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findTarget() {
  // Create a dedicated target instead of reusing an existing page: other
  // Chromium windows on the machine (e.g. vendor widgets) also expose
  // /json/list, and picking the first entry attaches to the wrong window.
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" });
      if (res.ok) {
        const t = await res.json();
        if (t.webSocketDebuggerUrl) return t;
      }
    } catch {
      /* chrome still booting */
    }
    await sleep(500);
  }
  throw new Error("Chrome DevTools endpoint never became available");
}

const target = await findTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const events = [];
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
    return;
  }
  events.push(msg);
};

await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Page.enable");
await send("Page.navigate", { url: TARGET_URL });
await sleep(WAIT_MS);

const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r?.result?.value;
};

if (DO_LOGIN) {
  const onSignIn = await evaluate(`location.pathname.startsWith('/sign-in')`);
  if (onSignIn) {
    const clicked = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find((el) =>
        /desenvolvedor local|developer local/i.test(el.textContent || ''),
      );
      if (!btn) return false;
      btn.click();
      return true;
    })()`);

    if (clicked) {
      // The click sets a session cookie and reloads; then go back to the page
      // under test, because the wall redirected away from it.
      await sleep(6000);
      await send("Page.navigate", { url: TARGET_URL });
      await sleep(Math.max(WAIT_MS, 12000));
    }
  }
}

const report = {
  url: await evaluate("location.href"),
  title: await evaluate("document.title"),
  loaderPresent: await evaluate(
    `!!document.querySelector('[data-agent-native-cube-loader]') || document.body.innerText.includes('Churning')`,
  ),
  loaderText: await evaluate(
    `document.querySelector('[data-agent-native-loading-label]')?.textContent ?? '(sem loader-label)'`,
  ),
  bodyPreview: await evaluate("document.body.innerText.replace(/\\s+/g,' ').slice(0, 260)"),
  /* The page's own outline. More useful than a hand-picked boolean when the
     question is "did the route I just wrote actually render its content". */
  headings: await evaluate(
    `Array.from(document.querySelectorAll('h1, h2')).map(h => h.tagName + ': ' + h.textContent.trim().replace(/\\s+/g,' ')).slice(0, 22)`,
  ),
  /* Every internal destination the page links to. A route that 404s shows up
     here as a href nothing serves. */
  internalLinks: await evaluate(
    `Array.from(new Set(Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/')))).slice(0, 40)`,
  ),
  externalLinks: await evaluate(
    `document.querySelectorAll('a[target="_blank"]').length`,
  ),
  hasReviewMarker: await evaluate("document.body.innerText.includes('Note breakdown')"),
  hasDraftBanner: await evaluate("document.body.innerText.includes('not published')"),
  hasLegacyMarker: await evaluate("document.body.innerText.includes('Olfactory Pyramid')"),
  scriptTags: await evaluate(
    `Array.from(document.scripts).map(s => s.src).filter(Boolean).length`,
  ),
  readyState: await evaluate("document.readyState"),
  totalRequests: events.filter((e) => e.method === "Network.requestWillBeSent").length,
  completedRequests: events.filter((e) => e.method === "Network.responseReceived").length,
};

const consoleErrors = [];
const exceptions = [];
const logEntries = [];
const badResponses = [];
const failedRequests = [];
const pendingRequests = new Map();

for (const e of events) {
  const p = e.params || {};
  switch (e.method) {
    case "Runtime.consoleAPICalled": {
      const text = (p.args || [])
        .map((a) => a.value ?? a.description ?? a.unserializableValue ?? a.type)
        .join(" ");
      if (p.type === "error" || p.type === "warning") {
        consoleErrors.push({ level: p.type, text: text.slice(0, 700), line: p.lineNumber, col: p.columnNumber });
      }
      break;
    }
    case "Runtime.exceptionThrown": {
      const d = p.exceptionDetails || {};
      exceptions.push({
        text: d.exception?.description || d.text || "(sem descricao)",
        url: d.url,
        line: d.lineNumber,
        col: d.columnNumber,
      });
      break;
    }
    case "Log.entryAdded": {
      const en = p.entry || {};
      if (en.level === "error" || en.level === "warning") {
        logEntries.push({ level: en.level, text: (en.text || "").slice(0, 500), url: en.url });
      }
      break;
    }
    case "Network.requestWillBeSent":
      pendingRequests.set(p.requestId, p.request?.url);
      break;
    case "Network.responseReceived": {
      const st = p.response?.status;
      if (st && st >= 400) {
        badResponses.push({ status: st, url: p.response?.url, mime: p.response?.mimeType });
      }
      if (st) pendingRequests.delete(p.requestId);
      break;
    }
    case "Network.loadingFailed": {
      failedRequests.push({
        url: pendingRequests.get(p.requestId) || "(desconhecido)",
        error: p.errorText,
        type: p.type,
      });
      pendingRequests.delete(p.requestId);
      break;
    }
    default:
      break;
  }
}

const stillPending = Array.from(pendingRequests.values());

console.log("===== DIAGNOSTICO DO NAVEGADOR =====");
console.log("\n--- ESTADO FINAL ---");
console.log(JSON.stringify(report, null, 2));
console.log("\n--- CONSOLE (erros/warnings) ---");
console.log(consoleErrors.length ? JSON.stringify(consoleErrors, null, 2) : "(nenhum)");
console.log("\n--- EXCECOES NAO CAPTURADAS ---");
console.log(exceptions.length ? JSON.stringify(exceptions, null, 2) : "(nenhuma)");
console.log("\n--- LOG DO BROWSER ---");
console.log(logEntries.length ? JSON.stringify(logEntries, null, 2) : "(nenhum)");
console.log("\n--- RESPOSTAS 4xx/5xx ---");
console.log(badResponses.length ? JSON.stringify(badResponses, null, 2) : "(nenhuma)");
console.log("\n--- REQUISICOES FALHADAS ---");
console.log(failedRequests.length ? JSON.stringify(failedRequests, null, 2) : "(nenhuma)");
console.log("\n--- REQUISICOES PENDENTES ---");
console.log(stillPending.length ? JSON.stringify(stillPending, null, 2) : "(nenhuma)");

ws.close();
chrome.kill();
process.exit(0);
