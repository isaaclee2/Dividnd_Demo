"use client"

import { useEffect, useRef, useState } from "react"
import { COLORS } from "@/lib/dividnd"

const { navy, cream, ink, white, border } = COLORS

type Msg = { role: "user" | "bot"; text: string }

const GREETING =
  "I'm your Dividnd wealth strategist. Ask me anything about your plan — your 401(k) match, Roth IRA, the mega backdoor Roth, I-Bonds, your HSA, or whether to pay loans or invest."

// ── Static strategy Q&A — keyword-matched canned answers. No state mutation. ──
type Topic = { keywords: string[]; answer: string }

const TOPICS: Topic[] = [
  {
    keywords: ["match", "401k", "401(k)", "employer"],
    answer:
      "Your employer matches 4% of salary — $3,800/year on $95,000. That's a guaranteed 100% return, so it's always move #1. Contribute at least 4% to capture all of it before anything else.",
  },
  {
    keywords: ["backdoor", "mega"],
    answer:
      "The mega backdoor Roth: the employee 401(k) limit is $23,500, but the total limit including employer is $70,000. If your plan allows after-tax contributions and in-plan Roth conversions, you can fill that ~$46,500 gap and convert it to Roth tax-free. Ask HR: 'Does my plan allow after-tax contributions and in-plan Roth conversions?'",
  },
  {
    keywords: ["roth", "ira", "fidelity"],
    answer:
      "At 22 and $95,000 you're under the Roth income limit. Contribute $7,000 this year into a Roth IRA and invest in FZROX. At 8%, that single $7,000 becomes ~$106,000 tax-free by 65 — and every year you wait costs you roughly $8,000 in future tax-free wealth.",
  },
  {
    keywords: ["i-bond", "ibond", "i bond", "emergency", "treasury", "savings"],
    answer:
      "Keep one month of expenses in a HYSA for liquidity, then put the rest of your emergency fund in I-Bonds — US Treasury bonds that pay the inflation rate (~4.3%) with zero default risk. The catch: no withdrawals in the first 12 months. On a $23,750 fund that's ~$950/year more than a checking account, risk-free.",
  },
  {
    keywords: ["hsa", "health", "medical"],
    answer:
      "If you're on an HDHP, the HSA is the only triple-tax-free account in the code: pre-tax in, tax-free growth, tax-free medical withdrawals. Contribute $4,300, invest it, pay medical costs out of pocket, and save every receipt — you can reimburse yourself tax-free decades later.",
  },
  {
    keywords: ["loan", "loans", "debt", "pay off", "invest", "refinance"],
    answer:
      "Your loans are at 5.5% — above the risk-free return you can earn elsewhere, so after capturing your match and funding your Roth IRA, attack them. Paying $500 extra/month clears your $27,000 balance 3 years faster and saves $4,200 in interest. Check a refinance rate too.",
  },
]

function answerFor(text: string): string {
  const t = text.toLowerCase()
  for (const topic of TOPICS) {
    if (topic.keywords.some((k) => t.includes(k))) return topic.answer
  }
  return "I can walk you through any move in your wealth plan — try asking about your 401(k) match, Roth IRA, the mega backdoor Roth, I-Bonds, your HSA, or paying off loans vs investing."
}

const SUGGESTIONS = [
  "What's a mega backdoor Roth?",
  "Should I pay loans or invest?",
  "Why I-Bonds?",
  "Why open a Roth IRA?",
]

export function UpdateChat({ bare = false }: { bare?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: GREETING }])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the latest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  function respond(userText: string) {
    const botText = answerFor(userText)
    setMessages((m) => [...m, { role: "user", text: userText }, { role: "bot", text: botText }])
  }

  function handleSend() {
    const t = input.trim()
    if (!t) return
    setInput("")
    respond(t)
  }

  return (
    <div
      className={bare ? "flex flex-col" : "mt-4 flex flex-col border"}
      style={bare ? { backgroundColor: white } : { borderRadius: 4, borderColor: border, backgroundColor: white }}
    >
      {/* Conversation */}
      <div ref={scrollRef} className="flex max-h-80 flex-col gap-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
            style={{
              borderRadius: 12,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: m.role === "user" ? navy : cream,
              color: m.role === "user" ? cream : ink,
              border: m.role === "bot" ? `1px solid ${border}` : "none",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Example questions */}
      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => respond(q)}
            className="btn-hover border px-3 py-1.5 text-xs font-medium"
            style={{ borderRadius: 999, backgroundColor: cream, borderColor: border, color: navy }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: border }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="Ask about your wealth plan…"
          className="flex-1 border px-4 py-2.5 text-sm outline-none"
          style={{ borderRadius: 4, borderColor: border, backgroundColor: white, color: ink }}
        />
        <button
          type="button"
          onClick={handleSend}
          className="btn-hover border px-5 py-2.5 text-sm font-semibold"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
