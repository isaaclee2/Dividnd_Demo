"use client"

import { useState } from "react"
import { COLORS } from "@/lib/dividnd"
import { GOAL, PLAN_TOTAL, situationSummary, type DerivedState, type PlanItem } from "@/lib/demo-state"

const { navy, cream, ink, white, gold, border, muted } = COLORS

// ── Per-card presentation copy (additive — derived from each item's existing
//    numbers, no underlying data values changed). Keyed by plan-item id. ───────
type CardCopy = { dollarImpact: string; whyThis: string; badge: string }

const CARD_COPY: Record<string, CardCopy> = {
  roth: {
    dollarImpact: "Worth $106,000 in tax-free wealth by retirement",
    whyThis:
      "Contributing while you're in the lowest tax bracket you'll ever be in locks in decades of tax-free compounding. At a 7% return over 40 years, today's contributions grow to roughly $106,000 you'll never pay a cent of tax on. Doing it before you graduate buys an extra year of growth you can't get back.",
    badge: "Fidelity",
  },
  hysa: {
    dollarImpact: "Worth $180 more this year — risk-free",
    whyThis:
      "Your $4,000 sits in Chase at 0.01% APY, earning essentially nothing. An Ally high-yield account pays 4.40% — about $180 a year on the same money, fully liquid and FDIC-insured. It's the closest thing to free money in personal finance.",
    badge: "Ally Bank",
  },
  k401: {
    dollarImpact: "Worth $2,850/yr in free money — over $250,000 by retirement",
    whyThis:
      "Your employer matches your contributions up to about $2,850 a year — a 100% instant return you only get if you enroll. Skip it and you're turning down a guaranteed raise. Invested at 7% across your career, that match alone compounds to more than $250,000.",
    badge: "Your employer",
  },
  austin: {
    dollarImpact: "Worth $6,200/yr — about $248,000 over a 40-year career",
    whyThis:
      "Texas has no state income tax; California's top brackets take a real cut of every paycheck. On your offer that's roughly $6,200 more in take-home pay each year in Austin. Banked and invested, that one geographic choice is worth nearly a quarter-million dollars.",
    badge: "Dividnd analysis",
  },
  loans: {
    dollarImpact: "Worth getting right — the wrong call costs thousands in interest",
    whyThis:
      "Your student loans charge 5.5%, while a diversified portfolio has historically returned about 7%. That narrow gap means the math isn't obvious — extra payments guarantee a 5.5% return, investing might beat it but isn't certain. We've run your exact numbers to show which dollar works hardest.",
    badge: "Dividnd analysis",
  },
}

// ── The niche bonus strategy card (hardcoded, non-completable). ──────────────
const MEGA_CARD = {
  title: "Check Mega Backdoor Roth Eligibility",
  dollarImpact: "Could unlock $46,500/yr in tax-free space — worth $2M+ over 20 years",
  description:
    "Your employer plan may allow after-tax 401k contributions that can be converted to Roth immediately. One phone call to HR could be the most valuable 10 minutes of your financial life.",
  whyThis:
    "The standard 401k limit is $23,500 but the total limit including employer is $70,000. If your plan allows after-tax contributions and in-plan Roth conversions, you can contribute up to $46,500 more and convert it to Roth tax-free. Most people never know this exists.",
  cta: "Call HR",
  badge: "Your HR Department",
  href: "mailto:hr@yourcompany.com?subject=Mega%20Backdoor%20Roth%20eligibility",
}

