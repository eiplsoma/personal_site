import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Projects — Soma Eipl",
}

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <div className="wrap">
        <section className="page-header">
          <div className="eyebrow"># projects</div>
          <h1>Things I&apos;ve built and deployed myself</h1>
          <p>Personal infrastructure projects — the pipeline, the debugging, and what broke along the way.</p>
        </section>

        <section style={{ marginTop: 40 }}>
          <div className="project-card">
            <h3>Self-hosted CI/CD pipeline</h3>
            <p className="lead">
              A Next.js app deployed to a production VPS through a pipeline I built and debugged myself —
              including the parts that didn&apos;t go to plan.
            </p>

            <div className="pipeline">
              <div className="stage">
                <div className="node">01</div>
                <span>build</span>
              </div>
              <div className="stage-line" />
              <div className="stage">
                <div className="node">02</div>
                <span>test</span>
              </div>
              <div className="stage-line" />
              <div className="stage">
                <div className="node">03</div>
                <span>image</span>
              </div>
              <div className="stage-line" />
              <div className="stage">
                <div className="node">04</div>
                <span>ssh deploy</span>
              </div>
              <div className="stage-line" />
              <div className="stage">
                <div className="node">05</div>
                <span>health check</span>
              </div>
            </div>

            <p style={{ fontSize: 14.5 }}>
              The plan didn&apos;t survive first contact with the real environment: a shared VPS with nginx already
              on 80/443, a domain behind Cloudflare with delegated nameservers, and a CDN feature that broke the
              automated health check — resolved by moving the check inside the VPS instead of over the public
              internet.
            </p>

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
                Live demo →
              </a>
              <a href="https://github.com/eiplsoma/cicd-nextjs-vps-demo" target="_blank" rel="noreferrer">
                Source on GitHub →
              </a>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  )
}
