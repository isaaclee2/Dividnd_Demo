"use client"

import { useState } from "react"
import { InputForm } from "@/components/input-form"
import { ActionPlan } from "@/components/action-plan"
import type { ActionCard, PlanInput } from "@/lib/plan-data"

const NAVY = "#2C3E6B"
const CREAM = "#FAF7F2"

type Status = "idle" | "loading" | "done"

export default function Page() {
  const [status, setStatus] = useState<Status>("idle")
  const [cards, setCards] = useState<ActionCard[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: PlanInput) {
    setStatus("loading")
    setError(null)
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salary: data.salary,
          state: data.state,
          hasLoans: data.studentLoans,
          match: data.match,
          loanRate: data.loanRate,
        }),
      })

      const json = await res.json().catch(() => null)

      if (!res.ok || !json?.cards) {
        throw new Error(
          json?.error || "Something went wrong. Please try again."
        )
      }

      setCards(json.cards as ActionCard[])
      setStatus("done")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
      setStatus("idle")
    }
  }

  function reset() {
    setStatus("idle")
    setCards([])
    setError(null)
  }

  if (status === "loading") {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center"
        style={{ backgroundColor: NAVY }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#C9A84C]" />
        <p
          className="mt-6 text-lg font-medium"
          style={{ color: CREAM }}
        >
          Analyzing your situation...
        </p>
      </main>
    )
  }

  if (status === "done") {
    return <ActionPlan cards={cards} onRestart={reset} />
  }

  return <InputForm onSubmit={handleSubmit} error={error} />
}
