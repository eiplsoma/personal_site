"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CvEditorForm } from "./_components/cv-editor-form"
import { CvTemplate } from "./_components/cv-template"
import { EMPTY_CV, sampleCvFor } from "./_components/default-cv"
import { sanitizeCv } from "./_components/sanitize-cv"
import { extractTranslatable, applyTranslatable, buildTranslationPrompt, type TranslatablePayload } from "./_components/translate-payload"
import { STORAGE_KEY, type CvData } from "./_components/cv-tool-types"
import { CV_TOOL_LOCALE_KEY, cvToolStrings, type CvToolLocale } from "./_components/cv-tool-i18n"
import "./cv-tool.css"

// How far short of the container's bottom edge the last child sits (negative
// = comfortable slack, positive = actually overflowing the fixed A4 page).
function measureOverflow(container: Element | null): number {
  if (!container || !container.lastElementChild) return 0
  const top = container.getBoundingClientRect().top
  const bottom = container.lastElementChild.getBoundingClientRect().bottom
  return Math.round(bottom - top - (container as HTMLElement).clientHeight)
}

export function CvToolClient() {
  const [cv, setCv] = useState<CvData>(EMPTY_CV)
  const [locale, setLocale] = useState<CvToolLocale>("en")
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState("")
  const [overflowPx, setOverflowPx] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const strings = cvToolStrings[locale].toolbar
  const sample = sampleCvFor(locale)

  useEffect(() => {
    let initialLocale: CvToolLocale = "en"
    try {
      const savedLocale = localStorage.getItem(CV_TOOL_LOCALE_KEY)
      if (savedLocale === "en" || savedLocale === "hu") initialLocale = savedLocale
      setLocale(initialLocale)

      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setCv(sanitizeCv(JSON.parse(raw), EMPTY_CV))
      }
    } catch {
      // corrupt or inaccessible storage - fall back to the empty default
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(CV_TOOL_LOCALE_KEY, locale)
    } catch {
      // browser storage unavailable - locale just won't persist across visits
    }
  }, [locale, loaded])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv))
      setStatus(`${cvToolStrings[locale].toolbar.savedPrefix}${new Date().toLocaleTimeString()}`)
    } catch {
      setStatus(cvToolStrings[locale].toolbar.saveError)
    }
  }, [cv, loaded, locale])

  useEffect(() => {
    if (!loaded) return
    const container = previewRef.current
    if (!container) return

    const measure = () => {
      const main = container.querySelector(".cv-main")
      const sidebar = container.querySelector(".cv-sidebar")
      setOverflowPx(Math.max(measureOverflow(main), measureOverflow(sidebar), 0))
    }

    // Fonts/images can still be settling right after a render; re-measure
    // on the next frame as well as immediately.
    measure()
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [cv, loaded])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${cv.name.replace(/\s+/g, "-").toLowerCase() || "cv"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        setCv(sanitizeCv(parsed, EMPTY_CV))
        setStatus(strings.imported)
      } catch {
        setStatus(strings.importError)
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (!confirm(strings.resetConfirm)) return
    setCv(EMPTY_CV)
  }

  const handleCopyForAi = async () => {
    const targetLanguage = locale === "en" ? "Hungarian" : "English"
    const prompt = buildTranslationPrompt(extractTranslatable(cv), targetLanguage)
    try {
      await navigator.clipboard.writeText(prompt)
      setStatus(strings.copiedForAi)
    } catch {
      setStatus(strings.copyForAiError)
    }
  }

  const handlePasteAiTranslation = () => {
    const pasted = window.prompt(strings.pasteAiPrompt)
    if (!pasted) return
    try {
      const translated = JSON.parse(pasted) as TranslatablePayload
      setCv(applyTranslatable(cv, translated))
      setStatus(strings.pasteAiSuccess)
    } catch {
      setStatus(strings.pasteAiError)
    }
  }

  if (!loaded) return null

  return (
    <div className="cv-tool-page">
      <div className="cv-tool-editor">
        <div className="cv-tool-toolbar">
          <Link href={locale === "hu" ? "/hu/projects" : "/projects"}>{strings.backToProjects}</Link>
          <button onClick={() => window.print()}>{strings.exportPdf}</button>
          <button onClick={handleExport}>{strings.exportJson}</button>
          <button onClick={handleImportClick}>{strings.importJson}</button>
          <button onClick={handleReset}>{strings.reset}</button>
          <button onClick={handleCopyForAi}>{strings.copyForAi}</button>
          <button onClick={handlePasteAiTranslation}>{strings.pasteAiTranslation}</button>
          <button onClick={() => setLocale(locale === "en" ? "hu" : "en")}>{locale === "en" ? "HU" : "EN"}</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ""
            }}
          />
          <span className="cv-tool-status">{status}</span>
        </div>
        {overflowPx > 0 ? (
          <div className="cv-tool-overflow-warning">{strings.overflowWarning.replace("{px}", String(overflowPx))}</div>
        ) : null}
        <div className="cv-tool-form">
          <CvEditorForm cv={cv} sample={sample} locale={locale} onChange={setCv} />
        </div>
      </div>
      <div className="cv-tool-preview-pane" ref={previewRef}>
        <CvTemplate cv={cv} sample={sample} locale={locale} />
      </div>
    </div>
  )
}
