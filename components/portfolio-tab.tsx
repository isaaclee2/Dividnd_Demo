"use client"

import { useRef, useState } from "react"
import { COLORS } from "@/lib/dividnd"
import {
  PROJECTION_YEARS,
  projectPortfolios,
  formatMoney,
} from "@/lib/demo-state"

const { navy, ink, white, cream, border, muted } = COLORS
const STATUS_LINE = "#D1D5DB" // light gray for the dashed "do nothing" line
const STATUS_TEXT = "#9CA3AF" // muted gray for the status-quo figures
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
  const padR = 72 // room for the end-point labels on the right
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

  // "THE GAP" annotation at the 20yr mark — midpoint between the two lines.
  const gapX = x(20)
  const gapTop = y(strategy[20])
  const gapBot = y(statusQuo[20])
  const gapMid = (gapTop + gapBot) / 2

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
            <text x={padL - 8} y={gy + 4} textAnchor="end" style={{ fill: muted }} fontSize={11}>
              {short(maxY * g)}
            </text>
          </g>
        )
      })}

      {/* x labels */}
      {xTicks.map((yr) => (
        <text key={yr} x={x(yr)} y={H - padB + 20} textAnchor="middle" style={{ fill: muted }} fontSize={11}>
          {yr === 0 ? "Today" : `${yr} yrs`}
        </text>
      ))}

      {/* strategy area fill */}
      <path d={areaPath} style={{ fill: navy, opacity: 0.05 }} />

      {/* status quo line (dashed light gray) */}
      <polyline points={pts(statusQuo)} fill="none" style={{ stroke: STATUS_LINE }} strokeWidth={1.5} strokeDasharray="5 4" />
      {/* strategy line (solid navy) */}
      <polyline points={pts(strategy)} fill="none" style={{ stroke: navy }} strokeWidth={2.5} />

      {/* "THE GAP" annotation pointing to the space between the lines */}
      <line x1={gapX} y1={gapTop} x2={gapX} y2={gapBot} style={{ stroke: muted }} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <text x={gapX + 8} y={gapMid} style={{ fill: muted, letterSpacing: "0.12em" }} fontSize={10} fontWeight={700}>
        THE GAP
      </text>

      {/* end dots */}
      <circle cx={x(maxYear)} cy={y(statusQuo[maxYear])} r={3.5} style={{ fill: STATUS_TEXT }} />
      <circle cx={x(maxYear)} cy={y(strategy[maxYear])} r={4} style={{ fill: navy }} />

      {/* end-point labels on the right */}
      <text x={x(maxYear) + 8} y={y(strategy[maxYear]) + 4} style={{ fill: navy }} fontSize={13} fontWeight={700}>
        $1.9M
      </text>
      <text x={x(maxYear) + 8} y={y(statusQuo[maxYear]) + 4} style={{ fill: STATUS_TEXT }} fontSize={12} fontWeight={600}>
        $420k
      </text>

      {/* hover guide + markers + tooltip */}
      {hover !== null && (
        <g>
          <line x1={hx} y1={padT} x2={hx} y2={padT + plotH} style={{ stroke: GRID }} strokeWidth={1} />
          <circle cx={hx} cy={y(statusQuo[hover])} r={4} style={{ fill: STATUS_TEXT }} />
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
          <text x={boxX + 12} y={boxY + 58} fontSize={12} style={{ fill: STATUS_TEXT }}>
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

// ── "What drives the gap" explainer cards ────────────────────────────────────
const DRIVERS: { label: string; body: string }[] = [
  {
    label: "Tax optimization",
    body: "Roth IRA, backdoor Roth, and HSA together save an estimated $340,000 in lifetime taxes",
  },
  {
    label: "Compound growth",
    body: "7% invested vs 0.5% in savings — the difference compounds to $800,000 over 40 years",
  },
  {
    label: "Starting early",
    body: "Every year you wait costs roughly $50,000 at retirement. You're 22. Now is the time.",
  },
]

export function PortfolioTab() {
  const { strategy, statusQuo } = projectPortfolios()
  const endStrategy = strategy[PROJECTION_YEARS]
  const endStatus = statusQuo[PROJECTION_YEARS]
  const round = (n: number) => Math.round(n / 1000) * 1000

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-4xl" style={{ color: ink }}>
        Growth
      </h1>
      <p className="mt-2 text-base" style={{ color: navy }}>
        The cost of doing nothing — your money invested vs. left in savings.
      </p>

      {/* Chart */}
      <section className="card-hover mt-8 border p-6" style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2" style={{ color: ink }}>
            <LegendDot color={navy} /> With Dividnd
          </span>
          <span className="flex items-center gap-2" style={{ color: ink }}>
            <LegendDot color={STATUS_LINE} dashed /> Status quo
          </span>
        </div>
        <p className="mb-4 mt-1 text-xs" style={{ color: muted }}>
          Total balance — what you&apos;ve put in plus its growth.
        </p>
        <Chart />
      </section>

      {/* The gap callout — full width, navy band */}
      <section
        className="mt-6 p-8 text-center"
        style={{ borderRadius: 4, backgroundColor: navy, color: cream }}
      >
        <p className="font-heading text-4xl font-bold sm:text-5xl" style={{ color: cream }}>
          $1,477,000
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-base" style={{ color: cream, opacity: 0.9 }}>
          The gap. This is what smart financial decisions are worth over 40 years.
        </p>
        <p className="mt-2 text-xs" style={{ color: cream, opacity: 0.65 }}>
          Same income. Same savings rate. Different choices.
        </p>
      </section>

      {/* Outcome cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className="card-hover border p-6"
          style={{ borderRadius: 4, backgroundColor: white, borderColor: border, borderLeft: `3px solid ${navy}` }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: navy }}>
            With Dividnd
          </p>
          <p className="mt-2 font-heading font-bold" style={{ color: navy, fontSize: 32 }}>
            ~{formatMoney(round(endStrategy))}
          </p>
          <p className="mt-1 text-sm" style={{ color: muted }}>
            Fully invested, tax-optimized
          </p>
        </div>
        <div className="card-hover border p-6" style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: STATUS_TEXT }}>
            Status quo
          </p>
          <p className="mt-2 font-heading font-bold" style={{ color: STATUS_TEXT, fontSize: 32 }}>
            ~{formatMoney(round(endStatus))}
          </p>
          <p className="mt-1 text-sm" style={{ color: muted }}>
            Savings account at 0.5% APY
          </p>
        </div>
      </div>

      {/* What drives the gap */}
      <h2
        className="mt-10 text-sm font-semibold uppercase"
        style={{ color: navy, letterSpacing: "0.15em" }}
      >
        What drives the gap
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {DRIVERS.map((d) => (
          <div
            key={d.label}
            className="card-hover border p-5"
            style={{ borderRadius: 4, backgroundColor: white, borderColor: border }}
          >
            <p className="text-xs font-semibold uppercase" style={{ color: navy, letterSpacing: "0.1em" }}>
              {d.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: ink }}>
              {d.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs italic" style={{ color: muted }}>
        Illustrative projection for the demo — same savings each year both ways, ~7% return invested
        vs ~0.5% in savings, before taxes and expenses. Not financial advice.
      </p>
    </div>
  )
}
