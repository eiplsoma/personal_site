import type { Metadata } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import { getCv } from "@/lib/cv"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://eiplsoma.hu"),
}

// Self-hosted at build time (no request to Google's font servers at runtime).
// latin-ext is needed for the Hungarian letters ő and ű.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-mono",
})
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-sans",
})

const cv = getCv("en")

// Static, site-owner-controlled data only (no user input flows into this),
// so dangerouslySetInnerHTML is safe here - it's the only way to emit a
// literal <script type="application/ld+json"> tag. The < escape guards
// against the JSON ever containing a literal "</script>" sequence.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: cv.name,
  jobTitle: cv.title,
  url: "https://eiplsoma.hu",
  sameAs: [`https://${cv.footer.github}`, `https://${cv.footer.linkedin}`],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  )
}
