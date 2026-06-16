"use client"

import { useState } from "react"
import { COLORS } from "@/lib/dividnd"
import { GOAL } from "@/lib/demo-state"

const { navy, cream, ink, white, gold, border, muted } = COLORS

// ── The six private-wealth strategies (hardcoded, static). ───────────────────
type StrategyCard = {
  id: string
  priority: number
  title: string
  badge: string
  dollarImpact: string
  description: string
  whyThis: string
  ctaLabel: string
  ctaHref: string
}

const CARDS: StrategyCard[] = [
  {
    id: "match",
    priority: 1,
    title: "Capture Your Full 401(k) Match",
    badge: "Your HR Portal",
    dollarImpact: "Worth $3,800/year — a guaranteed 100% return",
    description:
      "Your employer matches 4% of your salary. Contributing at least 4% captures $3,800 in free money annually. Nothing in investing gives you a guaranteed 100% return. This is first — always.",
    whyThis:
      "Most new grads contribute whatever the default enrollment sets — often 3% or nothing. Leaving employer match on the table is the single most common and most expensive mistake we see. On your $95,000 salary, the full match is $3,800/year. Over 30 years at 7% that uncaptured match compounds to $385,000.",
    ctaLabel: "Enroll Now",
    ctaHref: "https://www.dol.gov/general/topic/retirement/401kplans",
  },
  {
    id: "roth",
    priority: 2,
    title: "Open a Roth IRA at Fidelity",
    badge: "Fidelity",
    dollarImpact: "Worth $106,000 in tax-free wealth by retirement",
    description:
      "At 22 and $95,000, you're below the income limit for direct Roth contributions. Contribute $7,000 this year. Invest in FZROX — Fidelity's zero-fee total market fund. This is the most powerful account you can open at your age.",
    whyThis:
      "$7,000 invested at 22 in a Roth IRA grows completely tax-free. At 8% average annual return, that single $7,000 contribution becomes $106,000 by 65. Every year you delay this costs you roughly $8,000 in future tax-free wealth. You pay taxes on the money now when your rate is low — never again when your rate is high.",
    ctaLabel: "Open It",
    ctaHref: "https://www.fidelity.com/retirement-ira/roth-ira",
  },
  {
    id: "backdoor",
    priority: 3,
    title: "Check Mega Backdoor Roth Eligibility",
    badge: "Your HR Department",
    dollarImpact: "Could unlock $46,500/yr in additional tax-free retirement space",
    description:
      "Most people don't know their 401(k) has a hidden door. If your employer plan allows after-tax contributions and in-plan Roth conversions, you can contribute an additional $46,500 per year — all converting to Roth immediately. One phone call to HR.",
    whyThis:
      "The standard 401k employee limit is $23,500. But the total 401k limit including employer contributions is $70,000. The gap — up to $46,500 — can be filled with after-tax contributions if your plan allows it. Most plans do. Most people never ask. Over 20 years at 8%, this unlocks over $2,000,000 in additional tax-free retirement wealth. Ask HR: 'Does my plan allow after-tax contributions and in-plan Roth conversions?'",
    ctaLabel: "Call HR",
    ctaHref: "tel:",
  },
  {
    id: "ibonds",
    priority: 4,
    title: "Build Your Emergency Fund in I-Bonds",
    badge: "TreasuryDirect",
    dollarImpact: "Earn 4.3% guaranteed — beats every savings account",
    description:
      "Keep 1 month of expenses in a HYSA at Marcus for liquidity. Then move the rest of your emergency fund target ($23,750) into I-Bonds — US government bonds that pay the inflation rate, guaranteed, zero risk. Your emergency fund should never lose to inflation.",
    whyThis:
      "Most people keep their entire emergency fund in a checking account earning 0.01%. A HYSA earns around 4.5% — better but not guaranteed. I-Bonds are issued by the US Treasury, pay the official inflation rate (currently ~4.3%), and carry zero default risk. The one catch: you cannot withdraw for the first 12 months. Keep one month in HYSA for true liquidity, move the rest to I-Bonds. On a $23,750 emergency fund the difference is roughly $950/year in additional interest — risk-free.",
    ctaLabel: "Open Account",
    ctaHref: "https://www.treasurydirect.gov",
  },
  {
    id: "hsa",
    priority: 5,
    title: "Enroll in Your HSA — Invest It, Never Spend It",
    badge: "Fidelity HSA",
    dollarImpact: "Triple tax-free — the best account in the US tax code",
    description:
      "If your employer offers a High Deductible Health Plan, you qualify for an HSA. Contribute $4,300 this year. Invest it in FZROX. Pay all medical expenses out of pocket. Start saving every receipt — you can reimburse yourself tax-free decades from now with no time limit.",
    whyThis:
      "The HSA is the only triple tax-advantaged account in the US tax code — contributions are pre-tax, growth is tax-free, withdrawals for medical are tax-free. After 65 you can withdraw for anything, taxed like a traditional IRA — making it effectively a second 401k. The receipt harvesting strategy: save every medical receipt from today forward. In 20 years, reimburse yourself for all of them at once from your HSA — completely tax-free. $4,300/year invested at 8% for 30 years = $52,000 tax-free, plus potentially tens of thousands in reimbursements.",
    ctaLabel: "Open HSA",
    ctaHref: "https://www.fidelity.com/go/hsa/overview",
  },
  {
    id: "loans",
    priority: 6,
    title: "Aggressively Pay Down Student Loans",
    badge: "SoFi",
    dollarImpact: "Save $4,200 in interest — paid off 3 years faster",
    description:
      "Your loans are at 5.5% — above the threshold where paying off beats investing the difference. After capturing your 401k match and funding your Roth IRA, put every extra dollar here. Paying $500 extra per month eliminates your $27,000 balance 3 years faster and saves $4,200 in interest. Also check if refinancing to a lower rate makes sense.",
    whyThis:
      "The math is simple: if your loan rate is above the risk-free return you can earn elsewhere, pay the loan. At 5.5%, your after-tax effective rate is approximately 5.5% (you've lost the student loan interest deduction at $95,000 income — it phases out at $90,000). The market earns ~7% long-term but that's not guaranteed. 5.5% guaranteed savings by paying the loan is better than the marginal additional investing after your Roth IRA is funded.",
    ctaLabel: "Check Refinance Rate",
    ctaHref: "https://www.sofi.com/refinance-student-loan",
  },
]

