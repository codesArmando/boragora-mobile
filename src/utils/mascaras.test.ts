import { horaCompleta, mascararHora } from './mascaras';

describe('mascararHora', () => {
  it('monta o horário enquanto digita', () => {
    expect(mascararHora('')).toBe('');
    expect(mascararHora('1')).toBe('1');
    expect(mascararHora('18')).toBe('18');
    expect(mascararHora('181')).toBe('18:1');
    expect(mascararHora('1810')).toBe('18:10');
  });

  it('aceita o texto já formatado', () => {
    expect(mascararHora('18:10')).toBe('18:10');
    expect(mascararHora('22:30')).toBe('22:30');
  });

  it('descarta o que não é dígito', () => {
    expect(mascararHora('1a8-1 0')).toBe('18:10');
    expect(mascararHora('abc')).toBe('');
  });

  it('não passa de quatro dígitos', () => {
    expect(mascararHora('123456')).toBe('12:34');
  });

  it('barra a primeira hora maior que 2', () => {
    expect(mascararHora('3')).toBe('');
    expect(mascararHora('9')).toBe('');
    expect(mascararHora('30')).toBe('');
  });

  it('barra hora acima de 23', () => {
    expect(mascararHora('24')).toBe('2');
    expect(mascararHora('29')).toBe('2');
    expect(mascararHora('23')).toBe('23');
  });

  it('barra minuto acima de 59', () => {
    expect(mascararHora('1860')).toBe('18');
    expect(mascararHora('1859')).toBe('18:59');
    expect(mascararHora('1870')).toBe('18');
  });

  it('só produz horários válidos quando completo', () => {
    for (const entrada of ['0000', '2359', '1210', '0905', '9999', '2460', '2575']) {
      const saida = mascararHora(entrada);
      if (saida.length === 5) {
        expect(horaCompleta(saida)).toBe(true);
      }
    }
  });
});

describe('horaCompleta', () => {
  it('aceita horários válidos', () => {
    expect(horaCompleta('00:00')).toBe(true);
    expect(horaCompleta('18:10')).toBe(true);
    expect(horaCompleta('23:59')).toBe(true);
  });

  it('recusa horários incompletos ou inválidos', () => {
    expect(horaCompleta('')).toBe(false);
    expect(horaCompleta('18')).toBe(false);
    expect(horaCompleta('18:1')).toBe(false);
    expect(horaCompleta('24:00')).toBe(false);
    expect(horaCompleta('18:60')).toBe(false);
    expect(horaCompleta('1810')).toBe(false);
  });
});
