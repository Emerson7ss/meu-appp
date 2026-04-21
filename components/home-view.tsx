"use client"

import { Header } from "./header"
import { BimestreSelector } from "./bimestre-selector"
import { MateriaCard } from "./materia-card"
import { useMateriais } from "@/hooks/use-materiais"
import { MATERIAS, Materia } from "@/lib/types"

interface HomeViewProps {
  bimestre: number
  onBimestreChange: (bimestre: number) => void
  onMateriaClick: (materia: Materia) => void
}

export function HomeView({
  bimestre,
  onBimestreChange,
  onMateriaClick,
}: HomeViewProps) {
  const { getMateriaisByMateriaAndBimestre, isLoaded } = useMateriais()

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      <BimestreSelector selected={bimestre} onSelect={onBimestreChange} />

      <div className="mt-2 space-y-3 px-4">
        {MATERIAS.map((materia) => {
          const count = isLoaded
            ? getMateriaisByMateriaAndBimestre(materia.nome, bimestre).length
            : 0

          return (
            <MateriaCard
              key={materia.nome}
              materia={materia}
              count={count}
              onClick={() => onMateriaClick(materia)}
            />
          )
        })}
      </div>
    </div>
  )
}
