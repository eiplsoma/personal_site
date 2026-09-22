import type { Metadata } from "next"
import { t } from "@/lib/i18n"
import { ProjectsContent } from "@/components/projects-content"

export const metadata: Metadata = {
  title: t("hu").projectsPage.metaTitle,
  description: t("hu").projectsPage.intro,
  alternates: {
    canonical: "/hu/projects",
    languages: {
      en: "/projects",
      hu: "/hu/projects",
    },
  },
  openGraph: {
    title: t("hu").projectsPage.metaTitle,
    description: t("hu").projectsPage.intro,
    url: "/hu/projects",
    type: "website",
    images: ["/opengraph-image.png"],
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: t("hu").projectsPage.metaTitle,
    description: t("hu").projectsPage.intro,
  },
}

export default function ProjectsPageHu() {
  return <ProjectsContent locale="hu" />
}
