import { useState } from 'react'
import { useDemo } from '../../store/store'
import type { ConsentStatus } from '../../store/types'

function StatusChip({ status }: { status: ConsentStatus }) {
  const styles: Record<ConsentStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    REVOKED: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-gray-100 text-gray-500',
    MODIFICATION_REQUESTED: 'bg-blue-100 text-blue-700',
  }
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>
}

export default function CustomerPortal() {
  const { state, dispatch, emitEvent } = useDemo()
  const world = state.world!
  const { company, customer, consents, notifications } = world
  const [activeSection, setActiveSection] = useState<'overview' | 'consents' | 'delete' | 'notifications'>('overview')
  const [selectedConsent, setSelectedConsent] = useState<string | null>(null)

  const activeCount = consents.filter(c => c.status === 'ACTIVE').length
  const revokedCount = consents.filter(c => c.status === 'REVOKED').length
  const expiringCount = consents.filter(c => c.expiryDaysRemaining <= 7 && c.status === 'ACTIVE').length
  const unread = notifications.filter(n => !n.read)

  return (
    <div className="h-full flex flex-col bg-gray-50 text-sm">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-slate-700">
            {company.logoInitials.charAt(0)}
          </div>
          <span className="font-semibold text-gray-900">{company.name} — Privacy Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('notifications')} className="relative p-1.5 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread.length}</span>}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs bg-[var(--perfios-blue)]">
              {customer.name.charAt(0)}
            </div>
            <span className="font-medium">{customer.name}</span>
          </div>
        </div>
      </div>

      {/* Sub nav */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-6">
        {([['overview', 'Overview'], ['consents', 'Your Consents'], ['delete', 'Request Deletion'], ['notifications', 'Notifications']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className={`py-3 text-sm font-medium border-b-2 transition ${activeSection === id ? 'border-[var(--perfios-blue)] text-[var(--perfios-blue)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome, {customer.name}</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your data consent across all {company.shortName} services</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Consents', value: activeCount, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Revoked', value: revokedCount, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Expiring Soon', value: expiringCount, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Total', value: consents.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map(kpi => (
                <div key={kpi.label} className={`${kpi.bg} rounded-xl p-4 border border-gray-100`}>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Consent distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Consent Distribution</h3>
              <div className="space-y-2">
                {consents.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{c.purpose}</span>
                        <StatusChip status={c.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'consents' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Your Consents</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {consents.map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{c.purpose}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.requestId}</p>
                    </div>
                    <StatusChip status={c.status} />
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-amber-600">Expires: {c.expiryDate}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.dataPoints.length} data points · {c.vendors.length} vendors</p>
                  </div>
                  {/* Activity Timeline */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Activity</p>
                    <div className="space-y-1.5">
                      {c.activityTimeline.slice(-3).map((entry, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.type === 'granted' ? 'bg-green-500' : entry.type === 'revoked' ? 'bg-red-500' : 'bg-amber-400'}`} />
                          <p className="text-xs text-gray-500">{entry.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {c.status === 'ACTIVE' && (
                    <button
                      onClick={() => {
                        dispatch({ type: 'PARTIAL_REVOKE', payload: { consentId: c.id, purposes: [c.purpose] } })
                        emitEvent({ type: 'CONSENT_PARTIAL_REVOKE', actor: 'customer', perspective: 'customer-portal', payload: { consentId: c.id, purpose: c.purpose, customer: customer.name }, dpdpSection: '§12' })
                      }}
                      className="mt-3 w-full border border-red-200 text-red-600 hover:bg-red-50 rounded-lg py-2 text-xs font-semibold transition"
                    >
                      Revoke Consent — §12
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'delete' && (
          <div className="max-w-lg space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Request Data Deletion</h2>
            <p className="text-sm text-gray-500">Under §12(3) of the DPDP Act, you have the right to request erasure of your personal data.</p>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              {consents.flatMap(c => c.dataPoints).filter((dp, i, arr) => arr.findIndex(d => d.label === dp.label) === i).map(dp => (
                <label key={dp.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <div>
                    <p className="text-sm text-gray-800">{dp.label}</p>
                    <p className="text-xs text-gray-400">{dp.category} · {dp.sensitivity}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              3 deletion jobs will be created. The DPO will track and confirm completion. Failure to delete = breach notification under §8(5) — penalty ₹250 Crore.
            </div>
            <button
              onClick={() => {
                const dataPoints = consents
                  .flatMap(c => c.dataPoints.map(dp => dp.label))
                  .filter((label, i, arr) => arr.indexOf(label) === i)
                dispatch({ type: 'FULL_REVOKE' })
                dispatch({
                  type: 'QUEUE_DELETION_FROM_CUSTOMER',
                  payload: {
                    customerName: customer.name,
                    phone: customer.phone || '',
                    dataPoints,
                  },
                })
                emitEvent({
                  type: 'DELETION_REQUESTED',
                  actor: 'customer',
                  perspective: 'customer-portal',
                  payload: { customer: customer.name, jobCount: 3, dataPoints },
                  dpdpSection: '§12',
                })
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-semibold transition"
            >
              Submit Deletion Request
            </button>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            {notifications.map(n => (
              <div key={n.id} className={`bg-white rounded-xl border p-4 flex gap-3 ${n.read ? 'border-gray-200' : 'border-blue-200'}`}>
                <span className="text-lg">{n.type === 'expiry_warning' ? '⏰' : n.type === 'revocation_approved' ? '✅' : n.type === 'breach_alert' ? '🚨' : '📬'}</span>
                <div>
                  <p className={`text-sm ${n.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
