import type { Metadata } from "next"
import { getCv } from "@/lib/cv"
import { HomeContent } from "@/components/home-content"

const cv = getCv("hu")

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: cv.tagline,
  alternates: {
    canonical: "/hu",
    languages: {
      en: "/",
      hu: "/hu",
    },
  },
}

export default function HomeHu() {
  return <HomeContent locale="hu" />
}
