import Link from "next/link"
import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { HtmlLang } from "@/components/html-lang"
import { localePath, type Locale } from "@/lib/i18n"

const COPY = {
  en: {
    eyebrow: "demo",
    h1: "Yazio report pipeline — demo",
    intro:
      "An illustration of the pipeline: a background run in Termux on the left, the colour-coded daily summary PDF it produces on the right. All data is made up.",
    alt: "Illustrative Termux run output next to the colour-coded daily summary PDF it produces (demo data)",
    back: "← Projects",
  },
  hu: {
    eyebrow: "demó",
    h1: "Yazio riportgenerátor — demó",
    intro:
      "A folyamat illusztrációja: balra egy háttérben futó Termux-futás, jobbra a belőle készülő színkódolt napi összesítő PDF. Minden adat kitalált.",
    alt: "Illusztratív Termux-futás kimenete a belőle készülő színkódolt napi összesítő PDF mellett (demóadatok)",
    back: "← Projektek",
  },
} as const

export function YazioDemoContent({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  return (
    <>
      <HtmlLang locale={locale} />
      <Nav locale={locale} path="/yazio-demo" />
      <main className="wrap">
        <section className="page-header">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1>{c.h1}</h1>
          <p>{c.intro}</p>
        </section>
        <section style={{ marginTop: 30 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, fixed illustration */}
          <img className="demo-figure" src="/yazio-pipeline-flow.webp" alt={c.alt} />
          <div className="project-links">
            <Link href={localePath(locale, "/projects")}>{c.back}</Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
