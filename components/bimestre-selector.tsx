"use client"

import { cn } from "@/lib/utils"
import { BIMESTRES } from "@/lib/types"

interface BimestreSelectorProps {
  selected: number
  onSelect: (bimestre: number) => void
}

export function BimestreSelector({ selected, onSelect }: BimestreSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {BIMESTRES.map((bimestre) => (
        <button
          key={bimestre}
          onClick={() => onSelect(bimestre)}
          className={cn(
            "flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
            selected === bimestre
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-card text-muted-foreground shadow-sm hover:bg-secondary"
          )}
        >
          {bimestre}º Bimestre
        </button>
      ))}
    </div>
  )
}
