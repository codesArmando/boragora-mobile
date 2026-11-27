import { api } from '@/api/api';

// Token do Expo Push do aparelho (NOT-02, etapa E8 do backend).
export function registrarTokenPush(token: string) {
  return api.put<void>('/me/push-token', { token });
}

export function removerTokenPush() {
  return api.del('/me/push-token');
}
