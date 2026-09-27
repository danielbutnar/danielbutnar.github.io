export const LOCALES = ["en", "de", "ro"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_ORIGIN = "https://danielbutnar.github.io";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * English lives at the root, German under /de and Romanian under /ro.
 * Returns null for anything else, including an explicit /en prefix.
 */
export function localeFromParam(param: string | undefined): Locale | null {
  if (param === undefined) return DEFAULT_LOCALE;
  if (param === DEFAULT_LOCALE) return null;
  return isLocale(param) ? param : null;
}

/**
 * Builds a site path for a locale. `path` is written without the locale and
 * without a trailing slash ("/", "/work/ursa"). The result ends in a slash,
 * which is the form GitHub Pages serves without a redirect.
 */
export function localizePath(locale: Locale, path: string): string {
  const [pathname = "", hash] = path.split("#");
  const clean = pathname.replace(/\/+$/, "");
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const full = `${prefix}${clean}/`;
  return hash ? `${full}#${hash}` : full;
}

/** Removes the locale prefix: "/de/work/ursa/" becomes "/work/ursa". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0]) && parts[0] !== DEFAULT_LOCALE) parts.shift();
  return parts.length ? `/${parts.join("/")}` : "/";
}

export const HTML_LANG: Record<Locale, string> = { en: "en", de: "de", ro: "ro" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_GB", de: "de_DE", ro: "ro_RO" };
