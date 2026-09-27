import { NotFound } from "~/components/NotFound";
import { dictionaries } from "~/i18n";
import { localeFromParam } from "~/i18n/locales";
import type { Route } from "./+types/not-found";

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  return [
    { title: dictionaries[locale].meta.notFoundTitle },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFoundRoute() {
  return <NotFound />;
}
