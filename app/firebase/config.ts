import type { FirebaseOptions } from "firebase/app";
import webConfig from "./web-config.json";

/**
 * The web app's Firebase config, from web-config.json. These values identify
 * the project; they are not secrets (firestore.rules decide who may do what).
 * Null until the Firebase project exists: the form then offers e-mail instead.
 * scripts/postbuild.mjs reads the same file for the Content Security Policy.
 */
export const firebaseConfig = webConfig as FirebaseOptions | null;

/** Used in development and in tests, against the local emulators. */
export const emulatorConfig: FirebaseOptions = {
  apiKey: "demo-api-key",
  authDomain: "demo-portfolio.firebaseapp.com",
  projectId: "demo-portfolio",
  appId: "demo-app",
};

/** Development and `pnpm build:e2e` (Vite mode "emulators") talk to the local emulators. */
export const useEmulators = import.meta.env.DEV || import.meta.env.MODE === "emulators";

export function isFirebaseConfigured(): boolean {
  return useEmulators || firebaseConfig !== null;
}
