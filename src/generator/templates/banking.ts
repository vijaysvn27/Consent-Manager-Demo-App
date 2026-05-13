import type { CompanyProfile, Product, SystemNode, DataAsset, ComplianceScore } from '../../store/types'
import type { SeededRandom } from '../seeded-random'

const BANKING_COMPANIES: Partial<CompanyProfile>[] = [
  { name: 'HDFC Bank', shortName: 'HDFC', primaryColor: '#004C8F', secondaryColor: '#E31837', logoInitials: 'HB', tagline: 'We Understand Your World' },
  { name: 'SBI', shortName: 'SBI', primaryColor: '#22409A', secondaryColor: '#8B0000', logoInitials: 'SB', tagline: 'The Banker to Every Indian' },
  { name: 'ICICI Bank', shortName: 'ICICI', primaryColor: '#F58220', secondaryColor: '#004B87', logoInitials: 'IC', tagline: 'Hum Hain Na' },
  { name: 'Axis Bank', shortName: 'Axis', primaryColor: '#97144D', secondaryColor: '#12877F', logoInitials: 'AX', tagline: 'Badhte Ka Naam Zindagi' },
]

const PRODUCTS: Product[] = [
  { id: 'savings', name: 'Savings Account', description: '4% p.a. interest · Zero AMC · UPI enabled', price: 'Zero balance', category: 'Deposits' },
  { id: 'fd', name: 'Fixed Deposit', description: '7.25% p.a. · ₹10,000 minimum · 1–5 years', price: '7.25% p.a.', category: 'Deposits' },
  { id: 'cc-regalia', name: 'Regalia Credit Card', description: '5X rewards · Airport lounge · ₹1,000 welcome voucher', price: '₹2,500/year', category: 'Cards' },
  { id: 'home-loan', name: 'Home Loan', description: '8.40% floating · ₹5L–5Cr · Upto 30 years', price: '8.40% p.a.', category: 'Loans' },
  { id: 'personal-loan', name: 'Personal Loan', description: '10.50% p.a. · ₹50K–40L · 5 min approval', price: '10.50% p.a.', category: 'Loans' },
  { id: 'demat', name: 'Demat + Trading', description: 'Free demat · ₹20 flat brokerage · NSE/BSE', price: '₹300/year', category: 'Investments' },
]

const SYSTEMS: SystemNode[] = [
  { id: 'core-banking', name: 'Core Banking (Finacle)', type: 'core_banking', endpoint: '/core-banking/webhook' },
  { id: 'crm-salesforce', name: 'CRM (Salesforce)', type: 'crm', endpoint: '/crm/webhook' },
  { id: 'marketing-ops', name: 'Marketing Ops', type: 'marketing', endpoint: '/marketing-ops/webhook' },
  { id: 'analytics-engine', name: 'Analytics Engine', type: 'analytics', endpoint: '/analytics/webhook' },
  { id: 'bureau-connect', name: 'CIBIL Connect', type: 'finance', endpoint: '/bureau/webhook' },
]

export function buildBankingCompany(companyName: string, rng: SeededRandom): Pick<CompanyProfile, 'name' | 'shortName' | 'primaryColor' | 'secondaryColor' | 'logoInitials' | 'tagline' | 'products' | 'systems' | 'dpoName' | 'dpoEmail'> {
  const matched = BANKING_COMPANIES.find(c => companyName.toLowerCase().includes(c.shortName!.toLowerCase()))
  const base = matched ?? rng.pick(BANKING_COMPANIES)
  const dpoFirst = rng.pick(['Deepak', 'Anita', 'Rajan', 'Sujata', 'Mohit'])
  const dpoLast = rng.pick(['Mehta', 'Chandra', 'Bose', 'Kulkarni', 'Rao'])
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
    dpoEmail: `dpo@${shortN}bank.com`,
  }
}

export function buildBankingDataAssets(companyShort: string, rng: SeededRandom): DataAsset[] {
  const s = companyShort.toLowerCase()
  return [
    { id: 'da-1', name: `${s}-kyc-vault`, riskScore: rng.int(80, 99), exposure: 'Internal', cloudProvider: 'On-Premise HSM', sizeGB: rng.int(100, 500), dataSensitivity: 'Critical', tags: ['PII', 'SPII'], issues: ['PAN/Aadhaar in cleartext', 'Audit log gaps'] },
    { id: 'da-2', name: `${s}-txn-archive`, riskScore: rng.int(55, 75), exposure: 'Internal', cloudProvider: 'AWS S3', sizeGB: rng.int(5000, 20000), dataSensitivity: 'High', tags: ['PII', 'PCI'], issues: ['No column masking on dev copies'] },
    { id: 'da-3', name: `${s}-bureau-cache`, riskScore: rng.int(70, 90), exposure: 'Restricted', cloudProvider: 'Azure SQL', sizeGB: rng.int(10, 50), dataSensitivity: 'Critical', tags: ['PII', 'PCI'], issues: ['Stale CIBIL scores', 'Overshared to marketing'] },
    { id: 'da-4', name: `${s}-crm-leads`, riskScore: rng.int(30, 55), exposure: 'Internal', cloudProvider: 'Salesforce', sizeGB: rng.int(5, 30), dataSensitivity: 'Medium', tags: ['PII'], issues: ['Consent flag missing in 23% of records'] },
  ]
}

export function buildBankingCompliance(rng: SeededRandom): ComplianceScore[] {
  return [
    { framework: 'RBI IT Framework', score: rng.int(80, 99), status: 'compliant' },
    { framework: 'SEBI', score: rng.int(50, 75), status: 'partial' },
    { framework: 'PCI DSS', score: rng.int(65, 85), status: 'partial' },
    { framework: 'ISO 27001', score: rng.int(0, 30), status: 'non-compliant' },
    { framework: 'DPDP Act 2023', score: rng.int(50, 72), status: 'partial' },
  ]
}
