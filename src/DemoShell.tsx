import { useDemo } from './store/store'
import CustomerApp from './perspectives/CustomerApp'
import CustomerPortal from './perspectives/CustomerPortal'
import CTManager from './perspectives/CTManager'
import AurvaView from './perspectives/Aurva'
import DAMView from './perspectives/DAM'
import DeviceFrame from './shared/DeviceFrame'
import StoryPanel from './modes/StoryPanel'
import TechnicalPanel from './modes/TechnicalPanel'
import type { Perspective, ViewMode, DeviceFrame as DeviceFrameType } from './store/types'

const PERSPECTIVES: { id: Perspective; label: string; shortLabel: string; device: DeviceFrameType }[] = [
  { id: 'customer-app',    label: 'Customer App',    shortLabel: 'App',    device: 'mobile' },
  { id: 'customer-portal', label: 'Customer Portal', shortLabel: 'Portal', device: 'tablet' },
  { id: 'ct-manager',      label: 'CT Manager (DPO)',shortLabel: 'DPO',    device: 'desktop' },
  { id: 'aurva',           label: 'Aurva (DSPM)',    shortLabel: 'DSPM',   device: 'desktop' },
  { id: 'dam',             label: 'DAM',             shortLabel: 'DAM',    device: 'desktop' },
]

const MODES: { id: ViewMode; label: string; description: string }[] = [
  { id: 'live', label: 'Live', description: 'Full interaction' },
  { id: 'story', label: 'Story', description: 'Auto-narration' },
  { id: 'technical', label: 'Technical', description: 'API + UML' },
]

export default function DemoShell() {
  const { state, dispatch } = useDemo()
  const { activePerspective, viewMode, deviceFrame, world } = state
  if (!world) return null

  const activePerspectiveDef = PERSPECTIVES.find(p => p.id === activePerspective)!

  function switchPerspective(id: Perspective) {
    const def = PERSPECTIVES.find(p => p.id === id)!
    dispatch({ type: 'SET_PERSPECTIVE', payload: id })
    dispatch({ type: 'SET_DEVICE_FRAME', payload: def.device })
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      dispatch({ type: 'SET_DEVICE_FRAME', payload: 'fullscreen' })
    } else {
      document.exitFullscreen().catch(() => {})
      dispatch({ type: 'SET_DEVICE_FRAME', payload: activePerspectiveDef.device })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Top bar */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-2 flex items-center gap-4">
        {/* Perfios brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white/60 text-xs font-medium hidden sm:block">DPDP Masterclass</span>
        </div>

        {/* Company name pill */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
          <div className="w-4 h-4 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: world.company.primaryColor }}>
            {world.company.logoInitials.charAt(0)}
          </div>
          <span className="text-white/80 text-xs font-medium">{world.company.name}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/50 text-xs">{world.customer.name}</span>
        </div>

        <div className="flex-1" />

        {/* View mode switcher */}
        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode.id })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${viewMode === mode.id ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-1.5 text-white/40 hover:text-white/80 transition rounded-md hover:bg-white/5"
          title="Fullscreen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'SET_STAGE', payload: 'am-setup' })}
          className="p-1.5 text-white/40 hover:text-red-400 transition rounded-md hover:bg-white/5"
          title="Reset demo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Perspective tabs */}
      <div className="bg-slate-900 border-b border-white/10 px-4 flex items-center gap-1 py-1.5">
        {PERSPECTIVES.map(p => (
          <button
            key={p.id}
            onClick={() => switchPerspective(p.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activePerspective === p.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {p.shortLabel}
            <span className={`text-xs px-1 py-0 rounded ${
              activePerspective === p.id ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'
            }`}>
              {p.device === 'mobile' ? '📱' : p.device === 'tablet' ? '📋' : '🖥'}
            </span>
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Perspective viewport */}
        <div className={`flex-1 flex items-center justify-center overflow-hidden transition-all ${viewMode !== 'live' ? 'flex-shrink' : ''}`}>
          <DeviceFrame
            device={deviceFrame === 'fullscreen' ? 'fullscreen' : activePerspectiveDef.device}
            primaryColor={world.company.primaryColor}
          >
            {/* All perspectives always mounted — CSS show/hide only */}
            <div style={{ display: activePerspective === 'customer-app' ? 'flex' : 'none', height: '100%', flexDirection: 'column' }}>
              <CustomerApp />
            </div>
            <div style={{ display: activePerspective === 'customer-portal' ? 'flex' : 'none', height: '100%', flexDirection: 'column' }}>
              <CustomerPortal />
            </div>
            <div style={{ display: activePerspective === 'ct-manager' ? 'flex' : 'none', height: '100%', flexDirection: 'column' }}>
              <CTManager />
            </div>
            <div style={{ display: activePerspective === 'aurva' ? 'flex' : 'none', height: '100%', flexDirection: 'column' }}>
              <AurvaView />
            </div>
            <div style={{ display: activePerspective === 'dam' ? 'flex' : 'none', height: '100%', flexDirection: 'column' }}>
              <DAMView />
            </div>
          </DeviceFrame>
        </div>

        {/* Story / Technical side panel */}
        {viewMode === 'story' && (
          <div className="w-80 border-l border-white/10 overflow-y-auto flex-shrink-0">
            <StoryPanel />
          </div>
        )}
        {viewMode === 'technical' && (
          <div className="w-96 border-l border-white/10 overflow-y-auto flex-shrink-0">
            <TechnicalPanel />
          </div>
        )}
      </div>
    </div>
  )
}
