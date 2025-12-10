import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "./useAdminAuditLog";

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
  workoutCount?: number;
  mealCount?: number;
  lastActivity?: string | null;
  role?: string | null;
}

async function verifyAdminAccess(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (error || !roleData) {
    return false;
  }

  return true;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      // Verificar acesso admin antes de qualquer query
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Acesso negado: Requer privilégios de administrador');
      }

      // Log da ação de visualização
      await logAdminAction({ action_type: 'VIEW_ALL_USERS' });

      // Fetch all profiles (RLS já filtra para admins)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
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
    staleTime: 1000 * 60 * 2,
    retry: false, // Não retry em caso de erro de autorização
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Acesso negado: Requer privilégios de administrador');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspended_reason: reason,
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Log da ação
      await logAdminAction({
        action_type: 'SUSPEND_USER',
        target_user_id: userId,
        details: { reason },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário suspenso com sucesso');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao suspender usuário');
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Acesso negado: Requer privilégios de administrador');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspended_at: null,
          suspended_reason: null,
        })
        .eq('user_id', userId);

      if (error) throw error;

      await logAdminAction({
        action_type: 'UNSUSPEND_USER',
        target_user_id: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Suspensão removida com sucesso');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover suspensão');
    },
  });
}

export function useTogglePremium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isPremium }: { userId: string; isPremium: boolean }) => {
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        throw new Error('Acesso negado: Requer privilégios de administrador');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: isPremium })
        .eq('user_id', userId);

      if (error) throw error;

      await logAdminAction({
        action_type: 'TOGGLE_PREMIUM',
        target_user_id: userId,
        details: { is_premium: isPremium },
      });
    },
    onSuccess: (_, { isPremium }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isPremium ? 'Usuário promovido a Premium' : 'Premium removido');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar status premium');
    },
  });
}

export function useToggleAdminRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const hasAccess = await verifyAdminAccess();
      if (!hasAccess) {
        throw new Error('Acesso negado: Requer privilégios de administrador');
      }

      if (isAdmin) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
      }

      await logAdminAction({
        action_type: 'TOGGLE_ADMIN_ROLE',
        target_user_id: userId,
        details: { is_admin: isAdmin },
      });
    },
    onSuccess: (_, { isAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(isAdmin ? 'Usuário promovido a Admin' : 'Privilégios de Admin removidos');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar role de admin');
    },
  });
}

export function usePromoteAdminByEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Não autenticado');
      }

      const response = await supabase.functions.invoke('promote-admin-by-email', {
        body: { email },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao promover admin');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(data?.message || 'Usuário promovido a Admin');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao promover admin');
    },
  });
}
