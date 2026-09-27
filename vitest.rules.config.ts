import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Runs only inside `firebase emulators:exec` (see the test:rules script).
export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  test: {
    include: ["tests/rules/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
});
