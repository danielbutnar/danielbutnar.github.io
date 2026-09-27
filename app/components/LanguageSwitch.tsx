import { Link, useLocation } from "react-router";
import { PROJECT_SLUGS } from "~/content/projects";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { LOCALES, localizePath, stripLocale } from "~/i18n/locales";
import { PUBLIC_PAGES } from "~/site/paths";

const KNOWN_PAGES = new Set<string>([
  ...PUBLIC_PAGES,
  ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
]);

/**
 * Links to the same page in the other languages, keeping query and hash.
 * The header's copy is a navigation landmark; the footer's and the menu's sit inside other navigation.
 */
export function LanguageSwitch({ variant = "short" }: { variant?: "short" | "long" }) {
  const t = useDict();
  const current = useLocale();
  const { pathname, search, hash } = useLocation();
  const page = stripLocale(pathname);
  const known = KNOWN_PAGES.has(page);

  const links = LOCALES.map((locale) => (
    <Link
      key={locale}
      to={known ? localizePath(locale, page) + search + hash : localizePath(locale, "/")}
      lang={locale}
      hrefLang={locale}
      aria-current={locale === current ? "true" : undefined}
      aria-label={variant === "short" ? dictionaries[locale].langName : undefined}
      preventScrollReset={known}
    >
      {variant === "short" ? locale.toUpperCase() : dictionaries[locale].langName}
    </Link>
  ));

  return variant === "short" ? (
    <nav className="lang-switch" aria-label={t.a11y.language}>
      {links}
    </nav>
  ) : (
    <div className="lang-switch" role="group" aria-label={t.a11y.language}>
      {links}
    </div>
  );
}
