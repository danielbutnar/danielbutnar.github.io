import { useEffect, useState } from "react";
import { CASE_SECTIONS, type CaseSectionId } from "~/content/sections";
import { useDict } from "~/i18n";

/** "On this page": a sticky list on wide screens, a disclosure on phones. Marks the section being read. */
export function CaseToc() {
  const t = useDict();
  const [active, setActive] = useState<CaseSectionId>("job");

  useEffect(() => {
    // The section being read is the last one whose heading has passed 40 % of the viewport.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: CaseSectionId = CASE_SECTIONS[0];
      for (const id of CASE_SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, the last section counts even if its heading never reached the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = CASE_SECTIONS[CASE_SECTIONS.length - 1]!;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="toc" aria-labelledby="toc-title">
      <h2 id="toc-title">{t.caseStudy.onThisPage}</h2>
      {CASE_SECTIONS.map((id) => (
        <a key={id} href={`#${id}`} aria-current={id === active ? "true" : undefined}>
          {t.caseStudy.sections[id]}
        </a>
      ))}
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
