import type { CvData } from "./cv-tool-types"
import type { CvToolLocale } from "./cv-tool-i18n"

// Generic, placeholder starting points - deliberately contain no real
// person's data. Whoever uses the tool fills in their own details, which
// only ever live in their browser (localStorage), never in this repo.
export const DEFAULT_CV_EN: CvData = {
  name: "Jane Doe",
  title: "Job Title",
  tagline: "Skill · Skill · Skill · Skill",
  contact: { location: "City, Country", phone: "+00 000 000 000", email: "jane@example.com" },
  about: [
    "A couple of sentences summarizing who you are and what you do professionally.",
  ],
  experience: [
    {
      title: "Job Title",
      org: "Company / Personal Project",
      period: "2024 - Present",
      bulletsLabel: "Highlights:",
      bullets: ["What you did or built.", "A concrete result or detail worth mentioning."],
    },
  ],
  education: [{ degree: "Degree, Field", org: "Institution", period: "2019 - 2023", highlight: true }],
  certifications: [{ title: "Certification Name", org: "Issuing Organization", date: "01/01/2024" }],
  skills: {
    professional: ["Skill area one", "Skill area two"],
    technical: [
      { text: "Technical skill one", bold: true },
      { text: "Technical skill two", bold: false },
    ],
    interpersonal: ["Trait one", "Trait two"],
  },
  languages: "Language (Level) · Language (Level)",
  drivingLicence: "Categories: B",
  footer: { email: "jane@example.com", phone: "+00 000 000 000", github: "github.com/username", linkedin: "linkedin.com/in/username" },
  photoDataUrl: null,
}

export const DEFAULT_CV_HU: CvData = {
  name: "Kovács Anna",
  title: "Munkakör",
  tagline: "Készség · Készség · Készség · Készség",
  contact: { location: "Város, Ország", phone: "+36 00 000 0000", email: "kovacs.anna@example.com" },
  about: [
    "Egy-két mondat arról, ki vagy és mivel foglalkozol szakmailag.",
  ],
  experience: [
    {
      title: "Munkakör",
      org: "Cég / Saját projekt",
      period: "2024 - jelen",
      bulletsLabel: "Kiemelt eredmények:",
      bullets: ["Amit csináltál vagy építettél.", "Egy konkrét eredmény vagy említésre méltó részlet."],
    },
  ],
  education: [{ degree: "Végzettség, szakterület", org: "Intézmény", period: "2019 - 2023", highlight: true }],
  certifications: [{ title: "Tanúsítvány neve", org: "Kiállító szervezet", date: "2024.01.01." }],
  skills: {
    professional: ["Szakterület egy", "Szakterület kettő"],
    technical: [
      { text: "Technikai készség egy", bold: true },
      { text: "Technikai készség kettő", bold: false },
    ],
    interpersonal: ["Tulajdonság egy", "Tulajdonság kettő"],
  },
  languages: "Nyelv (szint) · Nyelv (szint)",
  drivingLicence: "Kategóriák: B",
  footer: {
    email: "kovacs.anna@example.com",
    phone: "+36 00 000 0000",
    github: "github.com/felhasznalonev",
    linkedin: "linkedin.com/in/felhasznalonev",
  },
  photoDataUrl: null,
}

// Kept for existing imports - the English placeholder is the overall default.
export const DEFAULT_CV = DEFAULT_CV_EN

export function defaultCvFor(locale: CvToolLocale): CvData {
  return locale === "hu" ? DEFAULT_CV_HU : DEFAULT_CV_EN
}

// True only while the form still holds one of the untouched placeholder
// datasets - used to decide whether switching language may also swap the
// sample content, without ever touching real user-entered data.
export function isPristineDefault(cv: CvData): boolean {
  const asJson = JSON.stringify(cv)
  return asJson === JSON.stringify(DEFAULT_CV_EN) || asJson === JSON.stringify(DEFAULT_CV_HU)
}
