import { useState } from 'react'
import { useDemo } from '../../store/store'
import type { DataAsset, ComplianceScore, AuditEntry } from '../../store/types'

// ─── Aurva leaf SVG logo ──────────────────────────────────────────────────────
function AurvaLeaf({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8 2 4 5.5 4 10c0 3.5 2 6.5 5 8l1-4c-1.5-1-2.5-2.5-2.5-4 0-2.5 2-4.5 4.5-4.5S16.5 7.5 16.5 10c0 1.5-.5 3-1.5 4l1 4c3-1.5 5-4.5 5-8 0-4.5-4-8-9-8z"
        fill="#10b981"
      />
      <path d="M12 14l-1 4h2l-1-4z" fill="#059669" />
    </svg>
  )
}

// ─── Icon components (inline SVG, no libs) ────────────────────────────────────
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconDatabase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}
function IconBarChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}
function IconApps() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="1" />
      <rect x="13" y="2" width="9" height="9" rx="1" />
      <rect x="2" y="13" width="9" height="9" rx="1" />
      <rect x="13" y="13" width="9" height="9" rx="1" />
    </svg>
  )
}
function IconPolicy() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  )
}
function IconAudit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  )
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconToggle({ on }: { on: boolean }) {
  return (
    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-1'}`} />
    </div>
  )
}

// ─── Shared: Risk score circle ────────────────────────────────────────────────
function RiskCircle({ score }: { score: number }) {
  const color =
    score >= 80 ? '#ef4444' :
    score >= 60 ? '#f97316' :
    score >= 40 ? '#f59e0b' : '#22c55e'
  const bgColor =
    score >= 80 ? '#fef2f2' :
    score >= 60 ? '#fff7ed' :
    score >= 40 ? '#fffbeb' : '#f0fdf4'
  return (
    <div
      style={{ backgroundColor: bgColor, color, borderColor: color }}
      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
    >
      {score}
    </div>
  )
}

// ─── Shared: Compliance score pill ───────────────────────────────────────────
function CompliancePill({ score }: { score: number }) {
  const cls =
    score >= 80 ? 'bg-emerald-100 text-emerald-700' :
    score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{score}%</span>
  )
}

