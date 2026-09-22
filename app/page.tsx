import type { Metadata } from "next"
import { getCv } from "@/lib/cv"
import { TerminalLab } from "@/components/terminal-lab"

const cv = getCv("en")

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: cv.tagline,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${cv.name} — ${cv.title}`,
    description: cv.tagline,
    url: "/",
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

export default function Home() {
  return <TerminalLab />
}
