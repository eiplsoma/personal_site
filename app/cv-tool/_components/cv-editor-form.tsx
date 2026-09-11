"use client"

import { createContext, useContext } from "react"
import type { CvData, ExperienceEntry, EduEntry, CertEntry, TechSkill } from "./cv-tool-types"
import { LIMITS, MAX_ITEMS } from "./cv-tool-types"
import { cvToolStrings, type CvToolLocale } from "./cv-tool-i18n"

type Setter = (next: CvData) => void
type FormStrings = { [K in keyof (typeof cvToolStrings)["en"]["form"]]: string }

// While the whole CV still matches one of the untouched sample datasets,
// every field selects its full text on focus - so it behaves like a native
// placeholder (typing immediately replaces it) even though it's a real
// value, needed because the same text must also render in the live preview.
// The instant anything is actually edited, this turns off everywhere.
const PristineContext = createContext(false)

function selectOnFocusIfPristine(pristine: boolean) {
  return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (pristine) e.target.select()
  }
}

// Styles the sample text like a native placeholder (muted colour) while the
// CV is still untouched - purely visual, paired with selectOnFocusIfPristine.
function placeholderClass(pristine: boolean): string | undefined {
  return pristine ? "cv-tool-sample-value" : undefined
}

function Field({
  label,
  value,
  onChange,
  maxLength,
  textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  maxLength: number
  textarea?: boolean
}) {
  const pristine = useContext(PristineContext)
  const onFocus = selectOnFocusIfPristine(pristine)
  return (
    <label className="cv-field">
      <span className="label">
        <span>{label}</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={placeholderClass(pristine)}
        />
      ) : (
        <input
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={placeholderClass(pristine)}
        />
      )}
    </label>
  )
}

function StringListEditor({
  label,
  items,
  maxLength,
  maxItems,
  addLabel,
  onChange,
}: {
  label: string
  items: string[]
  maxLength: number
  maxItems: number
  addLabel: string
  onChange: (items: string[]) => void
}) {
  const pristine = useContext(PristineContext)
  const onFocus = selectOnFocusIfPristine(pristine)
  return (
    <div className="cv-section">
      <h3>{label}</h3>
      {items.map((item, i) => (
        <div key={i} className="cv-tool-row">
          <input
            value={item}
            maxLength={maxLength}
            className={placeholderClass(pristine)}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            onFocus={onFocus}
          />
          <button className="cv-tool-x" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            ✕
          </button>
        </div>
      ))}
      {items.length < maxItems ? (
        <button className="cv-tool-add" onClick={() => onChange([...items, ""])}>
          {addLabel}
        </button>
      ) : null}
    </div>
  )
}

function TechSkillsEditor({
  items,
  strings,
  onChange,
}: {
  items: TechSkill[]
  strings: FormStrings
  onChange: (items: TechSkill[]) => void
}) {
  const pristine = useContext(PristineContext)
  const onFocus = selectOnFocusIfPristine(pristine)
  return (
    <div className="cv-section">
      <h3>{strings.technicalSkills}</h3>
      {items.map((item, i) => (
        <div key={i} className="cv-tool-row">
          <input
            value={item.text}
            maxLength={LIMITS.skillItem}
            className={placeholderClass(pristine)}
            onChange={(e) => {
              const next = [...items]
              next[i] = { ...next[i], text: e.target.value }
              onChange(next)
            }}
            onFocus={onFocus}
          />
          <label className="cv-tool-checkbox">
            <input
              type="checkbox"
              checked={item.bold}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], bold: e.target.checked }
                onChange(next)
              }}
            />
            {strings.bold}
          </label>
          <button className="cv-tool-x" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            ✕
          </button>
        </div>
      ))}
      {items.length < MAX_ITEMS.skillItems ? (
        <button className="cv-tool-add" onClick={() => onChange([...items, { text: "", bold: false }])}>
          {strings.add}
        </button>
      ) : null}
    </div>
  )
}

