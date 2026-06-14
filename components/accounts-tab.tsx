"use client"

import { COLORS } from "@/lib/dividnd"
import { formatMoney, OBSERVATIONS, type DerivedState } from "@/lib/demo-state"

const { navy, ink, white } = COLORS
const NEGATIVE = "#B4322C" // semantic red, only for a debt balance
const DIVIDER = "rgba(17,17,17,0.08)" // hairline border
const TONE_DOT: Record<string, string> = {
  good: "#2E7D52", // green
  watch: "#C9881F", // amber
  info: navy, // brand accent
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
        {situation.accounts.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-1 border p-5"
            style={{
              borderRadius: 4,
              backgroundColor: white,
              borderColor: navy,
              opacity: a.setup ? 1 : 0.55,
            }}
          >
            <span className="text-sm font-semibold" style={{ color: ink }}>
              {a.label}
            </span>
            {a.setup ? (
              <>
                <span
                  className="font-heading text-2xl font-bold"
                  style={{ color: a.kind === "debt" ? NEGATIVE : navy }}
                >
                  {a.kind === "debt" ? "−" : ""}
                  {formatMoney(a.value).replace("-", "")}
                </span>
                {a.note && (
                  <span className="text-xs" style={{ color: "var(--c-muted-50)" }}>
                    {a.note}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm italic" style={{ color: "var(--c-muted-40)" }}>
                Not set up
              </span>
            )}
          </div>
        ))}
      </div>

      {/* What Dividnd noticed — passive observations from linked accounts */}
      <section className="mt-14 border-t pt-12" style={{ borderColor: DIVIDER }}>
        <h2 className="font-heading text-2xl" style={{ color: ink }}>
          What Dividnd noticed
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--c-muted-50)" }}>
          Recent activity across your accounts.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          {OBSERVATIONS.map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-3 border p-4"
              style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}
            >
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ backgroundColor: TONE_DOT[o.tone] }}
              />
              <p className="text-sm leading-relaxed" style={{ color: ink }}>
                {o.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