// ── A single strategy card ───────────────────────────────────────────────────
function PlanCard({
  card,
  open,
  onToggle,
  done,
  onToggleDone,
}: {
  card: StrategyCard
  open: boolean
  onToggle: () => void
  done: boolean
  onToggleDone: () => void
}) {
  const topPriority = card.priority === 1

  return (
    <article
      className="card-hover flex flex-col gap-3 border p-6"
      style={{
        borderRadius: 4,
        borderColor: border,
        backgroundColor: white,
        borderLeft: done ? `3px solid ${gold}` : topPriority ? `3px solid ${navy}` : undefined,
      }}
    >
      {/* Priority badge + platform badge */}
      <div className="flex items-center justify-between">
        <span
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: done ? gold : navy, color: white }}
        >
          {done ? "✓" : card.priority}
        </span>
        <span className="platform-badge">{card.badge}</span>
      </div>

      <h3 className="font-heading text-lg font-bold leading-tight" style={{ color: navy }}>
        {card.title}
      </h3>

      {/* Dollar impact — the hero element */}
      <p className="font-heading font-bold leading-snug" style={{ color: gold, fontSize: 20 }}>
        {card.dollarImpact}
      </p>

      <p className="leading-relaxed" style={{ color: ink, fontSize: 14 }}>
        {card.description}
      </p>

      <div className="mt-auto flex items-center gap-3 pt-2">
        <a
          href={card.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hover flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          {card.ctaLabel}
        </a>
        <button
          type="button"
          onClick={onToggle}
          className="btn-hover flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: white, borderColor: navy, color: navy }}
        >
          {open ? "Hide" : "Why this?"}
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleDone}
        aria-pressed={done}
        className="btn-hover border px-5 py-2 text-center text-sm font-semibold"
        style={{
          borderRadius: 4,
          backgroundColor: done ? gold : white,
          borderColor: done ? gold : border,
          color: done ? white : muted,
        }}
      >
        {done ? "Done ✓" : "Mark done"}
      </button>

      {/* Inline expandable explanation — animated max-height, no modal */}
      <div
        style={{
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.25s ease, opacity 0.25s ease",
        }}
      >
        <div
          className="mt-1 border-t pt-3 text-sm leading-relaxed"
          style={{ borderColor: border, color: muted }}
        >
          {card.whyThis}
        </div>
      </div>
    </article>
  )
}

