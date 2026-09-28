#!/usr/bin/env node
/**
 * Apply a batch update to the PhiloFragrancy catalog.
 *
 *   node batch-update-coupons.js            # dry run, changes nothing
 *   node batch-update-coupons.js --write    # apply
 *
 * Reads `batch-updates.json` (copy `batch-updates-template.json` first) and does
 * two very different things with it, on purpose:
 *
 *   1. IMAGES go into `app/data/coupons.ts`. This rewrites source, so it is the
 *      dangerous half and it is guarded hard: the slug must exist, the `image:`
 *      line must be found exactly once inside that slug's block, and anything
 *      other than a clean single replacement aborts the whole run with the file
 *      untouched. A partially-applied image batch would be far worse than none.
 *
 *   2. PRICES do NOT go into `coupons.ts`. They go to a generated
 *      `app/data/pricing.json`, which `deals.ts` reads. This is the schema rule
 *      the whole project is built on — editorial facts and retailer data never
 *      mix — and a script that scraped prices into the prose file would quietly
 *      undo it. It also means a price change never touches a sentence, and a
 *      sentence rewrite never moves a price.
 *
 * The "PREENCHER" placeholders are a guard, not a value. The script refuses to
 * run while any is present, because a batch that ships the literal string
 * PREENCHER into a price field is worse than a batch that does not run.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)));
const BATCH_FILE = join(ROOT, "batch-updates.json");
const CATALOG_FILE = join(ROOT, "app", "data", "coupons.ts");
const PRICING_FILE = join(ROOT, "app", "data", "pricing.json");

const WRITE = process.argv.includes("--write");
const PLACEHOLDER = "PREENCHER";

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function die(message) {
  console.error(`\n${c.red("ABORTADO")} ${message}\n`);
  process.exit(1);
}

/* ── 1. Load and validate ────────────────────────────────────────────────── */

if (!existsSync(BATCH_FILE)) {
  die(
    `batch-updates.json não existe.\n` +
      `   Copie o template:  cp batch-updates-template.json batch-updates.json`,
  );
}

let batch;
try {
  /* Strip a UTF-8 BOM before parsing. Windows editors (Notepad, PowerShell's
     `Set-Content -Encoding UTF8`, some IDEs) write one by default, and
     `JSON.parse` rejects it with a parse error that reads like the file is
     corrupt when it is not. Tolerating the BOM costs one character and removes
     the single most likely way for this script to fail on a hand-edited file. */
  const raw = readFileSync(BATCH_FILE, "utf8").replace(/^﻿/, "");
  batch = JSON.parse(raw);
} catch (err) {
  die(`batch-updates.json não é JSON válido: ${err.message}`);
}

if (!Array.isArray(batch) || batch.length === 0) {
  die("batch-updates.json deve ser um array com pelo menos um registro.");
}

const problems = [];
const notes = [];

/* Collect every unfilled placeholder rather than stopping at the first, so one
   run tells the author everything that is still missing. */
for (const entry of batch) {
  for (const [key, value] of Object.entries(entry)) {
    if (typeof value === "string" && value.trim().toUpperCase() === PLACEHOLDER) {
      problems.push(`"${entry.slug ?? "(sem slug)"}": ${key} ainda está ${PLACEHOLDER}`);
    }
  }
}

if (problems.length > 0) {
  die(
    `${problems.length} campo(s) ainda ${PLACEHOLDER}:\n` +
      problems.map((p) => `   - ${p}`).join("\n") +
      `\n\n   O script não escreve placeholder no código. Preencha e rode de novo.`,
  );
}

for (const entry of batch) {
  for (const field of ["slug", "image_url"]) {
    if (!entry[field] || typeof entry[field] !== "string") {
      problems.push(`"${entry.slug ?? "(sem slug)"}": ${field} é obrigatório`);
    }
  }
}

if (problems.length > 0) {
  die(problems.map((p) => `   - ${p}`).join("\n"));
}

/* ── 2. Images → coupons.ts ──────────────────────────────────────────────── */

let catalog = readFileSync(CATALOG_FILE, "utf8");
const imageChanges = [];

for (const entry of batch) {
  if (!catalog.includes(`slug: "${entry.slug}"`)) {
    die(
      `slug "${entry.slug}" não existe em app/data/coupons.ts.\n` +
        `   Adicione o produto ao catálogo antes de rodar o batch.`,
    );
  }

  const imagePath = join(ROOT, "public", entry.image_url);
  if (!existsSync(imagePath)) {
    die(`slug "${entry.slug}": a imagem ${entry.image_url} não existe em public/.`);
  }

  /* Scope the search to this slug's object literal, so a bare `image:` elsewhere
     in the file can never be matched by accident. */
  const slugIndex = catalog.indexOf(`slug: "${entry.slug}"`);
  const blockEnd = catalog.indexOf("\n  },", slugIndex);
  if (blockEnd === -1) {
    die(`slug "${entry.slug}": não consegui delimitar o objeto no arquivo.`);
  }

  const block = catalog.slice(slugIndex, blockEnd);
  const imageLine = /image: "([^"]*)"/.exec(block);
  if (!imageLine) {
    die(`slug "${entry.slug}": nenhum campo image: dentro do objeto.`);
  }

  const current = imageLine[1];
  const next = entry.image_url;

  if (current === next) {
    notes.push(`${entry.slug}: imagem já estava correta`);
    continue;
  }

  const replacement = `image: "${next}"`;
  const updatedBlock = block.replace(imageLine[0], replacement);

  /* Exactly one substitution or nothing. This is the guard that makes source
     rewriting safe here. */
  if (updatedBlock === block) {
    die(`slug "${entry.slug}": a substituição da imagem não teve efeito.`);
  }

  catalog = catalog.slice(0, slugIndex) + updatedBlock + catalog.slice(blockEnd);
  imageChanges.push({ slug: entry.slug, from: current, to: next });
}

