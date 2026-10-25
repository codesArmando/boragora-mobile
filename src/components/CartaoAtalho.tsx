import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export function CartaoAtalho({
  titulo,
  detalhe,
  icone,
  onPress,
}: {
  titulo: string;
  detalhe: string;
  icone: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={estilos.cartao} accessibilityRole="button">
      <View style={estilos.icone}>
        <Text style={estilos.iconeTexto}>{icone}</Text>
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.detalhe}>{detalhe}</Text>
      </View>
      <Text style={estilos.seta}>›</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    minHeight: 88,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.superficie,
    borderRadius: medidas.raioCartao,
  },
  icone: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficieInterna,
    borderRadius: 14,
  },
  iconeTexto: { color: cores.destaque, fontSize: 22, fontWeight: '700' },
  textos: { flex: 1, gap: 3 },
  titulo: { color: cores.texto, fontSize: 18, fontWeight: '700' },
  detalhe: { color: cores.textoApagado, fontSize: 14 },
  seta: { color: cores.textoApagado, fontSize: 30 },
});
