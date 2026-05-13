import { useEffect, useMemo, useState } from 'react'
import { useDemo } from '../store/store'
import type { DemoEvent, DemoEventType } from '../store/types'

/**
 * Technical Mode — Live Data Flow Diagram
 *
 * Shows the Perfios DPDP architecture as a static SVG topology.
 * As events fire (eventLog grows), the corresponding edges animate.
 * Clicking an event in the bottom strip replays its animation and
 * shows the request/response payload in the side detail card.
 *
 * Reference: Architexture 3.webp (Perfios DPDP Suite) + Flow.webp (UML sequence)
 */

// ─── Topology coordinates (viewBox 1100 × 720) ────────────────────────────────

type NodeId =
  | 'data-principal'
  | 'df-app'
  | 'cm-bridge'
  | 'cm-saas'
  | 'aurva'
  | 'crm'
  | 'cbs'
  | 'lending'
  | 'marketing'
  | 'dp1'
  | 'dp2'
  | 'dp3'

interface Node {
  id: NodeId
  label: string
  sub?: string
  x: number
  y: number
  w: number
  h: number
  variant: 'principal' | 'fiduciary' | 'bridge' | 'saas' | 'dspm' | 'system' | 'processor'
}

const NODES: Node[] = [
  { id: 'data-principal', label: 'Data Principal', sub: 'web / mobile', x: 40, y: 60, w: 160, h: 60, variant: 'principal' },
  { id: 'df-app', label: 'Data Fiduciary App', sub: '{company}', x: 40, y: 180, w: 160, h: 60, variant: 'fiduciary' },
  { id: 'cm-bridge', label: 'Perfios CM Bridge', sub: 'on-premise · Admin Portal', x: 320, y: 180, w: 280, h: 220, variant: 'bridge' },
  { id: 'cm-saas', label: 'Perfios Consent Manager', sub: 'SaaS · Engine · Audit · Sync', x: 700, y: 60, w: 340, h: 200, variant: 'saas' },
  { id: 'aurva', label: 'Aurva DSPM', sub: 'Discovery · DAM · Lineage', x: 700, y: 320, w: 340, h: 90, variant: 'dspm' },
  { id: 'crm', label: 'CRM', x: 320, y: 480, w: 100, h: 50, variant: 'system' },
  { id: 'cbs', label: 'CBS', x: 440, y: 480, w: 100, h: 50, variant: 'system' },
  { id: 'lending', label: 'Lending', x: 560, y: 480, w: 100, h: 50, variant: 'system' },
  { id: 'marketing', label: 'Marketing', x: 680, y: 480, w: 100, h: 50, variant: 'system' },
  { id: 'dp1', label: 'Data Processor 1', x: 320, y: 620, w: 140, h: 50, variant: 'processor' },
  { id: 'dp2', label: 'Data Processor 2', x: 490, y: 620, w: 140, h: 50, variant: 'processor' },
  { id: 'dp3', label: 'Data Processor 3', x: 660, y: 620, w: 140, h: 50, variant: 'processor' },
]

const NODE_BY_ID: Record<NodeId, Node> = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
  NodeId,
  Node
>

// ─── Edges (with per-edge event mapping) ──────────────────────────────────────

interface EdgeDef {
  id: string
  from: NodeId
  to: NodeId
  label?: string         // shown by default in muted gray
  encrypted?: boolean    // shows KMS/TLS badge mid-edge
  curve?: 'auto' | 'horizontal' | 'vertical'
  events: DemoEventType[]
}

