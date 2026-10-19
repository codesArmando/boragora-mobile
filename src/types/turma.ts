import type { Periodo } from '@/types/grupo';

// Formatos de turma do backend (etapa 4 do plano do backend, seção 4.3 do plano do app).
export interface TurmaGrupo {
  id: number;
  nome: string;
  periodo: Periodo;
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
}

export interface TurmaMotorista {
  id: number;
  nome: string;
}

export interface TurmaAluno {
  id: number;
  nome: string;
}

// `GET /turmas/{id}`: alunos com vínculo ativo, em ordem alfabética.
export interface Turma {
  id: number;
  nome: string;
  numeroVan: number | null;
  capacidade: number | null;
  grupo: TurmaGrupo;
  motorista: TurmaMotorista;
  alunos: TurmaAluno[];
}

export interface TurmaCriacaoRequisicao {
  grupoId: number;
  nome: string;
  numeroVan: number | null;
  capacidade: number | null;
  motoristaId: number;
}

// O grupo da turma não muda depois de criada.
export interface TurmaEdicaoRequisicao {
  nome: string;
  numeroVan: number | null;
  capacidade: number | null;
  motoristaId: number;
}
