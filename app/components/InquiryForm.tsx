import { useRef, useState, type ReactNode, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { isFirebaseConfigured } from "~/firebase/config";
import { useDict, useLocale } from "~/i18n";
import { LOCALES, localizePath, type Locale } from "~/i18n/locales";
import {
  INQUIRY_KINDS,
  LIMITS,
  TIMELINES,
  isInquiryKind,
  textLength,
  validateInquiry,
  type InquiryErrors,
  type InquiryInput,
  type TextField,
} from "~/inquiry/schema";
import type { SendFailure } from "~/inquiry/submit";
import { dictionaries } from "~/i18n";
import { CONTACT } from "~/site/contact";

type Touched = Partial<Record<TextField, boolean>>;

const ERROR_ORDER: TextField[] = ["name", "email", "company", "message", "link"];

export function InquiryForm() {
  const t = useDict();
  const c = t.contact;
  const locale = useLocale();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [values, setValues] = useState<InquiryInput>(() => ({
    kind: isInquiryKind(params.get("kind"))
      ? (params.get("kind") as InquiryInput["kind"])
      : "project",
    name: "",
    email: "",
    company: "",
    message: "",
    timeline: "none",
    link: "",
    replyLang: locale,
  }));
  const [touched, setTouched] = useState<Touched>({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const failureRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const errors = validateInquiry(values);
  const shown: InquiryErrors = {};
  for (const field of ERROR_ORDER) {
    if (errors[field] && (attempted || touched[field])) shown[field] = errors[field];
  }
  const summary = attempted ? ERROR_ORDER.filter((field) => errors[field]) : [];

  function update<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setFailure(null);
  }

  function errorText(field: TextField): string | undefined {
    const error = shown[field];
    if (!error) return undefined;
    const messages = c.errors[field] as Record<string, string>;
    return messages[error];
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setAttempted(true);
    setFailure(null);

    if (ERROR_ORDER.some((field) => errors[field])) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    // Bots fill every field. People never see this one.
    if (honeypotRef.current?.value) {
      navigate(localizePath(locale, "/contact/status"));
      return;
    }

    if (!isFirebaseConfigured()) {
      setFailure("unavailable");
      requestAnimationFrame(() => failureRef.current?.focus());
      return;
    }

    setSending(true);
    try {
      const { sendInquiry } = await import("~/inquiry/submit");
      const id = await sendInquiry(values);
      navigate(`${localizePath(locale, "/contact/status")}?id=${encodeURIComponent(id)}`);
    } catch (error) {
      const reason = (error as { reason?: SendFailure }).reason ?? "unavailable";
      setFailure(reason);
      setSending(false);
      requestAnimationFrame(() => failureRef.current?.focus());
    }
  }

  const describedBy = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined;
  const messageLength = textLength(values.message);

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-busy={sending}>
      {summary.length > 0 ? (
        <div
          className="error-summary"
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
        >
          <h2 id="error-summary-title">{c.errorsTitle(summary.length)}</h2>
          <ul>
            {summary.map((field) => (
              <li key={field}>
                <a href={`#${field}`}>
                  {c.fieldNames[field]}:{" "}
                  {(c.errors[field] as Record<string, string>)[errors[field]!]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {failure ? (
        <div
          className="notice"
          ref={failureRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="send-error-title"
        >
          <h2 id="send-error-title">{c.sendError.title}</h2>
          <p>
            {c.sendError[failure]}
            {failure !== "rateLimited" ? (
              <>
                {" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <fieldset>
        <legend>{c.kindLegend}</legend>
        <div className="choice-list">
          {INQUIRY_KINDS.map((kind) => (
            <label key={kind} className="choice">
              <input
                type="radio"
                name="kind"
                value={kind}
                checked={values.kind === kind}
                onChange={() => update("kind", kind)}
              />
              {c.kinds[kind]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field-row">
        <Field id="name" label={c.name} error={errorText("name")}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max + 20}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, name: true }))}
            aria-invalid={shown.name ? true : undefined}
            aria-describedby={describedBy(shown.name && "name-error")}
            required
          />
        </Field>
        <Field id="email" label={c.email} error={errorText("email")}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            aria-invalid={shown.email ? true : undefined}
            aria-describedby={describedBy(shown.email && "email-error")}
            required
          />
        </Field>
      </div>

      <Field
        id="company"
        label={c.company[values.kind]}
        optional={c.optional}
        error={errorText("company")}
      >
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, company: true }))}
          aria-invalid={shown.company ? true : undefined}
          aria-describedby={describedBy(shown.company && "company-error")}
        />
      </Field>

      <Field
        id="message"
        label={c.message[values.kind]}
        hint={c.messageHint[values.kind]}
        error={errorText("message")}
      >
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, message: true }))}
          aria-invalid={shown.message ? true : undefined}
          aria-describedby={describedBy(
            "message-hint",
            shown.message && "message-error",
            "message-count",
          )}
          required
        />
        <p
          id="message-count"
          className={
            messageLength > LIMITS.message.max ? "field__count field__count--over" : "field__count"
          }
        >
          {c.count(messageLength, LIMITS.message.max)}
        </p>
      </Field>

      <div className="field-row">
        {values.kind === "project" ? (
          <Field id="timeline" label={c.timeline}>
            <select
              id="timeline"
              name="timeline"
              value={values.timeline}
              onChange={(event) =>
                update("timeline", event.target.value as InquiryInput["timeline"])
              }
            >
              {TIMELINES.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {c.timelines[timeline]}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        {values.kind === "job" ? (
          <Field id="link" label={c.link} optional={c.optional} error={errorText("link")}>
            <input
              id="link"
              name="link"
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="https://"
              value={values.link}
              onChange={(event) => update("link", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, link: true }))}
              aria-invalid={shown.link ? true : undefined}
              aria-describedby={describedBy(shown.link && "link-error")}
            />
          </Field>
        ) : null}
        <fieldset>
          <legend>{c.replyLegend}</legend>
          <div className="segmented">
            {LOCALES.map((lang: Locale) => (
              <label key={lang} lang={lang}>
                <input
                  type="radio"
                  name="replyLang"
                  value={lang}
                  checked={values.replyLang === lang}
                  onChange={() => update("replyLang", lang)}
                />
                {dictionaries[lang].langName}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">{c.honeypot}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      <div className="form__submit">
        <button type="submit" className="button button--primary" disabled={sending}>
          {sending ? c.sending : c.submit}
        </button>
        <p>{c.submitHint}</p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  optional?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, optional, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional ? <span className="optional"> {optional}</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="7.5" />
            <path d="M9 5v5M9 12.5v.5" />
          </svg>
          {error}
        </p>
      ) : null}
      {children}
    </div>
  );
}
