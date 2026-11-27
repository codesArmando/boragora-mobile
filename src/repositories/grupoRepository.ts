import { api } from '@/api/api';
import { gruposMock } from '@/repositories/mocks/grupos';
import { turmasGrupoHojeMock } from '@/repositories/mocks/turmas';
import { mocksAtivos } from '@/repositories/mocks/mocksAtivos';
import type { Grupo, GrupoDTO } from '@/types/grupo';
import type { GrupoHoje } from '@/types/turma';

const USAR_MOCKS = mocksAtivos.e3;
const USAR_MOCKS_HOJE = mocksAtivos.e7;

export async function listarGrupos(): Promise<Grupo[]> {
  if (USAR_MOCKS) {
    return gruposMock;
  }

  const grupos = await api.get<Grupo[]>('/grupos');
  return grupos.map((grupo) => ({
    ...grupo,
    minhaTurma: grupo.minhaTurma ?? null,
  }));
}

export async function buscarGrupo(id: number): Promise<Grupo> {
  if (USAR_MOCKS) {
    const grupo = gruposMock.find((item) => item.id === id);

    if (!grupo) {
      throw new Error('Grupo não encontrado.');
    }

    return grupo;
  }

  const grupo = await api.get<Grupo>(`/grupos/${id}`);
  return { ...grupo, minhaTurma: grupo.minhaTurma ?? null };
}

export async function buscarGrupoHoje(id: number): Promise<GrupoHoje> {
  if (USAR_MOCKS_HOJE) {
    const grupo = turmasGrupoHojeMock.find((item) => item.id === id);
    if (!grupo) throw new Error('Grupo não encontrado.');
    return grupo;
  }
  return api.get<GrupoHoje>(`/grupos/${id}/hoje`);
}

// Cadastro de grupos pelo motorista-chefe (etapa 3): telas D2 e D2b.
export function criarGrupo(requisicao: GrupoDTO) {
  return api.post<Grupo>('/admin/grupos', requisicao);
}

export function atualizarGrupo(id: number, requisicao: GrupoDTO) {
  return api.put<Grupo>(`/admin/grupos/${id}`, requisicao);
}

export function excluirGrupo(id: number) {
  return api.del(`/admin/grupos/${id}`);
}
