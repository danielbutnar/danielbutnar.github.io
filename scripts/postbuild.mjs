// Runs after `react-router build`. GitHub Pages serves files only, so this step:
//   1. turns the SPA fallback into 404.html (unknown URLs still get the site and a 404 page);
//   2. gives every HTML file a Content Security Policy that allows exactly its own inline scripts;
//   3. writes sitemap.xml, robots.txt and .nojekyll;
//   4. fails the build if a page that should exist is missing.
// Imports the site's own path list; Node 24 runs the TypeScript directly.

import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { LOCALES, SITE_ORIGIN, localizePath } from "../app/i18n/locales.ts";
import { prerenderPaths, sitemapPages } from "../app/site/paths.ts";

const root = "build/client";
const webConfig = JSON.parse(readFileSync("app/firebase/web-config.json", "utf8"));
const emulators = process.argv.includes("--emulators");

// 1. 404.html --------------------------------------------------------------
const fallback = join(root, "__spa-fallback.html");
if (!existsSync(fallback)) throw new Error(`${fallback} is missing: is "/" still prerendered?`);
copyFileSync(fallback, join(root, "404.html"));
rmSync(fallback);

// 2. Content Security Policy -------------------------------------------------
const authDomain = emulators
  ? "http://127.0.0.1:9099"
  : webConfig?.authDomain
    ? `https://${webConfig.authDomain}`
    : null;
const connect = [
  "'self'",
  "https://firestore.googleapis.com",
  "https://identitytoolkit.googleapis.com",
  "https://securetoken.googleapis.com",
  ...(emulators ? ["http://127.0.0.1:8080", "http://127.0.0.1:9099"] : []),
];

function policy(file, html) {
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, body]) => `'sha256-${createHash("sha256").update(body).digest("base64")}'`,
  );
  // Google sign-in on /admin loads Google's script and an iframe from the auth domain.
  const admin = file === "admin/index.html";
  const directives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...new Set(inline), ...(admin ? ["https://apis.google.com"] : [])],
    "style-src": ["'self'"],
    "img-src": ["'self'", "data:"],
    "font-src": ["'self'"],
    "connect-src": [
      ...connect,
      ...(admin ? ["https://apis.google.com", "https://www.googleapis.com"] : []),
    ],
    "frame-src": admin && authDomain ? [authDomain] : ["'none'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const charset = '<meta charSet="utf-8"/>';
for (const path of htmlFiles(root)) {
  const file = relative(root, path).split(sep).join("/");
  const html = readFileSync(path, "utf8");
  if (!html.includes(charset)) throw new Error(`${file}: no ${charset} to put the CSP after`);
  const csp = `<meta http-equiv="Content-Security-Policy" content="${policy(file, html)}"/>`;
  writeFileSync(path, html.replace(charset, charset + csp));
}

// 3. sitemap.xml, robots.txt, .nojekyll ---------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = sitemapPages().flatMap((page) =>
  LOCALES.map((locale) => {
    const alternates = LOCALES.map(
      (other) =>
        `    <xhtml:link rel="alternate" hreflang="${other}" href="${SITE_ORIGIN}${localizePath(other, page)}"/>`,
    );
    alternates.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${localizePath("en", page)}"/>`,
    );
    return [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${localizePath(locale, page)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      ...alternates,
      "  </url>",
    ].join("\n");
  }),
);
writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);
writeFileSync(
  join(root, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
);
writeFileSync(join(root, ".nojekyll"), "");

// 4. Every page is there ------------------------------------------------------
const missing = prerenderPaths()
  .map((path) => (path === "/" ? "index.html" : `${path.slice(1)}/index.html`))
  .filter((file) => !existsSync(join(root, file)));
if (missing.length) throw new Error(`Missing prerendered pages:\n${missing.join("\n")}`);

console.log(
  `postbuild: ${htmlFiles(root).length} HTML files with a CSP, ${urls.length} sitemap entries`,
);
