# danielbutnar.github.io

Daniel's portfolio (GitHub user site of the `danielbutnar` account): case studies, services, an
inquiry form and a private inbox. React 19 + React Router 8 (framework mode, `ssr: false`, every
public page prerendered) on GitHub Pages; Firebase Auth + Firestore for the form and the inbox.
Audience: hiring teams for React + Firebase roles, and small-business clients in RO/DE.

## Commands

- `pnpm check`: typecheck, lint, unit tests. `pnpm test:rules`: rules tests (Java 21 + emulator).
  `pnpm build:e2e && pnpm test:e2e`: end-to-end test (emulators + installed Chrome).
- `pnpm dev` (:5183, uses emulators; start them with `pnpm emulators`), `pnpm build`,
  `pnpm preview` (:5184, GitHub Pages behaviour).
- Site check: `node ~/.claude/skills/web-qa/scripts/site-check.mjs --base http://localhost:5184/ --root build/client`.
  Locally the links to `/serpentina-transfers/` and `/ursa-refuge/` fail: they are other repos on
  the same origin. CI checks the live site after deploy.
- Screenshots: `pnpm screenshots` (sibling repos + live sites), `node scripts/screenshots.mjs --local`
  (this site, needs `pnpm preview`), `node scripts/og.mjs` (link preview + touch icon),
  `firebase emulators:exec --only auth,firestore --project demo-portfolio "node tests/e2e/inquiry-flow.mjs --shots"`
  after `pnpm build:e2e` (status page + inbox with sample data).

## Design

From Claude Design, direction "Timetable" (canvas "Daniel Butnar portfolio", page "Final design").

- Colours (`app/styles/base.css`): paper `#eef1ec`, ink `#14201b`, ink-soft `#2b3832`, muted
  `#4a5750`, rule `#a9b4ac`, field border `#6b7a72`, blue `#1f47b8`, highlighter `#f2cf3a`,
  error `#a1261b`. No dark mode.
- Type: Anybody (condensed display, `font-stretch` 62 to 75 %, weight 800) + Hanken Grotesk.
  Self-hosted Latin subsets only. No third font; code uses the system monospace stack.
- The memorable element is the yellow highlighter: on the flagship project, case study titles and
  the contact band. One motion moment only (the highlighter sweep on the home page), none under
  reduced motion. Square corners, rules that carry table structure, no cards with shadows.
- Numbered markers only where the content is a sequence (process steps, the inquiry flow).
- No inline `style` attributes: the CSP allows `style-src 'self'` only.

## Content rules

- Facts only, from the source repos. No invented numbers, clients, testimonials or results.
  Concept and contest projects are labelled as such; Rope Street's dashboard numbers are demo data.
- Brasov Private Tours: never "tour operator", "travel agency" or "guide"; do not name the legal
  entity; publish nothing about unfinished security or hosting settings of the client.
- Accessibility study: never name an audited shop; link the study page, not the offer page with prices.
- AI use is stated plainly (Claude Design, Claude Code); the owner reviews what ships.
- Prices, offers and business direction are not decided in this repo: the site names no prices.
- DE/RO copy are drafts for Daniel's review. German uses "Sie"; Romanian uses ș ț with comma below.
  `app/i18n/dictionaries.test.ts` and `app/content/content.test.ts` enforce shape, sections and assets.

## Firebase

- `app/firebase/web-config.json` is `null` until the project exists; then the form sends. Rules,
  indexes and the TTL policy deploy with `npx firebase deploy --only firestore --project <id>`.
- Owner = `OWNER_EMAIL` in `app/firebase/owner.ts`, the same address in `firestore.rules`
  (a unit test keeps them equal). Verified Google sign-in only.
- Limits live in `app/inquiry/schema.ts`; the rules tests import them. Change both files together.
- The CSP for Firebase endpoints is built in `scripts/postbuild.mjs` (reads `web-config.json` for
  the auth domain on `/admin`).

## Quirks

- Git Bash rewrites arguments like `/de/` into Windows paths: run URL-path arguments from PowerShell.
- A shell whose working directory is inside `build/` locks it (EBUSY on the next build).
- GNU sed turns `\u` in a replacement into "uppercase next character": edit escapes with Node or the editor.
- Case studies load lazily but must be complete in the prerendered HTML: the case study `loader`
  loads the MDX first, and `entry.server.tsx` renders with `onAllReady` and `progressiveChunkSize: Infinity`.
- pnpm build scripts: `pnpm-workspace.yaml` keeps the Firebase and sharp postinstall scripts off.
