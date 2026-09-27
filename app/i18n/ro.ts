import type { Dict } from "./en";

// Draft Romanian copy, addressing the reader with "dumneavoastră" in forms and
// "tu" nowhere, to stay neutral. Flagged for the owner's review.

export const ro: Dict = {
  langName: "Română",
  meta: {
    siteName: "Daniel Butnar",
    homeTitle: "Daniel Butnar, dezvoltator React și TypeScript în Brașov",
    homeDescription:
      "Sisteme de rezervări și aplicații web în React, TypeScript și Firebase, testate și accesibile. Studii de caz, servicii și formular de cerere.",
    caseTitle: (name: string) => `${name}: studiu de caz`,
    contactTitle: "Trimiteți o cerere",
    contactDescription:
      "Trimiteți-i lui Daniel Butnar o cerere despre un proiect, un post sau orice altceva. Răspunsul vine pe e-mail, în română, engleză sau germană.",
    statusTitle: "Statusul cererii",
    privacyTitle: "Politica de confiden\u00ADțialitate",
    privacyDescription:
      "Ce păstrează acest site când trimiteți o cerere, unde, cât timp și ce drepturi aveți.",
    notFoundTitle: "Pagina nu a fost găsită",
  },
  a11y: {
    skip: "Salt la conținut",
    mainNav: "Navigare principală",
    footerNav: "Subsol",
    language: "Limba",
    menuOpen: "Deschide meniul",
    menuClose: "Închide meniul",
  },
  nav: {
    work: "Proiecte",
    services: "Servicii",
    hiring: "Angajare",
    about: "Despre",
    inquiry: "Trimiteți o cerere",
  },
  kinds: {
    client: "Proiect pentru client",
    own: "Proiect propriu",
    contest: "Participare la concurs",
    concept: "Concept",
    research: "Studiu și unelte",
  },
  statuses: {
    prelaunch: "Înainte de lansare",
    live: "Online",
    liveDemo: "Demo online",
    concept: "Concept",
    published: "Publicat",
  },
  home: {
    h1: "Sisteme de rezervări și aplicații web care funcționează și în viața reală.",
    intro:
      "Sunt Daniel, dezvoltator React și TypeScript în Brașov. Construiesc totul: fluxul de rezervare, plățile, panoul de administrare și testele care le țin în frâu. Lucrez în română, germană și engleză.",
    openTo: "Deschis pentru",
    openToRole: "Un post cu React și Firebase",
    openToProjects: "Proiecte pentru firme mici",
    seeWork: "Vedeți proiectele",
    workTitle: "Proiecte",
    workNote: "Întâi proiectele pentru clienți. Situația din septembrie 2026.",
    cols: {
      project: "Proiect",
      what: "Ce este",
      stack: "Construit cu",
      status: "Status",
      caseStudy: "Studiu de caz",
    },
    builtWith: "Construit cu",
    status: "Status",
    read: "Citiți",
    teaser: {
      title: "Doi oaspeți, o mașină, aceeași seară.",
      text: "La Brasov Private Tours, oaspeții rezervă și plătesc online. Partea grea: nicio mașină nu are voie să fie vândută de două ori, nici când doi oameni plătesc în aceeași secundă, iar o plată întârziată se rambursează singură.",
      facts: [
        ["Rol", "Design, dezvoltare, lansare"],
        ["Când", "Septembrie 2026"],
        ["Teste", "79 unitare, 24 de integrare, 16 end-to-end"],
        ["Limbi", "Engleză, română, italiană, spaniolă"],
      ],
      link: "Citiți studiul de caz",
      caption: "brasov-private-tours.vercel.app, septembrie 2026",
    },
    services: {
      title: "Ce pot construi pentru dumneavoastră",
      note: "Fiecare trimite la un proiect în care l-am făcut.",
      seenIn: "Vedeți în",
      items: {
        booking: {
          title: "Site-uri de rezervări",
          text: "Rezervări online cu calendar, plăți cu cardul și panou de administrare. Pentru excursii, transferuri, studiouri și pensiuni.",
        },
        firebase: {
          title: "Aplicații web cu React și Firebase",
          text: "Formulare de cerere, dashboard-uri și zone de membri, cu autentificare și date care se actualizează live.",
        },
        accessibility: {
          title: "Verificări și remedieri de accesibilitate",
          text: "Vă testez site-ul după WCAG 2.1 AA, cu unelte și manual, apoi repar barierele în cod.",
        },
        languages: {
          title: "Site-uri în trei limbi",
          text: "Română, germană și engleză. Româna și germana sunt limbile mele materne, deci clienții dumneavoastră citesc fraze adevărate.",
        },
      },
    },
    process: {
      title: "Cum decurge un proiect",
      steps: [
        {
          title: "Îmi descrieți ce aveți nevoie",
          text: "Prin formularul de cerere sau pe e-mail. De obicei ajunge o discuție scurtă ca să înțeleg.",
        },
        {
          title: "Primiți un plan scris",
          text: "Ce construiesc, cât durează și cât costă, înainte să înceapă lucrul.",
        },
        {
          title: "Vedeți devreme că funcționează",
          text: "Un link de previzualizare pe care îl deschideți pe telefon, nu capturi de ecran. Părerea dumneavoastră intră în versiunea următoare.",
        },
        {
          title: "Lansare și predare",
          text: "Testat pe telefon și cu tastatura, găzduit pe conturi pe numele dumneavoastră, cu note despre cum se folosește.",
        },
      ],
    },
    hiring: {
      title: "Pentru angajatori",
      text: "Caut un post în care să construiesc aplicații cu React și Firebase. Cel mai repede îmi judecați munca după codul acestui site: regulile de securitate, testele lor și CI-ul care le rulează.",
      ai: "Lucrez cu unelte AI de programare, printre ele Claude Code, și răspund pentru ce livrez: planul, review-ul și testele.",
      caseCta: "Citiți studiul de caz Firebase",
      codeCta: "Codul pe GitHub",
      stack: [
        ["Front end", "React 19, TypeScript, React Router, Next.js App Router"],
        [
          "Back end",
          "Firebase Auth, Firestore și reguli de securitate, Postgres cu Prisma, Stripe",
        ],
        ["Testare", "Vitest, Playwright, emulatorul Firebase, GitHub Actions"],
        ["Calitate", "WCAG 2.1 AA, axe, Lighthouse, Core Web Vitals"],
        ["Limbi", "Engleză (fluent), germană și română (materne)"],
      ],
    },
    about: {
      title: "Despre mine",
      p1: "Locuiesc în Brașov. Româna și germana sunt limbile mele materne, iar în engleză lucrez zilnic. Studiez la Politehnica București, la linia de studiu în limba germană.",
      p2: "Țin la părțile pe care nu le vede nimeni: ce se întâmplă când doi clienți rezervă în același timp, când o plată ajunge târziu, când cineva folosește un cititor de ecran. Am fondat și GoActive Bucharest, un grup de tineri care organizează schimburi Erasmus+, și i-am construit site-ul.",
      photoAlt: "Daniel Butnar",
    },
    contact: {
      title: "Spuneți-mi de ce aveți nevoie.",
      text: "Un proiect, un post liber sau o întrebare. Citesc fiecare mesaj personal.",
      cta: "Trimiteți o cerere",
    },
  },
  channels: {
    github: "GitHub",
    linkedin: "LinkedIn",
    contra: "Contra",
  },
  footer: {
    copyright: "© 2026 Daniel Butnar.",
    builtWith: "Construit cu React și Firebase.",
    privacy: "Confidențialitate",
    code: "Codul pe GitHub",
  },
  caseStudy: {
    allWork: "Toate proiectele",
    facts: {
      type: "Tip",
      role: "Rol",
      when: "Când",
      stack: "Construit cu",
      status: "Status",
      links: "Linkuri",
    },
    links: { live: "Site", code: "Cod" },
    onThisPage: "Pe această pagină",
    sections: {
      job: "Cerința",
      built: "Ce am construit",
      hard: "Părțile grele",
      results: "Rezultate",
      next: "Ce aș face mai departe",
    },
    nextCase: "Următorul studiu de caz",
    shotAlt: (name: string) => `Captură de ecran din ${name}`,
  },
  contact: {
    title: "Trimiteți o cerere",
    intro:
      "Un proiect, un post liber sau o întrebare. Citesc fiecare mesaj personal și răspund pe e-mail.",
    orWrite: "Sau scrieți-mi direct",
    privacy:
      "Ce trimiteți se păstrează în Firebase (Google Cloud, UE) ca să vă pot răspunde și se șterge după 12 luni.",
    privacyLink: "Politica de confidențialitate",
    kindLegend: "Despre ce este vorba?",
    kinds: {
      project: "Un proiect pentru firma mea",
      job: "Un post liber",
      other: "Altceva",
    },
    name: "Numele dumneavoastră",
    email: "E-mail",
    company: {
      project: "Firmă sau site",
      job: "Firmă",
      other: "Firmă sau site",
    },
    optional: "(opțional)",
    message: {
      project: "Ce ar trebui să facă?",
      job: "Despre post",
      other: "Mesajul dumneavoastră",
    },
    messageHint: {
      project:
        "Câteva propoziții sunt de ajuns. Ce ar trebui să poată face clienții dumneavoastră pe el?",
      job: "Postul, echipa și felul în care lucrați.",
      other: "Întrebați-mă orice.",
    },
    count: (count: number, max: number) =>
      `${count} din ${max.toLocaleString("ro-RO")} de caractere`,
    timeline: "Când aveți nevoie de el?",
    timelines: {
      none: "Fără termen fix",
      month: "Într-o lună",
      quarter: "În 1–3 luni",
      later: "Mai târziu anul acesta",
    },
    link: "Link către anunț",
    replyLegend: "Răspundeți-mi în",
    honeypot: "Lăsați acest câmp gol",
    submit: "Trimiteți cererea",
    sending: "Se trimite…",
    submitHint: "Pagina următoare arată când am citit-o.",
    errorsTitle: (count: number) =>
      count === 1 ? "Un câmp trebuie corectat" : `${count} câmpuri trebuie corectate`,
    errors: {
      name: { required: "Scrieți-vă numele", tooLong: "Cel mult 100 de caractere" },
      email: {
        required: "Scrieți-vă adresa de e-mail",
        email: "Scrieți o adresă de forma nume@exemplu.ro",
        tooLong: "Cel mult 200 de caractere",
      },
      company: { tooLong: "Cel mult 200 de caractere" },
      message: {
        required: "Scrieți câteva propoziții",
        tooShort: "Scrieți cel puțin 20 de caractere, ca să înțeleg cerința",
        tooLong: "Scurtați textul la 2.000 de caractere",
      },
      link: {
        link: "Scrieți un link care începe cu https://",
        tooLong: "Cel mult 500 de caractere",
      },
    },
    fieldNames: {
      name: "Numele",
      email: "E-mail",
      company: "Firmă",
      message: "Mesaj",
      link: "Link",
    },
    sendError: {
      title: "Cererea nu a fost trimisă",
      rateLimited:
        "Ați trimis o cerere acum mai puțin de un minut. Așteptați puțin, apoi trimiteți-o pe aceasta.",
      network: "Verificați conexiunea și încercați din nou. Sau scrieți-mi direct:",
      unavailable: "Formularul nu poate trimite acum. Vă rog să-mi scrieți direct:",
    },
  },
  status: {
    title: "Trimis. Mulțumesc.",
    intro:
      "Cererea este salvată. Pagina se schimbă singură când o citesc și când răspund. O puteți închide: răspunsul vine pe e-mail.",
    stepsLabel: "Statusul cererii",
    received: "Primită",
    receivedDetail: "Salvată în Firestore",
    read: "Citită de Daniel",
    readDetail: "Deschisă în căsuța mea",
    readWaiting: "Încă nu. Rândul acesta se actualizează singur.",
    answered: "Răspuns trimis pe e-mail",
    answeredDetail: "Verificați folderul de spam dacă nu primiți nimic.",
    answeredWaiting: "După ce o citesc.",
    waiting: "În așteptare",
    loading: "Se încarcă statusul…",
    denied:
      "Statusul se vede doar în browserul din care a fost trimisă cererea. Cererea nu s-a pierdut: răspund pe e-mail.",
    missing: "Nu există nicio cerere de afișat aici.",
    unavailable: "Statusul nu se poate încărca acum. Cererea este salvată și răspund pe e-mail.",
    copyTitle: "Ce ați trimis",
    copy: {
      kind: "Subiect",
      name: "Nume",
      email: "E-mail",
      company: "Firmă",
      timeline: "Termen",
      link: "Link",
      replyLang: "Răspuns în",
      message: "Mesaj",
    },
    back: "Înapoi la proiecte",
    another: "Trimiteți altă cerere",
    time: (date: Date) =>
      date.toLocaleString("ro-RO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  notFound: {
    title: "Pagina nu a fost găsită",
    text: "Această adresă nu există pe site. Poate a fost mutată când s-a schimbat site-ul.",
    home: "Mergeți la pagina principală",
    work: "Vedeți proiectele",
  },
  error: {
    title: "Ceva nu a mers",
    text: "Pagina nu a putut fi afișată. Reîncărcați-o sau mergeți la pagina principală.",
    home: "Mergeți la pagina principală",
  },
};
