import { useState } from 'react'
import { useDemo } from '../../store/store'
import ConsentAuthorisation from './ConsentAuthorisation'

// ─── SVG icon helpers (no external deps) ─────────────────────────────────────

function Icon({ d, size = 16, className = '' }: { d: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

const ICONS: Record<string, string> = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  consents: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  templates: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  masters: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  authorisation: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  grievances: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  breach: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  cookies: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M8.5 12a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0z M15 9a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0z M12 16a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0z',
  vendors: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  initiate: 'M12 5v14 M5 12h14',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  chevron: 'M6 9l6 6 6-6',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  sort: 'M11 5h10 M11 9h7 M11 13h4 M3 17l3 3 3-3 M6 20V4',
  more: 'M12 5h.01 M12 12h.01 M12 19h.01',
  info: 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M12 16v-4 M12 8h.01',
}

// ─── Nav definition ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'DPO Dashboard',        icon: 'dashboard' },
  { id: 'view-consents',  label: 'View Consents',         icon: 'consents' },
  { id: 'templates',      label: 'Templates',             icon: 'templates' },
  { id: 'masters',        label: 'Master management',     icon: 'masters' },
  { id: 'authorisation',  label: 'Consent Authorisation', icon: 'authorisation' },
  { id: 'grievances',     label: 'Grievances',            icon: 'grievances' },
  { id: 'breach',         label: 'Breach Management',     icon: 'breach' },
  { id: 'cookies',        label: 'Cookie Management',     icon: 'cookies' },
  { id: 'vendors',        label: 'Vendor Management',     icon: 'vendors' },
  { id: 'initiate',       label: 'Consent Initiate',      icon: 'initiate' },
]

// ─── Status pill helper ───────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    Active: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    REVOKED: 'bg-red-100 text-red-700',
    Revoked: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
    Pending: 'bg-amber-100 text-amber-700',
    pending: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-gray-100 text-gray-500',
    open: 'bg-amber-100 text-amber-700',
    OPEN: 'bg-amber-100 text-amber-700',
    Open: 'bg-amber-100 text-amber-700',
    resolved: 'bg-green-100 text-green-700',
    Resolved: 'bg-green-100 text-green-700',
    investigating: 'bg-blue-100 text-blue-700',
    Investigating: 'bg-blue-100 text-blue-700',
    closed: 'bg-gray-100 text-gray-500',
    Closed: 'bg-gray-100 text-gray-500',
    critical: 'bg-red-100 text-red-700',
    Critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    High: 'bg-orange-100 text-orange-700',
    medium: 'bg-amber-100 text-amber-700',
    Medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
    Low: 'bg-blue-100 text-blue-700',
    Published: 'bg-green-100 text-green-700',
    Draft: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ─── Top bar (shared) ─────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0">
      {/* Breadcrumb / page title injected per section — just spacer here */}
      <div />
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Icon d={ICONS.bell} size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {/* Info */}
        <button className="text-slate-400 hover:text-slate-600">
          <Icon d={ICONS.info} size={18} />
        </button>
        {/* User pill */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer hover:bg-slate-50">
          <div className="w-5 h-5 rounded-full bg-perfios-700 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-800">admin</p>
            <p className="text-slate-400 text-[10px]">admin@perfios.com</p>
          </div>
          <Icon d={ICONS.chevron} size={12} className="text-slate-400" />
        </div>
      </div>
    </div>
  )
}

// ─── Main CT Manager shell ────────────────────────────────────────────────────

export default function CTManager() {
  const { state, dispatch } = useDemo()
  const section = state.ctSection

  return (
    <div className="h-full flex bg-white text-sm overflow-hidden">

      {/* ── Left Sidebar ── */}
      <div className="w-52 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">

        {/* Logo */}
        <div className="px-4 py-3.5 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="text-perfios-700 font-bold text-sm">Perfios</span>
            <span className="text-slate-400 text-xs font-normal">| CT Manager</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_CT_SECTION', payload: item.id })}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition border-l-2 ${
                section === item.id
                  ? 'bg-perfios-50 text-perfios-700 border-perfios-700 font-semibold'
                  : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon d={ICONS[item.icon] ?? ICONS.templates} size={15} className="flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200">
          <p className="text-slate-400 text-[10px]">© Perfios Software Solutions</p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto bg-slate-50">
          {section === 'dashboard'     && <DPODashboard />}
          {section === 'view-consents' && <ViewConsents />}
          {section === 'templates'     && <TemplatesSection />}
          {section === 'masters'       && <MasterManagement />}
          {section === 'authorisation' && <ConsentAuthorisation />}
          {section === 'grievances'    && <GrievancesSection />}
          {section === 'breach'        && <BreachSection />}
          {section === 'cookies'       && <CookieManagement />}
          {section === 'vendors'       && <VendorsSection />}
          {section === 'initiate'      && <ConsentInitiate />}
        </div>
      </div>
    </div>
  )
}

