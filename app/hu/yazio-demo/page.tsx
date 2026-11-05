import type { Metadata } from "next"
import { YazioDemoContent } from "@/components/yazio-demo-content"

export const metadata: Metadata = {
  title: "Yazio riportgenerátor — demó — Soma Eipl",
  description: "A Yazio riportgenerátor illusztratív kimenete: egy Termux-futás és a belőle készülő színkódolt napi összesítő. Demóadatok.",
  alternates: {
    canonical: "/hu/yazio-demo",
    languages: {
      en: "/yazio-demo",
      hu: "/hu/yazio-demo",
      "x-default": "/yazio-demo",
    },
  },
}

export default function YazioDemoPageHu() {
  return <YazioDemoContent locale="hu" />
}
