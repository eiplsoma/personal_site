import { ConceptContent } from "@/components/concept-content"

const description = "Eipl Soma portfóliójának és infrastruktúra-munkájának alternatív, system-status-dashboard stílusú nézete."

export const metadata = {
  title: "Eipl Soma — concept",
  description,
  alternates: {
    canonical: "/hu/concept",
    languages: {
      en: "/concept",
      hu: "/hu/concept",
    },
  },
  openGraph: {
    title: "Eipl Soma — concept",
    description,
    url: "/hu/concept",
    type: "website",
    images: ["/opengraph-image.png"],
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eipl Soma — concept",
    description,
  },
}

export default function ConceptPageHu() {
  return <ConceptContent locale="hu" />
}
