"use client"

import { useEffect, useState } from "react"
import { Onboarding } from "@/components/onboarding"
import { ConnectBank } from "@/components/connect-bank"
import { Dashboard } from "@/components/dashboard"
import {
  COLORS,
  saveAnswers,
  isComplete,
  setComplete,
  resetDividnd,
  type OnboardingAnswers,
} from "@/lib/dividnd"

type Phase = "init" | "onboarding" | "connect" | "dashboard"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("init")

  // Decide the starting screen from localStorage (client only, avoids hydration flash).
  useEffect(() => {
    setPhase(isComplete() ? "dashboard" : "onboarding")
  }, [])

  // Onboarding done → save answers, go to the bank-connect screen (no LLM call).
  function handleComplete(answers: OnboardingAnswers) {
    saveAnswers(answers)
    setPhase("connect")
  }

  // "Connect with Chase" done → enter the app (Home tab).
  function handleConnected() {
    setComplete(true)
    setPhase("dashboard")
  }

  function handleReset() {
    resetDividnd()
    setPhase("onboarding")
  }

  if (phase === "init") {
    return <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }} />
  }

  if (phase === "onboarding") {
    return <Onboarding onComplete={handleComplete} />
  }

  if (phase === "connect") {
    return <ConnectBank onConnected={handleConnected} />
  }

  return <Dashboard onReset={handleReset} />
}
