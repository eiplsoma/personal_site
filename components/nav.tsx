import Link from "next/link"
import { localePath, t, type Locale } from "@/lib/i18n"

export function Nav({ locale, path = "/" }: { locale: Locale; path?: string }) {
  const strings = t(locale)
  const otherLocale: Locale = locale === "en" ? "hu" : "en"

  return (
    <nav>
      <div className="wrap row">
        <div className="brand-group">
          <Link className="brand" href={localePath(locale, "/")}>
            soma<span>@</span>eipl
          </Link>
          <span className="view-switch">
            <a href="/">terminal</a>
            <a href={localePath(locale, "/concept")}>concept</a>
          </span>
        </div>
        <div className="links">
          <Link href={localePath(locale, "/#about")}>{strings.nav.about}</Link>
          <Link href={localePath(locale, "/#work")}>{strings.nav.work}</Link>
          <Link href={localePath(locale, "/projects")}>{strings.nav.projects}</Link>
          <Link href={localePath(locale, "/#skills")}>{strings.nav.skills}</Link>
          <Link href={localePath(locale, "/#background")}>{strings.nav.background}</Link>
          <Link href={localePath(locale, "/#contact")}>{strings.nav.contact}</Link>
          {/* Reserved: a future "CV Tool" nav entry goes here once the
              admin + public CV generator project is built (separate,
              later spec — see docs/superpowers/specs/). No route/auth
              exists yet, so nothing renders here for now. */}
          <Link href={localePath(otherLocale, path)} className="lang-switch">
            {locale === "en" ? "HU" : "EN"}
          </Link>
        </div>
      </div>
    </nav>
  )
}
