import { createRequire } from "node:module";

import { agentNative } from "@agent-native/core/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const reactRouterPlugins = reactRouter as unknown as () => any[];
const agentNativePlugins = agentNative as unknown as (
  options?: Parameters<typeof agentNative>[0],
) => any[];
const appRequire = createRequire(import.meta.url);
const coreRequire = createRequire(
  appRequire.resolve("@agent-native/core/vite"),
);

/**
 * `@agent-native/core/client/blocks/library/code-highlight` reaches highlight.js
 * through lowlight:
 *
 *   code-highlight → lowlight@3.3.0 → lowlight/lib/index.js → highlight.js/lib/core
 *
 * highlight.js is CommonJS. Because the app uses `@agent-native/agentkit`, core
 * sets `optimizeDeps.noDiscovery: true` and its AgentKit include list
 * (`getAgentKitOptimizeDeps`) does not mention either package — only
 * `getDefaultOptimizeDeps`, the path this app does not take, lists them. Vite
 * therefore serves both as raw source, the browser cannot find a `default` export
 * on the CJS file, and hydration never starts:
 *
 *   SyntaxError: The requested module '.../highlight.js/lib/core.js'
 *   does not provide an export named 'default'
 *
 * Pre-bundling highlight.js alone is not enough: lowlight is the *importer*, and
 * while lowlight is served raw its `import ... from "highlight.js/lib/core"` is
 * never rewritten to the optimized chunk, so the browser still loads the raw CJS
 * file. Both the importer and the imported have to be pre-bundled.
 *
 * Constraints this works around, all verified:
 *  - `optimizeDeps.include` takes only strings in Vite 8; the
 *    `{ specifier, packageName }` form core uses internally reaches
 *    `normalizeId` as a raw object when it comes from user config and throws
 *    `id.replace is not a function`.
 *  - Both packages are transitive, hoisted under .pnpm, so a bare "lowlight" or
 *    "highlight.js" string cannot be resolved from the project root
 *    (`Failed to resolve dependency`).
 *
 * So resolve the real path through core's require — the same seam already used
 * for the assistant-ui aliases below — then alias and pre-bundle it.
 *
 * lowlight is different: aliasing it to an absolute path makes Vite treat it as
 * source, and a source module is never redirected to its optimized chunk, so its
 * import of highlight.js kept pointing at the raw CJS file. lowlight is therefore
 * declared as a direct dependency (same 3.3.0 already in the tree) so the plain
 * `lowlight` specifier resolves and the optimized chunk is actually used.
 */
const highlightCorePath = coreRequire.resolve("highlight.js/lib/core");

export default defineConfig({
  optimizeDeps: {
    include: ["lowlight", "@tiptap/extension-code-block-lowlight", highlightCorePath],
    // React Router discovers route modules outside Vite's default HTML crawl.
    // Scan the shell and Chat route before accepting requests so a cold
    // standalone consumer does not leave the browser waiting on the full
    // composer/editor graph one module at a time.
    entries: [
      "app/entry.client.tsx",
      "app/root.tsx",
      "app/components/layout/{Layout,Sidebar}.tsx",
      "app/components/chat/ChatRouteContent.tsx",
      "app/routes/{home,chat.$threadId}.tsx",
    ],
  },
  resolve: {
    // Core and toolkit both use assistant-ui contexts. Keep published and
    // linked graphs on one store so the agent sidebar can compose reliably.
    dedupe: [
      "@assistant-ui/react",
      "@assistant-ui/core",
      "@assistant-ui/store",
      "@assistant-ui/tap",
    ],
    alias: [
      {
        find: /^highlight\.js\/lib\/core$/,
        replacement: highlightCorePath,
      },
      {
        find: /^@assistant-ui\/react$/,
        replacement: coreRequire.resolve("@assistant-ui/react"),
      },
      {
        find: /^@assistant-ui\/core$/,
        replacement: coreRequire.resolve("@assistant-ui/core"),
      },
      {
        find: /^@assistant-ui\/store$/,
        replacement: coreRequire.resolve("@assistant-ui/store"),
      },
      {
        find: /^@assistant-ui\/tap$/,
        replacement: coreRequire.resolve("@assistant-ui/tap"),
      },
      {
        find: /^assistant-stream$/,
        replacement: coreRequire.resolve("assistant-stream"),
      },
      {
        find: /^assistant-stream\/utils$/,
        replacement: coreRequire.resolve("assistant-stream/utils"),
      },
    ],
  },
  plugins: [
    ...reactRouterPlugins(),
    ...agentNativePlugins({
      // shiki only runs in AssistantChat's useEffect — keep it out of the
      // CF Pages Functions bundle (25 MiB limit).
      ssrStubs: ["shiki"],
    }),
  ],
});
