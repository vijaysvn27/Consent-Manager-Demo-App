import { SeededRandom } from './seeded-random'
import { buildTelecomCompany, buildTelecomDataAssets, buildTelecomCompliance } from './templates/telecom'
import { buildBankingCompany, buildBankingDataAssets, buildBankingCompliance } from './templates/banking'
import { buildInsuranceCompany, buildInsuranceDataAssets, buildInsuranceCompliance } from './templates/insurance'
import { buildMicrofinanceCompany, buildMFIDataAssets, buildMFICompliance } from './templates/microfinance'
import { buildHRCompany, buildHRDataAssets, buildHRCompliance } from './templates/hr'
import type {
  DemoWorld, Industry, JourneyType, CompanyProfile, CustomerProfile, ConsentRecord,
  Vendor, DPOStats, AuditEntry, BreachRecord, GrievanceRecord,
  DeletionJob, Notification, TimelineEntry,
} from '../store/types'

// Canonical list of vendors (ConsenTick disclosure panel)
const VENDOR_POOL: Vendor[] = [
  { id: 'cibil', name: 'TransUnion CIBIL', country: 'India', purpose: 'Credit score check', crossBorder: false, logoInitials: 'CI' },
  { id: 'perfios', name: 'Perfios', country: 'India', purpose: 'Bank statement analysis', crossBorder: false, logoInitials: 'PF' },
  { id: 'hubspot', name: 'HubSpot', country: 'USA', purpose: 'Marketing CRM', crossBorder: true, logoInitials: 'HS' },
  { id: 'gupshup', name: 'Gupshup', country: 'India', purpose: 'SMS/WhatsApp notifications', crossBorder: false, logoInitials: 'GU' },
  { id: 'swiggy', name: 'Swiggy (Analytics)', country: 'India', purpose: 'Lifestyle data enrichment', crossBorder: false, logoInitials: 'SW' },
  { id: 'zupey', name: 'Zupey', country: 'India', purpose: 'Customer engagement', crossBorder: false, logoInitials: 'ZU' },
  { id: 'instagram', name: 'Meta (Instagram)', country: 'USA', purpose: 'Social media retargeting', crossBorder: true, logoInitials: 'IG' },
  { id: 'crif', name: 'CRIF High Mark', country: 'India', purpose: 'Microfinance bureau check', crossBorder: false, logoInitials: 'CR' },
  { id: 'authbridge', name: 'AuthBridge', country: 'India', purpose: 'Background verification', crossBorder: false, logoInitials: 'AB' },
]

const CONSENT_PURPOSES = [
  { code: 'account_mgmt', label: 'Account Management', legal: '§5' as const, required: true, dataPoints: ['Full Name', 'Phone', 'Email', 'Address'] },
  { code: 'kyc', label: 'KYC Verification', legal: '§7' as const, required: true, dataPoints: ['PAN Number', 'Aadhaar Number', 'Date of Birth', 'Photo ID'] },
  { code: 'marketing', label: 'Marketing & Promotions', legal: '§6' as const, required: false, dataPoints: ['Email', 'Phone', 'Purchase History', 'Browsing Behaviour'] },
  { code: 'credit_check', label: 'Credit Assessment', legal: '§7' as const, required: true, dataPoints: ['PAN Number', 'Income Data', 'CIBIL Score', 'Bank Statements'] },
  { code: 'analytics', label: 'Usage Analytics', legal: '§6' as const, required: false, dataPoints: ['App Usage Logs', 'Feature Interactions', 'Device Info'] },
  { code: 'notifications', label: 'Service Notifications', legal: '§5' as const, required: true, dataPoints: ['Phone Number', 'Email'] },
  { code: 'third_party', label: 'Third-Party Data Sharing', legal: '§6' as const, required: false, dataPoints: ['Profile Data', 'Transaction Summary'] },
  { code: 'location', label: 'Location Services', legal: '§6' as const, required: false, dataPoints: ['GPS Location', 'Network Location'] },
  { code: 'employment', label: 'Employment Records', legal: '§7' as const, required: true, dataPoints: ['Employee ID', 'Department', 'Salary Band', 'Appraisal History'] },
]

