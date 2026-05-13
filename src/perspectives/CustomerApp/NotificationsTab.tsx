import { useDemo } from '../../store/store'

const NOTIF_ICONS: Record<string, string> = {
  expiry_warning: '⏰',
  revocation_approved: '✅',
  deletion_complete: '🗑️',
  breach_alert: '🚨',
  grievance_update: '📋',
  new_purpose: '📬',
}

export default function NotificationsTab() {
  const { state, dispatch } = useDemo()
  const world = state.world!
  const { notifications } = world

  function handleRead() {
    dispatch({ type: 'MARK_NOTIFICATIONS_READ' })
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Notifications</h2>
        {state.unreadNotifications > 0 && (
          <button onClick={handleRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium transition">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...notifications].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${n.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
            >
              <span className="text-xl flex-shrink-0">{NOTIF_ICONS[n.type] ?? '📢'}</span>
              <div className="flex-1">
                <p className={`text-xs leading-relaxed ${n.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleDateString('en-IN')}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {/* §13 grievance quick link */}
      <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold text-gray-900 mb-1">Have a complaint? §13 Grievance</p>
        <p className="text-xs text-gray-500 mb-3">The DPO must resolve your grievance within 48 hours under the DPDP Act.</p>
        <button className="text-xs font-medium text-white px-4 py-2 rounded-lg transition hover:opacity-90 bg-blue-600">
          Raise Grievance →
        </button>
      </div>
    </div>
  )
}
