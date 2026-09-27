// Renders public/og.png (1200 × 630, the link preview) and public/apple-touch-icon.png
// with the site's own fonts and colours. Run after changing the headline:
//   node scripts/og.mjs

import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";

// Inlined: a page opened with setContent cannot load file:// URLs.
const font = (name) =>
  `data:font/woff2;base64,${readFileSync(`app/assets/fonts/${name}`).toString("base64")}`;

const html = `<!doctype html><html><head><style>
@font-face { font-family: Anybody; src: url(${font("anybody-latin.woff2")}); font-weight: 100 900; font-stretch: 50% 150%; }
@font-face { font-family: Hanken; src: url(${font("hanken-grotesk-latin.woff2")}); font-weight: 100 900; }
body { margin: 0; }
.card { width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 72px; background: #eef1ec; color: #14201b;
  display: flex; flex-direction: column; justify-content: space-between; font-family: Hanken, sans-serif; border-bottom: 16px solid #14201b; }
.name { align-self: flex-start; font-family: Anybody; font-weight: 800; font-stretch: 70%; font-size: 44px; background: #f2cf3a; padding: 2px 12px 6px; margin-left: -12px; }
h1 { margin: 0; font-family: Anybody; font-weight: 800; font-stretch: 62%; font-size: 112px; line-height: 0.9; max-width: 1000px; }
p { margin: 0; font-size: 28px; color: #2b3832; }
</style></head><body><div class="card">
<div class="name">Daniel Butnar</div>
<h1>Booking systems and web apps that hold up in real use.</h1>
<p>React, TypeScript and Firebase. Brașov, Romania. English, Deutsch, Română.</p>
</div></body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await sharp(await page.locator(".card").screenshot())
    .png({ compressionLevel: 9, palette: true })
    .toFile("public/og.png");
} finally {
  await browser.close();
}

await sharp("public/favicon.svg", { density: 600 })
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("wrote public/og.png and public/apple-touch-icon.png");
