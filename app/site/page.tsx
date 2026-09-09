import type { Metadata } from "next"
import { getCv } from "@/lib/cv"
import { HomeContent } from "@/components/home-content"

const cv = getCv("en")

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: cv.tagline,
  alternates: {
    canonical: "/site",
    languages: {
      en: "/site",
      hu: "/hu",
    },
  },
}

export default function Site() {
  return <HomeContent locale="en" />
}
