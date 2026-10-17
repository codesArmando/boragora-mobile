import { api } from '@/api/api';
import type { CadastroRequisicao, LoginRequisicao, TokenResposta } from '@/types/auth';
import type { Usuario } from '@/types/usuario';

export function entrar(requisicao: LoginRequisicao) {
  return api.post<TokenResposta>('/auth/login', requisicao);
}

export function cadastrar(requisicao: CadastroRequisicao) {
  return api.post<TokenResposta>('/auth/cadastro', requisicao);
}

export function buscarUsuarioLogado() {
  return api.get<Usuario>('/me');
}
