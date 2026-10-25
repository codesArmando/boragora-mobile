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
  minhaTurma: MinhaTurma | null;
}

export interface GrupoDTO {
  nome: string;
  periodo: Periodo;
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
}
