import type { CvData, ExperienceEntry, EduEntry, CertEntry, TechSkill } from "./cv-tool-types"
import { LIMITS, MAX_ITEMS } from "./cv-tool-types"

// Imported JSON is untrusted input - a hand-edited or corrupted file can
// carry any shape. Without this, a wrong field type (e.g. experience as a
// string instead of an array) crashes the whole page at render time, and an
// external image URL in photoDataUrl would leak the viewer's IP to a third
// party on every load, breaking the "nothing ever leaves your browser"
// guarantee. Every field is checked against its expected type and falls
// back to the current CV's value (or an empty default) otherwise.
//
// String and array lengths are also clamped to the same LIMITS/MAX_ITEMS
// that the form's maxLength attributes and "+ Add" caps already enforce
// while typing - import is just another entry point into the same data, so
// it's held to the same invariants rather than a separate, looser set.

const str = (v: unknown, fb: string, maxLen: number): string => (typeof v === "string" ? v.slice(0, maxLen) : fb)
const bool = (v: unknown, fb: boolean): boolean => (typeof v === "boolean" ? v : fb)

function strArray(v: unknown, fb: string[], maxLen: number, maxItems: number): string[] {
  if (!Array.isArray(v)) return fb
  return v
    .filter((x): x is string => typeof x === "string")
    .slice(0, maxItems)
    .map((x) => x.slice(0, maxLen))
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {}
}

function sanitizeExperience(v: unknown, fb: ExperienceEntry[]): ExperienceEntry[] {
  if (!Array.isArray(v)) return fb
  return v.slice(0, MAX_ITEMS.experienceEntries).map((entry) => {
    const e = asRecord(entry)
    return {
      title: str(e.title, "", LIMITS.expTitle),
      org: str(e.org, "", LIMITS.expOrg),
      period: str(e.period, "", LIMITS.expPeriod),
      bulletsLabel: str(e.bulletsLabel, "", LIMITS.bulletsLabel),
      bullets: strArray(e.bullets, [], LIMITS.bullet, MAX_ITEMS.bulletsPerExperience),
    }
  })
}

function sanitizeEducation(v: unknown, fb: EduEntry[]): EduEntry[] {
  if (!Array.isArray(v)) return fb
  return v.slice(0, MAX_ITEMS.educationEntries).map((entry) => {
    const e = asRecord(entry)
    return {
      degree: str(e.degree, "", LIMITS.eduDegree),
      org: str(e.org, "", LIMITS.eduOrg),
      period: str(e.period, "", LIMITS.eduPeriod),
      highlight: bool(e.highlight, false),
    }
  })
}

function sanitizeCertifications(v: unknown, fb: CertEntry[]): CertEntry[] {
  if (!Array.isArray(v)) return fb
  return v.slice(0, MAX_ITEMS.certifications).map((entry) => {
    const e = asRecord(entry)
    return { title: str(e.title, "", LIMITS.certTitle), org: str(e.org, "", LIMITS.certOrg), date: str(e.date, "", LIMITS.certDate) }
  })
}

function sanitizeTechSkills(v: unknown, fb: TechSkill[]): TechSkill[] {
  if (!Array.isArray(v)) return fb
  return v.slice(0, MAX_ITEMS.skillItems).map((entry) => {
    const e = asRecord(entry)
    return { text: str(e.text, "", LIMITS.skillItem), bold: bool(e.bold, false) }
  })
}

// Only a real data: URL is accepted - never a remote address, so importing a
// file can't turn the tool into a tracking beacon.
function sanitizePhoto(v: unknown): string | null {
  return typeof v === "string" && v.startsWith("data:image/") ? v : null
}

export function sanitizeCv(raw: unknown, fallback: CvData): CvData {
  const r = asRecord(raw)
  const contact = asRecord(r.contact)
  const skills = asRecord(r.skills)
  const footer = asRecord(r.footer)

  return {
    name: str(r.name, fallback.name, LIMITS.name),
    title: str(r.title, fallback.title, LIMITS.title),
    tagline: str(r.tagline, fallback.tagline, LIMITS.tagline),
    contact: {
      location: str(contact.location, fallback.contact.location, LIMITS.location),
      phone: str(contact.phone, fallback.contact.phone, LIMITS.phone),
      email: str(contact.email, fallback.contact.email, LIMITS.email),
    },
    about: strArray(r.about, fallback.about, LIMITS.aboutParagraph, MAX_ITEMS.aboutParagraphs),
    experience: sanitizeExperience(r.experience, fallback.experience),
    education: sanitizeEducation(r.education, fallback.education),
    certifications: sanitizeCertifications(r.certifications, fallback.certifications),
    skills: {
      professional: strArray(skills.professional, fallback.skills.professional, LIMITS.skillItem, MAX_ITEMS.skillItems),
      technical: sanitizeTechSkills(skills.technical, fallback.skills.technical),
      interpersonal: strArray(skills.interpersonal, fallback.skills.interpersonal, LIMITS.skillItem, MAX_ITEMS.skillItems),
    },
    languages: str(r.languages, fallback.languages, LIMITS.languages),
    drivingLicence: str(r.drivingLicence, fallback.drivingLicence, LIMITS.drivingLicence),
    footer: {
      email: str(footer.email, fallback.footer.email, LIMITS.email),
      phone: str(footer.phone, fallback.footer.phone, LIMITS.phone),
      github: str(footer.github, fallback.footer.github, LIMITS.email),
      linkedin: str(footer.linkedin, fallback.footer.linkedin, LIMITS.email),
    },
    photoDataUrl: sanitizePhoto(r.photoDataUrl),
  }
}
