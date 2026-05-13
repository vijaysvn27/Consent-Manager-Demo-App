# Perfios DPDP Masterclass — Complete Build Plan
*Owner: Vijay (Antigravity AI CEO) | Builder: Claude Code (Sonnet) | Reviewers: Claude Opus (Plan + Code)*
*Last updated: 2026-05-13*

---

## VISION (One Paragraph)

A browser-based interactive demo engine — "Perfios DPDP Masterclass" — where an Account Manager types a company name + industry + customer name once, and a complete, consistent world appears: a realistic company landing page (Vodafone India with real plans, a bank with real products), cookie consent, login/OTP, ConsenTick consent notice, and the full Perfios DPDP Suite across five simultaneous perspectives (Customer App, Customer Portal, DPO Console/CT Manager, DSPM/Aurva, DAM). Every button propagates in real time across all views. Three lenses: Live (interactive), Story (auto-narrated plain-English + DPDP section), Technical (live API call + UML). Every DPDP section is surfaced inline at the relevant screen. No fixed actors — the demo customer's name entered at login populates every screen, every story, every payload.

---

## ARCHITECTURE

### Tech Stack
- **Vite 5 + React 18 + TypeScript (strict)** — no router, no external state library, no UI component library
- **Tailwind CSS** — utility-first, no component framework
- **No icon library** — inline SVG only
- **No animation library** — CSS keyframes only
- **State**: Single React Context + useReducer (`DemoStore`)
- **Fonts**: Inter (body), JetBrains Mono (code/payloads) — loaded from Google Fonts in index.html

### Directory Structure
```
D:/Research/dpdp-demo/
├── PLAN.md                    ← this file
├── LIVE_CONTEXT.md            ← shared truth for all three sessions
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx                ← top-level: AM Setup → Demo Shell
    ├── store/
    │   ├── types.ts           ← DemoWorld, DemoEvent, all types
    │   ├── store.tsx          ← DemoContext, reducer, DemoProvider
    │   └── actions.ts         ← typed action creators
    ├── generator/
    │   ├── index.ts           ← main generate(company, industry, customerName, phone) → DemoWorld
    │   ├── seeded-random.ts   ← deterministic PRNG (mulberry32)
    │   ├── templates/
    │   │   ├── telecom.ts     ← Vodafone/Airtel/Jio data shapes
    │   │   ├── banking.ts     ← HDFC/SBI/Axis data shapes
    │   │   ├── insurance.ts   ← LIC/HDFC Life data shapes
    │   │   ├── microfinance.ts ← Spandana/Ujjivan shapes
    │   │   └── hr.ts          ← GMR/corporate HR shapes
    │   └── legal-tags.ts      ← §5, §6, §8, §9, §11, §12, §13, §14 mappings
    ├── perspectives/
    │   ├── CustomerApp/       ← mobile 390×844, all flows
    │   ├── CustomerPortal/    ← tablet/desktop
    │   ├── CTManager/         ← DPO Console desktop
    │   ├── Aurva/             ← DSPM desktop
    │   └── DAM/               ← Data Asset Manager desktop
    ├── flows/
    │   ├── LandingPage.tsx    ← industry-shaped company website
    │   ├── CookieConsent.tsx  ← GDPR/DPDP cookie banner
    │   ├── AuthFlow.tsx       ← Login + OTP (customer name captured here)
    │   ├── ConsenTick.tsx     ← Perfios consent notice (Essential/Optional tabs)
    │   └── AppShell.tsx       ← post-consent authenticated app
    ├── modes/
    │   ├── LiveMode.tsx       ← pass-through, no overlay
    │   ├── StoryMode.tsx      ← auto-narrates from event log
    │   └── TechnicalMode.tsx  ← API call + payload + UML
    ├── shared/
    │   ├── DeviceFrame.tsx    ← mobile/tablet/desktop/fullscreen frames
    │   ├── PerspectiveSwitcher.tsx
    │   ├── ModeSwitcher.tsx
    │   └── DPDPTag.tsx        ← inline §-section badge
    └── story-html/
        └── index.html         ← standalone Story HTML (separate deliverable)
```

---

## DATA LAYER: DemoWorld

