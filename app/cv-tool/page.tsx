import type { Metadata } from "next"
import { CvToolClient } from "./cv-tool-client"

export const metadata: Metadata = {
  title: "CV Tool — Soma Eipl",
  description: "Build and export a one-page CV, entirely in your browser. Nothing you type ever leaves your device.",
  alternates: {
    canonical: "/cv-tool",
  },
}

export default function CvToolPage() {
  return <CvToolClient />
}
