import Link from "next/link"
import { getCv } from "@/lib/cv"
import { localePath, t, type Locale } from "@/lib/i18n"
import { HtmlLang } from "@/components/html-lang"
import "@/app/concept/concept.css"

// These are real skills (confidential client work), just not part of
// eiplsoma.hu's own stack - excluded from the "Stack status" dashboard
// below since that section specifically claims to show this site's own
// live infrastructure, not the general CV skills list.
const NOT_THIS_SITE_SKILLS = new Set([
  "SQL data models & database management",
  "Data structuring & transformation",
  "PHP & transactional email API integration (Brevo)",
  "Mail infrastructure management (incl. Zoho migration)",
  "Reverse engineering & decompilation",
  "AI-assisted development workflows (Claude Code)",
  "SQL adatmodellek és adatbázis-kezelés",
  "Adatstrukturálás és transzformáció",
  "PHP és tranzakciós email API integráció (Brevo)",
  "Email infrastruktúra kezelés (Zoho migrációval)",
  "Reverse engineering és dekompiláció",
  "AI-asszisztált fejlesztési workflow-k (Claude Code)",
])

export function ConceptContent({ locale = "en" }: { locale?: Locale }) {
  const cv = getCv(locale)
  const strings = t(locale)
  const projects = strings.projectsPage
  const changelog = [
    { title: projects.cardTitle, summary: projects.cardLead },
    ...projects.extraFeatured.map((p) => ({ title: p.title, summary: p.lead })),
  ]
  const otherLocale: Locale = locale === "en" ? "hu" : "en"

  return (
    <div className="concept-page">
      <HtmlLang locale={locale} />
      <div className="concept-wrap">
        <nav className="concept-nav">
          <span>eiplsoma.hu / concept</span>
          <span>
            <Link href="/">{strings.concept.backToTerminal}</Link> &nbsp;·&nbsp;{" "}
            <a href={localePath(locale, "/site")} className="concept-nav-primary">
              {strings.concept.classicSite}
            </a>{" "}
            &nbsp;·&nbsp;{" "}
            <a href={localePath(otherLocale, "/concept")}>{locale === "en" ? "HU" : "EN"}</a>
          </span>
        </nav>

        <div className="concept-status-bar">
          <span className="pulse-dot" />
          All systems operational
        </div>

        <div className="concept-hero">
          <h1>{cv.name}</h1>
          <p className="role">{cv.title} — {cv.tagline}</p>
          <p className="lead">{cv.about[0]}</p>

          <div className="concept-cta-row">
            <a className="concept-btn primary" href={`mailto:${cv.footer.email}`}>
              Email me
            </a>
            <a className="concept-btn" href={`https://${cv.footer.github}`} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="concept-btn" href={`https://${cv.footer.linkedin}`} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="infra-stats">
          <div className="infra-stat">
            <span className="num">2</span>
            <span className="label">{strings.concept.infraStats[0]}</span>
          </div>
          <div className="infra-stat">
            <span className="num">Actions → GHCR → VPS</span>
            <span className="label">{strings.concept.infraStats[1]}</span>
          </div>
          <div className="infra-stat">
            <span className="num">Zero Trust</span>
            <span className="label">{strings.concept.infraStats[2]}</span>
          </div>
          <div className="infra-stat">
            <span className="num">UFW + fail2ban</span>
            <span className="label">{strings.concept.infraStats[3]}</span>
          </div>
        </div>

        <div className="concept-grid">
          <div className="dash-card">
            <h2>Stack status</h2>
            {/* This dashboard frames itself as this site's own live infra
                ("All systems operational"), so it must only list skills that
                are actually part of eiplsoma.hu - not the general CV skills
                list, which also covers confidential client work (SQL/PHP/
                Brevo/Zoho/reverse-engineering) that has nothing to do with
                this site and would misleadingly read as "active" here. */}
            {cv.skills.technical
              .filter((s) => !NOT_THIS_SITE_SKILLS.has(s.text))
              .slice(0, 10)
              .map((s) => (
              <div className="status-row" key={s.text}>
                <span className="status-dot" />
                <span className="name">{s.text}</span>
                <span className="badge">active</span>
              </div>
            ))}
          </div>

          <div className="dash-card">
            <h2>Changelog</h2>
            {changelog.map((e) => (
              <div className="deploy-entry" key={e.title}>
                <div className="deploy-head">
                  <span className="title">{e.title}</span>
                </div>
                <ul>
                  <li>{e.summary}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="concept-footer">
          <div>
            <a href={`mailto:${cv.footer.email}`}>{cv.footer.email}</a>
            <a href={`https://${cv.footer.github}`} target="_blank" rel="noreferrer">
              {cv.footer.github}
            </a>
            <a href={`https://${cv.footer.linkedin}`} target="_blank" rel="noreferrer">
              {cv.footer.linkedin}
            </a>
          </div>
          <div>{cv.languages}</div>
        </div>
      </div>
    </div>
  )
}