// ─── Shared: Tag pills ────────────────────────────────────────────────────────
const TAG_STYLE: Record<string, string> = {
  PHI: 'bg-red-100 text-red-700 border border-red-200',
  PCI: 'bg-blue-100 text-blue-700 border border-blue-200',
  PII: 'bg-purple-100 text-purple-700 border border-purple-200',
  SPII: 'bg-orange-100 text-orange-700 border border-orange-200',
}
function TagPill({ tag }: { tag: string }) {
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${TAG_STYLE[tag] ?? 'bg-slate-100 text-slate-600'}`}>
      {tag}
    </span>
  )
}

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative flex items-center justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full ml-2 z-50 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
    </div>
  )
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview', label: 'Overview', Icon: IconHome },
  { id: 'assets', label: 'Data Assets', Icon: IconDatabase },
  { id: 'compliance', label: 'Compliance', Icon: IconShield },
  { id: 'audit', label: 'Audit Trail', Icon: IconAudit },
  { id: 'apps', label: 'Applications', Icon: IconApps },
  { id: 'policies', label: 'Custom Policies', Icon: IconPolicy },
  { id: 'reports', label: 'Reports', Icon: IconBarChart },
]

const NAV_BOTTOM = [
  { id: 'settings', label: 'Settings', Icon: IconSettings },
  { id: 'profile', label: 'Profile', Icon: IconUser },
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function AurvaView() {
  const { state } = useDemo()
  const world = state.world!
  const [section, setSection] = useState('overview')
  const hasActiveBreach = world.breaches.some(b => b.status === 'open')

  return (
    <div className="h-full flex bg-white text-sm overflow-hidden font-sans">
      {/* Narrow icon-only sidebar */}
      <div className="w-14 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-slate-200">
          <AurvaLeaf size={22} />
        </div>

        {/* Main nav */}
        <nav className="flex-1 flex flex-col items-center py-2 gap-1">
          {NAV.map(({ id, label, Icon }) => (
            <Tooltip key={id} label={label}>
              <button
                onClick={() => setSection(id)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                  section === id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon />
              </button>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="flex flex-col items-center pb-3 gap-1 border-t border-slate-200 pt-2">
          {NAV_BOTTOM.map(({ id, label, Icon }) => (
            <Tooltip key={id} label={label}>
              <button
                onClick={() => setSection(id)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <Icon />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-semibold text-sm capitalize">
              {NAV.find(n => n.id === section)?.label ?? section}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* System health pill */}
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
              hasActiveBreach
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasActiveBreach ? 'bg-red-500' : 'bg-emerald-500'}`} />
              System Health
            </button>
            {/* Bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
              <IconBell />
              {hasActiveBreach && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Section content */}
        {section === 'overview' && <AurvaOverview />}
        {section === 'assets' && <AurvaAssets />}
        {section === 'compliance' && <AurvaCompliance />}
        {section === 'audit' && <AurvaAudit />}
        {section === 'apps' && <AurvaApps />}
        {section === 'policies' && <AurvaPolicies />}
        {(section === 'reports' || section === 'settings' || section === 'profile') && (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            {NAV.concat(NAV_BOTTOM).find(n => n.id === section)?.label} — coming soon
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function AurvaOverview() {
  const { state } = useDemo()
  const world = state.world!
  const { openRisks, breaches, dataAssets, complianceScores } = world
  const hasActiveBreach = breaches.some(b => b.status === 'open')

  // Compute KPI strip values from world data
  const totalAssets = dataAssets.length
  const sensitiveAssets = dataAssets.filter(a => a.dataSensitivity === 'High' || a.dataSensitivity === 'Critical').length
  const riskyAssets = dataAssets.filter(a => a.riskScore >= 60).length

  // Simulated chart data (spark line)
  const chartPoints = [400, 480, 350, 600, 420, 550, 480, 520, 490, 600, 520, 580]

  // Sensitive data risks list
  const sensitiveRisks = [
    { label: 'Plaintext Credit Card found in a data asset', severity: 'High', count: 307 },
    { label: 'Plaintext Aadhaar Card found in a data asset', severity: 'High', count: 261 },
    { label: 'System Table Access', severity: 'High', count: 2 },
  ]

  const complianceMini = complianceScores.slice(0, 4)

  return (
    <div className="p-6 space-y-5">
      {/* Breach banner */}
      {hasActiveBreach && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-red-500 text-lg font-bold mt-0.5">⚠</span>
          <div>
            <p className="text-red-700 font-semibold text-sm">Active Breach Detected — §8(5)</p>
            <p className="text-red-600 text-xs mt-0.5">{breaches.find(b => b.status === 'open')?.description}</p>
            <p className="text-red-500 text-xs mt-1 font-medium">72-hour notification clock running · Penalty: ₹250 Crore</p>
          </div>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'OPEN RISKS', value: openRisks.total.toLocaleString(), delta: '+87 in last week', color: 'text-slate-800' },
          { label: 'DAM', value: openRisks.dam.toLocaleString(), delta: '+5% in last week', color: 'text-slate-800' },
          { label: 'DATA PRIVACY', value: openRisks.dataPrivacy.toLocaleString(), delta: '+3 in last week', color: 'text-slate-800' },
          { label: 'DATA FLOW', value: '947', delta: '+1.25 in last week', color: 'text-slate-800' },
          { label: 'DSPM', value: openRisks.dspm.toLocaleString(), delta: '+2.5 in last week', color: 'text-slate-800' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-slate-500 text-xs font-semibold mt-1 tracking-wide">{kpi.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Second row: chart + donut + sensitive risks */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity trend (sparkline) */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-600">New Open Risks / Resolved Risks</p>
          </div>
          <svg viewBox="0 0 200 80" className="w-full h-16">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 20, 40, 60].map(y => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {/* Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={chartPoints.map((v, i) => `${(i / (chartPoints.length - 1)) * 200},${70 - (v / 700) * 60}`).join(' ')}
            />
            {/* Dots */}
            {chartPoints.map((v, i) => (
              <circle
                key={i}
                cx={(i / (chartPoints.length - 1)) * 200}
                cy={70 - (v / 700) * 60}
                r="2.5"
                fill="#10b981"
              />
            ))}
            {/* Secondary line (resolved) */}
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              points={chartPoints.map((v, i) => `${(i / (chartPoints.length - 1)) * 200},${70 - ((v * 0.6) / 700) * 60}`).join(' ')}
            />
          </svg>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> # of New Open Risks</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-0.5 bg-slate-400 border-dashed inline-block" /> # of Queries</span>
          </div>
        </div>

        {/* Donut + stats */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle
                cx="40" cy="40" r="30"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 30 * 0.31} ${2 * Math.PI * 30 * 0.69}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-800">31%</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2 text-center">Scan Remaining Data Assets to eliminate Blind Spots</p>
        </div>

        {/* Sensitive data risks */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-600 mb-3">SENSITIVE DATA RISKS</p>
          <div className="space-y-3">
            {sensitiveRisks.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">{r.severity}</span>
                  <p className="text-xs text-slate-600">{r.label}</p>
                </div>
                <span className="text-xs font-bold text-slate-700 flex-shrink-0">{r.count}</span>
              </div>
            ))}
            <p className="text-xs text-emerald-600 font-medium cursor-pointer hover:underline">View All</p>
          </div>
        </div>
      </div>

      {/* Third row: Data Assets / Apps / Third Party summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <IconDatabase />
          </div>
          <div>
            <p className="text-xs text-slate-500">Data Assets</p>
            <p className="text-lg font-bold text-slate-800">{(totalAssets * 160).toLocaleString()}</p>
            <p className="text-xs text-red-500">{sensitiveAssets * 80} Risky with sensitive Data</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <IconApps />
          </div>
          <div>
            <p className="text-xs text-slate-500">Applications</p>
            <p className="text-lg font-bold text-slate-800">3K</p>
            <p className="text-xs text-red-500">196 Apps with sensitive Data</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <IconShield />
          </div>
          <div>
            <p className="text-xs text-slate-500">Third Party</p>
            <p className="text-lg font-bold text-slate-800">1.2K</p>
            <p className="text-xs text-red-500">87 Risky with sensitive Data</p>
          </div>
        </div>
      </div>

      {/* Compliance mini strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 mb-3 tracking-wide">COMPLIANCE OVERVIEW</p>
        <div className="grid grid-cols-4 gap-4">
          {complianceMini.map((cs: ComplianceScore) => (
            <div key={cs.framework} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium truncate">{cs.framework}</p>
                <CompliancePill score={cs.score} />
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cs.score >= 80 ? 'bg-emerald-500' : cs.score >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${cs.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Data Assets ──────────────────────────────────────────────────────────────
function AurvaAssets() {
  const { state } = useDemo()
  const { dataAssets } = state.world!
  const [selected, setSelected] = useState<DataAsset | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'unscanned' | 'archived' | 'scanned'>('all')

  const cloudCount = dataAssets.length
  const selfManaged = Math.floor(dataAssets.length * 0.23)
  const external = Math.max(1, Math.floor(dataAssets.length * 0.004))
  const sensitiveCount = dataAssets.filter(a => a.dataSensitivity === 'High' || a.dataSensitivity === 'Critical').length
  const riskyCount = dataAssets.filter(a => a.riskScore >= 60).length

  // Enrich assets with synthetic region/service/owner
  const regions = ['IN', 'US', 'SG', 'EU']
  const services = ['RDS', 'CloudStorage', 'CloudSQL', 'S3', 'MySql', 'SqlServer']
  const owners = ['Engineering', 'Data Platform', 'Security', 'Analytics']

  function getAssetMeta(asset: DataAsset, idx: number) {
    return {
      region: regions[idx % regions.length],
      service: services[idx % services.length],
      type: 'Cloud',
      owner: owners[idx % owners.length],
      accessors: ((asset.riskScore * 7 + idx * 3) % 50) + 1,
      complianceScore: Math.floor(60 + (asset.riskScore * 0.3)),
    }
  }

  const tabCls = (t: string) =>
    `px-3 py-1.5 text-xs font-medium rounded-full transition ${activeTab === t ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`

  return (
    <div className="p-6 space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">ASSETS</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{(cloudCount * 160).toLocaleString()}</p>
        </div>
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">BY TYPE</p>
          <div className="flex gap-3 mt-1">
            <div><p className="text-lg font-bold text-slate-800">1.3K</p><p className="text-xs text-slate-400">Cloud</p></div>
            <div><p className="text-lg font-bold text-slate-800">303</p><p className="text-xs text-slate-400">Self-managed</p></div>
            <div><p className="text-lg font-bold text-slate-800">6</p><p className="text-xs text-slate-400">External</p></div>
          </div>
        </div>
        <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-purple-500 font-semibold tracking-wide">SENSITIVE ASSETS</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">450</p>
          <p className="text-xs text-slate-400">+8 from last 7 days</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-red-500 font-semibold tracking-wide">RISKY ASSETS</p>
          <p className="text-2xl font-bold text-red-600 mt-1">1.2K</p>
          <p className="text-xs text-slate-400">+87 from last 7 days</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-amber-600 font-semibold tracking-wide">RISKY SNAPSHOTS</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">25</p>
          <p className="text-xs text-slate-400">+8 from last 7 days</p>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 bg-slate-100 rounded-full p-1">
          {(['all', 'unscanned', 'archived', 'scanned'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-2">
          <input
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-64 outline-none focus:border-emerald-400 text-slate-600 placeholder-slate-400"
            placeholder="Search or Apply Filters..."
            readOnly
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button className="hover:text-slate-700">Clear All</button>
          <button className="flex items-center gap-1 hover:text-slate-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Data Asset', 'Region', 'Service', 'Type', 'Owner', 'Tags', 'Accessors', 'Compliance Score', 'Risk Score'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dataAssets.map((asset, idx) => {
              const meta = getAssetMeta(asset, idx)
              return (
                <tr
                  key={asset.id}
                  className="hover:bg-slate-50 cursor-pointer transition"
                  onClick={() => setSelected(asset)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-mono text-xs">{asset.name}</p>
                        <p className="text-slate-400 text-xs">{asset.exposure === 'Public' ? '🌐' : '🔒'} {asset.exposure.toLowerCase()} url/groupstage</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{meta.region}</td>
                  <td className="px-4 py-3 text-slate-600">{meta.service}</td>
                  <td className="px-4 py-3 text-slate-600">{meta.type}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{meta.owner}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 2).map(tag => <TagPill key={tag} tag={tag} />)}
                      {asset.tags.length > 2 && (
                        <span className="text-xs text-slate-400">+{asset.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{meta.accessors}</td>
                  <td className="px-4 py-3">
                    <CompliancePill score={meta.complianceScore} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskCircle score={asset.riskScore} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Asset detail slide-over */}
      {selected && <AssetDetailPanel asset={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ─── Asset detail slide-over (page_04) ───────────────────────────────────────
function AssetDetailPanel({ asset, onClose }: { asset: DataAsset; onClose: () => void }) {
  const [tab, setTab] = useState('General')
  const tabs = ['General', 'Data', 'Identities', `Risks (${asset.issues.length + 2})`, 'Compliance', 'Events']

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-[60%] max-w-3xl h-full bg-white border-l border-slate-200 shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800 font-mono">{asset.name}</h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Account: dataplane-uat-org · <span className="text-slate-600">🌐 {asset.exposure === 'Public' ? 'Public' : 'Private'}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">Actions ▾</button>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <IconX />
              </button>
            </div>
          </div>
        </div>

        {/* KEY INSIGHTS */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 mb-3 tracking-wide">KEY INSIGHTS</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'High Data Sensitivity', desc: 'Highly Sensitive data detected.', icon: '🔴', color: 'text-red-500' },
              { label: 'Overprovisioned Identity Access', desc: 'Broad Identity access. Accessible by non human entities.', icon: '🟠', color: 'text-orange-500' },
              { label: 'Misconfigurations', desc: 'Backup disabled. Accessible by Public.', icon: '🟡', color: 'text-amber-500' },
              { label: 'Active Security Alerts', desc: 'Risks associated with this data asset.', icon: '🟠', color: 'text-orange-500' },
            ].map((ins, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{ins.icon}</span>
                  <div className="w-8 h-8 rounded-full border-2 border-red-400 flex items-center justify-center text-xs font-bold text-red-600">
                    {asset.riskScore - i * 5}
                  </div>
                </div>
                <p className={`text-xs font-semibold ${ins.color}`}>{ins.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{ins.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-4">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 text-xs font-medium border-b-2 transition ${tab === t ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-6 py-4">
          {tab === 'General' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Status badges */}
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    🌐 Public
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    ✓ Encrypted
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Storage Size</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{asset.sizeGB * 1000} MB</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Versioning</p>
                  <p className="text-sm text-slate-700 mt-0.5 flex items-center gap-1"><span className="text-red-500">✗</span> Disabled</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm text-slate-700 mt-0.5 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Ready</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400">Cloud</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{asset.cloudProvider}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Service</p>
                  <p className="text-sm text-slate-700 mt-0.5">CloudStorage</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Managed Type</p>
                  <p className="text-sm text-slate-700 mt-0.5">Cloud</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Engine</p>
                  <p className="text-sm text-slate-700 mt-0.5">CloudStorage</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Host Country</p>
                  <p className="text-sm text-slate-700 mt-0.5">🌐 {asset.exposure === 'Public' ? 'United States (US)' : 'India (IN)'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Host Region</p>
                  <p className="text-sm text-slate-700 mt-0.5">{asset.exposure === 'Public' ? 'us' : 'ap-south-1'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Port</p>
                  <p className="text-sm text-slate-700 mt-0.5">443</p>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">First Found</p>
                  <p className="text-sm text-slate-700 mt-0.5">Jan 27, 2025 04:22 PM</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Last Found</p>
                  <p className="text-sm text-slate-700 mt-0.5">May 11, 2026 01:30 PM</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Last Scan</p>
                  <p className="text-sm text-slate-700 mt-0.5">Apr 06, 2026 02:29 PM</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-700">Auto Scan</p>
                <div className="flex items-center gap-3">
                  <IconToggle on={false} />
                  <button className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg">Apply</button>
                </div>
              </div>
            </div>
          )}
          {tab !== 'General' && (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
              {tab} — content available in full version
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Compliance ───────────────────────────────────────────────────────────────
function AurvaCompliance() {
  const { state } = useDemo()
  const { complianceScores } = state.world!
  const [selected, setSelected] = useState<ComplianceScore | null>(null)
  const [detailTab, setDetailTab] = useState<'Violations' | 'Linked Policies'>('Violations')

  // Extended framework list beyond what the store provides
  const EXTRA_FRAMEWORKS = [
    { framework: 'SEBI', score: 57, status: 'partial' as const },
    { framework: 'Payment Security Operations', score: 42, status: 'partial' as const },
    { framework: 'PCI DSS', score: 10, status: 'non-compliant' as const },
    { framework: 'ISO27001', score: 0, status: 'non-compliant' as const },
    { framework: 'CIS', score: 0, status: 'non-compliant' as const },
    { framework: 'NIST 800-171', score: 0, status: 'non-compliant' as const },
  ]

  const allFrameworks = [...complianceScores, ...EXTRA_FRAMEWORKS]

  // Controls for each framework
  function getControls(framework: string) {
    const base = framework.length * 3 + 10
    return {
      supported: base + 5,
      compliant: Math.floor(base * 0.7),
      checked: base + 2,
    }
  }

  // Control rows for detail view
  const CONTROLS = [
    { code: '5.6.3', name: 'Data Isolation and Commingling Control', description: 'The NBFC shall ensure that the data of the NBFC is stored in a secure manner and is not commingled with the data of other entities.', status: 'Compliant' },
    { code: '5.6.4', name: 'Data Retention Policy Enforcement', description: 'All data retention policies must be enforced with automatic deletion after the retention period.', status: 'Partial' },
    { code: '5.7.1', name: 'Access Control Review', description: 'Quarterly review of all access control lists and permissions.', status: 'Non-Compliant' },
  ]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: framework list */}
      <div className={`${selected ? 'w-80 flex-shrink-0 border-r border-slate-200 overflow-y-auto' : 'flex-1 overflow-y-auto'} p-4`}>
        {!selected && (
          <div className="flex items-center gap-3 mb-4">
            <input className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-400 placeholder-slate-400" placeholder="Search or Apply Filters..." readOnly />
            <div className="flex items-center gap-2 text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 gap-2">
              <span>All Departments</span>
              <span>▾</span>
            </div>
          </div>
        )}
        <div className={`${selected ? 'space-y-2' : 'grid grid-cols-3 gap-4'}`}>
          {allFrameworks.map((cs) => {
            const controls = getControls(cs.framework)
            const radius = 28
            const circ = 2 * Math.PI * radius
            const filled = circ * (cs.score / 100)
            const strokeColor = cs.score >= 80 ? '#10b981' : cs.score >= 50 ? '#f59e0b' : cs.score >= 10 ? '#ef4444' : '#e2e8f0'

            return (
              <div
                key={cs.framework}
                className={`bg-white border rounded-xl p-4 cursor-pointer shadow-sm transition hover:border-emerald-300 ${selected?.framework === cs.framework ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-slate-200'}`}
                onClick={() => setSelected(selected?.framework === cs.framework ? null : cs)}
              >
                <div className={`${selected ? 'flex items-center gap-3' : 'flex items-start justify-between'}`}>
                  <div className="flex items-center gap-2">
                    {/* Donut ring */}
                    <div className="relative flex-shrink-0">
                      <svg width={selected ? 40 : 70} height={selected ? 40 : 70} viewBox="0 0 70 70">
                        <circle cx="35" cy="35" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <circle
                          cx="35" cy="35" r={radius}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="8"
                          strokeDasharray={`${filled} ${circ - filled}`}
                          strokeLinecap="round"
                          transform="rotate(-90 35 35)"
                        />
                        <text x="35" y="38" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">{cs.score}%</text>
                      </svg>
                    </div>
                    {!selected && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">{cs.framework}</p>
                        <p className={`text-xs mt-0.5 ${cs.score >= 80 ? 'text-emerald-600' : cs.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                          {cs.score >= 80 ? 'Compliant' : cs.score >= 50 ? 'Partial' : 'Non-Compliant'}
                        </p>
                      </div>
                    )}
                  </div>
                  {selected && <p className="text-xs font-semibold text-slate-700 truncate">{cs.framework}</p>}
                  {!selected && (
                    <div className="text-right text-xs text-slate-500 space-y-0.5">
                      <p>Controls Supported <span className="font-bold text-slate-700">{controls.supported}</span></p>
                      <p>Compliant Controls <span className="font-bold text-slate-700">{controls.compliant}</span></p>
                      <p>Policies Checked <span className="font-bold text-slate-700">{controls.checked}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                ← Compliance / {selected.framework}
              </button>
            </div>
            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><IconX /></button>
          </div>

          {/* Control list */}
          <div className="space-y-2 mb-4">
            {CONTROLS.map(ctrl => (
              <div
                key={ctrl.code}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Control row */}
                <div className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-mono text-slate-500 w-12 flex-shrink-0">{ctrl.code}</span>
                  <span className={`text-xs font-semibold ${ctrl.status === 'Compliant' ? 'text-slate-800' : ctrl.status === 'Partial' ? 'text-amber-700' : 'text-red-700'}`}>{ctrl.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel for first control */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-800">{CONTROLS[0].code} — {CONTROLS[0].name}</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Description:</p>
                  <p className="text-xs text-slate-700 mt-0.5">{CONTROLS[0].description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Framework:</p>
                  <p className="text-xs text-slate-700 mt-0.5">{selected.framework}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status:</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                    <span className="text-xs text-emerald-700 font-semibold">Compliant</span>
                  </div>
                </div>
              </div>
              {/* Tabs */}
              <div className="border-b border-slate-200">
                <div className="flex gap-4">
                  {(['Violations', 'Linked Policies'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setDetailTab(t)}
                      className={`py-2 text-xs font-medium border-b-2 transition ${detailTab === t ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center py-12 text-slate-400 flex-col gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-500 text-xl">✓</span>
                </div>
                <p className="text-sm text-slate-500">No violations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Audit Trail ──────────────────────────────────────────────────────────────
function AurvaAudit() {
  const { state } = useDemo()
  const { auditTrail } = state.world!
  const [liveTab, setLiveTab] = useState<'live' | 'retrieved'>('live')

  const totalQ = 3500
  const humanQ = 3500
  const nonHumanQ = 0
  const aiAgentQ = 0
  const ddlQ = 2

  const chartPoints = [3200, 3300, 2800, 3500, 3100, 3400, 3200, 3500, 3300, 3500, 3200, 3500]

  const topAssets = [
    { name: 'dbusertent', queries: '1.1K', icon: '🗄️' },
    { name: 'aurva-sqlserver', queries: '330', icon: '🗄️' },
  ]

  const topAccessors = [
    { name: 'aurva', riskScore: 97, queries: '3.5K' },
  ]

  return (
    <div className="p-6 space-y-4">
      {/* Live / Retrieved tabs */}
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {(['live', 'retrieved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setLiveTab(t)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${liveTab === t ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t === 'live' ? 'Live' : 'Retrieved Logs'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-slate-500">Sensitive Data Only</span>
          <IconToggle on={true} />
        </div>
        <div className="text-xs text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5">
          May 04, 2026 10:18 PM — May 11, 2026 10:18 PM ▾
        </div>
        <div className="ml-auto text-xs text-slate-400">Last Updated: May 11, 2026 10:18 PM</div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">TOTAL QUERIES</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalQ.toLocaleString()}</p>
          <p className="text-xs text-emerald-500">+{Math.floor(totalQ * 0.08).toLocaleString()} from last period</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-blue-500 font-semibold tracking-wide">SPLIT BY ACCESSOR TYPE</p>
          <div className="flex gap-4 mt-1">
            <div>
              <p className="text-lg font-bold text-slate-800">{humanQ.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Human</p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-lg font-bold text-slate-800">{nonHumanQ}</p>
              <p className="text-xs text-slate-400">Non Human</p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-lg font-bold text-slate-800">{aiAgentQ}</p>
              <p className="text-xs text-slate-400">AI Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold tracking-wide">DDL/DML QUERIES</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{ddlQ}</p>
          <p className="text-xs text-red-500">+2 from last period</p>
        </div>
      </div>

      {/* Chart + right panels */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-600 mb-3">ACTIVITY TREND</p>
          <svg viewBox="0 0 400 80" className="w-full h-20">
            {[0, 20, 40, 60].map(y => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={chartPoints.map((v, i) => `${(i / (chartPoints.length - 1)) * 400},${70 - (v / 3700) * 60}`).join(' ')}
            />
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              points={chartPoints.map((v, i) => `${(i / (chartPoints.length - 1)) * 400},${70 - (1.5 / 5) * 60}`).join(' ')}
            />
            {chartPoints.map((v, i) => (
              <circle key={i} cx={(i / (chartPoints.length - 1)) * 400} cy={70 - (v / 3700) * 60} r="2.5" fill="#10b981" />
            ))}
          </svg>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> # of Active Users</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-400 inline-block" /> # of Queries</span>
          </div>
        </div>
        <div className="space-y-3">
          {/* Top asset */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 mb-2">TOP DATA ASSET QUERIED</p>
            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Data Assets</span><span>Queries</span></div>
            {topAssets.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{a.icon}</span>
                  <span className="text-xs text-slate-700">{a.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{a.queries}</span>
              </div>
            ))}
          </div>
          {/* Top accessors */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 mb-2">TOP ACCESSORS</p>
            <div className="flex gap-2 mb-2">
              <button className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Human</button>
              <button className="px-2.5 py-1 text-slate-500 text-xs font-medium rounded-full hover:bg-slate-100">Non-Human</button>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Human</span><span>Risk Score</span><span>Queries</span></div>
            {topAccessors.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="text-xs text-slate-700">{a.name}</span>
                <RiskCircle score={a.riskScore} />
                <span className="text-xs font-bold text-slate-700">{a.queries}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2">
        <div className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">Status ▾</div>
        <div className="flex-1">
          <input className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-64 outline-none focus:border-emerald-400 placeholder-slate-400" placeholder="Search & Filter" readOnly />
        </div>
        <div className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 ml-auto">Column (8/8) ▾</div>
      </div>

      {/* Audit table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Actor', 'Action', 'Asset', 'Risk Score', 'When'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditTrail.map((entry: AuditEntry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-2.5 font-mono text-emerald-600 text-xs">{entry.actor}</td>
                <td className="px-4 py-2.5 text-slate-600">{entry.action}</td>
                <td className="px-4 py-2.5 font-mono text-slate-500">{entry.asset}</td>
                <td className="px-4 py-2.5">
                  <RiskCircle score={entry.riskScore} />
                </td>
                <td className="px-4 py-2.5 text-slate-400">{new Date(entry.timestamp).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Applications ─────────────────────────────────────────────────────────────
function AurvaApps() {
  const { state } = useDemo()
  const { openRisks } = state.world!
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const APPS = [
    { name: 'ubuntu-deployment', cluster: 'gcp_asia-south1_aurva-gcp', risk: 89, dataAssets: 12, downApps: 4, upApps: 4, thirdParty: 3, sensitive: ['PHI', 'PCI', 'PII'], last: 'May 11, 2026' },
    { name: 'aurva-original-api-server', cluster: 'dataplane-uat-org/stage', risk: 52, dataAssets: 9, downApps: 4, upApps: 4, thirdParty: 1, sensitive: ['PHI', 'SPII'], last: 'May 11, 2026' },
    { name: 'monitoring-prometheus-node-exporter', cluster: 'dataplane-uat-org/stage', risk: 68, dataAssets: 2, downApps: 4, upApps: 4, thirdParty: 0, sensitive: ['PCI', 'PII', 'SPII'], last: 'May 11, 2026' },
    { name: 'aurva-original-application-controller', cluster: 'dataplane-uat-org/stage', risk: 76, dataAssets: 4, downApps: 4, upApps: 4, thirdParty: 6, sensitive: ['PHI', 'PCI', 'PII', 'SPII'], last: 'May 11, 2026' },
    { name: 'curl-kubernetes-http-manager', cluster: 'dataplane-uat-org/stage', risk: 45, dataAssets: 31, downApps: 4, upApps: 4, thirdParty: 0, sensitive: [], last: 'May 11, 2026' },
  ]

  return (
    <div className="p-6 space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'APPLICATIONS', value: '3K', color: 'text-slate-800' },
          { label: 'APPS ACCESSING SENSITIVE DATA', value: '196', color: 'text-slate-800' },
          { label: 'APPS MAKING THIRD-PARTY CALLS', value: '160', color: 'text-slate-800' },
          { label: 'RISKY APPLICATIONS', value: '328', color: 'text-red-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 font-semibold tracking-wide mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-72 outline-none focus:border-emerald-400 placeholder-slate-400" placeholder="Search or Apply Filters..." readOnly />

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Application', 'Risk', 'Data Assets', 'Downstream Apps', 'Upstream Apps', 'Third Party', 'Sensitive Data Detected', 'Last Seen'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {APPS.map(app => (
              <tr
                key={app.name}
                className="hover:bg-slate-50 cursor-pointer transition"
                onClick={() => setSelectedApp(selectedApp === app.name ? null : app.name)}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                      <IconApps />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-xs font-mono">{app.name}</p>
                      <p className="text-slate-400 text-xs">{app.cluster}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3"><RiskCircle score={app.risk} /></td>
                <td className="px-3 py-3 text-slate-600">{app.dataAssets}</td>
                <td className="px-3 py-3 text-slate-600">{app.downApps}</td>
                <td className="px-3 py-3 text-slate-600">{app.upApps}</td>
                <td className="px-3 py-3 text-slate-600">{app.thirdParty}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {app.sensitive.slice(0, 3).map(t => <TagPill key={t} tag={t} />)}
                    {app.sensitive.length > 3 && <span className="text-xs text-slate-400">+{app.sensitive.length - 3}</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-400">{app.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* App detail slide-over */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedApp(null)}>
          <div
            className="w-[60%] max-w-3xl h-full bg-white border-l border-slate-200 shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800 font-mono">{selectedApp}</p>
                <p className="text-xs text-slate-500">Account: dataplane-uat-org/stage · Region: asia-south1 · Last Accessed: May 11, 2026</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><IconX /></button>
            </div>

            {/* KEY INSIGHTS */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-3">KEY INSIGHTS</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: '🔴', label: 'Sensitive Data Accessed', desc: 'Use of all tools and features detected.' },
                  { icon: '🟠', label: 'AI Application Access', desc: 'Containerised application. Connected with via ssl.' },
                  { icon: '🟠', label: 'High Multi-Query Operations', desc: 'Traffic detected to domains with mtu.' },
                  { icon: '🟡', label: 'Active Security Alerts', desc: 'Risks associated with this application.' },
                ].map((ins, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{ins.icon}</span>
                      <div className="w-8 h-8 rounded-full border-2 border-orange-400 flex items-center justify-center text-xs font-bold text-orange-600">
                        {80 + i * 3}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{ins.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ins.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Topology diagram placeholder */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-600">Application Topology</p>
                <button className="text-xs text-emerald-600 hover:underline">View on Data Lineage ↗</button>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 h-48 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  {/* Mini topology */}
                  <div className="flex items-center gap-4">
                    {['postgres', 'mysql', 'redis', 'kafka'].map((db) => (
                      <div key={db} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-xs text-blue-600 font-mono">{db.slice(0, 2)}</div>
                        <span className="text-xs text-slate-400">{db}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-0.5 h-4 bg-slate-300" />
                  <div className="px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700">
                    {selectedApp.slice(0, 18)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Custom Policies ──────────────────────────────────────────────────────────
function AurvaPolicies() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)

  const POLICIES = [
    { id: 'p1', name: 'debug 17782437996A6A', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p2', name: 'debug 177824379068A88', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p3', name: 'blocks-multiple-86', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p4', name: 'aditya', type: 'Detection Rule', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'inactive' },
    { id: 'p5', name: 'test2220', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'inactive' },
    { id: 'p6', name: 'Query_Detects_Data_with_si', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p7', name: 'Masking_customer_in-order-table', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p8', name: 'waqtest', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p9', name: 'blueprints23', type: 'Detection Rule', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
    { id: 'p10', name: 'non-limit-9$-test$', type: 'Block Guardrail', category: 'DAM', alertRouting: '+', sendAlert: 'No', status: 'active' },
  ]

  const isOn = (id: string) => toggles[id] !== undefined ? toggles[id] : true

  const selPolicy = POLICIES.find(p => p.id === selectedPolicy)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <input className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-72 outline-none focus:border-emerald-400 placeholder-slate-400" placeholder="Search or Apply Filters..." readOnly />
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition">
          + Create New Policy
        </button>
      </div>

      <p className="text-xs text-slate-500">Showing 1-10 of 721 results</p>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-slate-300" readOnly /></th>
              {['Policy Name', 'Type', 'Category', 'Alert routing', 'Send Alert', 'Policy Controls'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {POLICIES.map(p => (
              <tr
                key={p.id}
                className={`hover:bg-slate-50 cursor-pointer transition ${selectedPolicy === p.id ? 'bg-emerald-50' : ''}`}
                onClick={() => setSelectedPolicy(selectedPolicy === p.id ? null : p.id)}
              >
                <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300" readOnly onClick={e => e.stopPropagation()} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-800 font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.type === 'Block Guardrail' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.type}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{p.category}</span>
                </td>
                <td className="px-3 py-3 text-slate-500">{p.alertRouting}</td>
                <td className="px-3 py-3">
                  {p.sendAlert === 'No' ? (
                    <span className="text-slate-400 text-xs">No</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-red-600 text-xs">{p.sendAlert}</span>
                    </div>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setToggles(t => ({ ...t, [p.id]: !isOn(p.id) }))}>
                      <IconToggle on={isOn(p.id)} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="text-slate-400 hover:text-red-500">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Policy detail slide-over */}
      {selPolicy && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedPolicy(null)}>
          <div
            className="w-[40%] max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">{selPolicy.name}</p>
              <div className="flex gap-2">
                <button className="text-xs text-emerald-600 font-medium hover:underline">✏ Edit</button>
                <button onClick={() => setSelectedPolicy(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><IconX /></button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">POLICY TYPE</p>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${selPolicy.type === 'Block Guardrail' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{selPolicy.type}</span>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">POLICY SEVERITY</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span className="text-slate-600">Terminate active policy violations</span>
                  </div>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">HIGH</span>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">DESCRIPTION</p>
                  <p className="text-slate-700 mt-1">debug</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">IMPACT</p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">debug</span>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">CONDITIONS</p>
                  <div className="mt-1 bg-slate-50 rounded-lg border border-slate-200 p-3 font-mono text-xs text-slate-700">
                    Block Query<br />
                    BY ACTOR<br />
                    <span className="text-slate-500">Where : DB User = aurva-177824366479</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">POLICY SCHEDULE</p>
                  <p className="text-slate-700 mt-1">Always Active</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">REMEDIATION</p>
                  <p className="text-slate-700 mt-1 text-xs">This query will be blocked when the policy conditions are met. This will prevent unauthorized data access or modifications.</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">OPEN RISK</p>
                  <p className="text-slate-700 mt-1">≥ 0</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">ALERT ROUTING</p>
                  <p className="text-slate-500 mt-1">No automation enabled</p>
                  <p className="text-emerald-600 mt-0.5 text-xs cursor-pointer hover:underline">⊕ Add automation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
