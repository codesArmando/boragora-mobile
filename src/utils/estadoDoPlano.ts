import type { EstadoPlano, PlanoDoDia } from '@/types/plano';

export function estadoDoPlano(plano: PlanoDoDia): EstadoPlano {
  if (plano.voltaSaiu) return 'ENCERRADO';
  if (plano.cancelouAposSaida) return 'IDA_CANCELADA';
  if (plano.idaSaiu && plano.incluiIda) return 'APOS_SAIDA';
  if (plano.idaSaiu && !plano.incluiIda) return 'IDA_BLOQUEADA';
  if (plano.incluiIda || plano.incluiVolta) return 'DECLARADO';
  return 'SEM_PLANO';
}
