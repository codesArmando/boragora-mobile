import type { PlanoDoDia } from '@/types/plano';

import { estadoDoPlano } from './estadoDoPlano';

type Campos = Pick<
  PlanoDoDia,
  'incluiIda' | 'incluiVolta' | 'cancelouAposSaida' | 'idaSaiu' | 'voltaSaiu'
>;

function plano(campos: Partial<Campos>): PlanoDoDia {
  return {
    data: '2026-10-05',
    turma: {
      id: 1,
      nome: 'Van 2',
      grupo: {
        id: 1,
        nome: 'Noite',
        periodo: 'NOITE',
        horarioSaidaIda: '18:10',
        horarioSaidaVolta: '22:30',
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
      podeCancelarIda: true,
      cancelamentoIdaSeraTardio: false,
      podeAlterarVolta: true,
      podeAlterarStatusVolta: true,
    },
    ...campos,
  };
}

// Tabela da seção 5.3 do plano: a primeira condição verdadeira vence.
describe('estadoDoPlano', () => {
  it('1. voltaSaiu → ENCERRADO (B7), mesmo com as outras condições verdadeiras', () => {
    expect(estadoDoPlano(plano({ voltaSaiu: true }))).toBe('ENCERRADO');
    expect(
      estadoDoPlano(
        plano({
          voltaSaiu: true,
          cancelouAposSaida: true,
          idaSaiu: true,
          incluiIda: true,
          incluiVolta: true,
        }),
      ),
    ).toBe('ENCERRADO');
  });

  it('2. cancelouAposSaida → IDA_CANCELADA (B5), antes da ida bloqueada', () => {
    expect(estadoDoPlano(plano({ cancelouAposSaida: true, idaSaiu: true, incluiIda: false }))).toBe(
      'IDA_CANCELADA',
    );
    expect(
      estadoDoPlano(plano({ cancelouAposSaida: true, idaSaiu: true, incluiVolta: true })),
    ).toBe('IDA_CANCELADA');
  });

  it('3. idaSaiu e incluiIda → APOS_SAIDA (B3)', () => {
    expect(estadoDoPlano(plano({ idaSaiu: true, incluiIda: true }))).toBe('APOS_SAIDA');
    expect(estadoDoPlano(plano({ idaSaiu: true, incluiIda: true, incluiVolta: true }))).toBe(
      'APOS_SAIDA',
    );
  });

  it('4. idaSaiu sem incluiIda → IDA_BLOQUEADA (B6), mesmo com a volta marcada', () => {
    expect(estadoDoPlano(plano({ idaSaiu: true }))).toBe('IDA_BLOQUEADA');
    expect(estadoDoPlano(plano({ idaSaiu: true, incluiVolta: true }))).toBe('IDA_BLOQUEADA');
  });

  it('5. incluiIda ou incluiVolta antes da saída → DECLARADO (B2)', () => {
    expect(estadoDoPlano(plano({ incluiIda: true }))).toBe('DECLARADO');
    expect(estadoDoPlano(plano({ incluiVolta: true }))).toBe('DECLARADO');
    expect(estadoDoPlano(plano({ incluiIda: true, incluiVolta: true }))).toBe('DECLARADO');
  });

  it('6. nenhuma das anteriores → SEM_PLANO (B1)', () => {
    expect(estadoDoPlano(plano({}))).toBe('SEM_PLANO');
  });
});
