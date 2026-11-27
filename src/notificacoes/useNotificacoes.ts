import type { NotificationResponse } from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';

import { destinoDaNotificacao, moduloNotificacoes } from '@/notificacoes/push';

// NOT-03: com o app aberto, a notificação aparece como banner; o toque (com o app aberto ou
// fechado) abre a tela da tabela da seção 5.6 do plano. Sem sessão, as guardas das rotas levam
// à A1 e, depois do login, à tela inicial do papel. No Expo Go não faz nada.
const notificacoes = moduloNotificacoes();

notificacoes?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificacoes() {
  useEffect(() => {
    if (notificacoes === null) return;

    function abrir(resposta: NotificationResponse) {
      router.push(destinoDaNotificacao(resposta.notification.request.content.data) as Href);
    }

    // Toque que abriu o app fechado: o listener sozinho pode não receber esse evento.
    const ultima = notificacoes.getLastNotificationResponse();
    if (ultima) {
      abrir(ultima);
      notificacoes.clearLastNotificationResponse();
    }

    const assinatura = notificacoes.addNotificationResponseReceivedListener(abrir);
    return () => assinatura.remove();
  }, []);
}