function ExperienceEditor({
  items,
  strings,
  onChange,
}: {
  items: ExperienceEntry[]
  strings: FormStrings
  onChange: (items: ExperienceEntry[]) => void
}) {
  const update = (i: number, patch: Partial<ExperienceEntry>) => {
    const next = [...items]
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  const pristine = useContext(PristineContext)
  const onFocus = selectOnFocusIfPristine(pristine)
  return (
    <div className="cv-section">
      <h3>{strings.experience}</h3>
      {items.map((entry, i) => (
        <div key={i} className="cv-tool-box">
          <div className="cv-tool-box-header">
            <span>
              {strings.entry} {i + 1}
            </span>
            <button className="cv-tool-x" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              {strings.remove}
            </button>
          </div>
          <Field label={strings.title} value={entry.title} maxLength={LIMITS.expTitle} onChange={(v) => update(i, { title: v })} />
          <Field
            label={strings.organisation}
            value={entry.org}
            maxLength={LIMITS.expOrg}
            onChange={(v) => update(i, { org: v })}
          />
          <Field label={strings.period} value={entry.period} maxLength={LIMITS.expPeriod} onChange={(v) => update(i, { period: v })} />
          <Field
            label={strings.bulletsLabel}
            value={entry.bulletsLabel}
            maxLength={LIMITS.bulletsLabel}
            onChange={(v) => update(i, { bulletsLabel: v })}
          />
          {entry.bullets.map((b, bi) => (
            <div key={bi} className="cv-tool-row">
              <textarea
                rows={2}
                value={b}
                maxLength={LIMITS.bullet}
                className={placeholderClass(pristine)}
                onChange={(e) => {
                  const bullets = [...entry.bullets]
                  bullets[bi] = e.target.value
                  update(i, { bullets })
                }}
                onFocus={onFocus}
              />
              <button
                className="cv-tool-x"
                onClick={() => update(i, { bullets: entry.bullets.filter((_, idx) => idx !== bi) })}
              >
                ✕
              </button>
            </div>
          ))}
          {entry.bullets.length < MAX_ITEMS.bulletsPerExperience ? (
            <button className="cv-tool-add" onClick={() => update(i, { bullets: [...entry.bullets, ""] })}>
              {strings.addBullet}
            </button>
          ) : null}
        </div>
      ))}
      {items.length < MAX_ITEMS.experienceEntries ? (
        <button
          className="cv-tool-add"
          onClick={() =>
            onChange([
              ...items,
              { title: "", org: "", period: "", bulletsLabel: "Highlights:", bullets: [] },
            ])
          }
        >
          {strings.addExperience}
        </button>
      ) : null}
    </div>
  )
}

function EducationEditor({
  items,
  strings,
  onChange,
}: {
  items: EduEntry[]
  strings: FormStrings
  onChange: (items: EduEntry[]) => void
}) {
  const update = (i: number, patch: Partial<EduEntry>) => {
    const next = [...items]
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  return (
    <div className="cv-section">
      <h3>{strings.education}</h3>
      {items.map((entry, i) => (
        <div key={i} className="cv-tool-box">
          <div className="cv-tool-box-header">
            <span>
              {strings.entry} {i + 1}
            </span>
            <button className="cv-tool-x" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              {strings.remove}
            </button>
          </div>
          <Field label={strings.degree} value={entry.degree} maxLength={LIMITS.eduDegree} onChange={(v) => update(i, { degree: v })} />
          <Field
            label={strings.institution}
            value={entry.org}
            maxLength={LIMITS.eduOrg}
            onChange={(v) => update(i, { org: v })}
          />
          <Field label={strings.period} value={entry.period} maxLength={LIMITS.eduPeriod} onChange={(v) => update(i, { period: v })} />
        </div>
      ))}
      {items.length < MAX_ITEMS.educationEntries ? (
        <button
          className="cv-tool-add"
          onClick={() => onChange([...items, { degree: "", org: "", period: "", highlight: false }])}
        >
          {strings.addEducation}
        </button>
      ) : null}
    </div>
  )
}

function CertificationsEditor({
  items,
  strings,
  onChange,
}: {
  items: CertEntry[]
  strings: FormStrings
  onChange: (items: CertEntry[]) => void
}) {
  const update = (i: number, patch: Partial<CertEntry>) => {
    const next = [...items]
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  return (
    <div className="cv-section">
      <h3>{strings.certifications}</h3>
      {items.map((entry, i) => (
        <div key={i} className="cv-tool-box">
          <div className="cv-tool-box-header">
            <span>
              {strings.entry} {i + 1}
            </span>
            <button className="cv-tool-x" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              {strings.remove}
            </button>
          </div>
          <Field label={strings.certTitle} value={entry.title} maxLength={LIMITS.certTitle} onChange={(v) => update(i, { title: v })} />
          <Field
            label={strings.organisation}
            value={entry.org}
            maxLength={LIMITS.certOrg}
            onChange={(v) => update(i, { org: v })}
          />
          <Field label={strings.date} value={entry.date} maxLength={LIMITS.certDate} onChange={(v) => update(i, { date: v })} />
        </div>
      ))}
      {items.length < MAX_ITEMS.certifications ? (
        <button className="cv-tool-add" onClick={() => onChange([...items, { title: "", org: "", date: "" }])}>
          {strings.addCertification}
        </button>
      ) : null}
    </div>
  )
}

// Turns a plain space the user just typed into " · ", so a tagline reads
// "Skill · Skill · Skill" without the user having to type the dot themselves.
// Only fires on a single freshly-typed space (not on paste/edits elsewhere),
// and never grows the value past maxLength.
function withAutoDotSeparator(oldValue: string, newValue: string, maxLength: number): string {
  const typedOneSpace = newValue.length === oldValue.length + 1 && newValue.endsWith(" ") && !newValue.endsWith(" · ")
  if (!typedOneSpace) return newValue
  const withDot = newValue.slice(0, -1) + " · "
  return withDot.length > maxLength ? newValue : withDot
}

export function CvEditorForm({
  cv,
  locale = "en",
  pristine = false,
  onChange,
}: {
  cv: CvData
  locale?: CvToolLocale
  pristine?: boolean
  onChange: Setter
}) {
  const strings = cvToolStrings[locale].form
  const patch = (p: Partial<CvData>) => onChange({ ...cv, ...p })

  return (
    <PristineContext.Provider value={pristine}>
    <div>
      <div className="cv-section" style={{ borderTop: "none", paddingTop: 0 }}>
        <h3>{strings.photo}</h3>
        <label className="btn-like" style={{ display: "inline-block" }}>
          {strings.uploadPhoto}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => patch({ photoDataUrl: reader.result as string })
              reader.readAsDataURL(file)
            }}
          />
        </label>
        {cv.photoDataUrl ? (
          <button className="cv-tool-add" style={{ marginLeft: 8 }} onClick={() => patch({ photoDataUrl: null })}>
            {strings.removePhoto}
          </button>
        ) : null}
      </div>

      <div className="cv-section">
        <h3>{strings.header}</h3>
        <Field label={strings.name} value={cv.name} maxLength={LIMITS.name} onChange={(v) => patch({ name: v })} />
        <Field label={strings.title} value={cv.title} maxLength={LIMITS.title} onChange={(v) => patch({ title: v })} />
        <Field
          label={strings.tagline}
          value={cv.tagline}
          maxLength={LIMITS.tagline}
          onChange={(v) => patch({ tagline: withAutoDotSeparator(cv.tagline, v, LIMITS.tagline) })}
        />
      </div>

      <div className="cv-section">
        <h3>{strings.contact}</h3>
        <Field
          label={strings.location}
          value={cv.contact.location}
          maxLength={LIMITS.location}
          onChange={(v) => patch({ contact: { ...cv.contact, location: v } })}
        />
        <Field
          label={strings.phone}
          value={cv.contact.phone}
          maxLength={LIMITS.phone}
          onChange={(v) => patch({ contact: { ...cv.contact, phone: v } })}
        />
        <Field
          label={strings.email}
          value={cv.contact.email}
          maxLength={LIMITS.email}
          onChange={(v) => patch({ contact: { ...cv.contact, email: v } })}
        />
      </div>

      <StringListEditor
        label={strings.about}
        items={cv.about}
        maxLength={LIMITS.aboutParagraph}
        maxItems={MAX_ITEMS.aboutParagraphs}
        addLabel={strings.add}
        onChange={(about) => patch({ about })}
      />

      <ExperienceEditor items={cv.experience} strings={strings} onChange={(experience) => patch({ experience })} />
      <EducationEditor items={cv.education} strings={strings} onChange={(education) => patch({ education })} />
      <CertificationsEditor items={cv.certifications} strings={strings} onChange={(certifications) => patch({ certifications })} />

      <StringListEditor
        label={strings.professionalSkills}
        items={cv.skills.professional}
        maxLength={LIMITS.skillItem}
        maxItems={MAX_ITEMS.skillItems}
        addLabel={strings.add}
        onChange={(professional) => patch({ skills: { ...cv.skills, professional } })}
      />
      <TechSkillsEditor
        items={cv.skills.technical}
        strings={strings}
        onChange={(technical) => patch({ skills: { ...cv.skills, technical } })}
      />
      <StringListEditor
        label={strings.interpersonalSkills}
        items={cv.skills.interpersonal}
        maxLength={LIMITS.skillItem}
        maxItems={MAX_ITEMS.skillItems}
        addLabel={strings.add}
        onChange={(interpersonal) => patch({ skills: { ...cv.skills, interpersonal } })}
      />

      <div className="cv-section">
        <h3>{strings.other}</h3>
        <Field label={strings.languages} value={cv.languages} maxLength={LIMITS.languages} onChange={(v) => patch({ languages: v })} />
        <Field
          label={strings.drivingLicence}
          value={cv.drivingLicence}
          maxLength={LIMITS.drivingLicence}
          onChange={(v) => patch({ drivingLicence: v })}
        />
      </div>

      <div className="cv-section">
        <h3>{strings.footer}</h3>
        <Field
          label={strings.email}
          value={cv.footer.email}
          maxLength={LIMITS.email}
          onChange={(v) => patch({ footer: { ...cv.footer, email: v } })}
        />
        <Field
          label={strings.phone}
          value={cv.footer.phone}
          maxLength={LIMITS.phone}
          onChange={(v) => patch({ footer: { ...cv.footer, phone: v } })}
        />
        <Field
          label={strings.github}
          value={cv.footer.github}
          maxLength={LIMITS.email}
          onChange={(v) => patch({ footer: { ...cv.footer, github: v } })}
        />
        <Field
          label={strings.linkedin}
          value={cv.footer.linkedin}
          maxLength={LIMITS.email}
          onChange={(v) => patch({ footer: { ...cv.footer, linkedin: v } })}
        />
      </div>
    </div>
    </PristineContext.Provider>
  )
}
