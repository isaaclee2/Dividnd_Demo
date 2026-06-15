"use client"

import { useState } from "react"
import { COLORS } from "@/lib/dividnd"
import { loadEvents, saveEvents, deriveState } from "@/lib/demo-state"
import { PlanTab } from "@/components/plan-tab"
import { AccountsTab } from "@/components/accounts-tab"
import { PortfolioTab } from "@/components/portfolio-tab"
import { ChatWidget } from "@/components/chat-widget"

const { navy, cream, ink, white, sidebar, border, muted } = COLORS

type Tab = "plan" | "accounts" | "portfolio"

const NAV_ITEMS: { key: Tab | null; label: string; soon?: boolean }[] = [
  { key: "plan", label: "My Plan" },
  { key: "portfolio", label: "Growth" },
  { key: "accounts", label: "Accounts" },
  { key: null, label: "Settings", soon: true },
]

// Dividnd brand mark — navy on transparent.
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/dividnd-mark.png"
      alt="Dividnd"
      width={size}
      height={size}
      style={{ display: "block", height: size, width: size, objectFit: "contain" }}
    />
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  tab,
  onTab,
  onReset,
}: {
  tab: Tab
  onTab: (t: Tab) => void
  onReset: () => void
}) {
  return (
    <aside
      className="hidden w-60 flex-none flex-col justify-between border-r px-6 py-8 md:flex"
      style={{ borderColor: border, backgroundColor: sidebar }}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <LogoMark size={36} />
          <div className="font-heading text-2xl font-bold" style={{ color: navy }}>
            Dividnd
          </div>
        </div>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.key !== null && item.key === tab
            return (
              <button
                key={item.label}
                type="button"
                disabled={item.soon || item.key === null}
                onClick={() => item.key && onTab(item.key)}
                className={`flex items-center gap-2 px-3 py-2 text-left text-sm ${
                  item.soon ? "" : "btn-hover"
                }`}
                style={{
                  borderRadius: 4,
                  backgroundColor: active ? navy : "transparent",
                  color: item.soon ? muted : active ? white : ink,
                  fontWeight: active ? 600 : 400,
                  cursor: item.soon ? "default" : "pointer",
                }}
              >
                {item.label}
                {item.soon && (
                  <span className="text-[10px]" style={{ color: muted }}>
                    (coming soon)
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
          Built by JPMorgan &amp; Morgan Stanley alumni
        </p>
        <button
          type="button"
          onClick={onReset}
          className="btn-hover self-start text-[11px] underline underline-offset-2"
          style={{ color: muted }}
        >
          Reset demo
        </button>
      </div>
    </aside>
  )
}

// ── Mobile tab bar (sidebar is hidden on mobile) ─────────────────────────────
function MobileTabs({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "plan", label: "My Plan" },
    { key: "portfolio", label: "Growth" },
    { key: "accounts", label: "Accounts" },
  ]
  return (
    <div className="flex gap-2 border-b px-6 py-3 md:hidden" style={{ borderColor: border }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onTab(t.key)}
          className="btn-hover px-3 py-1.5 text-sm font-medium"
          style={{
            borderRadius: 999,
            backgroundColor: tab === t.key ? navy : "transparent",
            color: tab === t.key ? cream : navy,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── App shell ─────────────────────────────────────────────────────────────────
export function Dashboard({ onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("plan")
  const [applied, setApplied] = useState<string[]>(() => loadEvents())

  const state = deriveState(applied)

  function apply(id: string) {
    if (applied.includes(id)) return
    const next = [...applied, id]
    setApplied(next)
    saveEvents(next)
  }

  // Undo an applied event — situation re-derives cleanly from base.
  function unapply(id: string) {
    const next = applied.filter((x) => x !== id)
    setApplied(next)
    saveEvents(next)
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: cream }}>
      <Sidebar tab={tab} onTab={setTab} onReset={onReset} />

      <div className="flex flex-1 flex-col">
        <div className="flex justify-end px-6 pt-4 sm:px-10">
          <button
            type="button"
            onClick={onReset}
            className="btn-hover border px-3.5 py-1.5 text-xs font-semibold"
            style={{ borderRadius: 999, borderColor: border, backgroundColor: white, color: navy }}
          >
            ↺ Restart demo
          </button>
        </div>
        <MobileTabs tab={tab} onTab={setTab} />
        <main key={tab} className="fade-in flex flex-1 flex-col px-6 pb-10 pt-6 sm:px-10">
          {tab === "plan" && <PlanTab state={state} onApply={apply} onUndo={unapply} />}
          {tab === "accounts" && <AccountsTab state={state} />}
          {tab === "portfolio" && <PortfolioTab />}
        </main>
      </div>

      {/* Floating assistant — available on every tab */}
      <ChatWidget applied={applied} onApply={apply} />
    </div>
  )
}
