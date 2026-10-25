import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export function Cartao({ children, estilo }: { children: ReactNode; estilo?: object }) {
  return <View style={[estilos.cartao, estilo]}>{children}</View>;
}

const estilos = StyleSheet.create({
  cartao: {
    padding: 18,
    gap: 14,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: medidas.raioCartao,
  },
});
