import type { CompanyProfile, Product, SystemNode, DataAsset, ComplianceScore } from '../../store/types'
import type { SeededRandom } from '../seeded-random'

const HR_COMPANIES: Partial<CompanyProfile>[] = [
  { name: 'GMR Group', shortName: 'GMR', primaryColor: '#003087', secondaryColor: '#FF6600', logoInitials: 'GM', tagline: 'Creating Value. Creating India.' },
  { name: 'Tata Consultancy Services', shortName: 'TCS', primaryColor: '#003087', secondaryColor: '#000000', logoInitials: 'TC', tagline: 'Building on Belief' },
  { name: 'Infosys', shortName: 'Infosys', primaryColor: '#007CC2', secondaryColor: '#F9A12E', logoInitials: 'IN', tagline: 'Navigate Your Next' },
  { name: 'Wipro', shortName: 'Wipro', primaryColor: '#341D6D', secondaryColor: '#5DA8DC', logoInitials: 'WI', tagline: 'Applying Thought' },
]

// For HR context, "products" = HR modules/services
const PRODUCTS: Product[] = [
  { id: 'onboarding', name: 'Digital Onboarding', description: 'KYC, BGV, offer letter, PAN/Aadhaar link', price: 'Internal', category: 'HR Operations' },
  { id: 'payroll', name: 'Payroll Services', description: 'Monthly payroll, TDS, Form 16, PF/ESIC', price: 'Internal', category: 'Finance' },
  { id: 'epfo', name: 'EPFO Integration', description: 'UAN linking, PF deposit, passbook access', price: 'Internal', category: 'Compliance' },
  { id: 'health-insurance', name: 'Group Health Insurance', description: 'Employee + family cover · ₹5L base · Cashless', price: 'Company-paid', category: 'Benefits' },
  { id: 'wellness', name: 'Wellness Programme', description: 'Gym, mental health, nutrition — opt-in', price: 'Company-paid', category: 'Benefits' },
  { id: 'performance', name: 'Performance Management', description: 'Annual appraisal, 360° feedback, OKR tracking', price: 'Internal', category: 'HR Operations' },
]

const SYSTEMS: SystemNode[] = [
  { id: 'hrms', name: 'HRMS (SAP SuccessFactors)', type: 'hrms', endpoint: '/hrms/webhook' },
  { id: 'payroll-sys', name: 'Payroll System', type: 'finance', endpoint: '/payroll/webhook' },
  { id: 'bgv-provider', name: 'BGV Provider (AuthBridge)', type: 'analytics', endpoint: '/bgv/webhook' },
  { id: 'epfo-gateway', name: 'EPFO Gateway', type: 'finance', endpoint: '/epfo/webhook' },
]

export function buildHRCompany(companyName: string, rng: SeededRandom): Pick<CompanyProfile, 'name' | 'shortName' | 'primaryColor' | 'secondaryColor' | 'logoInitials' | 'tagline' | 'products' | 'systems' | 'dpoName' | 'dpoEmail'> {
  const matched = HR_COMPANIES.find(c => companyName.toLowerCase().includes(c.shortName!.toLowerCase()))
  const base = matched ?? rng.pick(HR_COMPANIES)
  const dpoFirst = rng.pick(['Aditi', 'Sreenivas', 'Harini', 'Rajesh', 'Kavitha'])
  const dpoLast = rng.pick(['Kumar', 'Krishnamurthy', 'Bhat', 'Rajan', 'Menon'])
  const shortN = base.shortName!.toLowerCase()

  return {
    name: companyName || base.name!,
    shortName: base.shortName!,
    primaryColor: base.primaryColor!,
    secondaryColor: base.secondaryColor!,
    logoInitials: base.logoInitials!,
    tagline: base.tagline!,
    products: rng.shuffle(PRODUCTS).slice(0, 5),
    systems: SYSTEMS,
    dpoName: `${dpoFirst} ${dpoLast}`,
    dpoEmail: `privacy@${shortN}.com`,
  }
}

export function buildHRDataAssets(companyShort: string, rng: SeededRandom): DataAsset[] {
  const s = companyShort.toLowerCase()
  return [
    { id: 'da-1', name: `${s}-employee-db`, riskScore: rng.int(65, 88), exposure: 'Internal', cloudProvider: 'SAP Cloud', sizeGB: rng.int(20, 200), dataSensitivity: 'High', tags: ['PII', 'SPII'], issues: ['Terminated employees data retained > 5 years', 'PAN/Aadhaar visible to managers'] },
    { id: 'da-2', name: `${s}-payroll-archive`, riskScore: rng.int(50, 75), exposure: 'Restricted', cloudProvider: 'On-Premise', sizeGB: rng.int(5, 50), dataSensitivity: 'High', tags: ['PII', 'PCI'], issues: ['Salary data in unencrypted S3 export'] },
    { id: 'da-3', name: `${s}-bgv-reports`, riskScore: rng.int(55, 78), exposure: 'Internal', cloudProvider: 'AuthBridge', sizeGB: rng.int(2, 20), dataSensitivity: 'Critical', tags: ['PII', 'SPII'], issues: ['Criminal record data shared beyond HR', 'No purge after onboarding'] },
  ]
}

export function buildHRCompliance(rng: SeededRandom): ComplianceScore[] {
  return [
    { framework: 'Labour Law Compliance', score: rng.int(70, 92), status: 'compliant' },
    { framework: 'EPFO/ESIC', score: rng.int(80, 99), status: 'compliant' },
    { framework: 'ISO 27001', score: rng.int(15, 45), status: 'non-compliant' },
    { framework: 'DPDP Act 2023 (HR)', score: rng.int(35, 60), status: 'partial' },
  ]
}
