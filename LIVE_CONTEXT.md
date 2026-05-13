# LIVE_CONTEXT.md — Perfios DPDP Masterclass
*Shared truth for all Claude Code sessions*
*Last updated by: Builder (Sonnet) | 2026-05-13*

---

## Current Phase
**Phase 14 — Story HTML standalone deliverable (IN PROGRESS)**
Phases 0–13 are COMPLETE. All 5 perspectives, 3 modes, full auth flow, and deletion/breach
scenario verified in-browser. One bug fixed (deletion job breach trigger — see decisions below).

---

## Build Log
| Phase | Status | Notes |
|-------|--------|-------|
| 0: Scaffold | ✅ COMPLETE | Vite 5 + React 18 + TS strict + Tailwind. No icon/animation/UI libs. |
| 1: Generator | ✅ COMPLETE | Mulberry32 PRNG, 5 industry templates, full DemoWorld type |
| 2: AM Setup + Landing | ✅ COMPLETE | 5 industry buttons, company-shaped landing page |
| 3: Auth / ConsenTick | ✅ COMPLETE | Cookie banner → Login → OTP → ConsenTick (Essential/Optional/vendors/22-lang) |
| 4: DemoStore | ✅ COMPLETE | Context + useReducer + emitEvent + updateJobStatus |
| 5: Customer App | ✅ COMPLETE | Mobile frame, 5 tabs: Home/Consents/MyData/Notifications/Profile |
| 6: Customer Portal | ✅ COMPLETE | Tablet frame, 4 sections: Overview/Consents/Deletion/Notifications |
| 7: CT Manager | ✅ COMPLETE | DPO Console dark sidebar, Dashboard + Consent Authorisation (3 sub-tabs) |
| 8: Aurva | ✅ COMPLETE | DSPM dark theme, 6 nav sections: Overview/Assets/Compliance/Audit/Apps/Policies |
| 9: DAM | ✅ COMPLETE | Data Asset Manager light theme, catalog table + lineage view |
| 10: Story Mode | ✅ COMPLETE | Event log → auto-narrated captions. No pre-written scripts. |
| 11: Technical Mode | ✅ COMPLETE | Live API method/path/status/request/response per event |
| 12: Device frames | ✅ COMPLETE | Mobile 390×844 notch, Tablet 768×600, Desktop/Fullscreen |
| 13: DemoShell | ✅ COMPLETE | Top bar, perspective switcher, mode switcher, fullscreen, reset |
| 14: Story HTML | 🔄 IN PROGRESS | Single-file hosted deliverable, 3 profiles |

---

## Verified In-Browser (2026-05-13)

All verified via preview tool end-to-end with "Vodafone India" + "Romesh Sharma":

| Test | Result |
|------|--------|
| AM Setup → Telecom landing page | ✅ Vodafone-shaped hero, plans, nav |
| Cookie banner → §6 DPDP badge | ✅ |
| Login → OTP → name entry | ✅ |
| ConsenTick Essential/Optional tabs | ✅ ULID consent ID, vendor sheet, expiry dates |
| DemoShell top bar + perspective tabs | ✅ |
| Customer App (mobile frame, 5 tabs) | ✅ |
| Customer Portal (tablet frame) | ✅ "Romesh Sharma" in header |
| CT Manager DPO Dashboard | ✅ All recent activity rows show customer name |
| Aurva DSPM Overview | ✅ 13,237 risks, company-named assets |
| DAM catalog + lineage | ✅ 4 Vodafone assets, lineage chain |
| Story Mode — partial revocation | ✅ "Romesh Sharma withdraws consent" + §12 card |
| Technical Mode — API payload | ✅ POST /consent-bridge/revoke, customer name in body |
| CT Manager fan-out (4 systems) | ✅ 4× FANOUT_DISPATCHED in event log |
| Deletion jobs → Job 3 FAILED | ✅ (after stale-closure bug fix) |
| Breach alert in CT Manager | ✅ "🚨 Breach Detected — §8(5)" banner |
| Reset → full re-run | ✅ |

---

## All Design Decisions (for Opus Review)

### A. Architecture

**A1. Seeded PRNG (Mulberry32)**
- Seed = `"${companyName}::${industry}::${customerName}::${phone}"`
- Same inputs → identical DemoWorld every time → demo repeatability
- `hashString(seed) → number → mulberry32() → () => float`
- Methods: `next()`, `int(min,max)`, `pick<T>()`, `shuffle<T>()`, `bool(p)`, `ulid()`, `reqId()`, `delReqId()`, `futureDate()`, `pastDate()`
- **Why Mulberry32 over Math.random()**: Math.random() is non-seedable. Mulberry32 is a simple, fast, statistically adequate PRNG for demo purposes.

**A2. No fixed actors — customer name from login**
- AM Setup screen takes company + industry (shapes the world seed)
- Customer name entered at OTP screen → `dispatch SET_WORLD` with updated customer.name
- Every screen, story narration, and API payload reads from `world.customer.name`
- **Why deferred to OTP**: The AM enters company/industry to generate the world, but the demo adapts to whatever name the prospect types at login. This makes the demo feel personal without requiring the AM to know the customer's name upfront.

**A3. Event log → auto-narration (no pre-written scripts)**
- Every user action calls `emitEvent({ type, actor, perspective, payload, dpdpSection })`
- StoryPanel reads `state.eventLog` and maps each event type to a generated caption
- TechnicalPanel reads the same log and builds API call display
- **Why**: Pre-written scripts break when the customer name changes or when events fire in different order. Event-driven narration is always accurate.

**A4. All 5 perspectives simultaneously mounted**
- All perspective components are always in the DOM
- Visibility = `style={{ display: activePerspective === x ? 'flex' : 'none' }}`
- **Why not conditional rendering**: Unmounting/remounting causes React state loss (local UI state like active tabs, scroll position). Sub-100ms switching with no flicker.

**A5. React Context + useReducer (no Zustand/Redux)**
- Single `DemoContext` with `state`, `dispatch`, `emitEvent`, `updateJobStatus`
- **Why**: No external dependencies. TypeScript-native. The store shape is simple (one DemoWorld + one event log). Zustand would add a package for no gain.

**A6. TypeScript strict mode, no UI component libraries**
- Tailwind only. No Radix, Headless UI, shadcn.
- **Why**: Demo must be portable, zero npm audit surface, and fully controllable for pixel-perfect Perfios branding.

---

### B. Generator & DemoWorld

**B1. Industry templates (5)**
Each template exports: `build[Industry]Company(name, rng)`, `build[Industry]DataAssets(short, rng)`, `build[Industry]Compliance(rng)`
- Telecom: Vodafone India / Airtel / Jio / Vi + telecom-specific products (prepaid, fiber, roaming)
- Banking: HDFC / SBI / ICICI / Axis + banking products (savings, FD, loans)
- Insurance: HDFC Life / LIC / Max Life + insurance products (term, health, ULIP)
- Microfinance: Spandana / Arohan + JLG loan products
- HR/Corporate: GMR / Infosys + employee HR products

Company matching uses fuzzy string comparison against known brand names. If matched, uses real brand color + logo initials. Fallback: rng.pick() from template list.

