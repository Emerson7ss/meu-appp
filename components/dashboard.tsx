"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, X, ArrowLeft } from "lucide-react"
import { Header } from "./header"
import { BimestreTabs } from "./bimestre-tabs"
import { MateriaCard } from "./materia-card"
import { PhotoGallery } from "./photo-gallery"
import { UploadModal } from "./upload-modal"
import { SearchBar } from "./search-bar"
import { Button } from "@/components/ui/button"
import { MATERIAS, getMateriaByNome } from "@/lib/materias"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Material, Materia } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DashboardProps {
  initialProfile: Profile
  initialMateriais: Material[]
}

type View = "home" | "materia" | "search"

export function Dashboard({ initialProfile, initialMateriais }: DashboardProps) {
  const router = useRouter()
  const [profile] = useState<Profile>(initialProfile)
  const [materiais, setMateriais] = useState<Material[]>(initialMateriais)
  const [bimestre, setBimestre] = useState(1)
  const [view, setView] = useState<View>("home")
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Material[]>([])

  const supabase = createClient()

  // Filtrar materiais por bimestre e materia
  const getMaterialCount = useCallback(
    (materiaNome: string) => {
      return materiais.filter(
        (m) => m.materia.toLowerCase() === materiaNome.toLowerCase() && m.bimestre === bimestre
      ).length
    },
    [materiais, bimestre]
  )

  const getMateriaMateriais = useCallback(() => {
    if (!selectedMateria) return []
    return materiais.filter(
      (m) =>
        m.materia.toLowerCase() === selectedMateria.nome.toLowerCase() && m.bimestre === bimestre
    )
  }, [materiais, selectedMateria, bimestre])

  // Busca
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (!query.trim()) {
        setSearchResults([])
        if (view === "search") setView("home")
        return
      }
      
      const results = materiais.filter(
        (m) =>
          m.titulo.toLowerCase().includes(query.toLowerCase()) ||
          m.descricao?.toLowerCase().includes(query.toLowerCase()) ||
          m.materia.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
      setView("search")
    },
    [materiais, view]
  )

  // Upload
  const handleUpload = async (data: { titulo: string; descricao?: string; imageData: string }) => {
    if (!selectedMateria) return

    // For now, we'll store the base64 image directly
    // In production, you'd upload to Supabase Storage
    const { data: newMaterial, error } = await supabase
      .from("materiais")
      .insert({
        user_id: profile.id,
        materia: selectedMateria.nome,
        bimestre,
        titulo: data.titulo,
        descricao: data.descricao,
        image_url: data.imageData,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao salvar:", error)
      throw error
    }

    setMateriais((prev) => [newMaterial, ...prev])
  }

  // Delete
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("materiais").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir:", error)
      throw error
    }

    setMateriais((prev) => prev.filter((m) => m.id !== id))
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // Admin
  const handleAdminClick = () => {
    router.push("/admin")
  }

  // Navegação para matéria
  const openMateria = (materia: Materia) => {
    setSelectedMateria(materia)
    setView("materia")
  }

  const goBack = () => {
    if (view === "search") {
      setSearchQuery("")
      setSearchResults([])
    }
    setView("home")
    setSelectedMateria(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        profile={profile}
        onLogout={handleLogout}
        onAdminClick={profile.is_admin ? handleAdminClick : undefined}
        title={view === "materia" && selectedMateria ? selectedMateria.nome : undefined}
        subtitle={view === "materia" ? `${bimestre}º Bimestre` : undefined}
        onBack={view !== "home" ? goBack : undefined}
        showProfile={view === "home"}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {view === "home" && (
          <>
            {/* Search */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Buscar por assunto, materia..."
              />
            </div>

            {/* Bimestre Tabs */}
            <div className="mb-6">
              <BimestreTabs selected={bimestre} onChange={setBimestre} />
            </div>

            {/* Materias Grid */}
            <div className="space-y-3">
              {MATERIAS.map((materia) => (
                <MateriaCard
                  key={materia.nome}
                  materia={materia}
                  count={getMaterialCount(materia.nome)}
                  onClick={() => openMateria(materia)}
                />
              ))}
            </div>
          </>
        )}

        {view === "materia" && selectedMateria && (
          <>
            {/* Bimestre Tabs */}
            <div className="mb-6">
              <BimestreTabs selected={bimestre} onChange={setBimestre} />
            </div>

            {/* Gallery */}
            <PhotoGallery
              materiais={getMateriaMateriais()}
              onDelete={handleDelete}
            />

            {/* FAB */}
            <Button
              onClick={() => setIsUploadOpen(true)}
              className={cn(
                "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg",
                "bg-gradient-to-r from-primary to-accent hover:opacity-90",
                "text-white"
              )}
            >
              <Plus className="w-6 h-6" />
            </Button>

            {/* Upload Modal */}
            <UploadModal
              isOpen={isUploadOpen}
              onClose={() => setIsUploadOpen(false)}
              onSubmit={handleUpload}
              materiaNome={selectedMateria.nome}
            />
          </>
        )}

        {view === "search" && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""} para &quot;{searchQuery}&quot;
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((material) => {
                  const materia = getMateriaByNome(material.materia)
                  return (
                    <button
                      key={material.id}
                      onClick={() => {
                        if (materia) {
                          setSelectedMateria(materia)
                          setBimestre(material.bimestre)
                          setView("materia")
                        }
                      }}
                      className="w-full p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        {materia && (
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", materia.iconBg)}>
                            {materia.icone}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{material.titulo}</h3>
                          <p className="text-sm text-muted-foreground">
                            {material.materia} - {material.bimestre}º Bimestre
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
