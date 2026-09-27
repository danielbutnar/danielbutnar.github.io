import { Outlet } from "react-router";
import { NotFound } from "~/components/NotFound";
import { SiteShell } from "~/components/SiteShell";
import { localeFromParam } from "~/i18n/locales";
import type { Route } from "./+types/locale-layout";

// Every public page sits under this layout. "/xx/..." with an unknown
// language (and "/en/...", since English has no prefix) is a 404.
export default function LocaleLayout({ params }: Route.ComponentProps) {
  if (localeFromParam(params.lang) === null) {
    return (
      <SiteShell>
        <title>Page not found</title>
        <NotFound />
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}
