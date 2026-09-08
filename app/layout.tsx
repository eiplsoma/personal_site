import type { Metadata } from "next"
import { cv } from "@/lib/cv"
import "./globals.css"

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: cv.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
