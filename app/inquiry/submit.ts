import { FirebaseError } from "firebase/app";
import { signInAnonymously } from "firebase/auth";
import { Timestamp, collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { getFirebase } from "~/firebase/client";
import { RETENTION_DAYS, normalizeInquiry, type InquiryInput } from "./schema";

export type SendFailure = "rateLimited" | "network" | "unavailable";

export class SendError extends Error {
  constructor(readonly reason: SendFailure) {
    super(reason);
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 20_000;

/**
 * Stores an inquiry and returns its id. The inquiry and senders/{uid} go in
 * one batch: firestore.rules only accept the inquiry together with that
 * document, and refuse the document if this browser sent one in the last minute.
 */
export async function sendInquiry(input: InquiryInput): Promise<string> {
  if (typeof navigator !== "undefined" && !navigator.onLine) throw new SendError("network");

  try {
    const { auth, db } = getFirebase();
    await auth.authStateReady();
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;

    const inquiry = doc(collection(db, "inquiries"));
    const batch = writeBatch(db);
    batch.set(inquiry, {
      ...normalizeInquiry(input),
      uid: user.uid,
      status: "new",
      createdAt: serverTimestamp(),
      expireAt: Timestamp.fromMillis(Date.now() + RETENTION_DAYS * DAY_MS),
    });
    batch.set(doc(db, "senders", user.uid), { lastSentAt: serverTimestamp() });

    // Firestore waits for the network instead of failing, so give up after a while.
    await Promise.race([
      batch.commit(),
      new Promise((_, reject) => setTimeout(() => reject(new SendError("network")), TIMEOUT_MS)),
    ]);
    return inquiry.id;
  } catch (error) {
    throw toSendError(error);
  }
}

function toSendError(error: unknown): SendError {
  if (error instanceof SendError) return error;
  if (error instanceof FirebaseError) {
    // The client checks every field first, so a refusal from the rules means the rate limit.
    if (error.code === "permission-denied") return new SendError("rateLimited");
    if (error.code === "unavailable" || error.code === "auth/network-request-failed")
      return new SendError("network");
  }
  if (import.meta.env.DEV) console.error(error);
  return new SendError("unavailable");
}
