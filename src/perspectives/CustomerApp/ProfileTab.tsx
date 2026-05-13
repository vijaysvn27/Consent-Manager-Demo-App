import { useState } from 'react'
import { useDemo } from '../../store/store'

export default function ProfileTab() {
  const { state, dispatch, emitEvent } = useDemo()
  const world = state.world!
  const { customer } = world
  const [showNomineeForm, setShowNomineeForm] = useState(false)
  const [showGrievanceForm, setShowGrievanceForm] = useState(false)
  const [nomineeName, setNomineeName] = useState('')
  const [nomineePhone, setNomineePhone] = useState('')
  const [nomineeRelation, setNomineeRelation] = useState('Spouse')
  const [grievanceType, setGrievanceType] = useState<'data_misuse' | 'non_deletion' | 'access_denied' | 'other'>('data_misuse')
  const [grievanceDesc, setGrievanceDesc] = useState('')
  const [nominated, setNominated] = useState(!!customer.nomineeId)
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false)

  function handleNominee() {
    dispatch({ type: 'ADD_NOMINEE', payload: { name: nomineeName, phone: nomineePhone, relation: nomineeRelation } })
    emitEvent({ type: 'NOMINEE_ADDED', actor: 'customer', perspective: 'customer-app', payload: { name: nomineeName, relation: nomineeRelation }, dpdpSection: '§14' })
    setNominated(true)
    setShowNomineeForm(false)
  }

  function handleGrievance() {
    dispatch({ type: 'SUBMIT_GRIEVANCE', payload: { type: grievanceType, description: grievanceDesc } })
    emitEvent({ type: 'GRIEVANCE_SUBMITTED', actor: 'customer', perspective: 'customer-app', payload: { type: grievanceType }, dpdpSection: '§13' })
    setGrievanceSubmitted(true)
    setShowGrievanceForm(false)
  }

  const SECTIONS = [
    {
      title: 'Account',
      items: [
        { label: customer.name, sub: 'Full Name', icon: '👤' },
        { label: customer.email, sub: 'Email', icon: '✉️' },
        { label: customer.phone, sub: 'Phone', icon: '📱' },
      ],
    },
    {
      title: 'Privacy & Data Rights',
      items: [
        { label: 'Nominee', sub: customer.nomineeName ? `${customer.nomineeName} (${customer.nomineeRelation})` : 'Not assigned — §14', icon: '👥', action: () => setShowNomineeForm(true) },
        { label: 'Raise Grievance', sub: grievanceSubmitted ? 'Submitted — 48hr SLA active' : '48-hour SLA under §13', icon: '📝', action: () => setShowGrievanceForm(true) },
        { label: 'Download My Data', sub: 'Export all consent records — §11', icon: '⬇️', action: () => {} },
      ],
    },
  ]

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold bg-[var(--perfios-blue)]">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{customer.name}</h2>
          <p className="text-xs text-gray-500">{customer.phone}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="font-mono text-xs text-gray-400">{customer.consentId.slice(0, 18)}…</span>
          </div>
        </div>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section.title}</p>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {section.items.map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${item.action ? 'hover:bg-gray-50 transition' : 'cursor-default'}`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                </div>
                {item.action && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {(customer.journeyType === 'guardian-minor' || customer.journeyType === 'guardian-disabled') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-800">Guardian Account — §9</p>
          <p className="text-xs text-amber-700 mt-0.5">All consent changes for this account require approval from: <strong>{customer.guardianName}</strong> ({customer.guardianPhone})</p>
        </div>
      )}

      {/* Nominee form */}
      {showNomineeForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-sm animate-slide-up">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Add Nominee — §14</h3>
            <div className="space-y-3">
              <input value={nomineeName} onChange={e => setNomineeName(e.target.value)} placeholder="Nominee full name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
              <input value={nomineePhone} onChange={e => setNomineePhone(e.target.value)} placeholder="Nominee phone" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
              <select value={nomineeRelation} onChange={e => setNomineeRelation(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500">
                {['Spouse', 'Parent', 'Child', 'Sibling', 'Legal Guardian', 'Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNomineeForm(false)} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700">Cancel</button>
              <button onClick={handleNominee} disabled={!nomineeName || !nomineePhone} className="flex-1 bg-blue-600 disabled:bg-gray-200 text-white rounded-xl py-3 text-sm font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Grievance form */}
      {showGrievanceForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-5 w-full max-w-sm animate-slide-up">
            <h3 className="text-sm font-bold text-gray-900 mb-1">File Grievance — §13</h3>
            <p className="text-xs text-gray-500 mb-4">The DPO must resolve this within 48 hours</p>
            <div className="space-y-3">
              <select value={grievanceType} onChange={e => setGrievanceType(e.target.value as typeof grievanceType)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500">
                <option value="data_misuse">Data Misuse</option>
                <option value="non_deletion">Data Not Deleted</option>
                <option value="access_denied">Access Denied</option>
                <option value="other">Other</option>
              </select>
              <textarea value={grievanceDesc} onChange={e => setGrievanceDesc(e.target.value)} placeholder="Describe your complaint..." rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowGrievanceForm(false)} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700">Cancel</button>
              <button onClick={handleGrievance} disabled={!grievanceDesc} className="flex-1 bg-blue-600 disabled:bg-gray-200 text-white rounded-xl py-3 text-sm font-semibold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
