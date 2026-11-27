import { api } from '@/api/api';
import { alunosMock, motoristasMock, turmasCadastroMock } from '@/repositories/mocks/consultas';
import type { AlunoAdmin, Motorista, TurmaCadastro } from '@/types/consulta';

const USAR_MOCKS_ALUNOS = false;
const USAR_MOCKS_TURMAS = false;
const USAR_MOCKS_MOTORISTAS = false;

export async function listarAlunosAdmin(busca = ''): Promise<AlunoAdmin[]> {
  if (USAR_MOCKS_ALUNOS) {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return alunosMock.filter((aluno) =>
      `${aluno.nome} ${aluno.email}`.toLocaleLowerCase('pt-BR').includes(termo),
    );
  }
  const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  return api.get<AlunoAdmin[]>(`/admin/alunos${query}`);
}

export async function listarTurmasAdmin(): Promise<TurmaCadastro[]> {
  if (USAR_MOCKS_TURMAS) return turmasCadastroMock;
  return api.get<TurmaCadastro[]>('/admin/turmas');
}

export async function listarMotoristasAdmin(): Promise<Motorista[]> {
  if (USAR_MOCKS_MOTORISTAS) return motoristasMock;
  return api.get<Motorista[]>('/admin/motoristas');
}
