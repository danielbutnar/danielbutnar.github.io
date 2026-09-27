import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { useDict, useLocale } from "~/i18n";
import { localizePath, stripLocale } from "~/i18n/locales";
import { LanguageSwitch } from "./LanguageSwitch";

export function SiteHeader() {
  const t = useDict();
  const locale = useLocale();
  const { pathname, key } = useLocation();
  const page = stripLocale(pathname);
  const menu = useRef<HTMLDialogElement>(null);

  // Close the menu after any navigation, including links to a section of the same page.
  useEffect(() => {
    menu.current?.close();
  }, [key]);

  const sections = [
    { id: "work", label: t.nav.work, current: page.startsWith("/work/") },
    { id: "services", label: t.nav.services, current: false },
    { id: "hiring", label: t.nav.hiring, current: false },
    { id: "about", label: t.nav.about, current: false },
  ];
  const contactPath = localizePath(locale, "/contact");

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link className="wordmark" to={localizePath(locale, "/")}>
          Daniel Butnar
        </Link>

        <nav className="main-nav" aria-label={t.a11y.mainNav}>
          {sections.map((section) => (
            <Link
              key={section.id}
              to={localizePath(locale, `/#${section.id}`)}
              aria-current={section.current ? "page" : undefined}
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__tools">
          <LanguageSwitch />
          <Link
            className="button button--primary site-header__cta"
            to={contactPath}
            aria-current={page.startsWith("/contact") ? "page" : undefined}
          >
            {t.nav.inquiry}
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-label={t.a11y.menuOpen}
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M2 5h16M2 10h16M2 15h16" />
            </svg>
          </button>
        </div>
      </div>

      <dialog ref={menu} className="menu" aria-label={t.a11y.mainNav}>
        <div className="wrap menu__top">
          <span className="wordmark" aria-hidden="true">
            Daniel Butnar
          </span>
          <button
            type="button"
            className="menu__close"
            aria-label={t.a11y.menuClose}
            onClick={() => menu.current?.close()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m4 4 12 12M16 4 4 16" />
            </svg>
          </button>
        </div>
        <div className="wrap">
          <nav className="menu__nav" aria-label={t.a11y.mainNav}>
            {sections.map((section) => (
              <Link key={section.id} to={localizePath(locale, `/#${section.id}`)}>
                {section.label}
              </Link>
            ))}
          </nav>
          <div className="menu__footer">
            <Link className="button button--primary" to={contactPath}>
              {t.nav.inquiry}
            </Link>
            <LanguageSwitch variant="long" />
          </div>
        </div>
      </dialog>
    </header>
  );
}
