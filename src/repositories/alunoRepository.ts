import { api } from '@/api/api';
import { ErroApi } from '@/api/ErroApi';
import { alunos, atraso, turmaPorId, turmasDoAluno } from '@/repositories/mocks/gestao';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import type { AlunoAdmin } from '@/types/aluno';

// Vínculos de alunos (etapa 5 do backend). Com `mocksAtivos.e5`, devolve os dados falsos.

// D6: alunos que podem ser vinculados à turma, com a situação de cada um. Quem já está na
// própria turma não aparece.
export function buscarAlunosParaVincular(turmaId: number, busca: string): Promise<AlunoAdmin[]> {
  if (mocksAtivos.e5) {
    try {
      const turma = turmaPorId(turmaId);
      const termo = busca.trim().toLowerCase();
      const lista = alunos
        .filter((a) => !turma.alunos.some((v) => v.id === a.id))
        .filter((a) => `${a.nome} ${a.email}`.toLowerCase().includes(termo))
        .map<AlunoAdmin>((a) => {
          const atuais = turmasDoAluno(a.id);
          const emConflito = atuais.find((t) => t.grupo.id === turma.grupo.id);
          return {
            ...a,
            turmas: atuais.map((t) => `${t.grupo.nome} · ${t.nome}`),
            situacao: emConflito ? 'CONFLITO_NO_GRUPO' : 'DISPONIVEL',
            turmaEmConflito: emConflito?.nome ?? null,
          };
        })
        .sort((x, y) => x.nome.localeCompare(y.nome, 'pt-BR'));
      return atraso(lista);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  const consulta = `turmaId=${turmaId}&busca=${encodeURIComponent(busca.trim())}`;
  return api.get<AlunoAdmin[]>(`/admin/alunos?${consulta}`);
}

// Tudo ou nada: se um aluno do lote conflita, ninguém é vinculado.
export function vincularAlunos(turmaId: number, alunoIds: number[]): Promise<void> {
  if (mocksAtivos.e5) {
    try {
      const turma = turmaPorId(turmaId);
      for (const id of alunoIds) {
        const emConflito = turmasDoAluno(id).find((t) => t.grupo.id === turma.grupo.id);
        if (emConflito) {
          const aluno = alunos.find((a) => a.id === id);
          throw new ErroApi(
            409,
            'CONFLITO_GRUPO_ALUNO',
            `${aluno?.nome ?? 'Um aluno'} já está na ${emConflito.nome} deste grupo.`,
          );
        }
      }
      for (const id of alunoIds) {
        const aluno = alunos.find((a) => a.id === id);
        if (aluno) {
          turma.alunos.push({ id: aluno.id, nome: aluno.nome });
        }
      }
      turma.alunos.sort((x, y) => x.nome.localeCompare(y.nome, 'pt-BR'));
      return atraso(undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.post<void>(`/admin/turmas/${turmaId}/alunos`, { alunoIds });
}

export function removerAluno(turmaId: number, alunoId: number): Promise<void> {
  if (mocksAtivos.e5) {
    try {
      const turma = turmaPorId(turmaId);
      turma.alunos = turma.alunos.filter((a) => a.id !== alunoId);
      return atraso(undefined);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return api.del(`/admin/turmas/${turmaId}/alunos/${alunoId}`);
}
