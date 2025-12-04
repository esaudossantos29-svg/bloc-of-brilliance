-- Create table for muscle map settings synchronization
CREATE TABLE public.muscle_map_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  view text NOT NULL CHECK (view IN ('front', 'back')),
  device_type text NOT NULL CHECK (device_type IN ('mobile', 'desktop')),
  labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  global_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, view, device_type)
);

-- Enable RLS
ALTER TABLE public.muscle_map_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user isolation
CREATE POLICY "Users can view their own muscle map settings"
ON public.muscle_map_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own muscle map settings"
ON public.muscle_map_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own muscle map settings"
ON public.muscle_map_settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own muscle map settings"
ON public.muscle_map_settings
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_muscle_map_settings_updated_at
BEFORE UPDATE ON public.muscle_map_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();