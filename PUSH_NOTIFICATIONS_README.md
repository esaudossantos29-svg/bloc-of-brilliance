# 🔔 Sistema de Notificações Push - nPnG JM

Sistema completo de notificações push para o PWA, permitindo enviar notificações aos usuários mesmo quando o app está fechado.

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Componentes](#componentes)
3. [Como Usar](#como-usar)
4. [Configuração](#configuração)
5. [Exemplos de Integração](#exemplos-de-integração)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

O sistema é composto por:

### Backend (Supabase)
- **Tabela `push_subscriptions`**: Armazena as subscrições de push dos usuários
- **Edge Function `send-push-notification`**: API para enviar notificações push

### Frontend (React)
- **Service Worker (`/public/sw.js`)**: Gerencia as notificações push no dispositivo
- **Hook `usePushNotifications`**: Gerencia inscrições e desinscrições
- **Hook `useSendPushNotification`**: Envia notificações via edge function
- **Componente `PushNotificationSettings`**: UI para gerenciar notificações

---

## 🧩 Componentes

### 1. Tabela `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**RLS Políticas**: Usuários só podem ver e gerenciar suas próprias subscrições.

### 2. Edge Function `/send-push-notification`

**Endpoint**: `POST /functions/v1/send-push-notification`

**Body**:
```typescript
{
  title: string;           // Título da notificação
  body: string;            // Mensagem da notificação
  icon?: string;           // URL do ícone (default: /icon-192x192.png)
  badge?: string;          // URL do badge
  tag?: string;            // Tag para agrupar notificações
  data?: Record<string, any>; // Dados customizados
  userId?: string;         // Se fornecido, envia apenas para este usuário
}
```

**Resposta**:
```typescript
{
  message: string;
  sent: number;      // Número de notificações enviadas
  failed: number;    // Número de falhas
  total: number;     // Total de subscrições
}
```

### 3. Service Worker

Gerencia:
- Cache de recursos do PWA
- Recebimento de notificações push
- Clique em notificações (navegação)
- Vibração e sons

### 4. Hooks React

#### `usePushNotifications()`
```typescript
const {
  isSupported,      // Notificações push são suportadas?
  isSubscribed,     // Usuário está inscrito?
  permission,       // Status da permissão ('granted', 'denied', 'default')
  loading,          // Estado de carregamento
  subscribe,        // Função para inscrever
  unsubscribe,      // Função para desinscrever
  sendTestNotification // Enviar notificação de teste
} = usePushNotifications();
```

#### `useSendPushNotification()`
```typescript
const sendNotification = useSendPushNotification();

await sendNotification({
  title: 'Título',
  body: 'Mensagem',
  userId: 'user-id-opcional'
});
```

---

## 🚀 Como Usar

### 1. Configuração Inicial (Já feita)

✅ Service Worker registrado em `src/main.tsx`  
✅ Tabela criada no Supabase  
✅ Edge Function deployada  
✅ Componente adicionado à página de perfil

### 2. Ativar Notificações (Usuário)

1. Ir para a página de **Perfil**
2. Localizar a seção **Notificações Push**
3. Clicar em **Ativar**
4. Permitir notificações no navegador
5. Testar com **Enviar Notificação de Teste**

### 3. Enviar Notificações (Desenvolvedor)

#### Opção A: Usar o Hook
```tsx
import { useSendPushNotification } from '@/hooks/useSendPushNotification';

function MyComponent() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const handleEvent = async () => {
    await sendNotification({
      title: '🎉 Evento!',
      body: 'Algo importante aconteceu!',
      userId: user?.id,
      data: { url: '/dashboard' }
    });
  };

  return <Button onClick={handleEvent}>Acionar Evento</Button>;
}
```

#### Opção B: Chamar a Edge Function Diretamente
```typescript
const { error } = await supabase.functions.invoke('send-push-notification', {
  body: {
    title: 'Título',
    body: 'Mensagem',
    userId: 'user-id-opcional'
  }
});
```

---

## ⚙️ Configuração

### VAPID Keys (Importante para Produção)

As chaves VAPID são necessárias para enviar notificações push. Atualmente, o sistema usa uma chave de exemplo.

**Para gerar suas próprias chaves:**

```bash
npx web-push generate-vapid-keys
```

Isso gerará:
- **Public Key**: Adicionar em `src/hooks/usePushNotifications.tsx` (linha 62)
- **Private Key**: Adicionar como secret no Supabase

**Adicionar Private Key no Supabase:**
```bash
# Via CLI
supabase secrets set VAPID_PRIVATE_KEY="sua-chave-privada"

# Ou via Dashboard
Settings → Edge Functions → Secrets
```

### Permissões do Navegador

As notificações push funcionam nos seguintes navegadores:
- ✅ Chrome/Edge (Desktop e Android)
- ✅ Firefox (Desktop e Android)
- ✅ Safari (Desktop e iOS 16.4+)
- ❌ iOS Safari (versões antigas)

---

## 💡 Exemplos de Integração

### Exemplo 1: Notificar ao Completar Treino

```tsx
// src/pages/WorkoutSession.tsx
import { useSendPushNotification } from '@/hooks/useSendPushNotification';

const WorkoutSession = () => {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  const completeWorkout = async () => {
    // Salvar treino no banco...
    
    // Enviar notificação
    await sendNotification({
      title: '🎉 Treino Concluído!',
      body: 'Parabéns! Você completou seu treino de hoje!',
      userId: user?.id,
      data: { url: '/progress' }
    });
  };

  return <Button onClick={completeWorkout}>Finalizar</Button>;
};
```

### Exemplo 2: Lembrete Diário

```tsx
// src/components/DailyReminder.tsx
import { useEffect } from 'react';
import { useSendPushNotification } from '@/hooks/useSendPushNotification';

export function DailyReminder() {
  const sendNotification = useSendPushNotification();
  const { user } = useAuth();

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      
      if (hour === 8) { // 8h da manhã
        sendNotification({
          title: '💪 Hora do Treino!',
          body: 'Bom dia! Não esqueça de treinar hoje!',
          userId: user?.id,
          data: { url: '/workouts' }
        });
      }
    };

    const interval = setInterval(checkTime, 60 * 60 * 1000); // A cada hora
    return () => clearInterval(interval);
  }, [user]);

  return null;
}
```

### Exemplo 3: Notificar Todos os Usuários (Broadcast)

```tsx
// Para admins: enviar para todos os usuários
const sendBroadcast = async () => {
  await sendNotification({
    title: '📢 Anúncio Importante',
    body: 'Nova funcionalidade disponível no app!',
    // Não incluir userId para enviar para todos
  });
};
```

### Exemplo 4: Notificar ao Atingir Meta

```tsx
const checkGoalAchievement = async (currentWeight: number, goalWeight: number) => {
  if (currentWeight <= goalWeight) {
    await sendNotification({
      title: '🏆 Meta Alcançada!',
      body: `Parabéns! Você atingiu ${goalWeight}kg!`,
      userId: user?.id,
      data: { url: '/progress' }
    });
  }
};
```

---

## 🔧 Troubleshooting

### Problema: Notificações não aparecem

**Causas possíveis:**
1. Permissão negada pelo usuário
2. Service worker não registrado
3. Subscrição não salva no banco
4. Notificações bloqueadas pelo sistema operacional

**Solução:**
```typescript
// Verificar permissão
console.log('Permissão:', Notification.permission);

// Verificar service worker
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker:', reg);
});

// Verificar subscrição
const { data } = await supabase
  .from('push_subscriptions')
  .select('*')
  .eq('user_id', user.id);
console.log('Subscrições:', data);
```

### Problema: Edge function retorna erro

**Verificar:**
1. Usuário está autenticado?
2. Subscrição existe no banco?
3. Logs da edge function no Supabase Dashboard

**Ver logs:**
```
Supabase Dashboard → Edge Functions → send-push-notification → Logs
```

### Problema: iOS não recebe notificações

**Limitações do iOS:**
- iOS Safari requer versão 16.4+
- PWA deve estar instalado na tela inicial
- Algumas restrições de notificações podem aplicar

---

## 📚 Recursos Adicionais

- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [VAPID Protocol](https://datatracker.ietf.org/doc/html/rfc8292)

---

## 🎯 Próximos Passos

- [ ] Gerar e configurar VAPID keys de produção
- [ ] Implementar agendamento de notificações
- [ ] Adicionar notificações rich (imagens, ações)
- [ ] Implementar analytics de notificações
- [ ] Adicionar preferências granulares (tipos de notificações)

---

**Desenvolvido para nPnG JM** 💪🔥