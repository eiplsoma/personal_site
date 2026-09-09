import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { t, type Locale } from "@/lib/i18n"

export function ProjectsContent({ locale }: { locale: Locale }) {
  const strings = t(locale).projectsPage
  const dividers = t(locale).dividers

  return (
    <>
      <Nav locale={locale} path="/projects" />
      <div className="wrap">
        <section className="page-header">
          <div className="eyebrow">{dividers.projects}</div>
          <h1>{strings.h1}</h1>
          <p>{strings.intro}</p>
        </section>

        <section style={{ marginTop: 40 }}>
          <div className="project-card">
            <h3>{strings.cardTitle}</h3>
            <p className="lead">{strings.cardLead}</p>

            <div className="pipeline">
              {["01", "02", "03", "04", "05"].map((num, i) => (
                <div key={num} style={{ display: "contents" }}>
                  <div className="stage">
                    <div className="node">{num}</div>
                    <span>{strings.stages[i]}</span>
                  </div>
                  {i < 4 && <div className="stage-line" />}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 14.5 }}>{strings.story}</p>

            <div className="project-tags">
              <span className="tag">Docker</span>
              <span className="tag">GitHub Actions</span>
              <span className="tag">nginx</span>
              <span className="tag">Let&apos;s Encrypt</span>
              <span className="tag">Cloudflare</span>
              <span className="tag">UFW</span>
            </div>

            <div className="project-links">
              <a href="https://cicd-demo.woollydesign.hu" target="_blank" rel="noreferrer">
                {strings.liveDemo}
              </a>
              <a href="https://github.com/eiplsoma/cicd-nextjs-vps-demo" target="_blank" rel="noreferrer">
                {strings.sourceOnGithub}
              </a>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </>
  )
}
