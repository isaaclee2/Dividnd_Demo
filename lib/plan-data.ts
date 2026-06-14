export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export const SALARY_OPTIONS = [
  "50000",
  "65000",
  "80000",
  "95000",
  "110000",
  "130000",
  "150000",
  "175000",
  "200000+",
]

export const MATCH_OPTIONS = ["0%", "2%", "3%", "4%", "5%", "6%", "I don't know"]

export const LOAN_RATE_OPTIONS = [
  "Below 4%",
  "4-6%",
  "Above 6%",
  "I don't know",
  "No loans",
]

export type PlanInput = {
  salary: string
  state: string
  studentLoans: boolean
  match: string
  loanRate: string
}

export type ActionCard = {
  priority: number
  title: string
  why: string
  impact: string
  steps: string[]
  platform: string
  url: string
}

// ── Scripted demo cards for "Jordan" (hardcoded, no LLM) ──────────────────────
// `title` = the headline, `why` = the supporting context line. The other fields
// are kept for type-compatibility but are not rendered on the demo dashboard.
export const JORDAN_CARDS: ActionCard[] = [
  {
    priority: 1,
    title: "Open a Roth IRA before May graduation — here's why this window closes forever",
    why: "The lowest income year of Jordan's life. This window never comes back.",
    impact: "",
    steps: [],
    platform: "",
    url: "#",
  },
  {
    priority: 2,
    title:
      "We noticed $4,000 sitting in your Chase checking earning 0.01%. Move it to a high yield savings account and earn $180 more this year — automatically.",
    why: "Dividnd saw it. Jordan didn't have to tell us.",
    impact: "",
    steps: [],
    platform: "",
    url: "#",
  },
  {
    priority: 3,
    title: "Set up your 401k on day one — your employer will match $2,850 for free",
    why: "Free money Jordan is one day away from leaving on the table.",
    impact: "",
    steps: [],
    platform: "",
    url: "#",
  },
  {
    priority: 4,
    title: "Austin saves you $6,200/year vs the same offer in California — here's the breakdown",
    why: "Something Jordan's friends in California don't know yet.",
    impact: "",
    steps: [],
    platform: "",
    url: "#",
  },
  {
    priority: 5,
    title: "Your student loans at 5.5% — here's the exact math on pay off vs invest",
    why: "Not a generic answer. Jordan's number, Jordan's rate, Jordan's decision.",
    impact: "",
    steps: [],
    platform: "",
    url: "#",
  },
]

export const ACTION_CARDS: ActionCard[] = [
  {
    priority: 1,
    title: "Capture Your Full 401(k) Match",
    why: "Your employer match is an instant, guaranteed return on your money. Skipping it is leaving free salary on the table every single paycheck.",
    impact: "+$3,600 / year in free money",
    steps: [
      "Log in to your employer's benefits portal.",
      "Set your 401(k) contribution to at least the full match percentage.",
      "Confirm contributions are being deducted on your next pay stub.",
    ],
    platform: "Fidelity NetBenefits",
    url: "https://nb.fidelity.com/",
  },
  {
    priority: 2,
    title: "Build a Starter Emergency Fund",
    why: "A cash cushion keeps a surprise expense from turning into high-interest debt. It is the foundation everything else is built on.",
    impact: "$2,000 buffer to protect your plan",
    steps: [
      "Open a high-yield savings account.",
      "Automate a weekly transfer until you reach $2,000.",
      "Keep this money separate from your checking account.",
    ],
    platform: "Ally Bank",
    url: "https://www.ally.com/bank/online-savings-account/",
  },
  {
    priority: 3,
    title: "Tackle High-Interest Student Loans",
    why: "Debt above 6% interest grows faster than most safe investments. Paying it down is a guaranteed return equal to the interest rate.",
    impact: "Save $4,200+ in interest",
    steps: [
      "List every loan with its balance and interest rate.",
      "Throw extra payments at the highest-rate loan first.",
      "Refinance if you can secure a meaningfully lower rate.",
    ],
    platform: "SoFi",
    url: "https://www.sofi.com/student-loan-refinancing/",
  },
  {
    priority: 4,
    title: "Open and Fund a Roth IRA",
    why: "A Roth IRA grows completely tax-free. Starting young gives compounding decades to work in your favor.",
    impact: "+$7,000 / year tax-free growth",
    steps: [
      "Open a Roth IRA at a low-cost brokerage.",
      "Set up automatic monthly contributions.",
      "Invest in a low-cost total market index fund.",
    ],
    platform: "Vanguard",
    url: "https://investor.vanguard.com/accounts-plans/iras/roth-ira",
  },
  {
    priority: 5,
    title: "Max Out Your 401(k) Tax Advantage",
    why: "Pre-tax contributions lower your taxable income today while building long-term wealth. Higher earners benefit most.",
    impact: "Up to $5,000 / year in tax savings",
    steps: [
      "Increase your 401(k) contribution beyond the match.",
      "Aim for 15% of your income across all retirement accounts.",
      "Revisit and bump your rate each time you get a raise.",
    ],
    platform: "Fidelity NetBenefits",
    url: "https://nb.fidelity.com/",
  },
  {
    priority: 6,
    title: "Automate Your Wealth System",
    why: "Automation removes willpower from the equation. Money you never see is money you never spend.",
    impact: "Build wealth on autopilot",
    steps: [
      "Schedule every contribution to hit the day after payday.",
      "Set calendar reminders for an annual money review.",
      "Track your net worth so you can watch it grow.",
    ],
    platform: "Empower",
    url: "https://www.empower.com/",
  },
]
