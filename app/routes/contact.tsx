import { Link } from "react-router";
import { Channels } from "~/components/Channels";
import { InquiryForm } from "~/components/InquiryForm";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { localeFromParam, localizePath } from "~/i18n/locales";
import { seo } from "~/site/seo";
import type { Route } from "./+types/contact";

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  const t = dictionaries[locale];
  return seo({
    locale,
    path: "/contact",
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
  });
}

export default function Contact() {
  const t = useDict();
  const locale = useLocale();
  const c = t.contact;
  return (
    <div className="wrap inquiry">
      <div className="inquiry__aside">
        <h1 className="display display--tight">{c.title}</h1>
        <p>{c.intro}</p>
        <div className="inquiry__direct">
          <h2>{c.orWrite}</h2>
          <Channels />
        </div>
        <p className="fine-print">
          {c.privacy} <Link to={localizePath(locale, "/privacy")}>{c.privacyLink}</Link>
        </p>
      </div>
      <InquiryForm />
    </div>
  );
}
