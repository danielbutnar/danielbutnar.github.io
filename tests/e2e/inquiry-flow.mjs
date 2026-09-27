// End-to-end test of the inquiry flow in a real browser, against the Auth and
// Firestore emulators. Run with `pnpm build:e2e && pnpm test:e2e`, which starts
// the emulators; this file serves the build itself.
// Needs Chrome installed (playwright-core drives it). `--shots` also saves the
// status page and the inbox to app/assets/work for the Firebase case study.

import { chromium } from "playwright-core";
import sharp from "sharp";
import { serve } from "../../scripts/serve.mjs";

const PORT = 5185;
const base = `http://localhost:${PORT}`;
const shots = process.argv.includes("--shots");
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

const server = await serve("build/client", PORT);
const browser = await chromium.launch({ channel: "chrome" });
const newContext = () =>
  browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-GB",
    reducedMotion: "reduce",
  });

async function sendInquiry(page, { kind, name, email, company, message, link }) {
  await page.goto(`${base}/contact/`, { waitUntil: "networkidle" });
  await page.getByLabel(kind).check();
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel(/Business or website|Company/).fill(company);
  await page
    .getByRole("textbox", { name: /What should it do|About the role|Your message/ })
    .fill(message);
  if (link) await page.getByLabel("Link to the job ad").fill(link);
  await page.getByRole("button", { name: "Send inquiry" }).click();
}

const visible = (locator, timeout = 20_000) =>
  locator
    .waitFor({ timeout })
    .then(() => true)
    .catch(() => false);

try {
  // Case studies open from the work list without a full page load, in every language.
  const reader = await (await newContext()).newPage();
  const failedRequests = [];
  reader.on("response", (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
  });
  for (const [home, project, heading] of [
    ["/", "Brasov Private Tours", "The hard parts"],
    ["/de/", "Diese Website", "Die schwierigen Stellen"],
    ["/ro/", "Ursa", "Părțile grele"],
  ]) {
    await reader.goto(`${base}${home}`, { waitUntil: "networkidle" });
    await reader.getByRole("link", { name: project, exact: true }).first().click();
    const opened =
      (await visible(reader.getByRole("heading", { level: 1, name: project }))) &&
      (await visible(reader.getByRole("heading", { level: 2, name: heading })));
    check(`a click opens the case study: ${home} ${project}`, opened);
  }
  await reader.getByRole("link", { name: /Următorul studiu de caz/ }).click();
  check(
    "the next case study opens from the link at the bottom",
    await visible(reader.getByRole("heading", { level: 1, name: "Accessibility study" })),
  );
  check(
    "no failed requests while reading",
    failedRequests.length === 0,
    failedRequests.join(" | "),
  );

  // A visitor sends a project inquiry and lands on the status page.
  const visitor = await (await newContext()).newPage();
  const errors = [];
  visitor.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await sendInquiry(visitor, {
    kind: "A project for my business",
    name: "Test Visitor",
    email: "visitor@example.com",
    company: "Sample Guesthouse",
    message:
      "We rent four rooms near Bran and want guests to book online and pay a deposit. The site should be in Romanian, English and German.",
  });
  await visitor.waitForURL(/\/contact\/status\/\?id=/, { timeout: 30_000 });
  const statusUrl = visitor.url();
  check(
    "the inquiry is stored and the status page opens",
    await visible(visitor.getByText("Stored in Firestore")),
  );
  check(
    "the status page shows what was sent",
    await visible(visitor.getByText("Sample Guesthouse")),
  );

  // An empty form shows an error summary, which takes focus.
  const blank = await visitor.context().newPage();
  await blank.goto(`${base}/contact/`, { waitUntil: "networkidle" });
  await blank.getByRole("button", { name: "Send inquiry" }).click();
  check(
    "an empty form shows an error summary",
    await visible(blank.getByText("3 fields need a change"), 5_000),
  );
  const focused = await blank.evaluate(() => document.activeElement?.className ?? "");
  check("the error summary takes focus", focused.includes("error-summary"), focused);

  // The same browser sends again at once: the rules refuse it.
  await sendInquiry(blank, {
    kind: "Something else",
    name: "Test Visitor",
    email: "visitor@example.com",
    company: "",
    message: "A second message, sent right after the first one.",
  });
  check(
    "a second inquiry within a minute is refused",
    await visible(blank.getByText("less than a minute ago")),
  );

  // Another browser sends a job inquiry.
  const recruiter = await (await newContext()).newPage();
  await sendInquiry(recruiter, {
    kind: "A job opening",
    name: "Test Recruiter",
    email: "recruiter@example.com",
    company: "Example GmbH",
    message:
      "Front-end role with React and Firebase, remote within the EU. Would you like to talk next week?",
    link: "https://example.com/jobs/frontend",
  });
  check(
    "a second browser can send its own inquiry",
    await visible(recruiter.getByText("Stored in Firestore")),
  );

  // A third browser cannot read the first visitor's status.
  const stranger = await (await newContext()).newPage();
  await stranger.goto(statusUrl, { waitUntil: "networkidle" });
  check(
    "another browser cannot read the status",
    await visible(stranger.getByText("only be seen in the browser that sent")),
  );

  if (shots)
    await sharp(await visitor.screenshot())
      .webp({ quality: 78 })
      .toFile("app/assets/work/this-site-status.webp");

  // The owner signs in through the Auth emulator's Google screen.
  const owner = await (await newContext()).newPage();
  await owner.goto(`${base}/admin/`, { waitUntil: "networkidle" });
  const [popup] = await Promise.all([
    owner.waitForEvent("popup"),
    owner.getByRole("button", { name: "Sign in with Google" }).click(),
  ]);
  await popup.waitForLoadState();
  await popup.getByRole("button", { name: /Add new account/i }).click();
  await popup.locator("#email-input").fill("daniel.butnar@gmail.com");
  await popup
    .locator("#display-name-input")
    .fill("Daniel Butnar")
    .catch(() => {});
  await popup.getByRole("button", { name: /Sign in with Google/i }).click();
  check(
    "the owner sees both inquiries",
    await visible(owner.getByRole("button", { name: "New (2)" })),
  );

  // Opening the inquiry marks it read, and the visitor's page follows without a reload.
  await owner.getByRole("button", { name: /Sample Guesthouse/ }).click();
  check(
    "the visitor's status changes to read",
    await visible(visitor.getByText("Opened in my inbox")),
  );

  await owner.getByLabel(/Private note/).fill("Asked for photos of the rooms.");
  await owner.getByRole("button", { name: "Save note" }).click();
  check(
    "the owner saves a private note",
    await visible(owner.getByRole("button", { name: "Note saved" }), 10_000),
  );

  if (shots) {
    await owner.getByRole("button", { name: /^All \(\d+\)/ }).click();
    await owner.getByRole("button", { name: /Sample Guesthouse/ }).click();
    await owner.waitForTimeout(400);
    await sharp(await owner.screenshot())
      .webp({ quality: 78 })
      .toFile("app/assets/work/this-site-inbox.webp");
  }

  await owner.getByRole("button", { name: "Mark as answered" }).click();
  check(
    "the visitor's status changes to answered",
    await visible(visitor.getByText("Check your spam folder")),
  );
  check("no console errors on the visitor's pages", errors.length === 0, errors.join(" | "));
} catch (error) {
  check("the flow ran to the end", false, String(error));
} finally {
  await browser.close();
  server.close();
}

for (const { name, ok, detail } of results)
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail && !ok ? `: ${detail}` : ""}`);
const failed = results.filter((result) => !result.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
