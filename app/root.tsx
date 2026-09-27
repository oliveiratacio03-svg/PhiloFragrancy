import { configureTracking } from "@agent-native/core/client/analytics";
import { appPath } from "@agent-native/core/client/api-path";
import { useDbSync } from "@agent-native/core/client/hooks";
import {
  AppProviders,
  createAgentNativeQueryClient,
} from "@agent-native/core/client/hooks";
import { getThemeInitScript } from "@agent-native/core/client/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useSyncExternalStore } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { LinksFunction } from "react-router";

import { Layout as AppLayout } from "@/components/layout/Layout";
import { AppToolkitProvider } from "@/components/ui/toolkit-provider";
import { useNavigationState } from "@/hooks/use-navigation-state";
import { APP_NAME, APP_TITLE } from "@/lib/app-config";
import { TAB_ID } from "@/lib/tab-id";

import stylesheet from "./global.css?url";

configureTracking({
  getDefaultProps: (_name, properties) => ({
    ...properties,
    app: APP_NAME,
  }),
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const THEME_INIT_SCRIPT = getThemeInitScript();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <meta name="theme-color" content="#18181B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={APP_TITLE} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * True only after hydration.
 *
 * `DbSyncSetup` wires the database sync loop and the agent's view of the
 * current route, and both reach for router context that does not exist during
 * a server render. `isPublicPath` on `AppProviders` deliberately drops the
 * `<ClientOnly>` wrapper so public routes can SSR for crawlers, which puts this
 * component back on the server's render path.
 *
 * It renders `null` either way, so mounting it client-only produces no markup
 * difference and no hydration mismatch.
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function DbSyncSetup() {
  const qc = useQueryClient();
  useNavigationState();
  useDbSync({
    queryClient: qc,
    ignoreSource: TAB_ID,
  });
  return null;
}

/**
 * The public catalogue, mirrored from `server/plugins/auth.ts`.
 *
 * Two lists are needed because the gate runs in two places: the server guard
 * (`publicPaths`, which protects API and framework routes) and the client gate
 * in `AppProviders` (which decides whether a first-visit signed-out reader
 * gets the page or the sign-in screen). Miss the second one and the server
 * happily serves the route while the browser bounces the visitor to /sign-in
 * after hydration — the page is unreachable even though every request for it
 * returns 200.
 *
 * Keep the two in step. A route that starts bouncing signed-out visitors is the
 * one to add here, not a blanket change to the matching.
 */
const PUBLIC_PATHS = ["/", "/search", "/compare", "/perfumes", "/about", "/disclosure"] as const;

function isPublicPathname(pathname: string): boolean {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_PATHS.some((candidate) => {
    const n = candidate.length > 1 && candidate.endsWith("/") ? candidate.slice(0, -1) : candidate;
    return p === n || p.startsWith(`${n}/`);
  });
}

export default function Root() {
  const [queryClient] = useState(() => createAgentNativeQueryClient());
  const location = useLocation();
  const isClient = useIsClient();

  return (
    <AppToolkitProvider>
      <AppProviders queryClient={queryClient} isPublicPath={isPublicPathname(location.pathname)}>
        {isClient && <DbSyncSetup />}
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AppProviders>
    </AppToolkitProvider>
  );
}

export { ErrorBoundary } from "@agent-native/core/client/ui";
