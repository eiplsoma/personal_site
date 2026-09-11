import type { CvData, ExperienceEntry, EduEntry, CertEntry, TechSkill } from "./cv-tool-types"

// Imported JSON is untrusted input - a hand-edited or corrupted file can
// carry any shape. Without this, a wrong field type (e.g. experience as a
// string instead of an array) crashes the whole page at render time, and an
// external image URL in photoDataUrl would leak the viewer's IP to a third
// party on every load, breaking the "nothing ever leaves your browser"
// guarantee. Every field is checked against its expected type and falls
// back to the current CV's value (or an empty default) otherwise.

const str = (v: unknown, fb: string): string => (typeof v === "string" ? v : fb)
const bool = (v: unknown, fb: boolean): boolean => (typeof v === "boolean" ? v : fb)

function strArray(v: unknown, fb: string[]): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : fb
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {}
}

function sanitizeExperience(v: unknown, fb: ExperienceEntry[]): ExperienceEntry[] {
  if (!Array.isArray(v)) return fb
  return v.map((entry) => {
    const e = asRecord(entry)
    return {
      title: str(e.title, ""),
      org: str(e.org, ""),
      period: str(e.period, ""),
      bulletsLabel: str(e.bulletsLabel, ""),
      bullets: strArray(e.bullets, []),
    }
  })
}

function sanitizeEducation(v: unknown, fb: EduEntry[]): EduEntry[] {
  if (!Array.isArray(v)) return fb
  return v.map((entry) => {
    const e = asRecord(entry)
    return { degree: str(e.degree, ""), org: str(e.org, ""), period: str(e.period, ""), highlight: bool(e.highlight, false) }
  })
}

function sanitizeCertifications(v: unknown, fb: CertEntry[]): CertEntry[] {
  if (!Array.isArray(v)) return fb
  return v.map((entry) => {
    const e = asRecord(entry)
    return { title: str(e.title, ""), org: str(e.org, ""), date: str(e.date, "") }
  })
}

function sanitizeTechSkills(v: unknown, fb: TechSkill[]): TechSkill[] {
  if (!Array.isArray(v)) return fb
  return v.map((entry) => {
    const e = asRecord(entry)
    return { text: str(e.text, ""), bold: bool(e.bold, false) }
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
    name: str(r.name, fallback.name),
    title: str(r.title, fallback.title),
    tagline: str(r.tagline, fallback.tagline),
    contact: {
      location: str(contact.location, fallback.contact.location),
      phone: str(contact.phone, fallback.contact.phone),
      email: str(contact.email, fallback.contact.email),
    },
    about: strArray(r.about, fallback.about),
    experience: sanitizeExperience(r.experience, fallback.experience),
    education: sanitizeEducation(r.education, fallback.education),
    certifications: sanitizeCertifications(r.certifications, fallback.certifications),
    skills: {
      professional: strArray(skills.professional, fallback.skills.professional),
      technical: sanitizeTechSkills(skills.technical, fallback.skills.technical),
      interpersonal: strArray(skills.interpersonal, fallback.skills.interpersonal),
    },
    languages: str(r.languages, fallback.languages),
    drivingLicence: str(r.drivingLicence, fallback.drivingLicence),
    footer: {
      email: str(footer.email, fallback.footer.email),
      phone: str(footer.phone, fallback.footer.phone),
      github: str(footer.github, fallback.footer.github),
      linkedin: str(footer.linkedin, fallback.footer.linkedin),
    },
    photoDataUrl: sanitizePhoto(r.photoDataUrl),
  }
}
