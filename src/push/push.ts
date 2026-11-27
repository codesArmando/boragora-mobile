import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

// Infraestrutura do push (NOT-01): permissão, canal do Android e Expo push token.
// O push remoto só funciona no development build: o Expo Go no Android não recebe push
// desde o SDK 53, e o emulador não tem token. Nesses casos as funções devolvem `null`
// e o app segue sem push.

export const CANAL_PADRAO = 'default';

// Com o app aberto, a notificação não vira banner do sistema: o app mostra o próprio
// aviso (NOT-03). Ela continua na central de notificações.
export function configurarExibicao() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function pushDisponivel() {
  if (!Device.isDevice) {
    return false;
  }
  return !(isRunningInExpoGo() && Platform.OS === 'android');
}

function projectIdDoEas(): string | null {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
}

async function criarCanal() {
  if (Platform.OS !== 'android') {
    return;
  }
  // No Android 13 ou mais novo, o pedido de permissão só aparece depois de existir um canal.
  await Notifications.setNotificationChannelAsync(CANAL_PADRAO, {
    name: 'Avisos da van',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FFC800',
  });
}

async function temPermissao() {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) {
    return true;
  }
  if (!atual.canAskAgain) {
    return false;
  }
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

// Expo push token do aparelho, ou `null` quando não há push (Expo Go no Android, emulador,
// permissão negada, projeto sem `projectId` do EAS ou falha do serviço). Nunca lança erro.
export async function obterTokenPush(): Promise<string | null> {
  if (!pushDisponivel()) {
    return null;
  }
  try {
    await criarCanal();
    if (!(await temPermissao())) {
      return null;
    }
    const projectId = projectIdDoEas();
    if (projectId === null) {
      console.warn('Push: o app.json não tem o projectId do EAS (extra.eas.projectId).');
      return null;
    }
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch (erro) {
    console.warn('Push: não foi possível obter o token.', erro);
    return null;
  }
}
