import type { Usuario } from './usuario';

// Corpo de `POST /auth/login`.
export interface LoginRequisicao {
  email: string;
  senha: string;
}

// Corpo de `POST /auth/cadastro`. O cadastro público sempre cria um aluno.
export interface CadastroRequisicao {
  nome: string;
  email: string;
  senha: string;
}

// Resposta do login e do cadastro.
export interface TokenResposta {
  token: string;
  usuario: Usuario;
}
