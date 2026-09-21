import Link from "next/link"
import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { localePath, t, type Locale } from "@/lib/i18n"

// One screenshot thumbnail per "main" project (the pipeline card + the 3
// extraFeatured ones), in display order - purely decorative, not tied to
// project data. Source screenshots and the crop/resize script live in the
// gitignored /photos-raw/ - these are the only committed, public output.
const mainProjectThumbs = ["cicd-demo", "cv-tool", "this-site", "woolly-demo"]

// The thumbnail links to whatever the card's own primary action already
// is - a live demo first, then an internal tool page, then the repo -
// same priority order the text links below it already use.
function ProjectThumb({ thumb, href, internal }: { thumb: string; href?: string; internal?: boolean }) {
  if (!href) return null
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail, not the LCP
    <img className="project-thumb" src={`/project-thumbs/${thumb}.webp`} alt="" />
  )
  return internal ? (
    <Link href={href} className="project-thumb-link">
      {img}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className="project-thumb-link">
      {img}
    </a>
  )
}

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
            <ProjectThumb thumb={mainProjectThumbs[0]} href="https://cicd-demo.eiplsoma.hu" />
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
              <a href="https://cicd-demo.eiplsoma.hu" target="_blank" rel="noreferrer">
                {strings.liveDemo}
              </a>
              <a href="https://github.com/eiplsoma/cicd-nextjs-vps-demo" target="_blank" rel="noreferrer">
                {strings.sourceOnGithub}
              </a>
            </div>
          </div>

          {strings.extraFeatured.map((p, i) => {
            const thumb = mainProjectThumbs[i + 1]
            const live = "live" in p ? p.live : undefined
            const useLink = "useLink" in p ? p.useLink : undefined
            const github = "github" in p ? p.github : undefined
            // "This site" (index 1) has no live/useLink of its own - it IS
            // the site you're already on, so its thumbnail should send you
            // to the actual home page rather than falling back to GitHub.
            // localePath(locale, "/") resolves per-locale (/site for en,
            // /hu for hu), unlike a hardcoded "/" which would always land
            // on the English terminal regardless of locale.
            const isThisSite = i === 1
            const thumbHref = isThisSite ? localePath(locale, "/") : (live ?? useLink ?? github)
            return (
            <div className="project-card" key={p.title}>
              {thumb ? (
                <ProjectThumb thumb={thumb} href={thumbHref} internal={isThisSite || (!live && !!useLink)} />
              ) : null}
              <h3>{p.title}</h3>
              <p className="lead">{p.lead}</p>
              <div className="project-tags">
                {p.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links">
                {"useLink" in p && p.useLink && <Link href={p.useLink}>{strings.useIt}</Link>}
                {"live" in p && p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer">
                    {strings.liveDemo}
                  </a>
                )}
                {"github" in p && p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer">
                    {strings.sourceOnGithub}
                  </a>
                )}
              </div>
            </div>
            )
          })}
        </section>

        <section style={{ marginTop: 50 }}>
          <div className="eyebrow">{strings.sectionConfidential}</div>
          <p className="lead" style={{ marginTop: 6 }}>{strings.confidentialNote}</p>
          {strings.confidential.map((c) => (
            <div className="project-card" key={c.title}>
              <h3>{c.title}</h3>
              <p className="lead">{c.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 50 }}>
          <div className="eyebrow">{strings.sectionAdditional}</div>
          <ul className="additional-list">
            {strings.additional.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </>
  )
}
