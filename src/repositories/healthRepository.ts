import { api } from '@/api/api';
import type { HealthResposta } from '@/types/health';

export function verificarApi() {
  return api.get<HealthResposta>('/health');
}
