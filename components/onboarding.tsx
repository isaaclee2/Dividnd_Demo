"use client"

import { useMemo, useState } from "react"
import { US_STATES } from "@/lib/plan-data"
import {
  COLORS,
  EMPLOYMENT_OPTIONS,
  INVESTMENT_OPTIONS,
  DEBT_OPTIONS,
  MATCH_BANDS,
  LOAN_RATE_BANDS,
  GRAD_OPTIONS,
  JOB_OFFER_OPTIONS,
  PARENTS_OPTIONS,
  type OnboardingAnswers,
} from "@/lib/dividnd"

const { navy, gold, cream, ink, white } = COLORS

// Fixed order; "loanRate" is only shown when the user has student loans.
const STEP_ORDER = [
  "employment",
  "salary",
  "state",
  "investments",
  "match",
  "debt",
  "loanRate",
  "grad",
  "jobOffer",
  "parents",
  "goal",
] as const
type StepKey = (typeof STEP_ORDER)[number]

// ── Shared segmented selector ────────────────────────────────────────────────
function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="border px-5 py-3 text-sm font-medium transition-colors"
            style={{
              borderRadius: 4,
              borderColor: navy,
              backgroundColor: active ? navy : white,
              color: active ? cream : ink,
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-2xl" style={{ color: navy }}>
      {children}
    </p>
  )
}

