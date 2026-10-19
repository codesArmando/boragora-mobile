import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { cores } from '@/theme/cores';

// Estado "carregando" das telas que buscam dados (convenção 3 do plano).
export function Carregando() {
  return (
    <View accessibilityLabel="Carregando" accessibilityRole="progressbar" style={estilos.caixa}>
      <ActivityIndicator color={cores.destaque} size="large" />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
