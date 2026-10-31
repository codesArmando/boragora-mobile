import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export function Tela({
  children,
  estilo,
  edges = ['top', 'left', 'right'],
}: {
  children: ReactNode;
  estilo?: ViewStyle;
  edges?: Edge[];
}) {
  return (
    <SafeAreaView edges={edges} style={estilos.areaSegura}>
      <View style={[estilos.conteudo, estilo]}>{children}</View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flex: 1, paddingHorizontal: medidas.margemTela, paddingTop: 12 },
});