```typescript
// All data generated deterministically from: company + industry + customerName + phone
interface DemoWorld {
  company: CompanyProfile;
  customer: CustomerProfile;
  consents: ConsentRecord[];    // 9 minimum, all purposes
  vendors: Vendor[];
  dpoStats: DPOStats;
  dataAssets: DataAsset[];      // for Aurva
  auditTrail: AuditEntry[];
  breaches: BreachRecord[];
  grievances: GrievanceRecord[];
  deletionJobs: DeletionJob[];  // 3 jobs per deletion request
  notifications: Notification[];
}

interface CustomerProfile {
  name: string;         // from AM input — drives ALL display
  phone: string;        // from AM input
  consentId: string;    // ULID format: 01krbwnsdf881s7g1zvvf97tek
  guardianName?: string;
  isMinor: boolean;
  nomineeId?: string;
}

interface ConsentRecord {
  id: string;
  purpose: string;
  dataPoints: DataPoint[];
  status: 'ACTIVE' | 'REVOKED' | 'PENDING' | 'EXPIRED';
  expiryDate: string;   // "Your consent expires as of [date]"
  legalBasis: DPDPSection;  // §5, §7, etc.
  vendors: string[];
}
```

### Key Rule
**Customer name from AM input = lives everywhere.** When `customerName = "Romesh"`:
- Welcome message: "Welcome, Romesh"
- Consent ID record: "Romesh — 9 Active"
- DPO queue: "REQ-007994 — Romesh — Partial Revocation"
- Story narration: "Romesh logs into the portal..."
- API payload: `{ "data_principal": "Romesh", "phone": "..." }`
- Aurva audit: "Romesh's data accessed by V-Marketing"

---

## ENTRY FLOW (AM Setup → Demo Start)

```
AM Setup Screen (fullscreen modal)
  ↓ Enter: Company Name ("Vodafone India") + Industry (Telecom)
  ↓ Optional: Sub-industry, Customer Name (default: "Romesh")
  ↓ [Start Demo] button
  
  → DemoWorld generated (seeded PRNG)
  → LandingPage renders (industry-shaped company website)
  
LandingPage  [Vodafone India — real plans, colors, logo-safe design]
  → Cookie consent banner fires (bottom of page)
  → Customer clicks "Accept Essential" or "Accept All"
  
AuthFlow  [Login screen — company-branded]
  → "Enter your mobile number"
  → OTP screen → customer types THEIR name → OTP verified
  → customerName captured → DemoWorld hydrated with real name
  
ConsenTick  [Perfios consent notice — bottom sheet]
  → Essential Terms* tab (pre-ticked, required)
  → Optional Terms tab (toggleable per data point)
  → Per data point: expiry date visible inline
  → Globe icon: 22 languages
  → Vendor disclosure bottom sheet
  → "I Agree" → consentId issued
  
AppShell  [Authenticated app — all perspectives available]
```

---

## 5 PERSPECTIVES

### 1. Customer App (Mobile — 390×844)
Screens: Home → Consents → My Data → Notifications → Profile
Flows available:
- View active consents (9 shown, all with expiry)
- Partial revocation (toggle purpose → broadcast fan-out)
- Full revocation (all → deletion request triggered)
- Add-on request (new purpose consent)
- Guardian flow (§9 — minor detected → guardian login required)
- Nominee assignment (§14)
- Grievance submission (§13 — 48hr SLA)

### 2. Customer Portal (Tablet/Desktop)
Screens: Overview → Your Consents → Consent Detail → Modify → Request Deletion → Notifications
Data shown:
- "Welcome, [customerName] — 9 Active consents"
- Consent distribution donut
- Activity Timeline per consent (green=Updated, red=Revoked, yellow=Requested)
- Notifications: "2 Purposes revocation request sent", "expiring in 2 days"

### 3. CT Manager / DPO Console (Desktop)
Left nav: Dashboard / View Consents / Templates / Master Management / Consent Authorisation / Grievances / Breach Management / Cookie Management / Vendor Management / Consent Initiate

