import type { CvData } from "./cv-tool-types"

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

// Re-applies a translated payload (same shape, translated string values)
// back onto a CvData, leaving every untranslated field (name, contact,
// employer/institution names, dates, photo, ...) exactly as it was.
export function applyTranslatable(cv: CvData, translated: TranslatablePayload): CvData {
  return {
    ...cv,
    title: translated.title ?? cv.title,
    tagline: translated.tagline ?? cv.tagline,
    about: Array.isArray(translated.about) ? translated.about : cv.about,
    experience: cv.experience.map((e, i) => {
      const t = translated.experience?.[i]
      if (!t) return e
      return {
        ...e,
        title: t.title ?? e.title,
        bulletsLabel: t.bulletsLabel ?? e.bulletsLabel,
        bullets: Array.isArray(t.bullets) ? t.bullets : e.bullets,
      }
    }),
    skills: {
      professional: Array.isArray(translated.skills?.professional) ? translated.skills.professional : cv.skills.professional,
      technical: cv.skills.technical.map((s, i) => {
        const text = translated.skills?.technical?.[i]
        return text ? { ...s, text } : s
      }),
      interpersonal: Array.isArray(translated.skills?.interpersonal) ? translated.skills.interpersonal : cv.skills.interpersonal,
    },
    languages: translated.languages ?? cv.languages,
    drivingLicence: translated.drivingLicence ?? cv.drivingLicence,
  }
}

export function buildTranslationPrompt(payload: TranslatablePayload, targetLanguage: string): string {
  return [
    `Translate the string values in this JSON into natural, professional, HR-friendly ${targetLanguage} suitable for a CV.`,
    `Keep the exact same JSON structure and keys, and keep the array lengths and order unchanged - translate each string in place.`,
    `Do not translate anything outside the given JSON. Return only the translated JSON, nothing else.`,
    "",
    JSON.stringify(payload, null, 2),
  ].join("\n")
}
