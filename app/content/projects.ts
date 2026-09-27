import type { Locale } from "~/i18n/locales";

export type ProjectKind = "client" | "own" | "contest" | "concept" | "research";
export type ProjectStatus = "prelaunch" | "live" | "liveDemo" | "concept" | "published";
type Localized = Record<Locale, string>;

export interface Project {
  slug: string;
  /** The name as written everywhere, unless localName translates it. */
  name: string;
  localName?: Localized;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Main technologies, most important first. The work table shows the first four. */
  stack: string[];
  /** One line for the work table. */
  what: Localized;
  /** One or two sentences under the case study title. */
  summary: Localized;
  role: Localized;
  when: Localized;
  links: { kind: "live" | "code"; href: string }[];
  /** Screenshot file in app/assets/work, without extension. */
  image: string;
  imageAlt: Localized;
}

const september2026: Localized = {
  en: "September 2026",
  de: "September 2026",
  ro: "Septembrie 2026",
};
const designBuildDeploy: Localized = {
  en: "Design, build, deploy",
  de: "Design, Entwicklung, Deployment",
  ro: "Design, dezvoltare, lansare",
};

// Client work first, then the site itself, then contest, concept and research work.
export const projects: Project[] = [
  {
    slug: "brasov-private-tours",
    name: "Brasov Private Tours",
    kind: "client",
    status: "prelaunch",
    stack: ["Next.js 16", "React 19", "Postgres", "Prisma 7", "Stripe", "Resend", "Vercel"],
    what: {
      en: "Booking and card payments for a Brașov company that runs private day trips and airport transfers.",
      de: "Online-Buchung und Kartenzahlung für ein Unternehmen in Brașov, das private Tagesausflüge und Flughafentransfers fährt.",
      ro: "Rezervări și plăți cu cardul pentru o firmă din Brașov care face excursii private de o zi și transferuri la aeroport.",
    },
    summary: {
      en: "Online booking and card payments for a Brașov company that runs private day trips and airport transfers. Built so a car is never sold twice.",
      de: "Online-Buchung und Kartenzahlung für ein Unternehmen in Brașov, das private Tagesausflüge und Flughafentransfers fährt. So gebaut, dass kein Auto doppelt verkauft wird.",
      ro: "Rezervări online și plăți cu cardul pentru o firmă din Brașov care face excursii private de o zi și transferuri la aeroport. Construit astfel încât nicio mașină să nu fie vândută de două ori.",
    },
    role: designBuildDeploy,
    when: september2026,
    links: [{ kind: "live", href: "https://brasov-private-tours.vercel.app/" }],
    image: "brasov-private-tours-desktop",
    imageAlt: {
      en: "Home page of Brasov Private Tours: a trip finder over a photo of Făgăraș fortress.",
      de: "Startseite von Brasov Private Tours: eine Ausflugssuche über einem Foto der Burg Făgăraș.",
      ro: "Pagina principală Brasov Private Tours: căutarea de excursii peste o fotografie a cetății Făgăraș.",
    },
  },
  {
    slug: "this-site",
    name: "This site",
    localName: { en: "This site", de: "Diese Website", ro: "Acest site" },
    kind: "own",
    status: "live",
    stack: [
      "React 19",
      "React Router 8",
      "Firebase Auth",
      "Cloud Firestore",
      "TypeScript",
      "Vite",
      "Vitest",
    ],
    what: {
      en: "A portfolio with a structured inquiry form and a private inbox that updates live.",
      de: "Ein Portfolio mit strukturiertem Anfrageformular und einem privaten Posteingang, der sich live aktualisiert.",
      ro: "Un portofoliu cu formular de cerere structurat și o căsuță privată care se actualizează live.",
    },
    summary: {
      en: "This portfolio, built in React on Firebase. Visitors send a structured inquiry and can watch its status; I answer from a private inbox that updates live.",
      de: "Dieses Portfolio, gebaut mit React auf Firebase. Besucher senden eine strukturierte Anfrage und sehen ihren Status; ich antworte aus einem privaten Posteingang, der sich live aktualisiert.",
      ro: "Acest portofoliu, construit în React pe Firebase. Vizitatorii trimit o cerere structurată și îi pot urmări statusul; eu răspund dintr-o căsuță privată care se actualizează live.",
    },
    role: designBuildDeploy,
    when: september2026,
    links: [
      { kind: "live", href: "https://danielbutnar.github.io/" },
      { kind: "code", href: "https://github.com/danielbutnar/danielbutnar.github.io" },
    ],
    image: "this-site-desktop",
    imageAlt: {
      en: "Home page of this site: a large headline and the work table.",
      de: "Startseite dieser Website: eine große Überschrift und die Projekttabelle.",
      ro: "Pagina principală a acestui site: un titlu mare și tabelul cu proiecte.",
    },
  },
  {
    slug: "rope-street-tattoo",
    name: "Rope Street Tattoo",
    kind: "contest",
    status: "liveDemo",
    stack: [
      "React",
      "Postgres with row-level security",
      "Stripe (test mode)",
      "Lovable",
      "Edge functions",
    ],
    what: {
      en: "From first message to paid booking for a one-chair tattoo studio. Entry for the Contra × Lovable challenge.",
      de: "Von der ersten Nachricht bis zur bezahlten Buchung für ein Tattoo-Studio mit einem Stuhl. Beitrag zur Contra × Lovable Challenge.",
      ro: "De la primul mesaj la programarea plătită, pentru un studio de tatuaje cu un singur scaun. Participare la provocarea Contra × Lovable.",
    },
    summary: {
      en: "A one-chair tattoo studio where clients describe an idea in their own words and get a price and a time on the spot. The AI reads; fixed rules decide.",
      de: "Ein Tattoo-Studio mit einem Stuhl: Kunden beschreiben ihre Idee in eigenen Worten und bekommen sofort Preis und Termin. Die KI liest, feste Regeln entscheiden.",
      ro: "Un studio de tatuaje cu un singur scaun, unde clienții descriu ideea în cuvintele lor și primesc pe loc un preț și o oră. AI-ul citește, regulile fixe decid.",
    },
    role: {
      en: "Brief, rules, prompts, QA, demo video; app built in Lovable",
      de: "Briefing, Regeln, Prompts, QA, Demovideo; App in Lovable gebaut",
      ro: "Brief, reguli, prompturi, QA, video demo; aplicația construită în Lovable",
    },
    when: september2026,
    links: [{ kind: "live", href: "https://rope-street-tattoo.lovable.app/" }],
    image: "rope-street-tattoo-desktop",
    imageAlt: {
      en: "Rope Street Tattoo home page: a box for the tattoo idea next to a line drawing of mountains.",
      de: "Startseite von Rope Street Tattoo: ein Feld für die Tattoo-Idee neben einer Strichzeichnung von Bergen.",
      ro: "Pagina principală Rope Street Tattoo: o casetă pentru ideea de tatuaj lângă un desen cu munți.",
    },
  },
  {
    slug: "serpentina-transfers",
    name: "Serpentina Transfers",
    kind: "concept",
    status: "concept",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
    what: {
      en: "Airport-transfer booking in English, Romanian and German, with a fixed price in seconds.",
      de: "Buchung von Flughafentransfers auf Englisch, Rumänisch und Deutsch, mit Festpreis in Sekunden.",
      ro: "Rezervări de transferuri la aeroport în engleză, română și germană, cu preț fix în câteva secunde.",
    },
    summary: {
      en: "A concept booking site for a fictional airport-transfer company in Brașov: a fixed price in seconds and a booking in under a minute on a phone, in three languages.",
      de: "Eine Konzept-Buchungsseite für ein fiktives Transferunternehmen in Brașov: Festpreis in Sekunden, Buchung in unter einer Minute am Handy, in drei Sprachen.",
      ro: "Un site-concept de rezervări pentru o firmă fictivă de transferuri din Brașov: preț fix în câteva secunde și rezervare în sub un minut pe telefon, în trei limbi.",
    },
    role: {
      en: "Design direction, build, deploy",
      de: "Designrichtung, Entwicklung, Deployment",
      ro: "Direcția de design, dezvoltare, lansare",
    },
    when: september2026,
    links: [
      { kind: "live", href: "https://danielbutnar.github.io/serpentina-transfers/" },
      { kind: "code", href: "https://github.com/danielbutnar/serpentina-transfers" },
    ],
    image: "serpentina-transfers-desktop",
    imageAlt: {
      en: "Serpentina Transfers home page: a bold headline and a yellow fare panel with a €105 fixed price.",
      de: "Startseite von Serpentina Transfers: eine kräftige Überschrift und ein gelbes Preisfeld mit 105 € Festpreis.",
      ro: "Pagina principală Serpentina Transfers: un titlu mare și un panou galben cu prețul fix de 105 €.",
    },
  },
  {
    slug: "ursa",
    name: "Ursa",
    kind: "concept",
    status: "concept",
    stack: ["HTML", "CSS", "JavaScript", "Canvas 2D", "SVG", "Web Workers"],
    what: {
      en: "Booking site for a mountain refuge, with a generated trail map and a live night sky.",
      de: "Buchungsseite für eine Berghütte, mit generierter Wanderkarte und live berechnetem Nachthimmel.",
      ro: "Site de rezervări pentru un refugiu montan, cu hartă de trasee generată și cer de noapte calculat live.",
    },
    summary: {
      en: "A concept booking site for a fictional stone refuge at 1,842 m in the Făgăraș Mountains. No photos: the map, the routes and the night sky are drawn by code.",
      de: "Eine Konzept-Buchungsseite für eine fiktive Steinhütte auf 1.842 m im Făgăraș-Gebirge. Keine Fotos: Karte, Routen und Nachthimmel zeichnet der Code.",
      ro: "Un site-concept de rezervări pentru un refugiu fictiv de piatră la 1.842 m în Munții Făgăraș. Fără fotografii: harta, traseele și cerul de noapte sunt desenate din cod.",
    },
    role: designBuildDeploy,
    when: september2026,
    links: [
      { kind: "live", href: "https://danielbutnar.github.io/ursa-refuge/" },
      { kind: "code", href: "https://github.com/danielbutnar/ursa-refuge" },
    ],
    image: "ursa-desktop",
    imageAlt: {
      en: "Ursa home page: the headline “Sleep above the treeline” over a generated topographic map with three marked trails.",
      de: "Startseite von Ursa: die Überschrift „Sleep above the treeline“ über einer generierten topografischen Karte mit drei markierten Wegen.",
      ro: "Pagina principală Ursa: titlul „Sleep above the treeline” peste o hartă topografică generată, cu trei trasee marcate.",
    },
  },
  {
    slug: "accessibility-study",
    name: "Accessibility study",
    kind: "research",
    status: "published",
    stack: ["axe-core 4.13", "Playwright", "Node 24", "GitHub Actions"],
    what: {
      en: "44 online shops in Romania and Germany tested against WCAG 2.1 AA. 37 of the 42 that loaded failed.",
      de: "44 Onlineshops in Rumänien und Deutschland nach WCAG 2.1 AA getestet. 37 der 42 erreichbaren sind durchgefallen.",
      ro: "44 de magazine online din România și Germania testate după WCAG 2.1 AA. 37 din cele 42 care s-au încărcat au picat.",
    },
    summary: {
      en: "An automated check of 44 online shops against WCAG 2.1 AA, and the QA tools I now run on every site I build.",
      de: "Eine automatische Prüfung von 44 Onlineshops nach WCAG 2.1 AA, und die QA-Werkzeuge, die ich seitdem bei jeder Website einsetze.",
      ro: "O verificare automată a 44 de magazine online după WCAG 2.1 AA și uneltele de QA pe care le folosesc acum la fiecare site.",
    },
    role: {
      en: "Study design, audit tooling, analysis",
      de: "Studiendesign, Prüfwerkzeuge, Auswertung",
      ro: "Designul studiului, unelte de audit, analiză",
    },
    when: september2026,
    links: [
      {
        kind: "live",
        href: "https://danielbutnar2003.github.io/accessibility-portfolio/en/study.html",
      },
      { kind: "code", href: "https://github.com/danielbutnar2003/site-qa" },
    ],
    image: "accessibility-study-desktop",
    imageAlt: {
      en: "The published study page with the results table.",
      de: "Die veröffentlichte Studienseite mit der Ergebnistabelle.",
      ro: "Pagina publicată a studiului, cu tabelul de rezultate.",
    },
  },
];

export const PROJECT_SLUGS = projects.map((project) => project.slug);

export function projectName(project: Project, locale: Locale): string {
  return project.localName?.[locale] ?? project.name;
}

export function findProject(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function nextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length]!;
}
