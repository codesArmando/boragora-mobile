import type { CodigoErroApp } from '@/types/erro';

// Erro de toda chamada à API. A tela mostra `mensagem`, que vem do backend,
// e usa `campos` para marcar os campos de um formulário (convenção 4 do plano).
export class ErroApi extends Error {
  readonly status: number;
  readonly codigo: string;
  readonly mensagem: string;
  readonly campos: Record<string, string> | null;

  constructor(
    status: number,
    codigo: string,
    mensagem: string,
    campos: Record<string, string> | null = null,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.codigo = codigo;
    this.mensagem = mensagem;
    this.campos = campos;
  }

  // Sem rede, servidor fora do ar ou tempo limite esgotado (RNF06). `status` 0: não houve resposta.
  static semConexao() {
    return new ErroApi(0, 'SEM_CONEXAO' satisfies CodigoErroApp, 'Sem conexão com o servidor.');
  }

  // Resposta fora do formato padrão (por exemplo, uma página HTML de erro).
  static respostaInesperada(status: number) {
    return new ErroApi(
      status,
      'RESPOSTA_INESPERADA' satisfies CodigoErroApp,
      'O servidor respondeu de um jeito inesperado. Tente de novo.',
    );
  }
}