function buildConsents(
  customerName: string,
  rng: SeededRandom,
  industry: Industry,
): ConsentRecord[] {
  const selectedPurposes = industry === 'hr'
    ? CONSENT_PURPOSES.filter(p => ['account_mgmt', 'kyc', 'notifications', 'analytics', 'employment', 'third_party'].includes(p.code))
    : CONSENT_PURPOSES.filter(p => p.code !== 'employment').slice(0, 8)

  return selectedPurposes.map((p, i) => {
    const expiry = rng.futureDate(30, 730)
    const grantedDaysAgo = rng.int(1, 180)
    const grantedAt = rng.pastDate(grantedDaysAgo, grantedDaysAgo)

    const statuses = p.required
      ? (['ACTIVE', 'ACTIVE', 'ACTIVE'] as const)
      : (['ACTIVE', 'ACTIVE', 'REVOKED', 'PENDING'] as const)
    const status = rng.pick(statuses)

    const timeline: TimelineEntry[] = [
      { timestamp: grantedAt, event: 'Consent granted', type: 'granted', actor: customerName },
    ]
    if (status === 'REVOKED') {
      timeline.push({ timestamp: rng.pastDate(1, grantedDaysAgo - 1), event: 'Consent revoked by Data Principal', type: 'revoked', actor: customerName })
    }
    if (status === 'PENDING' || status === 'MODIFICATION_REQUESTED') {
      timeline.push({ timestamp: rng.pastDate(1, 5), event: 'Modification request submitted', type: 'requested', actor: customerName })
    }
    if (expiry.daysRemaining <= 7 && status === 'ACTIVE') {
      timeline.push({ timestamp: rng.pastDate(0, 1), event: `Expiry reminder sent — expires ${expiry.display}`, type: 'updated', actor: 'System' })
    }

    return {
      id: `consent-${i + 1}`,
      requestId: rng.reqId(),
      purpose: p.label,
      purposeCode: p.code,
      dataPoints: p.dataPoints.map((dp, j) => ({
        id: `dp-${i}-${j}`,
        label: dp,
        category: dp.includes('PAN') || dp.includes('Aadhaar') ? 'Identity' : dp.includes('Income') || dp.includes('Salary') ? 'Financial' : 'Profile',
        sensitivity: (dp.includes('PAN') || dp.includes('Aadhaar') ? 'critical' : dp.includes('Income') ? 'high' : 'medium') as 'critical' | 'high' | 'medium',
        required: p.required,
        dpdpTag: p.legal,
      })),
      status,
      grantedAt,
      expiryDate: expiry.display,
      expiryDaysRemaining: expiry.daysRemaining,
      legalBasis: p.legal,
      vendors: rng.shuffle(VENDOR_POOL.map(v => v.id)).slice(0, rng.int(1, 3)),
      consentType: 'direct',
      activityTimeline: timeline,
    }
  })
}

function buildDPOStats(consents: ConsentRecord[], rng: SeededRandom): DPOStats {
  const active = consents.filter(c => c.status === 'ACTIVE').length
  return {
    active: rng.int(180, 210),
    pending: rng.int(10, 25),
    modification: rng.int(8, 18),
    withdrawal: rng.int(8, 18),
    compliant: rng.int(110, 135),
    nonCompliant: rng.int(25, 40),
    grievancesOpen: rng.int(3, 12),
    breachesActive: rng.int(0, 5),
  }
}