// Pencil edit icon (non-functional — visual only).
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke={navy}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PlanTab() {
  // Only one "Why this?" open at a time.
  const [openId, setOpenId] = useState<string | null>(null)
  // Which strategies the user has marked complete.
  const [done, setDone] = useState<Set<string>>(new Set())

  const toggleDone = (id: string) =>
    setDone((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const total = CARDS.length
  const doneCount = done.size
  const pct = Math.round((doneCount / total) * 100)
  const allDone = doneCount === total

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Your Wealth Plan
      </h1>
      <p className="section-label mt-2">Built for your situation — updated as your life changes</p>

      {/* Your situation */}
      <section
        className="card-hover mt-6 border p-6"
        style={{
          borderRadius: 4,
          backgroundColor: white,
          borderColor: border,
          borderLeft: `3px solid ${navy}`,
        }}
      >
        <p className="section-label">Your situation</p>
        <p className="mt-2 text-base leading-relaxed" style={{ color: ink }}>
          You're 22, starting a $95,000 role in Austin. You have $27,000 in student loans at 5.5%
          and $4,000 in cash. You haven't started investing yet —{" "}
          <span style={{ color: gold, fontWeight: 700 }}>
            which means every month you wait costs you approximately $8,000 at retirement.
          </span>
        </p>
      </section>

      {/* Goal banner */}
      <div
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-l-4 py-1 pl-4"
        style={{ borderColor: navy }}
      >
        <span className="section-label">Goal</span>
        <span className="text-sm" style={{ color: ink }}>
          {GOAL}
        </span>
        <span className="ml-1 inline-flex cursor-pointer" aria-hidden="true">
          <EditIcon />
        </span>
      </div>

      {/* Plan progress */}
      <section
        className="card-hover mt-8 border p-6"
        style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
      >
        <p className="section-label">Plan progress</p>
        <p className="mt-2 font-heading font-bold" style={{ color: navy, fontSize: 48, lineHeight: 1 }}>
          {doneCount} of {total} steps complete
        </p>
        <div
          className="mt-4 h-2 w-full"
          style={{ backgroundColor: "var(--c-tint)", borderRadius: 4 }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: navy, borderRadius: 4 }}
          />
        </div>
        <p className="mt-3 text-sm" style={{ color: muted }}>
          {allDone
            ? "Every move complete — nice work."
            : "Mark each move done as you complete it."}
        </p>
      </section>

      {/* Private wealth plan */}
      <h2 className="section-label mt-10">Your private wealth plan</h2>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        These are the moves your banker makes. Now they're yours.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {CARDS.map((card) => (
          <PlanCard
            key={card.id}
            card={card}
            open={openId === card.id}
            onToggle={() => setOpenId((cur) => (cur === card.id ? null : card.id))}
            done={done.has(card.id)}
            onToggleDone={() => toggleDone(card.id)}
          />
        ))}
      </div>
    </div>
  )
}
