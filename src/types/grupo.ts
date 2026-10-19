// Formatos de grupo do backend (etapa 3 do plano do backend). Horários vêm como `HH:mm`.
export type Periodo = 'MANHA' | 'TARDE' | 'NOITE';

export interface MinhaTurma {
  id: number;
  nome: string;
}

export interface Grupo {
  id: number;
  nome: string;
  periodo: Periodo;
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
  totalTurmas: number;
  /** Turma de quem chama naquele grupo; sempre nula para o chefe que não conduz turma ali. */
  minhaTurma: MinhaTurma | null;
}

export interface GrupoRequisicao {
  nome: string;
  periodo: Periodo;
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
}
