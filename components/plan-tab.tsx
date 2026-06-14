"use client"

import { COLORS } from "@/lib/dividnd"
import { GOAL, PLAN_TOTAL, situationSummary, type DerivedState, type PlanItem } from "@/lib/demo-state"

const { navy, cream, ink, white } = COLORS

function TodoCard({ item, onDone }: { item: PlanItem; onDone: () => void }) {
  return (
    <article
      className="flex flex-col gap-3 border p-6"
      style={{ borderRadius: 4, borderColor: navy, backgroundColor: white }}
    >
      <h3 className="font-heading text-lg font-bold leading-tight" style={{ color: navy }}>
        {item.title}
      </h3>
      <p className="text-sm italic leading-relaxed" style={{ color: "var(--c-muted-70)" }}>
        {item.why}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 border px-5 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          {item.cta ?? "Approve"}
        </button>
        <button
          type="button"
          className="flex-1 border px-5 py-2.5 text-center text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: white, borderColor: navy, color: navy }}
        >
          Learn More
        </button>
      </div>
    </article>
  )
}

function DoneRow({ item, onUndo }: { item: PlanItem; onUndo: () => void }) {
  return (
    <div
      className="flex items-center gap-3 border p-4"
      style={{ borderRadius: 4, borderColor: navy, backgroundColor: white }}
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
        className="flex-none text-xs font-medium underline underline-offset-2"
        style={{ color: navy }}
      >
        Undo
      </button>
    </div>
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

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Your plan
      </h1>
      <p className="mt-2 text-base" style={{ color: navy }}>
        Ranked by impact — it updates as your situation changes.
      </p>

      {/* Where you stand — short summary derived from the live situation */}
      <section
        className="mt-6 border p-6"
        style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}
      >
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: navy }}>
          Where you stand
        </p>
        <p className="mt-2 text-base leading-relaxed" style={{ color: ink }}>
          {situationSummary(situation)}
        </p>
      </section>

      {/* Goal banner */}
      <div
        className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-4 py-1 pl-4"
        style={{ borderColor: navy }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: navy }}>
          Goal
        </span>
        <span className="text-sm" style={{ color: ink }}>
          {GOAL}
        </span>
      </div>

      {/* Progress header */}
      <section
        className="mt-8 border p-6"
        style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}
      >
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: navy }}>
          Progress
        </p>
        <p className="mt-2 text-sm" style={{ color: ink, opacity: 0.8 }}>
          {completedCount} of {PLAN_TOTAL} actions complete
        </p>
        <div
          className="mt-4 h-1.5 w-full"
          style={{ backgroundColor: "var(--c-tint)", borderRadius: 4 }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: navy, borderRadius: 4 }}
          />
        </div>
      </section>

      {/* To do */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-widest" style={{ color: navy }}>
        To do ({todo.length})
      </h2>
      {todo.length === 0 ? (
        <p className="mt-4 text-sm italic" style={{ color: "var(--c-muted-50)" }}>
          Everything&apos;s done — Jordan&apos;s plan is complete. 🎉
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {todo.map((item) => (
            <TodoCard key={item.id} item={item} onDone={() => onApply(item.id)} />
          ))}
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <>
          <h2
            className="mt-10 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--c-muted-50)" }}
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
