import type { MDXContent } from "mdx/types";
import PrivacyDe from "~/content/privacy/privacy.de.mdx";
import PrivacyEn from "~/content/privacy/privacy.en.mdx";
import PrivacyRo from "~/content/privacy/privacy.ro.mdx";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { localeFromParam, type Locale } from "~/i18n/locales";
import { seo } from "~/site/seo";
import type { Route } from "./+types/privacy";

const BODY: Record<Locale, MDXContent> = { en: PrivacyEn, de: PrivacyDe, ro: PrivacyRo };

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  const t = dictionaries[locale];
  return seo({
    locale,
    path: "/privacy",
    title: t.meta.privacyTitle,
    description: t.meta.privacyDescription,
  });
}

export default function Privacy() {
  const t = useDict();
  const Body = BODY[useLocale()];
  return (
    <article className="wrap text-page">
      <h1 className="display display--tight">{t.meta.privacyTitle}</h1>
      <div className="prose">
        <Body />
      </div>
    </article>
  );
}
