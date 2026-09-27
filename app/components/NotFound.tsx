import { Link } from "react-router";
import { useDict, useLocale } from "~/i18n";
import { localizePath } from "~/i18n/locales";

export function NotFound() {
  const t = useDict();
  const locale = useLocale();
  return (
    <div className="wrap not-found">
      <h1 className="display display--tight">{t.notFound.title}</h1>
      <p>{t.notFound.text}</p>
      <div className="not-found__links">
        <Link className="button button--primary" to={localizePath(locale, "/")}>
          {t.notFound.home}
        </Link>
        <Link className="button button--outline" to={localizePath(locale, "/#work")}>
          {t.notFound.work}
        </Link>
      </div>
    </div>
  );
}
