"use client"

import type { ActionCard } from "@/lib/plan-data"
import {
  COLORS,
  DEMO_USER,
  WEALTH_SCORE,
  WEALTH_SCORE_MAX,
  pointsForCard,
} from "@/lib/welthly"

const { cream, navy, gold, ink, white } = COLORS

const NAV_ITEMS: { label: string; soon?: boolean }[] = [
  { label: "Home" },
  { label: "My Plan" },
  { label: "Accounts" },
  { label: "Tax Center", soon: true },
  { label: "Settings", soon: true },
]

// ── Circular wealth-score indicator ──────────────────────────────────────────
function ScoreRing({ score, max }: { score: number; max: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / max)
  return (
    <div className="relative flex-none" style={{ width: 130, height: 130 }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(250,247,242,0.18)" strokeWidth={8} />
        <circle
          cx={65}
          cy={65}
          r={r}
          fill="none"
          stroke={gold}
          strokeWidth={8}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl" style={{ color: gold }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: cream, opacity: 0.7 }}>
          / {max}
        </span>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ onReset }: { onReset: () => void }) {
  return (
    <aside
      className="hidden w-60 flex-none flex-col justify-between border-r px-6 py-8 md:flex"
      style={{ borderColor: navy, backgroundColor: white }}
    >
      <div>
        <div className="font-heading text-2xl font-bold" style={{ color: navy }}>
          Welthly
        </div>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-2 text-sm"
              style={{
                borderRadius: 4,
                backgroundColor: i === 0 ? "rgba(44,62,107,0.08)" : "transparent",
                color: item.soon ? "rgba(17,17,17,0.4)" : ink,
                fontWeight: i === 0 ? 600 : 400,
                cursor: item.soon ? "default" : "pointer",
              }}
            >
              {item.label}
              {item.soon && (
                <span className="text-[10px]" style={{ color: "rgba(17,17,17,0.4)" }}>
                  (coming soon)
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(17,17,17,0.5)" }}>
          Built by JPMorgan &amp; Morgan Stanley alumni
        </p>
        <button
          type="button"
          onClick={onReset}
          className="self-start text-[11px] underline underline-offset-2"
          style={{ color: "rgba(17,17,17,0.4)" }}
        >
          Reset demo
        </button>
      </div>
    </aside>
  )
}

// ── Action card ─────────────────────────────────────────────────────────────
function ActionCardItem({ card }: { card: ActionCard }) {
  const points = pointsForCard(card)
  return (
    <article
      className="flex flex-col gap-4 border p-6"
      style={{ borderRadius: 4, borderColor: navy, backgroundColor: white }}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: navy, color: cream }}
        >
          {card.priority}
        </span>
        <span className="text-xs font-semibold" style={{ color: gold }}>
          +{points} pts
        </span>
      </div>

      <h3 className="font-heading text-xl font-bold leading-tight" style={{ color: navy }}>
        {card.title}
      </h3>

      <p className="text-lg font-bold" style={{ color: gold }}>
        {card.impact}
      </p>

      <ol className="flex flex-col gap-2">
        {card.steps.slice(0, 3).map((step, i) => (
          <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(17,17,17,0.75)" }}>
            <span className="font-semibold" style={{ color: navy }}>
              {i + 1}.
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(17,17,17,0.5)" }}>
          {card.platform}
        </span>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border px-5 py-2.5 text-center text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          Do This Now
        </a>
      </div>
    </article>
  )
}

// ── Empty state (Screen 3) ────────────────────────────────────────────────────
function EmptyState({
  error,
  onStartPlan,
  onRetry,
}: {
  error?: string | null
  onStartPlan: () => void
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h2 className="font-heading text-4xl" style={{ color: ink }}>
        Your plan is ready to build
      </h2>
      <p className="mt-3 max-w-md text-base" style={{ color: navy }}>
        Complete your profile to unlock your personalized wealth plan.
      </p>
      {error && (
        <p className="mt-4 max-w-md text-sm italic" style={{ color: navy }}>
          {error}
        </p>
      )}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onStartPlan}
          className="border px-8 py-3 text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          Start My Plan
        </button>
        {error && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: navy }}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard({
  cards,
  error,
  onStartPlan,
  onRetry,
  onReset,
}: {
  cards: ActionCard[]
  error?: string | null
  onStartPlan: () => void
  onRetry?: () => void
  onReset: () => void
}) {
  const hasPlan = cards.length > 0

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: cream }}>
      <Sidebar onReset={onReset} />

      <main className="flex flex-1 flex-col px-6 py-10 sm:px-10">
        {hasPlan ? (
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="font-heading text-4xl" style={{ color: ink }}>
              Good morning, {DEMO_USER.name}
            </h1>
            <p className="mt-2 text-base" style={{ color: navy }}>
              Here is what needs your attention.
            </p>

            {/* Wealth score */}
            <section
              className="mt-8 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center"
              style={{ borderRadius: 4, backgroundColor: navy }}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: gold }}>
                  Your Wealth Score
                </p>
                <p className="mt-3 max-w-sm text-sm" style={{ color: cream, opacity: 0.8 }}>
                  Complete these actions to increase your score.
                </p>
              </div>
              <ScoreRing score={WEALTH_SCORE} max={WEALTH_SCORE_MAX} />
            </section>

            {/* Action cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <ActionCardItem key={`${card.priority}-${card.title}`} card={card} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState error={error} onStartPlan={onStartPlan} onRetry={onRetry} />
        )}
      </main>
    </div>
  )
}
