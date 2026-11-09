import { api } from '@/api/api';
import { gruposMock } from '@/repositories/mocks/grupos';
import type { Grupo, GrupoDTO } from '@/types/grupo';

const USAR_MOCKS = false;

export async function listarGrupos(): Promise<Grupo[]> {
  if (USAR_MOCKS) {
    return gruposMock;
  }

  return api.get<Grupo[]>('/grupos');
}

export async function buscarGrupo(id: number): Promise<Grupo> {
  if (USAR_MOCKS) {
    const grupo = gruposMock.find((item) => item.id === id);

    if (!grupo) {
      throw new Error('Grupo não encontrado.');
    }

    return grupo;
  }

  return api.get<Grupo>(`/grupos/${id}`);
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
