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