**B2. DemoWorld shape**
```
DemoWorld {
  company: { name, shortName, industry, primaryColor, logoInitials, products[], systems[], tagline }
  customer: { name, email, phone, isMinor, guardianPhone }
  consents: ConsentRecord[]   // 8 consents, mix of ACTIVE/REVOKED/PENDING
  vendors: Vendor[]           // 4-7 vendors, some with crossBorder flag
  dpoStats: { pending, approved, rejected, avgResolutionHours, pendingGrievances, ... }
  dataAssets: DataAsset[]     // industry-specific, with riskScore, tags, issues
  complianceScores: []        // DPDP, ISO 27001, SOC 2, RBI DPAP
  auditTrail: AuditEntry[]    // 15 past queries
  breaches: Breach[]          // 0-2 pre-seeded open/resolved breaches
  grievances: Grievance[]     // 2-4 grievances
  deletionJobs: DeletionJob[] // exactly 3 jobs: DB, CRM, App layers
  notifications: Notification[]
  openRisks: { total, dam, dataPrivacy, dspm }
}
```

**B3. ConsentRecord shape**
Each consent has: `id`, `requestId` (ULID), `purpose`, `status`, `dataPoints[]`, `vendors[]`, `activityTimeline[]`, `expiryDate`, `expiryDaysRemaining`, `dpdpSection`

**B4. Systems array (fan-out targets)**
Each company has a `systems: System[]` array. Each system: `{ id, name, endpoint }`.
Telecom example: `[{ id: 'v-finance', name: 'V-Finance', endpoint: '/v-finance/webhook' }, { id: 'v-marketing', ... }]`
Fan-out loops over this array → POST to each endpoint with `{ consent: 'NO', purpose, customer }`.

---

### C. Auth Flow

**C1. Stage machine**
`FlowStage = 'am-setup' | 'landing' | 'auth-login' | 'auth-otp' | 'consent' | 'app'`
Linear progression. No back-navigation (AM controls the demo). Reset → back to `am-setup`.

**C2. OTP boxes**
6 controlled inputs with `id="otp-${i}"`. Single-char auto-advance on input.
The OTP value is accepted if all 6 boxes are filled — no validation against a "sent" OTP (demo context).

**C3. Minor / guardian flow**
- AM Setup has a "Mark as Minor (under 18)" toggle
- If minor: AuthFlow shows guardian notice + guardian phone after OTP
- `§9` badge surfaced — guardian consent required
- Guardian OTP screen (separate from customer OTP) not yet fully built — currently shows notice only

**C4. Name propagation**
```typescript
dispatch({ type: 'SET_WORLD', payload: { ...world, customer: { ...world.customer, name: finalName } } })
```
Called immediately on OTP verification. All 5 perspectives re-render with new name.

---

### D. ConsenTick

**D1. Essential / Optional tabs**
- Essential: non-toggleable (greyed toggle), required for service
- Optional: individually toggleable, each with purpose + expiry date + §-badge
- Per-consent expiry shown in amber

**D2. Vendor bottom sheet**
- Shows vendor name, purpose, cross-border flag
- Cross-border vendors get `§16` badge (Cross-Border Transfer)
- Tapping vendor expands detail row

**D3. Language picker**
- Globe icon → 22 Indian scheduled languages (DPDP §6(7) requirement)
- Visual only (no actual translation) — surfaces the legal requirement

**D4. Exit guard**
- Clicking outside the modal triggers a confirmation dialog before dismissal
- `§6` badge: "Consent must be informed and unambiguous"

**D5. Consent ID**
- `01` + 24 alphanumeric chars (ULID-like format)
- Displayed on consent success screen
- Echoed in every API payload as `consent_id`

---

### E. DemoStore

**E1. Reducer actions (full list)**
```
SET_WORLD | SET_AM_INPUT | ADVANCE_STAGE | GRANT_CONSENT | PARTIAL_REVOKE | FULL_REVOKE |
SET_PERSPECTIVE | SET_MODE | SET_DEVICE_FRAME | EMIT_EVENT | SET_CT_TAB | DPO_APPROVE |
DELETION_JOB_UPDATE
```

**E2. emitEvent helper**
Wraps `dispatch(EMIT_EVENT)` — auto-injects `id` (random) and `timestamp` (Date.now()).
Returns void. Called from any perspective component.

**E3. updateJobStatus**
```typescript
updateJobStatus(jobId: string, status: DeletionJobStatus, failureReason?: string) => void
```
When status = `'FAILED'`, the reducer auto-emits a `BREACH_DETECTED` event and adds an open breach to `world.breaches`.

**E4. Bug fixed: stale closure in deletion job timeout**
Original code: `const shouldFail = i === deletionJobs.length - 1 && state.world?.breaches.length === 0`
Problem: `state` captured in render closure → stale by the time setTimeout fires (3+ seconds later). Also, `world.breaches` is pre-seeded with data, so length was never 0.
Fix: `const shouldFail = i === deletionJobs.length - 1` — always fail last job. Demo scenario is deterministic.

---

### F. 5 Perspectives

**F1. Customer App (mobile frame 390×844)**
5 tabs: Home, Your Consents, My Data, Notifications, Profile
- Home: welcome card + quick actions + recent consents + notifications badge
- Consents: toggle per-consent with `§12` revoke button
- My Data: data points with category/sensitivity, deletion request CTA
- Notifications: expiry warnings, approval confirmations, breach alerts
- Profile: name, email, phone, nominee section

**F2. Customer Portal (tablet frame 768×600)**
4 sections: Overview (KPI grid + consent distribution), Your Consents (cards with revoke), Request Deletion (checkbox list → 3 jobs), Notifications
- Revoke button: `dispatch PARTIAL_REVOKE` + `emitEvent CONSENT_PARTIAL_REVOKE`
- Deletion: `dispatch FULL_REVOKE` + `emitEvent DELETION_REQUESTED`

**F3. CT Manager / DPO Console (desktop frame)**
Dark sidebar, 9 nav items. Key sections:
- DPO Dashboard: pending/approved/rejected KPIs, recent activity list
- Consent Authorisation: 3 sub-tabs (Partial / Full / Deletion)
  - Partial: shows revoked/pending consents, fan-out preview with system endpoints, "Send for Approval" → `DPO_APPROVE` + setTimeout fan-out per system
  - Full: one-click full revocation → `FULL_REVOKE` + `CONSENT_FULL_REVOKE`
  - Deletion: 3 job cards with status chips, "Execute Deletion Jobs" → sequential timeouts → IN_PROGRESS → COMPLETE/FAILED, last always FAILED
- Grievances, Breach Management, Cookie Management (display only)

**F4. Aurva DSPM (desktop frame)**
Dark theme, teal "A" logo, 6 nav sections:
- Overview: breach alert (if active), 4-KPI risk grid, critical assets list
- Assets: full list with risk scores + issues
- Compliance: DPDP/ISO/SOC 2/RBI DPAP progress bars
- Audit Trail: table of data access queries
- Applications: app count KPIs + topology placeholder
- Policies: 4 custom policies (Block/Detection types)

**F5. DAM — Data Asset Manager (desktop frame)**
Light theme, indigo "DA" logo:
- 4 KPI cards: Total/Critical/Public Exposure/With Issues
- Data Catalog table: name, sensitivity, tags, exposure, cloud, size, risk score
- Customer data lineage: assets → → → flow diagram

---

### G. Story Mode

`generateCaption(event, customerName, companyName)` maps every `DemoEventType` to `{ headline, detail }`.
- headline: one-line plain-English summary with customer + company names interpolated
- detail: 2-3 sentences with DPDP Act section reference and compliance context
- DPDP tag card: blue box showing section code, label, explanation, penalty

All 18 event types covered: COOKIE_ACCEPT, LOGIN_INITIATED, OTP_VERIFIED, CONSENT_GRANTED, CONSENT_PARTIAL_REVOKE, CONSENT_FULL_REVOKE, DELETION_REQUESTED, DELETION_JOB_STARTED, DELETION_JOB_COMPLETE, DELETION_JOB_FAILED, BREACH_DETECTED, GUARDIAN_REQUIRED, GUARDIAN_VERIFIED, NOMINEE_ADDED, GRIEVANCE_SUBMITTED, FANOUT_DISPATCHED, FANOUT_BLOCKED, DPO_APPROVED.

