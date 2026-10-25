export interface TurmaResumo {
  id: number;
  nome: string;
  grupo: {
    id: number;
    nome: string;
    periodo: 'MANHA' | 'TARDE' | 'NOITE';
    horarioSaidaIda: string;
    horarioSaidaVolta: string;
  };
  motorista: { id: number; nome: string };
  contadores: { vaoNaIda: number; voltam: number; liberados: number; canceladosAposSaida: number };
  semConfirmacoes: boolean;
}

export interface TurmaDetalhe {
  id: number;
  nome: string;
  numeroVan: number | null;
  capacidade: number | null;
  grupo: {
    id: number;
    nome: string;
    horarioSaidaIda: string;
    horarioSaidaVolta: string;
  };
  motorista: { id: number; nome: string };
  alunos: { id: number; nome: string }[];
}

export interface TurmaListaHoje {
  id: number;
  nome: string;
  grupo: { id: number; nome: string; horarioSaidaIda: string; horarioSaidaVolta: string };
  motorista: { id: number; nome: string };
  contadores: { vaoNaIda: number; voltam: number; liberados: number; canceladosAposSaida: number };
  semConfirmacoes: boolean;
  listaIda: {
    alunoId: number;
    nome: string;
    situacao: 'CONFIRMADO' | 'CANCELADO_APOS_SAIDA';
    voce: boolean;
  }[];
  listaVolta: {
    alunoId: number;
    nome: string;
    statusVolta: 'EM_AULA' | 'LIBERADO';
    voce: boolean;
  }[];
}

export interface TurmaGrupoHoje {
  id: number;
  nome: string;
  minhaTurma: boolean;
  contadores: { vaoNaIda: number; voltam: number; liberados: number; canceladosAposSaida: number };
  listaIda: TurmaListaHoje['listaIda'];
  listaVolta: TurmaListaHoje['listaVolta'];
}

export interface GrupoHoje {
  id: number;
  nome: string;
  periodo: 'MANHA' | 'TARDE' | 'NOITE';
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
  minhaTurma: { id: number; nome: string } | null;
  turmas: TurmaGrupoHoje[];
}
