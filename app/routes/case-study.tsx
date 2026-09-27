import { Suspense } from "react";
import { Link, data } from "react-router";
import { CaseToc } from "~/components/CaseToc";
import { mdxComponents } from "~/components/mdx";
import { NotFound } from "~/components/NotFound";
import { Shot } from "~/components/Shot";
import { STATUS_CLASS } from "~/components/WorkTable";
import {
  CaseStudyBody,
  hasCaseStudy,
  loadCaseStudy,
  preloadCaseStudy,
} from "~/content/case-studies";
import { findProject, nextProject, projectName } from "~/content/projects";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { localeFromParam, localizePath } from "~/i18n/locales";
import { seo } from "~/site/seo";
import type { Route } from "./+types/case-study";

// Runs at build time: loads the case study text so the page prerenders in full.
export async function loader({ params }: Route.LoaderArgs) {
  const locale = localeFromParam(params.lang);
  const project = findProject(params.slug);
  if (!locale || !project || !(await loadCaseStudy(project.slug, locale)))
    throw data(null, { status: 404 });
  return null;
}

// On client navigation, fetch the text together with the route data.
export async function clientLoader({ params, serverLoader }: Route.ClientLoaderArgs) {
  const locale = localeFromParam(params.lang);
  const project = findProject(params.slug);
  await Promise.all([
    serverLoader(),
    project && locale ? loadCaseStudy(project.slug, locale) : null,
  ]);
  return null;
}

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  const project = findProject(params.slug);
  const t = dictionaries[locale];
  if (!project) return [{ title: t.meta.notFoundTitle }, { name: "robots", content: "noindex" }];
  return seo({
    locale,
    path: `/work/${project.slug}`,
    title: t.meta.caseTitle(projectName(project, locale)),
    description: project.what[locale],
    type: "article",
  });
}

export default function CaseStudy({ params }: Route.ComponentProps) {
  const t = useDict();
  const locale = useLocale();
  const project = findProject(params.slug);
  if (!project || !hasCaseStudy(project.slug, locale)) return <NotFound />;

  const next = nextProject(project.slug);
  const f = t.caseStudy.facts;

  return (
    <article className="wrap">
      <header className="case-head">
        <Link className="back-link" to={localizePath(locale, "/#work")}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M11 3 5 9l6 6" />
          </svg>
          {t.caseStudy.allWork}
        </Link>
        <h1 className="display display--tight">
          <span className="marker">{projectName(project, locale)}</span>
        </h1>
        <p className="case-head__summary">{project.summary[locale]}</p>
        <dl className="case-facts">
          <div>
            <dt>{f.type}</dt>
            <dd>{t.kinds[project.kind]}</dd>
          </div>
          <div>
            <dt>{f.role}</dt>
            <dd>{project.role[locale]}</dd>
          </div>
          <div>
            <dt>{f.when}</dt>
            <dd>{project.when[locale]}</dd>
          </div>
          <div>
            <dt>{f.stack}</dt>
            <dd>{project.stack.join(", ")}</dd>
          </div>
          <div>
            <dt>{f.status}</dt>
            <dd>
              <span className={STATUS_CLASS[project.status]}>{t.statuses[project.status]}</span>
            </dd>
          </div>
          <div>
            <dt>{f.links}</dt>
            <dd className="case-facts__links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {t.caseStudy.links[link.kind]}
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <Shot className="case-shot" name={project.image} alt={project.imageAlt[locale]} priority />

      <div className="case-body">
        <CaseToc />
        <div className="prose">
          <Suspense fallback={null}>
            <CaseStudyBody slug={project.slug} locale={locale} components={mdxComponents} />
          </Suspense>
        </div>
      </div>

      <Link
        className="next-case"
        to={localizePath(locale, `/work/${next.slug}`)}
        onMouseEnter={() => preloadCaseStudy(next.slug, locale)}
        onFocus={() => preloadCaseStudy(next.slug, locale)}
      >
        <span>{t.caseStudy.nextCase}</span>
        <span className="display display--tight">{projectName(next, locale)}</span>
      </Link>
    </article>
  );
}
