import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

export function CartaoAtalho({
  titulo,
  detalhe,
  icone,
  onPress,
}: {
  titulo: string;
  detalhe: string;
  /** Ícone de linha do Feather, como no protótipo (clock, truck, user-check, users). */
  icone: ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={estilos.cartao}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${detalhe}`}
    >
      <View style={estilos.icone}>
        <Feather name={icone} size={24} color={cores.destaque} />
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.detalhe}>{detalhe}</Text>
      </View>
      <Feather name="chevron-right" size={22} color={cores.textoApagado} />
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
    borderWidth: 1,
    borderColor: cores.borda,
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
  textos: { flex: 1, gap: 3 },
  titulo: { color: cores.texto, fontFamily: tipografia.numero, fontSize: 20 },
  detalhe: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 15 },
});
