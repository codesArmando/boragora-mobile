// Iniciais para o círculo de pessoa (D9): primeira letra do primeiro e do último nome.
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) {
    return '?';
  }
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// Campo numérico opcional dos formulários (número da van, capacidade): vazio vira nulo.
// Devolve `undefined` quando o texto não é um número inteiro positivo.
export function paraNumeroOuNulo(texto: string): number | null | undefined {
  const limpo = texto.trim();
  if (limpo === '') {
    return null;
  }
  if (!/^\d+$/.test(limpo)) {
    return undefined;
  }
  const numero = Number(limpo);
  return numero > 0 ? numero : undefined;
}
