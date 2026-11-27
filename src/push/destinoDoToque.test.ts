import type { Usuario } from '@/types/usuario';

import { destinoDoToque, lerDadosDoPush } from './destinoDoToque';

const aluno: Usuario = { id: 1, nome: 'Ana', email: 'ana@x.com', papel: 'ALUNO', admin: false };
const motorista: Usuario = { ...aluno, id: 2, papel: 'MOTORISTA' };
const chefe: Usuario = { ...motorista, id: 3, admin: true };

describe('destinoDoToque', () => {
  it('lembrete abre a B1 da turma para o aluno', () => {
    expect(destinoDoToque({ tipo: 'LEMBRETE', turmaId: 7 }, aluno)).toBe('/aluno/hoje/7');
  });

  it('cancelamento tardio abre a C1 da turma para o motorista e para o chefe', () => {
    const data = { tipo: 'CANCELAMENTO_TARDIO', turmaId: 4 };
    expect(destinoDoToque(data, motorista)).toBe('/motorista/hoje/4');
    expect(destinoDoToque(data, chefe)).toBe('/motorista/hoje/4');
  });

  it('sem data ou com tipo desconhecido abre a tela inicial do papel', () => {
    expect(destinoDoToque(undefined, aluno)).toBe('/aluno/hoje');
    expect(destinoDoToque({}, motorista)).toBe('/motorista/hoje');
    expect(destinoDoToque({ tipo: 'OUTRO', turmaId: 1 }, aluno)).toBe('/aluno/hoje');
  });

  it('tipo de outro papel abre a tela inicial do papel', () => {
    expect(destinoDoToque({ tipo: 'LEMBRETE', turmaId: 7 }, motorista)).toBe('/motorista/hoje');
    expect(destinoDoToque({ tipo: 'CANCELAMENTO_TARDIO', turmaId: 7 }, aluno)).toBe('/aluno/hoje');
  });

  it('sem sessão não há destino', () => {
    expect(destinoDoToque({ tipo: 'LEMBRETE', turmaId: 7 }, null)).toBeNull();
  });
});

describe('lerDadosDoPush', () => {
  it('aceita turmaId em texto numérico', () => {
    expect(lerDadosDoPush({ tipo: 'LEMBRETE', turmaId: '12' })).toEqual({
      tipo: 'LEMBRETE',
      turmaId: 12,
    });
  });

  it('recusa turmaId ausente ou inválido', () => {
    expect(lerDadosDoPush({ tipo: 'LEMBRETE' })).toBeNull();
    expect(lerDadosDoPush({ tipo: 'LEMBRETE', turmaId: 'abc' })).toBeNull();
    expect(lerDadosDoPush({ tipo: 'LEMBRETE', turmaId: 0 })).toBeNull();
    expect(lerDadosDoPush(null)).toBeNull();
  });
});
