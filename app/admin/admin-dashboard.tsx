"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, FileImage, Shield, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AdminDashboardProps {
  profile: Profile
  users: Profile[]
  materialCounts: Record<string, number>
}

export function AdminDashboard({ profile, users, materialCounts }: AdminDashboardProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const supabase = createClient()

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nome?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalMaterials = Object.values(materialCounts).reduce((a, b) => a + b, 0)

  const handleDeleteUser = async () => {
    if (!deleteUserId) return
    setIsDeleting(true)

    // Note: This requires admin privileges on Supabase
    // In production, you'd call a server action or edge function
    const { error } = await supabase.from("profiles").delete().eq("id", deleteUserId)

    if (error) {
      console.error("Erro ao excluir:", error)
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteUserId(null)
  }

  const getInitials = (user: Profile) => {
    if (user.nome) {
      return user.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Painel Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Gerenciar usuarios e materiais
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Usuarios</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileImage className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMaterials}</p>
                <p className="text-sm text-muted-foreground">Materiais</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Usuarios ({filteredUsers.length})
          </h2>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "p-4 rounded-xl bg-card border transition-all",
                user.is_admin ? "border-primary/30" : "border-border/50"
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">
                      {user.nome || "Sem nome"}
                    </h3>
                    {user.is_admin && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {materialCounts[user.id] || 0} materiais • Desde{" "}
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {user.id !== profile.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteUserId(user.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum usuario encontrado
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao excluira permanentemente o usuario e todos os seus materiais.
              Isso nao pode ser desfeito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
