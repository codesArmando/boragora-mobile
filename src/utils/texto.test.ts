import { iniciais, paraNumeroOuNulo } from './texto';

describe('iniciais', () => {
  it('usa o primeiro e o último nome', () => {
    expect(iniciais('Carlos Menezes')).toBe('CM');
    expect(iniciais('Pedro Henrique Dias')).toBe('PD');
    expect(iniciais('Motorista-chefe')).toBe('M');
  });

  it('tolera espaços e texto vazio', () => {
    expect(iniciais('  vanderlei   dias ')).toBe('VD');
    expect(iniciais('')).toBe('?');
  });
});

describe('paraNumeroOuNulo', () => {
  it('vazio vira nulo', () => {
    expect(paraNumeroOuNulo('')).toBeNull();
    expect(paraNumeroOuNulo('  ')).toBeNull();
  });

  it('aceita inteiros positivos', () => {
    expect(paraNumeroOuNulo('2')).toBe(2);
    expect(paraNumeroOuNulo(' 15 ')).toBe(15);
  });

  it('recusa o que não é inteiro positivo', () => {
    expect(paraNumeroOuNulo('0')).toBeUndefined();
    expect(paraNumeroOuNulo('-3')).toBeUndefined();
    expect(paraNumeroOuNulo('2,5')).toBeUndefined();
    expect(paraNumeroOuNulo('abc')).toBeUndefined();
  });
});
