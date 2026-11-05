import type { Metadata } from "next"
import { YazioDemoContent } from "@/components/yazio-demo-content"

export const metadata: Metadata = {
  title: "Yazio report pipeline — demo — Soma Eipl",
  description: "Illustrative output of the Yazio report pipeline: a Termux run and the colour-coded daily summary it produces. Demo data.",
  alternates: {
    canonical: "/yazio-demo",
    languages: {
      en: "/yazio-demo",
      hu: "/hu/yazio-demo",
      "x-default": "/yazio-demo",
    },
  },
}

export default function YazioDemoPage() {
  return <YazioDemoContent locale="en" />
}