const EDGES: EdgeDef[] = [
  { id: 'dp-app', from: 'data-principal', to: 'df-app', label: 'HTTPS · TLS', encrypted: true,
    events: ['COOKIE_ACCEPT', 'COOKIE_DECLINE_ESSENTIAL', 'LOGIN_INITIATED', 'OTP_VERIFIED'] },

  { id: 'app-saas', from: 'df-app', to: 'cm-saas', label: 'POST /consent/initiate', encrypted: true,
    events: ['CONSENT_GRANTED'] },

  { id: 'saas-bridge', from: 'cm-saas', to: 'cm-bridge', label: 'real-time sync · KMS', encrypted: true,
    events: ['CONSENT_GRANTED', 'NOMINEE_ADDED', 'EXPIRY_RENEWED'] },

  { id: 'app-bridge', from: 'df-app', to: 'cm-bridge', label: 'consent-bridge API',
    events: ['CONSENT_PARTIAL_REVOKE', 'CONSENT_FULL_REVOKE', 'DELETION_REQUESTED', 'GRIEVANCE_SUBMITTED'] },

  { id: 'bridge-crm', from: 'cm-bridge', to: 'crm', label: 'fan-out',
    events: ['FANOUT_DISPATCHED', 'DELETION_JOB_STARTED', 'DELETION_JOB_COMPLETE'] },
  { id: 'bridge-cbs', from: 'cm-bridge', to: 'cbs',
    events: ['FANOUT_DISPATCHED', 'DELETION_JOB_STARTED', 'DELETION_JOB_COMPLETE'] },
  { id: 'bridge-lending', from: 'cm-bridge', to: 'lending',
    events: ['FANOUT_DISPATCHED', 'DELETION_JOB_STARTED'] },
  { id: 'bridge-mkt', from: 'cm-bridge', to: 'marketing', label: 'fan-out',
    events: ['FANOUT_DISPATCHED', 'FANOUT_BLOCKED', 'DELETION_JOB_FAILED'] },

  { id: 'mkt-dp2', from: 'marketing', to: 'dp2', events: ['FANOUT_BLOCKED'] },
  { id: 'crm-dp1', from: 'crm', to: 'dp1', events: ['DELETION_JOB_COMPLETE'] },
  { id: 'lending-dp3', from: 'lending', to: 'dp3', events: ['DELETION_JOB_STARTED'] },

  { id: 'aurva-bridge', from: 'aurva', to: 'cm-bridge', label: 'breach signal · §8(5)',
    events: ['BREACH_DETECTED', 'BREACH_NOTIFIED'] },

  { id: 'bridge-aurva', from: 'cm-bridge', to: 'aurva', label: 'DSPM scan',
    events: ['DPO_APPROVED', 'DPO_REJECTED', 'GRIEVANCE_RESOLVED', 'GUARDIAN_REQUIRED', 'GUARDIAN_VERIFIED', 'ADDON_REQUESTED'] },
]

const EDGES_BY_EVENT: Map<DemoEventType, string[]> = (() => {
  const map = new Map<DemoEventType, string[]>()
  for (const e of EDGES) {
    for (const evt of e.events) {
      const arr = map.get(evt) ?? []
      arr.push(e.id)
      map.set(evt, arr)
    }
  }
  return map
})()

// ─── API call display helper (re-used in side detail card) ────────────────────

