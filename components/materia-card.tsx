"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Materia } from "@/lib/types"

interface MateriaCardProps {
  materia: Materia
  count: number
  onClick: () => void
}

export function MateriaCard({ materia, count, onClick }: MateriaCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-4 rounded-2xl transition-all duration-300",
        "bg-card border border-border/50 hover:border-transparent",
        "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        "active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl text-white transition-transform group-hover:scale-110",
            materia.iconBg
          )}
        >
          {materia.icone}
        </div>
        
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {materia.nome}
          </h3>
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "material" : "materiais"}
          </p>
        </div>

        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full transition-all",
          "bg-secondary group-hover:bg-primary group-hover:text-white"
        )}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Gradient accent line */}
      <div className={cn(
        "absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
        "bg-gradient-to-r",
        materia.cor
      )} />
    </button>
  )
}
