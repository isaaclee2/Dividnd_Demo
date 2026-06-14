// ── Dividnd demo state ────────────────────────────────────────────────────────
// The entire Home/Plan demo is a pure function of an ordered list of applied
// event ids (persisted to localStorage). Everything shown is derived from that
// list, so refresh is safe and "Reset demo" just clears it. No LLM, fully
// deterministic — every run is identical.

export type Account = {
  id: string
  label: string
  value: number
  kind: "asset" | "debt"
  note?: string
  setup: boolean // false → not opened yet (rendered muted as "Not set up")
}

export type Situation = {
  salaryActive: boolean
  salary: number
  accounts: Account[]
}

export type PlanItem = {
  id: string
  title: string
  why: string
  cta?: string // the Approve verb (e.g. "Move it", "Open it")
}

// Passive observations from the user's linked bank accounts (Plaid), shown on
// Home. Informational only — no actions (those live in the Plan).
export type Observation = { id: string; text: string; tone: "good" | "watch" | "info" }

export const OBSERVATIONS: Observation[] = [
  { id: "spend-down", text: "You spent $290 less than last month — way to go!", tone: "good" },
  { id: "deposit", text: "A $1,500 deposit landed in your Chase account on Tuesday.", tone: "info" },
  { id: "dining-up", text: "Heads up — your dining spending is up 24% this week.", tone: "watch" },
  { id: "no-fees", text: "No overdrafts or late fees this month. Clean sheet.", tone: "good" },
]

export type DemoEvent = {
  id: string
  chip?: string // label shown as a chat suggestion (omit → not suggested)
  keywords: string[] // free-text triggers for the demo chatbot router
  confirm: string // confirmation the chatbot replies with after applying
  patch: (s: Situation) => Situation // deterministic situation change
}

// Jordan's life goal — shown atop the Plan.
export const GOAL = "Buy a house in the next 4 years · help my parents retire."

// ── Jordan's starting situation ──────────────────────────────────────────────
export const BASE_SITUATION: Situation = {
  salaryActive: false,
  salary: 95000,
  accounts: [
    { id: "checking", label: "Chase Checking", value: 4000, kind: "asset", note: "0.01% APY", setup: true },
    { id: "savings", label: "Ally HYSA", value: 0, kind: "asset", note: "4.40% APY", setup: false },
    { id: "roth", label: "Roth IRA", value: 0, kind: "asset", note: "Tax-free growth", setup: false },
    { id: "k401", label: "401(k)", value: 0, kind: "asset", note: "Not enrolled", setup: false },
    { id: "loans", label: "Student Loans", value: 27000, kind: "debt", note: "5.50% APR", setup: true },
  ],
}

// ── The plan (todo items). Ids match the event that completes them. ──────────
export const INITIAL_PLAN: PlanItem[] = [
  {
    id: "roth",
    title: "Open a Roth IRA",
    why: "Tax-free growth, and this is your lowest-tax year. Do it before you graduate.",
    cta: "Open it",
  },
  {
    id: "hysa",
    title: "Move idle cash to high-yield savings",
    why: "Your $4,000 is earning 0.01% — make about $180 more this year.",
    cta: "Move it",
  },
  {
    id: "k401",
    title: "Enroll in your 401(k) match",
    why: "Your employer matches $2,850 a year. Don't leave it on the table.",
    cta: "Enroll me",
  },
  {
    id: "austin",
    title: "Compare Austin vs California",
    why: "Your Austin offer is worth about $6,200/year more than California.",
    cta: "Show me",
  },
  {
    id: "loans",
    title: "Pay off loans vs invest",
    why: "We did the math on your 5.5% loans — here's the call.",
    cta: "See the math",
  },
]

// ── Helpers to update one account immutably ──────────────────────────────────
function patchAccount(s: Situation, id: string, change: Partial<Account>): Situation {
  return {
    ...s,
    accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...change } : a)),
  }
}

function adjustValue(s: Situation, id: string, delta: number): Situation {
  return {
    ...s,
    accounts: s.accounts.map((a) => (a.id === id ? { ...a, value: a.value + delta } : a)),
  }
}

