import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CASE_SECTIONS } from "./sections";
import { LOCALES } from "~/i18n/locales";
import { prerenderPaths, publicPaths } from "~/site/paths";
import { projects } from "./projects";

const dir = "app/content/case-studies";

describe("case studies", () => {
  for (const project of projects) {
    for (const locale of LOCALES) {
      const file = `${dir}/${project.slug}.${locale}.mdx`;

      it(`${project.slug} exists in ${locale} with every section in order`, () => {
        expect(existsSync(file), file).toBe(true);
        const text = readFileSync(file, "utf8");
        const ids = [...text.matchAll(/<Section id="([a-z]+)">/g)].map((match) => match[1]);
        expect(ids).toEqual([...CASE_SECTIONS]);
        expect(text).not.toMatch(/\bXX\b/);
      });

      it(`${project.slug} (${locale}) only shows screenshots that exist`, () => {
        const text = readFileSync(file, "utf8");
        for (const [, name] of text.matchAll(/<Shot name="([^"]+)"/g)) {
          expect(existsSync(`app/assets/work/${name}.webp`), name).toBe(true);
        }
      });
    }

    it(`${project.slug} has its main screenshot and text in every language`, () => {
      expect(existsSync(`app/assets/work/${project.image}.webp`), project.image).toBe(true);
      for (const locale of LOCALES) {
        expect(project.what[locale]).not.toBe("");
        expect(project.summary[locale]).not.toBe("");
        expect(project.imageAlt[locale]).not.toBe("");
      }
    });
  }

  it("has no stray files for projects that do not exist", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    for (const file of readdirSync(dir).filter((name) => name.endsWith(".mdx"))) {
      expect(slugs.has(file.split(".")[0]!), file).toBe(true);
    }
  });
});

describe("prerendered paths", () => {
  it("covers every page in every language, plus /admin", () => {
    const pages = 4 + projects.length;
    expect(publicPaths()).toHaveLength(pages * LOCALES.length);
    expect(prerenderPaths()).toContain("/admin");
    expect(prerenderPaths()).toContain("/de/work/ursa");
    expect(new Set(prerenderPaths()).size).toBe(prerenderPaths().length);
  });
});
