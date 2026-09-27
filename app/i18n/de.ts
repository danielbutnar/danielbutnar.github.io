import type { Dict } from "./en";

// Draft German copy, formal "Sie". Flagged for the owner's review.

export const de: Dict = {
  langName: "Deutsch",
  meta: {
    siteName: "Daniel Butnar",
    homeTitle: "Daniel Butnar, React- und TypeScript-Entwickler in Brașov",
    homeDescription:
      "Buchungssysteme und Web-Apps mit React, TypeScript und Firebase, getestet und barrierearm. Fallstudien, Leistungen und ein Anfrageformular.",
    caseTitle: (name: string) => `${name}: Fallstudie`,
    contactTitle: "Anfrage senden",
    contactDescription:
      "Senden Sie Daniel Butnar eine Anfrage zu einem Projekt, einer Stelle oder etwas anderem. Antwort per E-Mail auf Deutsch, Englisch oder Rumänisch.",
    statusTitle: "Status Ihrer Anfrage",
    privacyTitle: "Datenschutz\u00ADerklärung",
    privacyDescription:
      "Was diese Website speichert, wenn Sie eine Anfrage senden, wo, wie lange, und welche Rechte Sie haben.",
    notFoundTitle: "Seite nicht gefunden",
  },
  a11y: {
    skip: "Zum Inhalt springen",
    mainNav: "Hauptnavigation",
    footerNav: "Fußzeile",
    language: "Sprache",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
  },
  nav: {
    work: "Arbeiten",
    services: "Leistungen",
    hiring: "Für Arbeitgeber",
    about: "Über mich",
    inquiry: "Anfrage senden",
  },
  kinds: {
    client: "Kundenprojekt",
    own: "Eigenes Projekt",
    contest: "Wettbewerbsbeitrag",
    concept: "Konzept",
    research: "Studie und Werkzeuge",
  },
  statuses: {
    prelaunch: "Vor dem Start",
    live: "Online",
    liveDemo: "Live-Demo",
    concept: "Konzept",
    published: "Veröffentlicht",
  },
  home: {
    h1: "Buchungs\u00ADsysteme und Web-Apps, die im Alltag bestehen.",
    intro:
      "Ich bin Daniel, React- und TypeScript-Entwickler in Brașov, Rumänien. Ich baue das Ganze: den Buchungsablauf, die Zahlungen, die Verwaltung und die Tests, die alles zuverlässig halten. Ich arbeite auf Deutsch, Englisch und Rumänisch.",
    openTo: "Offen für",
    openToRole: "Eine Stelle mit React und Firebase",
    openToProjects: "Projekte für kleine Unternehmen",
    seeWork: "Arbeiten ansehen",
    workTitle: "Arbeiten",
    workNote: "Kundenprojekte zuerst. Stand: September 2026.",
    cols: {
      project: "Projekt",
      what: "Worum es geht",
      stack: "Gebaut mit",
      status: "Status",
      caseStudy: "Fallstudie",
    },
    builtWith: "Gebaut mit",
    status: "Status",
    read: "Lesen",
    teaser: {
      title: "Zwei Gäste, ein Auto, derselbe Abend.",
      text: "Bei Brasov Private Tours buchen und bezahlen Gäste online. Die schwierige Stelle: Kein Auto darf doppelt verkauft werden, auch wenn zwei Personen in derselben Sekunde zahlen, und eine verspätete Zahlung wird automatisch erstattet.",
      facts: [
        ["Rolle", "Design, Entwicklung, Deployment"],
        ["Zeitraum", "September 2026"],
        ["Tests", "79 Unit-, 24 Integrations-, 16 End-to-End-Tests"],
        ["Sprachen", "Englisch, Rumänisch, Italienisch, Spanisch"],
      ],
      link: "Fallstudie lesen",
      caption: "brasov-private-tours.vercel.app, September 2026",
    },
    services: {
      title: "Was ich für Sie bauen kann",
      note: "Jeder Punkt verweist auf ein Projekt, in dem ich es umgesetzt habe.",
      seenIn: "Zu sehen in",
      items: {
        booking: {
          title: "Buchungswebsites",
          text: "Online-Buchung mit Kalender, Kartenzahlung und Verwaltung. Für Touren, Transfers, Studios und Pensionen.",
        },
        firebase: {
          title: "Web-Apps mit React und Firebase",
          text: "Anfrageformulare, Dashboards und Mitgliederbereiche mit Anmeldung und Daten, die sich live aktualisieren.",
        },
        accessibility: {
          title: "Barrierefreiheit prüfen und beheben",
          text: "Ich prüfe Ihre Website nach WCAG 2.1 AA, mit Werkzeugen und von Hand, und behebe die Barrieren im Code.",
        },
        languages: {
          title: "Websites in drei Sprachen",
          text: "Deutsch, Englisch und Rumänisch. Deutsch und Rumänisch sind meine Muttersprachen, Ihre Kunden lesen also echte Sätze.",
        },
      },
    },
    process: {
      title: "So läuft ein Projekt ab",
      steps: [
        {
          title: "Sie beschreiben die Aufgabe",
          text: "Über das Anfrageformular oder per E-Mail. Meist genügt ein kurzes Gespräch, um sie zu verstehen.",
        },
        {
          title: "Sie erhalten einen schriftlichen Plan",
          text: "Was ich baue, wie lange es dauert und was es kostet, bevor die Arbeit beginnt.",
        },
        {
          title: "Sie sehen früh, dass es funktioniert",
          text: "Einen Vorschau-Link, den Sie am Handy öffnen können, keine Screenshots. Ihr Feedback fließt in die nächste Version.",
        },
        {
          title: "Start und Übergabe",
          text: "Getestet am Handy und mit der Tastatur, gehostet auf Konten in Ihrem Namen, mit Notizen zum Betrieb.",
        },
      ],
    },
    hiring: {
      title: "Für Arbeitgeber",
      text: "Ich suche eine Stelle, in der ich Apps mit React und Firebase baue. Am schnellsten beurteilen Sie meine Arbeit am Code dieser Website: die Security Rules, ihre Tests und die CI, die sie ausführt.",
      ai: "Ich arbeite mit KI-Werkzeugen wie Claude Code und stehe für das Ergebnis ein: Plan, Review und Tests.",
      caseCta: "Firebase-Fallstudie lesen",
      codeCta: "Code auf GitHub",
      stack: [
        ["Frontend", "React 19, TypeScript, React Router, Next.js App Router"],
        ["Backend", "Firebase Auth, Firestore und Security Rules, Postgres mit Prisma, Stripe"],
        ["Tests", "Vitest, Playwright, der Firebase-Emulator, GitHub Actions"],
        ["Qualität", "WCAG 2.1 AA, axe, Lighthouse, Core Web Vitals"],
        ["Sprachen", "Englisch (fließend), Deutsch und Rumänisch (Muttersprachen)"],
      ],
    },
    about: {
      title: "Über mich",
      p1: "Ich lebe in Brașov. Deutsch und Rumänisch sind meine Muttersprachen, auf Englisch arbeite ich jeden Tag. Ich studiere an der Politehnica Bukarest im deutschsprachigen Studiengang.",
      p2: "Mir sind die Teile wichtig, die man nicht sieht: was passiert, wenn zwei Kunden gleichzeitig buchen, wenn eine Zahlung zu spät ankommt, wenn jemand einen Screenreader nutzt. Außerdem habe ich GoActive Bucharest gegründet, eine Jugendgruppe für Erasmus+-Austausche, und ihre Website gebaut.",
      photoAlt: "Daniel Butnar",
    },
    contact: {
      title: "Sagen Sie mir, was Sie brauchen.",
      text: "Ein Projekt, eine Stelle oder eine Frage. Ich lese jede Nachricht selbst.",
      cta: "Anfrage senden",
    },
  },
  channels: {
    github: "GitHub",
    linkedin: "LinkedIn",
    contra: "Contra",
  },
  footer: {
    copyright: "© 2026 Daniel Butnar.",
    builtWith: "Gebaut mit React und Firebase.",
    privacy: "Datenschutz",
    code: "Code auf GitHub",
  },
  caseStudy: {
    allWork: "Alle Arbeiten",
    facts: {
      type: "Art",
      role: "Rolle",
      when: "Zeitraum",
      stack: "Gebaut mit",
      status: "Status",
      links: "Links",
    },
    links: { live: "Website", code: "Code" },
    onThisPage: "Auf dieser Seite",
    sections: {
      job: "Die Aufgabe",
      built: "Was ich gebaut habe",
      hard: "Die schwierigen Stellen",
      results: "Ergebnisse",
      next: "Was ich als Nächstes tun würde",
    },
    nextCase: "Nächste Fallstudie",
    shotAlt: (name: string) => `Screenshot von ${name}`,
  },
  contact: {
    title: "Anfrage senden",
    intro:
      "Ein Projekt, eine Stelle oder eine Frage. Ich lese jede Nachricht selbst und antworte per E-Mail.",
    orWrite: "Oder direkt schreiben",
    privacy:
      "Was Sie senden, wird in Firebase (Google Cloud, EU) gespeichert, damit ich antworten kann, und nach 12 Monaten gelöscht.",
    privacyLink: "Datenschutzerklärung",
    kindLegend: "Worum geht es?",
    kinds: {
      project: "Ein Projekt für mein Unternehmen",
      job: "Eine offene Stelle",
      other: "Etwas anderes",
    },
    name: "Ihr Name",
    email: "E-Mail",
    company: {
      project: "Unternehmen oder Website",
      job: "Unternehmen",
      other: "Unternehmen oder Website",
    },
    optional: "(optional)",
    message: {
      project: "Was soll es können?",
      job: "Zur Stelle",
      other: "Ihre Nachricht",
    },
    messageHint: {
      project: "Ein paar Sätze genügen. Was sollen Ihre Kunden darauf tun können?",
      job: "Die Stelle, das Team und wie Sie arbeiten.",
      other: "Fragen Sie, was Sie möchten.",
    },
    count: (count: number, max: number) => `${count} von ${max.toLocaleString("de-DE")} Zeichen`,
    timeline: "Bis wann brauchen Sie es?",
    timelines: {
      none: "Kein fester Termin",
      month: "Innerhalb eines Monats",
      quarter: "In 1 bis 3 Monaten",
      later: "Später in diesem Jahr",
    },
    link: "Link zur Stellenanzeige",
    replyLegend: "Antworten Sie mir auf",
    honeypot: "Dieses Feld leer lassen",
    submit: "Anfrage senden",
    sending: "Wird gesendet…",
    submitHint: "Die nächste Seite zeigt, wann ich sie gelesen habe.",
    errorsTitle: (count: number) =>
      count === 1 ? "Ein Feld muss geändert werden" : `${count} Felder müssen geändert werden`,
    errors: {
      name: { required: "Geben Sie Ihren Namen ein", tooLong: "Höchstens 100 Zeichen" },
      email: {
        required: "Geben Sie Ihre E-Mail-Adresse ein",
        email: "Geben Sie eine Adresse wie name@example.com ein",
        tooLong: "Höchstens 200 Zeichen",
      },
      company: { tooLong: "Höchstens 200 Zeichen" },
      message: {
        required: "Schreiben Sie ein paar Sätze",
        tooShort: "Schreiben Sie mindestens 20 Zeichen, damit ich die Aufgabe verstehe",
        tooLong: "Kürzen Sie den Text auf 2.000 Zeichen",
      },
      link: {
        link: "Geben Sie einen Link ein, der mit https:// beginnt",
        tooLong: "Höchstens 500 Zeichen",
      },
    },
    fieldNames: {
      name: "Ihr Name",
      email: "E-Mail",
      company: "Unternehmen",
      message: "Nachricht",
      link: "Link",
    },
    sendError: {
      title: "Die Anfrage wurde nicht gesendet",
      rateLimited:
        "Sie haben vor weniger als einer Minute eine Anfrage gesendet. Warten Sie kurz und senden Sie diese dann.",
      network:
        "Prüfen Sie Ihre Verbindung und versuchen Sie es erneut. Oder schreiben Sie mir direkt:",
      unavailable: "Das Formular kann gerade nicht senden. Bitte schreiben Sie mir direkt:",
    },
  },
  status: {
    title: "Gesendet. Danke.",
    intro:
      "Ihre Anfrage ist gespeichert. Diese Seite ändert sich von selbst, wenn ich sie lese und wenn ich antworte. Sie können sie schließen: Die Antwort kommt per E-Mail.",
    stepsLabel: "Status Ihrer Anfrage",
    received: "Eingegangen",
    receivedDetail: "In Firestore gespeichert",
    read: "Von Daniel gelesen",
    readDetail: "In meinem Posteingang geöffnet",
    readWaiting: "Noch nicht. Diese Zeile aktualisiert sich von selbst.",
    answered: "Per E-Mail beantwortet",
    answeredDetail: "Prüfen Sie Ihren Spam-Ordner, falls nichts ankommt.",
    answeredWaiting: "Nachdem ich sie gelesen habe.",
    waiting: "Ausstehend",
    loading: "Status wird geladen…",
    denied:
      "Dieser Status ist nur in dem Browser sichtbar, der die Anfrage gesendet hat. Ihre Anfrage ist nicht verloren: Ich antworte per E-Mail.",
    missing: "Hier gibt es keine Anfrage anzuzeigen.",
    unavailable:
      "Der Status kann gerade nicht geladen werden. Ihre Anfrage ist gespeichert, und ich antworte per E-Mail.",
    copyTitle: "Was Sie gesendet haben",
    copy: {
      kind: "Thema",
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      timeline: "Zeitrahmen",
      link: "Link",
      replyLang: "Antwort auf",
      message: "Nachricht",
    },
    back: "Zurück zu den Arbeiten",
    another: "Weitere Anfrage senden",
    time: (date: Date) =>
      date.toLocaleString("de-DE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  notFound: {
    title: "Seite nicht gefunden",
    text: "Diese Adresse gibt es auf dieser Website nicht. Vielleicht wurde sie beim Umbau verschoben.",
    home: "Zur Startseite",
    work: "Arbeiten ansehen",
  },
  error: {
    title: "Etwas ist schiefgelaufen",
    text: "Die Seite konnte nicht angezeigt werden. Laden Sie sie neu oder gehen Sie zur Startseite.",
    home: "Zur Startseite",
  },
};
