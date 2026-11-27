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
  { alunoId: 1, nome: 'João Gabriel', situacao: 'CANCELADO_APOS_SAIDA', voce: false },
  { alunoId: 2, nome: 'Mariana Alves', situacao: 'CONFIRMADO', voce: false },
  { alunoId: 3, nome: 'Lucas Pereira', situacao: 'CONFIRMADO', voce: false },
  { alunoId: 4, nome: 'Beatriz Souza', situacao: 'CONFIRMADO', voce: false },
  { alunoId: 5, nome: 'Rafael Lima', situacao: 'CONFIRMADO', voce: false },
  { alunoId: 6, nome: 'Camila Rocha', situacao: 'CONFIRMADO', voce: false },
];

const listaVoltaMock: TurmaListaHoje['listaVolta'] = [
  { alunoId: 1, nome: 'Mariana Alves', statusVolta: 'LIBERADO', voce: false },
  { alunoId: 2, nome: 'Rafael Lima', statusVolta: 'LIBERADO', voce: false },
  { alunoId: 3, nome: 'João Gabriel', statusVolta: 'EM_AULA', voce: false },
  { alunoId: 4, nome: 'Lucas Pereira', statusVolta: 'EM_AULA', voce: false },
  { alunoId: 5, nome: 'Beatriz Souza', statusVolta: 'EM_AULA', voce: false },
  { alunoId: 6, nome: 'Camila Rocha', statusVolta: 'EM_AULA', voce: false },
  { alunoId: 7, nome: 'Larissa Costa', statusVolta: 'EM_AULA', voce: false },
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
        motorista: { id: 1, nome: 'Vanderlei Dias' },
        contadores: { vaoNaIda: 0, voltam: 0, liberados: 0, canceladosAposSaida: 0 },
        listaIda: [],
        listaVolta: [],
      },
      {
        id: 3,
        nome: 'Van 1',
        minhaTurma: false,
        motorista: { id: 2, nome: 'Carlos Menezes' },
        contadores: { vaoNaIda: 4, voltam: 5, liberados: 1, canceladosAposSaida: 0 },
        listaIda: [
          { alunoId: 15, nome: 'Ana Clara Ribeiro', situacao: 'CONFIRMADO', voce: false },
          { alunoId: 16, nome: 'Gustavo Nunes', situacao: 'CONFIRMADO', voce: false },
          { alunoId: 17, nome: 'Isabela Reis', situacao: 'CONFIRMADO', voce: false },
        ],
        listaVolta: [
          { alunoId: 15, nome: 'Ana Clara Ribeiro', statusVolta: 'LIBERADO', voce: false },
          { alunoId: 16, nome: 'Gustavo Nunes', statusVolta: 'EM_AULA', voce: false },
          { alunoId: 17, nome: 'Isabela Reis', statusVolta: 'EM_AULA', voce: false },
        ],
      },
    ],
  },
  {
    id: 2,
    nome: 'Noite',
    periodo: 'NOITE',
    horarioSaidaIda: '18:10',
    horarioSaidaVolta: '22:30',
    minhaTurma: { id: 2, nome: 'Van 2' },
    turmas: [
      {
        id: 2,
        nome: 'Van 2',
        minhaTurma: true,
        motorista: { id: 1, nome: 'Vanderlei Dias' },
        contadores: { vaoNaIda: 5, voltam: 7, liberados: 2, canceladosAposSaida: 1 },
        listaIda: listaIdaMock,
        listaVolta: listaVoltaMock,
      },
      {
        id: 4,
        nome: 'Van 1',
        minhaTurma: false,
        motorista: { id: 2, nome: 'Carlos Menezes' },
        contadores: { vaoNaIda: 3, voltam: 4, liberados: 0, canceladosAposSaida: 0 },
        listaIda: [
          { alunoId: 18, nome: 'Camila Rocha', situacao: 'CONFIRMADO', voce: false },
          { alunoId: 19, nome: 'Pedro Henrique Dias', situacao: 'CONFIRMADO', voce: false },
        ],
        listaVolta: [
          { alunoId: 18, nome: 'Camila Rocha', statusVolta: 'EM_AULA', voce: false },
          { alunoId: 19, nome: 'Pedro Henrique Dias', statusVolta: 'EM_AULA', voce: false },
        ],
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
    { id: 8, nome: 'Beatriz Souza' },
    { id: 9, nome: 'Camila Rocha' },
    { id: 7, nome: 'João Gabriel' },
    { id: 10, nome: 'Larissa Costa' },
    { id: 11, nome: 'Lucas Pereira' },
    { id: 12, nome: 'Mariana Alves' },
    { id: 13, nome: 'Pedro Henrique Dias' },
    { id: 14, nome: 'Rafael Lima' },
  ],
};
