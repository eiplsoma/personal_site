import type { CvData } from "./cv-tool-types"
import { cvToolStrings, type CvToolLocale } from "./cv-tool-i18n"
import { MapPinIcon, PhoneIcon, MailIcon, GithubIcon, LinkedinIcon } from "./cv-icons"

export function CvTemplate({ cv, locale = "en" }: { cv: CvData; locale?: CvToolLocale }) {
  const s = cvToolStrings[locale].template

  return (
    <div className="cv-page" id="cv-print-page">
      <div className="cv-body">
        <aside className="cv-sidebar">
          <div className="cv-photo-frame-wrap">
            <div className="cv-photo-frame">
              {cv.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cv.photoDataUrl} alt="" />
              ) : null}
            </div>
          </div>

          <section>
            <h2>{s.contact}</h2>
            <div className="row">
              <MapPinIcon />
              <span>{cv.contact.location}</span>
            </div>
            <div className="row">
              <PhoneIcon />
              <span>{cv.contact.phone}</span>
            </div>
            <div className="row">
              <MailIcon />
              <span>{cv.contact.email}</span>
            </div>
          </section>

          <section>
            <h2>{s.about}</h2>
            {cv.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        </aside>

        <main className="cv-main">
          <header>
            <span className="cv-name-wrap">
              <span className="cv-name-highlight" />
              <h1 className="cv-name">{cv.name}</h1>
            </span>
            <p className="cv-title">{cv.title}</p>
            <p className="cv-tagline">{cv.tagline}</p>
          </header>

          <section>
            <h2>{s.experience}</h2>
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-entry">
                <div className="cv-entry-head">
                  <h3>{e.title}</h3>
                  <span>{e.period}</span>
                </div>
                <p className="org">{e.org}</p>
                {e.bullets.length > 0 ? (
                  <>
                    {e.bulletsLabel ? <p className="bullets-label">{e.bulletsLabel}</p> : null}
                    <ul>
                      {e.bullets.map((b, bi) => (
                        <li key={bi}>- {b}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ))}
          </section>

          <section>
            <h2>{s.education}</h2>
            {cv.education.map((e, i) => (
              <div key={i} className="cv-entry">
                <div className="cv-entry-head">
                  <h3 style={{ color: e.highlight ? undefined : "#1a1a1a" }}>{e.degree}</h3>
                  <span>{e.period}</span>
                </div>
                <p className="org" style={{ fontWeight: e.highlight ? 700 : 600 }}>
                  {e.org}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h2>{s.certifications}</h2>
            {cv.certifications.map((c, i) => (
              <div key={i} className="cv-entry">
                <div className="cv-entry-head">
                  <h3>{c.title}</h3>
                  <span>{c.date}</span>
                </div>
                <p className="org" style={{ fontWeight: 700 }}>
                  {c.org}
                </p>
              </div>
            ))}
          </section>

          <div className="cv-skills-wrap">
            <div className="cv-skills-grid">
              <div className="cv-skill-box">
                <h4>{s.professional}</h4>
                <ul>
                  {cv.skills.professional.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="cv-skill-box">
                <h4>{s.technical}</h4>
                <ul>
                  {cv.skills.technical.map((item, i) => (
                    <li key={i}>{item.bold ? <b>{item.text}</b> : item.text}</li>
                  ))}
                </ul>
              </div>
              <div className="cv-skill-box">
                <h4>{s.interpersonal}</h4>
                <ul>
                  {cv.skills.interpersonal.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="cv-bottom-grid">
            <div className="box">
              <h4>{s.languageSkills}</h4>
              <p style={{ margin: 0 }}>{cv.languages}</p>
            </div>
            <div className="box">
              <h4>{s.drivingLicence}</h4>
              <p style={{ margin: 0 }}>{cv.drivingLicence}</p>
            </div>
          </div>
        </main>
      </div>

      <div className="cv-footer-bar">
        <span className="item">
          <MailIcon />
          {cv.footer.email}
        </span>
        <span className="item">
          <PhoneIcon />
          {cv.footer.phone}
        </span>
        <span className="item">
          <GithubIcon />
          {cv.footer.github}
        </span>
        <span className="item">
          <LinkedinIcon />
          {cv.footer.linkedin}
        </span>
      </div>
    </div>
  )
}
