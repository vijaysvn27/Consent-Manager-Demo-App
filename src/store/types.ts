// ─── Core DPDP legal taxonomy ────────────────────────────────────────────────

export type DPDPSection =
  | '§5'   // Lawful processing / specified purpose
  | '§6'   // Notice & consent requirements
  | '§7'   // Legitimate uses (employment, state, legal obligation)
  | '§8'   // Obligations of Data Fiduciary (retention, accuracy, security)
  | '§9'   // Children & persons with disabilities (guardian/verifiable consent)
  | '§11'  // Right to access information
  | '§12'  // Right to correction, erasure, withdrawal
  | '§13'  // Right to grievance redress (48h SLA)
  | '§14'  // Right of nominee
  | '§16'  // Restriction on transfer outside India

export interface DPDPTag {
  section: DPDPSection
  label: string
  penalty?: string       // e.g. "₹250 Crore"
  explanation: string    // plain-English 1-liner for Story Mode
}

// ─── Industry & company types ─────────────────────────────────────────────────

export type Industry =
  | 'telecom'
  | 'banking'
  | 'insurance'
  | 'microfinance'
  | 'hr'

export type JourneyType =
  | 'self'
  | 'assisted'
  | 'guardian-minor'
  | 'guardian-disabled'
  | 'assisted-senior'

export type ConsentStatus = 'ACTIVE' | 'REVOKED' | 'PENDING' | 'EXPIRED' | 'MODIFICATION_REQUESTED'

export type JobStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETE' | 'FAILED'

// ─── Generated world types ────────────────────────────────────────────────────

export interface CompanyProfile {
  name: string              // "Vodafone India"
  shortName: string         // "Vodafone"
  industry: Industry
  primaryColor: string      // hex
  secondaryColor: string    // hex
  logoInitials: string      // "VI"
  tagline: string
  products: Product[]
  systems: SystemNode[]     // e.g. V-Finance, V-Marketing, V-CRM
  dpoName: string
  dpoEmail: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: string             // "₹299/month"
  category: string
}

export interface SystemNode {
  id: string
  name: string              // "V-Marketing"
  type: 'crm' | 'marketing' | 'finance' | 'analytics' | 'hrms' | 'los' | 'core_banking'
  endpoint: string          // "/v-marketing/webhook"
}

export interface CustomerProfile {
  name: string              // FROM OTP SCREEN — drives all display
  phone: string             // FROM OTP SCREEN
  email: string             // generated from name
  consentId: string         // ULID format
  age: number
  journeyType: JourneyType
  isMinor: boolean          // derived: journeyType === 'guardian-minor'
  guardianName?: string
  guardianPhone?: string
  nomineeId?: string
  nomineeName?: string
  nomineeRelation?: string
}

export interface DataPoint {
  id: string
  label: string             // "Full Name"
  category: string          // "Identity"
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
  required: boolean
  dpdpTag: DPDPSection
}

export interface Vendor {
  id: string
  name: string              // "CIBIL", "HubSpot", "Perfios"
  country: string
  purpose: string
  crossBorder: boolean
  logoInitials: string
}

export interface ConsentRecord {
  id: string
  requestId: string         // "REQ-007994"
  purpose: string
  purposeCode: string
  dataPoints: DataPoint[]
  status: ConsentStatus
  grantedAt: string         // ISO date string
  expiryDate: string        // "31 Dec 2026"
  expiryDaysRemaining: number
  legalBasis: DPDPSection
  vendors: string[]         // vendor IDs
  consentType: 'direct' | 'agent-assisted' | 'guardian' | 'employee'
  agentId?: string
  guardianName?: string
  activityTimeline: TimelineEntry[]
}

export interface TimelineEntry {
  timestamp: string
  event: string
  type: 'granted' | 'revoked' | 'requested' | 'updated' | 'expired' | 'breach'
  actor: string
}

export interface DPOStats {
  active: number
  pending: number
  modification: number
  withdrawal: number
  compliant: number
  nonCompliant: number
  grievancesOpen: number
  breachesActive: number
}