Consent Authorisation (3 sub-tabs):
- Partial Revocation: REQ-[id] → [customerName] → "Send for Approval" → fan-out to V-Finance + V-Marketing
- Full Revocation: REQ-[id] → broadcast all systems
- Data Deletion: DEL-REQ-[id] → 3 jobs (DB1, marketing-service-2, app-layer-3) → track status

KPIs: Active 193, Pending 17, Modification 12, Withdrawal 12, Compliant 122, Non-Compliant 30

### 4. DSPM / Aurva (Desktop)
Screens: Overview → Data Assets → Compliance → Audit Trail → Applications → Custom Policies
Key data:
- 15.2K Open Risks (5.8K DAM, 1.3K Data Privacy, 7.2K DSPM)
- Data Assets: "aadhaarbucket" (Risk 92, Public, GCP), Risk distribution
- Compliance: RBI 100%, SEBI 57%, Payment Security 42%, ISO 0%
- Audit Trail: 3.5K queries, top accessor with risk score
- On breach event: Aurva surfaces the breach record + proactive notification

### 5. DAM (Desktop)
Screens: Data Catalog → Lineage → Access Control → Classification
Links to Aurva risk scores. Shows data flows across the company.

---

## ALL FLOWS (Complete)

### Flow 1: Standard Consent Grant (Happy Path)
Cookie → Login/OTP → ConsenTick → Home

### Flow 2: Partial Revocation
Customer toggles marketing consent OFF →
CT Manager receives REQ → DPO approves →
Fan-out: POST /v-finance/consent-check (consent=NO for marketing, customerName) + POST /v-marketing/consent-check (consent=NO) →
V-Marketing action blocked →
Notification: "2 Purposes revocation request sent"

**DPDP**: §12 (right to withdraw), §11(2) (webhook fan-out obligation)
**Penalty**: ₹200Cr if purpose continues after withdrawal

### Flow 3: Full Revocation + Data Deletion
Customer: "Delete all my data" →
CT Manager: DEL-REQ created →
3 deletion jobs spawned: DB1 (customer records), marketing-service-2 (campaign data), app-layer-3 (usage logs) →
DPO Dashboard: tracks job completion →
Aurva: audits deletion across servers (§8 compliance check) →
All complete → "Data deleted" success screen

**DPDP**: §12(3) (erasure), §8 (retention obligation)
**SLA**: Reasonable timeframe (Bill guidance: 30 days)

### Flow 4: Deletion → Breach (Failure Path)
Same as Flow 3 but DB1 job FAILS →
Aurva detects undeletd data →
Breach notification triggered (72hr SLA per KPMG 2025) →
Breach Management in CT Manager: 1 new critical breach →
Notification to customer: "We have notified the Data Protection Board"

**DPDP**: §8(5) (security safeguards)
**Penalty**: ₹250Cr breach of safeguards

### Flow 5: Guardian / Minor Consent (§9)
During auth: phone flagged as minor (under 18) →
System: "Parental consent required" →
Guardian login: OTP to parent's phone →
Guardian reviews child's consent on their behalf →
Guardian approves → consent granted for minor →
CT Manager shows guardian relationship
Parent can manage/revoke from their own portal

**DPDP**: §9 (children and persons with disabilities)
**Penalty**: ₹200Cr for processing minor data without verifiable parental consent

### Flow 6: Nominee Assignment (§14)
Customer: Profile → Nominees → Add Nominee →
Enter nominee name + phone + relationship →
Nominee confirmation OTP →
Nominee can access/manage consents if customer becomes incapacitated

**DPDP**: §14 (right of nominee)

### Flow 7: Assisted / Agent Consent (Spandana Pattern)
Loan Officer scans customer's phone (or inputs details) →
LO attestation: "I confirm the Data Principal has given consent in my presence" →
OTP to customer (or customer signs on LO device) →
Consent granted with attestation record →
CT Manager shows: Consent Type = "Agent-Assisted", Agent ID = LO's ID

**DPDP**: §6(2) (meaningful consent), §6(7) (language accessibility)

### Flow 8: Employee / HR Consent (GMR Pattern)
HR portal entry (company = GMR) →
Employee consent for: payroll data sharing, EPFO, insurance →
Pre-filled from onboarding data →
Employee can partially revoke (e.g., opt out of marketing wellness programs) →
HR CT Manager dashboard shows employee consent health

