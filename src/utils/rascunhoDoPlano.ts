import type { PlanoDoDia, StatusVolta } from '@/types/plano';

// O que o aluno marcou na tela e ainda não confirmou. Só vai para a API no "Confirmar".
export interface RascunhoDoPlano {
  incluiIda: boolean;
  incluiVolta: boolean;
  statusVolta: StatusVolta;
}

// Cada campo presente é uma chamada à API. A ordem de envio é ida, volta e status,
// porque o status só pode ser gravado com a volta marcada.
export interface AlteracoesDoPlano {
  ida?: boolean;
  volta?: boolean;
  statusVolta?: StatusVolta;
}

export function rascunhoDe(plano: PlanoDoDia): RascunhoDoPlano {
  return {
    incluiIda: plano.incluiIda,
    incluiVolta: plano.incluiVolta,
    statusVolta: plano.statusVolta,
  };
}

export function alteracoesDoRascunho(
  plano: PlanoDoDia,
  rascunho: RascunhoDoPlano,
): AlteracoesDoPlano {
  const alteracoes: AlteracoesDoPlano = {};
  if (rascunho.incluiIda !== plano.incluiIda) alteracoes.ida = rascunho.incluiIda;
  if (rascunho.incluiVolta !== plano.incluiVolta) alteracoes.volta = rascunho.incluiVolta;
  // Ao marcar a volta, a API grava "Em aula"; o status só precisa ir se for outro.
  const statusSalvo = plano.incluiVolta ? plano.statusVolta : 'EM_AULA';
  if (rascunho.incluiVolta && rascunho.statusVolta !== statusSalvo) {
    alteracoes.statusVolta = rascunho.statusVolta;
  }
  return alteracoes;
}

export function temAlteracoes(alteracoes: AlteracoesDoPlano): boolean {
  return Object.keys(alteracoes).length > 0;
}