function buildAPIDisplay(event: DemoEvent, customerName: string, companyShort: string) {
  const endpoint = event.payload.endpoint as string | undefined

  const defaultEndpoint =
    {
      CONSENT_GRANTED: { method: 'POST', path: '/consent-bridge/grant', status: 201 },
      CONSENT_PARTIAL_REVOKE: { method: 'POST', path: '/consent-bridge/revoke', status: 200 },
      CONSENT_FULL_REVOKE: { method: 'POST', path: '/consent-bridge/revoke/all', status: 200 },
      DELETION_REQUESTED: { method: 'POST', path: '/consent-bridge/deletion/request', status: 202 },
      DELETION_JOB_STARTED: { method: 'PUT', path: endpoint ?? '/deletion-jobs/start', status: 200 },
      DELETION_JOB_COMPLETE: { method: 'PUT', path: endpoint ?? '/deletion-jobs/complete', status: 200 },
      DELETION_JOB_FAILED: { method: 'PUT', path: endpoint ?? '/deletion-jobs/fail', status: 500 },
      FANOUT_DISPATCHED: { method: 'POST', path: endpoint ?? '/webhook', status: 200 },
      FANOUT_BLOCKED: { method: 'GET', path: '/consent-bridge/check', status: 200 },
      BREACH_DETECTED: { method: 'POST', path: '/aurva/breach/notify', status: 201 },
      BREACH_NOTIFIED: { method: 'POST', path: '/dpb/breach/file', status: 201 },
      OTP_VERIFIED: { method: 'POST', path: '/auth/otp/verify', status: 200 },
      LOGIN_INITIATED: { method: 'POST', path: '/auth/login', status: 200 },
      COOKIE_ACCEPT: { method: 'POST', path: '/cookies/accept', status: 200 },
      COOKIE_DECLINE_ESSENTIAL: { method: 'POST', path: '/cookies/essential-only', status: 200 },
      GRIEVANCE_SUBMITTED: { method: 'POST', path: '/grievance/submit', status: 201 },
      GRIEVANCE_RESOLVED: { method: 'PUT', path: '/grievance/resolve', status: 200 },
      NOMINEE_ADDED: { method: 'POST', path: '/consent-bridge/nominee', status: 201 },
      GUARDIAN_REQUIRED: { method: 'POST', path: '/guardian/notify', status: 202 },
      GUARDIAN_VERIFIED: { method: 'POST', path: '/guardian/verify', status: 200 },
      ADDON_REQUESTED: { method: 'POST', path: '/consent/addon', status: 201 },
      EXPIRY_RENEWED: { method: 'PUT', path: '/consent/renew', status: 200 },
      DPO_APPROVED: { method: 'POST', path: '/dpo/approve', status: 200 },
      DPO_REJECTED: { method: 'POST', path: '/dpo/reject', status: 200 },
    }[event.type] ?? { method: 'POST', path: '/consent-bridge/event', status: 200 }

  const requestBody = {
    data_principal: customerName,
    consent_id: `01${(event.id || '').slice(-24).padEnd(24, '0')}`,
    purpose: event.payload.purpose ?? null,
    company: companyShort,
    timestamp: event.timestamp,
    dpdp_section: event.dpdpSection ?? null,
  }

  const responseBody =
    defaultEndpoint.status < 400
      ? {
          status: 'success',
          consent_id: requestBody.consent_id,
          processed_at: event.timestamp,
        }
      : {
          status: 'error',
          code: 'DELETION_TIMEOUT',
          message: 'Record locked by active session — deletion deferred',
          breach_notification_triggered: true,
        }

  return {
    ...defaultEndpoint,
    requestBody,
    responseBody,
    latencyMs: Math.floor(Math.random() * 80) + 20,
  }
}

// ─── Visual variants ──────────────────────────────────────────────────────────

