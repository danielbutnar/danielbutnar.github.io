import { useEffect, useState } from "react";
import { useDict } from "~/i18n";
import { CASE_SECTIONS, type CaseSectionId } from "~/content/sections";

/** "On this page": a sticky list on wide screens, a disclosure on phones. Marks the section being read. */
export function CaseToc() {
  const t = useDict();
  const [active, setActive] = useState<CaseSectionId>("job");

  useEffect(() => {
    const sections = CASE_SECTIONS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id as CaseSectionId);
      },
      { rootMargin: "0px 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const links = CASE_SECTIONS.map((id) => (
    <a key={id} href={`#${id}`} aria-current={id === active ? "true" : undefined}>
      {t.caseStudy.sections[id]}
    </a>
  ));

  return (
    <nav className="toc" aria-labelledby="toc-title">
      <h2 id="toc-title">{t.caseStudy.onThisPage}</h2>
      {links}
      <details>
        <summary>{t.caseStudy.onThisPage}</summary>
        {CASE_SECTIONS.map((id) => (
          <a key={id} href={`#${id}`}>
            {t.caseStudy.sections[id]}
          </a>
        ))}
      </details>
    </nav>
  );
}
