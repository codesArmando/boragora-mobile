import type { Grupo } from '@/types/grupo';

export const gruposMock: Grupo[] = [
  {
    id: 1,
    nome: 'Manhã',
    periodo: 'MANHA',
    horarioSaidaIda: '07:00',
    horarioSaidaVolta: '12:00',
    totalTurmas: 1,
    minhaTurma: {
      id: 1,
      nome: 'Van 1',
    },
  },
  {
    id: 2,
    nome: 'Noite',
    periodo: 'NOITE',
    horarioSaidaIda: '18:10',
    horarioSaidaVolta: '22:30',
    totalTurmas: 2,
    minhaTurma: null,
  },
];
