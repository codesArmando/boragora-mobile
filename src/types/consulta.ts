export interface Motorista {
  id: number;
  nome: string;
  email: string;
}

export interface AlunoAdmin {
  id: number;
  nome: string;
  email: string;
  turmas: { id: number; nome: string }[];
  situacao?: string | null;
}

export interface TurmaCadastro {
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
  totalAlunos: number;
}
