import type { Metadata } from "next"
import { getCv } from "@/lib/cv"
import { HomeContent } from "@/components/home-content"

const cv = getCv("en")

// "/" now serves this same content (see app/page.tsx) - this route is kept
// only as a non-canonical alias so old links/bookmarks don't 404. Its
// canonical points at "/" so it isn't indexed as separate duplicate
// content. A permanent redirect (/site -> /) at the nginx level is the
// proper follow-up and ships separately, as an infrastructure change.
export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: cv.tagline,
  alternates: {
    canonical: "/",
  },
  robots: { index: false, follow: true },
}

export default function Site() {
  return <HomeContent locale="en" />
}
