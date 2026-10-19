import { ErroApi } from '@/api/ErroApi';
import type { AlunoAdmin } from '@/types/aluno';
import type { Motorista } from '@/types/motorista';
import type { Turma, TurmaGrupo } from '@/types/turma';

// Dados falsos da gestão (E4 e E5), no cenário do protótipo (seção 4.2 do plano). Ficam em
// memória: o que a tela cria ou altera aparece nas outras telas até o app ser fechado.

const manha: TurmaGrupo = {
  id: 1,
  nome: 'Manhã',
  periodo: 'MANHA',
  horarioSaidaIda: '06:20',
  horarioSaidaVolta: '12:10',
};
const noite: TurmaGrupo = {
  id: 2,
  nome: 'Noite',
  periodo: 'NOITE',
  horarioSaidaIda: '18:10',
  horarioSaidaVolta: '22:30',
};

export const motoristas: Motorista[] = [
  { id: 1, nome: 'Motorista-chefe', email: 'admin@boragora.local' },
  { id: 2, nome: 'Carlos Menezes', email: 'carlos.menezes@email.com' },
  { id: 3, nome: 'Vanderlei Dias', email: 'vanderlei.dias@email.com' },
];

export const turmas: Turma[] = [
  {
    id: 1,
    nome: 'Van 1',
    numeroVan: 1,
    capacidade: 15,
    grupo: manha,
    motorista: { id: 2, nome: 'Carlos Menezes' },
    alunos: [{ id: 7, nome: 'João Gabriel' }],
  },
  {
    id: 2,
    nome: 'Van 2',
    numeroVan: 2,
    capacidade: 15,
    grupo: noite,
    motorista: { id: 3, nome: 'Vanderlei Dias' },
    alunos: [
      { id: 8, nome: 'Beatriz Souza' },
      { id: 9, nome: 'Camila Rocha' },
      { id: 7, nome: 'João Gabriel' },
      { id: 10, nome: 'Larissa Costa' },
      { id: 11, nome: 'Lucas Pereira' },
      { id: 12, nome: 'Mariana Alves' },
      { id: 13, nome: 'Pedro Henrique Dias' },
      { id: 14, nome: 'Rafael Lima' },
    ],
  },
  // Gustavo e Isabela estão na Van 1 da Noite: na D6 da Van 2 aparecem como conflito (RN08).
  {
    id: 3,
    nome: 'Van 1',
    numeroVan: 1,
    capacidade: 12,
    grupo: noite,
    motorista: { id: 2, nome: 'Carlos Menezes' },
    alunos: [
      { id: 5, nome: 'Gustavo Nunes' },
      { id: 6, nome: 'Isabela Reis' },
    ],
  },
  // Helena está na Van 2 da Manhã: na D6 da Van 2 da Noite aparece como disponível.
  {
    id: 4,
    nome: 'Van 2',
    numeroVan: 2,
    capacidade: 12,
    grupo: manha,
    motorista: { id: 3, nome: 'Vanderlei Dias' },
    alunos: [{ id: 4, nome: 'Helena Castro' }],
  },
];

// Contas de aluno. Os vínculos de cada uma saem de `turmas`.
export const alunos: Pick<AlunoAdmin, 'id' | 'nome' | 'email'>[] = [
  { id: 1, nome: 'Ana Beatriz Moura', email: 'ana.moura@email.com' },
  { id: 2, nome: 'Diego Farias', email: 'diego.farias@email.com' },
  { id: 3, nome: 'Vitor Sampaio', email: 'vitor.sampaio@email.com' },
  { id: 4, nome: 'Helena Castro', email: 'helena.castro@email.com' },
  { id: 5, nome: 'Gustavo Nunes', email: 'gustavo.nunes@email.com' },
  { id: 6, nome: 'Isabela Reis', email: 'isabela.reis@email.com' },
  { id: 7, nome: 'João Gabriel', email: 'joao.gabriel@email.com' },
  { id: 8, nome: 'Beatriz Souza', email: 'beatriz.souza@email.com' },
  { id: 9, nome: 'Camila Rocha', email: 'camila.rocha@email.com' },
  { id: 10, nome: 'Larissa Costa', email: 'larissa.costa@email.com' },
  { id: 11, nome: 'Lucas Pereira', email: 'lucas.pereira@email.com' },
  { id: 12, nome: 'Mariana Alves', email: 'mariana.alves@email.com' },
  { id: 13, nome: 'Pedro Henrique Dias', email: 'pedro.dias@email.com' },
  { id: 14, nome: 'Rafael Lima', email: 'rafael.lima@email.com' },
];

let proximoMotorista = 4;
let proximaTurma = 5;

export function atraso<T>(valor: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(valor)), 250));
}

export function turmaPorId(id: number): Turma {
  const turma = turmas.find((t) => t.id === id);
  if (turma === undefined) {
    throw new ErroApi(404, 'NAO_ENCONTRADO', 'Turma não encontrada.');
  }
  return turma;
}

export function novoIdMotorista() {
  return proximoMotorista++;
}

export function novoIdTurma() {
  return proximaTurma++;
}

// RN08: um motorista não conduz duas turmas do mesmo grupo.
export function conferirConflitoDeMotorista(
  grupoId: number,
  motoristaId: number,
  ignorarTurmaId?: number,
) {
  const conflito = turmas.find(
    (t) => t.id !== ignorarTurmaId && t.grupo.id === grupoId && t.motorista.id === motoristaId,
  );
  if (conflito !== undefined) {
    throw new ErroApi(
      409,
      'CONFLITO_GRUPO_MOTORISTA',
      `Este motorista já conduz a ${conflito.nome} neste grupo.`,
    );
  }
}

export function turmasDoAluno(alunoId: number): Turma[] {
  return turmas.filter((t) => t.alunos.some((a) => a.id === alunoId));
}
