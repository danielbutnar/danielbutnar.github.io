import type { MDXComponents, MDXContent } from "mdx/types";
import { createElement, lazy, type LazyExoticComponent } from "react";
import { DEFAULT_LOCALE, type Locale } from "~/i18n/locales";

// Each case study is one MDX file per language: <slug>.<locale>.mdx.
// They load on demand, so a case study page ships only its own text.
//
// The route's loaders call loadCaseStudy() first, so the body is usually
// ready before render: at build time that keeps the prerendered HTML complete
// (no Suspense placeholders), and on client navigation it avoids an empty flash.
// While a prerendered page hydrates, the body may still be loading; it then
// suspends and React keeps the server HTML until the chunk arrives.

type Module = { default: MDXContent };
const loaders = import.meta.glob<Module>("./*.mdx");
const loaded = new Map<string, MDXContent>();
const lazies = new Map<string, LazyExoticComponent<MDXContent>>();

function keyFor(slug: string, locale: Locale): string | null {
  if (loaders[`./${slug}.${locale}.mdx`]) return `./${slug}.${locale}.mdx`;
  if (loaders[`./${slug}.${DEFAULT_LOCALE}.mdx`]) return `./${slug}.${DEFAULT_LOCALE}.mdx`;
  return null;
}

export function hasCaseStudy(slug: string, locale: Locale): boolean {
  return keyFor(slug, locale) !== null;
}

export async function loadCaseStudy(slug: string, locale: Locale): Promise<boolean> {
  const key = keyFor(slug, locale);
  if (!key) return false;
  if (!loaded.has(key)) loaded.set(key, (await loaders[key]!()).default);
  return true;
}

/** Starts loading a case study's text, e.g. when a link to it is hovered. */
export function preloadCaseStudy(slug: string, locale: Locale): void {
  void loadCaseStudy(slug, locale);
}

export function CaseStudyBody({
  slug,
  locale,
  components,
}: {
  slug: string;
  locale: Locale;
  components: MDXComponents;
}) {
  const key = keyFor(slug, locale);
  if (!key) return null;
  const ready = loaded.get(key);
  if (ready) return createElement(ready, { components });
  let pending = lazies.get(key);
  if (!pending) {
    pending = lazy(loaders[key]!);
    lazies.set(key, pending);
  }
  return createElement(pending, { components });
}
