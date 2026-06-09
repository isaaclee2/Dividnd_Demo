"use client"

import { useState } from "react"
import { InputForm } from "@/components/input-form"
import { ActionPlan } from "@/components/action-plan"
import type { PlanInput } from "@/lib/plan-data"

export default function Page() {
  const [plan, setPlan] = useState<PlanInput | null>(null)

  if (plan) {
    return <ActionPlan onRestart={() => setPlan(null)} />
  }

  return <InputForm onSubmit={setPlan} />
}