const VARIANT_STYLE: Record<Node['variant'], { fill: string; stroke: string; text: string }> = {
  principal:  { fill: '#eef2ff', stroke: '#6366f1', text: '#3730a3' },
  fiduciary:  { fill: '#fef3c7', stroke: '#d97706', text: '#92400e' },
  bridge:     { fill: '#eff6ff', stroke: '#2563eb', text: '#1e40af' },
  saas:       { fill: '#f0f9ff', stroke: '#0284c7', text: '#075985' },
  dspm:       { fill: '#ecfdf5', stroke: '#10b981', text: '#065f46' },
  system:     { fill: '#f1f5f9', stroke: '#64748b', text: '#334155' },
  processor:  { fill: '#fafaf9', stroke: '#a1a1aa', text: '#52525b' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeAnchor(n: Node, side: 'top' | 'bottom' | 'left' | 'right') {
  switch (side) {
    case 'top':    return { x: n.x + n.w / 2, y: n.y }
    case 'bottom': return { x: n.x + n.w / 2, y: n.y + n.h }
    case 'left':   return { x: n.x,           y: n.y + n.h / 2 }
    case 'right':  return { x: n.x + n.w,     y: n.y + n.h / 2 }
  }
}

function edgePath(edge: EdgeDef): { d: string; mid: { x: number; y: number } } {
  const from = NODE_BY_ID[edge.from]
  const to = NODE_BY_ID[edge.to]

  // Pick anchors based on relative position
  let fromSide: 'top' | 'bottom' | 'left' | 'right'
  let toSide: 'top' | 'bottom' | 'left' | 'right'

  const dx = to.x + to.w / 2 - (from.x + from.w / 2)
  const dy = to.y + to.h / 2 - (from.y + from.h / 2)

  if (Math.abs(dx) > Math.abs(dy)) {
    fromSide = dx > 0 ? 'right' : 'left'
    toSide = dx > 0 ? 'left' : 'right'
  } else {
    fromSide = dy > 0 ? 'bottom' : 'top'
    toSide = dy > 0 ? 'top' : 'bottom'
  }

  const a = nodeAnchor(from, fromSide)
  const b = nodeAnchor(to, toSide)

  // Bezier curve with control points offset
  const c1x = fromSide === 'right' || fromSide === 'left' ? (a.x + b.x) / 2 : a.x
  const c1y = fromSide === 'top' || fromSide === 'bottom' ? (a.y + b.y) / 2 : a.y
  const c2x = toSide === 'right' || toSide === 'left' ? (a.x + b.x) / 2 : b.x
  const c2y = toSide === 'top' || toSide === 'bottom' ? (a.y + b.y) / 2 : b.y

  const d = `M ${a.x},${a.y} C ${c1x},${c1y} ${c2x},${c2y} ${b.x},${b.y}`
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }

  return { d, mid }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechnicalPanel() {
  const { state } = useDemo()
  const { eventLog, world } = state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [activeEdgeIds, setActiveEdgeIds] = useState<Set<string>>(new Set())

  // Auto-select latest event when new ones arrive
  useEffect(() => {
    if (eventLog.length === 0) return
    const latest = eventLog[eventLog.length - 1]
    setSelectedEventId(latest.id)

    // Highlight edges associated with this event for 4 seconds
    const edgeIds = EDGES_BY_EVENT.get(latest.type) ?? []
    setActiveEdgeIds(new Set(edgeIds))
    const timeout = setTimeout(() => setActiveEdgeIds(new Set()), 4000)
    return () => clearTimeout(timeout)
  }, [eventLog.length])

  const selectedEvent = useMemo(
    () => eventLog.find((e) => e.id === selectedEventId) ?? null,
    [eventLog, selectedEventId],
  )

  function replayEvent(event: DemoEvent) {
    setSelectedEventId(event.id)
    const edgeIds = EDGES_BY_EVENT.get(event.type) ?? []
    setActiveEdgeIds(new Set(edgeIds))
    setTimeout(() => setActiveEdgeIds(new Set()), 3000)
  }

  if (!world) return null

  return (
    <div className="bg-white h-full flex flex-col border-l border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <p className="text-slate-900 text-sm font-semibold">Technical Mode</p>
          <p className="text-slate-500 text-xs">Live data flow · {eventLog.length} events</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span>live</span>
        </div>
      </div>

      {/* Topology SVG */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white">
        <svg viewBox="0 0 1100 720" className="w-full min-h-[480px]" preserveAspectRatio="xMidYMid meet">
          {/* Arrowhead marker (default + active) */}
          <defs>
            <marker id="arrow-default" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0,0 L 10,5 L 0,10 Z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path d="M 0,0 L 10,5 L 0,10 Z" fill="#1e4d8c" />
            </marker>
          </defs>

          {/* Edges (rendered first so nodes overlap them) */}
          {EDGES.map((edge) => {
            const { d, mid } = edgePath(edge)
            const isActive = activeEdgeIds.has(edge.id)
            return (
              <g key={edge.id} className={isActive ? 'opacity-100' : 'opacity-80'}>
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? '#1e4d8c' : '#cbd5e1'}
                  strokeWidth={isActive ? 2.5 : 1.25}
                  strokeDasharray={isActive ? '0' : '4 3'}
                  markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                />
                {edge.label && (
                  <text
                    x={mid.x}
                    y={mid.y - 6}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill={isActive ? '#1e4d8c' : '#94a3b8'}
                    fontWeight={isActive ? 600 : 400}
                  >
                    {edge.label}
                  </text>
                )}
                {edge.encrypted && (
                  <g transform={`translate(${mid.x + 28}, ${mid.y - 14})`}>
                    <rect width="38" height="14" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
                    <text x="19" y="10" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="600">🔒 KMS</text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const style = VARIANT_STYLE[node.variant]
            const label = (node.sub ?? '').replace('{company}', world.company.shortName)
            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="6"
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="1.25"
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + (node.sub ? 22 : node.h / 2 + 4)}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={style.text}
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + 38}
                    textAnchor="middle"
                    fontSize="10"
                    fill={style.text}
                    opacity="0.75"
                  >
                    {label}
                  </text>
                )}
                {/* DBs inside CM SaaS box */}
                {node.id === 'cm-saas' && (
                  <g transform={`translate(${node.x + 30}, ${node.y + 110})`}>
                    {[
                      { l: 'MySQL', x: 0, c: '#0284c7' },
                      { l: 'MongoDB', x: 85, c: '#10b981' },
                      { l: 'Redis', x: 175, c: '#dc2626' },
                    ].map((db) => (
                      <g key={db.l} transform={`translate(${db.x}, 0)`}>
                        <ellipse cx="35" cy="8" rx="35" ry="6" fill="white" stroke={db.c} strokeWidth="1" />
                        <rect x="0" y="8" width="70" height="36" fill="white" stroke={db.c} strokeWidth="1" />
                        <ellipse cx="35" cy="44" rx="35" ry="6" fill="white" stroke={db.c} strokeWidth="1" />
                        <text x="35" y="30" textAnchor="middle" fontSize="10" fontWeight="600" fill={db.c}>{db.l}</text>
                      </g>
                    ))}
                  </g>
                )}
                {/* Admin Portal nav inside CM Bridge */}
                {node.id === 'cm-bridge' && (
                  <g transform={`translate(${node.x + 16}, ${node.y + 70})`}>
                    {['DPO Dashboard', 'Consents Dashboard', 'Consent Authorisation', 'Grievance Mgmt', 'Breach Mgmt', 'Templates · Vendors'].map((label, i) => (
                      <text key={label} x="0" y={i * 18} fontSize="10" fill="#1e40af" opacity="0.85">
                        • {label}
                      </text>
                    ))}
                  </g>
                )}
              </g>
            )
          })}

          {/* Section labels */}
          <text x="40" y="40" fontSize="11" fontWeight="600" fill="#94a3b8" letterSpacing="1">CUSTOMER</text>
          <text x="320" y="40" fontSize="11" fontWeight="600" fill="#94a3b8" letterSpacing="1">DATA FIDUCIARY · ON-PREMISE</text>
          <text x="700" y="40" fontSize="11" fontWeight="600" fill="#94a3b8" letterSpacing="1">PERFIOS SAAS · CLOUD</text>
          <text x="320" y="460" fontSize="11" fontWeight="600" fill="#94a3b8" letterSpacing="1">CORE BUSINESS UNITS</text>
          <text x="320" y="600" fontSize="11" fontWeight="600" fill="#94a3b8" letterSpacing="1">DATA PROCESSORS</text>
        </svg>
      </div>

      {/* Bottom event-log strip (last 6) */}
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Recent events · click to replay
        </p>
        {eventLog.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No events yet</p>
        ) : (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[...eventLog].slice(-6).reverse().map((event) => {
              const api = buildAPIDisplay(event, world.customer.name, world.company.shortName)
              const isSelected = event.id === selectedEventId
              const isError = api.status >= 400
              return (
                <button
                  key={event.id}
                  onClick={() => replayEvent(event)}
                  className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-mono border transition ${
                    isSelected
                      ? 'bg-perfios-700 text-white border-perfios-700'
                      : isError
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold">{api.method}</span>
                  <span className="opacity-70 ml-1">{api.path.slice(0, 22)}</span>
                  <span className="ml-1 font-bold">{api.status}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected event detail */}
      {selectedEvent && (
        <div className="border-t border-slate-200 bg-white px-3 py-2.5 max-h-64 overflow-y-auto flex-shrink-0">
          {(() => {
            const api = buildAPIDisplay(selectedEvent, world.customer.name, world.company.shortName)
            const isError = api.status >= 400
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      api.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                      api.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                      api.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                      api.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {api.method}
                  </span>
                  <span className="font-mono text-xs text-slate-700 flex-1 truncate">{api.path}</span>
                  <span className={`font-mono text-xs font-bold ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
                    {api.status}
                  </span>
                  <span className="text-xs text-slate-400">{api.latencyMs}ms</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {selectedEvent.type}
                  </span>
                  {selectedEvent.dpdpSection && (
                    <span className="text-[10px] bg-perfios-50 text-perfios-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      {selectedEvent.dpdpSection}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-mono mb-0.5">REQUEST</p>
                  <pre className="text-[10px] font-mono text-slate-700 bg-slate-50 rounded p-2 overflow-x-auto">
                    {JSON.stringify(api.requestBody, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-mono mb-0.5">RESPONSE</p>
                  <pre
                    className={`text-[10px] font-mono rounded p-2 overflow-x-auto ${
                      isError ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'
                    }`}
                  >
                    {JSON.stringify(api.responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
