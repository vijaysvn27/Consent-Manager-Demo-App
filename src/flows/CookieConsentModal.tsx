import { useState } from 'react'

// 22 Indian scheduled languages per DPDP §6(7) Eighth Schedule
const LANGUAGES = [
  'English', 'हिन्दी', 'বাংলা', 'తెలుగు', 'தமிழ்', 'मराठी',
  'ಕನ್ನಡ', 'ગુજરાતી', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'اردو',
  'অসমীয়া', 'मैथिली', 'डोगरी', 'कोंकणी', 'سنڌي', 'ᱥᱟᱱᱛᱟᱲᱤ',
  'कॉशुर', 'नेपाली', 'ꯃꯩꯇꯩ ꯂꯣꯟ', 'संस्कृतम्',
]

interface CookieCategory {
  id: string
  label: string
  count: number
  alwaysActive?: boolean
  enabled: boolean
  subItems?: { name: string }[]
}

const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    id: 'essentials',
    label: 'Essentials',
    count: 2,
    alwaysActive: true,
    enabled: true,
    subItems: [{ name: 'Cloudflare' }, { name: 'Calendly' }],
  },
  {
    id: 'functional',
    label: 'Functional',
    count: 1,
    alwaysActive: false,
    enabled: false,
  },
  {
    id: 'analytical',
    label: 'Analytical',
    count: 1,
    alwaysActive: false,
    enabled: false,
  },
  {
    id: 'performance',
    label: 'Performance',
    count: 1,
    alwaysActive: false,
    enabled: false,
  },
]

interface Props {
  onAccept: (type: 'allow-all' | 'deny-all' | 'save-settings', categories: Record<string, boolean>) => void
}

export default function CookieConsentModal({ onAccept }: Props) {
  const [categories, setCategories] = useState<CookieCategory[]>(DEFAULT_CATEGORIES)
  const [expanded, setExpanded] = useState<string | null>('essentials')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [activeLang, setActiveLang] = useState('English')

  function toggleCategory(id: string) {
    setCategories(prev =>
      prev.map(c => (c.id === id && !c.alwaysActive ? { ...c, enabled: !c.enabled } : c))
    )
  }

  function toggleExpand(id: string) {
    setExpanded(prev => (prev === id ? null : id))
  }

  function getCategoryState(): Record<string, boolean> {
    return Object.fromEntries(categories.map(c => [c.id, c.enabled]))
  }

  function handleAllowAll() {
    const allEnabled = Object.fromEntries(categories.map(c => [c.id, true]))
    onAccept('allow-all', allEnabled)
  }

  function handleDenyAll() {
    const essentialOnly = Object.fromEntries(categories.map(c => [c.id, !!c.alwaysActive]))
    onAccept('deny-all', essentialOnly)
  }

  function handleSave() {
    onAccept('save-settings', getCategoryState())
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-0 flex items-start justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
          <div className="relative">
            <button
              onClick={() => setShowLangPicker(v => !v)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <span>{activeLang}</span>
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </button>
            {showLangPicker && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setActiveLang(lang); setShowLangPicker(false) }}
                      className={`text-xs px-2 py-1.5 rounded-lg text-left transition ${
                        lang === activeLang
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lang === activeLang ? `✓ ${lang}` : lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings tab */}
        <div className="px-8 mt-4 flex-shrink-0">
          <div className="border-b border-gray-200">
            <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 mr-6">
              Settings
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="px-8 py-5 overflow-y-auto flex-1">
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Cookies used on the site are categorized and below you can read about each category and allow or deny
            some or all of them. When categories than have been previously allowed are disabled, all cookies assigned
            to that category will be removed from your browser. Additionally you can see a list of cookies assigned
            to each category and detailed information in the cookie declaration.
          </p>

          {/* Categories */}
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Category header row */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition"
                    aria-label={expanded === cat.id ? 'Collapse' : 'Expand'}
                  >
                    {expanded === cat.id ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm font-semibold text-gray-800 flex-1">
                    {cat.label} ({cat.count})
                  </span>
                  {cat.alwaysActive ? (
                    <span className="text-xs font-medium bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                      Always Active
                    </span>
                  ) : (
                    <button
                      role="switch"
                      aria-checked={cat.enabled}
                      onClick={() => toggleCategory(cat.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        cat.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          cat.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Expanded sub-items (for essentials) */}
                {expanded === cat.id && cat.subItems && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {cat.subItems.map(item => (
                      <div key={item.name} className="mx-4 my-2 bg-slate-50 rounded-lg flex items-center justify-between px-4 py-3">
                        {/* Sub-item toggle (visual only, non-interactive for essentials) */}
                        <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-not-allowed">
                          <div className="h-5 w-9 rounded-full bg-gray-200" />
                          <span className="absolute top-0.5 left-0.5 inline-block h-4 w-4 rounded-full bg-white shadow" />
                        </div>
                        <span className="flex-1 ml-3 text-sm text-gray-700">{item.name}</span>
                        <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition">
                          Show Cookies (1)
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 pt-3 flex-shrink-0 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-semibold border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Save Settings
            </button>
            <div className="flex-1" />
            <button
              onClick={handleDenyAll}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Deny All
            </button>
            <button
              onClick={handleAllowAll}
              className="px-5 py-2.5 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Allow All Cookies
            </button>
          </div>
          <p className="text-right text-xs text-gray-400 mt-3">
            Powered by Consentick | Perfios
          </p>
        </div>
      </div>
    </div>
  )
}
