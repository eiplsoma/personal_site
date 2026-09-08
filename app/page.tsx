import Link from "next/link"
import { cv } from "@/lib/cv"
import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  const project = cv.experience.find((e) => e.org === "Personal Project")

  return (
    <>
      <Nav />
      <div className="wrap">
        <section className="hero">
          <div className="prompt">
            <span className="dot" /> soma@eipl:~$ whoami
            <span className="cursor" />
          </div>
          <h1>
            {cv.name}
            <br />
            <span className="accent">{cv.title}</span>
          </h1>
          <div className="role">{cv.tagline} — {cv.contact.location}</div>
          <p className="tagline">
            Currently: <b>{cv.experience[0].title}</b>, building self-hosted infrastructure on the side.
          </p>

          <div className="hero-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-photo" src="/profile-photo.jpg" alt={cv.name} />
            <p className="lead">{cv.about[0]}</p>
          </div>

          <div className="hero-actions">
            <a className="btn primary" href="/cv.pdf" download>
              ↓ Download CV (PDF)
            </a>
            <Link className="btn" href="/projects">
              See the CI/CD project →
            </Link>
          </div>
        </section>

        <div className="divider"># experience</div>
        <section id="work">
          <div className="timeline">
            {cv.experience.map((item) => (
              <div className="titem" key={item.title}>
                <div className="head">
                  <h3>{item.title}</h3>
                  <span className="when">{item.period}</span>
                </div>
                <div className="org">{item.org}</div>
                <ul>
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {project && (
          <>
            <div className="divider"># featured project</div>
            <section>
              <div className="project-card">
                <h3>{project.title}</h3>
                <p className="lead">
                  A Next.js app deployed to a production VPS through a pipeline I built and debugged myself —
                  including the parts that didn&apos;t go to plan.
                </p>
                <div className="project-links">
                  <Link href="/projects">Full write-up →</Link>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="divider"># skills</div>
        <section id="skills">
          <div className="skill-groups">
            <div className="skill-group">
              <div className="gtitle">Technical</div>
              {cv.skills.technical.map((s) => (
                <span className="tag" key={s.text}>
                  {s.text}
                </span>
              ))}
            </div>
            <div className="skill-group">
              <div className="gtitle">Professional</div>
              {cv.skills.professional.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="skill-group">
              <div className="gtitle">Interpersonal</div>
              {cv.skills.interpersonal.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="divider"># background</div>
        <section id="background">
          <div className="gtitle" style={{ marginBottom: 10 }}>Education</div>
          <div className="timeline">
            {cv.education.map((item) => (
              <div className="titem" key={item.degree}>
                <div className="head">
                  <h3>{item.degree}</h3>
                  <span className="when">{item.period}</span>
                </div>
                <div className="org">{item.org}</div>
              </div>
            ))}
          </div>

          <div className="gtitle" style={{ margin: "30px 0 10px" }}>Certifications</div>
          <div className="timeline">
            {cv.certifications.map((item) => (
              <div className="titem" key={item.title}>
                <div className="head">
                  <h3>{item.title}</h3>
                  <span className="when">{item.date}</span>
                </div>
                <div className="org">{item.org}</div>
              </div>
            ))}
          </div>

          <p className="tagline" style={{ marginTop: 30 }}>
            {cv.languages} · {cv.drivingLicence}
          </p>
        </section>
      </div>
      <SiteFooter />
    </>
  )
}