**DPDP**: §7(b) (employment purposes), §7(f) (legal obligation)

### Flow 9: Consent Expiry + Renewal
Notification: "Your consent for Marketing expires in 2 days" →
Customer opens app → "Renew" button →
Re-shows ConsenTick with updated data points →
New consent ID issued with new expiry

**DPDP**: §5(1)(d) (retention limitation), §6(4) (specific purpose)

### Flow 10: Grievance Submission
Customer: "I have a complaint" →
Submit grievance form (type: data misuse / breach / non-deletion) →
CT Manager: Grievance queue → DPO assigned →
48hr SLA counter visible →
Resolution notice sent to customer

**DPDP**: §13 (right to grievance redress, 48hr SLA)

### Flow 11: Add-On Consent Request
Company pushes new purpose (e.g., "Credit Score Sharing") →
Customer gets notification →
Opens app → reviews new purpose →
Accepts / Declines
CT Manager: Consent Initiate feature used

**DPDP**: §6(1) (consent must be free, specific, informed)

### Flow 12: Cross-Border Data Transfer
Vendor disclosure shows international vendor (HubSpot, USA) →
Consent notice flags: "Data may be transferred outside India" →
CT Manager: Vendor Management shows cross-border status

**DPDP**: §16 (restriction on transfer outside India)

---

## THREE VIEW MODES

### Live Mode
- Full interaction, no overlays
- All buttons functional
- Cross-perspective reactivity: action in Customer App → CT Manager updates in <100ms
- Device switcher: Mobile (390×844) | Tablet (768×1024) | Desktop (1440×900) | Fullscreen

### Story Mode
- Auto-generates narration from `DemoEvent[]` log
- No pre-written scripts — every action logged → Story Mode reads log → narrates in plain English
- Shows: [Story caption] + [DPDP section badge] + [plain English regulation explanation]
- Example: "Romesh just revoked his marketing consent. Under §12 of the DPDP Act, every Data Principal has the right to withdraw consent at any time. Perfios ConsenTick broadcasts this withdrawal to all connected systems within milliseconds."
- Perspective-aware: same events narrated differently for Customer vs DPO view

### Technical Mode
- Right panel appears alongside the perspective
- Shows: API endpoint called + method + headers
- Request payload (JSON, JetBrains Mono)
- Response payload
- UML sequence diagram: participant boxes light up as calls happen (CSS animation)
- DPDP legal annotation inline: "§11(2) requires fan-out within reasonable time"

---

## CONSENSTICK COMPONENT (Perfios Product)

```
[Modal / Bottom Sheet]
┌─────────────────────────────────────┐
│  [Company Logo]    Powered by Perfios│
│  ─────────────────────────────────── │
│  [Essential Terms*] [Optional Terms] │  ← tabs
│                                      │
│  ○ Account Information               │
│    Name, Phone, Email                │
│    Expires: 31 Dec 2026  [i]         │
│    Vendors: CIBIL, Perfios           │
│                                      │
│  ○ Transaction History               │
│    Last 6 months statements          │
│    Expires: 30 Jun 2026  [i]         │
│                                      │
│  [🌐 22 Languages]  [Vendor Details ▾]│
│                                      │
│  [I Agree]  [Decline]               │
│                                      │
│  Consent ID: 01krbwnsdf881s7g1zvvf97tek │
└─────────────────────────────────────┘
```

Key behaviors:
- Essential Terms tab: pre-ticked, cannot toggle off (required)
- Optional Terms tab: each purpose toggleable independently
- Globe icon: opens language selector (22 scheduled languages)
- Vendor Details: bottom sheet with vendor list + their purpose
- Exit guard: "Are you sure? You may not be able to use this service" if Decline pressed
- Consent ID: ULID generated from seed

---

## DPDP LEGAL MAPPING (Inline at Every Screen)

Every screen that triggers a legal obligation shows a `§-badge`:

