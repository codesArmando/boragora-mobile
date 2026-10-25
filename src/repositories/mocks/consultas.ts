import type { AlunoAdmin, Motorista, TurmaCadastro } from '@/types/consulta';

export const motoristasMock: Motorista[] = [
  { id: 1, nome: 'Vanderlei Dias', email: 'vanderlei@boragora.local' },
  { id: 2, nome: 'Carlos Menezes', email: 'carlos@boragora.local' },
];

export const alunosMock: AlunoAdmin[] = [
  { id: 1, nome: 'João Gabriel', email: 'joao@boragora.local', turmas: [{ id: 2, nome: 'Van 2' }] },
  { id: 2, nome: 'Ana Beatriz Moura', email: 'ana@boragora.local', turmas: [] },
  { id: 3, nome: 'Diego Farias', email: 'diego@boragora.local', turmas: [] },
  { id: 4, nome: 'Vitor Sampaio', email: 'vitor@boragora.local', turmas: [] },
];

export const turmasCadastroMock: TurmaCadastro[] = [
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
    motorista: { id: 2, nome: 'Carlos Menezes' },
    totalAlunos: 8,
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
    totalAlunos: 8,
  },
];