/* ── 3. Prices → pricing.json (never into coupons.ts) ────────────────────── */

const priceEntries = {};
let priceCount = 0;

for (const entry of batch) {
  const offers = [];
  const retailers = [
    ["FragranceNet", "fragrance_net_price", "fragrance_net_link"],
    ["Amazon", "amazon_price", "amazon_link"],
  ];

  for (const [retailer, priceField, linkField] of retailers) {
    const raw = entry[priceField];
    const link = entry[linkField];

    if (raw === undefined && link === undefined) continue;

    const currency = entry.currency;
    if (!currency) {
      die(
        `slug "${entry.slug}": falta o campo "currency".\n` +
          `   Um preço sem moeda não é um preço — defina "currency" (ex: "USD", "BRL").`,
      );
    }

    const amount = Number(String(raw).replace(/[^\d.,-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      die(
        `slug "${entry.slug}": ${priceField} = ${JSON.stringify(raw)} não é um preço válido.\n` +
          `   Aceita "380", "380.00", "380,00", "$380" ou "R$ 1.890,00".`,
      );
    }

    /* The house convention is minor units so money never round-trips a float.
       Currencies with no minor unit (JPY) are stored whole. */
    const zeroDecimal = ["JPY", "KRW"].includes(String(currency).toUpperCase());
    const priceCents = zeroDecimal ? Math.round(amount) : Math.round(amount * 100);

    offers.push({
      retailer,
      priceCents,
      originalPriceCents: entry[`${priceField}_original`] ?? null,
      currency: String(currency).toUpperCase(),
      affiliateUrl: link,
      availability: "unknown",
      recordedOn: entry.recorded_on ?? null,
      recordedBy: "manual",
    });
    priceCount += 1;
  }

  if (offers.length > 0) priceEntries[entry.slug] = offers;
}

if (priceCount > 0) {
  const missingDate = Object.keys(priceEntries).filter((slug) =>
    priceEntries[slug].some((o) => !o.recordedOn),
  );
  if (missingDate.length > 0) {
    notes.push(
      `sem "recorded_on": ${missingDate.join(", ")} — a UI vai dizer "data não registrada" em vez de mentir sobre quando o preço foi visto`,
    );
  }
}

/* ── 4. Report ───────────────────────────────────────────────────────────── */

console.log("");
console.log(c.bold("════════════════════════════════════════════════════════"));
console.log(c.bold("  PhiloFragrancy — batch update"));
console.log(c.bold("════════════════════════════════════════════════════════"));
console.log(`  registros: ${c.bold(String(batch.length))}   imagens a trocar: ${c.bold(String(imageChanges.length))}   preços: ${c.bold(String(priceCount))}`);

if (imageChanges.length > 0) {
  console.log("\n  " + c.bold("IMAGENS → app/data/coupons.ts"));
  for (const change of imageChanges) {
    console.log(`    ${c.yellow("~")} ${change.slug}`);
    console.log(`        ${c.dim(change.from)}`);
    console.log(`        ${c.green(change.to)}`);
  }
} else {
  console.log("\n  " + c.bold("IMAGENS") + "  nenhuma alteração necessária");
}

if (priceCount > 0) {
  console.log("\n  " + c.bold("PREÇOS → app/data/pricing.json") + c.dim("  (fora do arquivo de prosa, por regra do schema)"));
  for (const [slug, offers] of Object.entries(priceEntries)) {
    for (const offer of offers) {
      const value = (offer.priceCents / 100).toFixed(2);
      console.log(`    ${c.green("+")} ${slug} · ${offer.retailer} · ${offer.currency} ${value}`);
    }
  }
}

for (const note of notes) {
  console.log(`\n  ${c.yellow("!")} ${note}`);
}

if (!WRITE) {
  console.log("\n  " + c.dim("dry run — nada foi escrito."));
  console.log("  " + c.dim("rode com --write para aplicar: node batch-update-coupons.js --write"));
  console.log(c.bold("════════════════════════════════════════════════════════\n"));
  process.exit(0);
}

/* ── 5. Write ────────────────────────────────────────────────────────────── */

if (imageChanges.length > 0) {
  writeFileSync(CATALOG_FILE, catalog, "utf8");
  console.log(`\n  ${c.green("✓")} coupons.ts atualizado (${imageChanges.length} imagem(ns))`);
}

if (priceCount > 0) {
  const existing = existsSync(PRICING_FILE)
    ? JSON.parse(readFileSync(PRICING_FILE, "utf8").replace(/^﻿/, ""))
    : { entries: {} };

  const output = {
    _comment:
      "GERADO por batch-update-coupons.js. Não editar à mão. Preços de retailer nunca entram em coupons.ts — a separação entre dado editorial e dado comercial é a regra do schema.",
    generatedAt: new Date().toISOString(),
    source: "batch-updates.json",
    machineVerified: false,
    entries: { ...existing.entries, ...priceEntries },
  };

  writeFileSync(PRICING_FILE, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`  ${c.green("✓")} pricing.json escrito (${priceCount} oferta(s))`);
}

console.log(`\n  ${c.green("✓")} batch aplicado.`);
console.log(`  ${c.dim("Reinicie pnpm dev se você editou app/data/ — o grafo SSR não recarrega sozinho.")}`);
console.log(c.bold("════════════════════════════════════════════════════════\n"));
