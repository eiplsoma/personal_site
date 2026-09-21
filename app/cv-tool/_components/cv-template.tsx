import type { CvData } from "./cv-tool-types"
import { cvToolStrings, type CvToolLocale } from "./cv-tool-i18n"
import { MapPinIcon, PhoneIcon, MailIcon, GithubIcon, LinkedinIcon, GlobeIcon } from "./cv-icons"

// Falls back to the sample text (styled as a muted hint) while a field is
// still empty, so the preview doesn't go blank before the user fills
// anything in - real content, once typed, always wins outright.
function Hint({ value, sample }: { value: string; sample: string }) {
  return value ? <>{value}</> : <span className="cv-hint">{sample}</span>
}

export function CvTemplate({ cv, sample, locale = "en" }: { cv: CvData; sample: CvData; locale?: CvToolLocale }) {
  const s = cvToolStrings[locale].template
  const photoLabel = cvToolStrings[locale].form.photo

  return (
    <div className="cv-page" id="cv-print-page">
      <div className="cv-body">
        <aside className="cv-sidebar">
          <div className="cv-photo-frame-wrap">
            <div className="cv-photo-frame">
              {cv.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cv.photoDataUrl} alt={cv.name || photoLabel} />
              ) : null}
            </div>
          </div>

          <section>
            <h2>{s.contact}</h2>
            <div className="row">
              <MapPinIcon />
              <span>
                <Hint value={cv.contact.location} sample={sample.contact.location} />
              </span>
            </div>
            <div className="row">
              <PhoneIcon />
              <span>
                <Hint value={cv.contact.phone} sample={sample.contact.phone} />
              </span>
            </div>
            <div className="row">
              <MailIcon />
              <span>
                <Hint value={cv.contact.email} sample={sample.contact.email} />
              </span>
            </div>
          </section>

          <section>
            <h2>{s.about}</h2>
            {cv.about.map((p, i) => (
              <p key={i}>
                <Hint value={p} sample={sample.about[i] ?? sample.about[0] ?? ""} />
              </p>
            ))}
          </section>
        </aside>

        <main className="cv-main">
          <header>
            <span className="cv-name-wrap">
              <span className="cv-name-highlight" />
              <h1 className="cv-name">
                <Hint value={cv.name} sample={sample.name} />
              </h1>
            </span>
            <p className="cv-title">
              <Hint value={cv.title} sample={sample.title} />
            </p>
            <p className="cv-tagline">
              <Hint value={cv.tagline} sample={sample.tagline} />
            </p>
          </header>

          <section>
            <h2>{s.experience}</h2>
            {cv.experience.map((e, i) => {
              const es = sample.experience[i] ?? sample.experience[0]
              return (
                <div key={i} className="cv-entry">
                  <div className="cv-entry-head">
                    <h3>
                      <Hint value={e.title} sample={es?.title ?? ""} />
                    </h3>
                    <span>
                      <Hint value={e.period} sample={es?.period ?? ""} />
                    </span>
                  </div>
                  <p className="org">
                    <Hint value={e.org} sample={es?.org ?? ""} />
                  </p>
                  {e.bullets.length > 0 ? (
                    <>
                      <p className="bullets-label">
                        <Hint value={e.bulletsLabel} sample={es?.bulletsLabel ?? ""} />
                      </p>
                      <ul>
                        {e.bullets.map((b, bi) => (
                          <li key={bi}>
                            - <Hint value={b} sample={es?.bullets[bi] ?? es?.bullets[0] ?? ""} />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              )
            })}
          </section>

          <section>
            <h2>{s.education}</h2>
            {cv.education.map((e, i) => {
              const es = sample.education[i] ?? sample.education[0]
              return (
                <div key={i} className="cv-entry">
                  <div className="cv-entry-head">
                    <h3 style={{ color: e.highlight ? undefined : "#1a1a1a" }}>
                      <Hint value={e.degree} sample={es?.degree ?? ""} />
                    </h3>
                    <span>
                      <Hint value={e.period} sample={es?.period ?? ""} />
                    </span>
                  </div>
                  <p className="org" style={{ fontWeight: e.highlight ? 700 : 600 }}>
                    <Hint value={e.org} sample={es?.org ?? ""} />
                  </p>
                  {e.courses.length > 0 ? (
                    <p className="cv-edu-courses">
                      <span className="cv-edu-courses-label">{s.relevantCourses}</span> {e.courses.join(", ")}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </section>

          <section>
            <h2>{s.certifications}</h2>
            {cv.certifications.map((c, i) => {
              const cs = sample.certifications[i] ?? sample.certifications[0]
              return (
                <div key={i} className="cv-entry">
                  <div className="cv-entry-head">
                    <h3>
                      <Hint value={c.title} sample={cs?.title ?? ""} />
                    </h3>
                    <span>
                      <Hint value={c.date} sample={cs?.date ?? ""} />
                    </span>
                  </div>
                  <p className="org" style={{ fontWeight: 700 }}>
                    <Hint value={c.org} sample={cs?.org ?? ""} />
                  </p>
                  {c.detail ? <p className="cv-edu-courses">{c.detail}</p> : null}
                </div>
              )
            })}
          </section>

          <div className="cv-skills-wrap">
            <div className="cv-skills-grid">
              <div className="cv-skill-box">
                <h4>{s.professional}</h4>
                <ul>
                  {cv.skills.professional.map((item, i) => (
                    <li key={i}>
                      <Hint value={item} sample={sample.skills.professional[i] ?? sample.skills.professional[0] ?? ""} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cv-skill-box">
                <h4>{s.technical}</h4>
                <ul>
                  {cv.skills.technical.map((item, i) => {
                    const ts = sample.skills.technical[i] ?? sample.skills.technical[0]
                    const node = <Hint value={item.text} sample={ts?.text ?? ""} />
                    return <li key={i}>{item.bold ? <b>{node}</b> : node}</li>
                  })}
                </ul>
              </div>
              <div className="cv-skill-box">
                <h4>{s.interpersonal}</h4>
                <ul>
                  {cv.skills.interpersonal.map((item, i) => (
                    <li key={i}>
                      <Hint value={item} sample={sample.skills.interpersonal[i] ?? sample.skills.interpersonal[0] ?? ""} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="cv-bottom-grid">
            <div className="box">
              <h4>{s.languageSkills}</h4>
              <p style={{ margin: 0 }}>
                <Hint value={cv.languages} sample={sample.languages} />
              </p>
            </div>
            <div className="box">
              <h4>{s.drivingLicence}</h4>
              <p style={{ margin: 0 }}>
                <Hint value={cv.drivingLicence} sample={sample.drivingLicence} />
              </p>
            </div>
          </div>
        </main>
      </div>

      <div className="cv-footer-bar">
        <span className="item">
          <MailIcon />
          <Hint value={cv.footer.email} sample={sample.footer.email} />
        </span>
        <span className="item">
          <PhoneIcon />
          <Hint value={cv.footer.phone} sample={sample.footer.phone} />
        </span>
        <span className="item">
          <GithubIcon />
          <Hint value={cv.footer.github} sample={sample.footer.github} />
        </span>
        <span className="item">
          <LinkedinIcon />
          <Hint value={cv.footer.linkedin} sample={sample.footer.linkedin} />
        </span>
        <span className="item">
          <GlobeIcon />
          <Hint value={cv.footer.website} sample={sample.footer.website} />
        </span>
      </div>
    </div>
  )
}
