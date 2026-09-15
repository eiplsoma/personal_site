import type { CvData } from "./cv-tool-types"
import type { CvToolLocale } from "./cv-tool-i18n"

// Shown as native <input>/<textarea> placeholder text, and as a muted
// fallback in the live preview when a field is still empty. Never the actual
// starting value - so there's nothing to select or backspace, exactly like a
// real HTML placeholder. Deliberately generic, no real person's data.
export const SAMPLE_CV_EN: CvData = {
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
  education: [
    {
      degree: "Degree, Field",
      org: "Institution",
      period: "2019 - 2023",
      highlight: true,
      courses: ["Relevant course one", "Relevant course two"],
    },
  ],
  certifications: [{ title: "Certification Name", org: "Issuing Organization", date: "01/01/2024", detail: "Mode of learning: Online" }],
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
  footer: {
    email: "jane@example.com",
    phone: "+00 000 000 000",
    github: "github.com/username",
    linkedin: "linkedin.com/in/username",
    website: "yourwebsite.com",
  },
  photoDataUrl: null,
}

export const SAMPLE_CV_HU: CvData = {
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
  education: [
    {
      degree: "Végzettség, szakterület",
      org: "Intézmény",
      period: "2019 - 2023",
      highlight: true,
      courses: ["Releváns tárgy egy", "Releváns tárgy kettő"],
    },
  ],
  certifications: [{ title: "Tanúsítvány neve", org: "Kiállító szervezet", date: "2024.01.01.", detail: "Tanulási mód: Online" }],
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
    website: "sajatweboldalad.hu",
  },
  photoDataUrl: null,
}

export function sampleCvFor(locale: CvToolLocale): CvData {
  return locale === "hu" ? SAMPLE_CV_HU : SAMPLE_CV_EN
}

// The actual starting state: same shape as the sample (one entry per
// repeatable section, so the form's structure is visible right away) but
// every leaf string is empty, since this is real data, not a hint. Doesn't
// vary by locale - there's nothing to translate in an empty string.
export const EMPTY_CV: CvData = {
  name: "",
  title: "",
  tagline: "",
  contact: { location: "", phone: "", email: "" },
  about: [""],
  experience: [{ title: "", org: "", period: "", bulletsLabel: "", bullets: ["", ""] }],
  education: [{ degree: "", org: "", period: "", highlight: true, courses: [] }],
  certifications: [{ title: "", org: "", date: "", detail: "" }],
  skills: {
    professional: ["", ""],
    technical: [
      { text: "", bold: true },
      { text: "", bold: false },
    ],
    interpersonal: ["", ""],
  },
  languages: "",
  drivingLicence: "",
  footer: { email: "", phone: "", github: "", linkedin: "", website: "" },
  photoDataUrl: null,
}
