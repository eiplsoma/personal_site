import type { Metadata } from "next"
import { CvToolClient } from "./cv-tool-client"

export const metadata: Metadata = {
  title: "CV Tool — Soma Eipl",
  description: "Build and export a one-page CV, entirely in your browser. Nothing you type ever leaves your device.",
  alternates: {
    canonical: "/cv-tool",
  },
  openGraph: {
    title: "CV Tool — Soma Eipl",
    description: "Build and export a one-page CV, entirely in your browser. Nothing you type ever leaves your device.",
    url: "/cv-tool",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Tool — Soma Eipl",
    description: "Build and export a one-page CV, entirely in your browser. Nothing you type ever leaves your device.",
  },
}

export default function CvToolPage() {
  return <CvToolClient />
}
