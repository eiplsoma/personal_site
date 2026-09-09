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
}

export default function Home() {
  return <TerminalLab />
}
