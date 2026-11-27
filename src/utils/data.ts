// Textos de data e saudação dos cabeçalhos (C0, C0b, C1, B1, tela inicial do aluno).
// Só exibição: nenhuma regra de horário depende disto (as regras vêm do bloco `acoes` da API).

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** "Segunda, 5 de outubro". */
export function dataPorExtenso(data: Date = new Date()): string {
  return `${DIAS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

/** Data `yyyy-MM-dd` da API ("2026-10-05") por extenso, sem depender do fuso do aparelho. */
export function dataDaApiPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return dataPorExtenso(new Date(ano, mes - 1, dia));
}

/** Primeiro nome para a saudação: "Vanderlei Dias" → "Vanderlei". */
export function primeiroNome(nome: string | undefined | null): string {
  return nome?.trim().split(/\s+/)[0] ?? '';
}
