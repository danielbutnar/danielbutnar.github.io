import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { emulatorConfig, firebaseConfig, useEmulators } from "./config";

// Only imported with import(), so pages without a form or inbox ship no Firebase code.

export interface Firebase {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let instance: Firebase | undefined;

export function getFirebase(): Firebase {
  if (instance) return instance;
  const options = useEmulators ? emulatorConfig : firebaseConfig;
  if (!options) throw new Error("Firebase is not configured");

  const existing = getApps()[0];
  const app = existing ?? initializeApp(options);
  // No popup resolver here: visitors never see a popup, and the resolver is sizeable.
  // The inbox passes it to signInWithPopup itself.
  const auth = existing
    ? getAuth(app)
    : initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  const db = getFirestore(app);

  if (useEmulators && !existing) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }

  instance = { app, auth, db };
  return instance;
}
