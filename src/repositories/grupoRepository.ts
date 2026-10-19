import { api } from '@/api/api';
import type { Grupo, GrupoRequisicao } from '@/types/grupo';

// Grupos do backend (etapa 3). Para o chefe, `listarGrupos` devolve todos.
export function listarGrupos() {
  return api.get<Grupo[]>('/grupos');
}

export function buscarGrupo(id: number) {
  return api.get<Grupo>(`/grupos/${id}`);
}

export function criarGrupo(requisicao: GrupoRequisicao) {
  return api.post<Grupo>('/admin/grupos', requisicao);
}

export function atualizarGrupo(id: number, requisicao: GrupoRequisicao) {
  return api.put<Grupo>(`/admin/grupos/${id}`, requisicao);
}

export function excluirGrupo(id: number) {
  return api.del(`/admin/grupos/${id}`);
}
