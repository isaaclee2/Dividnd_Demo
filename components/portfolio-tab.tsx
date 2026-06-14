"use client"

import { useRef, useState } from "react"
import { COLORS } from "@/lib/dividnd"
import {
  PROJECTION_YEARS,
  ANNUAL_SAVINGS,
  SAVINGS_RATE,
  projectPortfolios,
  formatMoney,
} from "@/lib/demo-state"

const { navy, ink, white } = COLORS
const STATUS = "#9AA0A6" // muted gray for the "do nothing" line
const GRID = "rgba(17,17,17,0.08)"

// Compact axis label: $250k, $1.0M, …
function short(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`
  return `$${n}`
}

// ── Hand-rolled SVG line chart (with hover tooltip) ──────────────────────────
function Chart() {
  const { strategy, statusQuo } = projectPortfolios()
  const maxYear = PROJECTION_YEARS

  const W = 680
  const H = 340
  const padL = 56
  const padR = 20
  const padT = 20
  const padB = 40
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const peak = Math.max(...strategy)
  const maxY = Math.ceil(peak / 100_000) * 100_000 // round up to a nice $100k step

  const x = (yr: number) => padL + (yr / maxYear) * plotW
  const y = (v: number) => padT + plotH * (1 - v / maxY)

  const pts = (series: number[]) => series.map((v, i) => `${x(i)},${y(v)}`).join(" ")
  const gridLevels = [0, 0.25, 0.5, 0.75, 1]
  const xTicks = [0, 10, 20, 30, 40]

  const areaPath = `M ${x(0)},${y(0)} L ${pts(strategy).replace(/ /g, " L ")} L ${x(maxYear)},${y(0)} Z`

  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const xs = ((e.clientX - r.left) / r.width) * W // back into viewBox coords
    let yr = Math.round(((xs - padL) / plotW) * maxYear)
    yr = Math.max(0, Math.min(maxYear, yr))
    setHover(yr)
  }

  // Tooltip box geometry (flips left near the right edge)
  const boxW = 176
  const boxH = 70
  const hx = hover !== null ? x(hover) : 0
  let boxX = hx + 12
  if (boxX + boxW > W - padR) boxX = hx - 12 - boxW
  boxX = Math.max(padL, boxX)
  const boxY = padT + 6

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: "auto", cursor: "crosshair" }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      {/* horizontal gridlines + y labels */}
      {gridLevels.map((g) => {
        const gy = y(maxY * g)
        return (
          <g key={g}>
            <line x1={padL} y1={gy} x2={W - padR} y2={gy} style={{ stroke: GRID }} strokeWidth={1} />
            <text x={padL - 8} y={gy + 4} textAnchor="end" style={{ fill: "var(--c-muted-50)" }} fontSize={11}>
              {short(maxY * g)}
            </text>
          </g>
        )
      })}

      {/* x labels */}
      {xTicks.map((yr) => (
        <text key={yr} x={x(yr)} y={H - padB + 20} textAnchor="middle" style={{ fill: "var(--c-muted-50)" }} fontSize={11}>
          {yr === 0 ? "Today" : `${yr} yrs`}
        </text>
      ))}

      {/* strategy area fill */}
      <path d={areaPath} style={{ fill: navy, opacity: 0.08 }} />

      {/* status quo line (dashed gray) */}
      <polyline points={pts(statusQuo)} fill="none" style={{ stroke: STATUS }} strokeWidth={2} strokeDasharray="5 4" />
      {/* strategy line (solid navy) */}
      <polyline points={pts(strategy)} fill="none" style={{ stroke: navy }} strokeWidth={2.5} />

      {/* end dots */}
      <circle cx={x(maxYear)} cy={y(statusQuo[maxYear])} r={3.5} style={{ fill: STATUS }} />
      <circle cx={x(maxYear)} cy={y(strategy[maxYear])} r={4} style={{ fill: navy }} />

      {/* hover guide + markers + tooltip */}
      {hover !== null && (
        <g>
          <line x1={hx} y1={padT} x2={hx} y2={padT + plotH} style={{ stroke: GRID }} strokeWidth={1} />
          <circle cx={hx} cy={y(statusQuo[hover])} r={4} style={{ fill: STATUS }} />
          <circle cx={hx} cy={y(strategy[hover])} r={5} style={{ fill: navy }} />

          <rect
            x={boxX}
            y={boxY}
            width={boxW}
            height={boxH}
            rx={6}
            style={{ fill: white, stroke: navy }}
            strokeWidth={1}
          />
          <text x={boxX + 12} y={boxY + 20} fontSize={11} fontWeight={700} style={{ fill: ink }}>
            {hover === 0 ? "Today" : `Year ${hover}`}
          </text>
          <text x={boxX + 12} y={boxY + 40} fontSize={12} style={{ fill: navy }}>
            With Dividnd: {formatMoney(strategy[hover])}
          </text>
          <text x={boxX + 12} y={boxY + 58} fontSize={12} style={{ fill: STATUS }}>
            Status quo: {formatMoney(statusQuo[hover])}
          </text>
        </g>
      )}
    </svg>
  )
}

function LegendDot({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <span
      className="inline-block h-0.5 w-5 align-middle"
      style={{
        backgroundColor: dashed ? "transparent" : color,
        borderTop: dashed ? `2px dashed ${color}` : undefined,
      }}
    />
  )
}

export function PortfolioTab() {
  const { strategy, statusQuo } = projectPortfolios()
  const endStrategy = strategy[PROJECTION_YEARS]
  const endStatus = statusQuo[PROJECTION_YEARS]
  const round = (n: number) => Math.round(n / 1000) * 1000

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Portfolio
      </h1>
      <p className="mt-2 text-base" style={{ color: navy }}>
        Saving {Math.round(SAVINGS_RATE * 100)}% of your income ({formatMoney(ANNUAL_SAVINGS)}/yr) either way —
        invested with your plan vs. left in a savings account. Projected over {PROJECTION_YEARS} years.
      </p>

      {/* Chart */}
      <section className="mt-8 border p-6" style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2" style={{ color: ink }}>
            <LegendDot color={navy} /> With Dividnd
          </span>
          <span className="flex items-center gap-2" style={{ color: ink }}>
            <LegendDot color={STATUS} dashed /> Status quo
          </span>
        </div>
        <p className="mb-4 mt-1 text-xs" style={{ color: "var(--c-muted-50)" }}>
          Total balance — what you&apos;ve put in plus its growth.
        </p>
        <Chart />
      </section>

      {/* Outcome cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border p-6" style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: navy }}>
            With Dividnd
          </p>
          <p className="mt-2 font-heading text-3xl font-bold" style={{ color: navy }}>
            ~{formatMoney(round(endStrategy))}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--c-muted-50)" }}>
            in {PROJECTION_YEARS} years, invested
          </p>
        </div>
        <div className="border p-6" style={{ borderRadius: 4, backgroundColor: white, borderColor: navy }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: STATUS }}>
            Status quo
          </p>
          <p className="mt-2 font-heading text-3xl font-bold" style={{ color: STATUS }}>
            ~{formatMoney(round(endStatus))}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--c-muted-50)" }}>
            the same savings, left in a savings account
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed" style={{ color: ink }}>
        Same money saved — but following your plan could leave you about{" "}
        <span style={{ color: navy, fontWeight: 600 }}>{formatMoney(round(endStrategy - endStatus))} ahead</span>{" "}
        of leaving it in a savings account. That gap is compounding.
      </p>
      <p className="mt-3 text-xs italic" style={{ color: "var(--c-muted-40)" }}>
        Illustrative projection for the demo — same {formatMoney(ANNUAL_SAVINGS)}/yr saved both ways, ~7% return
        invested vs ~0.5% in savings, before taxes and expenses. Not financial advice.
      </p>
    </div>
  )
}