export interface DataAsset {
  id: string
  name: string              // "aadhaarbucket" → company variant
  riskScore: number         // 0-100
  exposure: 'Public' | 'Internal' | 'Restricted' | 'Confidential'
  cloudProvider: string
  sizeGB: number
  dataSensitivity: 'Low' | 'Medium' | 'High' | 'Critical'
  tags: ('PII' | 'PCI' | 'PHI' | 'SPII')[]
  issues: string[]
}

export interface ComplianceScore {
  framework: string         // "RBI", "SEBI", "ISO 27001"
  score: number             // 0-100
  status: 'compliant' | 'partial' | 'non-compliant'
}

export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  asset: string
  riskScore: number
  customer?: string
}

export interface BreachRecord {
  id: string
  detectedAt: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  recordsAffected: number
  description: string
  status: 'open' | 'investigating' | 'contained' | 'notified'
  notified72h: boolean
  linkedDeletionJobId?: string
}

export interface GrievanceRecord {
  id: string
  submittedAt: string
  type: 'data_misuse' | 'breach' | 'non_deletion' | 'access_denied' | 'other'
  description: string
  status: 'open' | 'in_review' | 'resolved' | 'escalated'
  slaDeadline: string       // 48hrs from submission
  slaStatus: 'within' | 'breached'
  assignedDPO?: string
}

export interface DeletionJob {
  id: string
  requestId: string         // links to ConsentRecord requestId
  layer: 'db' | 'marketing' | 'app'
  systemName: string        // "DB1 — Customer Records", "marketing-service-2"
  status: JobStatus
  startedAt?: string
  completedAt?: string
  failureReason?: string
}

export interface Notification {
  id: string
  type: 'expiry_warning' | 'revocation_approved' | 'deletion_complete' | 'breach_alert' | 'grievance_update' | 'new_purpose'
  message: string
  timestamp: string
  read: boolean
  linkedConsentId?: string
}

// ─── The complete generated world ─────────────────────────────────────────────

export interface DemoWorld {
  company: CompanyProfile
  customer: CustomerProfile
  consents: ConsentRecord[]
  vendors: Vendor[]
  dpoStats: DPOStats
  dataAssets: DataAsset[]
  complianceScores: ComplianceScore[]
  auditTrail: AuditEntry[]
  breaches: BreachRecord[]
  grievances: GrievanceRecord[]
  deletionJobs: DeletionJob[]
  notifications: Notification[]
  openRisks: { total: number; dam: number; dataPrivacy: number; dspm: number }
}

// ─── Demo events (drives Story Mode & Technical Mode) ─────────────────────────

export type DemoEventType =
  | 'COOKIE_ACCEPT'
  | 'COOKIE_DECLINE_ESSENTIAL'
  | 'LOGIN_INITIATED'
  | 'OTP_VERIFIED'
  | 'CONSENT_GRANTED'
  | 'CONSENT_PARTIAL_REVOKE'
  | 'CONSENT_FULL_REVOKE'
  | 'DELETION_REQUESTED'
  | 'DELETION_JOB_STARTED'
  | 'DELETION_JOB_COMPLETE'
  | 'DELETION_JOB_FAILED'
  | 'BREACH_DETECTED'
  | 'BREACH_NOTIFIED'
  | 'GUARDIAN_REQUIRED'
  | 'GUARDIAN_VERIFIED'
  | 'NOMINEE_ADDED'
  | 'GRIEVANCE_SUBMITTED'
  | 'GRIEVANCE_RESOLVED'
  | 'ADDON_REQUESTED'
  | 'EXPIRY_RENEWED'
  | 'FANOUT_DISPATCHED'
  | 'FANOUT_BLOCKED'
  | 'DPO_APPROVED'
  | 'DPO_REJECTED'

export interface DemoEvent {
  id: string
  type: DemoEventType
  timestamp: string
  actor: 'customer' | 'guardian' | 'dpo' | 'system' | 'aurva'
  perspective: Perspective
  payload: Record<string, unknown>
  dpdpSection?: DPDPSection
  storyCaption?: string          // auto-generated in Story Mode
  apiCall?: APICall              // shown in Technical Mode
}

export interface APICall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  requestBody?: Record<string, unknown>
  responseBody?: Record<string, unknown>
  statusCode: number
  latencyMs: number
}

// ─── App shell state ──────────────────────────────────────────────────────────

export type Perspective =
  | 'customer-app'
  | 'customer-portal'
  | 'ct-manager'
  | 'aurva'
  | 'dam'

