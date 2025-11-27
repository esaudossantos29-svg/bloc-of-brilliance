/**
 * EXEMPLO DE USO: Integrando Push Notifications em Eventos do App
 * 
 * Este arquivo demonstra como acionar notificações push em diferentes eventos
 * da aplicação, como conclusão de treino, nova mensagem, lembretes, etc.
 */

import { useEffect } from 'react';
import { useSendPushNotification } from '@/hooks/useSendPushNotification';
import { useAuth } from '@/hooks/useAuth';

// ====================================================================
// EXEMPLO 1: Enviar notificação quando um treino é concluído
// ====================================================================
export function WorkoutCompletionExample() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const handleWorkoutComplete = async (workoutName: string, caloriesBurned: number) => {
    if (!user) return;

    await sendNotification({
      title: '🎉 Treino Concluído!',
      body: `Parabéns! Você completou ${workoutName} e queimou ${caloriesBurned} calorias!`,
      userId: user.id,
      icon: '/icon-192x192.png',
      tag: 'workout-complete',
      data: {
        url: '/progress',
        workoutName,
        caloriesBurned
      }
    });
  };

  return null; // Este é apenas um exemplo
}

// ====================================================================
// EXEMPLO 2: Enviar notificação quando uma meta é atingida
// ====================================================================
export function GoalAchievedExample() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const handleGoalAchieved = async (goalType: string, goalValue: number) => {
    if (!user) return;

    await sendNotification({
      title: '🏆 Meta Alcançada!',
      body: `Você atingiu sua meta de ${goalType}: ${goalValue}kg!`,
      userId: user.id,
      icon: '/icon-512x512.png',
      tag: 'goal-achieved',
      data: {
        url: '/dashboard',
        goalType,
        goalValue
      }
    });
  };

  return null;
}

// ====================================================================
// EXEMPLO 3: Lembrete diário de treino (usando agendamento)
// ====================================================================
export function DailyWorkoutReminderExample() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  useEffect(() => {
    // Verificar se é hora de enviar o lembrete (ex: 8h da manhã)
    const checkReminderTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Se for 8h da manhã e ainda não treinou hoje
      if (hour === 8) {
        sendDailyReminder();
      }
    };

    const sendDailyReminder = async () => {
      if (!user) return;

      await sendNotification({
        title: '💪 Hora do Treino!',
        body: 'Não esqueça de fazer seu treino hoje. Seu corpo agradece!',
        userId: user.id,
        tag: 'daily-reminder',
        data: {
          url: '/workouts'
        }
      });
    };

    // Verificar a cada hora
    const interval = setInterval(checkReminderTime, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  return null;
}

// ====================================================================
// EXEMPLO 4: Notificação quando uma nova receita é sugerida
// ====================================================================
export function NewRecipeSuggestionExample() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const handleNewRecipe = async (recipeName: string, calories: number) => {
    if (!user) return;

    await sendNotification({
      title: '🍽️ Nova Receita Sugerida!',
      body: `Experimente: ${recipeName} (${calories} calorias)`,
      userId: user.id,
      tag: 'new-recipe',
      data: {
        url: '/nutrition',
        recipeName,
        calories
      }
    });
  };

  return null;
}

// ====================================================================
// EXEMPLO 5: Notificação de marcos de progresso
// ====================================================================
export function ProgressMilestoneExample() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const handleMilestone = async (milestone: string) => {
    if (!user) return;

    const milestoneMessages: Record<string, { title: string; body: string }> = {
      '7-days': {
        title: '🔥 Sequência de 7 Dias!',
        body: 'Você está treinando por 7 dias seguidos! Continue assim!'
      },
      '30-days': {
        title: '🎖️ 30 Dias de Dedicação!',
        body: 'Um mês inteiro de treinos! Você é uma inspiração!'
      },
      '10-workouts': {
        title: '💯 10 Treinos Completados!',
        body: 'Você já completou 10 treinos. O progresso está chegando!'
      },
      'weight-goal': {
        title: '⚖️ Meta de Peso Alcançada!',
        body: 'Parabéns! Você atingiu seu peso objetivo!'
      }
    };

    const message = milestoneMessages[milestone];
    if (!message) return;

    await sendNotification({
      title: message.title,
      body: message.body,
      userId: user.id,
      tag: `milestone-${milestone}`,
      data: {
        url: '/progress',
        milestone
      }
    });
  };

  return null;
}

// ====================================================================
// EXEMPLO 6: Enviar notificação para TODOS os usuários (admin)
// ====================================================================
export function BroadcastNotificationExample() {
  const sendNotification = useSendPushNotification();

  const handleBroadcast = async (title: string, body: string) => {
    // Não passa userId para enviar para todos
    await sendNotification({
      title,
      body,
      tag: 'broadcast',
      data: {
        url: '/dashboard'
      }
    });
  };

  return null;
}

/**
 * COMO INTEGRAR NO SEU APP:
 * 
 * 1. Importe a função useSendPushNotification no componente onde o evento ocorre
 * 2. Chame a função quando o evento acontecer
 * 3. Configure os parâmetros da notificação
 * 
 * Exemplo prático em WorkoutSession.tsx:
 * 
 * ```tsx
 * import { useSendPushNotification } from '@/hooks/useSendPushNotification';
 * 
 * const WorkoutSession = () => {
 *   const sendNotification = useSendPushNotification();
 *   const { user } = useAuth();
 * 
 *   const completeWorkout = async () => {
 *     // ... lógica de conclusão do treino
 * 
 *     // Enviar notificação
 *     await sendNotification({
 *       title: '🎉 Treino Concluído!',
 *       body: 'Parabéns! Continue assim!',
 *       userId: user?.id,
 *       data: { url: '/progress' }
 *     });
 *   };
 * 
 *   return (
 *     <Button onClick={completeWorkout}>
 *       Finalizar Treino
 *     </Button>
 *   );
 * };
 * ```
 */