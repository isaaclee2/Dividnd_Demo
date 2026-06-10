"use client"

import { useEffect, useState } from "react"
import { Onboarding } from "@/components/onboarding"
import { Analyzing } from "@/components/analyzing"
import { Dashboard } from "@/components/dashboard"
import type { ActionCard } from "@/lib/plan-data"
import {
  COLORS,
  loadAnswers,
  loadPlan,
  savePlan,
  saveAnswers,
  isComplete,
  setComplete,
  resetWelthly,
  toApiInput,
  type OnboardingAnswers,
} from "@/lib/welthly"

type Phase = "init" | "onboarding" | "analyzing" | "dashboard"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("init")
  const [cards, setCards] = useState<ActionCard[]>([])
  const [error, setError] = useState<string | null>(null)

  // Decide the starting screen from localStorage (client only, avoids hydration flash).
  useEffect(() => {
    const plan = loadPlan()
    if (plan && plan.length > 0) {
      setCards(plan)
      setPhase("dashboard")
    } else if (isComplete()) {
      setPhase("dashboard")
    } else {
      setPhase("onboarding")
    }
  }, [])

  async function runRecommend(input: ReturnType<typeof toApiInput>) {
    setPhase("analyzing")
    setError(null)
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.cards) {
        throw new Error(json?.error || "We couldn't build your plan. Please try again.")
      }
      const plan = json.cards as ActionCard[]
      savePlan(plan)
      setCards(plan)
      setPhase("dashboard")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't build your plan. Please try again."
      )
      setCards([])
      setPhase("dashboard")
    }
  }

  function handleComplete(answers: OnboardingAnswers) {
    saveAnswers(answers)
    setComplete(true)
    runRecommend(toApiInput(answers))
  }

  function handleStartPlan() {
    setError(null)
    setPhase("onboarding")
  }

  function handleRetry() {
    const answers = loadAnswers()
    if (answers) {
      runRecommend(toApiInput(answers))
    } else {
      setPhase("onboarding")
    }
  }

  function handleReset() {
    resetWelthly()
    setCards([])
    setError(null)
    setPhase("onboarding")
  }

  if (phase === "init") {
    return <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }} />
  }

  if (phase === "onboarding") {
    return <Onboarding onComplete={handleComplete} />
  }

  if (phase === "analyzing") {
    return <Analyzing />
  }

  return (
    <Dashboard
      cards={cards}
      error={error}
      onStartPlan={handleStartPlan}
      onRetry={handleRetry}
      onReset={handleReset}
    />
  )
}
