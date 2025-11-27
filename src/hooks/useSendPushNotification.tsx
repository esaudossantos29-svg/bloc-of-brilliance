import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendNotificationParams {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  userId?: string; // Se fornecido, envia apenas para este usuário específico
}

/**
 * Hook para enviar notificações push através do edge function
 * 
 * Exemplo de uso:
 * ```tsx
 * const sendNotification = useSendPushNotification();
 * 
 * // Enviar para todos os usuários
 * await sendNotification({
 *   title: 'Nova Mensagem',
 *   body: 'Você tem uma nova mensagem!',
 *   data: { url: '/messages' }
 * });
 * 
 * // Enviar para um usuário específico
 * await sendNotification({
 *   title: 'Treino Concluído',
 *   body: 'Parabéns! Você concluiu seu treino de hoje!',
 *   userId: 'user-id-aqui',
 *   data: { url: '/progress' }
 * });
 * ```
 */
export function useSendPushNotification() {
  const sendNotification = async (params: SendNotificationParams): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: params
      });

      if (error) throw error;

      console.log('✅ Notificação enviada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
      toast.error('Erro ao enviar notificação');
      return false;
    }
  };

  return sendNotification;
}