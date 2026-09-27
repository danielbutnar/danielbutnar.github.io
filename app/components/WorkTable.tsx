import { Link } from "react-router";
import { preloadCaseStudy } from "~/content/case-studies";
import { projectName, projects, type ProjectStatus } from "~/content/projects";
import { useDict, useLocale } from "~/i18n";
import { localizePath } from "~/i18n/locales";

export const STATUS_CLASS: Record<ProjectStatus, string> = {
  live: "status status--live",
  liveDemo: "status status--live",
  published: "status status--live",
  prelaunch: "status status--prelaunch",
  concept: "status status--concept",
};

/**
 * The work list. On wide screens it lines up like a timetable, with the column
 * names drawn once above it; each row still labels its own cells for screen readers.
 */
export function WorkTable() {
  const t = useDict();
  const locale = useLocale();
  const cols = t.home.cols;

  return (
    <div className="work__table">
      <div className="work__cols" aria-hidden="true">
        <span>{cols.project}</span>
        <span>{cols.what}</span>
        <span>{cols.stack}</span>
        <span>{cols.status}</span>
        <span>{cols.caseStudy}</span>
      </div>
      <ol className="work__list">
        {projects.map((project, index) => {
          const preload = () => preloadCaseStudy(project.slug, locale);
          return (
            <li
              key={project.slug}
              className={index === 0 ? "work__row work__row--flagship" : "work__row"}
            >
              <div className="work__title">
                <h3 className="work__name display">
                  <Link
                    to={localizePath(locale, `/work/${project.slug}`)}
                    onMouseEnter={preload}
                    onFocus={preload}
                    onTouchStart={preload}
                  >
                    {projectName(project, locale)}
                  </Link>
                </h3>
                <p className="work__kind">{t.kinds[project.kind]}</p>
              </div>
              <p className="work__what">{project.what[locale]}</p>
              <p className="work__stack">
                <span className="visually-hidden">{t.home.builtWith}: </span>
                {project.stack.slice(0, 4).join(", ")}
              </p>
              <p className="work__status">
                <span className="visually-hidden">{t.home.status}: </span>
                <span className={STATUS_CLASS[project.status]}>{t.statuses[project.status]}</span>
              </p>
              <span className="work__read" aria-hidden="true">
                {t.home.read}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