// ── A single action / strategy card ──────────────────────────────────────────
function PlanCard({
  priority,
  title,
  dollarImpact,
  description,
  whyThis,
  badge,
  ctaLabel,
  topPriority,
  onCta,
  href,
}: {
  priority: number
  title: string
  dollarImpact: string
  description: string
  whyThis: string
  badge: string
  ctaLabel: string
  topPriority: boolean
  onCta?: () => void
  href?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <article
      className="card-hover flex flex-col gap-3 border p-6"
      style={{
        borderRadius: 4,
        borderColor: border,
        backgroundColor: white,
        borderLeft: topPriority ? `3px solid ${navy}` : undefined,
      }}
    >
      {/* Priority badge + platform badge */}
      <div className="flex items-center justify-between">
        <span
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: navy, color: white }}
        >
          {priority}
        </span>
        <span
          className="text-[11px] font-medium uppercase"
          style={{ color: muted, letterSpacing: "0.08em" }}
        >
          {badge}
        </span>
      </div>

      <h3 className="font-heading text-lg font-bold leading-tight" style={{ color: navy }}>
        {title}
      </h3>

      {/* Dollar impact — the hero element */}
      <p className="font-bold leading-snug" style={{ color: gold, fontSize: 20 }}>
        {dollarImpact}
      </p>

      <p className="leading-relaxed" style={{ color: ink, fontSize: 14 }}>
        {description}
      </p>

      <div className="mt-auto flex items-center gap-3 pt-2">
        {href ? (
          <a
            href={href}
            className="btn-hover flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
            style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
          >
            {ctaLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onCta}
            className="btn-hover flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
            style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
          >
            {ctaLabel}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-hover flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: white, borderColor: navy, color: navy }}
        >
          {open ? "Hide" : "Why this?"}
        </button>
      </div>

      {/* Inline expandable explanation — no modal, no new page */}
      {open && (
        <div
          className="mt-1 border-t pt-3 text-sm leading-relaxed"
          style={{ borderColor: border, color: muted }}
        >
          {whyThis}
        </div>
      )}
    </article>
  )
}

function DoneRow({ item, onUndo }: { item: PlanItem; onUndo: () => void }) {
  return (
    <div
      className="flex items-center gap-3 border p-4"
      style={{ borderRadius: 4, borderColor: border, backgroundColor: white }}
    >
      <span
        className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: navy, color: cream }}
      >
        ✓
      </span>
      <span className="flex-1 text-sm line-through" style={{ color: ink, opacity: 0.6 }}>
        {item.title}
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="btn-hover flex-none text-xs font-medium underline underline-offset-2"
        style={{ color: navy }}
      >
        Undo
      </button>
    </div>
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

