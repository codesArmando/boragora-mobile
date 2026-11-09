import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Props = {
  titulo: string;
  texto?: string;
  /** neutro: cartão de informação (B6). alerta: fundo avermelhado (B5, erros de conflito). */
  tom?: 'neutro' | 'alerta';
  /** Ações abaixo do texto, como um `Botao`. */
  children?: ReactNode;
};

export function Aviso({ titulo, texto, tom = 'neutro', children }: Props) {
  return (
    <View
      accessibilityRole="alert"
      style={[estilos.caixa, tom === 'alerta' ? estilos.alerta : estilos.neutro]}
    >
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        {texto !== undefined && <Text style={estilos.texto}>{texto}</Text>}
      </View>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    padding: 16,
    gap: 12,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
  },
  neutro: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
  },
  alerta: {
    backgroundColor: cores.alertaFundo,
    borderColor: cores.perigo,
  },
  textos: {
    gap: 4,
  },
  titulo: {
    color: cores.texto,
    fontSize: 17,
    fontWeight: '700',
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
});
