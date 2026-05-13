import { useState, useMemo } from 'react'
import { useDemo } from '../store/store'
import { ALL_LANGUAGES, isFullyTranslated, t } from './consent-translations'
import type { ConsentRecord, DataPoint, Vendor } from '../store/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PurposeGroup {
  purpose: string
  purposeCode: string
  dataPoints: DataPoint[]
  expiryDate: string
  legalBasis: string
  consentId: string
  vendors: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupByPurpose(consents: ConsentRecord[]): PurposeGroup[] {
  return consents.map(c => ({
    purpose: c.purpose,
    purposeCode: c.purposeCode,
    dataPoints: c.dataPoints,
    expiryDate: c.expiryDate,
    legalBasis: c.legalBasis,
    consentId: c.id,
    vendors: c.vendors,
  }))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PerfiosWordmark() {
  return (
    <span className="text-[15px] font-bold tracking-tight text-perfios-700">
      Perfios
    </span>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CheckboxChecked() {
  return (
    <div className="w-4 h-4 rounded bg-perfios-700 flex items-center justify-center flex-shrink-0">
      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
}

function CheckboxUnchecked() {
  return (
    <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
  )
}

// ─── Purpose accordion ────────────────────────────────────────────────────────

interface PurposeAccordionProps {
  group: PurposeGroup
  isEssential: boolean
  isOptional: boolean
  toggled: boolean
  onToggle: () => void
  expanded: boolean
  onExpand: () => void
  activeLang: string
  vendors: Vendor[]
  onDataPointClick: (dp: DataPoint, group: PurposeGroup) => void
}

function PurposeAccordion({
  group,
  isEssential,
  toggled,
  onToggle,
  expanded,
  onExpand,
  activeLang,
  vendors: allVendors,
  onDataPointClick,
}: PurposeAccordionProps) {
  const vendorObjects = allVendors.filter(v => group.vendors.includes(v.id))

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Purpose header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white cursor-pointer select-none"
        onClick={onExpand}
      >
        {/* Checkbox / toggle */}
        {isEssential ? (
          <CheckboxChecked />
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onToggle() }}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${toggled ? 'bg-perfios-700' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${toggled ? 'left-4' : 'left-0.5'}`} />
          </button>
        )}

        <span className="flex-1 text-sm font-medium text-slate-800">{group.purpose}</span>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded data points */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 pt-2 pb-3 space-y-2">
          {group.dataPoints.map(dp => (
            <button
              key={dp.id}
              onClick={() => onDataPointClick(dp, group)}
              className="flex items-center gap-2.5 w-full text-left hover:bg-white rounded-md px-2 py-1.5 transition group"
            >
              {isEssential ? (
                <div className="w-3.5 h-3.5 rounded border border-slate-400 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-sm bg-perfios-700" />
                </div>
              ) : (
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${toggled ? 'border-perfios-700 bg-perfios-700' : 'border-slate-300'}`}>
                  {toggled && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              )}
              <span className="text-xs text-slate-700 group-hover:text-perfios-700 underline decoration-dotted underline-offset-2 transition">
                {dp.label}
              </span>
              {vendorObjects.length > 0 && (
                <svg className="w-3 h-3 text-slate-400 group-hover:text-perfios-700 ml-auto flex-shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}

          {/* Expiry */}
          <p className="text-xs text-slate-400 pt-1">
            {t(activeLang, 'expiryLabel')} {group.expiryDate}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Thank-you screen ─────────────────────────────────────────────────────────

function ThankYouScreen({ consentId, activeLang, consents }: {
  consentId: string
  activeLang: string
  consents: ConsentRecord[]
}) {
  // Group data points by dp.label for the summary list
  const grouped: Record<string, string[]> = {}
  consents.forEach(c => {
    c.dataPoints.forEach(dp => {
      if (!grouped[dp.label]) grouped[dp.label] = []
      grouped[dp.label].push(c.purpose)
    })
  })

  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {/* Animated green dot */}
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse-dot" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {t(activeLang, 'thankYouTitle')}
      </h2>
      <p className="text-sm text-slate-600 mb-1">
        Your consent is taken and consent ID is
      </p>
      <p className="text-xs font-mono text-perfios-700 font-semibold break-all mb-6">
        {consentId}
      </p>

      {/* Summary */}
      <div className="w-full text-left space-y-3">
        {Object.entries(grouped).map(([label, purposes]) => (
          <div key={label}>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            {purposes.map(p => (
              <div key={p} className="flex items-center gap-1.5 mt-0.5">
                <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-slate-600">{p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 w-full bg-slate-50 rounded-lg py-3 text-center">
        <p className="text-xs text-slate-500">{t(activeLang, 'redirecting')}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConsenTick() {
  const { state, dispatch, emitEvent, advanceStage } = useDemo()
  const world = state.world!
  const { customer, consents, vendors } = world

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeLang, setActiveLang] = useState('English')
  const [activeTab, setActiveTab] = useState<'essential' | 'optional'>('essential')
  const [expandedPurpose, setExpandedPurpose] = useState<string | null>(null)
  const [optionalToggles, setOptionalToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(consents.filter(c => c.dataPoints.every(dp => !dp.required)).map(c => [c.id, true]))
  )
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ dp: DataPoint; group: PurposeGroup } | null>(null)
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [langSearch, setLangSearch] = useState('')
  const [showExitGuard, setShowExitGuard] = useState(false)
  const [showEssentialDialog, setShowEssentialDialog] = useState(false)
  const [agreedConfirmation, setAgreedConfirmation] = useState(false)
  const [consentGranted, setConsentGranted] = useState(false)

  // ── Derived ────────────────────────────────────────────────────────────────
  const essentialConsents = useMemo(() =>
    consents.filter(c => c.dataPoints.some(dp => dp.required)),
    [consents]
  )
  const optionalConsents = useMemo(() =>
    consents.filter(c => c.dataPoints.every(dp => !dp.required)),
    [consents]
  )
  const essentialGroups = useMemo(() => groupByPurpose(essentialConsents), [essentialConsents])
  const optionalGroups = useMemo(() => groupByPurpose(optionalConsents), [optionalConsents])

  const activeGroups = activeTab === 'essential' ? essentialGroups : optionalGroups

  const filteredLanguages = useMemo(() =>
    ALL_LANGUAGES.filter(l =>
      langSearch === '' || l.name.toLowerCase().includes(langSearch.toLowerCase())
    ),
    [langSearch]
  )

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleAgreeAll() {
    if (!agreedConfirmation) return

    emitEvent({
      type: 'CONSENT_GRANTED',
      actor: 'customer',
      perspective: 'customer-app',
      payload: {
        consentId: customer.consentId,
        customerName: customer.name,
        purposes: consents.map(c => c.purpose),
        timestamp: new Date().toISOString(),
      },
      dpdpSection: '§6',
    })
    setConsentGranted(true)

    // Advance after brief delay for the thank-you screen
    setTimeout(() => {
      dispatch({ type: 'GRANT_CONSENT' })
    }, 2500)
  }

  function handleAgreeEssentials() {
    setShowEssentialDialog(true)
  }

  function confirmEssentialsOnly() {
    setShowEssentialDialog(false)
    emitEvent({
      type: 'CONSENT_GRANTED',
      actor: 'customer',
      perspective: 'customer-app',
      payload: {
        consentId: customer.consentId,
        customerName: customer.name,
        purposes: essentialConsents.map(c => c.purpose),
        essentialOnly: true,
        timestamp: new Date().toISOString(),
      },
      dpdpSection: '§6',
    })
    setConsentGranted(true)
    setTimeout(() => {
      dispatch({ type: 'GRANT_CONSENT' })
    }, 2500)
  }

  function handleCloseAttempt() {
    setShowExitGuard(true)
  }

  function confirmExit() {
    setShowExitGuard(false)
    advanceStage('landing')
  }

  function handleDataPointClick(dp: DataPoint, group: PurposeGroup) {
    setSelectedDataPoint({ dp, group })
  }

  function dismissVendorPanel() {
    setSelectedDataPoint(null)
  }

  // ── Vendor panel for a data point ─────────────────────────────────────────
  function getVendorsForGroup(group: PurposeGroup): Vendor[] {
    return vendors.filter(v => group.vendors.includes(v.id))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    // Full-screen backdrop — clicking it triggers exit guard
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={handleCloseAttempt}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-slide-up flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Thank-you screen (replaces body once granted) */}
        {consentGranted ? (
          <>
            {/* Header bar — still shown */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100 flex-shrink-0">
              <PerfiosWordmark />
              <div className="flex items-center gap-2">
                <button onClick={() => setShowLangPicker(v => !v)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <GlobeIcon />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <ThankYouScreen
                consentId={customer.consentId}
                activeLang={activeLang}
                consents={consents}
              />
            </div>
            <div className="border-t border-slate-100 px-5 py-3 flex-shrink-0 text-center">
              <p className="text-xs text-slate-400">
                {t(activeLang, 'poweredBy')}{' '}
                <span className="font-bold text-perfios-700">Perfios</span>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ── Header bar ─────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
              <PerfiosWordmark />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setShowLangPicker(v => !v); setLangSearch('') }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                  title="Change language"
                >
                  <GlobeIcon />
                </button>
                <button
                  onClick={handleCloseAttempt}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* ── Scrollable body ─────────────────────────────────── */}
            <div className="overflow-y-auto flex-1 scrollbar-hide px-5">

              {/* Welcome heading */}
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                {t(activeLang, 'welcome', { name: customer.name })}
              </h2>

              {/* Privacy paragraphs */}
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                {t(activeLang, 'privacyHeading')}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                {t(activeLang, 'reviewRights')}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t(activeLang, 'purposeAccessHint')}
              </p>

              {/* ── Tabs ─────────────────────────────────────────── */}
              <div className="flex border-b border-slate-200 mb-1">
                {(['essential', 'optional'] as const).map(tab => {
                  const label = tab === 'essential'
                    ? t(activeLang, 'essentialTab')
                    : t(activeLang, 'optionalTab')
                  const active = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 flex-1 py-2.5 text-xs font-semibold transition border-b-2 ${
                        active
                          ? 'border-perfios-700 text-perfios-700'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {active ? (
                        <div className="w-3.5 h-3.5 rounded bg-perfios-700 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded border border-slate-300 flex-shrink-0" />
                      )}
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Tab subtitle */}
              <p className="text-xs text-slate-500 mb-3">
                {activeTab === 'essential'
                  ? t(activeLang, 'essentialSubtitle')
                  : t(activeLang, 'optionalSubtitle')}
              </p>

              {/* ── Purpose accordion list ─────────────────────── */}
              <div className="space-y-2 pb-2">
                {activeGroups.map(group => (
                  <PurposeAccordion
                    key={group.consentId}
                    group={group}
                    isEssential={activeTab === 'essential'}
                    isOptional={activeTab === 'optional'}
                    toggled={optionalToggles[group.consentId] ?? true}
                    onToggle={() =>
                      setOptionalToggles(prev => ({
                        ...prev,
                        [group.consentId]: !prev[group.consentId],
                      }))
                    }
                    expanded={expandedPurpose === group.consentId}
                    onExpand={() =>
                      setExpandedPurpose(prev =>
                        prev === group.consentId ? null : group.consentId
                      )
                    }
                    activeLang={activeLang}
                    vendors={vendors}
                    onDataPointClick={handleDataPointClick}
                  />
                ))}
              </div>

              {/* ── Confirmation checkbox ─────────────────────── */}
              <div className="mt-4 mb-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setAgreedConfirmation(v => !v)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {agreedConfirmation ? <CheckboxChecked /> : <CheckboxUnchecked />}
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">
                    {t(activeLang, 'confirmCheckbox')}
                  </span>
                </label>
              </div>

              {/* ── Footer links ─────────────────────────────── */}
              <div className="text-xs text-slate-500 space-y-1 pb-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    {t(activeLang, 'knowPartners')}{' '}
                    <button className="text-perfios-700 underline font-medium">
                      {t(activeLang, 'clickHere')}
                    </button>
                  </span>
                  <span>
                    {t(activeLang, 'viewRights')}{' '}
                    <button className="text-perfios-700 underline font-medium">
                      {t(activeLang, 'clickHere')}
                    </button>
                  </span>
                </div>
                <p>
                  {t(activeLang, 'contactSupport')}{' '}
                  <a href="mailto:consentick.support@perfios.com" className="text-perfios-700 underline">
                    consentick.support@perfios.com
                  </a>
                </p>
              </div>
            </div>

            {/* ── Sticky footer: buttons + powered-by ─────────── */}
            <div className="flex-shrink-0 border-t border-slate-100 px-5 pt-3 pb-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleAgreeEssentials}
                  className="flex-1 text-xs font-semibold text-perfios-700 border-2 border-perfios-700 rounded-xl py-3 hover:bg-perfios-50 transition"
                >
                  {t(activeLang, 'agreeEssentials')}
                </button>
                <button
                  onClick={handleAgreeAll}
                  disabled={!agreedConfirmation}
                  className={`flex-1 text-xs font-semibold text-white rounded-xl py-3 transition ${
                    agreedConfirmation
                      ? 'bg-perfios-700 hover:bg-perfios-800'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {t(activeLang, 'agreeAll')}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                {t(activeLang, 'poweredBy')}{' '}
                <span className="font-bold text-perfios-700">Perfios</span>
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Vendor side panel ─────────────────────────────────────────────── */}
      {selectedDataPoint && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30"
          onClick={dismissVendorPanel}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl px-5 pt-5 pb-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDataPoint.dp.label}
              </h3>
              <button onClick={dismissVendorPanel} className="text-slate-400 hover:text-slate-600">
                <CloseIcon />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              {t(activeLang, 'vendorListLabel')}
            </p>

            {getVendorsForGroup(selectedDataPoint.group).length > 0 ? (
              <div className="space-y-2">
                {getVendorsForGroup(selectedDataPoint.group).map((v, i) => (
                  <div key={v.id} className="flex items-start gap-2">
                    <span className="text-xs text-slate-500 font-mono w-4 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(97 + i)}.
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">{v.name}</span>
                      <span className="text-xs text-slate-500"> — {v.purpose}</span>
                      {v.crossBorder && (
                        <span className="ml-1 text-xs text-amber-600 bg-amber-50 px-1 rounded font-mono">§16</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No external vendors for this data point.</p>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <p className="text-xs text-slate-400">
                {t(activeLang, 'poweredBy')}{' '}
                <span className="font-bold text-perfios-700">Perfios</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Language picker ───────────────────────────────────────────────── */}
      {showLangPicker && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40"
          onClick={() => setShowLangPicker(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl pt-4 pb-6 animate-slide-up"
            style={{ maxHeight: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t(activeLang, 'selectLanguage')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t(activeLang, 'languageHint')}
                </p>
              </div>
              <button onClick={() => setShowLangPicker(false)} className="text-slate-400 hover:text-slate-600">
                <CloseIcon />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 mb-3">
              <input
                type="text"
                placeholder="Search language..."
                value={langSearch}
                onChange={e => setLangSearch(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-perfios-700/20 focus:border-perfios-700"
              />
            </div>

            {/* Language grid */}
            <div className="overflow-y-auto scrollbar-hide px-5" style={{ maxHeight: '50vh' }}>
              <div className="grid grid-cols-3 gap-2">
                {filteredLanguages.map(lang => {
                  const isActive = activeLang === lang.name
                  const isTranslated = isFullyTranslated(lang.name)
                  return (
                    <button
                      key={lang.name}
                      onClick={() => {
                        setActiveLang(lang.name)
                        setShowLangPicker(false)
                        setLangSearch('')
                      }}
                      className={`relative text-xs py-2 px-2 rounded-lg border transition text-center ${
                        isActive
                          ? 'bg-perfios-700 text-white border-perfios-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-1 right-1 text-[9px]">✓</span>
                      )}
                      <span className="block leading-tight">{lang.name}</span>
                      {!isTranslated && !isActive && (
                        <span className="block text-[9px] text-slate-400 mt-0.5">EN</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Exit guard dialog ─────────────────────────────────────────────── */}
      {showExitGuard && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs animate-fade-in shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {t(activeLang, 'exitDialogTitle')}
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              {t(activeLang, 'exitDialogBody')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitGuard(false)}
                className="flex-1 text-xs font-semibold text-perfios-700 border-2 border-perfios-700 rounded-xl py-2.5 hover:bg-perfios-50 transition"
              >
                {t(activeLang, 'exitCancel')}
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl py-2.5 transition"
              >
                {t(activeLang, 'exitConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Essential-only confirm dialog ─────────────────────────────────── */}
      {showEssentialDialog && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs animate-fade-in shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {t(activeLang, 'essentialDialogTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {t(activeLang, 'essentialDialogBody')}
            </p>
            <p className="text-xs text-slate-700 font-medium mb-5">
              {t(activeLang, 'essentialDialogQuestion')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEssentialDialog(false)}
                className="flex-1 text-xs font-semibold text-perfios-700 border-2 border-perfios-700 rounded-xl py-2.5 hover:bg-perfios-50 transition"
              >
                {t(activeLang, 'no')}
              </button>
              <button
                onClick={confirmEssentialsOnly}
                className="flex-1 text-xs font-semibold text-white bg-perfios-700 hover:bg-perfios-800 rounded-xl py-2.5 transition"
              >
                {t(activeLang, 'yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
