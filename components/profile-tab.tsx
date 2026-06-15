"use client"

import { COLORS } from "@/lib/dividnd"

const { navy, ink, white, gold, border, muted } = COLORS

// ── Financial profile inputs (hardcoded — the inputs behind the wealth plan). ─
type Field = {
  label: string
  value: string
  sub: string
  subGold?: boolean
  cta: string
  href?: string
}

const FIELDS: Field[] = [
  {
    label: "Annual Income",
    value: "$95,000",
    sub: "Austin, Texas · No state income tax",
    cta: "Update →",
  },
  {
    label: "Employer 401(k) Match",
    value: "4%",
    sub: "On $95,000 = $3,800/year free money",
    cta: "Update →",
  },
  {
    label: "Student Loans",
    value: "$27,000 at 5.5% APR",
    sub: "Federal loans · Above aggressive payoff threshold",
    cta: "Update →",
  },
  {
    label: "Cash Savings",
    value: "$4,000",
    sub: "Chase Checking · Earning 0.01% APY",
    cta: "Update →",
  },
  {
    label: "Roth IRA",
    value: "Not opened",
    sub: "Opening this is action #2 in your plan",
    subGold: true,
    cta: "Open now →",
    href: "https://www.fidelity.com/retirement-ira/roth-ira",
  },
  {
    label: "HSA",
    value: "Not enrolled",
    sub: "Check if your employer plan is HDHP-eligible",
    cta: "Check eligibility →",
  },
  {
    label: "Investment Accounts",
    value: "None yet",
    sub: "Your plan will build this progressively",
    cta: "Update →",
  },
  {
    label: "Tax Filing Status",
    value: "Single",
    sub: "Affects Roth IRA income limits and deductions",
    cta: "Update →",
  },
]

const LIFE_EVENTS = [
  "Got a raise",
  "Job change",
  "RSUs vesting",
  "Received inheritance",
  "Getting married",
  "Buying a home",
]

export function ProfileTab() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Your Financial Profile
      </h1>
      <p className="mt-2 text-base" style={{ color: muted }}>
        The inputs behind your wealth plan. Keep these updated as your situation changes.
      </p>

      {/* Profile fields */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <div
            key={f.label}
            className="card-hover flex flex-col gap-1 border p-5"
            style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
          >
            <span className="section-label">{f.label}</span>
            <span className="font-heading text-2xl font-bold" style={{ color: navy }}>
              {f.value}
            </span>
            <span className="text-xs" style={{ color: f.subGold ? gold : muted, fontWeight: f.subGold ? 600 : 400 }}>
              {f.sub}
            </span>
            {f.href ? (
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover mt-2 self-end text-sm font-semibold"
                style={{ color: navy }}
              >
                {f.cta}
              </a>
            ) : (
              <button
                type="button"
                className="btn-hover mt-2 self-end text-sm font-semibold"
                style={{ color: navy }}
              >
                {f.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Life events */}
      <h2 className="section-label mt-14">Life Events</h2>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        Tell us when something changes — your plan updates automatically.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {LIFE_EVENTS.map((e) => (
          <button key={e} type="button" className="life-event-pill">
            {e}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm" style={{ color: muted }}>
        Dividnd watches for these moments. When your situation changes, your wealth plan changes
        with it.
      </p>
    </div>
  )
}
