import type { Metadata } from "next"
import { t } from "@/lib/i18n"
import { ProjectsContent } from "@/components/projects-content"

export const metadata: Metadata = {
  title: t("en").projectsPage.metaTitle,
  description: t("en").projectsPage.intro,
  alternates: {
    canonical: "/projects",
    languages: {
      en: "/projects",
      hu: "/hu/projects",
    },
  },
  openGraph: {
    title: t("en").projectsPage.metaTitle,
    description: t("en").projectsPage.intro,
    url: "/projects",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: t("en").projectsPage.metaTitle,
    description: t("en").projectsPage.intro,
  },
}

export default function ProjectsPage() {
  return <ProjectsContent locale="en" />
}
