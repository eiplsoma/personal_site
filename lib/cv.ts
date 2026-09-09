import cvEn from "@/content/cv.en.json"
import cvHu from "@/content/cv.hu.json"
import type { Locale } from "@/lib/i18n"

export type CV = typeof cvEn

const cvByLocale: Record<Locale, CV> = {
  en: cvEn,
  hu: cvHu,
}

export function getCv(locale: Locale): CV {
  return cvByLocale[locale]
}
