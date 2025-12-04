-- Criar tabela body_photos para armazenar fotos de progresso corporal
CREATE TABLE public.body_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('front', 'back', 'side')),
  photo_date DATE DEFAULT CURRENT_DATE,
  weight_at_photo DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.body_photos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own photos" ON public.body_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON public.body_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON public.body_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Criar bucket de storage para fotos corporais
INSERT INTO storage.buckets (id, name, public)
VALUES ('body-photos', 'body-photos', true);

-- Políticas de storage
CREATE POLICY "Users can upload body photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'body-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view body photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'body-photos');

CREATE POLICY "Users can delete own body photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'body-photos' AND auth.uid()::text = (storage.foldername(name))[1]);