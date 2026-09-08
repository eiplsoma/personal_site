import { cv } from "@/lib/cv"

export function SiteFooter() {
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
          <span className="dot" /> built with Next.js · deployed via GitHub Actions
        </div>
      </div>
    </footer>
  )
}
