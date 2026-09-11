export type TechSkill = { text: string; bold: boolean }
export type ExperienceEntry = { title: string; org: string; period: string; bulletsLabel: string; bullets: string[] }
export type EduEntry = { degree: string; org: string; period: string; highlight: boolean }
export type CertEntry = { title: string; org: string; date: string }

export type CvData = {
  name: string
  title: string
  tagline: string
  contact: { location: string; phone: string; email: string }
  about: string[]
  experience: ExperienceEntry[]
  education: EduEntry[]
  certifications: CertEntry[]
  skills: { professional: string[]; technical: TechSkill[]; interpersonal: string[] }
  languages: string
  drivingLicence: string
  footer: { email: string; phone: string; github: string; linkedin: string }
  photoDataUrl: string | null
}

// Per-field sanity caps - loose enough not to fight normal CV content, just
// to stop one absurd field (e.g. a 5000-character bullet) from being typed.
// They are NOT the overflow defense: cv-tool-client measures the live
// rendered height against the fixed A4 page and warns once content actually
// no longer fits, so the true limit tracks the real (larger) Q1 font sizes
// automatically instead of a hand-tuned worst-case split across fields.
export const LIMITS = {
  name: 40,
  title: 50,
  tagline: 70,
  location: 40,
  phone: 30,
  email: 45,
  aboutParagraph: 320,
  expTitle: 55,
  expOrg: 45,
  expPeriod: 20,
  bulletsLabel: 25,
  bullet: 180,
  eduDegree: 55,
  eduOrg: 55,
  eduPeriod: 20,
  certTitle: 55,
  certOrg: 45,
  certDate: 20,
  skillItem: 90,
  languages: 70,
  drivingLicence: 40,
} as const

// Generous sanity ceilings on repeatable items - only to stop unbounded
// "+ Add" clicking from bloating the DOM, not the real overflow defense.
// Actual page-overflow protection is dynamic: cv-tool-client measures the
// live rendered height and warns/blocks once content would no longer fit,
// so a CV with many short bullets and one with few long ones are both
// allowed right up to the real limit, instead of a fixed worst-case split.
export const MAX_ITEMS = {
  aboutParagraphs: 6,
  experienceEntries: 8,
  bulletsPerExperience: 8,
  educationEntries: 6,
  certifications: 6,
  skillItems: 12,
} as const

export const STORAGE_KEY = "cv-tool-data-v1"