| Screen | Sections | Penalty |
|--------|----------|---------|
| Cookie consent | §6 (notice), §5 (lawful consent) | — |
| ConsenTick notice | §6(1) free/specific/informed, §6(7) language | ₹200Cr |
| Login as minor | §9 parental consent | ₹200Cr |
| Consent purpose view | §5(1)(b) specified purpose | — |
| Expiry shown | §5(1)(d) retention limitation | ₹200Cr |
| Vendor disclosure | §16 cross-border | — |
| Partial revocation | §12(1) right to withdraw | ₹200Cr |
| Fan-out API calls | §11(2) downstream obligation | ₹200Cr |
| Data deletion request | §12(3) erasure right | ₹200Cr |
| Deletion job tracking | §8 retention & security | ₹200Cr |
| Breach detected | §8(5) security safeguards | ₹250Cr |
| Grievance filed | §13 redress mechanism | — |
| 48hr SLA counter | §13 48-hour SLA | — |
| Nominee setup | §14 nominee rights | — |
| Guardian consent | §9 verifiable consent | ₹200Cr |
| Cross-border vendor | §16 transfer restriction | — |

---

## CT MANAGER FLOWS (DPO Console)

### Consent Authorisation — Partial Revocation
1. REQ-[seeded-id] appears in queue: [customerName] — Marketing Revocation
2. DPO clicks "Send for Approval"
3. Technical Mode shows:
   - POST /consent-bridge/revoke { customer: "[name]", purpose: "marketing" }
   - Fan-out: POST /v-finance/webhook { consent: "NO", purpose: "marketing", customer: "[name]" }
   - Fan-out: POST /v-marketing/webhook { consent: "NO", purpose: "marketing", customer: "[name]" }
   - Response from v-marketing: { action: "BLOCKED", reason: "consent=NO" }
4. Story Mode: "The DPO has approved [name]'s revocation. Perfios ConsenTick broadcasts a notification to all 4 connected systems simultaneously. When V-Marketing next tries to use [name]'s data for a campaign, it checks the consent bridge first — and receives a clear 'consent denied' response."

### Consent Authorisation — Data Deletion
1. DEL-REQ-[id] with 3 jobs visible:
   - DB1: Customer Records → Status: IN_PROGRESS / COMPLETE / FAILED
   - marketing-service-2: Campaign Data → Status
   - app-layer-3: Usage Logs → Status
2. DPO can click "DB Status" per job
3. Aurva sidebar updates: compliance check running
4. On all COMPLETE: success state
5. On any FAIL: breach workflow triggers (Flow 4)

---

## AURVA SCREENS (DSPM)

Data shown always reflects DemoWorld:
- Risk count = seeded number (around 15K for large company, 800 for microfinance)
- "aadhaarbucket" equivalent named after company's data store
- Compliance percentages: seeded per industry (Banking: RBI high, Insurance: IRDAI high, Telecom: TRAI medium)
- On breach event: new critical risk appears, Audit Trail gains entry
- Custom Policies: show OllaVigilance-style Block Guard / Detection Rules

---

## STORY HTML (Separate Deliverable)

File: `src/story-html/index.html` — standalone single-file HTML, hosted via Vite build, no download required.

### Structure
```
Header: Perfios DPDP Masterclass — Story Mode
Subheader: "Pick a role to see the DPDP journey from their perspective"

[Data Principal] [DPO / CT Manager] [CISO / DSPM]

On selection → full story renders below:
  Flow cards (Olivia-style — detailed, horizontal flow diagram per flow)
  Each card:
    - Flow name + one-line description
    - Step-by-step diagram (phase bubbles + connectors, canvas or SVG)
    - At each step: [DPDP §X] badge
    - Story narration (plain English, 2-3 sentences per step)
    - Backend/technical annotation (what API fires, what DB record created)
    - Penalty notice if applicable
```

### Flows per Profile
**Data Principal**: Standard consent, partial revocation, full revocation, deletion, grievance, add-on, expiry renewal, nominee, guardian (if minor), cross-border disclosure
**DPO / CT Manager**: Consent queue management, approval workflows, breach management, template management, vendor management, grievance SLA tracking
**CISO / DSPM**: Aurva risk dashboard, data asset classification, compliance reporting, breach audit trail, deletion verification, custom policy enforcement

