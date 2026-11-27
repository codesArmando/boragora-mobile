import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

// Notificações push (NOT-01 a NOT-03). O Expo Go não recebe push remoto desde o SDK 53: precisa
// de um development build (EAS + FCM). Por isso o módulo só é carregado fora do Expo Go e só
// pede o token quando há `projectId` do EAS na configuração. No Expo Go tudo vira no-op e o
// resto do app funciona normalmente.

type ModuloNotificacoes = typeof import('expo-notifications');

/** `false` no Expo Go, onde não existe push remoto. */
export const pushDisponivel = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

let modulo: ModuloNotificacoes | null = null;

/** O módulo `expo-notifications`, carregado sob demanda; `null` no Expo Go. */
export function moduloNotificacoes(): ModuloNotificacoes | null {
  if (!pushDisponivel) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  modulo ??= require('expo-notifications') as ModuloNotificacoes;
  return modulo;
}

function projectIdDoEas(): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId ?? Constants.easConfig?.projectId;
}

/**
 * Pede permissão e devolve o Expo push token do aparelho, ou `null` quando não há push
 * (Expo Go, sem `projectId`, permissão negada). No Android 13+ o canal precisa existir antes
 * do pedido de permissão e do token.
 */
export async function obterTokenPush(): Promise<string | null> {
  const notificacoes = moduloNotificacoes();
  const projectId = projectIdDoEas();
  if (notificacoes === null || !projectId) return null;

  if (Platform.OS === 'android') {
    await notificacoes.setNotificationChannelAsync('avisos', {
      name: 'Avisos da van',
      importance: notificacoes.AndroidImportance.HIGH,
    });
  }
  let { status } = await notificacoes.getPermissionsAsync();
  if (status !== 'granted') {
    ({ status } = await notificacoes.requestPermissionsAsync());
  }
  if (status !== 'granted') return null;

  const { data } = await notificacoes.getExpoPushTokenAsync({ projectId });
  return data;
}

/**
 * Tela aberta pelo toque na notificação (tabela da seção 5.6 do plano). Sem `data` ou com
 * tipo desconhecido, abre a tela inicial do papel (o índice redireciona).
 */
export function destinoDaNotificacao(data: unknown): string {
  const { tipo, turmaId } = (data ?? {}) as { tipo?: unknown; turmaId?: unknown };
  const id = Number(turmaId);
  if (!Number.isInteger(id) || id <= 0) return '/';
  if (tipo === 'LEMBRETE') return `/aluno/hoje/${id}`;
  if (tipo === 'CANCELAMENTO_TARDIO') return `/motorista/hoje/${id}`;
  return '/';
}