function buildAuditTrail(customerName: string, companyShort: string, rng: SeededRandom): AuditEntry[] {
  const actors = [`${companyShort.toLowerCase()}-crm`, `${companyShort.toLowerCase()}-analytics`, 'aurva', 'dpo-console', customerName.toLowerCase()]
  const actions = ['READ customer profile', 'QUERY transaction history', 'EXPORT data subset', 'UPDATE consent flag', 'DELETE stale record', 'ACCESS KYC document']
  const assets = [`${companyShort.toLowerCase()}-subscriber-db`, `${companyShort.toLowerCase()}-kyc-vault`, `${companyShort.toLowerCase()}-marketing-crm`]

  return Array.from({ length: rng.int(8, 15) }, (_, i) => ({
    id: `audit-${i}`,
    timestamp: rng.pastDate(0, 30),
    actor: rng.pick(actors),
    action: rng.pick(actions),
    asset: rng.pick(assets),
    riskScore: rng.int(15, 97),
    customer: rng.bool(0.4) ? customerName : undefined,
  })).sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

function buildBreaches(rng: SeededRandom): BreachRecord[] {
  if (rng.bool(0.3)) return []  // 70% chance of at least one breach in history
  return [{
    id: 'breach-1',
    detectedAt: rng.pastDate(20, 90),
    severity: rng.pick(['medium', 'high', 'critical'] as const),
    recordsAffected: rng.int(500, 50000),
    description: rng.pick([
      'Misconfigured S3 bucket exposed customer PII for 6 hours',
      'Third-party vendor API returned unmasked customer data in response body',
      'Data deletion job failure — customer records persisted past consent withdrawal',
    ]),
    status: rng.pick(['contained', 'notified'] as const),
    notified72h: rng.bool(0.7),
  }]
}

function buildGrievances(customerName: string, rng: SeededRandom): GrievanceRecord[] {
  if (rng.bool(0.5)) return []
  const submittedAt = rng.pastDate(1, 10)
  const deadline = new Date(submittedAt)
  deadline.setHours(deadline.getHours() + 48)
  const now = new Date()
  return [{
    id: 'grievance-1',
    submittedAt,
    type: rng.pick(['data_misuse', 'non_deletion', 'access_denied'] as const),
    description: `${customerName} reported ${rng.pick(['marketing messages received after revocation', 'data not deleted within stipulated time', 'unable to access consent history'])}`,
    status: 'open',
    slaDeadline: deadline.toISOString(),
    slaStatus: now > deadline ? 'breached' : 'within',
    assignedDPO: undefined,
  }]
}

function buildDeletionJobs(companyShort: string, rng: SeededRandom): DeletionJob[] {
  const reqId = rng.delReqId()
  const s = companyShort.toLowerCase()
  return [
    { id: 'del-job-1', requestId: reqId, layer: 'db', systemName: `DB1 — ${s}-customer-records`, status: 'QUEUED', startedAt: undefined, completedAt: undefined },
    { id: 'del-job-2', requestId: reqId, layer: 'marketing', systemName: `marketing-service-2 (${s}-crm)`, status: 'QUEUED', startedAt: undefined, completedAt: undefined },
    { id: 'del-job-3', requestId: reqId, layer: 'app', systemName: `app-layer-3 — usage logs`, status: 'QUEUED', startedAt: undefined, completedAt: undefined },
  ]
}

function buildNotifications(consents: ConsentRecord[], rng: SeededRandom): Notification[] {
  const notifs: Notification[] = []
  const expiringConsent = consents.find(c => c.expiryDaysRemaining <= 7 && c.status === 'ACTIVE')
  if (expiringConsent) {
    notifs.push({ id: 'n-1', type: 'expiry_warning', message: `Your "${expiringConsent.purpose}" consent expires in ${expiringConsent.expiryDaysRemaining} days`, timestamp: rng.pastDate(0, 1), read: false, linkedConsentId: expiringConsent.id })
  }
  const revokedConsent = consents.find(c => c.status === 'REVOKED')
  if (revokedConsent) {
    notifs.push({ id: 'n-2', type: 'revocation_approved', message: `Marketing Revocation approved — you will no longer receive promotional messages`, timestamp: rng.pastDate(1, 5), read: true, linkedConsentId: revokedConsent.id })
  }
  notifs.push({ id: 'n-3', type: 'new_purpose', message: `New consent request: Credit Score Sharing — tap to review`, timestamp: rng.pastDate(0, 2), read: false })
  return notifs
}

export function generateDemoWorld(
  companyName: string,
  industry: Industry,
  journeyType: JourneyType = 'self',
): DemoWorld {
  // Seed on company + industry only — customer name/phone filled later at OTP
  const seed = `${companyName}::${industry}::${journeyType}`
  const rng = new SeededRandom(seed)

  // Build company profile from industry template
  const industryBuilders = {
    telecom: { company: buildTelecomCompany, assets: buildTelecomDataAssets, compliance: buildTelecomCompliance },
    banking: { company: buildBankingCompany, assets: buildBankingDataAssets, compliance: buildBankingCompliance },
    insurance: { company: buildInsuranceCompany, assets: buildInsuranceDataAssets, compliance: buildInsuranceCompliance },
    microfinance: { company: buildMicrofinanceCompany, assets: buildMFIDataAssets, compliance: buildMFICompliance },
    hr: { company: buildHRCompany, assets: buildHRDataAssets, compliance: buildHRCompliance },
  }
  const builder = industryBuilders[industry]
  const companyFields = builder.company(companyName, rng)

  const company: CompanyProfile = {
    ...companyFields,
    industry,
  }

  // Customer name + phone are empty strings — filled at OTP screen via SET_WORLD
  const isMinor = journeyType === 'guardian-minor'
  const emailDomain = rng.pick(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'])
  const customer: CustomerProfile = {
    name: '',
    phone: '',
    email: `user${rng.int(10, 99)}@${emailDomain}`,
    consentId: rng.ulid(),
    age: isMinor ? rng.int(13, 17) : rng.int(22, 58),
    journeyType,
    isMinor,
    guardianName: isMinor ? rng.pick(['Rajesh Kumar', 'Sunita Devi', 'Mohan Sharma']) : undefined,
    guardianPhone: isMinor ? `9${rng.int(100000000, 999999999)}` : undefined,
  }

  // Name is empty at world-generation time — filled at OTP screen
  const placeholderName = ''

  const vendors = rng.shuffle(VENDOR_POOL).slice(0, rng.int(4, 7))
  const consents = buildConsents(placeholderName, rng, industry)
  const dataAssets = builder.assets(company.shortName, rng)
  const complianceScores = builder.compliance(rng)

  const openRisks = {
    total: rng.int(8000, 20000),
    dam: rng.int(3000, 8000),
    dataPrivacy: rng.int(800, 2000),
    dspm: rng.int(4000, 10000),
  }
  openRisks.total = openRisks.dam + openRisks.dataPrivacy + openRisks.dspm

  return {
    company,
    customer,
    consents,
    vendors,
    dpoStats: buildDPOStats(consents, rng),
    dataAssets,
    complianceScores,
    auditTrail: buildAuditTrail(placeholderName, company.shortName, rng),
    breaches: buildBreaches(rng),
    grievances: buildGrievances(placeholderName, rng),
    deletionJobs: buildDeletionJobs(company.shortName, rng),
    notifications: buildNotifications(consents, rng),
    openRisks,
  }
}
