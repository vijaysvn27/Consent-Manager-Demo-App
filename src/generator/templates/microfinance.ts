import type { CompanyProfile, Product, SystemNode, DataAsset, ComplianceScore } from '../../store/types'
import type { SeededRandom } from '../seeded-random'

const MFI_COMPANIES: Partial<CompanyProfile>[] = [
  { name: 'Spandana Sphoorty', shortName: 'Spandana', primaryColor: '#1A3A8F', secondaryColor: '#F58220', logoInitials: 'SS', tagline: 'Empowering Rural India' },
  { name: 'Ujjivan Small Finance Bank', shortName: 'Ujjivan', primaryColor: '#0066CC', secondaryColor: '#FF6600', logoInitials: 'UJ', tagline: 'Building a Better Life' },
  { name: 'Arohan Financial', shortName: 'Arohan', primaryColor: '#006341', secondaryColor: '#FFC72C', logoInitials: 'AR', tagline: 'Inclusive Finance for All' },
  { name: 'CreditAccess Grameen', shortName: 'CAG', primaryColor: '#00509E', secondaryColor: '#F05A28', logoInitials: 'CA', tagline: 'Credit for the Underserved' },
]

const PRODUCTS: Product[] = [
  { id: 'jlg-loan', name: 'JLG Income Generation Loan', description: '₹10,000–₹75,000 · Group of 5 · 24 months · Weekly repayment', price: '24% p.a.', category: 'Group Loan' },
  { id: 'individual-loan', name: 'Individual Business Loan', description: '₹50,000–₹2,00,000 · Fortnightly · 36 months', price: '22% p.a.', category: 'Individual Loan' },
  { id: 'livestock', name: 'Livestock Loan', description: '₹15,000–₹60,000 · Cattle/buffalo purchase · 24 months', price: '22% p.a.', category: 'Asset Loan' },
  { id: 'solar', name: 'Solar Home Loan', description: '₹20,000–₹80,000 · Solar panel + battery · 36 months', price: '20% p.a.', category: 'Green Loan' },
  { id: 'micro-insurance', name: 'Group Credit Life Insurance', description: 'Loan coverage on member death · ₹15/month per ₹10,000', price: '₹15/month', category: 'Insurance' },
]

const SYSTEMS: SystemNode[] = [
  { id: 'los', name: 'Loan Origination System', type: 'los', endpoint: '/los/webhook' },
  { id: 'lms', name: 'Loan Management System', type: 'core_banking', endpoint: '/lms/webhook' },
  { id: 'credit-bureau', name: 'CRIF Bureau', type: 'finance', endpoint: '/crif/webhook' },
  { id: 'field-app', name: 'Field Agent App', type: 'crm', endpoint: '/field/webhook' },
]

export function buildMicrofinanceCompany(companyName: string, rng: SeededRandom): Pick<CompanyProfile, 'name' | 'shortName' | 'primaryColor' | 'secondaryColor' | 'logoInitials' | 'tagline' | 'products' | 'systems' | 'dpoName' | 'dpoEmail'> {
  const matched = MFI_COMPANIES.find(c => companyName.toLowerCase().includes(c.shortName!.toLowerCase()))
  const base = matched ?? rng.pick(MFI_COMPANIES)
  const dpoFirst = rng.pick(['Ramesh', 'Sunita', 'Govind', 'Malathi', 'Suresh'])
  const dpoLast = rng.pick(['Patil', 'Reddy', 'Naidu', 'Yadav', 'Goud'])
  const shortN = base.shortName!.toLowerCase().replace(/\s/g, '')

  return {
    name: companyName || base.name!,
    shortName: base.shortName!,
    primaryColor: base.primaryColor!,
    secondaryColor: base.secondaryColor!,
    logoInitials: base.logoInitials!,
    tagline: base.tagline!,
    products: rng.shuffle(PRODUCTS).slice(0, 4),
    systems: SYSTEMS,
    dpoName: `${dpoFirst} ${dpoLast}`,
    dpoEmail: `dpo@${shortN}.org`,
  }
}

export function buildMFIDataAssets(companyShort: string, rng: SeededRandom): DataAsset[] {
  const s = companyShort.toLowerCase()
  return [
    { id: 'da-1', name: `${s}-borrower-kyc`, riskScore: rng.int(75, 95), exposure: 'Internal', cloudProvider: 'On-Premise', sizeGB: rng.int(5, 50), dataSensitivity: 'Critical', tags: ['PII', 'SPII'], issues: ['Aadhaar not masked', 'Paper-to-digital conversion unencrypted'] },
    { id: 'da-2', name: `${s}-repayment-db`, riskScore: rng.int(40, 65), exposure: 'Internal', cloudProvider: 'AWS RDS', sizeGB: rng.int(10, 80), dataSensitivity: 'High', tags: ['PII', 'PCI'], issues: ['No row-level security'] },
    { id: 'da-3', name: `${s}-group-records`, riskScore: rng.int(30, 55), exposure: 'Internal', cloudProvider: 'On-Premise', sizeGB: rng.int(2, 20), dataSensitivity: 'Medium', tags: ['PII'], issues: ['Group member PII accessible by all LOs'] },
  ]
}

export function buildMFICompliance(rng: SeededRandom): ComplianceScore[] {
  return [
    { framework: 'RBI NBFC Guidelines', score: rng.int(65, 85), status: 'partial' },
    { framework: 'MFIN Code of Conduct', score: rng.int(75, 95), status: 'compliant' },
    { framework: 'ISO 27001', score: rng.int(0, 20), status: 'non-compliant' },
    { framework: 'DPDP Act 2023', score: rng.int(30, 55), status: 'non-compliant' },
  ]
}
