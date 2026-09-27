import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["build/", ".react-router/", "node_modules/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["scripts/**/*.mjs", "*.config.{js,ts}", "tests/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // page.evaluate() callbacks run in the browser.
    files: ["scripts/og.mjs", "scripts/screenshots.mjs", "scripts/contra-shots.mjs", "tests/e2e/**/*.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
]);
