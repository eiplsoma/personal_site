"use client"

import { useEffect } from "react"
import type { Locale } from "@/lib/i18n"

// The root layout's <html lang="en"> is shared by every route (Next.js
// App Router allows only one), but this site's HU pages live at plain
// path segments (/hu, /hu/projects, /hu/concept), not a [locale]
// dynamic segment, so there's no per-route layout to set it from.
// This corrects the attribute client-side once the actual locale is
// known.
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
