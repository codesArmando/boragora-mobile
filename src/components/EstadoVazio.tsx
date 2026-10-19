import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';

type Props = {
  titulo: string;
  texto?: string;
  /** Ação logo abaixo, como o botão "Novo grupo" da D8. */
  children?: ReactNode;
};

// Estado "vazio" das listas (convenção 3 do plano).
export function EstadoVazio({ titulo, texto, children }: Props) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {texto !== undefined && <Text style={estilos.texto}>{texto}</Text>}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  titulo: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: 16,
    textAlign: 'center',
  },
});
