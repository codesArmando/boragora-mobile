import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';

export function EstadoVazio({ mensagem, children }: { mensagem: string; children?: ReactNode }) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.texto}>{mensagem}</Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { paddingVertical: 32, alignItems: 'center', gap: 16 },
  texto: { color: cores.textoSecundario, fontSize: 16, textAlign: 'center' },
});