// ── Scripted life events ─────────────────────────────────────────────────────
// An event whose id matches a plan item id completes that item when applied.
export const EVENTS: DemoEvent[] = [
  {
    id: "paycheck",
    chip: "Got my first paycheck",
    keywords: ["paycheck", "got paid", "first check", "first paycheck", "payday", "started my job", "start my job", "got my job"],
    confirm: "First paycheck in — $4,800 landed in your Chase checking.",
    patch: (s) => adjustValue({ ...s, salaryActive: true }, "checking", 4800),
  },
  {
    id: "hysa",
    chip: "Moved cash to high-yield savings",
    keywords: ["savings", "hysa", "high yield", "high-yield", "moved cash", "moved my", "moved the", "ally", "idle cash"],
    confirm: "Moved $4,000 to your Ally HYSA at 4.40% APY.",
    patch: (s) => {
      const moved = adjustValue(s, "checking", -4000)
      return patchAccount(moved, "savings", { value: 4000, setup: true })
    },
  },
  {
    id: "k401",
    chip: "Enrolled in my 401(k) match",
    keywords: ["401", "401k", "401(k)", "employer match", "enrolled", "match"],
    confirm: "Enrolled at 3% — you're capturing the full $2,850 employer match.",
    patch: (s) =>
      patchAccount(s, "k401", { value: 240, setup: true, note: "Enrolled · 3% match (~$2,850/yr)" }),
  },
  {
    id: "roth",
    chip: "Opened a Roth IRA",
    keywords: ["roth", "ira"],
    confirm: "Roth IRA opened — first $500 invested, tax-free for life.",
    patch: (s) => patchAccount(s, "roth", { value: 500, setup: true }),
  },
  {
    id: "loans",
    chip: "Paid extra $5,000 on my loans",
    keywords: ["loan", "loans", "student debt", "paid off", "paid down", "extra payment", "paid extra"],
    confirm: "Paid $5,000 toward your loans — balance down to $22,000.",
    patch: (s) => adjustValue(s, "loans", -5000),
  },
  {
    // Insight (no suggestion chip): the chatbot can still surface it on request.
    id: "austin",
    keywords: ["austin", "california", "cost of living", "move to texas"],
    confirm: "Reviewed — Austin saves you $6,200/year vs California.",
    patch: (s) => s,
  },
]

export function getEvent(id: string): DemoEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

// Map a free-text chat message to a scripted event id (first keyword hit), or
// null if nothing matches. Deterministic — no LLM, safe for a live demo.
export function routeMessage(text: string): string | null {
  const t = text.toLowerCase()
  for (const e of EVENTS) {
    if (e.keywords.some((k) => t.includes(k))) return e.id
  }
  return null
}

// ── Derivation ───────────────────────────────────────────────────────────────
export const PLAN_TOTAL = INITIAL_PLAN.length

export type DerivedState = {
  situation: Situation
  planItems: { item: PlanItem; done: boolean }[]
  completedCount: number
}

export function deriveState(appliedIds: string[]): DerivedState {
  const situation = appliedIds.reduce<Situation>((s, id) => {
    const event = getEvent(id)
    return event ? event.patch(s) : s
  }, BASE_SITUATION)

  const planItems = INITIAL_PLAN.map((item) => ({
    item,
    done: appliedIds.includes(item.id),
  }))
  const completedCount = planItems.filter((p) => p.done).length

  return { situation, planItems, completedCount }
}

export function netWorth(s: Situation): number {
  return s.accounts.reduce((sum, a) => sum + (a.kind === "debt" ? -a.value : a.value), 0)
}

// A short, plain-English snapshot of where Jordan stands — derived from the
// live situation, so it updates as the plan gets acted on.
export function situationSummary(s: Situation): string {
  const acct = (id: string) => s.accounts.find((a) => a.id === id)
  const cash = (acct("checking")?.value ?? 0) + (acct("savings")?.setup ? acct("savings")!.value : 0)
  const loans = acct("loans")?.value ?? 0
  const investing = Boolean(acct("roth")?.setup || acct("k401")?.setup)

  const start = s.salaryActive ? "now earning" : "about to start"
  const loanPart = loans > 0 ? ` and ${formatMoney(loans)} in student loans at 5.5%` : " and no student debt"
  const investPart = investing
    ? ", and you've started investing for the future."
    : ", and you haven't started investing yet."

  return `You're 22 and ${start} a ${formatMoney(s.salary)} job in Austin. You've got ${formatMoney(cash)} in cash${loanPart}${investPart}`
}

// ── Portfolio projection ─────────────────────────────────────────────────────
// Illustrative (not financial-grade): same dollars saved each year either way —
// the only difference is the vehicle. Following the plan invests it (~7%);
// "doing nothing" leaves it in a basic savings account (~0.5%). Expenses and
// taxes are excluded. Deterministic for the demo.
export const PROJECTION_YEARS = 40
export const SAVINGS_RATE = 0.1 // ~10% of income saved each year
export const ANNUAL_SAVINGS = Math.round(BASE_SITUATION.salary * SAVINGS_RATE) // $9,500 on $95k

export type Projection = { years: number[]; strategy: number[]; statusQuo: number[] }

export function projectPortfolios(): Projection {
  const years: number[] = []
  const strategy: number[] = []
  const statusQuo: number[] = []

  let s = 0 // following the plan: invested
  let q = 0 // doing nothing: a basic savings account
  const INVEST_RETURN = 0.07
  const SAVINGS_RETURN = 0.005

  for (let y = 0; y <= PROJECTION_YEARS; y++) {
    years.push(y)
    strategy.push(Math.round(s))
    statusQuo.push(Math.round(q))
    s = s * (1 + INVEST_RETURN) + ANNUAL_SAVINGS
    q = q * (1 + SAVINGS_RETURN) + ANNUAL_SAVINGS
  }

  return { years, strategy, statusQuo }
}

export function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : ""
  return `${sign}$${Math.abs(n).toLocaleString("en-US")}`
}

// ── localStorage persistence (guarded for SSR) ───────────────────────────────
export const EVENTS_KEY = "dividnd:events"

export function loadEvents(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(EVENTS_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

export function saveEvents(ids: string[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(ids))
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}
