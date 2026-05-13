import { useDemo } from '../store/store'
import { DPDP_TAGS } from '../generator/legal-tags'
import type { DemoEvent, DemoEventType } from '../store/types'

/**
 * Crisp captions: ≤12 word headline, ≤25 word detail.
 * Story panel mirrors what the AM is doing in plain DPDP-aware language.
 */
function generateCaption(
  event: DemoEvent,
  customerName: string,
  companyShort: string,
): { headline: string; detail: string } {
  const n = customerName || 'the customer'
  const c = companyShort || 'the company'
  const N = (event.payload.systemsCount as number) ?? (event.payload.fanoutCount as number) ?? 4

  const captions: Record<DemoEventType, { headline: string; detail: string }> = {
    COOKIE_ACCEPT: {
      headline: `${n} accepts cookies on ${c}'s site`,
      detail: `Explicit consent under §6 — ${c} can now drop tracking cookies for the chosen categories.`,
    },
    COOKIE_DECLINE_ESSENTIAL: {
      headline: `${n} declines optional cookies`,
      detail: `Essentials only — §6 lets users refuse non-essential tracking without losing service access.`,
    },
    LOGIN_INITIATED: {
      headline: `${n} taps Sign In`,
      detail: `Identity check starts before any personal data is processed by ${c}.`,
    },
    OTP_VERIFIED: {
      headline: `${n}'s mobile verified via OTP`,
      detail: `Data principal identified — §6 needs a verifiable identity before consent is captured.`,
    },
    CONSENT_GRANTED: {
      headline: `${n} grants consent via ConsenTick`,
      detail: `Consent ID issued. §6 obligation met — informed, unambiguous, and withdrawable at any time.`,
    },
    CONSENT_PARTIAL_REVOKE: {
      headline: `${n} withdraws consent for one purpose`,
      detail: `§12 right exercised. ConsenTick broadcasts to downstream systems — further use of this purpose is blocked.`,
    },
    CONSENT_FULL_REVOKE: {
      headline: `${n} withdraws all consent`,
      detail: `§12 — full withdrawal. Every connected system receives a simultaneous stop signal.`,
    },
    DELETION_REQUESTED: {
      headline: `${n} requests full data erasure`,
      detail: `§12(3) right to be forgotten invoked. Deletion jobs queued across DB, CRM, and app layers.`,
    },
    DELETION_JOB_STARTED: {
      headline: `Deletion job started — §8 clock running`,
      detail: `${c} must complete erasure within a reasonable timeframe. Tracked by the consent bridge.`,
    },
    DELETION_JOB_COMPLETE: {
      headline: `Deletion job succeeded`,
      detail: `One system layer cleared. Aurva will audit to confirm §8 compliance across all storage.`,
    },
    DELETION_JOB_FAILED: {
      headline: `Deletion job FAILED — breach risk activated`,
      detail: `§8(5) clock starts. 72 hours to notify the Data Protection Board. ₹250 Crore exposure.`,
    },
    BREACH_DETECTED: {
      headline: `Aurva flags a breach`,
      detail: `DSPM detected ${n}'s data not deleted as required. §8(5) — DPO must notify the DPB within 72hr.`,
    },
    BREACH_NOTIFIED: {
      headline: `Data Protection Board notified`,
      detail: `§8(5) compliant: notification filed within 72-hour SLA. Penalty mitigation in effect.`,
    },
    GUARDIAN_REQUIRED: {
      headline: `${n} is a minor — guardian consent required`,
      detail: `§9: verifiable parental consent needed before any of ${n}'s data is processed.`,
    },
    GUARDIAN_VERIFIED: {
      headline: `Guardian approved ${n}'s consent`,
      detail: `§9 satisfied. Auditable guardian-consent record now backs every downstream action.`,
    },
    NOMINEE_ADDED: {
      headline: `${n} adds a nominee under §14`,
      detail: `Nominee can exercise data rights on ${n}'s behalf in case of death or incapacity.`,
    },
    GRIEVANCE_SUBMITTED: {
      headline: `${n} files a grievance`,
      detail: `§13: DPO at ${c} has 48 hours to resolve. Unresolved cases escalate to the DPB.`,
    },
    GRIEVANCE_RESOLVED: {
      headline: `DPO resolves ${n}'s grievance`,
      detail: `§13 SLA met. Resolution recorded in the immutable audit trail.`,
    },
    ADDON_REQUESTED: {
      headline: `${c} requests an add-on consent`,
      detail: `A new purpose needs fresh §6 consent — ${n} must approve it separately from existing consents.`,
    },
    EXPIRY_RENEWED: {
      headline: `${n} renews an expiring consent`,
      detail: `§8 retention principle — consent must be re-affirmed before expiry, not silently extended.`,
    },
    FANOUT_DISPATCHED: {
      headline: `Consent change broadcast to ${N} systems`,
      detail: `§11(2): ${c} must ensure every downstream processor honours the change. Acknowledgements tracked.`,
    },
    FANOUT_BLOCKED: {
      headline: `Marketing call blocked at consent bridge`,
      detail: `System tried to use ${n}'s data; bridge returned consent=NO. DPDP working as designed.`,
    },
    DPO_APPROVED: {
      headline: `DPO approves the request`,
      detail: `Officer at ${c} reviewed and signed off — lawful, transparent, and fully documented.`,
    },
    DPO_REJECTED: {
      headline: `DPO rejects the request`,
      detail: `Officer at ${c} flagged the request. ${n} can appeal through §13 grievance redressal.`,
    },
  }

  return (
    captions[event.type] ?? {
      headline: `${event.type.replace(/_/g, ' ').toLowerCase()} — ${n}`,
      detail: `Logged in the immutable consent audit trail.`,
    }
  )
}

export default function StoryPanel() {
  const { state } = useDemo()
  const { eventLog, world } = state

  if (!world) return null

  return (
    <div className="bg-white h-full flex flex-col border-l border-slate-200">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <p className="text-slate-900 text-sm font-semibold">Story Mode</p>
        <p className="text-slate-500 text-xs">Auto-narrating actions as they happen</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {eventLog.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm">Story narration will appear here as you interact with the demo.</p>
          </div>
        ) : (
          [...eventLog].reverse().map((event) => {
            const { headline, detail } = generateCaption(
              event,
              world.customer.name,
              world.company.shortName,
            )
            const tag = event.dpdpSection ? DPDP_TAGS[event.dpdpSection] : null

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-slate-900 text-sm font-semibold leading-snug flex-1">
                    {headline}
                  </p>
                  <span className="text-slate-400 text-[10px] font-mono flex-shrink-0 pt-0.5">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{detail}</p>

                {tag && (
                  <div className="mt-3 flex items-start gap-2 bg-perfios-50 rounded-lg px-2.5 py-2 border border-perfios-100">
                    <span className="font-mono text-perfios-700 text-xs font-bold flex-shrink-0">
                      {tag.section}
                    </span>
                    <div className="min-w-0">
                      <p className="text-perfios-800 text-xs font-medium leading-snug">{tag.label}</p>
                      {tag.penalty && (
                        <p className="text-red-600 text-xs font-semibold mt-0.5">
                          Penalty: {tag.penalty}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
