import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { OWNER_EMAIL } from "~/firebase/owner";
import { LIMITS, RETENTION_DAYS } from "~/inquiry/schema";

// Runs against the Firestore emulator: `pnpm test:rules`.

const DAY_MS = 24 * 60 * 60 * 1000;
let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-portfolio",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

// Contexts -------------------------------------------------------------------

function visitor(uid = "visitor-1"): Firestore {
  return env
    .authenticatedContext(uid, { firebase: { sign_in_provider: "anonymous" } })
    .firestore() as unknown as Firestore;
}

function owner(overrides: Record<string, unknown> = {}): Firestore {
  return env
    .authenticatedContext("owner-uid", {
      email: OWNER_EMAIL,
      email_verified: true,
      firebase: { sign_in_provider: "google.com" },
      ...overrides,
    })
    .firestore() as unknown as Firestore;
}

function nobody(): Firestore {
  return env.unauthenticatedContext().firestore() as unknown as Firestore;
}

// Data -----------------------------------------------------------------------

function inquiry(uid: string, overrides: Record<string, unknown> = {}) {
  return {
    kind: "project",
    name: "Ana Pop",
    email: "ana@example.com",
    company: "",
    message: "We rent four rooms and want guests to book online.",
    timeline: "month",
    link: "",
    replyLang: "ro",
    uid,
    status: "new",
    createdAt: serverTimestamp(),
    expireAt: Timestamp.fromMillis(Date.now() + RETENTION_DAYS * DAY_MS),
    ...overrides,
  };
}

/** Sends the way the site does: the inquiry and senders/{uid} in one batch. */
function send(db: Firestore, uid: string, overrides: Record<string, unknown> = {}, id?: string) {
  const batch = writeBatch(db);
  const ref = id ? doc(db, "inquiries", id) : doc(collection(db, "inquiries"));
  batch.set(ref, inquiry(uid, overrides));
  batch.set(doc(db, "senders", uid), { lastSentAt: serverTimestamp() });
  return batch.commit();
}

/** Writes an inquiry past the rules, as if a visitor had sent it earlier. */
async function seed(id: string, uid = "visitor-1", overrides: Record<string, unknown> = {}) {
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore() as unknown as Firestore;
    await setDoc(doc(db, "inquiries", id), {
      ...inquiry(uid, overrides),
      createdAt: Timestamp.now(),
      expireAt: Timestamp.fromMillis(Date.now() + RETENTION_DAYS * DAY_MS),
    });
  });
}

const chars = (count: number) => "x".repeat(count);

// Tests ----------------------------------------------------------------------