export type ViewMode = 'live' | 'story' | 'technical'

export type DeviceFrame = 'mobile' | 'tablet' | 'desktop' | 'fullscreen'

export type FlowStage =
  | 'am-setup'
  | 'landing'
  | 'auth-login'
  | 'auth-otp'
  | 'consent-notice'
  | 'app'

// ─── Global demo app state ────────────────────────────────────────────────────

export interface DemoAppState {
  // Setup
  stage: FlowStage
  world: DemoWorld | null
  amInput: { companyName: string; industry: Industry; journeyType: JourneyType } | null

  // Shell
  activePerspective: Perspective
  viewMode: ViewMode
  deviceFrame: DeviceFrame

  // Live flow state
  cookieAccepted: boolean
  isAuthenticated: boolean
  consentGranted: boolean

  // CT Manager state
  selectedRevocationReqId: string | null
  selectedDeletionReqId: string | null
  activeCtTab: 'partial' | 'full' | 'deletion'
  ctSection: string
  // Cross-perspective: entries submitted from Customer Portal deletion requests
  pendingDeletions: PendingDeletionEntry[]

  // Events (drives Story + Technical modes)
  eventLog: DemoEvent[]

  // Notifications
  unreadNotifications: number
}

// ─── Reducer actions ──────────────────────────────────────────────────────────

// ─── Pending deletion entry (cross-perspective: Customer Portal → CT Manager) ──

export interface PendingDeletionEntry {
  id: string
  customerName: string
  phone: string
  requestedAt: string       // ISO datetime
  dataPoints: string[]      // e.g. ["Name", "Email", "Aadhaar"]
  status: 'pending' | 'approved' | 'rejected'
}

// ─── DemoAppState additions ───────────────────────────────────────────────────

// NOTE to Customer Portal agent:
// To wire P0-6 #4, dispatch:
//   dispatch({ type: 'QUEUE_DELETION_FROM_CUSTOMER', payload: { customerName, phone, dataPoints } })
// The CT Manager > Consent Authorisation > Data Deletion sub-tab will display these entries.

export type DemoAction =
  | { type: 'SET_AM_INPUT'; payload: DemoAppState['amInput'] }
  | { type: 'SET_WORLD'; payload: DemoWorld }
  | { type: 'SET_STAGE'; payload: FlowStage }
  | { type: 'SET_PERSPECTIVE'; payload: Perspective }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_DEVICE_FRAME'; payload: DeviceFrame }
  | { type: 'ACCEPT_COOKIE' }
  | { type: 'SET_AUTHENTICATED' }
  | { type: 'GRANT_CONSENT' }
  | { type: 'SET_CT_SECTION'; payload: string }
  | { type: 'SET_CT_TAB'; payload: 'partial' | 'full' | 'deletion' }
  | { type: 'SELECT_REVOCATION_REQ'; payload: string }
  | { type: 'SELECT_DELETION_REQ'; payload: string }
  | { type: 'EMIT_EVENT'; payload: DemoEvent }
  | { type: 'PARTIAL_REVOKE'; payload: { consentId: string; purposes: string[] } }
  | { type: 'FULL_REVOKE' }
  | { type: 'DELETION_JOB_UPDATE'; payload: { jobId: string; status: JobStatus; failureReason?: string } }
  | { type: 'BREACH_DETECTED'; payload: { linkedJobId: string } }
  | { type: 'ADD_NOMINEE'; payload: { name: string; phone: string; relation: string } }
  | { type: 'SUBMIT_GRIEVANCE'; payload: { type: GrievanceRecord['type']; description: string } }
  | { type: 'DPO_APPROVE'; payload: { reqId: string } }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  /**
   * QUEUE_DELETION_FROM_CUSTOMER — dispatched by Customer Portal when user submits a deletion request.
   * Dispatch contract:
   *   dispatch({ type: 'QUEUE_DELETION_FROM_CUSTOMER', payload: { customerName: string, phone: string, dataPoints: string[] } })
   * The CT Manager Consent Authorisation > Data Deletion tab reads state.pendingDeletions[] to show these entries.
   */
  | { type: 'QUEUE_DELETION_FROM_CUSTOMER'; payload: { customerName: string; phone: string; dataPoints: string[] } }
