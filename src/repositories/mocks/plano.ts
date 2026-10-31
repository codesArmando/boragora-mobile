import type { PlanoDoDia, TurmaDoAluno } from '@/types/plano';

export const turmasDoAlunoMock: TurmaDoAluno[] = [
  {
    id: 1,
    nome: 'Van 1',
    motorista: { nome: 'Carlos Menezes' },
    grupo: {
      id: 1,
      nome: 'Manhã',
      periodo: 'MANHA',
      horarioSaidaIda: '06:20',
      horarioSaidaVolta: '12:10',
    },
    incluiIda: false,
    incluiVolta: false,
  },
  {
    id: 2,
    nome: 'Van 2',
    motorista: { nome: 'Vanderlei Dias' },
    grupo: {
      id: 2,
      nome: 'Noite',
      periodo: 'NOITE',
      horarioSaidaIda: '18:10',
      horarioSaidaVolta: '22:30',
    },
    incluiIda: false,
    incluiVolta: false,
  },
];

export const planosDoDiaMock: PlanoDoDia[] = [
  {
    data: '2026-10-31',
    turma: {
      id: 1,
      nome: 'Van 1',
      grupo: {
        id: 1,
        nome: 'Manhã',
        periodo: 'MANHA',
        horarioSaidaIda: '06:20',
        horarioSaidaVolta: '12:10',
      },
    },
    incluiIda: false,
    incluiVolta: false,
    statusVolta: 'EM_AULA',
    cancelouAposSaida: false,
    idaSaiu: false,
    voltaSaiu: false,
    acoes: {
      podeIncluirIda: true,
      podeCancelarIda: false,
      cancelamentoIdaSeraTardio: false,
      podeAlterarVolta: true,
      podeAlterarStatusVolta: false,
    },
  },
  {
    data: '2026-10-31',
    turma: {
      id: 2,
      nome: 'Van 2',
      grupo: {
        id: 2,
        nome: 'Noite',
        periodo: 'NOITE',
        horarioSaidaIda: '18:10',
        horarioSaidaVolta: '22:30',
      },
    },
    incluiIda: true,
    incluiVolta: true,
    statusVolta: 'EM_AULA',
    cancelouAposSaida: false,
    idaSaiu: false,
    voltaSaiu: false,
    acoes: {
      podeIncluirIda: false,
      podeCancelarIda: true,
      cancelamentoIdaSeraTardio: false,
      podeAlterarVolta: true,
      podeAlterarStatusVolta: true,
    },
  },
];
