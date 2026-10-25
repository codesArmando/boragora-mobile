import type { GrupoHoje, TurmaDetalhe, TurmaListaHoje, TurmaResumo } from '@/types/turma';

export const turmasHojeMock: TurmaResumo[] = [
  {
    id: 1,
    nome: 'Van 2',
    grupo: {
      id: 1,
      nome: 'Manhã',
      periodo: 'MANHA',
      horarioSaidaIda: '06:20',
      horarioSaidaVolta: '12:10',
    },
    motorista: { id: 1, nome: 'Vanderlei Dias' },
    contadores: { vaoNaIda: 0, voltam: 0, liberados: 0, canceladosAposSaida: 0 },
    semConfirmacoes: true,
  },
  {
    id: 2,
    nome: 'Van 2',
    grupo: {
      id: 2,
      nome: 'Noite',
      periodo: 'NOITE',
      horarioSaidaIda: '18:10',
      horarioSaidaVolta: '22:30',
    },
    motorista: { id: 1, nome: 'Vanderlei Dias' },
    contadores: { vaoNaIda: 5, voltam: 7, liberados: 2, canceladosAposSaida: 1 },
    semConfirmacoes: false,
  },
];

const listaIdaMock: TurmaListaHoje['listaIda'] = [
  { alunoId: 2, nome: 'Camila Rocha', situacao: 'CANCELADO_APOS_SAIDA', voce: false },
  { alunoId: 3, nome: 'João Gabriel', situacao: 'CONFIRMADO', voce: false },
  { alunoId: 1, nome: 'Beatriz Souza', situacao: 'CONFIRMADO', voce: false },
];

const listaVoltaMock: TurmaListaHoje['listaVolta'] = [
  { alunoId: 1, nome: 'Beatriz Souza', statusVolta: 'LIBERADO', voce: false },
  { alunoId: 3, nome: 'João Gabriel', statusVolta: 'EM_AULA', voce: false },
];

export const turmaListaHojeMock: TurmaListaHoje = {
  id: 2,
  nome: 'Van 2',
  grupo: { id: 2, nome: 'Noite', horarioSaidaIda: '18:10', horarioSaidaVolta: '22:30' },
  motorista: { id: 1, nome: 'Vanderlei Dias' },
  contadores: { vaoNaIda: 5, voltam: 7, liberados: 2, canceladosAposSaida: 1 },
  semConfirmacoes: false,
  listaIda: listaIdaMock,
  listaVolta: listaVoltaMock,
};

export const turmasGrupoHojeMock: GrupoHoje[] = [
  {
    id: 1,
    nome: 'Manhã',
    periodo: 'MANHA',
    horarioSaidaIda: '06:20',
    horarioSaidaVolta: '12:10',
    minhaTurma: { id: 1, nome: 'Van 2' },
    turmas: [
      {
        id: 1,
        nome: 'Van 2',
        minhaTurma: true,
        contadores: { vaoNaIda: 0, voltam: 0, liberados: 0, canceladosAposSaida: 0 },
        listaIda: [],
        listaVolta: [],
      },
      {
        id: 3,
        nome: 'Van 1',
        minhaTurma: false,
        contadores: { vaoNaIda: 4, voltam: 5, liberados: 1, canceladosAposSaida: 0 },
        listaIda: [],
        listaVolta: [],
      },
    ],
  },
  {
    id: 2,
    nome: 'Noite',
    periodo: 'NOITE',
    horarioSaidaIda: '18:10',
    horarioSaidaVolta: '22:30',
    minhaTurma: null,
    turmas: [
      {
        id: 2,
        nome: 'Van 2',
        minhaTurma: false,
        contadores: { vaoNaIda: 5, voltam: 7, liberados: 2, canceladosAposSaida: 1 },
        listaIda: listaIdaMock,
        listaVolta: listaVoltaMock,
      },
      {
        id: 4,
        nome: 'Van 1',
        minhaTurma: false,
        contadores: { vaoNaIda: 3, voltam: 4, liberados: 0, canceladosAposSaida: 0 },
        listaIda: [],
        listaVolta: [],
      },
    ],
  },
];

export const turmaDetalheMock: TurmaDetalhe = {
  id: 2,
  nome: 'Van 2',
  numeroVan: 2,
  capacidade: 15,
  grupo: { id: 2, nome: 'Noite', horarioSaidaIda: '18:10', horarioSaidaVolta: '22:30' },
  motorista: { id: 1, nome: 'Vanderlei Dias' },
  alunos: [
    { id: 1, nome: 'Beatriz Souza' },
    { id: 2, nome: 'Camila Rocha' },
    { id: 3, nome: 'João Gabriel' },
    { id: 4, nome: 'Larissa Costa' },
    { id: 5, nome: 'Lucas Pereira' },
    { id: 6, nome: 'Mariana Alves' },
    { id: 7, nome: 'Pedro Henrique Dias' },
    { id: 8, nome: 'Rafael Lima' },
  ],
};
