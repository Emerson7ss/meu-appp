-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de materiais/fotos
CREATE TABLE IF NOT EXISTS public.materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia TEXT NOT NULL,
  bimestre INTEGER NOT NULL CHECK (bimestre >= 1 AND bimestre <= 4),
  titulo TEXT NOT NULL,
  descricao TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX IF NOT EXISTS idx_materiais_user_id ON public.materiais(user_id);
CREATE INDEX IF NOT EXISTS idx_materiais_materia ON public.materiais(materia);
CREATE INDEX IF NOT EXISTS idx_materiais_titulo ON public.materiais(titulo);
CREATE INDEX IF NOT EXISTS idx_materiais_created_at ON public.materiais(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin pode ver todos os perfis
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Políticas para materiais (usuário só vê seus próprios materiais)
CREATE POLICY "materiais_select_own" ON public.materiais FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "materiais_insert_own" ON public.materiais FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "materiais_update_own" ON public.materiais FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "materiais_delete_own" ON public.materiais FOR DELETE USING (auth.uid() = user_id);

-- Admin pode ver todos os materiais
CREATE POLICY "admin_select_all_materiais" ON public.materiais FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NULL),
    COALESCE((NEW.raw_user_meta_data ->> 'is_admin')::BOOLEAN, FALSE)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
