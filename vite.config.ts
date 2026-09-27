import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  plugins: [{ enforce: "pre", ...mdx() }, reactRouter()],
  build: {
    // The fonts are preloaded by URL; keep them as files instead of inlining them.
    assetsInlineLimit: 0,
  },
});
