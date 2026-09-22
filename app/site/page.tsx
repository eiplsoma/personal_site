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
  openGraph: {
    title: `${cv.name} — ${cv.title}`,
    description: cv.tagline,
    url: "/site",
    siteName: cv.name,
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${cv.name} — ${cv.title}`,
    description: cv.tagline,
  },
}

export default function Site() {
  return <HomeContent locale="en" />
}
