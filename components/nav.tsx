import Link from "next/link"
import { localePath, t, type Locale } from "@/lib/i18n"

export function Nav({ locale, path = "/" }: { locale: Locale; path?: string }) {
  const strings = t(locale)
  const otherLocale: Locale = locale === "en" ? "hu" : "en"

  return (
    <nav>
      <div className="wrap row">
        <Link className="brand" href={localePath(locale, "/")}>
          soma<span>@</span>eipl
        </Link>
        <div className="links">
          <Link href={localePath(locale, "/#about")}>{strings.nav.about}</Link>
          <Link href={localePath(locale, "/#work")}>{strings.nav.work}</Link>
          <Link href={localePath(locale, "/projects")}>{strings.nav.projects}</Link>
          <Link href={localePath(locale, "/#skills")}>{strings.nav.skills}</Link>
          <Link href={localePath(locale, "/#background")}>{strings.nav.background}</Link>
          <Link href={localePath(locale, "/#contact")}>{strings.nav.contact}</Link>
          <Link href={localePath(otherLocale, path)} className="lang-switch">
            {locale === "en" ? "HU" : "EN"}
          </Link>
        </div>
      </div>
    </nav>
  )
}
