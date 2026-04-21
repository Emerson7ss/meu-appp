"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, ImagePlus, X, Upload, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { titulo: string; descricao?: string; imageData: string }) => Promise<void>
  materiaNome: string
}

export function UploadModal({
  isOpen,
  onClose,
  onSubmit,
  materiaNome,
}: UploadModalProps) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tituloInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && tituloInputRef.current) {
      setTimeout(() => tituloInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const resetForm = () => {
    setTitulo("")
    setDescricao("")
    setImagePreview(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!titulo.trim() || !imagePreview) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        imageData: imagePreview,
      })
      resetForm()
      onClose()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Novo Material
            </span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">{materiaNome}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Titulo */}
          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium">
              Titulo da Aula *
            </label>
            <Input
              ref={tituloInputRef}
              id="titulo"
              placeholder="Ex: Equacoes do 2o grau"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          {/* Descricao */}
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descricao (opcional)
            </label>
            <Textarea
              id="descricao"
              placeholder="Adicione detalhes sobre o conteudo..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto do Material *</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-6 transition-all",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.setAttribute("capture", "environment")
                          fileInputRef.current.click()
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <Camera className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.removeAttribute("capture")
                          fileInputRef.current.click()
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <ImagePlus className="w-6 h-6 text-accent" />
                      <span className="text-sm font-medium">Galeria</span>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    ou arraste uma imagem aqui
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!titulo.trim() || !imagePreview || isSubmitting}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Salvar Material
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
