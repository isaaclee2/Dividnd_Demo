"use client"

import { useState } from "react"
import {
  SALARY_OPTIONS,
  US_STATES,
  MATCH_OPTIONS,
  LOAN_RATE_OPTIONS,
  type PlanInput,
} from "@/lib/plan-data"

const NAVY = "#2C3E6B"
const CREAM = "#FAF7F2"
const GOLD = "#C9A84C"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium" style={{ color: CREAM }}>
        {label}
      </span>
      {children}
    </label>
  )
}

const selectClass =
  "w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm text-[#FAF7F2] outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] appearance-none"

export function InputForm({
  onSubmit,
}: {
  onSubmit: (data: PlanInput) => void
}) {
  const [salary, setSalary] = useState(SALARY_OPTIONS[0])
  const [stateValue, setStateValue] = useState(US_STATES[0])
  const [studentLoans, setStudentLoans] = useState(false)
  const [match, setMatch] = useState(MATCH_OPTIONS[0])
  const [loanRate, setLoanRate] = useState(LOAN_RATE_OPTIONS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ salary, state: stateValue, studentLoans, match, loanRate })
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ backgroundColor: NAVY }}
    >
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: CREAM }}
          >
            Welthly
          </h1>
          <p className="mt-2 text-sm" style={{ color: CREAM, opacity: 0.7 }}>
            Build wealth like the wealthy do
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Field label="Annual salary">
            <select
              className={selectClass}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            >
              {SALARY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "200000+"
                    ? "$200,000+"
                    : `$${Number(s).toLocaleString()}`}
                </option>
              ))}
            </select>
          </Field>

          <Field label="State">
            <select
              className={selectClass}
              value={stateValue}
              onChange={(e) => setStateValue(e.target.value)}
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: CREAM }}>
              Student loans
            </span>
            <div
              className="flex overflow-hidden rounded-md border border-white/20"
              role="group"
              aria-label="Student loans"
            >
              {[
                { label: "No", value: false },
                { label: "Yes", value: true },
              ].map((opt) => {
                const active = studentLoans === opt.value
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setStudentLoans(opt.value)}
                    className="flex-1 px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: active ? GOLD : "transparent",
                      color: active ? NAVY : CREAM,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Field label="Employer 401k match">
            <select
              className={selectClass}
              value={match}
              onChange={(e) => setMatch(e.target.value)}
            >
              {MATCH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Student loan interest rate">
            <select
              className={selectClass}
              value={loanRate}
              onChange={(e) => setLoanRate(e.target.value)}
            >
              {LOAN_RATE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            className="mt-2 rounded-md px-6 py-4 text-base font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Build My Plan
          </button>
        </form>
      </div>
    </main>
  )
}
