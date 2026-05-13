import { useDemo } from '../../store/store'

// ─── Consent Authorisation ────────────────────────────────────────────────────
//
// Cross-perspective wire (P0-6 #4):
//   Customer Portal dispatches:
//     dispatch({ type: 'QUEUE_DELETION_FROM_CUSTOMER', payload: { customerName, phone, dataPoints } })
//   This component reads state.pendingDeletions[] and shows them in the Data Deletion sub-tab.

export default function ConsentAuthorisation() {
  const { state, dispatch, emitEvent, updateJobStatus } = useDemo()
  const world = state.world!
  const { customer, consents, deletionJobs, company } = world
  const { activeCtTab, pendingDeletions } = state

  const revokedConsents = consents.filter(c => c.status === 'REVOKED')
  const pendingConsents = consents.filter(c => c.status === 'PENDING')

  function handleApprovePartial(consentId: string, requestId: string) {
    dispatch({ type: 'DPO_APPROVE', payload: { reqId: requestId } })
    // Fan-out to all connected downstream systems
    company.systems.forEach((sys, i) => {
      setTimeout(() => {
        emitEvent({
          type: 'FANOUT_DISPATCHED',
          actor: 'system',
          perspective: 'ct-manager',
          payload: {
            system: sys.name,
            endpoint: sys.endpoint,
            method: 'POST',
            body: { consent: 'NO', purpose: 'marketing', customer: customer.name, consentId },
            statusCode: 200,
          },
          dpdpSection: '§12',
        })
      }, i * 400)
    })
    emitEvent({
      type: 'DPO_APPROVED',
      actor: 'dpo',
      perspective: 'ct-manager',
      payload: { requestId, customer: customer.name, action: 'partial_revocation' },
      dpdpSection: '§12',
    })
  }

  function handleStartDeletionJobs() {
    deletionJobs.forEach((job, i) => {
      setTimeout(() => {
        updateJobStatus(job.id, 'IN_PROGRESS')
        emitEvent({
          type: 'DELETION_JOB_STARTED',
          actor: 'system',
          perspective: 'ct-manager',
          payload: { jobId: job.id, system: job.systemName },
          dpdpSection: '§8',
        })
        setTimeout(() => {
          // Last job always fails to trigger the breach scenario (deterministic demo)
          const shouldFail = i === deletionJobs.length - 1
          updateJobStatus(
            job.id,
            shouldFail ? 'FAILED' : 'COMPLETE',
            shouldFail ? 'Timeout — record locked by active session' : undefined
          )
          emitEvent({
            type: shouldFail ? 'DELETION_JOB_FAILED' : 'DELETION_JOB_COMPLETE',
            actor: 'system',
            perspective: 'ct-manager',
            payload: { jobId: job.id, system: job.systemName, status: shouldFail ? 'FAILED' : 'COMPLETE' },
            dpdpSection: shouldFail ? '§8' : '§12',
          })
        }, 1500)
      }, i * 800)
    })
  }

  return (
    <div className="p-6 space-y-4">
      {/* Page header */}
      <div>
        <h2 className="text-base font-bold text-slate-900">Consent Authorisation</h2>
        <p className="text-xs text-slate-400 mt-0.5">Review and manage consent revocation requests from users</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-3">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Status</label>
          <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[120px]">
            <option>Show All</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Product</label>
          <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[120px]">
            <option>Show All</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">&nbsp;</label>
          <div className="relative">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input placeholder="Consent ID / Name" className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700" />
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-slate-200">
        {([
          ['partial', 'Partial Revocation'],
          ['full', 'Full Revocation'],
          ['deletion', 'Data Deletion'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_CT_TAB', payload: id })}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              activeCtTab === id
                ? 'border-perfios-700 text-perfios-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Partial Revocation ── */}
      {activeCtTab === 'partial' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Revocation Requests</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Date Range:</span>
              {['Today', 'Last Week', 'Last Month', 'Last 3 Months'].map(r => (
                <button key={r} className={`px-2 py-1 rounded border text-xs ${r === 'Last Month' ? 'bg-perfios-50 border-perfios-700 text-perfios-700' : 'border-slate-200 hover:bg-slate-50'}`}>{r}</button>
              ))}
              <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Custom Range</button>
            </div>
          </div>

          {revokedConsents.length === 0 && pendingConsents.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-400">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm">No pending revocation requests</p>
            </div>
          ) : (
            [...revokedConsents, ...pendingConsents].map(c => (
              <div key={c.id} className="bg-white rounded-lg border border-slate-200 p-4">
                {/* Request header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">REQ-{c.requestId.slice(-6)}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded">Pending</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Action:</span>
                    <button className="text-xs bg-red-500 text-white rounded px-2.5 py-1 font-medium hover:bg-red-600">Reject</button>
                    <span className="text-slate-300">|</span>
                    <button className="text-xs text-slate-500 hover:text-slate-700">Send Revocation</button>
                    <button className="text-slate-400">⋮</button>
                  </div>
                </div>

                {/* User row */}
                <p className="text-xs text-slate-500 mb-2">User: <span className="text-slate-800 font-medium">{customer.name}</span></p>

                {/* Detail card */}
                <div className="border border-slate-100 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Consent ID</p>
                      <p className="font-mono text-slate-700 text-[11px]">{c.requestId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Product</p>
                      <p className="text-slate-700">Users (KYC)</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Created on</p>
                      <p className="text-slate-700">{c.grantedAt?.slice(0, 10) ?? '—'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Mobile Number</p>
                      <p className="text-slate-700">{customer.phone || '98XXXXXXXX'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Expiry on</p>
                      <p className="text-slate-700">{c.expiryDate}</p>
                    </div>
                  </div>
                  {/* Data point revoked */}
                  <div className="text-xs">
                    <p className="text-slate-500 mb-1">Marketing and Advertisements</p>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span>Data Revoked:</span>
                      <span className="text-slate-600 font-medium">{c.dataPoints?.[0]?.label ?? 'Mobile Number'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                    Please review the consent request carefully. This action will affect all connected systems and admin actions.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApprovePartial(c.id, c.requestId)}
                      className="bg-perfios-700 text-white text-xs font-semibold rounded px-4 py-1.5 hover:bg-perfios-700/90"
                    >
                      Send for Approval →
                    </button>
                  </div>
                </div>

                {/* Fan-out preview */}
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">System fan-out preview ({company.systems.length} systems)</summary>
                  <div className="mt-2 space-y-1 pl-2">
                    {company.systems.map(sys => (
                      <div key={sys.id} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                        <span className="font-mono">POST {sys.endpoint}</span>
                        <span className="text-slate-400">→ {sys.name}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Full Revocation ── */}
      {activeCtTab === 'full' && (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-800">
            <p className="font-semibold mb-0.5">§12 — Full Consent Withdrawal</p>
            <p>All consents revoked. Broadcast to ALL connected systems. Triggers automatic data deletion workflow.</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900 mb-1">{customer.name} — Full Revocation</p>
            <p className="text-xs text-slate-500 mb-3">All {consents.length} consent purposes will be revoked simultaneously</p>
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Systems that will receive revocation signal:</p>
              <div className="space-y-1.5">
                {company.systems.map(sys => (
                  <div key={sys.id} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="font-mono">POST {sys.endpoint}</span>
                    <span className="text-slate-400">→ {sys.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'FULL_REVOKE' })
                emitEvent({
                  type: 'CONSENT_FULL_REVOKE',
                  actor: 'dpo',
                  perspective: 'ct-manager',
                  payload: { customer: customer.name, purposes: consents.map(c => c.purpose) },
                  dpdpSection: '§12',
                })
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 text-sm font-semibold transition"
            >
              Execute Full Revocation
            </button>
          </div>
        </div>
      )}

      {/* ── Data Deletion ── */}
      {activeCtTab === 'deletion' && (
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800">
            <p className="font-semibold mb-0.5">§12(3) + §8 — Data Deletion Jobs</p>
            <p>3 deletion jobs across all system layers. Aurva audits completion. Failure = breach notification under §8(5) — ₹250 Crore penalty.</p>
          </div>

          {/* Pending deletions from Customer Portal (cross-perspective wire) */}
          {pendingDeletions.length > 0 && (
            <div className="bg-white rounded-lg border border-amber-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                📥 Incoming Deletion Requests from Customer Portal ({pendingDeletions.length})
              </p>
              <p className="text-xs text-slate-500">
                These requests were submitted by customers via the self-service portal. Review and approve to trigger deletion jobs.
              </p>
              {pendingDeletions.map(entry => (
                <div key={entry.id} className="border border-slate-100 rounded-lg p-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{entry.customerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{entry.phone} · Requested: {new Date(entry.requestedAt).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Data points: {entry.dataPoints.join(', ')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
                    entry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    entry.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Job execution panel */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-0.5">{deletionJobs[0]?.requestId ?? 'DEL-REQ-pending'}</p>
              <p className="text-xs text-slate-500">Deletion request for {customer.name}</p>
            </div>

            {/* 3 Job cards */}
            <div className="space-y-3">
              {deletionJobs.map(job => (
                <div key={job.id} className="border border-slate-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-800">{job.systemName}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      job.status === 'COMPLETE'     ? 'bg-green-100 text-green-700' :
                      job.status === 'FAILED'       ? 'bg-red-100 text-red-700' :
                      job.status === 'IN_PROGRESS'  ? 'bg-amber-100 text-amber-700' :
                                                      'bg-slate-100 text-slate-500'
                    }`}>
                      {job.status === 'IN_PROGRESS' ? '⏳ Running…' : job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 capitalize">Layer: {job.layer}</p>
                  {job.failureReason && (
                    <p className="text-xs text-red-600 mt-1">⚠ {job.failureReason}</p>
                  )}
                  {job.status === 'COMPLETE' && (
                    <button className="mt-1 text-xs text-perfios-700 hover:underline font-medium">DB Status →</button>
                  )}
                </div>
              ))}
            </div>

            {deletionJobs.every(j => j.status === 'QUEUED') && (
              <button
                onClick={handleStartDeletionJobs}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold transition"
              >
                Execute Deletion Jobs
              </button>
            )}

            {deletionJobs.some(j => j.status === 'FAILED') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-bold text-red-800">🚨 Breach Detected — §8(5)</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Data deletion job failed. Aurva has flagged this as a compliance breach. 72-hour DPB notification clock started. Penalty: ₹250 Crore.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
