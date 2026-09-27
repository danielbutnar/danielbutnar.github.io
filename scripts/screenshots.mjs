// Builds the case study screenshots in app/assets/work as WebP.
//   node scripts/screenshots.mjs            existing files from sibling repos + live sites
//   node scripts/screenshots.mjs --local    this site, from `pnpm preview` on :5184
// Live captures only open pages; nothing is submitted, booked or paid.
// Needs Chrome installed (playwright-core drives it) and the sibling repos next to this one.

import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const out = fileURLToPath(new URL("../app/assets/work/", import.meta.url));
const code = fileURLToPath(new URL("../../", import.meta.url));
mkdirSync(out, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

async function save(input, name, { kind = "desktop", left, top = 0, width, height } = {}) {
  const size = kind === "phone" ? { width: 780, height: 1688 } : DESKTOP;
  let image = sharp(input);
  if (width && height) image = image.extract({ left: left ?? 0, top, width, height });
  await image
    .resize(size.width, size.height, { fit: "cover", position: "top" })
    .webp({ quality: 78, effort: 6 })
    .toFile(`${out}${name}.webp`);
  console.log("saved", name);
}

async function fromRepos() {
  await save(
    `${code}serpentina-transfers/docs/contra/dashboard-desktop.jpg`,
    "serpentina-transfers-dashboard",
  );
  await save(
    `${code}serpentina-transfers/docs/contra/route-desktop.jpg`,
    "serpentina-transfers-route",
  );
  await save(`${code}ursa-refuge/docs/contra/04-routes.jpg`, "ursa-routes");
  await save(`${code}ursa-refuge/docs/contra/05-night.jpg`, "ursa-night");
  await save(
    `${code}lovable-challenge/video/process/assets/live-home.jpg`,
    "rope-street-tattoo-desktop",
  );
  await save(
    `${code}lovable-challenge/video/process/assets/shot-price.jpg`,
    "rope-street-tattoo-price",
    {
      left: 240,
      width: 1440,
      height: 900,
    },
  );
}

async function capture(browser, url, name, prepare, { kind = "desktop" } = {}) {
  const phone = kind === "phone";
  const context = await browser.newContext({
    viewport: phone ? PHONE : DESKTOP,
    deviceScaleFactor: phone ? 2 : 1,
    isMobile: phone,
    hasTouch: phone,
    locale: "en-GB",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  if (prepare) await prepare(page);
  await page.waitForTimeout(800);
  await save(await page.screenshot({ type: "png" }), name, { kind });
  await context.close();
}

async function fromLiveSites(browser) {
  await capture(
    browser,
    "https://brasov-private-tours.vercel.app/en",
    "brasov-private-tours-desktop",
  );
  await capture(
    browser,
    "https://brasov-private-tours.vercel.app/en",
    "brasov-private-tours-booking",
    async (page) => {
      await page.getByRole("link", { name: "Book a trip" }).first().click();
      // The calendar loads availability after the drawer opens.
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(5000);
    },
  );
  await capture(
    browser,
    "https://danielbutnar.github.io/serpentina-transfers/en/",
    "serpentina-transfers-desktop",
  );
  await capture(
    browser,
    "https://danielbutnar.github.io/ursa-refuge/",
    "ursa-desktop",
    async (page) => {
      await page.waitForTimeout(2500);
    },
  );
  const study = "https://danielbutnar2003.github.io/accessibility-portfolio/en/study.html";
  await capture(browser, study, "accessibility-study-desktop");
  await capture(browser, study, "accessibility-study-results", async (page) => {
    await page
      .getByRole("heading", { name: /fails most often/i })
      .first()
      .scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
  });
}

async function fromLocalPreview(browser) {
  const base = "http://localhost:5184";
  await capture(browser, `${base}/`, "this-site-desktop");
  await capture(browser, `${base}/`, "this-site-phone", null, { kind: "phone" });
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  if (process.argv.includes("--only-booking")) {
    await capture(
      browser,
      "https://brasov-private-tours.vercel.app/en",
      "brasov-private-tours-booking",
      async (page) => {
        await page.getByRole("link", { name: "Book a trip" }).first().click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(5000);
      },
    );
  } else if (process.argv.includes("--local")) {
    await fromLocalPreview(browser);
  } else {
    await fromRepos();
    await fromLiveSites(browser);
  }
} finally {
  await browser.close();
}
