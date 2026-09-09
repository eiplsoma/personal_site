import type { Metadata } from "next"
import { t } from "@/lib/i18n"
import { ProjectsContent } from "@/components/projects-content"

export const metadata: Metadata = {
  title: t("hu").projectsPage.metaTitle,
  alternates: {
    canonical: "/hu/projects",
    languages: {
      en: "/projects",
      hu: "/hu/projects",
    },
  },
}

export default function ProjectsPageHu() {
  return <ProjectsContent locale="hu" />
}
