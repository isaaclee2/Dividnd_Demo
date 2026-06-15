"use client"

import { COLORS } from "@/lib/dividnd"
import { formatMoney, OBSERVATIONS, type DerivedState } from "@/lib/demo-state"

const { navy, ink, white, gold, border, muted, red } = COLORS
const TONE_DOT: Record<string, string> = {
  good: "#2E7D52", // green — positive
  info: navy, // navy — neutral / informational
  watch: gold, // gold — action needed
}

// Setup CTA for accounts that aren't opened yet (non-functional demo links).
const SETUP_CTA: Record<string, string> = {
  savings: "Set up →",
  roth: "Set up →",
  k401: "Enroll →",
}

// Extra per-account prompt below the balance (presentation copy — no data change).
const ACCOUNT_NOTE: Record<string, { text: string; urgent?: boolean }> = {
  checking: { text: "Move to Marcus HYSA → earn $180 more this year", urgent: true },
  loans: { text: "At 5.5% APR — paying $200/mo extra saves $3,400 in interest" },
}

// Action link appended to certain insights (non-functional demo links).
const INSIGHT_CTA: Record<string, string> = {
  deposit: "Put it to work →",
  "dining-up": "See budget →",
}

export function AccountsTab({ state }: { state: DerivedState }) {
  const { situation } = state

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Accounts
      </h1>
      <p className="mt-2 text-base" style={{ color: navy }}>
        Pulled automatically from your linked accounts.
      </p>

      {/* Balances */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {situation.accounts.map((a) => {
          const note = ACCOUNT_NOTE[a.id]
          return (
            <div
              key={a.id}
              className="card-hover flex min-h-[112px] flex-col gap-1 p-5"
              style={{
                borderRadius: 4,
                backgroundColor: white,
                border: a.setup ? `1px solid ${border}` : `1px dashed ${muted}`,
              }}
            >
              <span className="text-sm font-semibold" style={{ color: ink }}>
                {a.label}
              </span>
              {a.setup ? (
                <>
                  <span
                    className="font-heading text-2xl font-bold"
                    style={{ color: a.kind === "debt" ? red : navy }}
                  >
                    {a.kind === "debt" ? "−" : ""}
                    {formatMoney(a.value).replace("-", "")}
                  </span>
                  {a.note && (
                    <span className="text-xs" style={{ color: muted }}>
                      {a.note}
                    </span>
                  )}
                  {note && (
                    <span
                      className="mt-1"
                      style={{
                        fontSize: 13,
                        fontWeight: note.urgent ? 600 : 400,
                        color: note.urgent ? navy : muted,
                      }}
                    >
                      {note.text}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-sm italic" style={{ color: muted }}>
                    Not set up
                  </span>
                  <button
                    type="button"
                    className="btn-hover mt-auto self-end text-sm font-semibold"
                    style={{ color: navy }}
                  >
                    {SETUP_CTA[a.id] ?? "Set up →"}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Insights — passive observations from linked accounts */}
      <section className="mt-14 border-t pt-12" style={{ borderColor: border }}>
        <h2
          className="text-sm font-semibold uppercase"
          style={{ color: navy, letterSpacing: "0.15em" }}
        >
          Insights
        </h2>
        <p className="mt-1 text-sm" style={{ color: muted }}>
          Recent activity across your accounts.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          {OBSERVATIONS.map((o) => (
            <div
              key={o.id}
              className="card-hover flex items-center gap-3 border p-4"
              style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
            >
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ backgroundColor: TONE_DOT[o.tone] }}
              />
              <p className="flex-1 text-sm leading-relaxed" style={{ color: ink }}>
                {o.text}
              </p>
              {INSIGHT_CTA[o.id] && (
                <button
                  type="button"
                  className="btn-hover flex-none text-sm font-semibold"
                  style={{ color: navy }}
                >
                  {INSIGHT_CTA[o.id]}
                </button>
              )}
            </div>
          ))}

          {/* New hardcoded insight — action needed (gold dot). */}
          <div
            className="card-hover flex items-center gap-3 border p-4"
            style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
          >
            <span
              className="h-2 w-2 flex-none rounded-full"
              style={{ backgroundColor: gold }}
            />
            <p className="flex-1 text-sm leading-relaxed" style={{ color: ink }}>
              You haven't opened a Roth IRA yet — at 22 this costs you roughly $8,000 in future
              wealth for every year you wait.
            </p>
            <button
              type="button"
              className="btn-hover flex-none text-sm font-semibold"
              style={{ color: navy }}
            >
              Open one now →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
