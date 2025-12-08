-- Add moderation fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS suspended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS suspended_reason text;

-- Create RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create RLS policy for admins to update any profile (for moderation)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all workout_history for user activity monitoring
CREATE POLICY "Admins can view all workout history"
ON public.workout_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all meals for user activity monitoring
CREATE POLICY "Admins can view all meals"
ON public.meals
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));