import type { CompanyProfile, Product, SystemNode, ConsentRecord, DataAsset, ComplianceScore } from '../../store/types'
import type { SeededRandom } from '../seeded-random'

const TELECOM_COMPANIES: Partial<CompanyProfile>[] = [
  { name: 'Vodafone India', shortName: 'Vodafone', primaryColor: '#E60000', secondaryColor: '#333333', logoInitials: 'VI', tagline: 'The Future is Exciting. Ready?' },
  { name: 'Airtel India', shortName: 'Airtel', primaryColor: '#E40000', secondaryColor: '#1F1F1F', logoInitials: 'AI', tagline: 'Airtel — Har Ek Friend Zaroori Hota Hai' },
  { name: 'Jio', shortName: 'Jio', primaryColor: '#0A3D8F', secondaryColor: '#1592E6', logoInitials: 'JI', tagline: 'Digital India. Jio.' },
  { name: 'BSNL India', shortName: 'BSNL', primaryColor: '#2C5FAA', secondaryColor: '#F7A500', logoInitials: 'BS', tagline: 'Connecting India' },
]

const PRODUCTS: Product[] = [
  { id: 'prepaid-smart', name: 'Smart Prepaid 299', description: '2GB/day · Unlimited calls · 28 days', price: '₹299', category: 'Prepaid' },
  { id: 'prepaid-unlimited', name: 'Unlimited 599', description: '3GB/day · Unlimited calls · Hotstar · 56 days', price: '₹599', category: 'Prepaid' },
  { id: 'prepaid-international', name: 'International 1099', description: 'USA/UK/UAE roaming · 3GB/day · 28 days', price: '₹1,099', category: 'International' },
  { id: 'postpaid-red', name: 'RED Postpaid 499', description: '40GB/month · Unlimited calls · Netflix Basic', price: '₹499/month', category: 'Postpaid' },
  { id: 'fiber-home', name: 'Fiber Home 799', description: '100Mbps · Unlimited data · Free router', price: '₹799/month', category: 'Broadband' },
  { id: 'fiber-pro', name: 'Fiber Pro 1299', description: '300Mbps · Unlimited · OTT bundle · Static IP', price: '₹1,299/month', category: 'Broadband' },
  { id: 'iot-sim', name: 'IoT Connect SIM', description: 'Machine-to-Machine · 1GB pool · API access', price: '₹99/month', category: 'Enterprise' },
]

const SYSTEMS: SystemNode[] = [
  { id: 'v-crm', name: 'V-CRM', type: 'crm', endpoint: '/v-crm/webhook' },
  { id: 'v-marketing', name: 'V-Marketing', type: 'marketing', endpoint: '/v-marketing/webhook' },
  { id: 'v-finance', name: 'V-Finance', type: 'finance', endpoint: '/v-finance/webhook' },
  { id: 'v-analytics', name: 'V-Analytics', type: 'analytics', endpoint: '/v-analytics/webhook' },
]

export function buildTelecomCompany(companyName: string, rng: SeededRandom): Pick<CompanyProfile, 'name' | 'shortName' | 'primaryColor' | 'secondaryColor' | 'logoInitials' | 'tagline' | 'products' | 'systems' | 'dpoName' | 'dpoEmail'> {
  // Match to known brand or use generic telecom palette
  const matched = TELECOM_COMPANIES.find(c => companyName.toLowerCase().includes(c.shortName!.toLowerCase()))
  const base = matched ?? rng.pick(TELECOM_COMPANIES)

  const dpoFirstNames = ['Arun', 'Meena', 'Priya', 'Sanjay', 'Kavita']
  const dpoLastNames = ['Sharma', 'Verma', 'Nair', 'Joshi', 'Iyer']
  const dpoFirst = rng.pick(dpoFirstNames)
  const dpoLast = rng.pick(dpoLastNames)
  const shortN = base.shortName!.toLowerCase().replace(/\s/g, '')

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
    dpoEmail: `dpo@${shortN}.in`,
  }
}

export function buildTelecomDataAssets(companyShort: string, rng: SeededRandom): DataAsset[] {
  const short = companyShort.toLowerCase()
  return [
    {
      id: 'da-1',
      name: `${short}-subscriber-db`,
      riskScore: rng.int(75, 95),
      exposure: 'Internal',
      cloudProvider: 'AWS RDS',
      sizeGB: rng.int(200, 800),
      dataSensitivity: 'Critical',
      tags: ['PII', 'SPII'],
      issues: ['Stale accounts not purged', 'No column-level encryption'],
    },
    {
      id: 'da-2',
      name: `${short}-cdr-bucket`,
      riskScore: rng.int(60, 80),
      exposure: 'Internal',
      cloudProvider: 'GCP CloudStorage',
      sizeGB: rng.int(1000, 5000),
      dataSensitivity: 'High',
      tags: ['PII'],
      issues: ['Retention policy not enforced', 'Overprovisioned read access'],
    },
    {
      id: 'da-3',
      name: `${short}-kyc-store`,
      riskScore: rng.int(85, 99),
      exposure: 'Public',
      cloudProvider: 'GCP CloudStorage',
      sizeGB: rng.int(50, 200),
      dataSensitivity: 'Critical',
      tags: ['PII', 'SPII'],
      issues: ['Bucket publicly readable', 'Contains Aadhaar numbers', 'Overprovisioned Identity Access'],
    },
    {
      id: 'da-4',
      name: `${short}-marketing-crm`,
      riskScore: rng.int(40, 65),
      exposure: 'Internal',
      cloudProvider: 'Azure SQL',
      sizeGB: rng.int(20, 100),
      dataSensitivity: 'Medium',
      tags: ['PII'],
      issues: ['Consent state not synced'],
    },
  ]
}

export function buildTelecomCompliance(rng: SeededRandom): ComplianceScore[] {
  return [
    { framework: 'TRAI', score: rng.int(70, 95), status: 'partial' },
    { framework: 'DOT Security', score: rng.int(60, 85), status: 'partial' },
    { framework: 'ISO 27001', score: rng.int(0, 40), status: 'non-compliant' },
    { framework: 'DPDP Act 2023', score: rng.int(45, 70), status: 'partial' },
    { framework: 'CIS Controls', score: rng.int(20, 50), status: 'non-compliant' },
  ]
}
