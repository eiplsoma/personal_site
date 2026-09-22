import { ConceptContent } from "@/components/concept-content"

const description = "An alternate, system-status-dashboard-styled view of Soma Eipl's portfolio and infrastructure work."

export const metadata = {
  title: "Soma Eipl — concept",
  description,
  alternates: {
    canonical: "/concept",
    languages: {
      en: "/concept",
      hu: "/hu/concept",
    },
  },
  openGraph: {
    title: "Soma Eipl — concept",
    description,
    url: "/concept",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soma Eipl — concept",
    description,
  },
}

export default function ConceptPage() {
  return <ConceptContent />
}
