import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { cores } from '@/theme/cores';

export function Carregando() {
  return (
    <View style={estilos.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={cores.destaque} />
    </View>
  );
}

const estilos = StyleSheet.create({ container: { padding: 32, alignItems: 'center' } });
