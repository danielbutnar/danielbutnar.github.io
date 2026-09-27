import type { Config } from "@react-router/dev/config";
import { prerenderPaths } from "./app/site/paths.ts";

// GitHub Pages serves files only, so every public page is rendered to HTML at
// build time. /admin and the inquiry status page are prerendered as shells and
// load their data in the browser.
export default {
  ssr: false,
  prerender: () => prerenderPaths(),
} satisfies Config;
