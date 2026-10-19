import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Props = {
  icone: ComponentProps<typeof Feather>['name'];
  titulo: string;
  descricao: string;
  onPress: () => void;
};

// Cartão de atalho da tela de gestão (D1): ícone, título, descrição e seta.
export function CartaoAtalho({ icone, titulo, descricao, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${descricao}`}
      onPress={onPress}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View style={estilos.icone}>
        <Feather name={icone} size={24} color={cores.destaque} />
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.descricao}>{descricao}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={cores.textoApagado} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  pressionado: {
    opacity: 0.8,
  },
  icone: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: cores.superficieInterna,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
});
