import { describe, expect, it } from "vitest";
import { LIMITS, normalizeInquiry, textLength, validateInquiry, type InquiryInput } from "./schema";

const valid: InquiryInput = {
  kind: "project",
  name: "Ana Pop",
  email: "ana@example.com",
  company: "",
  message: "We rent four rooms and want guests to book online.",
  timeline: "month",
  link: "",
  replyLang: "ro",
};

describe("validateInquiry", () => {
  it("accepts a complete inquiry", () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it("asks for the required fields", () => {
    expect(validateInquiry({ ...valid, name: "  ", email: "", message: "" })).toEqual({
      name: "required",
      email: "required",
      message: "required",
    });
  });

  it("checks lengths at the same limits as firestore.rules", () => {
    expect(validateInquiry({ ...valid, message: "x".repeat(LIMITS.message.min - 1) }).message).toBe(
      "tooShort",
    );
    expect(
      validateInquiry({ ...valid, message: "x".repeat(LIMITS.message.min) }).message,
    ).toBeUndefined();
    expect(validateInquiry({ ...valid, message: "x".repeat(LIMITS.message.max + 1) }).message).toBe(
      "tooLong",
    );
    expect(validateInquiry({ ...valid, name: "x".repeat(LIMITS.name.max + 1) }).name).toBe(
      "tooLong",
    );
  });

  it("ignores spaces around the text when counting", () => {
    expect(
      validateInquiry({ ...valid, message: `   ${"x".repeat(LIMITS.message.min - 1)}   ` }).message,
    ).toBe("tooShort");
  });

  it("rejects malformed e-mail addresses", () => {
    for (const email of ["anapop", "anapop@", "ana@example", "ana example@test.com"]) {
      expect(validateInquiry({ ...valid, email }).email).toBe("email");
    }
  });

  it("reports a too-short address as too short, not as malformed", () => {
    expect(validateInquiry({ ...valid, email: "a@b.c" }).email).toBe("tooShort");
  });

  it("checks the job link only for job inquiries", () => {
    expect(validateInquiry({ ...valid, kind: "job", link: "example.com/job" }).link).toBe("link");
    expect(
      validateInquiry({ ...valid, kind: "job", link: "https://example.com/job" }).link,
    ).toBeUndefined();
    expect(validateInquiry({ ...valid, kind: "project", link: "not a link" }).link).toBeUndefined();
  });
});

describe("normalizeInquiry", () => {
  it("trims text and clears fields that do not belong to the kind", () => {
    const result = normalizeInquiry({
      ...valid,
      kind: "other",
      name: "  Ana  ",
      link: "https://x.y",
      timeline: "later",
    });
    expect(result.name).toBe("Ana");
    expect(result.timeline).toBe("none");
    expect(result.link).toBe("");
  });
});

describe("textLength", () => {
  it("counts diacritics once", () => {
    expect(textLength("ș ț ă â î ä ö ü ß")).toBe(17);
  });
});
