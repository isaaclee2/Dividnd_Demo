"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { COLORS } from "@/lib/dividnd"
import { UpdateChat } from "@/components/update-chat"

const { navy, cream, white } = COLORS

export function ChatWidget({
  applied,
  onApply,
}: {
  applied: string[]
  onApply: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden border shadow-xl"
          style={{ borderRadius: 12, borderColor: navy, backgroundColor: white }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: navy }}
          >
            <span className="font-heading text-sm font-bold" style={{ color: cream }}>
              Ask Dividnd
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ color: cream }}
            >
              <X size={16} />
            </button>
          </div>
          <UpdateChat applied={applied} onApply={onApply} bare />
        </div>
      )}

      {/* Bubble toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask Dividnd"}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: navy, color: cream }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
