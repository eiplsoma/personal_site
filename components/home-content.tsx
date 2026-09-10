import Image from "next/image"
import Link from "next/link"
import { getCv } from "@/lib/cv"
import { localePath, t, type Locale } from "@/lib/i18n"
import { Nav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"

export function HomeContent({ locale }: { locale: Locale }) {
  const cv = getCv(locale)
  const strings = t(locale)

  return (
    <>
      <Nav locale={locale} path="/" />
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
            {strings.hero.currentlyPrefix}
            <b>{cv.experience[0].title}</b>
            {strings.hero.currentlySuffix}
          </p>

          <div className="hero-row">
            <Image
              className="hero-photo"
              src="/profile-photo.webp"
              alt={cv.name}
              width={1200}
              height={1600}
              priority
            />
            <p className="lead">{cv.about[0]}</p>
          </div>

          <div className="hero-actions">
            <Link className="btn primary" href={localePath(locale, "/projects")}>
              {strings.hero.seeProject}
            </Link>
          </div>
        </section>

        <div className="divider" id="about">{strings.dividers.about}</div>
        <section>
          {cv.about.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="lead">{cv.lookingFor}</p>
        </section>

        <div className="divider" id="work">{strings.dividers.experience}</div>
        <section>
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

        <div className="divider">{strings.dividers.featuredProject}</div>
        <section>
          <div className="project-card">
            <h3>{strings.projectsPage.cardTitle}</h3>
            <p className="lead">{strings.projectsPage.cardLead}</p>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn primary" href={localePath(locale, "/projects")}>
                {strings.featuredProject.fullWriteUp}
              </Link>
            </div>
          </div>
        </section>

        <div className="divider" id="skills">{strings.dividers.skills}</div>
        <section>
          <div className="skill-groups">
            <div className="skill-group">
              <div className="gtitle">{strings.skillGroups.technical}</div>
              {cv.skills.technical.map((s) => (
                <span className="tag" key={s.text}>
                  {s.text}
                </span>
              ))}
            </div>
            <div className="skill-group">
              <div className="gtitle">{strings.skillGroups.professional}</div>
              {cv.skills.professional.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="skill-group">
              <div className="gtitle">{strings.skillGroups.interpersonal}</div>
              {cv.skills.interpersonal.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" id="principles">{strings.dividers.principles}</div>
        <section>
          <div className="principle-grid">
            {cv.principles.map((p) => (
              <div className="principle-card" key={p.name}>
                <div className="pname">{p.name}</div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" id="background">{strings.dividers.background}</div>
        <section>
          <div className="gtitle" style={{ marginBottom: 10 }}>{strings.background.education}</div>
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

          <div className="gtitle" style={{ margin: "30px 0 10px" }}>{strings.background.certifications}</div>
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
      <SiteFooter locale={locale} />
    </>
  )
}
