import { FirebaseError } from "firebase/app";
import { doc, onSnapshot, type Timestamp } from "firebase/firestore";
import { getFirebase } from "~/firebase/client";
import type { InquiryInput, InquiryStatus } from "./schema";

export interface StoredInquiry extends InquiryInput {
  status: InquiryStatus;
  createdAt: Timestamp | null;
  readAt?: Timestamp;
  answeredAt?: Timestamp;
}

export type WatchState =
  | { state: "loading" }
  | { state: "ready"; inquiry: StoredInquiry }
  | { state: "denied" }
  | { state: "unavailable" };

/**
 * Follows one inquiry live. Only the browser that sent it may read it
 * (firestore.rules), so any other browser gets "denied".
 */
export function watchInquiry(id: string, onChange: (state: WatchState) => void): () => void {
  let unsubscribe = () => {};
  let stopped = false;

  (async () => {
    try {
      const { auth, db } = getFirebase();
      await auth.authStateReady();
      if (stopped) return;
      if (!auth.currentUser) {
        onChange({ state: "denied" });
        return;
      }
      unsubscribe = onSnapshot(
        doc(db, "inquiries", id),
        (snapshot) => {
          if (!snapshot.exists()) onChange({ state: "denied" });
          else
            onChange({
              state: "ready",
              inquiry: snapshot.data({ serverTimestamps: "estimate" }) as StoredInquiry,
            });
        },
        (error) => {
          onChange({
            state:
              error instanceof FirebaseError && error.code === "permission-denied"
                ? "denied"
                : "unavailable",
          });
        },
      );
    } catch {
      onChange({ state: "unavailable" });
    }
  })();

  return () => {
    stopped = true;
    unsubscribe();
  };
}