// ─── DPO Dashboard ────────────────────────────────────────────────────────────

function DPODashboard() {
  const { state } = useDemo()
  const world = state.world!
  const { dpoStats, consents, customer, breaches } = world

  const openBreaches = breaches.filter(b => b.status === 'open' || b.status === 'investigating')

  const overviewKpis = [
    { label: 'Active Consents',  value: dpoStats.active,    color: 'text-green-600',  bg: 'bg-green-50',  bar: 'bg-green-500',  icon: '●' },
    { label: 'Pending Consents', value: dpoStats.pending,   color: 'text-amber-600',  bg: 'bg-amber-50',  bar: 'bg-amber-500',  icon: '●' },
    { label: 'Expiring Consents',value: 0,                  color: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-400', icon: '●' },
    { label: 'Expired Consents', value: consents.filter(c => c.status === 'EXPIRED').length, color: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', icon: '●' },
  ]

  return (
    <div className="p-6 space-y-5">

      {/* Breach banner */}
      {openBreaches.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <Icon d={ICONS.breach} size={16} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-red-800">🚨 Active Breach — §8(5) DPDP Act</p>
            <p className="text-xs text-red-700 mt-0.5">{openBreaches[0].description} · 72-hour DPB notification clock running</p>
          </div>
          <button
            onClick={() => {}}
            className="text-xs font-semibold text-red-700 border border-red-300 rounded px-2.5 py-1 hover:bg-red-100"
          >
            View
          </button>
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-slate-900">Overview</h2>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {overviewKpis.map(kpi => (
          <div key={kpi.label} className={`${kpi.bg} rounded-lg px-4 py-3 border border-slate-100`}>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{kpi.label}</p>
            <div className="mt-2 h-0.5 bg-slate-200 rounded">
              <div className={`h-full ${kpi.bar} rounded`} style={{ width: `${Math.min(100, (kpi.value / Math.max(dpoStats.active, 1)) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Consents section */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Consents</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>04/05/2026 – 11/05/2026</span>
            <span className="border border-slate-200 rounded px-2 py-0.5">All Products ▾</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Total Consents</p>
            <p className="text-2xl font-bold text-slate-900">{consents.length}</p>
            <p className="text-xs text-green-600 mt-0.5">+{Math.round(consents.length * 0.7)} (100%) last week</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Active Consents</p>
              <p className="text-lg font-bold text-slate-900">{dpoStats.active}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Expired Consents</p>
              <p className="text-lg font-bold text-slate-900">{consents.filter(c => c.status === 'EXPIRED').length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending Consents</p>
              <p className="text-lg font-bold text-slate-900">{dpoStats.pending}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Expiring Consents</p>
              <p className="text-lg font-bold text-slate-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column: Pending Requests + Policies */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Pending Requests</h3>
            <button className="text-xs text-perfios-700 font-medium border border-perfios-100 rounded px-2.5 py-1 hover:bg-perfios-50">View All</button>
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-600">{dpoStats.pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Policies</h3>
            <button className="text-xs text-perfios-700 font-medium border border-perfios-100 rounded px-2.5 py-1 hover:bg-perfios-50">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{dpoStats.compliant}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Non Compliant</p>
              <p className="text-2xl font-bold text-red-600">{dpoStats.nonCompliant}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Request ID', 'Customer', 'Purpose', 'Status', 'Expiry', 'Type'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {consents.slice(0, 5).map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-2.5 font-mono text-slate-400 text-xs">{c.requestId}</td>
                <td className="px-4 py-2.5 font-medium text-slate-900">{customer.name}</td>
                <td className="px-4 py-2.5 text-slate-600 truncate max-w-[140px]">{c.purpose}</td>
                <td className="px-4 py-2.5"><StatusPill status={c.status} /></td>
                <td className="px-4 py-2.5 text-slate-500">{c.expiryDate}</td>
                <td className="px-4 py-2.5 text-slate-500 capitalize">{c.consentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── View Consents ────────────────────────────────────────────────────────────

function ViewConsents() {
  const { state } = useDemo()
  const { consents, customer } = state.world!
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = consents.filter(c => {
    const matchSearch = c.requestId.toLowerCase().includes(search.toLowerCase()) || c.purpose.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">View Consents</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage and review all consent records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Icon d={ICONS.search} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Consent ID / Name"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-perfios-700 text-slate-600"
        >
          {['All', 'ACTIVE', 'REVOKED', 'PENDING', 'EXPIRED'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Request ID', 'Customer', 'Purpose', 'Status', 'Consent Type', 'Expiry Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="px-4 py-3 font-mono text-slate-500">{c.requestId}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{c.purpose}</td>
                <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                <td className="px-4 py-3 text-slate-500 capitalize">{c.consentType}</td>
                <td className="px-4 py-3 text-slate-500">{c.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {consents.length} items</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">← Prev</button>
            <span className="px-2.5 py-1 rounded bg-perfios-700 text-white text-xs">1</span>
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Next →</button>
          </div>
          <span>Show per page: 10 ▾</span>
        </div>
      </div>
    </div>
  )
}

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATE_DATA = [
  { name: 'T23', id: 'T_ID_3O4BW9CVUWCL', product: 'Healthcare', subProduct: 'OPD', date: '23 Feb, 2025' },
  { name: 'Gold Loan', id: 'T_ID_JP2YRH9d80PT', product: 'Loan', subProduct: 'Gold Loan', date: '20 Feb, 2025' },
  { name: 'Auxilo Education Loan', id: 'T_ID_0GZ7E2Y6lPPF', product: 'Loan', subProduct: 'Education Loan', date: '14 Feb, 2025' },
  { name: 'In-patient', id: 'T_ID_JGL79TNVTlWl1', product: 'Healthcare', subProduct: 'In-patient', date: '9 Feb, 2025' },
  { name: 'OPD', id: 'T_ID_lDW3RFF6l36', product: 'Healthcare', subProduct: 'OPD', date: '9 Feb, 2025' },
  { name: 'Debit Card', id: 'T_ID_6X883CYH6D4', product: 'Card', subProduct: 'Times Master Card', date: '17 Apr, 2025' },
  { name: 'Home Loan', id: 'T_ID_7CVGlAK2JR92', product: 'Loan', subProduct: 'Home Loan', date: '17 Apr, 2025' },
  { name: 'Credit Card', id: 'T_ID_S0YVl6VYHFYT', product: 'Card', subProduct: 'Platinum Visa Card', date: '17 Apr, 2025' },
]

function TemplatesSection() {
  const [tab, setTab] = useState<'Active' | 'Inactive' | 'View Saved Drafts'>('Active')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [productFilter, setProductFilter] = useState('All')

  return (
    <div className="p-6 space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Products</label>
            <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[100px]">
              {['All', 'Healthcare', 'Loan', 'Card', 'Insurance', 'HR'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Sub Product</label>
            <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[100px]">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Created By</label>
            <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[100px]">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Creation Dates</label>
            <input type="text" placeholder="Date range" className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[120px]" />
          </div>
          <div className="mt-4">
            <button className="bg-perfios-700 text-white text-xs font-medium rounded px-4 py-1.5 hover:bg-perfios-700/90">Submit</button>
          </div>
          <div className="mt-4 ml-auto">
            <button className="text-xs text-perfios-700 hover:underline">Reset All</button>
          </div>
        </div>
      </div>

      {/* Tabs + actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0 border-b border-slate-200 w-full">
          {(['Active', 'Inactive', 'View Saved Drafts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition ${tab === t ? 'border-perfios-700 text-perfios-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
          <div className="flex-1 flex items-center justify-end gap-2 pb-1">
            <div className="relative">
              <Icon d={ICONS.search} size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Template ID / Name"
                className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700"
              />
            </div>
            <button className="text-xs border border-slate-200 rounded px-3 py-1.5 text-slate-600 hover:bg-slate-50">Deactivate</button>
            <button onClick={() => setShowModal(true)} className="text-xs bg-perfios-700 text-white rounded px-3 py-1.5 font-medium hover:bg-perfios-700/90">Create New</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-8 px-3 py-3"><input type="checkbox" className="rounded" /></th>
              {[
                ['Template Name', ''],
                ['Template ID', '↕'],
                ['Product', ''],
                ['Sub Product', ''],
                ['Creation Date', ''],
              ].map(([h, sort]) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h} {sort && <span className="text-slate-400">{sort}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TEMPLATE_DATA.filter(t =>
              t.name.toLowerCase().includes(search.toLowerCase()) &&
              (productFilter === 'All' || t.product === productFilter)
            ).map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="px-3 py-3"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-3 text-perfios-700 font-medium hover:underline">{t.name}</td>
                <td className="px-4 py-3 font-mono text-slate-400 text-xs">{t.id}</td>
                <td className="px-4 py-3 text-slate-700">{t.product}</td>
                <td className="px-4 py-3 text-slate-600">{t.subProduct}</td>
                <td className="px-4 py-3 text-slate-500">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[560px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900">Create Template</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <input placeholder="Template Name *" className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-perfios-700 text-slate-700" />
              </div>
              <div className="col-span-1">
                <select className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-perfios-700 text-slate-600">
                  <option>Reuse Existing Template</option>
                </select>
              </div>
              <div className="col-span-1">
                <select className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-perfios-700 text-slate-600">
                  <option>Product *</option>
                </select>
              </div>
              <div className="col-span-1">
                <select className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-perfios-700 text-slate-600">
                  <option>Sub Product *</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
              <button className="px-5 py-2 text-sm bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed">Create New</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Master Management ────────────────────────────────────────────────────────

const MASTER_TABS = ['Category', 'Data Points', 'Purposes', 'Vendors', 'Products'] as const
type MasterTab = (typeof MASTER_TABS)[number]

const MASTER_DATA: Record<MasterTab, { name: string; updated: string }[]> = {
  Category: [
    { name: 'Personal Details', updated: '14 Mar, 2026' },
    { name: 'KYC Details', updated: '17 Apr, 2025' },
    { name: 'Financial Details', updated: '17 Apr, 2025' },
    { name: 'Employment Details', updated: '17 Apr, 2025' },
    { name: 'Medical Reports', updated: '9 Feb, 2026' },
    { name: 'Children-Parent Details', updated: '5 May, 2026' },
  ],
  'Data Points': [
    { name: 'Name', updated: '14 Mar, 2026' },
    { name: 'Mobile Number', updated: '14 Mar, 2026' },
    { name: 'PAN', updated: '17 Apr, 2025' },
    { name: 'Aadhaar', updated: '17 Apr, 2025' },
    { name: 'Date of Birth', updated: '9 Feb, 2026' },
  ],
  Purposes: [
    { name: 'Customer Identification', updated: '14 Mar, 2026' },
    { name: 'KYC and Verification', updated: '14 Mar, 2026' },
    { name: 'Marketing and Advertisements', updated: '17 Apr, 2025' },
    { name: 'Credit Assessment', updated: '17 Apr, 2025' },
  ],
  Vendors: [
    { name: 'Instagram', updated: 'NA' },
    { name: 'Perfios', updated: 'NA' },
    { name: 'Snigg y', updated: 'NA' },
    { name: 'Zupay', updated: 'NA' },
    { name: 'Hubspot', updated: 'NA' },
    { name: 'Gupshup', updated: 'NA' },
    { name: 'CIBIL', updated: 'NA' },
    { name: 'Transunion', updated: 'NA' },
  ],
  Products: [
    { name: 'Loan', updated: '16 Feb, 2025' },
    { name: 'Card', updated: 'NA' },
    { name: 'Savings', updated: 'NA' },
    { name: 'Users', updated: 'NA' },
    { name: 'Healthcare', updated: '5 Feb, 2026' },
  ],
}

function MasterManagement() {
  const [tab, setTab] = useState<MasterTab>('Category')
  const rows = MASTER_DATA[tab]

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Master Management</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage master data entities</p>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-4">
          <div className="flex">
            {MASTER_TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition ${tab === t ? 'border-perfios-700 text-perfios-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="text-xs bg-perfios-700 text-white rounded px-3 py-1.5 font-medium hover:bg-perfios-700/90">
            + Create {tab === 'Category' ? 'Category' : tab === 'Vendors' ? 'Vendors' : tab === 'Products' ? 'Products' : 'Item'}
          </button>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {tab === 'Vendors' ? 'Vendor Name' : tab === 'Products' ? 'Product Name' : `${tab.replace('Data Points', 'Data Point').replace('Purposes', 'Purpose')} Name`}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Updated</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(r => (
              <tr key={r.name} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-slate-500">{r.updated}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-perfios-700">✏️</button>
                    <button className="text-slate-400 hover:text-red-500">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-slate-100 text-right">
          <span className="text-xs text-slate-400">Powered by <span className="text-perfios-700 font-semibold">Perfios</span></span>
        </div>
      </div>
    </div>
  )
}

// ─── Grievances ───────────────────────────────────────────────────────────────

function GrievancesSection() {
  const { state } = useDemo()
  const { grievances } = state.world!
  const [tab, setTab] = useState<'All' | 'Open' | 'Resolved'>('All')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Show All')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = grievances.filter(g => {
    const matchSearch = g.id.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'All' || (tab === 'Open' ? g.status === 'open' || g.status === 'in_review' : g.status === 'resolved')
    return matchSearch && matchTab
  })

  const selectedGrievance = grievances.find(g => g.id === selected)

  if (selectedGrievance) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-xs text-slate-400">
          <button onClick={() => setSelected(null)} className="text-perfios-700 hover:underline">← View Grievances</button>
          {' '}&gt; Grievance Details
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Grievance Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">Data Usage</p>
                <p className="text-sm text-slate-800 capitalize mt-0.5">{selectedGrievance.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Grievance ID</p>
                <p className="text-xs font-mono text-slate-700 mt-0.5">{selectedGrievance.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Name</p>
                <p className="text-xs text-slate-700 mt-0.5">N/A</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Status</p>
                <StatusPill status={selectedGrievance.status.toUpperCase()} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">Reported on: {new Date(selectedGrievance.submittedAt).toLocaleString('en-IN')}</p>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-600 text-white rounded px-3 py-1.5 font-medium hover:bg-green-700">Accept</button>
                  <button className="text-xs bg-red-500 text-white rounded px-3 py-1.5 font-medium hover:bg-red-600">Reject</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">Complaint Description</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedGrievance.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Attachment Details</p>
                <div className="space-y-1.5">
                  {['image.jpg', 'screenshot.jpg', 'image.png'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer">
                      <span>📎</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Grievances</h2>
        <p className="text-xs text-slate-400 mt-0.5">View and manage your grievances and complaints</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-3">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600 min-w-[120px]">
            {['Show All', 'Open', 'Resolved', 'In Review'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">&nbsp;</label>
          <div className="relative">
            <Icon d={ICONS.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Complaint ID / Name"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(['All', 'Open', 'Resolved'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition ${tab === t ? 'border-perfios-700 text-perfios-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Complaint ID', 'Name', 'Complaint Details', 'Status', 'Due on', 'Created on'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">No grievances found</td>
              </tr>
            ) : filtered.map(g => (
              <tr key={g.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelected(g.id)}>
                <td className="px-4 py-3 text-perfios-700 font-mono hover:underline">{g.id}</td>
                <td className="px-4 py-3 text-slate-700">N/A</td>
                <td className="px-4 py-3 text-slate-600 capitalize truncate max-w-[140px]">{g.type.replace('_', ' ')}</td>
                <td className="px-4 py-3"><StatusPill status={g.status.toUpperCase()} /></td>
                <td className="px-4 py-3 text-slate-500">N/A</td>
                <td className="px-4 py-3 text-slate-500">{new Date(g.submittedAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {grievances.length} items</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">← Previous</button>
            <span className="px-2.5 py-1 rounded bg-perfios-700 text-white text-xs">1</span>
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Next →</button>
          </div>
          <span>Show per page: 10 ▾</span>
        </div>
      </div>
    </div>
  )
}

// ─── Breach Management ────────────────────────────────────────────────────────

function BreachSection() {
  const { state } = useDemo()
  const { breaches } = state.world!
  const [severityFilter, setSeverityFilter] = useState('All Severities')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [search, setSearch] = useState('')

  // Synthetic extra breaches for demo fullness
  const allBreaches = [
    ...breaches,
    { id: 'BRCH-223011', detectedAt: '2026-04-29', severity: 'medium' as const, recordsAffected: 1200, description: 'Consent record export without authorization', status: 'resolved' as const, notified72h: true, linkedDeletionJobId: undefined },
    { id: 'BRCH-223042', detectedAt: '2026-04-29', severity: 'high' as const, recordsAffected: 3500, description: 'Data shared with unauthorised third party', status: 'resolved' as const, notified72h: true, linkedDeletionJobId: undefined },
    { id: 'BRCH-223474', detectedAt: '2026-04-28', severity: 'critical' as const, recordsAffected: 4770, description: 'PII data breach — customer financial records', status: 'investigating' as const, notified72h: false, linkedDeletionJobId: undefined },
  ]

  const totalNotifications = allBreaches.length + 42
  const activeInvestigations = allBreaches.filter(b => b.status === 'open' || b.status === 'investigating').length + 22
  const criticalSeverity = allBreaches.filter(b => b.severity === 'critical').length + 8

  const kpis = [
    { label: 'Total Notifications', value: totalNotifications, sub: '15% Reviewed month', color: 'text-slate-800', bg: 'bg-white', border: 'border-slate-200', icon: '≡' },
    { label: 'Active Investigations', value: activeInvestigations, sub: 'Require immediate attention', color: 'text-amber-600', bg: 'bg-white', border: 'border-slate-200', icon: '⚡' },
    { label: 'Critical Severity', value: criticalSeverity, sub: 'Uncontained/high-impact cases', color: 'text-red-600', bg: 'bg-white', border: 'border-red-200', icon: '▲' },
    { label: 'Est. Records Exposed', value: '12.2K', sub: 'Across all recorded breaches', color: 'text-purple-700', bg: 'bg-white', border: 'border-slate-200', icon: '👤' },
  ]

  const filtered = allBreaches.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === 'All Severities' || b.severity === severityFilter.toLowerCase()
    const matchStatus = statusFilter === 'All Statuses' || b.status === statusFilter.toLowerCase()
    return matchSearch && matchSeverity && matchStatus
  })

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Breach Management</h2>
        <p className="text-xs text-slate-400 mt-0.5">72-hour DPB notification SLA — §8(5) · Penalty: ₹250 Crore</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`${kpi.bg} border ${kpi.border} rounded-lg px-4 py-3`}>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Icon d={ICONS.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or organisation..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700" />
        </div>
        <Icon d={ICONS.filter} size={15} className="text-slate-400" />
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600">
          {['All Severities', 'Critical', 'High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600">
          {['All Statuses', 'Open', 'Investigating', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['INCIDENT ID', 'BU + DEPARTMENT', 'REPORTED DATE', 'BREACH TYPE', 'SEVERITY', 'STATUS', 'USERS AFFECTED', ''].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="px-3 py-3 text-perfios-700 font-mono font-medium hover:underline">{b.id}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-800 font-medium">Organisation Ltd</p>
                  <p className="text-slate-400 text-[10px]">{b.description.slice(0, 30)}...</p>
                </td>
                <td className="px-3 py-3 text-slate-500">{new Date(b.detectedAt).toLocaleDateString('en-IN')}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${b.id.includes('474') || b.id.includes('live') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.id.includes('474') || b.id.includes('live') ? '⚡ Data Breach' : '📋 Consent Breach'}
                  </span>
                </td>
                <td className="px-3 py-3"><StatusPill status={b.severity.charAt(0).toUpperCase() + b.severity.slice(1)} /></td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    b.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    b.status === 'investigating' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'open' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {b.status === 'resolved' ? '✓ Resolved' : b.status === 'investigating' ? '⏳ Investigating' : b.status === 'open' ? '● Open' : '✓ Closed'}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700 font-medium">{b.recordsAffected.toLocaleString()}</td>
                <td className="px-3 py-3 text-slate-400">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Cookie Management ────────────────────────────────────────────────────────

const COOKIE_TEMPLATES = [
  { name: 'Cookie Template #1', status: 'Published', modified: 'Mar 15, 2026', created: 'Mar 15, 2026' },
  { name: 'Online_default_consent', status: 'Published', modified: 'Mar 13, 2026', created: 'Mar 13, 2026' },
  { name: 'Ecommerce Template', status: 'Published', modified: 'Mar 13, 2026', created: 'Mar 13, 2026' },
  { name: 'Standard Cookie Template', status: 'Published', modified: 'Feb 28, 2026', created: 'Feb 28, 2026' },
  { name: 'Enterprise Template', status: 'Draft', modified: 'Apr 07, 2026', created: 'Mar 21, 2026' },
  { name: 'Education Institution Template', status: 'Published', modified: 'Mar 03, 2026', created: 'Mar 17, 2026' },
  { name: 'Template', status: 'Published', modified: 'Mar 03, 2026', created: 'Mar 03, 2026' },
  { name: 'Generic Template', status: 'Published', modified: 'Mar 03, 2026', created: 'Mar 03, 2026' },
]

function CookieManagement() {
  const [tab, setTab] = useState<'All' | 'Published' | 'Drafts' | 'Archived'>('All')
  const [search, setSearch] = useState('')

  const filtered = COOKIE_TEMPLATES.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'All' || t.status === tab
    return matchSearch && matchTab
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Manage Cookies</h2>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none text-slate-600">
            <option>Select Domain: All</option>
          </select>
        </div>
      </div>

      {/* Tabs + actions */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-4">
          <div className="flex">
            {(['All', 'Published', 'Drafts', 'Archived'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition ${tab === t ? 'border-perfios-700 text-perfios-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <div className="relative">
              <Icon d={ICONS.search} size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Templates" className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-perfios-700" />
            </div>
            <button className="text-xs border border-slate-200 rounded px-3 py-1.5 text-slate-600 hover:bg-slate-50">Archive</button>
            <button className="text-xs bg-perfios-700 text-white rounded px-3 py-1.5 font-medium hover:bg-perfios-700/90">Create New</button>
          </div>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Template Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status ↕</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Modified</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.name} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="px-4 py-3 text-perfios-700 font-medium hover:underline">{t.name}</td>
                <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                <td className="px-4 py-3 text-slate-500">{t.modified}</td>
                <td className="px-4 py-3 text-slate-500">{t.created}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <button className="hover:text-slate-700">📋</button>
                    <button className="hover:text-perfios-700">✏️</button>
                    <button className="hover:text-red-500">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing 1–{filtered.length} of {COOKIE_TEMPLATES.length} items</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">← Previous</button>
            <span className="px-2.5 py-1 rounded bg-perfios-700 text-white text-xs">1</span>
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Next →</button>
          </div>
          <span>Show per page: 10 ▾</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-xs text-slate-400">Powered by <span className="text-perfios-700 font-semibold">Perfios</span></span>
      </div>
    </div>
  )
}

// ─── Vendor Management ────────────────────────────────────────────────────────

const VENDOR_TABS = ['Vendor List', 'Assessment List', 'Review & Approval Panel', 'Audit Logs', 'Risk Metrics Dashboard'] as const
type VendorTab = (typeof VENDOR_TABS)[number]

function VendorsSection() {
  const { state } = useDemo()
  const { vendors } = state.world!
  const [tab, setTab] = useState<VendorTab>('Vendor List')

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Vendor Management</h2>
        </div>
        <button className="text-xs bg-perfios-700 text-white rounded px-3 py-1.5 font-medium hover:bg-perfios-700/90">+ Add Vendor</button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 px-4">
          {VENDOR_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${tab === t ? 'border-perfios-700 text-perfios-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Vendor List' && (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Vendor Name', 'Country', 'Purpose', 'Cross-Border', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map(v => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{v.logoInitials}</div>
                      <span className="font-medium text-slate-900">{v.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{v.country}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[160px]">{v.purpose}</td>
                  <td className="px-4 py-3">
                    {v.crossBorder
                      ? <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">⚠ §16 applies</span>
                      : <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded px-2 py-0.5">✓ India only</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <button className="hover:text-perfios-700">✏️</button>
                      <button className="hover:text-red-500">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'Assessment List' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800">Questionnaires</h3>
              <button className="text-xs bg-perfios-700 text-white rounded px-3 py-1.5 font-medium">+ Add Questionnaire</button>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border border-slate-200 rounded">
                <tr>
                  {['Questionnaire Name', 'Status', 'Submission Deadline', 'Review Date', 'Reviewers', 'Action'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Cloud Security & Data Protection Assessment', status: 'DRAFT', deadline: 'Apr 13, 2026', review: 'Apr 13, 2026', reviewers: '1/3p' },
                  { name: 'GDPR & Data Privacy Compliance Review', status: 'DRAFT', deadline: 'Apr 13, 2026', review: 'Apr 13, 2026', reviewers: '1/3p' },
                  { name: 'Third-Party Risk Management Assessment', status: 'DRAFT', deadline: 'Apr 13, 2026', review: 'Apr 13, 2026', reviewers: '1/3p' },
                ].map(q => (
                  <tr key={q.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800">{q.name}</td>
                    <td className="px-4 py-3"><StatusPill status={q.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{q.deadline}</td>
                    <td className="px-4 py-3 text-slate-500">{q.review}</td>
                    <td className="px-4 py-3 text-slate-500">{q.reviewers}</td>
                    <td className="px-4 py-3"><button className="text-slate-400 hover:text-slate-600">✏️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Audit Logs' && (
          <div className="p-4 space-y-2">
            {[
              { msg: 'Cloud Security & Data Protection Assessment created', by: 'Perfios Security Team' },
              { msg: 'Cloud Security Assessment assigned to CloudTech Infrastructure', by: 'Perfios Security Team' },
              { msg: 'GDPR Compliance Review started by vendor', by: 'CloudTech Infrastructure' },
              { msg: 'Third-Party Risk Assessment submitted with all required documentation', by: 'CloudTech Infrastructure' },
            ].map((l, i) => (
              <div key={i} className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
                <p className="text-xs text-slate-700">{l.msg}</p>
                <p className="text-xs text-slate-400 ml-4 flex-shrink-0">{l.by}</p>
              </div>
            ))}
          </div>
        )}

        {(tab === 'Review & Approval Panel' || tab === 'Risk Metrics Dashboard') && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm font-medium text-slate-500">{tab}</p>
            <p className="text-xs mt-1">Data populates from vendor assessment workflow</p>
          </div>
        )}

        <div className="px-4 py-2.5 border-t border-slate-100 text-right">
          <span className="text-xs text-slate-400">Powered by <span className="text-perfios-700 font-semibold">Perfios</span></span>
        </div>
      </div>
    </div>
  )
}

// ─── Consent Initiate ─────────────────────────────────────────────────────────

function ConsentInitiate() {
  const [showForm, setShowForm] = useState(false)
  const { state } = useDemo()
  const customer = state.world!.customer

  const modes = [
    { label: 'Bulk Consent', desc: 'Process consent for multiple customers. Upload CSV with customer details, products, and data points.', icon: '📁' },
    { label: 'Form Upload', desc: 'Upload a completed consent form (PDF). Consent gets extracted and stored automatically.', icon: '📋' },
    { label: 'Single Consent', desc: 'Initiate consent request for a single individual. Provide name and mobile to send consent link.', icon: '👤' },
  ]

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Consent Initiate</h2>
        <p className="text-xs text-slate-400 mt-0.5">Initiate consent requests in bulk, via document upload, or for a single individual</p>
      </div>

      {!showForm ? (
        <>
          {/* Mode cards */}
          <div className="grid grid-cols-3 gap-4">
            {modes.map(m => (
              <button
                key={m.label}
                onClick={() => m.label === 'Single Consent' && setShowForm(true)}
                className="bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-perfios-700/50 hover:shadow-sm transition group"
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-perfios-700">{m.label}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                <div className="mt-3 text-perfios-700 text-xs font-medium flex items-center gap-1">Start →</div>
              </button>
            ))}
          </div>

          {/* Consent Requests table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Consent Requests</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Icon d={ICONS.search} size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search by ID or name..." className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none" />
                </div>
                <select className="text-xs border border-slate-200 rounded px-2.5 py-1.5 text-slate-600">
                  <option>All Types</option>
                </select>
              </div>
            </div>
            <div className="p-8 text-center text-slate-400">
              <div className="text-3xl mb-3">📄</div>
              <p className="text-sm">No consent requests yet</p>
              <p className="text-xs mt-1">Click one of the cards above to initiate a consent request</p>
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>No entries</span>
              <span>Page 1/1 of 0</span>
            </div>
          </div>
        </>
      ) : (
        /* Single Consent Form */
        <div className="bg-white rounded-lg border border-slate-200 p-5 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setShowForm(false)} className="text-xs text-perfios-700 hover:underline">← Back</button>
            <h3 className="text-sm font-semibold text-slate-800">Provide Mobile Number to start the Consent Journey</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Kindly enter asked details to proceed</p>
          <div className="space-y-3">
            <input defaultValue={customer.phone || ''} placeholder="Phone Number *" className="w-full border border-slate-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-perfios-700 text-slate-700" />
            <input defaultValue={customer.name || ''} placeholder="Name *" className="w-full border border-slate-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-perfios-700 text-slate-700" />
            <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-perfios-700 text-slate-600">
              <option>Products *</option>
            </select>
            <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-perfios-700 text-slate-600">
              <option>Consent Type *: Self</option>
              <option>Assisted</option>
              <option>Guardian</option>
            </select>
            <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-perfios-700 text-slate-600">
              <option>Flow Type *: Default</option>
            </select>
            <button className="w-full bg-perfios-700 text-white text-xs font-semibold rounded px-3 py-2.5 hover:bg-perfios-700/90 mt-2">
              Proceed With Consent
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