// Render the "Where you stand" summary with key figures bolded inline, while
// keeping the conversational sentence exactly as situationSummary() produces it.
function StandSummary({ text }: { text: string }) {
  const figures = /(\$[\d,]+|\d+(?:\.\d+)?%)/g
  const parts = text.split(figures)
  return (
    <>
      {parts.map((part, i) =>
        /^(\$[\d,]+|\d+(?:\.\d+)?%)$/.test(part) ? (
          <strong key={i} style={{ color: ink, fontWeight: 700 }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function PlanTab({
  state,
  onApply,
  onUndo,
}: {
  state: DerivedState
  onApply: (id: string) => void
  onUndo: (id: string) => void
}) {
  const { planItems, completedCount, situation } = state
  const todo = planItems.filter((p) => !p.done).map((p) => p.item)
  const done = planItems.filter((p) => p.done).map((p) => p.item)
  const pct = Math.round((completedCount / PLAN_TOTAL) * 100)
  const milestones = [20, 40, 60, 80, 100]

  // Build the display list: real action cards with the bonus Mega Backdoor card
  // spliced in at the 3rd position so it's always visible.
  const actionCards = todo.map((item) => ({ type: "action" as const, item }))
  const display: ({ type: "action"; item: PlanItem } | { type: "mega" })[] = [...actionCards]
  display.splice(Math.min(2, display.length), 0, { type: "mega" })

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Your plan
      </h1>
      <p className="mt-2 text-base" style={{ color: muted }}>
        It updates automatically as your situation changes.
      </p>

      {/* Where you stand — short summary derived from the live situation */}
      <section
        className="card-hover mt-6 border p-6"
        style={{
          borderRadius: 4,
          backgroundColor: white,
          borderColor: border,
          borderLeft: `3px solid ${navy}`,
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: navy }}>
          Where you stand
        </p>
        <p className="mt-2 text-base leading-relaxed" style={{ color: ink }}>
          <StandSummary text={situationSummary(situation)} />
        </p>
      </section>

      {/* Goal banner */}
      <div
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-l-4 py-1 pl-4"
        style={{ borderColor: navy }}
      >
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: navy, letterSpacing: "0.15em" }}
        >
          Goal
        </span>
        <span className="text-sm" style={{ color: ink }}>
          {GOAL}
        </span>
        <span className="ml-1 inline-flex cursor-pointer" aria-hidden="true">
          <EditIcon />
        </span>
      </div>

      {/* Progress header */}
      <section
        className="card-hover mt-8 border p-6"
        style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
      >
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: navy }}>
          Progress
        </p>
        <p className="mt-2 text-sm" style={{ color: ink, opacity: 0.8 }}>
          {completedCount} of {PLAN_TOTAL} actions complete
        </p>
        <div
          className="relative mt-4 h-2 w-full"
          style={{ backgroundColor: "var(--c-tint)", borderRadius: 4 }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: navy, borderRadius: 4 }}
          />
          {/* Milestone markers at 20/40/60/80/100% */}
          {milestones.map((m) => (
            <span
              key={m}
              className="absolute top-1/2 h-3 w-px -translate-y-1/2"
              style={{
                left: `${m}%`,
                backgroundColor: m <= pct ? white : navy,
                opacity: m <= pct ? 0.6 : 0.35,
                marginLeft: -0.5,
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-sm" style={{ color: ink }}>
          Completing all 5 actions puts you on track for{" "}
          <span style={{ color: navy, fontWeight: 700 }}>$1.9M by retirement</span>.
        </p>
      </section>

      {/* Action plan */}
      <h2
        className="mt-10 text-sm font-semibold uppercase"
        style={{ color: navy, letterSpacing: "0.15em" }}
      >
        Your action plan — ranked by impact
      </h2>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        Complete these in order. Each one builds on the last.
      </p>

      {todo.length === 0 ? (
        <>
          <p className="mt-4 text-sm italic" style={{ color: muted }}>
            Every action is done — Jordan's plan is complete.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <PlanCard
              priority={1}
              title={MEGA_CARD.title}
              dollarImpact={MEGA_CARD.dollarImpact}
              description={MEGA_CARD.description}
              whyThis={MEGA_CARD.whyThis}
              badge={MEGA_CARD.badge}
              ctaLabel={MEGA_CARD.cta}
              href={MEGA_CARD.href}
              topPriority
            />
          </div>
        </>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {display.map((card, i) =>
            card.type === "mega" ? (
              <PlanCard
                key="mega"
                priority={i + 1}
                title={MEGA_CARD.title}
                dollarImpact={MEGA_CARD.dollarImpact}
                description={MEGA_CARD.description}
                whyThis={MEGA_CARD.whyThis}
                badge={MEGA_CARD.badge}
                ctaLabel={MEGA_CARD.cta}
                href={MEGA_CARD.href}
                topPriority={i === 0}
              />
            ) : (
              <PlanCard
                key={card.item.id}
                priority={i + 1}
                title={card.item.title}
                dollarImpact={CARD_COPY[card.item.id]?.dollarImpact ?? ""}
                description={card.item.why}
                whyThis={CARD_COPY[card.item.id]?.whyThis ?? ""}
                badge={CARD_COPY[card.item.id]?.badge ?? "Dividnd"}
                ctaLabel={card.item.cta ?? "Approve"}
                topPriority={i === 0}
                onCta={() => onApply(card.item.id)}
              />
            ),
          )}
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <>
          <h2
            className="mt-10 text-sm font-semibold uppercase tracking-widest"
            style={{ color: muted }}
          >
            Completed ({done.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {done.map((item) => (
              <DoneRow key={item.id} item={item} onUndo={() => onUndo(item.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
