import type { DadosDoPush } from '@/types/push';
import type { Usuario } from '@/types/usuario';

// Lê o campo `data` da notificação. O `turmaId` chega como número, mas aceita texto
// numérico, caso algum caminho do push converta os valores.
export function lerDadosDoPush(data: unknown): DadosDoPush | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  const { tipo, turmaId } = data as Record<string, unknown>;
  const id = typeof turmaId === 'string' ? Number(turmaId) : turmaId;
  if (
    (tipo !== 'LEMBRETE' && tipo !== 'CANCELAMENTO_TARDIO') ||
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }
  return { tipo, turmaId: id };
}

export function telaInicialDoPapel(usuario: Usuario) {
  return usuario.papel === 'ALUNO' ? '/aluno/hoje' : '/motorista/hoje';
}

// Destino do toque na notificação (tabela da seção 5.6 do plano):
// - LEMBRETE → B1 da turma, para o aluno;
// - CANCELAMENTO_TARDIO → C1 da turma (trecho Ida), para o motorista e o chefe;
// - sem `data`, tipo desconhecido ou de outro papel → tela inicial do papel.
// Sem sessão não há destino: as guardas levam à A1, e depois do login o índice abre a
// tela inicial do papel.
export function destinoDoToque(data: unknown, usuario: Usuario | null): string | null {
  if (usuario === null) {
    return null;
  }
  const dados = lerDadosDoPush(data);
  if (dados?.tipo === 'LEMBRETE' && usuario.papel === 'ALUNO') {
    return `/aluno/hoje/${dados.turmaId}`;
  }
  if (dados?.tipo === 'CANCELAMENTO_TARDIO' && usuario.papel === 'MOTORISTA') {
    return `/motorista/hoje/${dados.turmaId}`;
  }
  return telaInicialDoPapel(usuario);
}
