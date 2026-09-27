import { Link } from "react-router";
import { Channels } from "~/components/Channels";
import { Shot } from "~/components/Shot";
import { WorkTable } from "~/components/WorkTable";
import { findProject, projectName } from "~/content/projects";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { SITE_ORIGIN, localeFromParam, localizePath } from "~/i18n/locales";
import { CONTACT } from "~/site/contact";
import { seo } from "~/site/seo";
import photo from "~/assets/daniel.jpg";
import type { Route } from "./+types/home";

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  const t = dictionaries[locale];
  return [
    ...seo({ locale, path: "/", title: t.meta.homeTitle, description: t.meta.homeDescription }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Daniel Butnar",
        url: SITE_ORIGIN + "/",
        email: `mailto:${CONTACT.email}`,
        jobTitle: "React and TypeScript developer",
        address: { "@type": "PostalAddress", addressLocality: "Brașov", addressCountry: "RO" },
        knowsLanguage: ["en", "de", "ro"],
        sameAs: [CONTACT.github, CONTACT.linkedin, CONTACT.contra].filter(Boolean),
      },
    },
  ];
}

// Which case studies prove each service.
const SERVICE_PROOF = {
  booking: ["brasov-private-tours", "serpentina-transfers", "rope-street-tattoo"],
  firebase: ["this-site"],
  accessibility: ["accessibility-study"],
  languages: ["serpentina-transfers", "rope-street-tattoo", "this-site"],
} as const;

export default function Home() {
  const t = useDict();
  const locale = useLocale();
  const h = t.home;
  const workPath = (slug: string) => localizePath(locale, `/work/${slug}`);

  return (
    <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="display display--tight">
          {h.h1}
        </h1>
        <div className="hero__row">
          <p className="hero__intro">{h.intro}</p>
          <div className="hero__open">
            <h2>{h.openTo}</h2>
            <ul>
              <li>
                <a href="#hiring">{h.openToRole}</a>
              </li>
              <li>
                <a href="#services">{h.openToProjects}</a>
              </li>
            </ul>
          </div>
          <div className="hero__actions">
            <a className="button button--primary" href="#work">
              {h.seeWork}
            </a>
            <Link className="button button--outline" to={localizePath(locale, "/contact")}>
              {t.nav.inquiry}
            </Link>
          </div>
        </div>
      </section>

      <section id="work" className="wrap work" aria-labelledby="work-title">
        <div className="section-head">
          <h2 id="work-title" className="display">
            {h.workTitle}
          </h2>
          <p>{h.workNote}</p>
        </div>
        <WorkTable />
      </section>

      <section className="wrap teaser" aria-labelledby="teaser-title">
        <div className="teaser__text">
          <h2 id="teaser-title" className="display">
            {h.teaser.title}
          </h2>
          <p>{h.teaser.text}</p>
          <dl className="facts">
            {h.teaser.facts.map(([term, detail]) => (
              <div key={term} className="dl-row">
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <Link className="teaser__link" to={workPath("brasov-private-tours")}>
            {h.teaser.link}
          </Link>
        </div>
        <Shot
          className="teaser__figure"
          name="brasov-private-tours-desktop"
          alt={findProject("brasov-private-tours")!.imageAlt[locale]}
          caption={h.teaser.caption}
        />
      </section>

      <section id="services" className="wrap services" aria-labelledby="services-title">
        <div className="section-head">
          <h2 id="services-title" className="display">
            {h.services.title}
          </h2>
          <p>{h.services.note}</p>
        </div>
        {(Object.keys(SERVICE_PROOF) as (keyof typeof SERVICE_PROOF)[]).map((id) => (
          <div key={id} className="services__item">
            <h3 className="display">{h.services.items[id].title}</h3>
            <p>{h.services.items[id].text}</p>
            <p className="services__seen">
              {h.services.seenIn}{" "}
              {SERVICE_PROOF[id].map((slug, index) => (
                <span key={slug}>
                  {index > 0 ? ", " : null}
                  <Link to={workPath(slug)}>{projectName(findProject(slug)!, locale)}</Link>
                </span>
              ))}
            </p>
          </div>
        ))}
      </section>

      <section className="wrap process" aria-labelledby="process-title">
        <div className="section-head">
          <h2 id="process-title" className="display">
            {h.process.title}
          </h2>
        </div>
        <ol>
          {h.process.steps.map((step, index) => (
            <li key={step.title}>
              <span className="process__number display display--tight" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="hiring" className="band-ink" aria-labelledby="hiring-title">
        <div className="wrap hiring">
          <div className="hiring__text">
            <h2 id="hiring-title" className="display">
              {h.hiring.title}
            </h2>
            <p>{h.hiring.text}</p>
            <p>{h.hiring.ai}</p>
            <div className="hiring__actions">
              <Link className="button button--marker" to={workPath("this-site")}>
                {h.hiring.caseCta}
              </Link>
              <a className="button button--light" href={CONTACT.repo}>
                {h.hiring.codeCta}
              </a>
            </div>
          </div>
          <dl className="stack-list">
            {h.hiring.stack.map(([term, detail]) => (
              <div key={term} className="dl-row">
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="about" className="wrap about" aria-labelledby="about-title">
        <figure className="about__photo">
          <img
            src={photo}
            alt={h.about.photoAlt}
            width={320}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="about__text">
          <h2 id="about-title" className="display">
            {h.about.title}
          </h2>
          <p>{h.about.p1}</p>
          <p>{h.about.p2}</p>
        </div>
      </section>

      <div className="wrap">
        <section id="contact" className="band-marker contact-band" aria-labelledby="contact-title">
          <div className="contact-band__text">
            <h2 id="contact-title" className="display display--tight">
              {h.contact.title}
            </h2>
            <p>{h.contact.text}</p>
            <Link className="button button--ink" to={localizePath(locale, "/contact")}>
              {h.contact.cta}
            </Link>
          </div>
          <Channels />
        </section>
      </div>
    </>
  );
}
