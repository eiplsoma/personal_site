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
      en: "/site",
      hu: "/hu",
    },
  },
  openGraph: {
    title: `${cv.name} — ${cv.title}`,
    description: cv.tagline,
    url: "/hu",
    siteName: cv.name,
    type: "website",
    images: ["/opengraph-image.png"],
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: `${cv.name} — ${cv.title}`,
    description: cv.tagline,
  },
}

export default function HomeHu() {
  return <HomeContent locale="hu" />
}
