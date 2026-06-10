import type { ActionCard } from "./plan-data"

// ── Brand palette (the only colors allowed) ─────────────────────────────────
export const COLORS = {
  cream: "#FAF7F2",
  navy: "#2C3E6B",
  gold: "#C9A84C",
  ink: "#111111",
  white: "#FFFFFF",
} as const

// ── Demo user + wealth score ────────────────────────────────────────────────
export const DEMO_USER = { name: "Aditya" } as const

// Base 20 + (match / Roth IRA / emergency fund / no high-interest debt) at 20 each.
// Hardcoded to 40/100 for the demo user.
export const WEALTH_SCORE = 40
export const WEALTH_SCORE_MAX = 100

// ── Onboarding option sets ──────────────────────────────────────────────────
export const EMPLOYMENT_OPTIONS = [
  "Student",
  "Part-time",
  "Full-time",
  "First job lined up",
]

export const INVESTMENT_OPTIONS = ["None", "A little", "Yes, a real portfolio"]

export const DEBT_OPTIONS = ["None", "Student loans", "Credit card", "Both"]

export const MATCH_BANDS = ["None", "2%", "3%", "4%", "5%", "6%+", "Unknown"]

// Only shown when the user actually has student loans.
export const LOAN_RATE_BANDS = ["Under 4%", "4–6%", "Over 6%"]

export const GRAD_OPTIONS = ["Yes, soon", "Already graduated", "Not yet"]

export const JOB_OFFER_OPTIONS = ["Yes, full-time offer", "Internship", "Not yet"]

export const PARENTS_OPTIONS = ["Yes", "Somewhat", "No", "Prefer not to say"]

export type OnboardingAnswers = {
  employment: string
  salaryValue: string // numeric string for the API
  salaryDisplay: string // e.g. "$120,000"
  state: string
  investments: string
  match: string
  debt: string
  hasLoans: boolean // derived from `debt`
  loanRate: string
  graduatingSoon: string
  jobOffer: string
  parentsComfortable: string
}

// ── Map answers to the API request body (matches the existing route contract) ─
export function toApiInput(a: OnboardingAnswers) {
  const match =
    a.match === "None"
      ? "0%"
      : a.match === "Unknown"
        ? "I don't know"
        : a.match === "6%+"
          ? "6%"
          : a.match
  return {
    salary: a.salaryValue,
    state: a.state,
    hasLoans: a.hasLoans,
    match,
    loanRate: a.hasLoans ? a.loanRate : "No loans",
    employment: a.employment,
    investments: a.investments,
    debt: a.debt,
    graduatingSoon: a.graduatingSoon,
    jobOffer: a.jobOffer,
    parentsComfortable: a.parentsComfortable,
  }
}

// ── Per-card score contribution (shown on each action card) ──────────────────
export function pointsForCard(card: ActionCard): number {
  const t = `${card.title} ${card.why}`.toLowerCase()
  if (/(401|employer match)/.test(t)) return 20
  if (/(roth|ira|backdoor)/.test(t)) return 20
  if (/(emergency|cushion|savings|safety net)/.test(t)) return 20
  if (/(debt|loan|high.interest)/.test(t)) return 20
  return 10
}

// ── localStorage persistence (guarded for SSR) ───────────────────────────────
const ANSWERS_KEY = "welthly:onboarding"
const PLAN_KEY = "welthly:plan"
const COMPLETE_KEY = "welthly:complete"

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function loadAnswers(): OnboardingAnswers | null {
  return read<OnboardingAnswers>(ANSWERS_KEY)
}

export function saveAnswers(answers: OnboardingAnswers) {
  write(ANSWERS_KEY, answers)
}

export function loadPlan(): ActionCard[] | null {
  return read<ActionCard[]>(PLAN_KEY)
}

export function savePlan(cards: ActionCard[]) {
  write(PLAN_KEY, cards)
}

export function isComplete(): boolean {
  return read<boolean>(COMPLETE_KEY) === true
}

export function setComplete(value: boolean) {
  write(COMPLETE_KEY, value)
}

export function resetWelthly() {
  if (typeof window === "undefined") return
  ;[ANSWERS_KEY, PLAN_KEY, COMPLETE_KEY].forEach((k) =>
    window.localStorage.removeItem(k)
  )
}
