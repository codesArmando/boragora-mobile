import { api } from '@/api/api';
import type { PushTokenRequisicao } from '@/types/push';

export function registrarTokenPush(requisicao: PushTokenRequisicao) {
  return api.put<void>('/me/push-token', requisicao);
}

export function removerTokenPush() {
  return api.del('/me/push-token');
}
