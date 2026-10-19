import { resumoDadosDaTurma, tituloDaTurma, validarDadosTurma } from './turma';

describe('validarDadosTurma', () => {
  it('aceita nome e campos numéricos vazios', () => {
    const { erros, dados } = validarDadosTurma('  Van 2 ', '', '');
    expect(erros).toEqual({});
    expect(dados).toEqual({ nome: 'Van 2', numeroVan: null, capacidade: null });
  });

  it('converte número da van e capacidade', () => {
    const { dados } = validarDadosTurma('Van 2', '2', '15');
    expect(dados).toEqual({ nome: 'Van 2', numeroVan: 2, capacidade: 15 });
  });

  it('barra nome em branco', () => {
    const { erros, dados } = validarDadosTurma('   ', '', '');
    expect(erros.nome).toBeDefined();
    expect(dados).toBeNull();
  });

  it('barra nome com mais de 60 caracteres', () => {
    expect(validarDadosTurma('a'.repeat(60), '', '').dados).not.toBeNull();
    expect(validarDadosTurma('a'.repeat(61), '', '').erros.nome).toBeDefined();
  });

  it('barra número da van e capacidade inválidos', () => {
    const { erros, dados } = validarDadosTurma('Van', '0', 'x');
    expect(erros.numeroVan).toBeDefined();
    expect(erros.capacidade).toBeDefined();
    expect(dados).toBeNull();
  });
});

describe('resumoDadosDaTurma', () => {
  it('monta o texto da D5', () => {
    expect(resumoDadosDaTurma({ numeroVan: 2, capacidade: 15 })).toBe('Van nº 2 · 15 lugares');
    expect(resumoDadosDaTurma({ numeroVan: 2, capacidade: null })).toBe('Van nº 2');
    expect(resumoDadosDaTurma({ numeroVan: null, capacidade: 1 })).toBe('1 lugar');
    expect(resumoDadosDaTurma({ numeroVan: null, capacidade: null })).toBe(
      'Sem número da van nem capacidade',
    );
  });
});

describe('tituloDaTurma', () => {
  it('junta turma e grupo', () => {
    const grupo = { id: 2, nome: 'Noite', periodo: 'NOITE' as const };
    expect(
      tituloDaTurma({
        nome: 'Van 2',
        grupo: { ...grupo, horarioSaidaIda: '18:10', horarioSaidaVolta: '22:30' },
      }),
    ).toBe('Van 2 · Noite');
  });
});
