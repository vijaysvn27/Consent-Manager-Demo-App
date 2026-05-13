import { useState } from 'react'
import { useDemo } from '../store/store'
import { generateDemoWorld } from '../generator'
import type { Industry, JourneyType } from '../store/types'

const INDUSTRIES: { value: Industry; label: string; icon: string; description: string }[] = [
  { value: 'telecom', label: 'Telecom', icon: '📡', description: 'Vodafone, Airtel, Jio' },
  { value: 'banking', label: 'Banking', icon: '🏦', description: 'HDFC, SBI, ICICI, Axis' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️', description: 'HDFC Life, LIC, Star Health' },
  { value: 'microfinance', label: 'Microfinance', icon: '🌾', description: 'Spandana, Ujjivan, Arohan' },
  { value: 'hr', label: 'HR / Corporate', icon: '🏢', description: 'GMR, TCS, Infosys, Wipro' },
]

const JOURNEY_TYPES: { value: JourneyType; label: string; description: string }[] = [
  { value: 'self', label: 'Self', description: 'Customer completes consent independently' },
  { value: 'assisted', label: 'Assisted', description: 'AM guides the customer through consent' },
  { value: 'guardian-minor', label: 'Guardian (Minor)', description: 'Guardian consent required — §9 DPDP Act' },
  { value: 'guardian-disabled', label: 'Guardian (Disabled)', description: 'Consent through authorised guardian' },
  { value: 'assisted-senior', label: 'Assisted (Senior Citizen)', description: 'AM assists senior citizen through consent' },
]

export default function AMSetup() {
  const { dispatch, advanceStage } = useDemo()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState<Industry>('telecom')
  const [journeyType, setJourneyType] = useState<JourneyType>('self')
  const [generating, setGenerating] = useState(false)

  function handleStart() {
    if (!companyName.trim()) return
    setGenerating(true)
    setTimeout(() => {
      const world = generateDemoWorld(companyName.trim(), industry, journeyType)
      dispatch({ type: 'SET_AM_INPUT', payload: { companyName: companyName.trim(), industry, journeyType } })
      dispatch({ type: 'SET_WORLD', payload: world })
      advanceStage('landing')
      setGenerating(false)
    }, 800)
  }

  const selectedJourney = JOURNEY_TYPES.find(j => j.value === journeyType)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Perfios wordmark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-blue-700">Perfios</span>
            <span className="text-slate-300 text-xl">|</span>
            <span className="text-sm text-slate-500 font-medium tracking-wide">Demo Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Configure Your Demo</h1>
          <p className="text-slate-500 text-sm">Enter client details to generate a live, fully-functional consent demo</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
          {/* Company name */}
          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Client Company Name <span className="text-red-500">*</span>
            </label>
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Vodafone India"
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">Industry</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.value}
                  onClick={() => setIndustry(ind.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all text-xs ${
                    industry === ind.value
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{ind.icon}</span>
                  <span className="font-medium">{ind.label}</span>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-2">{INDUSTRIES.find(i => i.value === industry)?.description}</p>
          </div>

          {/* Journey Type */}
          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Journey Type
            </label>
            <select
              value={journeyType}
              onChange={e => setJourneyType(e.target.value as JourneyType)}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none cursor-pointer"
            >
              {JOURNEY_TYPES.map(jt => (
                <option key={jt.value} value={jt.value}>{jt.label}</option>
              ))}
            </select>
            {selectedJourney && (
              <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                {(journeyType === 'guardian-minor' || journeyType === 'guardian-disabled') && (
                  <span className="inline-flex items-center bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full mr-1">§9</span>
                )}
                {selectedJourney.description}
              </p>
            )}
          </div>

          {/* Launch */}
          <button
            onClick={handleStart}
            disabled={!companyName.trim() || generating}
            className="w-full font-semibold rounded-xl py-4 transition-all flex items-center justify-center gap-2 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--perfios-blue, #1e4d8c)' }}
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating demo world…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
                Launch Demo
              </>
            )}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 text-xs mt-6">
          All data is generated deterministically — same inputs produce the same demo every time
        </p>
      </div>
    </div>
  )
}
