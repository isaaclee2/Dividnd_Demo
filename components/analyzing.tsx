"use client"

import { COLORS } from "@/lib/dividnd"

const { cream, navy, gold } = COLORS

export function Analyzing() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: cream }}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 animate-pulse"
          style={{ backgroundColor: gold, borderRadius: 4 }}
        />
        <h1
          className="font-heading text-3xl animate-pulse sm:text-4xl"
          style={{ color: navy }}
        >
          Analyzing your financial situation…
        </h1>
      </div>
      <p className="mt-4 text-sm" style={{ color: navy, opacity: 0.7 }}>
        Building a plan tailored to your numbers.
      </p>
    </main>
  )
}
