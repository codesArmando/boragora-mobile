import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { cores } from '@/theme/cores';

// Barra de abas do protótipo (C0, D1 e Tela inicial do aluno), igual para o aluno,
// o motorista e o chefe.
export const opcoesAbas = {
  headerShown: false,
  tabBarStyle: { backgroundColor: cores.fundo, borderTopColor: cores.borda, paddingTop: 8 },
  tabBarActiveTintColor: cores.destaque,
  tabBarInactiveTintColor: cores.textoApagado,
  tabBarLabelStyle: { fontSize: 12, fontWeight: '600' as const },
};

type NomeIcone = ComponentProps<typeof Feather>['name'];
type CorIcone = ComponentProps<typeof Feather>['color'];

export function iconeAba(nome: NomeIcone) {
  // No RN 0.88, `ColorValue` também inclui `null` e número, que o tipo do ícone não aceita.
  // A barra de abas sempre passa a cor de `tabBarActiveTintColor`/`InactiveTintColor` (texto).
  return function IconeAba({ color }: { color: ColorValue }) {
    return <Feather name={nome} size={24} color={(color ?? undefined) as CorIcone} />;
  };
}
