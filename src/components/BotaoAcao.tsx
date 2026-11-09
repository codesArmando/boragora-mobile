import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Props = {
  rotulo: string;
  onPress: () => void;
  icone?: ComponentProps<typeof Feather>['name'];
};

// Botão amarelo em forma de pílula, como "Novo grupo" (D8) e "Vincular" (D5).
export function BotaoAcao({ rotulo, onPress, icone }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
    >
      {icone && <Feather name={icone} size={20} color={cores.textoSobreDestaque} />}
      <Text style={estilos.texto}>{rotulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: medidas.areaToqueMinima,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: cores.destaque,
  },
  pressionado: {
    opacity: 0.8,
  },
  texto: {
    color: cores.textoSobreDestaque,
    fontSize: 16,
    fontWeight: '700',
  },
});
