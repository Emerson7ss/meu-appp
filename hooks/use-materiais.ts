"use client"

import { useState, useEffect, useCallback } from "react"
import { Material } from "@/lib/types"

const STORAGE_KEY = "materiais-escolares"

export function useMateriais() {
  const [materiais, setMateriais] = useState<Material[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setMateriais(JSON.parse(stored))
      } catch {
        setMateriais([])
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materiais))
    }
  }, [materiais, isLoaded])

  const addMaterial = useCallback((material: Omit<Material, "id">) => {
    const newMaterial: Material = {
      ...material,
      id: crypto.randomUUID(),
    }
    setMateriais((prev) => [newMaterial, ...prev])
  }, [])

  const removeMaterial = useCallback((id: string) => {
    setMateriais((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const getMateriaisByMateriaAndBimestre = useCallback(
    (materia: string, bimestre: number) => {
      return materiais.filter(
        (m) => m.materia === materia && m.bimestre === bimestre
      )
    },
    [materiais]
  )

  const getMateriaisGroupedByDate = useCallback(
    (materia: string, bimestre: number) => {
      const filtered = getMateriaisByMateriaAndBimestre(materia, bimestre)
      const grouped: Record<string, Material[]> = {}
      
      filtered.forEach((material) => {
        if (!grouped[material.data]) {
          grouped[material.data] = []
        }
        grouped[material.data].push(material)
      })

      // Sort dates descending
      const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      )

      return sortedDates.map((date) => ({
        date,
        materiais: grouped[date],
      }))
    },
    [getMateriaisByMateriaAndBimestre]
  )

  return {
    materiais,
    isLoaded,
    addMaterial,
    removeMaterial,
    getMateriaisByMateriaAndBimestre,
    getMateriaisGroupedByDate,
  }
}
