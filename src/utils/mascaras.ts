// Máscara de horário `HH:mm` (decisão 12 do plano). Só deixa passar dígitos que mantêm
// o horário possível de ser válido: 00:00 a 23:59.

function digitoValido(digitos: string, posicao: number, digito: number): boolean {
  switch (posicao) {
    case 0:
      return digito <= 2;
    case 1:
      return digitos[0] === '2' ? digito <= 3 : true;
    case 2:
      return digito <= 5;
    default:
      return true;
  }
}

export function mascararHora(texto: string): string {
  let digitos = '';
  for (const caractere of texto) {
    if (caractere < '0' || caractere > '9') {
      continue;
    }
    // Para no primeiro dígito inválido: um texto colado não vira outro horário.
    if (digitos.length === 4 || !digitoValido(digitos, digitos.length, Number(caractere))) {
      break;
    }
    digitos += caractere;
  }
  // Os dois pontos só aparecem depois do terceiro dígito, para o apagar funcionar.
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
}

export function horaCompleta(texto: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(texto);
}
