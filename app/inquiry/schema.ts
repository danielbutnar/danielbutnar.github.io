import { LOCALES, type Locale } from "~/i18n/locales";

// These limits are enforced twice: here, so people see a clear message as they
// type, and in firestore.rules, which is the check that counts. The rules
// tests import this file, so the two cannot drift apart silently.

export const INQUIRY_KINDS = ["project", "job", "other"] as const;
export type InquiryKind = (typeof INQUIRY_KINDS)[number];

export const TIMELINES = ["none", "month", "quarter", "later"] as const;
export type Timeline = (typeof TIMELINES)[number];

export const INQUIRY_STATUSES = ["new", "read", "answered", "archived"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const LIMITS = {
  name: { min: 1, max: 100 },
  email: { min: 6, max: 200 },
  company: { min: 0, max: 200 },
  message: { min: 20, max: 2000 },
  link: { min: 0, max: 500 },
} as const;

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const LINK_PATTERN = /^https?:\/\/\S+$/;

export const RATE_LIMIT_SECONDS = 60;
export const RETENTION_DAYS = 365;

export interface InquiryInput {
  kind: InquiryKind;
  name: string;
  email: string;
  company: string;
  message: string;
  timeline: Timeline;
  link: string;
  replyLang: Locale;
}

export type TextField = keyof typeof LIMITS;
export type FieldError = "required" | "tooShort" | "tooLong" | "email" | "link";
export type InquiryErrors = Partial<Record<TextField, FieldError>>;

/** Counts characters the way people do, so "ș" and "😀" each count once. */
export function textLength(value: string): number {
  return [...value].length;
}

/** Trims text and clears the fields that do not belong to the chosen kind. */
export function normalizeInquiry(input: InquiryInput): InquiryInput {
  return {
    kind: input.kind,
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    message: input.message.trim(),
    timeline: input.kind === "project" ? input.timeline : "none",
    link: input.kind === "job" ? input.link.trim() : "",
    replyLang: input.replyLang,
  };
}

export function validateInquiry(raw: InquiryInput): InquiryErrors {
  const input = normalizeInquiry(raw);
  const errors: InquiryErrors = {};

  for (const field of Object.keys(LIMITS) as TextField[]) {
    const { min, max } = LIMITS[field];
    const length = textLength(input[field]);
    if (length === 0 && min > 0) errors[field] = "required";
    else if (length > 0 && length < min) errors[field] = "tooShort";
    else if (length > max) errors[field] = "tooLong";
  }

  if (!errors.email && !EMAIL_PATTERN.test(input.email)) errors.email = "email";
  if (!errors.link && input.link !== "" && !LINK_PATTERN.test(input.link)) errors.link = "link";

  return errors;
}

export function isInquiryKind(value: unknown): value is InquiryKind {
  return typeof value === "string" && (INQUIRY_KINDS as readonly string[]).includes(value);
}

export function isTimeline(value: unknown): value is Timeline {
  return typeof value === "string" && (TIMELINES as readonly string[]).includes(value);
}

export const REPLY_LANGS = LOCALES;
