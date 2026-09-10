export type Locale = "en" | "hu"

export const locales: Locale[] = ["en", "hu"]
export const defaultLocale: Locale = "en"

export function localePath(locale: Locale, path: string) {
  if (locale === defaultLocale) {
    // "/" is now the interactive terminal landing page, not the regular
    // site - the English regular site lives at /site instead. Anchor
    // links like "/#about" need the same prefix, or they'd resolve to
    // the terminal page with a dangling hash instead of /site#about.
    if (path === "/") return "/site"
    if (path.startsWith("/#")) return `/site${path}`
    return path
  }
  return `/hu${path === "/" ? "" : path}`
}

const dict = {
  en: {
    nav: {
      about: "about",
      work: "work",
      projects: "projects",
      skills: "skills",
      background: "background",
      contact: "contact",
    },
    hero: {
      currentlyPrefix: "Currently: ",
      currentlySuffix: ", building self-hosted infrastructure on the side.",
      downloadCv: "↓ Download CV (PDF)",
      seeProject: "See the CI/CD project →",
    },
    dividers: {
      about: "# about",
      experience: "# experience",
      featuredProject: "# featured project",
      skills: "# skills",
      principles: "# principles",
      background: "# background",
      projects: "# projects",
    },
    featuredProject: {
      fullWriteUp: "See all projects →",
    },
    skillGroups: {
      technical: "Technical",
      professional: "Professional",
      interpersonal: "Interpersonal",
    },
    background: {
      education: "Education",
      certifications: "Certifications",
    },
    projectsPage: {
      metaTitle: "Projects — Soma Eipl",
      h1: "Things I've built and deployed myself",
      intro: "Personal infrastructure projects — the pipeline, the debugging, and what broke along the way.",
      cardTitle: "Self-hosted CI/CD pipeline",
      cardLead:
        "A Next.js app deployed to a production VPS through a pipeline I built and debugged myself — including the parts that didn't go to plan.",
      stages: ["build", "test", "image", "ssh deploy", "health check"],
      story:
        "The plan didn't survive first contact with the real environment: a shared VPS with nginx already on 80/443, a domain behind Cloudflare with delegated nameservers, and a CDN feature that broke the automated health check — resolved by moving the check inside the VPS instead of over the public internet.",
      liveDemo: "Live demo →",
      sourceOnGithub: "Source on GitHub →",
      extraFeatured: [
        {
          title: "This site — VPS & Cloudflare hardening",
          lead: "Ran a security audit and hardening pass on this site's own infrastructure: layered network and cryptographic protections between the CDN and origin, plus deploy pipeline and SSH access hardening.",
          tags: ["Docker", "Cloudflare", "GitHub Actions", "nginx"],
          github: "https://github.com/eiplsoma/personal_site",
        },
        {
          title: "Woolly Design — client landing page",
          lead: "A v0.dev-generated prototype, hardened and shipped to a live domain: bot protection, server-side input validation and XSS filtering, transactional email delivery, and the GDPR pages a small business needs.",
          tags: ["Next.js", "Cloudflare Turnstile", "Nodemailer", "GDPR"],
          live: "https://woollydesign.hu",
          github: "https://github.com/eiplsoma/woolly-landing",
        },
      ],
      sectionConfidential: "Confidential client work",
      confidentialNote: "Client name and industry withheld under NDA — technical scope only.",
      confidential: [
        {
          title: "Confidential client — legacy PHP platform",
          desc: "Extended an existing production PHP/MySQL application: schema migrations, race-condition-safe scheduled jobs, and a transactional email marketing layer built on top of the existing system rather than replacing it.",
        },
        {
          title: "Confidential client — email infrastructure migration",
          desc: "Migrated an organization's mailboxes to a new email provider: mailbox and archive design, permission structure, and legacy cleanup.",
        },
      ],
      sectionAdditional: "Additional experience",
      additional: [
        "University thesis — containerized crypto trading bot environment (Binance API, Flask, PostgreSQL, Docker Compose).",
        "Self-hosted PaaS and secrets management, behind a Cloudflare Tunnel with zero open ports.",
        "Reverse engineering & forensic data validation — closed-source binary analysis cross-checked against an independent reimplementation.",
        "Planned: an automated business-intelligence platform turning accounting exports into KPI dashboards.",
      ],
    },
    footer: {
      builtWith: "built with Next.js · deployed via GitHub Actions",
    },
  },
  hu: {
    nav: {
      about: "rólam",
      work: "munka",
      projects: "projektek",
      skills: "készségek",
      background: "háttér",
      contact: "kapcsolat",
    },
    hero: {
      currentlyPrefix: "Jelenleg: ",
      currentlySuffix: ", mellette saját self-hosted infrastruktúrát építek.",
      downloadCv: "↓ CV letöltése (PDF)",
      seeProject: "A CI/CD projekt →",
    },
    dividers: {
      about: "# rólam",
      experience: "# tapasztalat",
      featuredProject: "# kiemelt projekt",
      skills: "# készségek",
      principles: "# alapelvek",
      background: "# háttér",
      projects: "# projektek",
    },
    featuredProject: {
      fullWriteUp: "Az összes projekt →",
    },
    skillGroups: {
      technical: "Technikai",
      professional: "Szakmai",
      interpersonal: "Interperszonális",
    },
    background: {
      education: "Tanulmányok",
      certifications: "Tanúsítványok",
    },
    projectsPage: {
      metaTitle: "Projektek — Eipl Soma",
      h1: "Amit saját magam építettem és deployoltam",
      intro: "Saját infrastruktúra-projektek — a pipeline, a debugolás, és ami menet közben elromlott.",
      cardTitle: "Self-hosted CI/CD pipeline",
      cardLead:
        "Egy Next.js alkalmazás, amit egy éles VPS-re deployoltam a saját magam által épített és debugolt pipeline-on keresztül — beleértve azt is, ami nem a terv szerint alakult.",
      stages: ["build", "teszt", "image", "ssh deploy", "health check"],
      story:
        "A terv nem élte túl az első találkozást a valós környezettel: egy megosztott VPS, amin már fut az nginx a 80/443-on, egy domain Cloudflare mögött delegált névszerverekkel, és egy CDN funkció, ami megtörte az automatizált health checket — a megoldás az volt, hogy a checket a nyilvános internet helyett a VPS-en belülre költöztettem.",
      liveDemo: "Élő demó →",
      sourceOnGithub: "Forráskód GitHubon →",
      extraFeatured: [
        {
          title: "Ez az oldal — VPS & Cloudflare hardening",
          lead: "Biztonsági auditot és hardening-kört futtattam ennek az oldalnak a saját infrastruktúráján: rétegzett hálózati és kriptográfiai védelem a CDN és az origin között, valamint deploy-pipeline és SSH-hozzáférés megkeményítése.",
          tags: ["Docker", "Cloudflare", "GitHub Actions", "nginx"],
          github: "https://github.com/eiplsoma/personal_site",
        },
        {
          title: "Woolly Design — ügyfél landing oldal",
          lead: "Egy v0.dev-generált prototípus, élő domainre kiadva biztonsági megkeményítéssel: bot-védelem, szerver oldali input-validáció és XSS-szűrés, tranzakciós email-küldés, és a GDPR-oldalak, amikre egy kisvállalkozásnak szüksége van.",
          tags: ["Next.js", "Cloudflare Turnstile", "Nodemailer", "GDPR"],
          live: "https://woollydesign.hu",
          github: "https://github.com/eiplsoma/woolly-landing",
        },
      ],
      sectionConfidential: "NDA-s ügyfélmunka",
      confidentialNote: "Ügyfélnév és iparág titoktartás alatt — csak a technikai tartalom.",
      confidential: [
        {
          title: "Bizalmas ügyfél — legacy PHP platform",
          desc: "Egy meglévő, éles PHP/MySQL alkalmazás kiterjesztése: séma-migrációk, race-condition-biztos ütemezett feladatok, és egy tranzakciós email marketing réteg a meglévő rendszerre építve, nem lecserélve azt.",
        },
        {
          title: "Bizalmas ügyfél — email-infrastruktúra migráció",
          desc: "Egy szervezet postafiókjainak migrálása új email-szolgáltatóra: postafiók- és archívum-dizájn, jogosultsági struktúra, legacy-tisztítás.",
        },
      ],
      sectionAdditional: "Egyéb tapasztalat",
      additional: [
        "Szakdolgozat — konténerizált kriptovaluta kereskedési bot környezet (Binance API, Flask, PostgreSQL, Docker Compose).",
        "Self-hosted PaaS és secrets-kezelés, Cloudflare Tunnel mögött, nulla nyitott porttal.",
        "Reverse engineering és forenzikus adatvalidáció — zárt forráskódú bináris elemzés, független reimplementációval keresztellenőrizve.",
        "Tervezett: automatizált üzleti intelligencia platform, ami könyvelési exportokból KPI-dashboardokat készít.",
      ],
    },
    footer: {
      builtWith: "built with Next.js · deployed via GitHub Actions",
    },
  },
} as const

export function t(locale: Locale) {
  return dict[locale]
}
