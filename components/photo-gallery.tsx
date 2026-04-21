"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Trash2, Calendar, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Material } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PhotoGalleryProps {
  materiais: Material[]
  onDelete: (id: string) => Promise<void>
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoje"
  if (diffDays === 1) return "Ontem"
  if (diffDays < 7) return `${diffDays} dias atras`

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

function groupByDate(materiais: Material[]): Record<string, Material[]> {
  const groups: Record<string, Material[]> = {}

  materiais.forEach((material) => {
    const dateKey = new Date(material.created_at).toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(material)
  })

  return groups
}

export function PhotoGallery({ materiais, onDelete }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const sortedMateriais = [...materiais].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const groupedMateriais = groupByDate(sortedMateriais)
  const dateKeys = Object.keys(groupedMateriais).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await onDelete(deleteId)
      if (lightboxIndex !== null) {
        setLightboxIndex(null)
      }
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const currentMaterial = lightboxIndex !== null ? sortedMateriais[lightboxIndex] : null

  const goToPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < sortedMateriais.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  if (materiais.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <ZoomIn className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Nenhum material ainda</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Clique no botao + para adicionar sua primeira foto
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {dateKeys.map((dateKey) => (
          <div key={dateKey}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {formatDate(groupedMateriais[dateKey][0].created_at)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {groupedMateriais[dateKey].map((material) => {
                const globalIndex = sortedMateriais.findIndex((m) => m.id === material.id)
                return (
                  <button
                    key={material.id}
                    onClick={() => setLightboxIndex(globalIndex)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <Image
                      src={material.image_url}
                      alt={material.titulo}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm text-white font-medium truncate">
                        {material.titulo}
                      </p>
                      {material.descricao && (
                        <p className="text-xs text-white/70 truncate mt-0.5">
                          {material.descricao}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {currentMaterial && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="text-center flex-1 px-4">
              <h3 className="text-white font-medium truncate">{currentMaterial.titulo}</h3>
              {currentMaterial.descricao && (
                <p className="text-white/60 text-sm truncate">{currentMaterial.descricao}</p>
              )}
            </div>
            <button
              onClick={() => setDeleteId(currentMaterial.id)}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-4">
            {lightboxIndex !== null && lightboxIndex > 0 && (
              <button
                onClick={goToPrev}
                className="absolute left-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            <div className="relative w-full max-w-2xl aspect-[3/4]">
              <Image
                src={currentMaterial.image_url}
                alt={currentMaterial.titulo}
                fill
                className="object-contain"
              />
            </div>

            {lightboxIndex !== null && lightboxIndex < sortedMateriais.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <div className="p-4 text-center text-white/60 text-sm">
            {lightboxIndex !== null && `${lightboxIndex + 1} de ${sortedMateriais.length}`}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir material?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao nao pode ser desfeita. O material sera permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
