import {
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { getFirebase } from "~/firebase/client";
import { isFirebaseConfigured } from "~/firebase/config";
import { OWNER_EMAIL } from "~/firebase/owner";
import { dictionaries } from "~/i18n";
import type { InquiryStatus } from "~/inquiry/schema";
import type { StoredInquiry } from "~/inquiry/watch";

// The owner's inbox. English only, not linked from the site, noindex.
// firestore.rules decide who may read; this page only hides what they would refuse anyway.

export function meta() {
  return [{ title: "Inbox" }, { name: "robots", content: "noindex" }];
}

type AuthState = { state: "loading" } | { state: "signedOut" } | { state: "signedIn"; user: User };

export default function Admin() {
  const configured = isFirebaseConfigured();
  const [authState, setAuth] = useState<AuthState>({ state: "loading" });
  const [error, setError] = useState<string | null>(null);
  const auth: AuthState = configured ? authState : { state: "signedOut" };

  useEffect(() => {
    if (!configured) return;
    return onAuthStateChanged(getFirebase().auth, (user) =>
      setAuth(user && !user.isAnonymous ? { state: "signedIn", user } : { state: "signedOut" }),
    );
  }, [configured]);

  async function signIn() {
    setError(null);
    try {
      await signInWithPopup(
        getFirebase().auth,
        new GoogleAuthProvider(),
        browserPopupRedirectResolver,
      );
    } catch (reason) {
      const code = (reason as { code?: string }).code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError(`Sign-in failed (${code ?? "unknown error"}).`);
      }
    }
  }

  const isOwner =
    auth.state === "signedIn" && auth.user.email === OWNER_EMAIL && auth.user.emailVerified;

  return (
    <div className="admin">
      <header className="admin__bar">
        <h1 className="display">Inbox</h1>
        {auth.state === "signedIn" ? (
          <div className="admin__who">
            <span>{auth.user.email}</span>
            <button
              type="button"
              className="button button--light"
              onClick={() => signOut(getFirebase().auth)}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </header>

      <main id="main" className="admin__main">
        {auth.state === "loading" ? <p className="admin__message">Checking sign-in…</p> : null}

        {auth.state === "signedOut" ? (
          <div className="admin__message">
            <p>Only the site owner can open this inbox.</p>
            <button type="button" className="button button--primary" onClick={signIn}>
              Sign in with Google
            </button>
          </div>
        ) : null}

        {auth.state === "signedIn" && !isOwner ? (
          <p className="admin__message">
            This account has no access. Sign out and use the owner’s Google account.
          </p>
        ) : null}

        {!configured ? (
          <p className="admin__message admin__error">
            Firebase is not configured yet: see README.md.
          </p>
        ) : null}
        {error ? (
          <p className="admin__message admin__error" role="alert">
            {error}
          </p>
        ) : null}

        {isOwner ? <Inbox /> : null}
      </main>
    </div>
  );
}

interface Row extends StoredInquiry {
  id: string;
  expireAt: Timestamp;
}

const FILTERS: { id: InquiryStatus | "all"; label: string }[] = [
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "answered", label: "Answered" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

const SUBJECT = {
  en: "Your inquiry on danielbutnar.github.io",
  de: "Ihre Anfrage auf danielbutnar.github.io",
  ro: "Cererea dumneavoastră pe danielbutnar.github.io",
};

function Inbox() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | "all">("new");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [cleaned, setCleaned] = useState(0);

  // The free Spark plan has no time-to-live deletion, so the inbox does it: every
  // inquiry past its expireAt goes, with its note, as soon as the inbox opens.
  useEffect(() => {
    const { db } = getFirebase();
    (async () => {
      const expired = await getDocs(
        query(collection(db, "inquiries"), where("expireAt", "<", Timestamp.now())),
      );
      if (expired.empty) return;
      const batch = writeBatch(db);
      for (const inquiry of expired.docs) {
        batch.delete(inquiry.ref);
        batch.delete(doc(db, "notes", inquiry.id));
      }
      await batch.commit();
      setCleaned(expired.size);
    })().catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const { db } = getFirebase();
    return onSnapshot(
      query(collection(db, "inquiries"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setRows(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data({ serverTimestamps: "estimate" }) as Omit<Row, "id">),
          })),
        );
        setFailed(false);
      },
      () => setFailed(true),
    );
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: rows?.length ?? 0 };
    for (const row of rows ?? []) result[row.status] = (result[row.status] ?? 0) + 1;
    return result;
  }, [rows]);

  const visible = (rows ?? []).filter((row) => filter === "all" || row.status === filter);
  const selected = rows?.find((row) => row.id === selectedId) ?? null;

  function open(row: Row) {
    setSelectedId(row.id);
    // Opening a new inquiry marks it read, and the sender's status page shows it at once.
    if (row.status === "new") {
      void updateDoc(doc(getFirebase().db, "inquiries", row.id), {
        status: "read",
        readAt: serverTimestamp(),
      });
    }
  }

  if (failed)
    return (
      <p className="admin__message admin__error">
        The inbox could not be loaded. Check the rules and the network.
      </p>
    );
  if (!rows) return <p className="admin__message">Loading inquiries…</p>;

  return (
    <>
      {cleaned > 0 ? (
        <p className="admin__message" role="status">
          Deleted {cleaned} {cleaned === 1 ? "inquiry" : "inquiries"} older than 12 months, with
          their notes.
        </p>
      ) : null}
      <div className="admin__grid">
        <section className="admin__list" aria-label="Inquiries">
          <div className="admin__filters" role="group" aria-label="Show">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                {option.label} ({counts[option.id] ?? 0})
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <p className="admin__empty">
              {filter === "new"
                ? "No new inquiries. New ones appear here without a reload."
                : "Nothing here."}
            </p>
          ) : (
            <ul>
              {visible.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className="admin__item"
                    aria-current={row.id === selectedId ? "true" : undefined}
                    onClick={() => open(row)}
                  >
                    <span className="admin__item-top">
                      <strong>{row.company || row.name}</strong>
                      <span>{row.createdAt ? ago(row.createdAt.toDate()) : ""}</span>
                    </span>
                    <span className="admin__kind">
                      {dictionaries.en.contact.kinds[row.kind]}
                      {row.status === "new" ? <span className="admin__new">New</span> : null}
                    </span>
                    <span className="admin__preview">{row.message}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {selected ? (
          <Detail key={selected.id} row={selected} onDeleted={() => setSelectedId(null)} />
        ) : (
          <p className="admin__message">Pick an inquiry on the left.</p>
        )}
      </div>
    </>
  );
}

