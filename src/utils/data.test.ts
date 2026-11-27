import { dataDaApiPorExtenso, dataPorExtenso, primeiroNome } from '@/utils/data';

describe('dataPorExtenso', () => {
  it('monta dia da semana, dia e mês', () => {
    expect(dataPorExtenso(new Date(2026, 9, 5))).toBe('Segunda, 5 de outubro');
    expect(dataPorExtenso(new Date(2026, 10, 26))).toBe('Quinta, 26 de novembro');
  });

  it('lê a data da API sem mudar o dia', () => {
    expect(dataDaApiPorExtenso('2026-10-05')).toBe('Segunda, 5 de outubro');
  });
});

describe('primeiroNome', () => {
  it('pega a primeira palavra', () => {
    expect(primeiroNome('Vanderlei Dias')).toBe('Vanderlei');
    expect(primeiroNome('  João Gabriel ')).toBe('João');
    expect(primeiroNome('Motorista-chefe')).toBe('Motorista-chefe');
    expect(primeiroNome(undefined)).toBe('');
  });
});
