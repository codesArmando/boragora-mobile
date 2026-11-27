// Corpo de `PUT /me/push-token`. O backend aceita `ExponentPushToken[...]` ou `ExpoPushToken[...]`.
export interface PushTokenRequisicao {
  token: string;
}

// Campo `data` das notificações enviadas pelo backend (E8).
export type TipoDePush = 'LEMBRETE' | 'CANCELAMENTO_TARDIO';

export interface DadosDoPush {
  tipo: TipoDePush;
  turmaId: number;
}
