"use client"

import { useState } from "react"
import { Header } from "./header"
import { BimestreSelector } from "./bimestre-selector"
import { PhotoGallery } from "./photo-gallery"
import { FloatingButton } from "./floating-button"
import { UploadModal } from "./upload-modal"
import { useMateriais } from "@/hooks/use-materiais"
import { Materia } from "@/lib/types"

interface MateriaViewProps {
  materia: Materia
  bimestre: number
  onBimestreChange: (bimestre: number) => void
  onBack: () => void
}

export function MateriaView({
  materia,
  bimestre,
  onBimestreChange,
  onBack,
}: MateriaViewProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const { addMaterial, removeMaterial, getMateriaisGroupedByDate } = useMateriais()

  const groupedMateriais = getMateriaisGroupedByDate(materia.nome, bimestre)

  const handleUpload = (titulo: string, imageUrl: string) => {
    addMaterial({
      materia: materia.nome,
      bimestre,
      titulo,
      imageUrl,
      data: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        title={materia.nome}
        subtitle={`${bimestre}º Bimestre`}
        onBack={onBack}
      />
      
      <BimestreSelector selected={bimestre} onSelect={onBimestreChange} />

      <div className="mt-2">
        <PhotoGallery
          groupedMateriais={groupedMateriais}
          onDelete={removeMaterial}
        />
      </div>

      <FloatingButton onClick={() => setIsUploadOpen(true)} />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUpload}
        materiaNome={materia.nome}
      />
    </div>
  )
}
