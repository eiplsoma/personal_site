import type { CvData } from "./cv-tool-types"
import { LIMITS, MAX_ITEMS } from "./cv-tool-types"

// Only the prose/content fields worth machine-translating - not names,
// contact details, employer/institution names, or dates, which are facts
// that shouldn't be guessed at by an AI. This never leaves the browser on
// its own: it's copied to the clipboard for the user to paste into an AI
// chat of their choice, and the translated result is pasted back manually.
export type TranslatablePayload = {
  title: string
  tagline: string
  about: string[]
  experience: { title: string; bulletsLabel: string; bullets: string[] }[]
  skills: { professional: string[]; technical: string[]; interpersonal: string[] }
  languages: string
  drivingLicence: string
}

export function extractTranslatable(cv: CvData): TranslatablePayload {
  return {
    title: cv.title,
    tagline: cv.tagline,
    about: cv.about,
    experience: cv.experience.map((e) => ({ title: e.title, bulletsLabel: e.bulletsLabel, bullets: e.bullets })),
    skills: {
      professional: cv.skills.professional,
      technical: cv.skills.technical.map((s) => s.text),
      interpersonal: cv.skills.interpersonal,
    },
    languages: cv.languages,
    drivingLicence: cv.drivingLicence,
  }
}

// A pasted-back translation is untrusted input, same as a JSON import - an
// AI reply (or a hand-edited paste) could carry a wrong type or an oversized
// string. Every value is clamped to the same LIMITS/MAX_ITEMS the form and
// sanitizeCv already enforce, so this can't be used to smuggle in a field
// longer than typing (or a normal import) would ever allow.
const str = (v: unknown, fb: string, maxLen: number): string => (typeof v === "string" ? v.slice(0, maxLen) : fb)

function strArray(v: unknown, fb: string[], maxLen: number, maxItems: number): string[] {
  if (!Array.isArray(v)) return fb
  return v
    .filter((x): x is string => typeof x === "string")
    .slice(0, maxItems)
    .map((x) => x.slice(0, maxLen))
}

// Re-applies a translated payload (same shape, translated string values)
// back onto a CvData, leaving every untranslated field (name, contact,
// employer/institution names, dates, photo, ...) exactly as it was.
export function applyTranslatable(cv: CvData, translated: TranslatablePayload): CvData {
  return {
    ...cv,
    title: str(translated.title, cv.title, LIMITS.title),
    tagline: str(translated.tagline, cv.tagline, LIMITS.tagline),
    about: strArray(translated.about, cv.about, LIMITS.aboutParagraph, MAX_ITEMS.aboutParagraphs),
    experience: cv.experience.map((e, i) => {
      const t = translated.experience?.[i]
      if (!t || typeof t !== "object") return e
      return {
        ...e,
        title: str(t.title, e.title, LIMITS.expTitle),
        bulletsLabel: str(t.bulletsLabel, e.bulletsLabel, LIMITS.bulletsLabel),
        bullets: strArray(t.bullets, e.bullets, LIMITS.bullet, MAX_ITEMS.bulletsPerExperience),
      }
    }),
    skills: {
      professional: strArray(translated.skills?.professional, cv.skills.professional, LIMITS.skillItem, MAX_ITEMS.skillItems),
      technical: cv.skills.technical.map((s, i) => {
        const text = translated.skills?.technical?.[i]
        return typeof text === "string" ? { ...s, text: text.slice(0, LIMITS.skillItem) } : s
      }),
      interpersonal: strArray(translated.skills?.interpersonal, cv.skills.interpersonal, LIMITS.skillItem, MAX_ITEMS.skillItems),
    },
    languages: str(translated.languages, cv.languages, LIMITS.languages),
    drivingLicence: str(translated.drivingLicence, cv.drivingLicence, LIMITS.drivingLicence),
  }
}

export function buildTranslationPrompt(payload: TranslatablePayload, targetLanguage: string): string {
  return [
    `Translate the string values in this JSON into natural, professional, HR-friendly ${targetLanguage} suitable for a CV.`,
    `Translate idiomatically, not word-for-word - phrase it the way a native speaker would naturally write it for a CV in that language.`,
    `Try to keep each translated string roughly the same character length as the original (within about 15%), since this text has to fit fixed spaces on a printed page.`,
    `Keep the exact same JSON structure and keys, and keep the array lengths and order unchanged - translate each string in place.`,
    `Do not translate anything outside the given JSON. Return only the translated JSON, nothing else.`,
    "",
    JSON.stringify(payload, null, 2),
  ].join("\n")
}
