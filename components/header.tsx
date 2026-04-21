"use client"

import { GraduationCap, LogOut, Settings, User, ChevronLeft } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Profile } from "@/lib/types"

interface HeaderProps {
  profile?: Profile | null
  onLogout?: () => void
  onAdminClick?: () => void
  title?: string
  subtitle?: string
  onBack?: () => void
  showProfile?: boolean
}

export function Header({ 
  profile, 
  onLogout, 
  onAdminClick, 
  title, 
  subtitle, 
  onBack,
  showProfile = true 
}: HeaderProps) {
  const initials = profile?.nome
    ? profile.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || "?"

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex h-16 items-center justify-between px-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          {onBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title || "StudyHub"}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {!subtitle && !onBack && (
              <p className="text-xs text-muted-foreground hidden sm:block">Seus materiais em um lugar</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {showProfile && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{profile?.nome || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                {profile?.is_admin && onAdminClick && (
                  <DropdownMenuItem onClick={onAdminClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Painel Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onLogout && (
                  <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
