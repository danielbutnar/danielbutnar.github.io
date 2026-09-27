// The English dictionary defines the shape; de.ts and ro.ts must match it (see Dict).

export const en = {
  langName: "English",
  meta: {
    siteName: "Daniel Butnar",
    homeTitle: "Daniel Butnar, React and TypeScript developer in Brașov",
    homeDescription:
      "Booking systems and web apps in React, TypeScript and Firebase, tested and accessible. Case studies, services and an inquiry form.",
    caseTitle: (name: string) => `${name}: case study`,
    contactTitle: "Send an inquiry",
    contactDescription:
      "Send Daniel Butnar an inquiry about a project, a job opening or anything else. Answers by e-mail in English, German or Romanian.",
    statusTitle: "Status of your inquiry",
    privacyTitle: "Privacy notice",
    privacyDescription:
      "What this site stores when you send an inquiry, where, for how long, and your rights.",
    notFoundTitle: "Page not found",
  },
  a11y: {
    skip: "Skip to content",
    mainNav: "Main",
    footerNav: "Footer",
    language: "Language",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
  nav: {
    work: "Work",
    services: "Services",
    hiring: "Hiring",
    about: "About",
    inquiry: "Send an inquiry",
  },
  kinds: {
    client: "Client project",
    own: "Own project",
    contest: "Contest entry",
    concept: "Concept",
    research: "Research and tooling",
  },
  statuses: {
    prelaunch: "Pre-launch",
    live: "Live",
    liveDemo: "Live demo",
    concept: "Concept",
    published: "Published",
  },
  home: {
    h1: "Booking systems and web apps that hold up in real use.",
    intro:
      "I’m Daniel, a React and TypeScript developer in Brașov, Romania. I build the whole thing: the booking flow, the payments, the admin screen and the tests that keep them honest. I work in English, German and Romanian.",
    openTo: "Open to",
    openToRole: "A React and Firebase role",
    openToProjects: "Projects for small businesses",
    seeWork: "See the work",
    workTitle: "Work",
    workNote: "Client work first. Status as of September 2026.",
    cols: {
      project: "Project",
      what: "What it is",
      stack: "Built with",
      status: "Status",
      caseStudy: "Case study",
    },
    builtWith: "Built with",
    status: "Status",
    read: "Read",
    teaser: {
      title: "Two guests, one car, the same evening.",
      text: "Brasov Private Tours takes bookings and card payments online. The hard part was making sure a car is never sold twice, even when two people pay within the same second, and that a late payment is refunded on its own.",
      facts: [
        ["Role", "Design, build, deploy"],
        ["When", "September 2026"],
        ["Tests", "79 unit, 24 integration, 16 end-to-end"],
        ["Languages", "English, Romanian, Italian, Spanish"],
      ],
      link: "Read the case study",
      caption: "brasov-private-tours.vercel.app, September 2026",
    },
    services: {
      title: "What I can build for you",
      note: "Each one links to work where I did it.",
      seenIn: "Seen in",
      items: {
        booking: {
          title: "Booking websites",
          text: "Online booking with a calendar, card payments and an admin screen. For tours, transfers, studios and guesthouses.",
        },
        firebase: {
          title: "Web apps on React and Firebase",
          text: "Inquiry forms, dashboards and member areas with sign-in and data that updates live.",
        },
        accessibility: {
          title: "Accessibility checks and fixes",
          text: "I test your site against WCAG 2.1 AA with tools and by hand, then fix the barriers in the code.",
        },
        languages: {
          title: "Sites in three languages",
          text: "English, German and Romanian. German and Romanian are my native languages, so your customers read real sentences.",
        },
      },
    },
    process: {
      title: "How a project runs",
      steps: [
        {
          title: "You describe the job",
          text: "Through the inquiry form or by e-mail. A short call is usually enough to understand it.",
        },
        {
          title: "You get a written plan",
          text: "What I will build, how long it takes and what it costs, before any work starts.",
        },
        {
          title: "You see it working early",
          text: "A preview link you can open on your phone, not screenshots. Your feedback goes into the next version.",
        },
        {
          title: "Launch and handover",
          text: "Tested on phones and with a keyboard, hosted on accounts in your name, with notes on how to run it.",
        },
      ],
    },
    hiring: {
      title: "For hiring teams",
      text: "I’m looking for a role building React and Firebase apps. The quickest way to judge my work is the code behind this site: the security rules, their tests and the CI that runs them.",
      ai: "I work with AI coding tools, Claude Code among them, and I own what ships: the plan, the review and the tests.",
      caseCta: "Read the Firebase case study",
      codeCta: "Code on GitHub",
      stack: [
        ["Front end", "React 19, TypeScript, React Router, Next.js App Router"],
        ["Back end", "Firebase Auth, Firestore and security rules, Postgres with Prisma, Stripe"],
        ["Testing", "Vitest, Playwright, the Firebase emulator, GitHub Actions"],
        ["Quality", "WCAG 2.1 AA, axe, Lighthouse, Core Web Vitals"],
        ["Languages", "English (fluent), German and Romanian (native)"],
      ],
    },
    about: {
      title: "About",
      p1: "I live in Brașov. German and Romanian are my native languages, and I work in English every day. I study at Politehnica Bucharest, in the German-language stream.",
      p2: "I care about the parts people don’t see: what happens when two customers book at once, when a payment arrives late, when someone uses a screen reader. I also founded GoActive Bucharest, a youth group that runs Erasmus+ exchanges, and built its website.",
      photoAlt: "Daniel Butnar",
    },
    contact: {
      title: "Tell me what you need.",
      text: "A project, a job opening or a question. I read every message myself.",
      cta: "Send an inquiry",
    },
  },
  channels: {
    github: "GitHub",
    linkedin: "LinkedIn",
    contra: "Contra",
  },
  footer: {
    copyright: "© 2026 Daniel Butnar.",
    builtWith: "Built with React and Firebase.",
    privacy: "Privacy",
    code: "Code on GitHub",
  },
  caseStudy: {
    allWork: "All work",
    facts: {
      type: "Type",
      role: "Role",
      when: "When",
      stack: "Built with",
      status: "Status",
      links: "Links",
    },
    links: { live: "Live site", code: "Code" },
    onThisPage: "On this page",
    sections: {
      job: "The job",
      built: "What I built",
      hard: "The hard parts",
      results: "Results",
      next: "What I would do next",
    },
    nextCase: "Next case study",
    shotAlt: (name: string) => `Screenshot of ${name}`,
  },
  contact: {
    title: "Send an inquiry",
    intro:
      "A project, a job opening or a question. I read every message myself and answer by e-mail.",
    orWrite: "Or write directly",
    privacy:
      "What you send is stored in Firebase (Google Cloud, EU) so I can answer, and deleted after 12 months.",
    privacyLink: "Privacy notice",
    kindLegend: "What is it about?",
    kinds: {
      project: "A project for my business",
      job: "A job opening",
      other: "Something else",
    },
    name: "Your name",
    email: "E-mail",
    company: {
      project: "Business or website",
      job: "Company",
      other: "Company or website",
    },
    optional: "(optional)",
    message: {
      project: "What should it do?",
      job: "About the role",
      other: "Your message",
    },
    messageHint: {
      project: "A few sentences are enough. What should your customers be able to do on it?",
      job: "The role, the team and how you work.",
      other: "Ask me anything.",
    },
    count: (count: number, max: number) => `${count} of ${max.toLocaleString("en-GB")} characters`,
    timeline: "When do you need it?",
    timelines: {
      none: "No fixed date",
      month: "Within a month",
      quarter: "In 1 to 3 months",
      later: "Later this year",
    },
    link: "Link to the job ad",
    replyLegend: "Answer me in",
    honeypot: "Leave this field empty",
    submit: "Send inquiry",
    sending: "Sending…",
    submitHint: "The next page shows when I have read it.",
    errorsTitle: (count: number) =>
      count === 1 ? "One field needs a change" : `${count} fields need a change`,
    errors: {
      name: { required: "Enter your name", tooLong: "Use at most 100 characters" },
      email: {
        required: "Enter your e-mail address",
        email: "Enter an address like name@example.com",
        tooLong: "Use at most 200 characters",
      },
      company: { tooLong: "Use at most 200 characters" },
      message: {
        required: "Write a few sentences",
        tooShort: "Write at least 20 characters, so I understand the job",
        tooLong: "Shorten it to 2,000 characters",
      },
      link: {
        link: "Enter a link that starts with https://",
        tooLong: "Use at most 500 characters",
      },
    },
    fieldNames: {
      name: "Your name",
      email: "E-mail",
      company: "Company",
      message: "Message",
      link: "Link",
    },
    sendError: {
      title: "The inquiry was not sent",
      rateLimited: "You sent an inquiry less than a minute ago. Wait a moment, then send this one.",
      network: "Check your connection and try again. Or write to me directly:",
      unavailable: "The form cannot send right now. Please write to me directly:",
    },
  },
  status: {
    title: "Sent. Thank you.",
    intro:
      "Your inquiry is saved. This page changes on its own when I read it and when I answer. You can close it: the answer comes by e-mail.",
    stepsLabel: "Status of your inquiry",
    received: "Received",
    receivedDetail: "Stored in Firestore",
    read: "Read by Daniel",
    readDetail: "Opened in my inbox",
    readWaiting: "Not yet. This line updates by itself.",
    answered: "Answered by e-mail",
    answeredDetail: "Check your spam folder if nothing arrives.",
    answeredWaiting: "After I have read it.",
    waiting: "Waiting",
    loading: "Loading the status…",
    denied:
      "This status can only be seen in the browser that sent the inquiry. Your inquiry is not lost: I answer by e-mail.",
    missing: "There is no inquiry to show here.",
    unavailable:
      "The status cannot be loaded right now. Your inquiry is saved, and I answer by e-mail.",
    copyTitle: "What you sent",
    copy: {
      kind: "About",
      name: "Name",
      email: "E-mail",
      company: "Company",
      timeline: "Timeline",
      link: "Link",
      replyLang: "Answer in",
      message: "Message",
    },
    back: "Back to the work",
    another: "Send another inquiry",
    time: (date: Date) =>
      date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  notFound: {
    title: "Page not found",
    text: "This address does not exist on this site. It may have moved when the site changed.",
    home: "Go to the home page",
    work: "See the work",
  },
  error: {
    title: "Something went wrong",
    text: "The page could not be shown. Reload it, or go back to the home page.",
    home: "Go to the home page",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : T extends object
        ? { [K in keyof T]: Widen<T[K]> }
        : T;

export type Dict = Widen<typeof en>;
