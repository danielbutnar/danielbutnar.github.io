import { describe, expect, it } from "vitest";
import { localeFromPathname } from ".";
import { localeFromParam, localizePath, stripLocale } from "./locales";

describe("localizePath", () => {
  it("keeps English at the root and prefixes German and Romanian", () => {
    expect(localizePath("en", "/")).toBe("/");
    expect(localizePath("de", "/")).toBe("/de/");
    expect(localizePath("ro", "/work/ursa")).toBe("/ro/work/ursa/");
  });

  it("keeps a hash after the trailing slash", () => {
    expect(localizePath("en", "/#work")).toBe("/#work");
    expect(localizePath("de", "/#services")).toBe("/de/#services");
  });
});

describe("stripLocale", () => {
  it("removes a German or Romanian prefix and trailing slashes", () => {
    expect(stripLocale("/de/work/ursa/")).toBe("/work/ursa");
    expect(stripLocale("/ro/")).toBe("/");
    expect(stripLocale("/contact/")).toBe("/contact");
  });

  it("round-trips with localizePath", () => {
    for (const page of ["/", "/contact", "/work/this-site"]) {
      expect(stripLocale(localizePath("ro", page))).toBe(page);
    }
  });
});

describe("localeFromParam", () => {
  it("accepts no prefix, /de and /ro, and nothing else", () => {
    expect(localeFromParam(undefined)).toBe("en");
    expect(localeFromParam("de")).toBe("de");
    expect(localeFromParam("ro")).toBe("ro");
    expect(localeFromParam("en")).toBeNull();
    expect(localeFromParam("fr")).toBeNull();
  });
});

describe("localeFromPathname", () => {
  it("reads the language from the first segment", () => {
    expect(localeFromPathname("/de/contact/")).toBe("de");
    expect(localeFromPathname("/admin/")).toBe("en");
    expect(localeFromPathname("/")).toBe("en");
  });
});