describe("sending an inquiry", () => {
  it("accepts a valid inquiry written together with senders/{uid}", async () => {
    await assertSucceeds(send(visitor(), "visitor-1"));
  });

  it("accepts each kind of inquiry and each reply language", async () => {
    await assertSucceeds(
      send(visitor("a"), "a", {
        kind: "job",
        timeline: "none",
        link: "https://example.com/jobs/1",
      }),
    );
    await assertSucceeds(
      send(visitor("b"), "b", { kind: "other", timeline: "none", replyLang: "de" }),
    );
    await assertSucceeds(send(visitor("c"), "c", { replyLang: "en", company: "Pensiunea Test" }));
  });

  it("refuses an inquiry written without senders/{uid}", async () => {
    const db = visitor();
    await assertFails(setDoc(doc(db, "inquiries", "solo"), inquiry("visitor-1")));
  });

  it("refuses visitors who are not signed in", async () => {
    await assertFails(send(nobody(), "visitor-1"));
  });

  it("refuses an inquiry that claims another user's ID", async () => {
    await assertFails(send(visitor("visitor-1"), "visitor-1", { uid: "someone-else" }));
  });

  it("refuses unknown and missing fields", async () => {
    await assertFails(send(visitor("a"), "a", { phone: "+40 700 000 000" }));
    const withoutCompany: Record<string, unknown> = { ...inquiry("b") };
    delete withoutCompany.company;
    const db = visitor("b");
    const batch = writeBatch(db);
    batch.set(doc(collection(db, "inquiries")), withoutCompany);
    batch.set(doc(db, "senders", "b"), { lastSentAt: serverTimestamp() });
    await assertFails(batch.commit());
  });

  it("refuses values outside the allowed lists", async () => {
    await assertFails(send(visitor("a"), "a", { kind: "spam" }));
    await assertFails(send(visitor("b"), "b", { timeline: "yesterday" }));
    await assertFails(send(visitor("c"), "c", { replyLang: "fr" }));
    await assertFails(send(visitor("d"), "d", { status: "answered" }));
  });

  it("uses the same length limits as the form", async () => {
    await assertSucceeds(send(visitor("a"), "a", { name: chars(LIMITS.name.max) }));
    await assertFails(send(visitor("b"), "b", { name: chars(LIMITS.name.max + 1) }));
    await assertFails(send(visitor("c"), "c", { name: "" }));
    await assertSucceeds(send(visitor("d"), "d", { message: chars(LIMITS.message.min) }));
    await assertFails(send(visitor("e"), "e", { message: chars(LIMITS.message.min - 1) }));
    await assertSucceeds(send(visitor("f"), "f", { message: chars(LIMITS.message.max) }));
    await assertFails(send(visitor("g"), "g", { message: chars(LIMITS.message.max + 1) }));
    await assertFails(send(visitor("h"), "h", { company: chars(LIMITS.company.max + 1) }));
    await assertFails(send(visitor("i"), "i", { link: `https://${chars(LIMITS.link.max)}` }));
  });

  it("counts Romanian and German letters as one character each", async () => {
    await assertSucceeds(send(visitor("a"), "a", { name: "ș".repeat(LIMITS.name.max) }));
    await assertSucceeds(send(visitor("b"), "b", { name: "ß".repeat(LIMITS.name.max) }));
  });

  it("refuses malformed e-mail addresses and links", async () => {
    await assertFails(send(visitor("a"), "a", { email: "ana@" }));
    await assertFails(send(visitor("b"), "b", { email: "ana example@test.com" }));
    await assertFails(send(visitor("c"), "c", { link: "javascript:alert(1)" }));
    await assertFails(send(visitor("d"), "d", { link: "https://example.com/a b" }));
  });

  it("requires the server's clock for createdAt", async () => {
    await assertFails(send(visitor(), "visitor-1", { createdAt: Timestamp.now() }));
  });

  it("requires expireAt about a year ahead", async () => {
    await assertFails(
      send(visitor("a"), "a", { expireAt: Timestamp.fromMillis(Date.now() + 30 * DAY_MS) }),
    );
    await assertFails(
      send(visitor("b"), "b", { expireAt: Timestamp.fromMillis(Date.now() + 400 * DAY_MS) }),
    );
    await assertFails(send(visitor("c"), "c", { expireAt: "2027-09-27" }));
  });
});

describe("rate limit", () => {
  it("refuses a second inquiry from the same browser within a minute", async () => {
    const db = visitor();
    await assertSucceeds(send(db, "visitor-1"));
    await assertFails(send(db, "visitor-1"));
  });

  it("accepts the next inquiry once a minute has passed", async () => {
    await env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore() as unknown as Firestore;
      await setDoc(doc(db, "senders", "visitor-1"), {
        lastSentAt: Timestamp.fromMillis(Date.now() - 61_000),
      });
    });
    await assertSucceeds(send(visitor(), "visitor-1"));
  });

  it("does not let a browser reset its own clock", async () => {
    const db = visitor();
    await assertSucceeds(send(db, "visitor-1"));
    await assertFails(
      setDoc(doc(db, "senders", "visitor-1"), { lastSentAt: Timestamp.fromMillis(0) }),
    );
  });

  it("keeps senders documents private", async () => {
    await assertSucceeds(send(visitor(), "visitor-1"));
    await assertFails(getDoc(doc(visitor(), "senders", "visitor-1")));
    await assertFails(getDoc(doc(owner(), "senders", "visitor-1")));
  });
});

describe("reading inquiries", () => {
  it("lets the sending browser read its own inquiry", async () => {
    await seed("mine", "visitor-1");
    const snapshot = await assertSucceeds(getDoc(doc(visitor("visitor-1"), "inquiries", "mine")));
    expect(snapshot.data()?.status).toBe("new");
  });

  it("hides an inquiry from other browsers and from visitors who are not signed in", async () => {
    await seed("mine", "visitor-1");
    await assertFails(getDoc(doc(visitor("visitor-2"), "inquiries", "mine")));
    await assertFails(getDoc(doc(nobody(), "inquiries", "mine")));
  });

  it("lets only the owner list inquiries", async () => {
    await seed("one");
    await assertFails(getDocs(collection(visitor(), "inquiries")));
    await assertSucceeds(getDocs(collection(owner(), "inquiries")));
  });

  it("refuses look-alike owners", async () => {
    await seed("one");
    await assertFails(getDocs(collection(owner({ email_verified: false }), "inquiries")));
    await assertFails(
      getDocs(collection(owner({ firebase: { sign_in_provider: "password" } }), "inquiries")),
    );
    await assertFails(getDocs(collection(owner({ email: "someone@example.com" }), "inquiries")));
  });
});

