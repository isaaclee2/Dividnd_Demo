"use client"

import { type ActionCard } from "@/lib/plan-data"

const NAVY = "#2C3E6B"
const CREAM = "#FAF7F2"
const GOLD = "#C9A84C"

function Card({ card }: { card: ActionCard }) {
  return (
    <article
      className="flex flex-col gap-4 rounded-xl border-2 bg-white p-6"
      style={{ borderColor: NAVY }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: NAVY, color: CREAM }}
        >
          {card.priority}
        </span>
        <h3
          className="text-pretty text-xl font-bold leading-tight"
          style={{ color: NAVY }}
        >
          {card.title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600">{card.why}</p>

      <p className="text-lg font-bold" style={{ color: NAVY }}>
        {card.impact}
      </p>

      <ol className="flex flex-col gap-2">
        {card.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-neutral-700">
            <span className="font-semibold" style={{ color: GOLD }}>
              {i + 1}.
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Platform: {card.platform}
        </span>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md px-5 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD, color: NAVY }}
        >
          Do This Now
        </a>
      </div>
    </article>
  )
}

export function ActionPlan({
  cards,
  onRestart,
}: {
  cards: ActionCard[]
  onRestart: () => void
}) {
  return (
    <main className="min-h-screen px-6 py-12" style={{ backgroundColor: CREAM }}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: NAVY }}>
            Your Welthly Plan
          </h1>
          <button
            type="button"
            onClick={onRestart}
            className="mt-4 text-sm font-medium underline underline-offset-4"
            style={{ color: NAVY }}
          >
            Start over
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.priority} card={card} />
          ))}
        </div>
      </div>
    </main>
  )
}
