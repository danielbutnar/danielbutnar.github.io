// Screenshots of the live site for the Contra portfolio post, in docs/contra/.
//   node scripts/contra-shots.mjs
// The status page and inbox come from the emulator run (app/assets/work, sample data).

import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";

const base = "https://danielbutnar.github.io";
const out = "docs/contra/";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
async function shoot(name, path, { phone = false, scrollTo, fullHeight } = {}) {
  const context = await browser.newContext({
    viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    isMobile: phone,
    hasTouch: phone,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  if (scrollTo) {
    await page.locator(scrollTo).first().scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -24));
  }
  await page.waitForTimeout(800);
  const png = await page.screenshot({ fullPage: Boolean(fullHeight) });
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(`${out}${name}.jpg`);
  console.log("saved", name);
  await context.close();
}

await shoot("01-home", "/");
await shoot("02-work-table", "/", { scrollTo: "#work" });
await shoot("03-case-study", "/work/brasov-private-tours/");
await shoot("04-firebase-flow", "/work/this-site/", { scrollTo: ".flow" });
await shoot("05-inquiry-form", "/contact/");
await shoot("08-phone-home", "/", { phone: true });
await shoot("09-phone-german", "/de/", { phone: true });
await browser.close();

for (const [from, to] of [
  ["this-site-status", "06-status-page"],
  ["this-site-inbox", "07-inbox"],
]) {
  await sharp(`app/assets/work/${from}.webp`).jpeg({ quality: 88 }).toFile(`${out}${to}.jpg`);
  console.log("saved", to);
}