function Detail({ row, onDeleted }: { row: Row; onDeleted: () => void }) {
  const { db } = getFirebase();
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      onSnapshot(doc(db, "notes", row.id), (snapshot) => {
        const text = (snapshot.data()?.text as string | undefined) ?? "";
        setNote(text);
        setSavedNote(text);
      }),
    [db, row.id],
  );

  async function setStatus(status: InquiryStatus) {
    setBusy(true);
    const changes: Record<string, unknown> = { status };
    if (status === "answered" && !row.answeredAt) changes.answeredAt = serverTimestamp();
    await updateDoc(doc(db, "inquiries", row.id), changes).finally(() => setBusy(false));
  }

  async function saveNote() {
    setBusy(true);
    await setDoc(doc(db, "notes", row.id), {
      text: note,
      updatedAt: serverTimestamp(),
      expireAt: row.expireAt,
    }).finally(() => setBusy(false));
  }

  async function remove() {
    if (!window.confirm(`Delete the inquiry from ${row.name} and its note? This cannot be undone.`))
      return;
    setBusy(true);
    const batch = writeBatch(db);
    batch.delete(doc(db, "inquiries", row.id));
    batch.delete(doc(db, "notes", row.id));
    await batch.commit().catch(() => deleteDoc(doc(db, "inquiries", row.id)));
    onDeleted();
  }

  const mailto = `mailto:${row.email}?subject=${encodeURIComponent(SUBJECT[row.replyLang])}`;
  const fmt = (value: Timestamp | null | undefined) =>
    value
      ? value.toDate().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      : "–";

  return (
    <article className="admin__detail" aria-labelledby="detail-title">
      <div className="admin__detail-head">
        <div>
          <h2 id="detail-title" className="display">
            {row.company || row.name}
          </h2>
          <p>
            {row.name}, <a href={`mailto:${row.email}`}>{row.email}</a>, answer in{" "}
            {dictionaries[row.replyLang].langName}
          </p>
        </div>
        <a className="button button--primary" href={mailto}>
          Answer by e-mail
        </a>
      </div>

      <dl className="admin__facts">
        <div>
          <dt>About</dt>
          <dd>{dictionaries.en.contact.kinds[row.kind]}</dd>
        </div>
        {row.kind === "project" ? (
          <div>
            <dt>Timeline</dt>
            <dd>{dictionaries.en.contact.timelines[row.timeline]}</dd>
          </div>
        ) : null}
        <div>
          <dt>Received</dt>
          <dd>{fmt(row.createdAt)}</dd>
        </div>
        <div>
          <dt>Deleted on</dt>
          <dd>{fmt(row.expireAt)}</dd>
        </div>
      </dl>

      {row.link ? (
        <p>
          Job ad: <a href={row.link}>{row.link}</a>
        </p>
      ) : null}
      <p className="admin__message-text">{row.message}</p>

      <div className="field">
        <label htmlFor="note">
          Private note <span className="optional">(only you see this)</span>
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          maxLength={5000}
          onChange={(event) => setNote(event.target.value)}
        />
        <button
          type="button"
          className="button button--outline"
          disabled={busy || note === savedNote}
          onClick={saveNote}
        >
          {note === savedNote && savedNote ? "Note saved" : "Save note"}
        </button>
      </div>

      <div className="admin__actions">
        {row.status !== "answered" ? (
          <button
            type="button"
            className="button button--ink"
            disabled={busy}
            onClick={() => setStatus("answered")}
          >
            Mark as answered
          </button>
        ) : null}
        {row.status !== "archived" ? (
          <button
            type="button"
            className="button button--outline"
            disabled={busy}
            onClick={() => setStatus("archived")}
          >
            Archive
          </button>
        ) : (
          <button
            type="button"
            className="button button--outline"
            disabled={busy}
            onClick={() => setStatus("read")}
          >
            Move back to the inbox
          </button>
        )}
        <button type="button" className="button admin__delete" disabled={busy} onClick={remove}>
          Delete now
        </button>
      </div>
    </article>
  );
}

function ago(date: Date): string {
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
