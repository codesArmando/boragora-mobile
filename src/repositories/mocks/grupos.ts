import type { Grupo } from '@/types/grupo';

export const gruposMock: Grupo[] = [
  {
    id: 1,
    nome: 'Manhã',
    periodo: 'MANHA',
    horarioSaidaIda: '06:20',
    horarioSaidaVolta: '12:10',
    totalTurmas: 2,
    minhaTurma: { id: 4, nome: 'Van 2' },
  },
  {
    id: 2,
    nome: 'Noite',
    periodo: 'NOITE',
    horarioSaidaIda: '18:10',
    horarioSaidaVolta: '22:30',
    totalTurmas: 2,
    minhaTurma: { id: 2, nome: 'Van 2' },
  },
];
