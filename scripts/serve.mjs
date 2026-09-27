// Serves the built site the way GitHub Pages does, for `pnpm preview` and the end-to-end test:
// /work/ursa redirects to /work/ursa/, which serves work/ursa/index.html; anything
// missing gets 404.html with status 404.
//   node scripts/serve.mjs build/client 5184

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".data": "text/x-script",
};

export function serve(root, port) {
  const base = resolve(root);
  const send = (res, status, file) => {
    res.writeHead(status, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  };

  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    const file = join(base, normalize(decodeURIComponent(url.pathname)));
    if (!file.startsWith(base)) return send(res, 404, join(base, "404.html"));

    if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file);
    if (existsSync(join(file, "index.html"))) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        return res.end();
      }
      return send(res, 200, join(file, "index.html"));
    }
    return send(res, 404, join(base, "404.html"));
  });

  return new Promise((ready) => server.listen(port, () => ready(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? "build/client";
  const port = Number(process.argv[3] ?? 5184);
  await serve(root, port);
  console.log(`Serving ${root} on http://localhost:${port}/`);
}
