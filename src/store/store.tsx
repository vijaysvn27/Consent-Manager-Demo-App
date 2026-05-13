import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { DemoAppState, DemoAction, DemoEvent, FlowStage, JobStatus, PendingDeletionEntry } from './types'

const initialState: DemoAppState = {
  stage: 'am-setup',
  world: null,
  amInput: null,
  activePerspective: 'customer-app',
  viewMode: 'live',
  deviceFrame: 'mobile',
  cookieAccepted: false,
  isAuthenticated: false,
  consentGranted: false,
  selectedRevocationReqId: null,
  selectedDeletionReqId: null,
  activeCtTab: 'partial',
  ctSection: 'dashboard',
  pendingDeletions: [],
  eventLog: [],
  unreadNotifications: 0,
}

function reducer(state: DemoAppState, action: DemoAction): DemoAppState {
  switch (action.type) {
    case 'SET_AM_INPUT':
      return { ...state, amInput: action.payload }

    case 'SET_WORLD':
      return {
        ...state,
        world: action.payload,
        unreadNotifications: action.payload.notifications.filter(n => !n.read).length,
      }

    case 'SET_STAGE':
      return { ...state, stage: action.payload }

    case 'SET_PERSPECTIVE':
      return { ...state, activePerspective: action.payload }

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }

    case 'SET_DEVICE_FRAME':
      return { ...state, deviceFrame: action.payload }

    case 'ACCEPT_COOKIE':
      return { ...state, cookieAccepted: true }

    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: true }

    case 'GRANT_CONSENT':
      return { ...state, consentGranted: true, stage: 'app' }

    case 'SET_CT_SECTION':
      return { ...state, ctSection: action.payload }

    case 'SET_CT_TAB':
      return { ...state, activeCtTab: action.payload }

    case 'SELECT_REVOCATION_REQ':
      return { ...state, selectedRevocationReqId: action.payload }

    case 'SELECT_DELETION_REQ':
      return { ...state, selectedDeletionReqId: action.payload }

    case 'EMIT_EVENT': {
      const event = action.payload
      return { ...state, eventLog: [...state.eventLog, event] }
    }

    case 'PARTIAL_REVOKE': {
      if (!state.world) return state
      const { consentId, purposes } = action.payload
      const updatedConsents = state.world.consents.map(c => {
        if (c.id !== consentId) return c
        return {
          ...c,
          status: 'REVOKED' as const,
          activityTimeline: [
            ...c.activityTimeline,
            { timestamp: new Date().toISOString(), event: `Partial revocation: ${purposes.join(', ')}`, type: 'revoked' as const, actor: state.world!.customer.name },
          ],
        }
      })
      return { ...state, world: { ...state.world, consents: updatedConsents } }
    }

    case 'FULL_REVOKE': {
      if (!state.world) return state
      const updatedConsents = state.world.consents.map(c => ({
        ...c,
        status: 'REVOKED' as const,
        activityTimeline: [
          ...c.activityTimeline,
          { timestamp: new Date().toISOString(), event: 'Full revocation — all consent withdrawn', type: 'revoked' as const, actor: state.world!.customer.name },
        ],
      }))
      return { ...state, world: { ...state.world, consents: updatedConsents } }
    }

    case 'DELETION_JOB_UPDATE': {
      if (!state.world) return state
      const { jobId, status, failureReason } = action.payload
      const updatedJobs = state.world.deletionJobs.map(j => {
        if (j.id !== jobId) return j
        return {
          ...j,
          status,
          startedAt: status === 'IN_PROGRESS' ? new Date().toISOString() : j.startedAt,
          completedAt: status === 'COMPLETE' || status === 'FAILED' ? new Date().toISOString() : j.completedAt,
          failureReason,
        }
      })
      return { ...state, world: { ...state.world, deletionJobs: updatedJobs } }
    }

    case 'BREACH_DETECTED': {
      if (!state.world) return state
      // Dedup guard — skip if an open breach for this job already exists
      const existingBreach = state.world.breaches.find(
        b => b.linkedDeletionJobId === action.payload.linkedJobId && b.status === 'open'
      )
      if (existingBreach) return state
      const newBreach = {
        id: `breach-live-${Date.now()}`,
        detectedAt: new Date().toISOString(),
        severity: 'critical' as const,
        recordsAffected: Math.floor(Math.random() * 5000) + 100,
        description: `Data deletion job failure — ${state.world.customer.name}'s records not purged after consent withdrawal (§8 violation)`,
        status: 'open' as const,
        notified72h: false,
        linkedDeletionJobId: action.payload.linkedJobId,
      }
      const updatedStats = { ...state.world.dpoStats, breachesActive: state.world.dpoStats.breachesActive + 1 }
      return {
        ...state,
        world: {
          ...state.world,
          breaches: [...state.world.breaches, newBreach],
          dpoStats: updatedStats,
        },
      }
    }

    case 'ADD_NOMINEE': {
      if (!state.world) return state
      const { name, phone, relation } = action.payload
      return {
        ...state,
        world: {
          ...state.world,
          customer: { ...state.world.customer, nomineeName: name, nomineeRelation: relation, nomineeId: `NOM-${Date.now()}` },
        },
      }
    }

    case 'SUBMIT_GRIEVANCE': {
      if (!state.world) return state
      const submittedAt = new Date().toISOString()
      const deadline = new Date()
      deadline.setHours(deadline.getHours() + 48)
      const grievance = {
        id: `grievance-live-${Date.now()}`,
        submittedAt,
        type: action.payload.type,
        description: action.payload.description,
        status: 'open' as const,
        slaDeadline: deadline.toISOString(),
        slaStatus: 'within' as const,
      }
      const updatedStats = { ...state.world.dpoStats, grievancesOpen: state.world.dpoStats.grievancesOpen + 1 }
      return {
        ...state,
        world: {
          ...state.world,
          grievances: [...state.world.grievances, grievance],
          dpoStats: updatedStats,
        },
      }
    }

    case 'DPO_APPROVE': {
      if (!state.world) return state
      const notification = {
        id: `n-approve-${Date.now()}`,
        type: 'revocation_approved' as const,
        message: `DPO approved request ${action.payload.reqId}`,
        timestamp: new Date().toISOString(),
        read: false,
      }
      return {
        ...state,
        world: { ...state.world, notifications: [...state.world.notifications, notification] },
        unreadNotifications: state.unreadNotifications + 1,
      }
    }

    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, unreadNotifications: 0 }

    // Cross-perspective: Customer Portal dispatches this when user submits deletion request.
    // CT Manager > Consent Authorisation > Data Deletion tab reads state.pendingDeletions[].
    case 'QUEUE_DELETION_FROM_CUSTOMER': {
      const entry: PendingDeletionEntry = {
        id: `pdel-${Date.now()}`,
        customerName: action.payload.customerName,
        phone: action.payload.phone,
        dataPoints: action.payload.dataPoints,
        requestedAt: new Date().toISOString(),
        status: 'pending',
      }
      return { ...state, pendingDeletions: [...state.pendingDeletions, entry] }
    }

    default:
      return state
  }
}

