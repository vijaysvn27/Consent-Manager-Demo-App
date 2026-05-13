import type { CompanyProfile, Product, SystemNode, DataAsset, ComplianceScore } from '../../store/types'
import type { SeededRandom } from '../seeded-random'

const INSURANCE_COMPANIES: Partial<CompanyProfile>[] = [
  { name: 'HDFC Life', shortName: 'HDFC Life', primaryColor: '#004C8F', secondaryColor: '#E31837', logoInitials: 'HL', tagline: 'Sar Utha Ke Jiyo' },
  { name: 'LIC India', shortName: 'LIC', primaryColor: '#006400', secondaryColor: '#FFD700', logoInitials: 'LI', tagline: 'Yogakshemam Vahamyaham' },
  { name: 'Star Health', shortName: 'Star Health', primaryColor: '#E31837', secondaryColor: '#003087', logoInitials: 'SH', tagline: 'Your Health. Our Priority.' },
  { name: 'Bajaj Allianz', shortName: 'Bajaj', primaryColor: '#003087', secondaryColor: '#E31837', logoInitials: 'BA', tagline: 'Trusted Insurance. Trusted India.' },
]

const PRODUCTS: Product[] = [
  { id: 'term-life', name: 'Click 2 Protect Super', description: '₹1Cr cover · 40-year term · COVID protection', price: '₹8,500/year', category: 'Term Life' },
  { id: 'health-optima', name: 'Optima Restore', description: '₹10L–₹1Cr health · Day-care procedures · Restore benefit', price: '₹12,000/year', category: 'Health' },
  { id: 'ulip', name: 'Click 2 Invest ULIP', description: 'Market-linked · 8 fund options · Partial withdrawal after 5yr', price: '₹50,000/year', category: 'Investment' },
  { id: 'endowment', name: 'Sanchay Plus', description: 'Guaranteed returns 6.5% · 30-year plan · Loan facility', price: '₹24,000/year', category: 'Savings' },
  { id: 'annuity', name: 'Pension Plus', description: 'Immediate/deferred annuity · Joint life option', price: '₹1,00,000 lump sum', category: 'Retirement' },
]

const SYSTEMS: SystemNode[] = [
  { id: 'policy-admin', name: 'Policy Admin System', type: 'core_banking', endpoint: '/policy-admin/webhook' },
  { id: 'crm-insurance', name: 'Agent CRM', type: 'crm', endpoint: '/crm/webhook' },
  { id: 'claims-engine', name: 'Claims Engine', type: 'finance', endpoint: '/claims/webhook' },
  { id: 'underwriting', name: 'Underwriting Hub', type: 'analytics', endpoint: '/underwriting/webhook' },
]

export function buildInsuranceCompany(companyName: string, rng: SeededRandom): Pick<CompanyProfile, 'name' | 'shortName' | 'primaryColor' | 'secondaryColor' | 'logoInitials' | 'tagline' | 'products' | 'systems' | 'dpoName' | 'dpoEmail'> {
  const matched = INSURANCE_COMPANIES.find(c => companyName.toLowerCase().includes(c.shortName!.toLowerCase().split(' ')[0]))
  const base = matched ?? rng.pick(INSURANCE_COMPANIES)
  const dpoFirst = rng.pick(['Vinita', 'Suresh', 'Pooja', 'Ganesh', 'Lakshmi'])
  const dpoLast = rng.pick(['Pillai', 'Kamath', 'Hegde', 'Murthy', 'Subramanian'])
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
    dpoEmail: `privacy@${shortN}.com`,
  }
}

export function buildInsuranceDataAssets(companyShort: string, rng: SeededRandom): DataAsset[] {
  const s = companyShort.toLowerCase().replace(/\s/g, '-')
  return [
    { id: 'da-1', name: `${s}-medical-records`, riskScore: rng.int(85, 99), exposure: 'Restricted', cloudProvider: 'On-Premise', sizeGB: rng.int(50, 300), dataSensitivity: 'Critical', tags: ['PII', 'PHI', 'SPII'], issues: ['Medical history in cleartext', 'Shared with 3rd-party underwriters without masking'] },
    { id: 'da-2', name: `${s}-policy-db`, riskScore: rng.int(60, 80), exposure: 'Internal', cloudProvider: 'AWS RDS', sizeGB: rng.int(100, 600), dataSensitivity: 'High', tags: ['PII', 'PCI'], issues: ['Nominee data not encrypted'] },
    { id: 'da-3', name: `${s}-claims-bucket`, riskScore: rng.int(70, 90), exposure: 'Internal', cloudProvider: 'GCP CloudStorage', sizeGB: rng.int(200, 1000), dataSensitivity: 'High', tags: ['PII', 'PHI'], issues: ['Hospital bills with PII unmasked'] },
  ]
}

export function buildInsuranceCompliance(rng: SeededRandom): ComplianceScore[] {
  return [
    { framework: 'IRDAI Guidelines', score: rng.int(75, 95), status: 'compliant' },
    { framework: 'IRDAI Cybersecurity', score: rng.int(55, 78), status: 'partial' },
    { framework: 'ISO 27001', score: rng.int(0, 35), status: 'non-compliant' },
    { framework: 'DPDP Act 2023', score: rng.int(48, 70), status: 'partial' },
  ]
}
