import { useDemo } from '../../store/store'
import type { ConsentStatus } from '../../store/types'

type Tab = 'home' | 'consents' | 'data' | 'notifications' | 'profile'

function StatusChip({ status }: { status: ConsentStatus }) {
  const styles: Record<ConsentStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    REVOKED: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-gray-100 text-gray-500',
    MODIFICATION_REQUESTED: 'bg-blue-100 text-blue-700',
  }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>
}

export default function HomeTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { state } = useDemo()
  const world = state.world!
  const { customer, consents, notifications } = world
  const activeCount = consents.filter(c => c.status === 'ACTIVE').length
  const expiringCount = consents.filter(c => c.expiryDaysRemaining <= 7 && c.status === 'ACTIVE').length
  const unreadNotifs = notifications.filter(n => !n.read)

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Welcome card — Perfios blue, no brand color gradient */}
      <div className="rounded-2xl text-white p-4 relative overflow-hidden bg-[var(--perfios-blue)]">
        <div className="absolute right-0 top-0 w-24 h-24 rounded-full opacity-10 bg-white -translate-y-4 translate-x-4" />
        <p className="text-white/80 text-xs font-medium mb-0.5">Welcome back</p>
        <h2 className="text-lg font-bold">{customer.name}</h2>
        <p className="text-white/70 text-xs mt-0.5">{customer.phone || 'Verified'}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white font-bold text-lg leading-none">{activeCount}</p>
            <p className="text-white/70 text-xs">Active</p>
          </div>
          {expiringCount > 0 && (
            <div className="bg-amber-400/30 rounded-lg px-3 py-1.5 text-center">
              <p className="text-white font-bold text-lg leading-none">{expiringCount}</p>
              <p className="text-white/70 text-xs">Expiring</p>
            </div>
          )}
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white font-bold text-xs font-mono leading-none mt-0.5 truncate max-w-24">{customer.consentId.slice(0, 12)}…</p>
            <p className="text-white/70 text-xs">Consent ID</p>
          </div>
        </div>
      </div>

      {/* Notifications banner */}
      {unreadNotifs.length > 0 && (
        <button
          onClick={() => onNavigate('notifications')}
          className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3 text-left hover:bg-amber-100 transition"
        >
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">{unreadNotifs[0].message}</p>
            <p className="text-xs text-amber-600 mt-0.5">Tap to view all alerts →</p>
          </div>
        </button>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'View Consents', icon: '✓', sub: `${activeCount} active`, tab: 'consents' as Tab },
            { label: 'My Data', icon: '🗄', sub: 'View & request deletion', tab: 'data' as Tab },
            { label: 'Raise Grievance', icon: '📝', sub: '48hr SLA · §13', tab: 'profile' as Tab },
            { label: 'Add Nominee', icon: '👤', sub: 'Rights under §14', tab: 'profile' as Tab },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:shadow-sm transition-shadow"
            >
              <span className="text-lg mb-1 block">{action.icon}</span>
              <p className="text-xs font-semibold text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{action.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent consents preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Consents</p>
          <button onClick={() => onNavigate('consents')} className="text-xs font-medium text-blue-700">View all</button>
        </div>
        <div className="space-y-2">
          {consents.slice(0, 3).map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-900">{c.purpose}</p>
                <p className="text-xs text-gray-400 mt-0.5">Expires {c.expiryDate}</p>
              </div>
              <StatusChip status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
