import { registrarTokenPush, removerTokenPush } from '@/repositories/pushRepository';

import { obterTokenPush } from './push';

// Ao sair, a remoção do token não pode segurar o usuário: sem conexão, a sessão é
// apagada depois deste tempo e o token fica no servidor (NOT-02).
const ESPERA_REMOCAO_MS = 3_000;

// Depois do login, do cadastro ou da sessão restaurada: grava no backend o token deste
// aparelho. Sem push (permissão negada, Expo Go) ou com falha, o app segue sem erro.
export async function registrarAparelho() {
  const token = await obterTokenPush();
  if (token === null) {
    return;
  }
  try {
    await registrarTokenPush({ token });
  } catch (erro) {
    console.warn('Push: não foi possível gravar o token no servidor.', erro);
  }
}

// Antes de apagar a sessão ao sair: o aparelho deixa de receber as notificações da conta.
export async function removerAparelho() {
  const espera = new Promise<void>((resolve) => setTimeout(resolve, ESPERA_REMOCAO_MS));
  const remocao = removerTokenPush().catch((erro: unknown) => {
    console.warn('Push: não foi possível remover o token do servidor.', erro);
  });
  await Promise.race([remocao, espera]);
}
