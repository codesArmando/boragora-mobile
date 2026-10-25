import { api } from '@/api/api';
import { gruposMock } from '@/repositories/mocks/grupos';
import type { Grupo } from '@/types/grupo';

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
