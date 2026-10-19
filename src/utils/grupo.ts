import type { Grupo } from '@/types/grupo';

export function rotuloTurmas(total: number): string {
  return total === 1 ? '1 turma' : `${total} turmas`;
}

// Linha de resumo do grupo na D8: "Ida 06:20 · Volta 12:10 · 2 turmas".
export function resumoDoGrupo(grupo: Grupo): string {
  return `Ida ${grupo.horarioSaidaIda} · Volta ${grupo.horarioSaidaVolta} · ${rotuloTurmas(grupo.totalTurmas)}`;
}
