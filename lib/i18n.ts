export type Locale = "en" | "hu"

export const locales: Locale[] = ["en", "hu"]
export const defaultLocale: Locale = "en"

export function localePath(locale: Locale, path: string) {
  if (locale === defaultLocale) {
    // "/" is now the interactive terminal landing page, not the regular
    // site - the English regular site lives at /site instead.
    return path === "/" ? "/site" : path
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
      background: "# background",
      projects: "# projects",
    },
    featuredProject: {
      lead: "A Next.js app deployed to a production VPS through a pipeline I built and debugged myself — including the parts that didn't go to plan.",
      fullWriteUp: "Full write-up →",
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
      background: "# háttér",
      projects: "# projektek",
    },
    featuredProject: {
      lead: "Egy Next.js alkalmazás, amit egy éles VPS-re deployoltam a saját magam által épített és debugolt pipeline-on keresztül — beleértve azt is, ami nem a terv szerint alakult.",
      fullWriteUp: "Teljes leírás →",
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
    },
    footer: {
      builtWith: "Next.js-szel építve · GitHub Actionsön keresztül deployolva",
    },
  },
} as const

export function t(locale: Locale) {
  return dict[locale]
}
