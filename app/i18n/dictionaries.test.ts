import { describe, expect, it } from "vitest";
import { dictionaries } from ".";
import { LOCALES } from "./locales";

/** Every string in a dictionary, with its path, including the output of functions. */
function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (...args: unknown[]) => unknown)("X", 2), `${path}()`);
  if (value instanceof Date) return [];
  if (Array.isArray(value))
    return value.flatMap((item, index) => strings(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      strings(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("dictionaries", () => {
  const english = new Map(strings(dictionaries.en));

  for (const locale of LOCALES) {
    it(`${locale} has every text the English dictionary has, and none empty`, () => {
      const entries = strings(dictionaries[locale]);
      expect(entries.map(([path]) => path).sort()).toEqual([...english.keys()].sort());
      for (const [path, text] of entries) expect(text.trim(), path).not.toBe("");
    });
  }

  it("uses Romanian comma-below letters, not the cedilla look-alikes", () => {
    for (const [path, text] of strings(dictionaries.ro)) expect(text, path).not.toMatch(/[şţŞŢ]/);
  });

  it("keeps German formal: no informal du or dein", () => {
    for (const [path, text] of strings(dictionaries.de))
      expect(text, path).not.toMatch(/\b(du|dich|dir|dein\w*)\b/i);
  });
});
