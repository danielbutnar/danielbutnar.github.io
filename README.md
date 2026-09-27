# danielbutnar.github.io

My portfolio: case studies, services and an inquiry form, in English, German and Romanian.
Live at **https://danielbutnar.github.io/**.

It is also a working React and Firebase app. The case study
[“This site”](https://danielbutnar.github.io/work/this-site/) explains the decisions; the short version:

- **React 19 + React Router 8** in framework mode. Every public page is prerendered to HTML at
  build time (30 pages, 10 per language), because GitHub Pages serves files only.
- **Firebase** for everything that remembers something:
  - an inquiry form that writes to **Cloud Firestore** after an **anonymous sign-in**;
  - a status page that follows the inquiry live with `onSnapshot`;
  - a private inbox at `/admin` with **Google sign-in**, owner only.
- **Security rules are the backend** (`firestore.rules`): exact fields, types and lengths, the
  sender's own ID, server timestamps, a one-inquiry-per-minute limit built from a batched write and
  `getAfter()`, and a 12-month time-to-live.
- **Firebase loads only when needed**: the home page ships about 130 KB of JavaScript (gzip) and no
  Firebase code; the SDK arrives with a dynamic `import()` when someone presses Send.
- **A Content Security Policy per page**, computed at build time from the page's own inline scripts.

## Tests

| Command                           | What it runs                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                       | 65 unit tests: validation, locale paths, dictionaries, content integrity                                                                        |
| `pnpm test:rules`                 | 27 security-rule tests against the Firestore emulator                                                                                           |
| `pnpm build:e2e && pnpm test:e2e` | The inquiry flow in Chrome against the Auth and Firestore emulators: send, validate, rate limit, a stranger refused, owner sign-in, live status |
| `pnpm check`                      | typecheck, lint and unit tests                                                                                                                  |

The emulators need Java 21. The end-to-end test drives the installed Chrome. CI
(`.github/workflows/deploy.yml`) runs all of it on every push, deploys `main` to GitHub Pages and
then runs [site-check](https://github.com/danielbutnar2003/site-qa) against the live site.

## Working on it

```bash
pnpm install
pnpm emulators   # Auth + Firestore emulators, UI on :4000
pnpm dev         # http://localhost:5183, talks to the emulators
```

`pnpm build` writes the site to `build/client`; `pnpm preview` serves it the way GitHub Pages does,
on :5184.

| Folder         | What is in it                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `app/routes`   | Pages. English at `/`, German under `/de`, Romanian under `/ro`                                 |
| `app/content`  | Project data (`projects.ts`), case studies and the privacy notice as MDX, one file per language |
| `app/i18n`     | UI text. `en.ts` defines the shape; `de.ts` and `ro.ts` must match it                           |
| `app/inquiry`  | Form validation (shared limits with the rules), sending and live status                         |
| `app/firebase` | Lazy Firebase client, web config, owner address                                                 |
| `scripts`      | Post-build (404, CSP, sitemap), local server, screenshots, link preview image                   |
| `tests`        | Rules tests and the end-to-end test                                                             |

## Connecting a Firebase project

Until `app/firebase/web-config.json` holds a config, the form offers e-mail instead of sending.

1. Create a Firebase project (Spark plan) with a web app, and paste its config object into
   `app/firebase/web-config.json`. These values identify the project; they are not secrets.
2. Firestore: create the database in an EU location.
3. Authentication: enable the **Anonymous** and **Google** providers, and add
   `danielbutnar.github.io` to the authorized domains.
4. `npx firebase login`, then `npx firebase deploy --only firestore --project <project-id>`: this
   deploys the rules and the time-to-live policy on `expireAt`.

## Credits

Design made in Claude Design, code written with Claude Code, reviewed and tested as described
above. Fonts: [Anybody](https://github.com/Etcetera-Type-Co/Anybody) and
[Hanken Grotesk](https://github.com/marcologous/hanken-grotesk), both under the SIL Open Font
License (see `app/assets/fonts`). Screenshots are of my own projects.
