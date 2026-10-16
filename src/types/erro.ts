// Formato padrão de erro da API (plano do backend, seção 2.3).
// `campos` só vem preenchido nos erros 400 `VALIDACAO`, com a mensagem de cada campo.
export interface ErroResposta {
  codigo: string;
  mensagem: string;
  campos: Record<string, string> | null;
}

// Códigos criados pelo app, para falhas que não chegam no formato padrão.
export type CodigoErroApp = 'SEM_CONEXAO' | 'RESPOSTA_INESPERADA';
