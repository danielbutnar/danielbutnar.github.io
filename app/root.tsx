import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import anybodyLatin from "./assets/fonts/anybody-latin.woff2?url";
import hankenLatin from "./assets/fonts/hanken-grotesk-latin.woff2?url";
import { NotFound } from "./components/NotFound";
import { SiteShell } from "./components/SiteShell";
import { dictionaries, localeFromPathname } from "./i18n";
import "./styles/global.css";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: anybodyLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: hankenLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export function Layout({ children }: { children: ReactNode }) {
  const locale = localeFromPathname(useLocation().pathname);
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eef1ec" />
        <meta name="color-scheme" content="light" />
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

export default function App() {
  return <Outlet />;
}

/** Shown by 404.html (the SPA fallback) until the router has matched the URL. */
export function HydrateFallback() {
  return (
    <SiteShell>
      <title>Page not found</title>
    </SiteShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const locale = localeFromPathname(useLocation().pathname);
  const t = dictionaries[locale];
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <SiteShell>
        <title>{t.meta.notFoundTitle}</title>
        <NotFound />
      </SiteShell>
    );
  }
  if (import.meta.env.DEV) console.error(error);
  return (
    <SiteShell>
      <title>{t.error.title}</title>
      <div className="wrap not-found">
        <h1 className="display display--tight">{t.error.title}</h1>
        <p>{t.error.text}</p>
        <a className="button button--primary" href="/">
          {t.error.home}
        </a>
      </div>
    </SiteShell>
  );
}
