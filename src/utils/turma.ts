import type { Turma } from '@/types/turma';
import { paraNumeroOuNulo } from '@/utils/texto';

export const NOME_TURMA_MAXIMO = 60;

export type ErrosDadosTurma = Partial<Record<'nome' | 'numeroVan' | 'capacidade', string>>;

export type DadosTurma = {
  nome: string;
  numeroVan: number | null;
  capacidade: number | null;
};

// Confere o que dá para ver na tela (D4 e D5a): nome de 1 a 60 caracteres e números inteiros
// positivos ou vazios. O backend revalida.
export function validarDadosTurma(
  nome: string,
  numeroVan: string,
  capacidade: string,
): { erros: ErrosDadosTurma; dados: DadosTurma | null } {
  const erros: ErrosDadosTurma = {};
  const nomeLimpo = nome.trim();
  if (nomeLimpo === '') {
    erros.nome = 'Informe o nome da turma.';
  } else if (nomeLimpo.length > NOME_TURMA_MAXIMO) {
    erros.nome = `O nome pode ter no máximo ${NOME_TURMA_MAXIMO} caracteres.`;
  }

  const van = paraNumeroOuNulo(numeroVan);
  if (van === undefined) {
    erros.numeroVan = 'Use um número inteiro maior que zero.';
  }
  const lugares = paraNumeroOuNulo(capacidade);
  if (lugares === undefined) {
    erros.capacidade = 'Use um número inteiro maior que zero.';
  }

  if (Object.keys(erros).length > 0 || van === undefined || lugares === undefined) {
    return { erros, dados: null };
  }
  return { erros, dados: { nome: nomeLimpo, numeroVan: van, capacidade: lugares } };
}

// "Van nº 2 · 15 lugares" (D5). Os dois campos são opcionais.
export function resumoDadosDaTurma(turma: Pick<Turma, 'numeroVan' | 'capacidade'>): string {
  const partes: string[] = [];
  if (turma.numeroVan !== null) {
    partes.push(`Van nº ${turma.numeroVan}`);
  }
  if (turma.capacidade !== null) {
    partes.push(turma.capacidade === 1 ? '1 lugar' : `${turma.capacidade} lugares`);
  }
  return partes.length > 0 ? partes.join(' · ') : 'Sem número da van nem capacidade';
}

// Título das telas da turma: "Van 2 · Noite" (convenção 5: nunca "Van " + número montado).
export function tituloDaTurma(turma: Pick<Turma, 'nome' | 'grupo'>): string {
  return `${turma.nome} · ${turma.grupo.nome}`;
}