export function Onboarding({
  onComplete,
}: {
  onComplete: (answers: OnboardingAnswers) => void
}) {
  const [stepIndex, setStepIndex] = useState(0)

  // Pre-filled as "Jordan" for the scripted demo — presenter just clicks Next.
  const [employment, setEmployment] = useState("Student")
  const [salaryValue, setSalaryValue] = useState("95000")
  const [stateQuery, setStateQuery] = useState("Texas")
  const [stateOpen, setStateOpen] = useState(false)
  const [investments, setInvestments] = useState("None")
  const [match, setMatch] = useState("3%")
  const [debt, setDebt] = useState("Student loans")
  const [loanRate, setLoanRate] = useState("4–6%")
  const [graduatingSoon, setGraduatingSoon] = useState("Yes, soon")
  const [jobOffer, setJobOffer] = useState("Yes, full-time offer")
  const [parentsComfortable, setParentsComfortable] = useState("Somewhat")
  // The open text box is left empty so Jordan types the goal live on stage.
  const [goal, setGoal] = useState("")

  const hasStudentLoans = debt === "Student loans" || debt === "Both"

  const visibleSteps = useMemo<StepKey[]>(
    () => STEP_ORDER.filter((k) => k !== "loanRate" || hasStudentLoans),
    [hasStudentLoans]
  )
  const total = visibleSteps.length
  const current = visibleSteps[Math.min(stepIndex, total - 1)]

  const matchedState = useMemo(
    () =>
      US_STATES.find((s) => s.toLowerCase() === stateQuery.trim().toLowerCase()) ??
      "",
    [stateQuery]
  )
  const stateSuggestions = useMemo(() => {
    const q = stateQuery.trim().toLowerCase()
    if (!q || matchedState) return []
    return US_STATES.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
  }, [stateQuery, matchedState])

  const canAdvance: Record<StepKey, boolean> = {
    employment: employment !== "",
    salary: salaryValue !== "",
    state: matchedState !== "",
    investments: investments !== "",
    match: match !== "",
    debt: debt !== "",
    loanRate: loanRate !== "",
    grad: graduatingSoon !== "",
    jobOffer: jobOffer !== "",
    parents: parentsComfortable !== "",
    goal: true, // optional — never blocks advancing
  }

  function handleNext() {
    if (!canAdvance[current]) return
    if (stepIndex < total - 1) {
      setStepIndex((s) => s + 1)
      return
    }
    onComplete({
      employment,
      salaryValue,
      salaryDisplay: salaryValue ? `$${Number(salaryValue).toLocaleString()}` : "",
      state: matchedState,
      investments,
      match,
      debt,
      hasLoans: hasStudentLoans,
      loanRate: hasStudentLoans ? loanRate : "No loans",
      graduatingSoon,
      jobOffer,
      parentsComfortable,
      goal,
    })
  }

  return (
    <main
      className="flex min-h-screen flex-col px-6 py-10"
      style={{ backgroundColor: cream }}
    >
      {/* Progress bar */}
      <div className="mx-auto w-full max-w-2xl">
        <div
          className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider"
          style={{ color: navy }}
        >
          <span>
            Step {stepIndex + 1} of {total}
          </span>
          <span>{Math.round(((stepIndex + 1) / total) * 100)}%</span>
        </div>
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: "var(--c-tint)", borderRadius: 4 }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((stepIndex + 1) / total) * 100}%`,
              backgroundColor: gold,
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto mt-12 w-full max-w-2xl">
        <h1 className="font-heading text-4xl sm:text-5xl" style={{ color: ink }}>
          Let&apos;s build your wealth plan
        </h1>
        <p className="mt-3 text-base" style={{ color: navy }}>
          A few quick questions.
        </p>
      </div>

      {/* Question */}
      <div className="mx-auto mt-12 w-full max-w-2xl flex-1">
        {current === "employment" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Do you have a job right now?</QuestionLabel>
            <Segmented options={EMPLOYMENT_OPTIONS} value={employment} onChange={setEmployment} />
          </div>
        )}

        {current === "salary" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>What is your annual salary?</QuestionLabel>
            <p className="-mt-2 text-sm" style={{ color: navy, opacity: 0.7 }}>
              Enter your current or expected starting salary. Use 0 if you have no income yet.
            </p>
            <div className="relative max-w-xs">
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base"
                style={{ color: ink }}
              >
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={salaryValue ? Number(salaryValue).toLocaleString() : ""}
                onChange={(e) => setSalaryValue(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="65,000"
                className="w-full border py-3 pl-8 pr-4 text-base outline-none"
                style={{ borderRadius: 4, borderColor: navy, backgroundColor: white, color: ink }}
              />
            </div>
          </div>
        )}

        {current === "state" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>What state do you live in?</QuestionLabel>
            <div className="relative max-w-md">
              <input
                type="text"
                value={stateQuery}
                onChange={(e) => {
                  setStateQuery(e.target.value)
                  setStateOpen(true)
                }}
                onFocus={() => setStateOpen(true)}
                placeholder="Start typing a state…"
                autoComplete="off"
                className="w-full border px-4 py-3 text-base outline-none"
                style={{ borderRadius: 4, borderColor: navy, backgroundColor: white, color: ink }}
              />
              {stateOpen && stateSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 w-full overflow-hidden border bg-white"
                  style={{ borderRadius: 4, borderColor: navy }}
                >
                  {stateSuggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => {
                          setStateQuery(s)
                          setStateOpen(false)
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:[background-color:var(--c-hover)]"
                        style={{ color: ink }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {current === "investments" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Do you have any investments already?</QuestionLabel>
            <Segmented options={INVESTMENT_OPTIONS} value={investments} onChange={setInvestments} />
          </div>
        )}

        {current === "match" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Employer 401(k) match</QuestionLabel>
            <p className="-mt-2 text-sm" style={{ color: navy, opacity: 0.7 }}>
              The percentage your employer matches. Pick Unknown if you have never checked.
            </p>
            <Segmented options={MATCH_BANDS} value={match} onChange={setMatch} />
          </div>
        )}

        {current === "debt" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Any debt?</QuestionLabel>
            <Segmented options={DEBT_OPTIONS} value={debt} onChange={setDebt} />
          </div>
        )}

        {current === "loanRate" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Student loan interest rate</QuestionLabel>
            <Segmented options={LOAN_RATE_BANDS} value={loanRate} onChange={setLoanRate} />
          </div>
        )}

        {current === "grad" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Are you graduating soon?</QuestionLabel>
            <Segmented options={GRAD_OPTIONS} value={graduatingSoon} onChange={setGraduatingSoon} />
          </div>
        )}

        {current === "jobOffer" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Do you have a job offer or internship lined up?</QuestionLabel>
            <Segmented options={JOB_OFFER_OPTIONS} value={jobOffer} onChange={setJobOffer} />
          </div>
        )}

        {current === "parents" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>Are your parents financially comfortable?</QuestionLabel>
            <p className="-mt-2 text-sm" style={{ color: navy, opacity: 0.7 }}>
              This helps us judge how much financial knowledge you may already have at home.
            </p>
            <Segmented
              options={PARENTS_OPTIONS}
              value={parentsComfortable}
              onChange={setParentsComfortable}
            />
          </div>
        )}

        {current === "goal" && (
          <div className="flex flex-col gap-5">
            <QuestionLabel>What are you working toward?</QuestionLabel>
            <p className="-mt-2 text-sm" style={{ color: navy, opacity: 0.7 }}>
              Tell Dividnd your goals in your own words.
            </p>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={4}
              placeholder="e.g. I want to buy a house in the next 4 years and eventually help my parents retire"
              className="w-full resize-none border px-4 py-3 text-base outline-none"
              style={{ borderRadius: 4, borderColor: navy, backgroundColor: white, color: ink }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mx-auto mt-12 flex w-full max-w-2xl items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
          disabled={stepIndex === 0}
          className="text-sm font-medium disabled:opacity-0"
          style={{ color: navy }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance[current]}
          className="border px-8 py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          {stepIndex < total - 1 ? "Next" : "See My Plan"}
        </button>
      </div>
    </main>
  )
}
