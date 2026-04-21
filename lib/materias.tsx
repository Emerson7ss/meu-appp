import {
  Calculator,
  BookOpen,
  Globe,
  MapPin,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  Palette,
  Music,
  Dumbbell,
  BookText,
} from "lucide-react"
import type { Materia } from "./types"

export const MATERIAS: Materia[] = [
  {
    nome: "Matematica",
    icone: <Calculator className="w-6 h-6" />,
    cor: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    iconBg: "bg-pink-500",
  },
  {
    nome: "Portugues",
    icone: <BookOpen className="w-6 h-6" />,
    cor: "from-cyan-500 to-teal-500",
    bgColor: "bg-cyan-500/10",
    iconBg: "bg-cyan-500",
  },
  {
    nome: "Historia",
    icone: <BookText className="w-6 h-6" />,
    cor: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    iconBg: "bg-amber-500",
  },
  {
    nome: "Geografia",
    icone: <MapPin className="w-6 h-6" />,
    cor: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/10",
    iconBg: "bg-emerald-500",
  },
  {
    nome: "Fisica",
    icone: <Atom className="w-6 h-6" />,
    cor: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    iconBg: "bg-violet-500",
  },
  {
    nome: "Quimica",
    icone: <FlaskConical className="w-6 h-6" />,
    cor: "from-red-500 to-rose-500",
    bgColor: "bg-red-500/10",
    iconBg: "bg-red-500",
  },
  {
    nome: "Biologia",
    icone: <Dna className="w-6 h-6" />,
    cor: "from-lime-500 to-green-500",
    bgColor: "bg-lime-500/10",
    iconBg: "bg-lime-500",
  },
  {
    nome: "Ingles",
    icone: <Globe className="w-6 h-6" />,
    cor: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    iconBg: "bg-blue-500",
  },
  {
    nome: "Artes",
    icone: <Palette className="w-6 h-6" />,
    cor: "from-fuchsia-500 to-pink-500",
    bgColor: "bg-fuchsia-500/10",
    iconBg: "bg-fuchsia-500",
  },
  {
    nome: "Educacao Fisica",
    icone: <Dumbbell className="w-6 h-6" />,
    cor: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    iconBg: "bg-orange-500",
  },
  {
    nome: "Musica",
    icone: <Music className="w-6 h-6" />,
    cor: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/10",
    iconBg: "bg-indigo-500",
  },
  {
    nome: "Sociologia",
    icone: <Languages className="w-6 h-6" />,
    cor: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/10",
    iconBg: "bg-teal-500",
  },
]

export function getMateriaByNome(nome: string): Materia | undefined {
  return MATERIAS.find((m) => m.nome.toLowerCase() === nome.toLowerCase())
}