describe("the owner's inbox", () => {
  it("lets the owner move an inquiry through its statuses", async () => {
    await seed("one");
    const db = owner();
    await assertSucceeds(
      updateDoc(doc(db, "inquiries", "one"), { status: "read", readAt: serverTimestamp() }),
    );
    await assertSucceeds(
      updateDoc(doc(db, "inquiries", "one"), { status: "answered", answeredAt: serverTimestamp() }),
    );
    await assertSucceeds(updateDoc(doc(db, "inquiries", "one"), { status: "archived" }));
  });

  it("does not let the owner rewrite what the visitor sent", async () => {
    await seed("one");
    await assertFails(
      updateDoc(doc(owner(), "inquiries", "one"), { message: "Something else entirely." }),
    );
    await assertFails(updateDoc(doc(owner(), "inquiries", "one"), { status: "spam" }));
    await assertFails(updateDoc(doc(owner(), "inquiries", "one"), { readAt: "yesterday" }));
  });

  it("does not let visitors change or delete inquiries, even their own", async () => {
    await seed("mine", "visitor-1");
    await assertFails(
      updateDoc(doc(visitor("visitor-1"), "inquiries", "mine"), { status: "read" }),
    );
    await assertFails(deleteDoc(doc(visitor("visitor-1"), "inquiries", "mine")));
  });

  it("lets the owner find expired inquiries and delete them with their notes in one batch", async () => {
    await seed("old", "visitor-1", { expireAt: Timestamp.fromMillis(Date.now() - DAY_MS) });
    await seed("fresh");
    await env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore() as unknown as Firestore;
      await setDoc(
        doc(db, "inquiries", "old"),
        { expireAt: Timestamp.fromMillis(Date.now() - DAY_MS) },
        { merge: true },
      );
      await setDoc(doc(db, "notes", "old"), {
        text: "Old",
        updatedAt: Timestamp.now(),
        expireAt: Timestamp.now(),
      });
    });
    const db = owner();
    const expired = await assertSucceeds(
      getDocs(query(collection(db, "inquiries"), where("expireAt", "<", Timestamp.now()))),
    );
    expect(expired.docs.map((d) => d.id)).toEqual(["old"]);
    const batch = writeBatch(db);
    batch.delete(doc(db, "inquiries", "old"));
    batch.delete(doc(db, "notes", "old"));
    await assertSucceeds(batch.commit());
    expect((await getDocs(collection(db, "inquiries"))).docs.map((d) => d.id)).toEqual(["fresh"]);
  });

  it("does not let visitors query for expired inquiries", async () => {
    await seed("old");
    await assertFails(
      getDocs(query(collection(visitor(), "inquiries"), where("expireAt", "<", Timestamp.now()))),
    );
  });

  it("lets the owner delete an inquiry", async () => {
    await seed("one");
    await assertSucceeds(deleteDoc(doc(owner(), "inquiries", "one")));
  });
});

describe("private notes", () => {
  it("lets the owner keep a note that expires with its inquiry", async () => {
    await seed("one");
    const db = owner();
    const { expireAt } = (await getDoc(doc(db, "inquiries", "one"))).data()!;
    await assertSucceeds(
      setDoc(doc(db, "notes", "one"), {
        text: "Call on Monday.",
        updatedAt: serverTimestamp(),
        expireAt,
      }),
    );
    await assertSucceeds(getDoc(doc(db, "notes", "one")));
  });

  it("refuses a note that would outlive its inquiry", async () => {
    await seed("one");
    const later = Timestamp.fromMillis(Date.now() + 5 * RETENTION_DAYS * DAY_MS);
    await assertFails(
      setDoc(doc(owner(), "notes", "one"), {
        text: "Keep forever.",
        updatedAt: serverTimestamp(),
        expireAt: later,
      }),
    );
  });

  it("hides notes from visitors, including the sender", async () => {
    await seed("one", "visitor-1");
    await env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore() as unknown as Firestore;
      await setDoc(doc(db, "notes", "one"), {
        text: "Private",
        updatedAt: Timestamp.now(),
        expireAt: Timestamp.now(),
      });
    });
    await assertFails(getDoc(doc(visitor("visitor-1"), "notes", "one")));
    await assertFails(
      setDoc(doc(visitor("visitor-1"), "notes", "one"), {
        text: "hi",
        updatedAt: serverTimestamp(),
      }),
    );
  });
});
