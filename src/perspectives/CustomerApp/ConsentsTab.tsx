import { useState } from 'react'
import { useDemo } from '../../store/store'
import type { ConsentRecord, ConsentStatus } from '../../store/types'

function StatusChip({ status }: { status: ConsentStatus }) {
  const styles: Record<ConsentStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    REVOKED: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-gray-100 text-gray-500',
    MODIFICATION_REQUESTED: 'bg-blue-100 text-blue-700',
  }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>
}

function ConsentDetail({ consent, onBack }: { consent: ConsentRecord; onBack: () => void }) {
  const { state, dispatch, emitEvent } = useDemo()
  const world = state.world!
  const { company, customer } = world
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  function handleRevoke() {
    dispatch({ type: 'PARTIAL_REVOKE', payload: { consentId: consent.id, purposes: [consent.purpose] } })
    emitEvent({
      type: 'CONSENT_PARTIAL_REVOKE',
      actor: 'customer',
      perspective: 'customer-app',
      payload: { consentId: consent.id, purpose: consent.purpose, customer: customer.name },
      dpdpSection: '§12',
    })
    setShowRevokeConfirm(false)
    onBack()
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900">{consent.purpose}</h2>
          <p className="text-xs text-gray-500">{consent.requestId}</p>
        </div>
        <StatusChip status={consent.status} />
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Expiry + legal basis */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-800">Your consent expires as of {consent.expiryDate}</p>
          <p className="text-xs text-amber-600 mt-0.5">
            {consent.expiryDaysRemaining <= 7 ? '⚠️ Expiring soon — ' : ''}
            Legal basis: <span className="font-mono">{consent.legalBasis}</span>
          </p>
        </div>

        {/* Data points */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data Points Shared</p>
          <div className="flex flex-wrap gap-2">
            {consent.dataPoints.map(dp => (
              <span key={dp.id} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                dp.sensitivity === 'critical' ? 'bg-red-50 border-red-200 text-red-700' :
                dp.sensitivity === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                {dp.label}
              </span>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Activity</p>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-3">
              {consent.activityTimeline.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 pl-1">
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'granted' ? 'bg-green-100' :
                    entry.type === 'revoked' ? 'bg-red-100' :
                    entry.type === 'requested' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      entry.type === 'granted' ? 'bg-green-500' :
                      entry.type === 'revoked' ? 'bg-red-500' :
                      entry.type === 'requested' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{entry.event}</p>
                    <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleDateString('en-IN')} · {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DPDP section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-xs font-bold text-blue-800 mb-1">{consent.legalBasis} — Your Rights</p>
          <p className="text-xs text-blue-700">You can withdraw this consent at any time under §12 of the DPDP Act 2023. Withdrawal does not affect processing done before the withdrawal.</p>
        </div>

        {/* Actions */}
        {consent.status === 'ACTIVE' && (
          <div className="space-y-2">
            <button
              onClick={() => setShowRevokeConfirm(true)}
              className="w-full border border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-3 text-sm font-semibold transition"
            >
              Revoke This Consent — §12
            </button>
          </div>
        )}
      </div>

      {/* Revoke confirm */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-sm animate-slide-up">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Revoke consent?</h3>
            <p className="text-xs text-gray-600 mb-4">
              You are revoking <strong>{consent.purpose}</strong>. This will be broadcast to all connected systems.{' '}
              <span className="font-mono text-blue-600">§12 DPDP Act</span>
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-4 text-xs text-red-700">
              Penalty for non-compliance by the Data Fiduciary: <strong>₹200 Crore</strong>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowRevokeConfirm(false)} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleRevoke} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-semibold transition">Revoke</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ConsentsTab() {
  const { state } = useDemo()
  const world = state.world!
  const { consents } = world
  const [selected, setSelected] = useState<ConsentRecord | null>(null)
  const [filter, setFilter] = useState<ConsentStatus | 'ALL'>('ALL')

  if (selected) return <ConsentDetail consent={selected} onBack={() => setSelected(null)} />

  const filtered = filter === 'ALL' ? consents : consents.filter(c => c.status === filter)

  return (
    <div className="px-4 py-4">
      <h2 className="text-base font-bold text-gray-900 mb-3">Your Consents</h2>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {(['ALL', 'ACTIVE', 'PENDING', 'REVOKED', 'EXPIRED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
              filter === f
                ? 'text-white border-transparent bg-[var(--perfios-blue)]'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'ALL' ? `All (${consents.length})` : `${f.replace('_', ' ')} (${consents.filter(c => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Consent cards */}
      <div className="space-y-2">
        {filtered.map(c => (
          <button key={c.id} onClick={() => setSelected(c)} className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{c.purpose}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.requestId}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  c.status === 'REVOKED' ? 'bg-red-100 text-red-700' :
                  c.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{c.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Expires {c.expiryDate}</p>
              {c.expiryDaysRemaining <= 7 && c.status === 'ACTIVE' && (
                <span className="text-xs text-amber-600 font-medium">⚠️ Expiring soon</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