interface DemoContextValue {
  state: DemoAppState
  dispatch: React.Dispatch<DemoAction>
  emitEvent: (event: Omit<DemoEvent, 'id' | 'timestamp'>) => void
  advanceStage: (stage: FlowStage) => void
  updateJobStatus: (jobId: string, status: JobStatus, failureReason?: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  function emitEvent(event: Omit<DemoEvent, 'id' | 'timestamp'>) {
    dispatch({
      type: 'EMIT_EVENT',
      payload: { ...event, id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString() },
    })
  }

  function advanceStage(stage: FlowStage) {
    dispatch({ type: 'SET_STAGE', payload: stage })
  }

  function updateJobStatus(jobId: string, status: JobStatus, failureReason?: string) {
    dispatch({ type: 'DELETION_JOB_UPDATE', payload: { jobId, status, failureReason } })
    if (status === 'FAILED') {
      dispatch({ type: 'BREACH_DETECTED', payload: { linkedJobId: jobId } })
      emitEvent({
        type: 'BREACH_DETECTED',
        actor: 'aurva',
        perspective: state.activePerspective,
        payload: { jobId, failureReason },
        dpdpSection: '§8',
      })
    }
  }

  return (
    <DemoContext.Provider value={{ state, dispatch, emitEvent, advanceStage, updateJobStatus }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
