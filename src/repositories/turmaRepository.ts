import { api } from '@/api/api';
import {
  turmaDetalheMock,
  turmaListaHojeMock,
  turmasGrupoHojeMock,
  turmasHojeMock,
} from '@/repositories/mocks/turmas';
import type { GrupoHoje, TurmaDetalhe, TurmaListaHoje, TurmaResumo } from '@/types/turma';

const USAR_MOCKS_TURMAS = true;
const USAR_MOCKS_GRUPO_HOJE = true;
const USAR_MOCKS_DETALHE_TURMA = true;

export async function listarTurmasDoMotorista(): Promise<TurmaResumo[]> {
  if (USAR_MOCKS_TURMAS) return turmasHojeMock;
  return api.get<TurmaResumo[]>('/motorista/turmas');
}

export async function buscarTurmaHoje(id: number): Promise<TurmaListaHoje> {
  if (USAR_MOCKS_TURMAS) return { ...turmaListaHojeMock, id };
  return api.get<TurmaListaHoje>(`/turmas/${id}/hoje`);
}

export async function buscarDetalheTurma(id: number): Promise<TurmaDetalhe> {
  if (USAR_MOCKS_DETALHE_TURMA) return { ...turmaDetalheMock, id };
  return api.get<TurmaDetalhe>(`/turmas/${id}`);
}

export async function buscarGrupoHoje(id: number): Promise<GrupoHoje> {
  if (USAR_MOCKS_GRUPO_HOJE) {
    const grupo = turmasGrupoHojeMock.find((item) => item.id === id);
    if (!grupo) throw new Error('Grupo não encontrado.');
    return grupo;
  }
  return api.get<GrupoHoje>(`/grupos/${id}/hoje`);
}
