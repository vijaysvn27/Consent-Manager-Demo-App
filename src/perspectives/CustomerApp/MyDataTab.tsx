import { useState } from 'react'
import { useDemo } from '../../store/store'

export default function MyDataTab() {
  const { state, dispatch, emitEvent } = useDemo()
  const world = state.world!
  const { customer, consents, deletionJobs } = world
  const company = world.company
  const [showDeletionFlow, setShowDeletionFlow] = useState(false)
  const [selectedDataPoints, setSelectedDataPoints] = useState<Set<string>>(new Set())
  const [deletionRequested, setDeletionRequested] = useState(false)

  const allDataPoints = Array.from(new Set(consents.flatMap(c => c.dataPoints.map(dp => dp.label))))

  function handleRequestDeletion() {
    if (selectedDataPoints.size === 0) return
    dispatch({ type: 'FULL_REVOKE' })
    emitEvent({
      type: 'DELETION_REQUESTED',
      actor: 'customer',
      perspective: 'customer-app',
      payload: { customer: customer.name, dataPoints: Array.from(selectedDataPoints), jobCount: 3 },
      dpdpSection: '§12',
    })
    setDeletionRequested(true)
    setShowDeletionFlow(false)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900">My Data</h2>
        <p className="text-xs text-gray-500 mt-0.5">All personal data {company.shortName} holds about you</p>
      </div>

      {/* Data summary card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{customer.name}</p>
            <p className="text-xs text-gray-500">{customer.email} · {customer.phone}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-base font-bold text-gray-900">{allDataPoints.length}</p>
            <p className="text-xs text-gray-400">Data points</p>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">{consents.length}</p>
            <p className="text-xs text-gray-400">Purposes</p>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">{world.vendors.length}</p>
            <p className="text-xs text-gray-400">Partners</p>
          </div>
        </div>
      </div>

      {/* DPDP rights panel */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2">
        <p className="text-xs font-bold text-blue-800">Your Rights Under DPDP Act 2023</p>
        {[
          { section: '§11', right: 'Access — Know what data we hold' },
          { section: '§12', right: 'Correction — Fix inaccurate data' },
          { section: '§12(3)', right: 'Erasure — Request data deletion' },
          { section: '§13', right: 'Grievance — File a complaint (48hr SLA)' },
          { section: '§14', right: 'Nominee — Assign rights to someone else' },
        ].map(r => (
          <div key={r.section} className="flex items-center gap-2">
            <span className="font-mono text-xs text-blue-600 flex-shrink-0">{r.section}</span>
            <p className="text-xs text-blue-700">{r.right}</p>
          </div>
        ))}
      </div>

      {/* Deletion jobs status (if any running) */}
      {deletionJobs.some(j => j.status !== 'QUEUED') && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-800 mb-3">Data Deletion Status</p>
          <div className="space-y-2">
            {deletionJobs.map(job => (
              <div key={job.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  job.status === 'COMPLETE' ? 'bg-green-500' :
                  job.status === 'FAILED' ? 'bg-red-500' :
                  job.status === 'IN_PROGRESS' ? 'bg-amber-400 animate-pulse-dot' : 'bg-gray-300'
                }`} />
                <p className="text-xs text-gray-600 flex-1">{job.systemName}</p>
                <span className="text-xs font-medium text-gray-500">{job.status}</span>
              </div>
            ))}
          </div>
          {deletionJobs.every(j => j.status === 'COMPLETE') && (
            <p className="mt-2 text-xs text-green-700 font-medium">✓ All data successfully deleted</p>
          )}
          {deletionJobs.some(j => j.status === 'FAILED') && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
              ⚠️ Deletion failure detected. A breach notification has been sent to the Data Protection Board. <span className="font-mono">§8(5)</span>
            </div>
          )}
        </div>
      )}

      {/* Request deletion CTA */}
      {!deletionRequested && (
        <button
          onClick={() => setShowDeletionFlow(true)}
          className="w-full border border-red-200 text-red-600 hover:bg-red-50 bg-white rounded-xl py-3 text-sm font-semibold transition"
        >
          Request Data Deletion — §12(3)
        </button>
      )}

      {/* Deletion flow modal */}
      {showDeletionFlow && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-sm animate-slide-up max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Request Data Deletion</h3>
            <p className="text-xs text-gray-500 mb-4">Select data points to delete. This will trigger deletion jobs across all systems. <span className="font-mono text-blue-600">§12(3)</span></p>
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  if (selectedDataPoints.size === allDataPoints.length) setSelectedDataPoints(new Set())
                  else setSelectedDataPoints(new Set(allDataPoints))
                }}
                className="w-full text-left text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                {selectedDataPoints.size === allDataPoints.length ? 'Deselect all' : 'Select all data points'}
              </button>
              {allDataPoints.map(dp => (
                <label key={dp} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={selectedDataPoints.has(dp)}
                    onChange={() => {
                      const s = new Set(selectedDataPoints)
                      s.has(dp) ? s.delete(dp) : s.add(dp)
                      setSelectedDataPoints(s)
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs text-gray-700">{dp}</span>
                </label>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4 text-xs text-amber-800">
              3 deletion jobs will be created: DB1, marketing-service-2, app-layer-3. The DPO will track completion.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowDeletionFlow(false)} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button
                onClick={handleRequestDeletion}
                disabled={selectedDataPoints.size === 0}
                className="flex-1 bg-red-500 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-semibold transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
