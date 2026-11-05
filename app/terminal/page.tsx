import type { Metadata } from "next"
import { getCv } from "@/lib/cv"
import { TerminalLab } from "@/components/terminal-lab"

const cv = getCv("en")

export const metadata: Metadata = {
  title: `${cv.name} — Terminal`,
  description: `An interactive terminal for exploring ${cv.name}'s CV — ${cv.tagline}`,
  alternates: {
    canonical: "/terminal",
  },
  openGraph: {
    title: `${cv.name} — Terminal`,
    description: `An interactive terminal for exploring ${cv.name}'s CV.`,
    url: "/terminal",
    siteName: cv.name,
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${cv.name} — Terminal`,
    description: `An interactive terminal for exploring ${cv.name}'s CV.`,
  },
}

export default function TerminalPage() {
  return <TerminalLab />
}
