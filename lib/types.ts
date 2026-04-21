export interface Material {
  id: string
  user_id: string
  materia: string
  bimestre: number
  titulo: string
  descricao?: string
  image_url: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  nome: string | null
  is_admin: boolean
  created_at: string
}

export interface Materia {
  nome: string
  icone: React.ReactNode
  cor: string
  bgColor: string
  iconBg: string
}

export const BIMESTRES = [1, 2, 3, 4] as const
