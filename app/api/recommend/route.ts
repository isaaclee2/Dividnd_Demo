import { NextResponse } from "next/server"
import { buildSystemPrompt, type RecommendInput } from "@/lib/system-prompt"

export const runtime = "nodejs"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
// Groq's current 70B Llama (the 3.1-70B model was deprecated on Groq).
const MODEL = "llama-3.3-70b-versatile"

// Recursively strip dollar signs and markdown backticks from every string value.
function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/[$`]/g, "").trim()
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = sanitizeValue(v)
    }
    return out
  }
  return value
}

// Pull a JSON object/array out of a model response that may be wrapped in
// ```json fences, backticks, or surrounding prose.
function parseModelJson(raw: string): unknown {
  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .replace(/`/g, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    // Fall back to the first {...} or [...] block we can find.
    const match = cleaned.match(/[{[][\s\S]*[}\]]/)
    if (match) {
      return JSON.parse(match[0])
    }
    throw new Error("Model did not return valid JSON")
  }
}

// Normalize whatever the model returned into a flat array of cards.
function extractCards(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>
    for (const key of ["cards", "plan", "actionCards", "actions"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[]
    }
  }
  throw new Error("Model response did not contain a list of cards")
}

export async function POST(request: Request) {
  let body: Partial<RecommendInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const {
    salary,
    state,
    hasLoans,
    match,
    loanRate,
    employment,
    investments,
    debt,
    graduatingSoon,
    jobOffer,
    parentsComfortable,
  } = body
  if (!salary || !state || !match || !loanRate) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    )
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set in the environment.")
    return NextResponse.json(
      { error: "The recommendation service is not configured." },
      { status: 500 }
    )
  }

  const systemPrompt = buildSystemPrompt({
    salary,
    state,
    hasLoans: Boolean(hasLoans),
    match,
    loanRate,
    employment,
    investments,
    debt,
    graduatingSoon,
    jobOffer,
    parentsComfortable,
  })

  // Debug: the prompt is sent in the "system" role (see messages below).
  console.log("[recommend] system prompt length:", systemPrompt.length)
  console.log(
    "[recommend] system prompt (first 200 chars):",
    systemPrompt.slice(0, 200)
  )

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate my financial plan" },
        ],
        temperature: 0.1,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error(`Groq error ${res.status}: ${detail}`)
      return NextResponse.json(
        { error: "We couldn't generate your plan right now. Please try again." },
        { status: 502 }
      )
    }

    const data = await res.json()
    const content: string | undefined = data?.choices?.[0]?.message?.content
    console.log("[recommend] raw Groq response:", content)
    if (!content) {
      console.error("Groq returned no content:", JSON.stringify(data))
      return NextResponse.json(
        { error: "We couldn't generate your plan right now. Please try again." },
        { status: 502 }
      )
    }

    const parsed = parseModelJson(content)
    const sanitized = sanitizeValue(parsed)
    const cards = extractCards(sanitized)

    // Guarantee the shape the UI renders so a malformed card can't crash the page.
    const safeCards = (cards as Record<string, unknown>[]).map((card) => ({
      ...card,
      steps: Array.isArray(card?.steps) ? card.steps : [],
    }))

    return NextResponse.json({ cards: safeCards })
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError"
    console.error("Recommend route failed:", err)
    return NextResponse.json(
      {
        error: aborted
          ? "The request timed out. Please try again."
          : "We couldn't generate your plan right now. Please try again.",
      },
      { status: aborted ? 504 : 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
