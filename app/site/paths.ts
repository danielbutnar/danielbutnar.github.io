import { PROJECT_SLUGS } from "../content/projects.ts";
import { LOCALES, localizePath } from "../i18n/locales.ts";

/** Pages that exist in every language, written without the locale prefix. */
export const PUBLIC_PAGES = ["/", "/contact", "/contact/status", "/privacy"] as const;

export function publicPaths(): string[] {
  const pages = [...PUBLIC_PAGES, ...PROJECT_SLUGS.map((slug) => `/work/${slug}`)];
  return LOCALES.flatMap((locale) => pages.map((page) => localizePath(locale, page)));
}

/** Everything React Router renders to HTML at build time. */
export function prerenderPaths(): string[] {
  return [...publicPaths(), "/admin/"].map((path) =>
    path === "/" ? path : path.replace(/\/$/, ""),
  );
}

/** Pages that belong in the sitemap: no status page, no admin. */
export function sitemapPages(): string[] {
  return ["/", "/contact", "/privacy", ...PROJECT_SLUGS.map((slug) => `/work/${slug}`)];
}
