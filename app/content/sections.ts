/** The sections every case study has, in order. content.test.ts checks each MDX file against this list. */
export const CASE_SECTIONS = ["job", "built", "hard", "results", "next"] as const;
export type CaseSectionId = (typeof CASE_SECTIONS)[number];
