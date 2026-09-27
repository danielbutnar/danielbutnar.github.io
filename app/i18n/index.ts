import { useLocation } from "react-router";
import { de } from "./de";
import { en, type Dict } from "./en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { ro } from "./ro";

export const dictionaries: Record<Locale, Dict> = { en, de, ro };

/** The locale of a pathname: "/de/work/ursa/" is German, "/admin/" is English. */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function useLocale(): Locale {
  return localeFromPathname(useLocation().pathname);
}

export function useDict(): Dict {
  return dictionaries[useLocale()];
}

export type { Dict, Locale };
