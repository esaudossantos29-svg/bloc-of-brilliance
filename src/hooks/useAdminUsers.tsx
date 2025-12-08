import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  fitness_goal: string | null;
  is_premium: boolean | null;
  is_suspended: boolean | null;
  suspended_at: string | null;
  suspended_reason: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean | null;
  // Activity stats
  workoutCount?: number;
  mealCount?: number;
  lastActivity?: string | null;
  role?: string | null;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      // Fetch activity counts for all users
      const userIds = profiles?.map(p => p.user_id) || [];
      
      const [workoutsResult, mealsResult] = await Promise.all([
        supabase
          .from('workout_history')
          .select('user_id, completed_at')
          .in('user_id', userIds),
        supabase
          .from('meals')
          .select('user_id, created_at')
          .in('user_id', userIds),
      ]);

      // Count workouts and meals per user
      const workoutCounts = new Map<string, number>();
      const mealCounts = new Map<string, number>();
      const lastActivityMap = new Map<string, string>();

      workoutsResult.data?.forEach(w => {
        workoutCounts.set(w.user_id, (workoutCounts.get(w.user_id) || 0) + 1);
        const current = lastActivityMap.get(w.user_id);
        if (!current || (w.completed_at && w.completed_at > current)) {
          lastActivityMap.set(w.user_id, w.completed_at || '');
        }
      });

      mealsResult.data?.forEach(m => {
        mealCounts.set(m.user_id, (mealCounts.get(m.user_id) || 0) + 1);
        const current = lastActivityMap.get(m.user_id);
        if (!current || (m.created_at && m.created_at > current)) {
          lastActivityMap.set(m.user_id, m.created_at || '');
        }
      });

      return (profiles || []).map(profile => ({
        ...profile,
        workoutCount: workoutCounts.get(profile.user_id) || 0,
        mealCount: mealCounts.get(profile.user_id) || 0,
        lastActivity: lastActivityMap.get(profile.user_id) || null,
        role: rolesMap.get(profile.user_id) || null,
      }));
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspended_reason: reason,
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário suspenso com sucesso');
    },
    onError: (error) => {
      console.error('Error suspending user:', error);
      toast.error('Erro ao suspender usuário');
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspended_at: null,
          suspended_reason: null,
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Suspensão removida com sucesso');
    },
    onError: (error) => {
      console.error('Error unsuspending user:', error);
      toast.error('Erro ao remover suspensão');
    },
  });
}

export function useTogglePremium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isPremium }: { userId: string; isPremium: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: isPremium })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, { isPremium }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isPremium ? 'Usuário promovido a Premium' : 'Premium removido');
    },
    onError: (error) => {
      console.error('Error toggling premium:', error);
      toast.error('Erro ao alterar status premium');
    },
  });
}

export function useToggleAdminRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      } else {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
      }
    },
    onSuccess: (_, { isAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isAdmin ? 'Usuário promovido a Admin' : 'Privilégios de Admin removidos');
    },
    onError: (error) => {
      console.error('Error toggling admin role:', error);
      toast.error('Erro ao alterar role de admin');
    },
  });
}
