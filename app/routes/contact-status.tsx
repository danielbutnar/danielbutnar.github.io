import { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useSearchParams } from "react-router";
import { isFirebaseConfigured } from "~/firebase/config";
import { dictionaries, useDict, useLocale } from "~/i18n";
import { localeFromParam, localizePath } from "~/i18n/locales";
import type { StoredInquiry, WatchState } from "~/inquiry/watch";
import { seo } from "~/site/seo";
import type { Route } from "./+types/contact-status";

export function meta({ params }: Route.MetaArgs) {
  const locale = localeFromParam(params.lang) ?? "en";
  const t = dictionaries[locale];
  return seo({
    locale,
    path: "/contact/status",
    title: t.meta.statusTitle,
    description: t.meta.contactDescription,
    noindex: true,
  });
}

type ViewState = WatchState | { state: "missing" };

const noSubscription = () => () => {};

export default function ContactStatus() {
  const t = useDict();
  const s = t.status;
  const locale = useLocale();
  const [params] = useSearchParams();
  // The prerendered HTML has no ?id, so the first client render must not read it either.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const id = hydrated ? params.get("id") : null;
  const canWatch = Boolean(id) && isFirebaseConfigured();
  const [watched, setWatched] = useState<WatchState>({ state: "loading" });

  useEffect(() => {
    if (!id || !canWatch) return;
    let stop = () => {};
    let cancelled = false;
    import("~/inquiry/watch").then(({ watchInquiry }) => {
      if (!cancelled) stop = watchInquiry(id, setWatched);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [id, canWatch]);

  const view: ViewState = !hydrated
    ? { state: "loading" }
    : !id
      ? { state: "missing" }
      : !canWatch
        ? { state: "unavailable" }
        : watched;
  const inquiry = view.state === "ready" ? view.inquiry : null;

  return (
    <div className="wrap sent">
      <div className="sent__main">
        <h1 className="display display--tight">{s.title}</h1>
        <p>{s.intro}</p>

        <div aria-live="polite">
          {view.state === "loading" ? <p>{s.loading}</p> : null}
          {view.state === "missing" ? <Notice text={s.missing} /> : null}
          {view.state === "denied" ? <Notice text={s.denied} /> : null}
          {view.state === "unavailable" ? <Notice text={s.unavailable} /> : null}
          {inquiry ? <Steps inquiry={inquiry} /> : null}
        </div>

        <div className="sent__actions">
          <Link className="button button--outline" to={localizePath(locale, "/#work")}>
            {s.back}
          </Link>
          <Link className="sent__link" to={localizePath(locale, "/contact")}>
            {s.another}
          </Link>
        </div>
      </div>

      {inquiry ? <SentCopy inquiry={inquiry} /> : null}
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="notice notice--info">
      <p>{text}</p>
    </div>
  );
}

function Steps({ inquiry }: { inquiry: StoredInquiry }) {
  const s = useDict().status;
  const read =
    inquiry.status === "read" || inquiry.status === "answered" || inquiry.readAt !== undefined;
  const answered = inquiry.status === "answered" || inquiry.answeredAt !== undefined;
  const time = (value: StoredInquiry["createdAt"] | undefined) =>
    value ? s.time(value.toDate()) : "";

  const steps = [
    { title: s.received, detail: s.receivedDetail, done: true, time: time(inquiry.createdAt) },
    {
      title: s.read,
      detail: read ? s.readDetail : s.readWaiting,
      done: read,
      time: time(inquiry.readAt),
    },
    {
      title: s.answered,
      detail: answered ? s.answeredDetail : s.answeredWaiting,
      done: answered,
      time: time(inquiry.answeredAt),
    },
  ];
  const current = steps.findIndex((step) => !step.done);

  return (
    <ol className="steps" aria-label={s.stepsLabel}>
      {steps.map((step, index) => (
        <li key={step.title} aria-current={index === current ? "step" : undefined}>
          <span
            className={
              step.done
                ? "steps__icon steps__icon--done"
                : index === current
                  ? "steps__icon steps__icon--current"
                  : "steps__icon"
            }
            aria-hidden="true"
          >
            {step.done ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m4 10.5 4 4 8-9" />
              </svg>
            ) : null}
          </span>
          <span>
            <strong>{step.title}</strong>
            <span className="steps__detail">{step.detail}</span>
          </span>
          <span className="steps__time">
            {step.done ? step.time : index === current ? s.waiting : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SentCopy({ inquiry }: { inquiry: StoredInquiry }) {
  const t = useDict();
  const s = t.status;
  const rows: [string, string][] = [
    [s.copy.kind, t.contact.kinds[inquiry.kind]],
    [s.copy.name, inquiry.name],
    [s.copy.email, inquiry.email],
  ];
  if (inquiry.company) rows.push([s.copy.company, inquiry.company]);
  if (inquiry.kind === "project")
    rows.push([s.copy.timeline, t.contact.timelines[inquiry.timeline]]);
  if (inquiry.link) rows.push([s.copy.link, inquiry.link]);
  rows.push([s.copy.replyLang, dictionaries[inquiry.replyLang].langName]);
  rows.push([s.copy.message, inquiry.message]);

  return (
    <section className="sent__copy" aria-labelledby="sent-copy-title">
      <h2 id="sent-copy-title">{s.copyTitle}</h2>
      <dl>
        {rows.map(([term, detail]) => (
          <div key={term} className="dl-row">
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
