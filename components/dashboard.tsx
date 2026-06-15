"use client";

import { useState } from "react";
import { COLORS } from "@/lib/dividnd";
import { PlanTab } from "@/components/plan-tab";
import { ProfileTab } from "@/components/profile-tab";
import { PortfolioTab } from "@/components/portfolio-tab";
import { ChatWidget } from "@/components/chat-widget";

const { navy, cream, ink, white, sidebar, border, muted } = COLORS;

type Tab = "plan" | "portfolio" | "profile";

const NAV_ITEMS: { key: Tab | null; label: string; soon?: boolean }[] = [
  { key: "plan", label: "My Plan" },
  { key: "portfolio", label: "Growth" },
  { key: null, label: "Tax Center", soon: true },
  { key: "profile", label: "Profile" },
];

// Dividnd brand mark — navy on transparent.
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/dividnd-mark.png"
      alt="Dividnd"
      width={size}
      height={size}
      style={{
        display: "block",
        height: size,
        width: size,
        objectFit: "contain",
      }}
    />
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  tab,
  onTab,
  onReset,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  onReset: () => void;
}) {
  return (
    <aside
      className="hidden w-60 flex-none flex-col justify-between border-r px-6 py-8 md:flex"
      style={{ borderColor: border, backgroundColor: sidebar }}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <LogoMark size={44} />
          <div
            className="font-heading text-2xl font-bold"
            style={{ color: navy }}
          >
            Dividnd
          </div>
        </div>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.key !== null && item.key === tab;
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
            );
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
        <p className="text-[12px] leading-relaxed" style={{ color: muted }}>
          Not financial advice. For informational purposes only. Dividnd
          surfaces strategies — you make the decisions.
        </p>
      </div>
    </aside>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────
export function Dashboard({ onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("plan");

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: cream }}>
      <Sidebar tab={tab} onTab={setTab} onReset={onReset} />

      <div className="flex flex-1 flex-col">
        <div className="flex justify-end px-6 pt-4 sm:px-10">
          <button
            type="button"
            onClick={onReset}
            className="btn-hover border px-3.5 py-1.5 text-xs font-semibold"
            style={{
              borderRadius: 999,
              borderColor: border,
              backgroundColor: white,
              color: navy,
            }}
          >
            ↺ Restart demo
          </button>
        </div>
        <main
          key={tab}
          className="fade-in flex flex-1 flex-col px-6 pb-10 pt-6 sm:px-10"
        >
          {tab === "plan" && <PlanTab />}
          {tab === "profile" && <ProfileTab />}
          {tab === "portfolio" && <PortfolioTab />}
        </main>
      </div>

      {/* Floating assistant — available on every tab */}
      <ChatWidget />
    </div>
  );
}
