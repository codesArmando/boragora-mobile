import type { Periodo } from '@/types/grupo';

export type StatusVolta = 'EM_AULA' | 'LIBERADO';

export interface TurmaDoAluno {
  id: number;
  nome: string;
  motorista: { nome: string };
  grupo: {
    id: number;
    nome: string;
    periodo: Periodo;
    horarioSaidaIda: string;
    horarioSaidaVolta: string;
  };
  incluiIda: boolean;
  incluiVolta: boolean;
}

// Formato de cada item de `GET /aluno/turmas` como a API devolve: a turma vem aninhada.
// O repositório converte para `TurmaDoAluno`, que é o formato que as telas usam.
export interface TurmaDoAlunoResposta {
  turma: Omit<TurmaDoAluno, 'motorista' | 'incluiIda' | 'incluiVolta'>;
  motorista: { id: number; nome: string };
  incluiIda: boolean;
  incluiVolta: boolean;
}

export interface PlanoAcoes {
  podeIncluirIda: boolean;
  podeCancelarIda: boolean;
  cancelamentoIdaSeraTardio: boolean;
  podeAlterarVolta: boolean;
  podeAlterarStatusVolta: boolean;
}

export interface PlanoDoDia {
  data: string;
  turma: Omit<TurmaDoAluno, 'motorista' | 'incluiIda' | 'incluiVolta'>;
  incluiIda: boolean;
  incluiVolta: boolean;
  statusVolta: StatusVolta;
  cancelouAposSaida: boolean;
  idaSaiu: boolean;
  voltaSaiu: boolean;
  acoes: PlanoAcoes;
}

export type EstadoPlano =
  'ENCERRADO' | 'IDA_CANCELADA' | 'APOS_SAIDA' | 'IDA_BLOQUEADA' | 'DECLARADO' | 'SEM_PLANO';
