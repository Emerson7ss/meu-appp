"use client"

import { cn } from "@/lib/utils"
import { BIMESTRES } from "@/lib/types"

interface BimestreTabsProps {
  selected: number
  onChange: (bimestre: number) => void
}

export function BimestreTabs({ selected, onChange }: BimestreTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-full">
      {BIMESTRES.map((bimestre) => (
        <button
          key={bimestre}
          onClick={() => onChange(bimestre)}
          className={cn(
            "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300",
            selected === bimestre
              ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          {bimestre}º Bi
        </button>
      ))}
    </div>
  )
}
