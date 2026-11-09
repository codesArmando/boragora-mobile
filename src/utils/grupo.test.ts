import type { Grupo } from '@/types/grupo';

import { resumoDoGrupo, rotuloTurmas } from './grupo';

const grupo: Grupo = {
  id: 1,
  nome: 'Manhã',
  periodo: 'MANHA',
  horarioSaidaIda: '06:20',
  horarioSaidaVolta: '12:10',
  totalTurmas: 2,
  minhaTurma: null,
};

describe('rotuloTurmas', () => {
  it('usa singular e plural', () => {
    expect(rotuloTurmas(0)).toBe('0 turmas');
    expect(rotuloTurmas(1)).toBe('1 turma');
    expect(rotuloTurmas(2)).toBe('2 turmas');
  });
});

describe('resumoDoGrupo', () => {
  it('monta a linha da D8', () => {
    expect(resumoDoGrupo(grupo)).toBe('Ida 06:20 · Volta 12:10 · 2 turmas');
    expect(resumoDoGrupo({ ...grupo, totalTurmas: 1 })).toBe('Ida 06:20 · Volta 12:10 · 1 turma');
  });
});
