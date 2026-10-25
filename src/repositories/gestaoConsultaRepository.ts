import { api } from '@/api/api';
import { alunosMock, motoristasMock, turmasCadastroMock } from '@/repositories/mocks/consultas';
import type { AlunoAdmin, Motorista, TurmaCadastro } from '@/types/consulta';

const USAR_MOCKS_ALUNOS = true;
const USAR_MOCKS_TURMAS = true;
const USAR_MOCKS_MOTORISTAS = true;

export async function listarAlunosAdmin(): Promise<AlunoAdmin[]> {
  if (USAR_MOCKS_ALUNOS) return alunosMock;
  return api.get<AlunoAdmin[]>('/admin/alunos');
}

export async function listarTurmasAdmin(): Promise<TurmaCadastro[]> {
  if (USAR_MOCKS_TURMAS) return turmasCadastroMock;
  return api.get<TurmaCadastro[]>('/admin/turmas');
}

export async function listarMotoristasAdmin(): Promise<Motorista[]> {
  if (USAR_MOCKS_MOTORISTAS) return motoristasMock;
  return api.get<Motorista[]>('/admin/motoristas');
}
