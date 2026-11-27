import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// Seta de voltar das telas empilhadas (toda tela que não é a inicial de uma aba).
// Sem `onPress`, volta uma tela na pilha.
export function BotaoVoltar({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={8}
      onPress={onPress ?? (() => router.back())}
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
    >
      <Feather name="arrow-left" size={26} color={cores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.6 },
});
