import type { MetaDescriptor } from "react-router";
import { dictionaries } from "~/i18n";
import { LOCALES, OG_LOCALE, SITE_ORIGIN, localizePath, type Locale } from "~/i18n/locales";

interface SeoInput {
  locale: Locale;
  /** Path without locale and without trailing slash, e.g. "/work/ursa". */
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  type?: "website" | "article";
}

/** Title, description, canonical, hreflang alternates and Open Graph tags. */
export function seo({
  locale,
  path,
  title: rawTitle,
  description,
  noindex,
  type = "website",
}: SeoInput): MetaDescriptor[] {
  const url = SITE_ORIGIN + localizePath(locale, path);
  // Headlines carry soft hyphens for narrow screens; titles and previews do not need them.
  const title = rawTitle.replace(/\u00AD/g, "");
  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: dictionaries[locale].meta.siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:locale", content: OG_LOCALE[locale] },
    { property: "og:image", content: `${SITE_ORIGIN}/og.png` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
  ];

  if (noindex) {
    tags.push({ name: "robots", content: "noindex" });
    return tags;
  }

  for (const alternate of LOCALES) {
    tags.push({
      tagName: "link",
      rel: "alternate",
      hrefLang: alternate,
      href: SITE_ORIGIN + localizePath(alternate, path),
    });
  }
  tags.push({
    tagName: "link",
    rel: "alternate",
    hrefLang: "x-default",
    href: SITE_ORIGIN + localizePath("en", path),
  });
  return tags;
}
