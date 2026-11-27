import * as Notifications from 'expo-notifications';
import { router, usePathname, useRootNavigationState, type Href } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AvisoNotificacao } from '@/components/AvisoNotificacao';
import { useSessao } from '@/contexts/SessaoContext';
import { configurarExibicao } from '@/push/push';
import { destinoDoToque } from '@/push/destinoDoToque';

// Tempo que o aviso dentro do app fica na tela antes de sumir sozinho.
const DURACAO_AVISO_MS = 6_000;

type Recebida = {
  id: string;
  titulo: string;
  texto: string;
  data: unknown;
};

configurarExibicao();

function lerConteudo(notificacao: Notifications.Notification): Recebida {
  const { content, identifier } = notificacao.request;
  return {
    id: identifier,
    titulo: content.title ?? 'Boragora',
    texto: content.body ?? '',
    data: content.data,
  };
}

// Recebe e abre as notificações (NOT-03), dentro do SessaoProvider:
// - com o app aberto, mostra o aviso da E1; tocar nele abre o destino;
// - o toque na notificação do sistema, com o app aberto, em segundo plano ou fechado,
//   abre o destino da seção 5.6 do plano, depois que a sessão foi restaurada.
export function GerenciadorNotificacoes() {
  const { usuario, restaurando } = useSessao();
  const navegacaoPronta = useRootNavigationState()?.key !== undefined;
  // No índice ("/"), o app ainda vai redirecionar para a tela inicial do papel.
  const noIndice = usePathname() === '/';
  const [aviso, setAviso] = useState<Recebida | null>(null);
  // Toque que ainda espera a sessão e a navegação ficarem prontas. Com o app fechado,
  // o toque que abriu o app vem de `getLastNotificationResponse`.
  const pendente = useRef<Recebida | null>(null);
  // O mesmo toque pode chegar pela última resposta e pelo ouvinte: abre uma vez só.
  const tratadas = useRef(new Set<string>());
  const [sinal, setSinal] = useState(0);

  const aoTocarNotificacao = useCallback((recebida: Recebida) => {
    if (tratadas.current.has(recebida.id)) {
      return;
    }
    tratadas.current.add(recebida.id);
    pendente.current = recebida;
    setAviso(null);
    setSinal((n) => n + 1);
  }, []);

  useEffect(() => {
    const ultima = Notifications.getLastNotificationResponse();
    if (ultima !== null) {
      const recebida = lerConteudo(ultima.notification);
      tratadas.current.add(recebida.id);
      pendente.current = recebida;
    }
    const chegou = Notifications.addNotificationReceivedListener((notificacao) =>
      setAviso(lerConteudo(notificacao)),
    );
    const tocou = Notifications.addNotificationResponseReceivedListener((resposta) =>
      aoTocarNotificacao(lerConteudo(resposta.notification)),
    );
    return () => {
      chegou.remove();
      tocou.remove();
    };
  }, [aoTocarNotificacao]);

  // Abre o destino quando a sessão foi restaurada. Sem sessão, o toque é descartado:
  // as guardas levam à A1 e, depois do login, o índice abre a tela inicial do papel.
  useEffect(() => {
    const recebida = pendente.current;
    if (recebida === null || restaurando || !navegacaoPronta) {
      return;
    }
    if (usuario !== null && noIndice) {
      return;
    }
    pendente.current = null;
    Notifications.clearLastNotificationResponse();
    const destino = destinoDoToque(recebida.data, usuario);
    if (destino !== null) {
      // `withAnchor` põe a tela inicial da aba por baixo: voltar leva à tela inicial.
      router.navigate(destino as Href, { withAnchor: true });
    }
  }, [sinal, restaurando, navegacaoPronta, noIndice, usuario]);

  useEffect(() => {
    if (aviso === null) {
      return;
    }
    const timer = setTimeout(() => setAviso(null), DURACAO_AVISO_MS);
    return () => clearTimeout(timer);
  }, [aviso]);

  if (aviso === null || usuario === null) {
    return null;
  }
  return (
    <AvisoNotificacao
      titulo={aviso.titulo}
      texto={aviso.texto}
      aoTocar={() => aoTocarNotificacao(aviso)}
      aoFechar={() => setAviso(null)}
    />
  );
}
