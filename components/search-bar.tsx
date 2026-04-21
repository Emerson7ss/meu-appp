"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Buscar assunto...", className }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(debounce)
  }, [query, onSearch])

  return (
    <div
      className={cn(
        "relative flex items-center transition-all duration-300",
        isFocused && "scale-[1.02]",
        className
      )}
    >
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "pl-9 pr-9 h-11 rounded-full border-2 transition-all duration-300",
          "bg-card/80 backdrop-blur-sm",
          isFocused
            ? "border-primary shadow-lg shadow-primary/20"
            : "border-border hover:border-primary/50"
        )}
      />
      {query && (
        <button
          onClick={() => {
            setQuery("")
            inputRef.current?.focus()
          }}
          className="absolute right-3 p-0.5 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
