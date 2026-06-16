import type { ActionCard } from "./plan-data"

// ── Brand palette (the only colors allowed) ─────────────────────────────────
// Black, white & navy blue (light only). Each token resolves to a CSS variable
// defined in globals.css. Token names are kept so existing usages re-theme:
//   cream → --c-cream (page background + text sitting on the accent fill)
//   white → --c-white (cards, inputs, panels, sidebar surfaces)
//   ink   → --c-ink   (primary text)
//   navy  → --c-navy  (accent / brand — navy blue)
//   gold  → --c-navy  (accents — gold dropped, mapped to the accent)
export const COLORS = {
  cream: "var(--c-cream)",
  navy: "var(--c-navy)",
  gold: "var(--c-gold)",
  ink: "var(--c-ink)",
  white: "var(--c-white)",
  sidebar: "var(--c-sidebar)",
  border: "var(--c-border)",
  muted: "var(--c-muted)",
  red: "var(--c-red)",
} as const

// ── Demo user ────────────────────────────────────────────────────────────────
export const DEMO_USER = { name: "Jordan" } as const

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
  goal: string // free-text life goal from the open text box
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

// ── localStorage persistence (guarded for SSR) ───────────────────────────────
const ANSWERS_KEY = "dividnd:onboarding"
const PLAN_KEY = "dividnd:plan"
const COMPLETE_KEY = "dividnd:complete"

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

export function resetDividnd() {
  if (typeof window === "undefined") return
  // "dividnd:events" is owned by lib/demo-state.ts; cleared here too so a reset
  // wipes the whole demo (avoids an import cycle by using the literal key).
  ;[ANSWERS_KEY, PLAN_KEY, COMPLETE_KEY, "dividnd:events"].forEach((k) =>
    window.localStorage.removeItem(k)
  )
}
