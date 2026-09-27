import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import type { CaseSectionId } from "~/content/sections";
import { useDict } from "~/i18n";
import { Flow } from "./Flow";
import { Shot } from "./Shot";

/** A case study section. The heading comes from the dictionary, so it always matches the table of contents. */
function Section({ id, children }: { id: CaseSectionId; children: ReactNode }) {
  const t = useDict();
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="display">
        {t.caseStudy.sections[id]}
      </h2>
      {children}
    </section>
  );
}

/** Code excerpts can scroll sideways, so keyboard users must be able to reach them. */
function Pre(props: ComponentProps<"pre">) {
  return <pre tabIndex={0} {...props} />;
}

export const mdxComponents: MDXComponents = {
  Section,
  Shot,
  Flow,
  pre: Pre,
};
