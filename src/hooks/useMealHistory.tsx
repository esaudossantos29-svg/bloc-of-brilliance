import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MealFood {
  name: string;
  quantity: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  source?: string;
}

export interface Meal {
  id: string;
  user_id: string;
  meal_name?: string;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url?: string;
  foods: MealFood[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  notes?: string;
  confidence_score?: number;
  created_at: string;
}

export interface DailyNutrition {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_count: number;
}

export const useMealHistory = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);

  const loadMeals = async (startDate?: Date, endDate?: Date) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
      toast.error('Erro ao carregar histórico de refeições');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDailyNutrition = async (date: Date = new Date()) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .rpc('get_daily_nutrition', {
          p_user_id: user.id,
          p_date: date.toISOString().split('T')[0]
        });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDailyNutrition({
          total_calories: Number(data[0].total_calories),
          total_protein: Number(data[0].total_protein),
          total_carbs: Number(data[0].total_carbs),
          total_fat: Number(data[0].total_fat),
          meal_count: Number(data[0].meal_count)
        });
      }
    } catch (error) {
      console.error('Erro ao carregar nutrição diária:', error);
    }
  };

  const saveMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para salvar refeições');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          ...meal
        })
        .select()
        .single();

      if (error) throw error;
      
      setMeals(prev => [data, ...prev]);
      await loadDailyNutrition();
      toast.success('Refeição salva com sucesso! 🍽️');
      return data;
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
      toast.error('Erro ao salvar refeição');
    }
  };

  const updateMeal = async (mealId: string, updates: Partial<Meal>) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', mealId);

      if (error) throw error;
      
      setMeals(prev => prev.map(m => 
        m.id === mealId ? { ...m, ...updates } : m
      ));
      await loadDailyNutrition();
      toast.success('Refeição atualizada');
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      toast.error('Erro ao atualizar refeição');
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
      
      setMeals(prev => prev.filter(m => m.id !== mealId));
      await loadDailyNutrition();
      toast.success('Refeição removida');
    } catch (error) {
      console.error('Erro ao deletar refeição:', error);
      toast.error('Erro ao remover refeição');
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadMeals();
      loadDailyNutrition();
    }
  }, [user?.id]);

  return {
    meals,
    isLoading,
    dailyNutrition,
    saveMeal,
    updateMeal,
    deleteMeal,
    refreshMeals: loadMeals,
    refreshDailyNutrition: loadDailyNutrition
  };
};
