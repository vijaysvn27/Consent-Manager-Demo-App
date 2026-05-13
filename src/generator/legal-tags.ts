import type { DPDPTag, DPDPSection } from '../store/types'

export const DPDP_TAGS: Record<DPDPSection, DPDPTag> = {
  '§5': {
    section: '§5',
    label: 'Lawful Processing',
    explanation: 'Data can only be processed for the specific purpose for which consent was given.',
  },
  '§6': {
    section: '§6',
    label: 'Consent Notice',
    penalty: '₹200 Crore',
    explanation: 'Consent must be free, specific, informed, unconditional, and unambiguous — given in a clear, plain-language notice.',
  },
  '§7': {
    section: '§7',
    label: 'Legitimate Use',
    explanation: 'Processing for employment, legal obligation, or state functions is permitted without additional consent.',
  },
  '§8': {
    section: '§8',
    label: 'Data Fiduciary Obligations',
    penalty: '₹200 Crore',
    explanation: 'The company must ensure data accuracy, limit retention to the stated period, and maintain security safeguards.',
  },
  '§9': {
    section: '§9',
    label: 'Children\'s Data',
    penalty: '₹200 Crore',
    explanation: 'Processing data of minors requires verifiable parental/guardian consent. Age-appropriate safeguards must apply.',
  },
  '§11': {
    section: '§11',
    label: 'Right to Access',
    explanation: 'Every Data Principal has the right to know what data is held about them and the identity of all entities it was shared with.',
  },
  '§12': {
    section: '§12',
    label: 'Right to Correction & Erasure',
    penalty: '₹200 Crore',
    explanation: 'The Data Principal can withdraw consent, request correction, or demand erasure at any time. The company must comply.',
  },
  '§13': {
    section: '§13',
    label: 'Grievance Redress',
    explanation: 'Every company must have a grievance mechanism. The Data Protection Officer must address complaints within 48 hours.',
  },
  '§14': {
    section: '§14',
    label: 'Nominee Rights',
    explanation: 'A nominated person can exercise data rights on behalf of the Data Principal in the event of death or incapacity.',
  },
  '§16': {
    section: '§16',
    label: 'Cross-Border Transfer',
    explanation: 'Transfer of personal data outside India is restricted. Permitted only to countries on the allowlist notified by the government.',
  },
}

export function getDPDPTag(section: DPDPSection): DPDPTag {
  return DPDP_TAGS[section]
}
