import type { ReactNode } from "react";
import { Link } from "react-router";
import { useDict, useLocale } from "~/i18n";
import { localizePath } from "~/i18n/locales";
import { CONTACT } from "~/site/contact";
import { LanguageSwitch } from "./LanguageSwitch";
import { SiteHeader } from "./SiteHeader";

export function SiteShell({ children }: { children: ReactNode }) {
  const t = useDict();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

function SiteFooter() {
  const t = useDict();
  const locale = useLocale();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p>
          {t.footer.copyright} {t.footer.builtWith}
        </p>
        <nav aria-label={t.a11y.footerNav}>
          <Link to={localizePath(locale, "/privacy")}>{t.footer.privacy}</Link>
          <a href={CONTACT.repo}>{t.footer.code}</a>
          <LanguageSwitch variant="long" />
        </nav>
      </div>
    </footer>
  );
}