---

### H. Technical Mode

`buildAPIDisplay(event, customerName, companyShort)` returns: `{ method, path, status, requestBody, responseBody, latencyMs }`

- Method colour: GET=green, POST=blue, PUT=amber, DELETE=red, PATCH=purple
- Error states (status ≥ 400): red border, red response body with `breach_notification_triggered: true`
- Latency: `Math.floor(Math.random() * 80) + 20` ms (20–100ms range)
- Request body always includes: `data_principal`, `consent_id`, `customer`, `company`, `timestamp`, `dpdp_section`

---

### I. Device Frames

| Frame | Dimensions | CSS classes | Chrome |
|-------|-----------|-------------|--------|
| Mobile | 390×844 | rounded-[44px] | Notch div + home indicator |
| Tablet | 768×600 | rounded-[20px] | Camera dot |
| Desktop | 1024×768 | rounded-xl | Thin border |
| Fullscreen | 100% | none | Fullscreen API |

Border color: `3px solid ${company.primaryColor}30` — subtle company-color tint on all frames.

---

### J. DPDP Legal Tags

`DPDP_TAGS: Record<DPDPSection, { section, label, penalty, explanation }>`

| Section | Label | Penalty |
|---------|-------|---------|
| §5 | Lawful Processing | ₹200 Cr |
| §6 | Notice & Consent | ₹200 Cr |
| §8 | Data Retention & Quality | ₹200 Cr |
| §8(5) | Security Breach Notification | ₹250 Cr |
| §9 | Children's Data | ₹200 Cr |
| §11 | Right to Access | — |
| §12 | Right to Erasure | ₹200 Cr |
| §13 | Grievance Redressal | 48hr SLA |
| §14 | Nominee Rights | — |
| §16 | Cross-Border Transfer | — |

---

## Questions for Opus Review

1. **Guardian flow (§9)**: Currently shows a notice screen after OTP if `customer.isMinor`. No actual guardian OTP verification implemented. Is this sufficient for a demo, or should we build the full guardian → OTP → approve flow?

2. **Deletion flow initiation**: The deletion jobs demo currently requires the AM to navigate to CT Manager → Consent Authorisation → Data Deletion and click "Execute Deletion Jobs" manually. There's no automatic trigger from the Customer Portal "Submit Deletion Request" button into the CT Manager. Should we wire this cross-perspective state change?

3. **Event ordering bug risk**: Fan-out uses `company.systems.forEach((sys, i) => setTimeout(i * 400))`. If the AM switches perspectives quickly during fan-out, the events still fire but the Technical panel may not scroll. Is this a problem worth solving?

4. **seeded-random.ts has `type bool = boolean`** at the bottom — unused type alias. May trigger `noUnusedLocals` on full strict build. Should be removed.

5. **Story HTML (Phase 14)**: Should this be a React component that renders server-side / export, or a pure static HTML file? Current plan is a standalone `index.html` with embedded CSS + vanilla JS (no React). Confirm approach before building.

