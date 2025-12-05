import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/untyped";
import { useAuth } from "@/hooks/useAuth";

interface MuscleTrainingStatus {
  muscleGroup: string;
  lastTrainedAt: Date | null;
  daysSinceTraining: number | null;
  trainingCount: number;
}

export const useRecentMuscleTraining = (daysRange: number = 7) => {
  const { user } = useAuth();
  const [muscleStatus, setMuscleStatus] = useState<Map<string, MuscleTrainingStatus>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMuscleTrainingStatus();
    }
  }, [user, daysRange]);

  const loadMuscleTrainingStatus = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - daysRange);

      // Get exercise history with exercise details
      const { data: exerciseHistory } = await supabase
        .from('exercise_history')
        .select(`
          completed_at,
          exercise_id,
          exercise_library!inner(muscle_group)
        `)
        .eq('user_id', user.id)
        .gte('completed_at', daysAgo.toISOString())
        .order('completed_at', { ascending: false });

      const statusMap = new Map<string, MuscleTrainingStatus>();

      if (exerciseHistory) {
        exerciseHistory.forEach((entry: any) => {
          const muscleGroup = entry.exercise_library?.muscle_group;
          if (!muscleGroup) return;

          const completedAt = new Date(entry.completed_at);
          const daysSince = Math.floor(
            (Date.now() - completedAt.getTime()) / (1000 * 60 * 60 * 24)
          );

          const existing = statusMap.get(muscleGroup);
          if (!existing || (existing.lastTrainedAt && completedAt > existing.lastTrainedAt)) {
            statusMap.set(muscleGroup, {
              muscleGroup,
              lastTrainedAt: completedAt,
              daysSinceTraining: daysSince,
              trainingCount: (existing?.trainingCount || 0) + 1,
            });
          } else if (existing) {
            statusMap.set(muscleGroup, {
              ...existing,
              trainingCount: existing.trainingCount + 1,
            });
          }
        });
      }

      setMuscleStatus(statusMap);
    } catch (error) {
      console.error('Error loading muscle training status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrainingStatus = (muscleGroup: string): MuscleTrainingStatus | null => {
    return muscleStatus.get(muscleGroup) || null;
  };

  const getProgressLevel = (muscleGroup: string): 'recent' | 'moderate' | 'resting' | 'none' => {
    const status = muscleStatus.get(muscleGroup);
    if (!status || status.daysSinceTraining === null) return 'none';
    
    if (status.daysSinceTraining <= 1) return 'recent'; // Trained today or yesterday
    if (status.daysSinceTraining <= 3) return 'moderate'; // Trained 2-3 days ago
    return 'resting'; // Trained 4+ days ago
  };

  return {
    muscleStatus,
    loading,
    getTrainingStatus,
    getProgressLevel,
    refresh: loadMuscleTrainingStatus,
  };
};