### Design Language
- Canvas-based or SVG (improve on Vijay's reference dpdp_full.html)
- Color system: b1=#1E3A8A (blue), b2=#4F46E5 (indigo), b3=#D97706 (amber), b4=#DC2626 (red), b5=#7C3AED (purple) — match reference
- Inter font for body, JetBrains Mono for code snippets
- Phone mockup component for mobile flows
- Expandable detail sections per step (click to expand → see API payload)
- No dependencies — single file, everything inline

---

## THREE-SESSION PROTOCOL

### Session Roles
| Session | Window | Role |
|---------|--------|------|
| Builder (this) | Claude Code Window 1 | Sonnet — writes all code |
| Plan Reviewer | Claude Code Window 2 | Opus — reviews PLAN.md, writes LIVE_CONTEXT.md#instructions |
| Code Reviewer | Claude Code Window 3 | Opus — reviews each build phase, writes LIVE_CONTEXT.md#feedback |

### Shared State: LIVE_CONTEXT.md
All three sessions read/write `D:/Research/dpdp-demo/LIVE_CONTEXT.md`.
- Builder: updates `## Current Phase` + `## Last Built` after each step
- Plan Reviewer: writes under `## Reviewer Instructions`
- Code Reviewer: writes under `## Code Review Feedback`
- Rule: Builder reads `## Reviewer Instructions` before starting each phase

### Build Phases
```
Phase 0: Project scaffold (Vite + TS + Tailwind) + types.ts
Phase 1: Generator — seeded PRNG + all 5 industry templates + DemoWorld
Phase 2: AM Setup screen + LandingPage engine (3 industry variants)
Phase 3: Auth flow (Cookie → Login → OTP → ConsenTick)
Phase 4: DemoStore (Context + reducer + typed events)
Phase 5: Customer App perspective (mobile, all flows)
Phase 6: Customer Portal perspective (tablet/desktop)
Phase 7: CT Manager perspective (all 3 Consent Authorisation sub-tabs)
Phase 8: Aurva perspective (all screens)
Phase 9: DAM perspective
Phase 10: Story Mode (event log → auto-narration)
Phase 11: Technical Mode (API display + UML)
Phase 12: Device frames + fullscreen API
Phase 13: Export to HTML
Phase 14: Story HTML (standalone deliverable)
```

---

## OPEN QUESTIONS (RESOLVED)

1. **Customer name from login?** → YES. `customerName` entered by customer during OTP flow = populates every screen, every story, every API payload. This is non-negotiable core behavior.

2. **Story HTML hosting?** → Hosted via Vite build output. Single-file HTML at `/story` route OR a standalone file that AMs can open from a shared link (Vercel deploy planned). No download required.

3. **Fixed actors?** → NO. Zero fixed names in code. Generator creates world from inputs. If AM types "Priya" during demo, Priya's data is everywhere.

4. **Guardian journey?** → Built as Flow 5 within Customer App. Minor detection via phone number flag (AM can toggle "Mark as Minor" in AM Setup). Guardian journey per §9.

5. **Google-grounded data?** → Phase 1 uses seeded templates (Vodafone plans, HDFC products). Google grounding = future enhancement, not blocking Phase 1.

---

## SUCCESS CRITERIA

The demo is complete when:
- [ ] AM types company + industry → realistic landing page renders
- [ ] Customer types their own name → it appears on every screen, in every story
- [ ] All 12 flows completable end-to-end
- [ ] Every DPDP section surfaced inline with penalty amounts
- [ ] CT Manager fan-out shows named API calls to company-specific systems (V-Finance, V-Marketing)
- [ ] Deletion jobs tracked with company-realistic names (db1-vodafone-crm, etc.)
- [ ] Story Mode auto-narrates from actions (no pre-written scripts)
- [ ] Technical Mode shows real-looking payloads with customer's name
- [ ] Aurva breach detection triggers on deletion failure
- [ ] Story HTML profiles all 3 roles, all flows, DPDP-annotated
- [ ] Works on mobile frame (390×844) + tablet + desktop + fullscreen
- [ ] Vijay can use it live in a client call without preparation

---

*Next action: Plan Reviewer (Opus session) reads this file and writes instructions into LIVE_CONTEXT.md. Builder proceeds with Phase 0 on Plan Reviewer approval or after 30 minutes if no review.*
