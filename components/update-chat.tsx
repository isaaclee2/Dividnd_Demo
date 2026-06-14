"use client"

import { useEffect, useRef, useState } from "react"
import { COLORS } from "@/lib/dividnd"
import { EVENTS, getEvent, routeMessage } from "@/lib/demo-state"

const { navy, cream, ink, white } = COLORS

type Msg = { role: "user" | "bot"; text: string }

const GREETING =
  "Hi Jordan — ask me anything about your money, or tell me something we can't see automatically (like an account you opened elsewhere). I'll keep your plan in sync."

export function UpdateChat({
  applied,
  onApply,
  bare = false,
}: {
  applied: string[]
  onApply: (id: string) => void
  bare?: boolean // drop the outer border/margin when hosted inside another panel
}) {
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: GREETING }])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the latest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  function respond(userText: string, forcedId?: string) {
    const id = forcedId ?? routeMessage(userText)
    let botText: string
    if (!id) {
      botText =
        "I didn't quite catch that. Mention your paycheck, savings, 401(k), Roth IRA, or loans — or tap a suggestion below."
    } else if (applied.includes(id)) {
      botText = "You've already logged that one — it's reflected in your plan. ✓"
    } else {
      onApply(id)
      botText = `${getEvent(id)!.confirm}  ✓ I've updated your plan.`
    }
    setMessages((m) => [...m, { role: "user", text: userText }, { role: "bot", text: botText }])
  }

  function handleSend() {
    const t = input.trim()
    if (!t) return
    setInput("")
    respond(t)
  }

  const suggestions = EVENTS.filter((e) => e.chip && !applied.includes(e.id))

  return (
    <div
      className={bare ? "flex flex-col" : "mt-4 flex flex-col border"}
      style={bare ? { backgroundColor: white } : { borderRadius: 4, borderColor: navy, backgroundColor: white }}
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
              border: m.role === "bot" ? `1px solid ${navy}` : "none",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => respond(e.chip!, e.id)}
              className="border px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ borderRadius: 999, backgroundColor: cream, borderColor: navy, color: navy }}
            >
              {e.chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: navy }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="Tell Dividnd what changed…"
          className="flex-1 border px-4 py-2.5 text-sm outline-none"
          style={{ borderRadius: 4, borderColor: navy, backgroundColor: white, color: ink }}
        />
        <button
          type="button"
          onClick={handleSend}
          className="border px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
