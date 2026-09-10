import { getCv } from "@/lib/cv"
import { t, type Locale } from "@/lib/i18n"

export function SiteFooter({ locale }: { locale: Locale }) {
  const cv = getCv(locale)
  const strings = t(locale)

  return (
    <footer id="contact">
      <div className="wrap row">
        <div className="contacts">
          <a href={`mailto:${cv.footer.email}`}>{cv.footer.email}</a>
          <a href={`https://${cv.footer.github}`} target="_blank" rel="noreferrer">
            {cv.footer.github}
          </a>
          <a href={`https://${cv.footer.linkedin}`} target="_blank" rel="noreferrer">
            {cv.footer.linkedin}
          </a>
        </div>
        <div className="deploy">
          <div>© {new Date().getFullYear()} {cv.name}</div>
          <div>
            <span className="dot" /> {strings.footer.builtWith}
          </div>
        </div>
      </div>
    </footer>
  )
}