6. **BREACH_DETECTED auto-trigger**: `updateJobStatus(FAILED)` in the store reducer auto-dispatches `BREACH_DETECTED`. This means any failed job triggers a breach even if one already exists. Should there be a guard? (Current code doesn't check for existing open breaches before adding another.)

---

## File Map
```
dpdp-demo/
├── src/
│   ├── store/
│   │   ├── types.ts          — All TypeScript types (DemoWorld, DemoEvent, DemoAction, ...)
│   │   └── store.tsx         — DemoProvider, useReducer, emitEvent, updateJobStatus
│   ├── generator/
│   │   ├── seeded-random.ts  — Mulberry32 PRNG
│   │   ├── legal-tags.ts     — DPDP_TAGS (§5–§16)
│   │   ├── index.ts          — generateDemoWorld()
│   │   └── templates/
│   │       ├── telecom.ts
│   │       ├── banking.ts
│   │       ├── insurance.ts
│   │       ├── microfinance.ts
│   │       └── hr.ts
│   ├── flows/
│   │   ├── AMSetup.tsx       — Company + industry + customer input
│   │   ├── LandingPage.tsx   — Industry-shaped hero + cookie banner
│   │   ├── AuthFlow.tsx      — Login + OTP + name entry
│   │   └── ConsenTick.tsx    — Consent modal (Essential/Optional/vendors/language)
│   ├── perspectives/
│   │   ├── CustomerApp/      — index.tsx + 5 tab files
│   │   ├── CustomerPortal/   — index.tsx
│   │   ├── CTManager/        — index.tsx + ConsentAuthorisation.tsx
│   │   ├── Aurva/            — index.tsx (monolithic, 6 sub-components)
│   │   └── DAM/              — index.tsx
│   ├── modes/
│   │   ├── StoryPanel.tsx    — Event log → narrated story cards
│   │   └── TechnicalPanel.tsx — Event log → API call display
│   ├── shared/
│   │   └── DeviceFrame.tsx   — Mobile/Tablet/Desktop/Fullscreen frames
│   ├── DemoShell.tsx         — Top bar + perspective tabs + mode panels
│   └── App.tsx               — Stage router (am-setup → landing → auth → app)
├── PLAN.md                   — Original 14-phase build spec
└── LIVE_CONTEXT.md           — This file
```

---

## Next: Phase 14 — Story HTML

Single `index.html` with embedded CSS + vanilla JS. 3 profiles:

**Profile 1 — Data Principal**: Priya's journey from cookie consent → ConsenTick → partial revocation → full revocation → deletion request
**Profile 2 — DPO**: The DPO's view: pending queue → approving revocations → fan-out → deletion jobs → breach response
**Profile 3 — CISO**: The security posture: open risks → breach detected → 72hr clock → Data Protection Board notification

Each event annotated with the DPDP section, penalty, and real-world implication. Hosted (not downloaded). Shareable link.

---

## Foundation Reset — Opus Review v2 (2026-05-13)

> **Earlier "Reviewer Instructions — Phase 14 Build Spec" superseded.** Phase 14 (Story HTML) is paused — the underlying demo has foundational issues that must be fixed first or Phase 14 will inherit them.
>
> **No AG in this project — Sonnet is the builder.** Prompts below are written to hand directly to a Sonnet session (or to execute in-line). Reference assets live at `G:\Downloads\CM\` — read those before fixing CT Manager / Aurva / ConsenTick / Cookie banner.
>
> **Thursday deadline** (per 2026-05-11 meeting with Olivia): Vodafone customer-facing flow screens. P0 prompts below cover that. P1/P2 prompts are post-Thursday polish.

### Reference assets (single source of truth)

| Asset | Path | What it shows |
|-------|------|---------------|
| Cookies modal | `G:\Downloads\CM\Cookies consent.webp` + `Cookies consent 2.webp` | Full modal — Settings tab, Essentials/Functional/Analytical/Performance categories with per-cookie toggles, language picker, Save/Deny/Allow buttons, "Powered by Consentick \| Perfios" |
| ConsenTick mobile | `G:\Downloads\CM\Consent screens 1.webp` (+ 2 + 3) | Mobile ConsenTick widget — header with ConsenTick logo, Essential/Optional tabs with checkboxes per data point, expiry date per purpose, vendor-list-per-data-point bottom sheet, Yes/No confirmation dialogs |
| Consent capture flow (UML) | `G:\Downloads\CM\Flow.webp` | Data Fiduciary → Data Principal → Consent Manager SaaS → CM Bridge sequence: POST /consent/initiate → Validate → Consent WebUrl → Embed → User Reviews → POST /consent/submit → Real-time Sync → Sync ACK → 200 OK → Redirect |
| Perfios DPDP architecture | `G:\Downloads\CM\Architexture 3.webp` | Master functional diagram — Perfios SaaS (Consent Manager: Artifacts/Templates/Engine/AuditTrails/CM-Bridge-Connectors); Consent Manager Embeddable Interface (Capture/Modification/Withdrawal/Grievance/Deletion); Data Fiduciary on-premise (CM Bridge + Admin Portal + DSPM + Core Business Units); Data Processors |
| AWS infra architecture | `G:\Downloads\CM\Architexture 1.webp` / `2.webp` | AWS Cloud → Route 53 → WAF → ALB/EKS → Redis/MySQL/MongoDB across 2 AZs. Use for Tech tab DB/encryption symbols. |
| CM Manager (Perfios) screens | `G:\Downloads\CM\cm_screens_extracted\page_01.png` ... `page_25.png` | 25-page deck of real Perfios CM Manager (CT Manager) + customer-facing ConsenTick widget. White theme, "Perfios \| CT Manager" wordmark, light sidebar nav (DPO Dashboard / View Consents / Templates / Master Mgmt / Consent Authorisation / Grievances / Breach Mgmt / Cookie Mgmt / Vendor Mgmt / Consent Initiate). |
| Aurva screens | `G:\Downloads\CM\aurva_screens_extracted\page_01.png` ... `page_07.png` | 7-page deck of real Aurva DSPM. **WHITE background**, "aurva" lowercase with green leaf, narrow icon-only sidebar, KPI cards (TOTAL ASSETS / BY TYPE / SENSITIVE ASSETS / RISKY ASSETS), PHI/PCI/PII pill tags, risk-score circles |
| Consent Manager FAQ | `G:\Downloads\CM\Consent Manager FAQ.pdf` | Product reference |
| DPDP Act | `G:\Downloads\CM\DPDP ACT.pdf` | Legal reference |
| KPMG Guidelines | `G:\Downloads\CM\KMPG Guidelines.pdf` | Compliance reference |
| Olivia meeting notes | `G:\Downloads\CM\OM Meeting points.md` | Deadlines + scope from Olivia |

### Architectural correction — design tokens

**Root cause** of branding drift: every screen uses `company.primaryColor` for accents. This is wrong for Perfios + Aurva + ConsenTick (which are *Perfios's products*, not the Data Fiduciary's).

**Fix (do this first, all prompts below depend on it):**

Add to `src/index.css` (or `src/styles/tokens.css`, new file):
```css
:root {
  --perfios-blue: #1e4d8c;       /* extract exact from references — looks like a deep navy blue */
  --perfios-blue-50: #eff4fb;
  --aurva-green: #00a878;        /* aurva leaf green — extract exact from page_01 */
  --aurva-gray: #f8f9fa;         /* aurva canvas */
  --consentick-blue: #1e4d8c;    /* same as perfios */
}
```

**Convention going forward:**
- **Perfios products** (ConsenTick, CT Manager) → use `--perfios-blue`, never `company.primaryColor`
- **Aurva** (DSPM) → use `--aurva-green`, never `company.primaryColor`
- **Data Fiduciary's own site** (Landing page only) → may use `company.primaryColor` as a single accent on the logo + maybe one CTA, but background stays white and overall feel stays neutral

Anywhere a component currently uses `style={{ backgroundColor: company.primaryColor }}` for a Perfios/Aurva surface, it's wrong and needs to be replaced with the correct token.

---

### Sonnet Prompts — execution order

> **Format:** Each prompt is self-contained. Hand to Sonnet by saying *"Execute prompt P0-1 from `D:/Research/dpdp-demo/LIVE_CONTEXT.md`"*. Sonnet reads the file, finds the prompt, executes. Same for any other.
>
> **Priority:** P0 = Thursday deadline (Vodafone customer flow). P1 = post-Thursday foundation. P2 = polish + missing DPDP flows.

---

#### P0-1 — AM Setup: drop customer fields, add journey type, white theme

**File:** `src/flows/AMSetup.tsx`

**Why:** Vijay's feedback (2026-05-13) — AM doesn't need to know customer name/phone (customer enters those at OTP). Minor toggle is too narrow — DPDP has multiple journey types (Self / Assisted / Guardian / Disabled / Minor). White theme per direction.

**Changes:**
1. **Remove fields:** `customerName`, `phone` (both local state and the input UIs at lines 18-19 and 84-108).
2. **Replace `isMinor` toggle (lines 110-127) with a Journey Type dropdown:**
   ```
   Journey Type: Self | Assisted | Guardian (Minor) | Guardian (Disabled) | Assisted (Senior Citizen)
   ```
   Store as `journeyType: 'self' | 'assisted' | 'guardian-minor' | 'guardian-disabled' | 'assisted-senior'`.
3. **Add to type:** `DemoAppState['amInput']` (in `src/store/types.ts`) — remove `customerName`, `phone`, `isMinor`. Add `journeyType: JourneyType`. Define `export type JourneyType = ...` in same file.
4. **Pass-through:** `generateDemoWorld(companyName, industry, journeyType)` — update generator signature. World stores `customer.journeyType`. Customer name/phone stay empty strings until OTP screen fills them.
5. **Theme:** Change root from `bg-gradient-to-br from-slate-900...` (line 36) to `bg-white` or `bg-slate-50`. All text from white to slate-900. Card from `bg-white/5 backdrop-blur` to `bg-white border border-slate-200 shadow-sm`. Buttons use `var(--perfios-blue)`, not blue-600 (though blue-600 is close enough — see token decision in "Architectural correction" above).
6. **Logo at top:** Replace "Perfios — DPDP Masterclass" pill with the proper Perfios wordmark per `cm_screens_extracted/page_15.png` ("Perfios | CT Manager" style — for AM Setup it should be "Perfios | Demo Setup").

**Acceptance:**
- AM Setup loads, white background
- 3 inputs only: Company Name, Industry (5 buttons), Journey Type (dropdown)
- "Launch Demo" works → advances to landing
- World generates without customer.name (it stays empty string)
- No console errors

---

#### P0-2 — Cookie banner: replace with full ConsenTick modal replica

**File:** `src/flows/LandingPage.tsx` (mainly the `CookieBanner` component at lines 163-193, plus integration at line 53-57)

**Why:** Reference `G:\Downloads\CM\Cookies consent.webp` shows the real product is a *modal* with Settings tabs, per-cookie toggles, language picker, "Powered by Consentick \| Perfios" footer. Current implementation is a bottom-fixed bar. Vijay's instruction: "Cookie banner should come only after reading — user can provide consent" — interpret as a modal user must interact with (Allow All / Deny All / Save Settings).

**Changes:**
1. **Delete** the `CookieBanner` function entirely (lines 163-193).
2. **Create new file** `src/flows/CookieConsentModal.tsx` — full modal matching `Cookies consent.webp`:
   - Modal: centered, max-width ~900px, white bg, rounded-2xl, shadow-2xl, fixed inset-0 + black/40 backdrop
   - Top bar: "Cookies" heading (left) + language picker pill (right, says "English" with globe icon, click → opens 22-lang picker)
   - "Settings" tab indicator below (active = blue underline)
   - Description paragraph: "Cookies used on the site are categorized..." (use exact text from reference)
   - 4 expandable categories with toggle (right side):
     - **Essentials (2)** — "Always Active" green pill, no toggle. Expanded shows: Cloudflare (toggle off, "Show Cookies (1) >") and Calendly (toggle off, "Show Cookies (1) >")
     - **Functional (1)** — toggleable (off by default)
     - **Analytical (1)** — toggleable (off by default)
     - **Performance (1)** — toggleable (off by default)
   - Bottom action row: "Save Settings" (outlined blue, left) + spacer + "Deny All" (outlined) + "Allow All Cookies" (filled blue, right)
   - Footer: right-aligned, "Powered by Consentick | Perfios" small gray text
3. **Update `LandingPage.tsx`:**
   - Line 53-57: replace `<CookieBanner ... />` with `<CookieConsentModal ... />`
   - The modal should NOT auto-show on landing load. Add a "Cookie Settings" link in the footer (line 155 already has it stub) → clicking it opens the modal.
   - On *first interaction* with Sign In / Get Started buttons → show modal if not yet `cookieAccepted`. Modal must be dismissed (any of 3 actions) before login proceeds.
   - Actions: "Allow All Cookies" → `ACCEPT_COOKIE` + emit `COOKIE_ACCEPT` (§6). "Deny All" → `ACCEPT_COOKIE` + emit `COOKIE_DECLINE_ESSENTIAL` (still let them through, but with only essentials). "Save Settings" → respect per-category toggles, emit `COOKIE_ACCEPT` with payload of category state.
4. **Type addition:** new event type `COOKIE_DECLINE_ESSENTIAL` already exists in types (line 226) — wire it in StoryPanel + TechnicalPanel.

**Acceptance:**
- Landing page loads, no cookie banner visible
- Click "Sign In" or "Get Started" → cookie modal appears
- Three actions all dismiss modal and proceed
- Modal visually matches `Cookies consent.webp` (white, centered, Settings tab, 4 categories with toggles, footer)
- Cannot proceed to login without acting on the modal

---

#### P0-3 — Customer-facing screens: white theme, drop fake branding

**Files:** `src/flows/LandingPage.tsx`, `src/flows/AuthFlow.tsx`, `src/perspectives/CustomerApp/*.tsx`, `src/perspectives/CustomerPortal/index.tsx`

**Why:** Vijay (2026-05-13): customer landing page white, no brand color theming right now, just play with products and general style/layout/options. Same applies to Customer App (mobile) and Customer Portal (tablet).

**Changes:**
1. **LandingPage.tsx:**
   - Line 89-112: hero section currently has `style={{ background: 'linear-gradient(135deg, ${company.primaryColor} 0%, ${company.secondaryColor})' }}` — replace with white bg + minimal accent. Hero should be: white bg, large bold dark heading, gray subheading, two CTAs (filled blue primary, outlined secondary). No company-color gradient.
   - Line 60-86: nav bar stays white but replace `style={{ backgroundColor: company.primaryColor }}` on the logo square (line 64) with a neutral dark slate. Keep company name text. "Sign In" button: solid blue (use perfios-blue token), not company color.
   - Line 117-138: product cards — remove the company-color `category` pill (line 121) and the colored price text (line 125). Use neutral gray category, dark price. "Get Started →" link: neutral gray, hover blue.
   - Goal: looks like a *generic* clean white site with product cards. Industry-shaped content (text labels) stays, but visual styling is neutral.
2. **AuthFlow.tsx:**
   - Line 58-63: replace company-color logo square with a neutral gray rounded square + company name in text only.
   - Lines 88, 102, 146: replace `style={{ backgroundColor: company.primaryColor }}` with `className="bg-[var(--perfios-blue)]"` or `className="bg-blue-700"`.
   - Line 75: phone country code "+91" prefix: keep gray.
   - Line 10: `useState(world.customer.phone)` — change to `useState('')` (after P0-1 ships, world.customer.phone will be empty).
3. **CustomerApp tabs and CustomerPortal:** scan for any `style={{ backgroundColor: company.primaryColor }}` or `color: company.primaryColor` — replace with neutral grays / Perfios blue. Files: `CustomerApp/HomeTab.tsx`, `ConsentsTab.tsx`, `MyDataTab.tsx`, `NotificationsTab.tsx`, `ProfileTab.tsx`, `CustomerPortal/index.tsx`. (Sonnet: grep these files first, list every brand-color reference, apply the substitution.)

**Acceptance:**
- Landing page is white with neutral styling, products are visible, single blue CTA
- Auth screen is white with neutral styling
- Customer App mobile-frame screens look clean white with blue Perfios accents only
- Customer Portal tablet-frame screens same
- No `company.primaryColor` references remain in customer-facing files (CT Manager and Aurva are separate — handled in P1)

---

#### P0-4 — ConsenTick: replica + real 22-language translations

**Files:** `src/flows/ConsenTick.tsx`, new file `src/flows/consent-translations.ts`

**Why:** Real product reference at `Consent screens 1/2/3.webp` and `cm_screens_extracted/page_02.png + page_05.png`. Current implementation has wrong header ("Your Consent Request"), wrong buttons ("Decline / I Agree" vs ref "Agree Essentials / Agree All Terms"), missing confirmation checkbox, missing per-data-point time period, language picker that does nothing. Vijay (Q3): hardcoded JSON translations are fine — flag as "demo, replace with legal-approved copy before production."

**Changes:**
1. **Header rewrite:**
   - Top bar: "Perfios" wordmark left + globe icon right + close X right. (NOT company logo — ConsenTick is a Perfios product.)
   - Heading: "Welcome {customer.name}," (large bold)
   - Privacy paragraph: "We value your privacy and are committed to being transparent about how we handle your data. As per data protection laws, we need your consent to collect, process, and use your personal data for the purposes mentioned below."
   - Sub-paragraph: "You have the right to review, change, or withdraw your consent anytime, as per legal guidelines."
   - Sub-paragraph: "To access the detailed purpose(s) associated with each data point, please click on the respective data point provided below"
2. **Tabs:** "Essential Terms*" / "Optional Terms" (asterisk on Essential) — match reference position + style.
3. **Per-purpose accordion (NEW structure):**
   - Each PURPOSE is the top-level accordion (e.g. "To Validate your Identity")
   - Expanded shows data points under that purpose with checkboxes (e.g. Name, Aadhaar)
   - Below the data point list: "Consent Expiry Date: 7 Nov, 2026" in gray small text
   - This is a structural inversion from current — current is data-point-first, ref is purpose-first.
4. **Confirmation checkbox** (above buttons): `[ ] I hereby confirm that by selecting "Agree to All Terms", I accept both essential and optional terms.` (Required check before "Agree All Terms" button is enabled.)
5. **Footer links** (above buttons): three inline text links:
   - "To know about our data partners, Kindly **Click Here**" (left)
   - "To view your rights, **Click Here**" (center)
   - "To exercise any of these rights, please contact us at **consentick.support@perfios.com**" (right)
6. **Buttons:** "Agree Essentials" (outlined blue) + "Agree All Terms" (filled blue) — replace current "Decline / I Agree".
7. **Decline path:** when user clicks outside or tries to leave without essential consent → show "Are you sure? Exiting without mandatory consent will halt the journey." dialog with "Yes, Exit" / "Go Back". Reference: `Consent screens 2.webp` middle screen.
8. **Vendor disclosure (NEW format):** instead of a vendor sheet showing all vendors flat, restructure to *per-data-point vendor lists*. When user clicks a data point, the right-side panel shows "Name → To be used by following vendors: a. Perfios for Credit Assessment, b. ICICI Bank Ltd for Loan Application, c. Amazon Ltd for Ads." Reference: `Consent screens 2.webp` right screen.
9. **22-language translations:**
   - Create `src/flows/consent-translations.ts`:
     ```ts
     export interface ConsentI18n {
       welcome: string                 // "Welcome John Doe,"
       privacyHeading: string          // 'We value your privacy...'
       reviewRights: string            // 'You have the right to review...'
       essentialTab: string            // 'Essential Terms*'
       optionalTab: string             // 'Optional Terms'
       agreeEssentials: string         // 'Agree Essentials'
       agreeAll: string                // 'Agree All Terms'
       confirmCheckbox: string         // 'I hereby confirm...'
       expiryLabel: string             // 'Consent Expiry Date:'
       knowPartners: string
       viewRights: string
       contactSupport: string
       exitDialogTitle: string         // 'Are you sure?'
       exitDialogBody: string
       exitConfirm: string             // 'Yes, Exit'
       exitCancel: string              // 'Go Back'
     }
     
     export const TRANSLATIONS: Record<string, ConsentI18n> = {
       English: { welcome: 'Welcome {name},', ... },
       'हिन्दी': { welcome: '{name} को स्वागत है,', ... },
       'தமிழ்': { welcome: 'வரவேற்கிறோம் {name},', ... },
       'తెలుగు': { ... },
       'বাংলা': { ... },
       'मराठी': { ... },
       'ಕನ್ನಡ': { ... },
       'ਪੰਜਾਬੀ': { ... },
       'ગુજરાતી': { ... },
       'ଓଡ଼ିଆ': { ... },
       'اردو': { ... },
       'অসমীয়া': { ... },
       'मैथिली': { ... },
       'डोगरी': { ... },
       'कोंकणी': { ... },
       'سنڌي': { ... },
       'ᱥᱟᱱᱛᱟᱲᱤ': { ... },
       'कॉशुर': { ... },
       'नेपाली': { ... },
       'ꯃꯩꯇꯩ ꯂꯣꯟ': { ... },
       'बर': { ... },              // Bodo
       'संस्कृतम्': { ... },      // Sanskrit
     }
     ```
   - Translate all 17 fields × 22 languages. **Use real translations** — for each Indian language, use the actual translation of the English phrases. Sonnet can use its multilingual knowledge to translate. Mark in a comment at top of the file: `// DEMO TRANSLATIONS — review with Perfios legal team before production use`.
   - **Important:** keys must be the exact 22 language names per DPDP §6(7) Eighth Schedule. Use Devanagari/script-native names (e.g. `हिन्दी` not `Hindi`).
10. **Wire translations to component:** at top of ConsenTick.tsx, replace hardcoded English strings with `TRANSLATIONS[activeLang].fieldName.replace('{name}', customer.name)`. When `activeLang` changes, the entire modal re-renders in that language (including the heading, paragraphs, button labels, expiry label, confirmation text).
11. **Language picker UX:** the picker grid (current lines 209-230) stays, but selecting a language now actually changes the text. Add a small "✓" mark next to the active language. Add a search filter for languages (since 22 is a lot).
12. **Powered-by footer:** at the bottom: "Powered by **Perfios**" (small gray text, "Perfios" in blue).

**Acceptance:**
- ConsenTick header shows "Perfios" branding (not company)
- Welcome {customerName} interpolates correctly
- Switching to Hindi → all visible text becomes Hindi (verify by inspection)
- All 22 languages selectable, each renders correctly
- Essential / Optional accordion structure matches reference (purpose-first, not data-point-first)
- Confirmation checkbox enables "Agree All Terms" only when checked
- Vendor info shows per-data-point, not flat list

---

#### P0-5 — Story panel: crisp captions + white theme

**File:** `src/modes/StoryPanel.tsx`

**Why:** Vijay (2026-05-13): "Not too much verbose. Crisp words explaining the story." Current captions are 2-3 sentence paragraphs. Also: panel is dark slate, switch to white for consistency.

**Changes:**
1. **Rewrite every caption in `generateCaption` (lines 5-88).** New rules:
   - `headline`: ONE sentence, ≤12 words, plain English, with customer name. Example: "Priya accepts cookies on vodafone.in"
   - `detail`: ONE sentence, ≤25 words, explains *what just happened in DPDP terms*. Example: "Under §6, Vodafone now has explicit consent to drop tracking cookies on Priya's session."
   - Drop the long compliance lectures.
2. **Panel theme:** `bg-slate-900` (line 97) → `bg-white border-l border-slate-200`. Text colors flip: white → slate-900, white/60 → slate-600, white/40 → slate-400. Card backgrounds: `bg-white/5` → `bg-slate-50`. DPDP tag card: `bg-blue-900/30` → `bg-blue-50 border border-blue-200`, text colors adjust.
3. **Time format:** "10:42 AM" not full timestamp. Place in top-right corner of each card, small.
4. **Reverse order:** keep newest-first (current behavior is correct).

**Acceptance:**
- All 18 event captions are now 1-line headline + 1-line detail (max)
- Panel is white, readable on light bg
- Story still tells the story — read through the whole flow and verify it's coherent in plain English

---

#### P0-6 — Quick bugs + missing wires

**Files:** Multiple.

**Changes:**
1. **`src/generator/seeded-random.ts`:** Remove the unused `type bool = boolean` declaration at the bottom. Will fail `noUnusedLocals` on strict build.
2. **`src/store/store.tsx` line 228-237 (`updateJobStatus`):** Before dispatching `BREACH_DETECTED`, check for existing open breach linked to the same `jobId`. Add guard:
   ```ts
   const existingBreach = state.world?.breaches.find(
     b => b.linkedDeletionJobId === jobId && b.status === 'open'
   )
   if (existingBreach) return  // skip duplicate
   ```
   Prevents double-execute → double-breach.
3. **`src/App.tsx`:** Stage `'cookie-consent'` exists in `FlowStage` type but App.tsx doesn't route it. Either remove from type (if cookie consent stays embedded in Landing per P0-2) OR add a route. Decision: **remove from FlowStage type** in `src/store/types.ts` line 287 since modal lives within Landing.
4. **Cross-perspective continuity (deferred from earlier review):** when Customer Portal submits a deletion request, the CT Manager Data Deletion tab should show a new "pending" entry. Currently no wire. Add reducer action `QUEUE_DELETION_FROM_CUSTOMER` that adds a pending entry the DPO can act on. Customer Portal Submit handler dispatches this action.

**Acceptance:**
- `pnpm build` (or `tsc --noEmit --strict`) passes without unused-locals or unused-imports warnings
- Executing 3 deletion jobs twice produces exactly 1 open breach, not 2
- Submit deletion from Customer Portal → switch to CT Manager → new entry visible

---

#### P1-1 — CT Manager: rebuild to match Perfios reference exactly

**Files:** `src/perspectives/CTManager/index.tsx`, `src/perspectives/CTManager/ConsentAuthorisation.tsx`

**Why:** Vijay (2026-05-13): "Use exact screens for Perfios and Aurva. Including branding and theming. Screen layouts, filters provided, design standards etc. should be maintained. None of the screens represents the actual product." References in `G:\Downloads\CM\cm_screens_extracted\page_*.png` (all 25). Current implementation has dark sidebar, brand-colored logo, and section layouts that diverge from real product.

**Approach:** Before editing, **read all 25 reference pages** (`G:\Downloads\CM\cm_screens_extracted\page_01.png` through `page_25.png`). Identify which page each current section corresponds to and rebuild each section to match.

**Key changes:**
1. **Theme:** Sidebar `bg-slate-900` → `bg-white border-r border-slate-200`. Nav text: white/50 → slate-600. Active nav: `bg-white/10 text-white` → `bg-blue-50 text-blue-700 border-l-2 border-blue-700` (left accent).
2. **Logo:** Replace company-color "CT" square (lines 30-31) with text logo: "**Perfios** | CT Manager" — Perfios in `text-blue-700 font-bold` + " | CT Manager" in `text-slate-500 text-xs`. Reference: any CM page top-left.
3. **Top-right user pill:** Add (currently missing) — bell icon + "admin / admin@perfios.com" small text + dropdown chevron. Reference: page_15, page_20.
4. **DPO Dashboard KPIs:** Current shows 6 generic stats. Reference shows: Total Notifications / Active Investigations / Critical Severity / Est. Records Exposed (Breach page) and separate KPI rows for consent stats. Rebuild to match the real layout — KPI cards with bold number + small colored bar underneath + label.
5. **Templates section:** Reference (`page_15.png`) shows: filter form at top (Products / Sub Product / Created By / Creation Dates / Submit), Active/Inactive/View Saved Drafts tabs, table with Template Name / Template ID / Product / Sub Product / Creation Date columns, "Create New" button top-right. Plus "Create Template" modal (Template Name / Reuse Existing Template / Product / Sub Product / Cancel / Create New). Rebuild from current `TemplatesSection` (lines 305-329).
6. **Grievances section:** Reference (`page_20.png`) shows: filter (Status: Show All) + Complaint ID/Name search, All/Open/Resolved tabs, table with Complaint ID / Name / Complaint Details / Status (OPEN amber pill) / Due on / Created on. Detail page: Reported on / Complaint Description / Attachment Details (image previews) / Accept | Reject buttons. Rebuild.
7. **Breach Management:** Reference (`page_20.png` bottom) shows: 4-KPI grid (Total Notifications 45, Active Investigations 25, Critical Severity 10, Est. Records Exposed 12.2K) + filter (Severity / Status), table with INCIDENT ID / BU + DEPARTMENT / REPORTED DATE / BREACH TYPE (Data Breach/Consent Breach pills) / SEVERITY (Low/Medium/High/Critical pills) / STATUS (Resolved/Investigating/Closed/Open pills) / USERS AFFECTED. Rebuild.
8. **All other sections** (Master management, Cookie Management, Vendor Management, Consent Initiate): they appear in the reference deck — find them, build them. Currently they just show a "coming soon" stub.
9. **Color system:** Use `var(--perfios-blue)` (or `text-blue-700` / `bg-blue-700` as substitute) everywhere. Never `company.primaryColor`.

**Acceptance:**
- White sidebar, light theme
- "Perfios | CT Manager" wordmark in top-left
- admin@perfios.com user pill top-right
- DPO Dashboard, Templates, Grievances, Breach Management, View Consents, Consent Authorisation, Vendor Management, Cookie Management, Consent Initiate sections all built and match references within reasonable fidelity
- No `company.primaryColor` references anywhere in CTManager files
- Run app, switch to CT Manager perspective, navigate through each section → each renders without errors and visually resembles the reference

---

#### P1-2 — Aurva: rebuild to match real Aurva (white theme, separate brand)

**File:** `src/perspectives/Aurva/index.tsx`

**Why:** Reference `G:\Downloads\CM\aurva_screens_extracted\page_01.png` through `page_07.png`. Real Aurva is **WHITE**, lowercase "aurva" logo with green leaf mark, narrow icon-only sidebar. Current is dark + teal + claims "by Perfios" (wrong — Aurva is a separate company per Vijay Q8). Has 7 pages of references.

**Approach:** Read all 7 reference pages first. Map each current section to a reference. Rebuild.

**Key changes:**
1. **Theme:** `bg-gray-950` (line 19) → `bg-white`. Sidebar `bg-slate-900` → `bg-slate-50 border-r border-slate-200`. All text from white/* to slate-*. KPI cards: `bg-white/5 border border-white/10` → `bg-white border border-slate-200 shadow-sm`.
2. **Logo:** Replace "Aurva by Perfios" with "aurva" lowercase + green leaf SVG. Drop "by Perfios" entirely.
3. **Sidebar:** Reference shows narrow ICON-ONLY sidebar (~50px wide), with small icons stacked vertically. Currently a wider labeled sidebar. Restructure: icons only with tooltip labels. Icons: home (overview), folder (data), bar chart (reports), shield (compliance/risks), warehouse (storage), code brackets (apps), gear (settings), user (profile).
4. **Top-right:** "System Health" pill (red dot if breach, green dot if clean) + bell icon. Reference shows this on every page.
5. **Overview (page_01):** KPI strip — TOTAL ASSETS / BY TYPE / SENSITIVE ASSETS / RISKY ASSETS — bold number, small colored bar under. Activity trend chart. Sensitive Data Risks list (right side). World map (data flows). Compliance progress bars row.
6. **Data Assets (page_03):** ASSETS / BY TYPE (Cloud 1.3K, Self-managed 303, External 6) / SENSITIVE ASSETS / RISKY ASSETS at top. Filter row (Unscanned/Archived/Scanned/+, search). Table: Data Asset / Region / Service / Type / Owner / Tags (PHI/PCI/PII pill chips) / Accessors / Compliance Score (green/amber pills) / Risk Score (circle with number, colored). Each row has an asset name + cluster + status icon.
7. **Asset detail slide-over (page_04):** When clicking a row, slide-over panel from right with: title (asset name), Account/Location, KEY INSIGHTS row (High Data Sensitivity / Overprovisioned Identity Access / Misconfigurations / Active Security Alerts — each with risk score), tabs (General / Data / Identities / Risks(10) / Compliance / Events), General tab fields (Cloud / Service / Managed Type / Engine / Host Country / Host Region / Host / Port + dates First Found / Last Found / Last Scan / Auto Scan toggle).
8. **Compliance (page_02):** Frameworks list (RBI Outsourcing / SEBI / Payment Security Operations / PCI DSS / ISO 27001 / NIST 800-171 etc.) with progress rings (% Compliant) + Controls Supported / Policies Checked numbers per framework. Detail view: control list (e.g. "5.6.3 Data Isolation and Commingling Control") with Description / Framework / Status (Compliant green) and Violations / Linked Policies tabs.
9. **Applications (page_05):** APPLICATIONS / APPS ACCESSING SENSITIVE DATA / APPS MAKING THIRD-PARTY CALLS / RISKY APPLICATIONS KPI strip. Table: Application / Risk score / Data Assets / Downstream Apps / Upstream Apps / Third Party / Sensitive Data Detected (PHI/PCI/PII pills) / # / Last Seen. Detail slide-over with topology graph.
10. **Custom Policies (page_06):** Table — Policy Name / Type (Block Guardrail / Detection Rule pills) / Category (DAM) / Alert routing / Send Alert / Policy Controls (toggles). Detail view: Policy Type / Policy Severity (chip) / Description / Conditions / Policy Schedule / Remediation / Open Risk / Alert routing.
11. **Audit Trail (page_07):** Live / Retrieved Logs tabs. TOTAL QUERIES / SPLIT BY ACCESSOR TYPE (Human / Non-Human / AI Agents) / DDL/DML QUERIES KPI strip. Activity trend chart. TOP DATA ASSET QUERIED list. TOP ACCESSORS (Human / Non-Human tabs). Search & Filter row. Status dropdown. Column selector.
12. **Color system:** Use `var(--aurva-green)` for the green-checkmark / compliant states. Risk circles use the data severity (red ≥ 80, orange 60-80, amber 40-60, green < 40). PHI/PCI/PII pills: red/blue/purple respectively.

**Acceptance:**
- All 7 reference pages have a corresponding section in the rebuilt Aurva perspective
- White theme throughout
- "aurva" lowercase logo with green leaf
- No "by Perfios" branding
- No `company.primaryColor` references
- KPI cards, tables, and pill tags match reference styling

---

#### P1-3 — Technical Panel: live data flow diagram

**File:** `src/modes/TechnicalPanel.tsx` (major rewrite)

**Why:** Vijay (Q6, 2026-05-13): "Tech screen I want the flow like a data flow diagram. Should be live, Showing DBs, integration approaches, security, encryption etc. API calls between where to where, every thing should be there. This log the story, should do the same here and explain the story but in technical terms when he is on tech tab." Current implementation is just a list of API JSON cards.

**Approach:** Build a static SVG-based topology diagram of the Perfios DPDP architecture (reference `Architexture 3.webp` for the functional view, `Architexture 1.webp` for AWS infra components like Route 53, WAF, EKS, MySQL, MongoDB, Redis, KMS). Overlay live API call animations on top of the static topology as events fire.

**Layout (the diagram):**
```
[Data Principal]                 ┌──────────── Perfios SaaS ────────────┐
    (mobile)                     │ Consent Manager (Engine)             │
       │                         │  ├─ Consent Artifacts (MySQL)        │
       │ HTTPS+TLS               │  ├─ Templates (MySQL)                │
       ▼                         │  ├─ Audit Trails (MongoDB)           │
[Data Fiduciary Web/App]         │  └─ CM Bridge Connectors             │
       │                         └──────────┬───────────────────────────┘
       │ POST /consent/initiate              │ Real-time Sync
       │                                     │ (encrypted, KMS)
       ▼                                     ▼
┌─────── Data Fiduciary On-Premise ─────────────────┐
│  ┌─── Perfios CM Bridge ───┐                       │
│  │ Templates              │                       │
│  │ Consent Artifacts (DB) │  ┌─ Aurva DSPM ──┐    │
│  │ Notification Channels  │  │ Discovery     │    │
│  │ Admin Portal           │  │ DAM           │    │
│  │  - DPO Dashboard       │  │ Lineage       │    │
│  │  - Consents Dashboard  │  └───────────────┘    │
│  │  - Grievance Mgmt      │                       │
│  │  - Template Definition │                       │
│  │  - Consent Auth        │                       │
│  │  - DSPM Metrics        │                       │
│  └──────────┬─────────────┘                       │
│             │ Fan-out                              │
│             ▼                                      │
│  [CRM] [CBS] [Lending] [Marketing] [Product&Tech]  │
└────────────┬───────────────────────────────────────┘
             │ DSPM Audit
             ▼
[Data Processor 1] [Data Processor 2] [Data Processor 3]
```

**Implementation:**
1. **Static topology** as inline SVG, ~10-15 boxes connected with arrows. Use Tailwind classes on the wrapping div and SVG `<g>` groups for color/style.
2. **DB icons:** small cylinder shapes labeled MySQL / MongoDB / Redis on the appropriate boxes. Edge labels show protocols (HTTPS+TLS, gRPC+mTLS, internal). KMS badge on encrypted edges.
3. **Live event overlay:**
   - When a new event fires (eventLog grows), inspect the event type
   - Map event type → topology edge(s) (e.g. `CONSENT_GRANTED` → animate arrow from Data Principal box → Consent Manager box)
   - Animate the arrow: pulse stroke, show endpoint label as floating chip ("POST /consent/submit · 200 · 67ms")
   - Keep highlighted for 4 seconds, then fade
4. **Bottom panel:** keep a *small* event-log strip showing last 5 events with method/path/status (compact). Click an event → re-trigger its animation on the topology.
5. **Latest event detail:** when clicked or on initial fire, show a side detail card with the full request/response JSON (current TechnicalPanel content, just moved to a side card).
6. **Theme:** White bg (consistent with Story panel after P0-5).

**Acceptance:**
- TechnicalPanel renders a topology diagram on first load
- Triggering events in any perspective animates the corresponding edge on the diagram
- DBs (MySQL, MongoDB, Redis) and KMS encryption badges are visible
- Last event JSON is still inspectable
- White theme

---

#### P2-1 — Missing DPDP flows

**Files:** Various.

**Changes:**
1. **§11 Right to Access** — `src/perspectives/CustomerApp/MyDataTab.tsx`: add a "Request my data export" CTA. On click, dispatch `DATA_EXPORT_REQUESTED` (add to `DemoEventType`). Story + Tech panels handle it.
2. **§13 Customer-side grievance submission** — `src/perspectives/CustomerApp/` (add a Grievance tab or button) + `src/perspectives/CustomerPortal/` (Grievance section per reference `cm_screens_extracted/page_10.png` last screen — "Raise new" button, list of open grievances). On submit, dispatch existing `SUBMIT_GRIEVANCE` action + emit `GRIEVANCE_SUBMITTED` event.
3. **§17 DPB notification + 72hr clock** — `src/perspectives/CTManager/`: in Breach Management section, when a breach is open, show a prominent 72hr countdown timer + "Notify Data Protection Board" button. Click → dispatch `BREACH_NOTIFIED` (event type already exists). Story + Tech panels handle.
4. **Guardian OTP screen** — `src/flows/AuthFlow.tsx` + new component `src/flows/GuardianOTP.tsx`: when `customer.journeyType === 'guardian-minor'`, after customer OTP show a guardian OTP screen (reference `Consent screens 3.webp` — Bank SMS + Guardian Login screen). On verify, emit `GUARDIAN_VERIFIED` and proceed to consent.

---

#### P2-2 — Journey type wiring

**Files:** `src/store/types.ts`, `src/generator/index.ts`, all perspectives.

**Changes:**
- Make journey type from P0-1 actually flow through the demo:
  - `self` → standard flow
  - `assisted` → AM appears as a "Helper" in the consent record (consentType = 'agent-assisted')
  - `guardian-minor` → triggers Guardian OTP (P2-1) and §9 in Story
  - `guardian-disabled` → triggers Guardian OTP with disability accommodation badge
  - `assisted-senior` → triggers larger fonts in ConsenTick + AM appears as Helper
- Each variant should produce distinct events and story captions.

---

### Sequencing recommendation

| Day | Prompts | Time est | Outcome |
|-----|---------|----------|---------|
| **Today (Wed)** | P0-1, P0-2, P0-3 | 3-4 hr | AM Setup cleaned, cookie modal replica, customer screens white |
| **Thursday AM** | P0-4 (focus: Hindi + English first, other 20 langs stub-translate) | 2-3 hr | ConsenTick replica with at least 2 working languages |
| **Thursday afternoon** | P0-5, P0-6 | 1-2 hr | Story crisp, bugs fixed, demo ready for Olivia |
| **Friday** | P1-1 (CT Manager) | 4-6 hr | Real CT Manager replica |
| **Saturday** | P1-2 (Aurva), P1-3 (Tech diagram) | 6-8 hr | Real Aurva + live data flow tech panel |
| **Next week** | P2-1, P2-2, Phase 14 | — | DPDP gap closure + Story HTML |

### Handoff to Sonnet

For each prompt, the operating instruction to a fresh Sonnet session is:

> "Read `D:/Research/dpdp-demo/LIVE_CONTEXT.md` section `#### P0-X — <name>` and execute it. Read referenced reference files in `G:\Downloads\CM\` if relevant. Report back: files changed, any decisions made, any blockers. Run `pnpm tsc --noEmit` after edits to verify no type errors."
