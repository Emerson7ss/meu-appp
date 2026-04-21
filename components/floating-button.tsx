"use client"

import { Plus } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/40 transition-all hover:scale-105 active:scale-95"
      aria-label="Adicionar material"
    >
      <Plus className="h-7 w-7" />
    </button>
  )
}
