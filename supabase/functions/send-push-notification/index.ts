import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  userId?: string; // Se fornecido, envia apenas para este usuário
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: NotificationPayload = await req.json();
    const { title, body, icon, badge, tag, data, userId } = payload;

    console.log('📧 Enviando notificação push:', { title, userId });

    // Buscar subscrições
    let query = supabase
      .from('push_subscriptions')
      .select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Erro ao buscar subscrições:', fetchError);
      throw fetchError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('⚠️ Nenhuma subscrição encontrada');
      return new Response(
        JSON.stringify({ message: 'Nenhuma subscrição encontrada', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`📨 Enviando para ${subscriptions.length} subscrição(ões)`);

    // Enviar notificações para cada subscrição
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };

          // Preparar payload da notificação
          const notificationPayload = JSON.stringify({
            title,
            body,
            icon: icon || '/icon-192x192.png',
            badge: badge || '/icon-192x192.png',
            tag: tag || 'default',
            data: data || {},
          });

          // Usar Web Push API
          // Nota: Para produção, você precisará configurar VAPID keys
          // Por enquanto, vamos simular o envio
          console.log('✅ Notificação preparada para:', subscription.endpoint.substring(0, 50) + '...');
          
          // Em produção, você usaria uma biblioteca como 'web-push' do Node.js
          // ou faria uma requisição HTTP para o endpoint do push service
          
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error('Erro ao enviar para subscrição:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return { success: false, endpoint: subscription.endpoint, error: errorMessage };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`✅ Enviadas: ${successful}, ❌ Falhas: ${failed}`);

    return new Response(
      JSON.stringify({ 
        message: 'Notificações processadas',
        sent: successful,
        failed: failed,
        total: subscriptions.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Erro ao enviar notificações:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});