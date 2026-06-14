"use client"

import { useState } from "react"
import { COLORS } from "@/lib/dividnd"

const { navy, gold, cream, ink } = COLORS

export function ConnectBank({ onConnected }: { onConnected: () => void }) {
  const [connecting, setConnecting] = useState(false)

  function handleConnect() {
    if (connecting) return
    setConnecting(true)
    // Fake an instant bank link — sells "connected" without a real integration.
    setTimeout(onConnected, 900)
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center"
      style={{ backgroundColor: cream }}
    >
      <div className="flex w-full max-w-md flex-col items-center">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: gold }}
        >
          One last step
        </span>

        <h1 className="mt-4 font-heading text-3xl sm:text-4xl" style={{ color: ink }}>
          Connect your bank to let Dividnd monitor your finances automatically
        </h1>

        <p className="mt-4 text-base" style={{ color: navy, opacity: 0.8 }}>
          Dividnd watches your accounts in the background and surfaces money moves
          before you ever have to ask. Bank-grade encryption. Read-only access.
        </p>

        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting}
          className="mt-10 w-full border px-8 py-4 text-base font-semibold transition-opacity disabled:opacity-70"
          style={{ borderRadius: 4, backgroundColor: navy, borderColor: navy, color: cream }}
        >
          {connecting ? "Connecting to Chase…" : "Connect with Chase"}
        </button>

        {connecting && (
          <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: navy }}>
            <span
              className="inline-block h-2 w-2 animate-pulse rounded-full"
              style={{ backgroundColor: gold }}
            />
            Securely linking your Chase account…
          </div>
        )}
      </div>
    </main>
  )
}
