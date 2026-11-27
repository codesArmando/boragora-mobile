// Formatos de aluno do backend para a gestão (etapa 5 do plano do backend).
export type SituacaoAluno = 'DISPONIVEL' | 'CONFLITO_NO_GRUPO';

export interface AlunoAdmin {
  id: number;
  nome: string;
  email: string;
  /** Turmas atuais, no formato "Manhã · Van 2". Vazia quando não há vínculo ativo. */
  turmas: string[];
  /** Em relação à turma consultada (D6); nula na listagem geral (D10). */
  situacao: SituacaoAluno | null;
  /** Nome da turma em conflito, quando `situacao` é `CONFLITO_NO_GRUPO`. */
  turmaEmConflito: string | null;
}

/** Turma como a API a devolve dentro de `GET /admin/alunos`. */
export interface TurmaDoAlunoAdmin {
  id: number;
  nome: string;
  grupo: { id: number; nome: string };
}

/**
 * Formato de `GET /admin/alunos` como a API devolve: as turmas vêm como objetos.
 * O repositório converte para `AlunoAdmin`, que é o formato que a D6 usa.
 */
export interface AlunoAdminResposta {
  id: number;
  nome: string;
  email: string;
  turmas: TurmaDoAlunoAdmin[];
  situacao: SituacaoAluno | null;
  turmaEmConflito: TurmaDoAlunoAdmin | null;
}
