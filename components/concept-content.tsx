import { getCv } from "@/lib/cv"
import "@/app/concept/concept.css"

export function ConceptContent() {
  const cv = getCv("en")

  return (
    <div className="concept-page">
      <div className="concept-wrap">
        <nav className="concept-nav">
          <span>eiplsoma.hu / concept</span>
          <span>
            <a href="/">← terminal</a> &nbsp;·&nbsp; <a href="/site">classic site →</a>
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
            <span className="label">inbound ports open (80/443)</span>
          </div>
          <div className="infra-stat">
            <span className="num">Actions → GHCR → VPS</span>
            <span className="label">this site's own deploy pipeline</span>
          </div>
          <div className="infra-stat">
            <span className="num">Zero Trust</span>
            <span className="label">SSH behind a Cloudflare Tunnel</span>
          </div>
          <div className="infra-stat">
            <span className="num">UFW + fail2ban</span>
            <span className="label">firewall & intrusion prevention</span>
          </div>
        </div>

        <div className="concept-grid">
          <div className="dash-card">
            <h2>Stack status</h2>
            {cv.skills.technical.slice(0, 10).map((s) => (
              <div className="status-row" key={s.text}>
                <span className="status-dot" />
                <span className="name">{s.text}</span>
                <span className="badge">operational</span>
              </div>
            ))}
          </div>

          <div className="dash-card">
            <h2>Deploy log</h2>
            {cv.experience.map((e) => (
              <div className="deploy-entry" key={e.title}>
                <div className="deploy-head">
                  <span className="title">{e.title}</span>
                  <span className="period">{e.period}</span>
                </div>
                <div className="deploy-org">{e.org}</div>
                <ul>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
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
          </div>
          <div>{cv.languages}</div>
        </div>
      </div>
    </div>
  )
}
