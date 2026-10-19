import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { cores } from '@/theme/cores';

type Props = {
  /** Mensagem do backend (`ErroApi.mensagem`) ou "Sem conexão com o servidor.". */
  mensagem: string;
  onTentarDeNovo: () => void;
};

// Estado "erro" das telas que buscam dados, com "Tentar de novo" (convenção 3 do plano).
export function EstadoErro({ mensagem, onTentarDeNovo }: Props) {
  return (
    <View style={estilos.caixa}>
      <Text accessibilityRole="alert" style={estilos.mensagem}>
        {mensagem}
      </Text>
      <Botao rotulo="Tentar de novo" variante="contorno" onPress={onTentarDeNovo} />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: 16,
    textAlign: 'center',
  },
});
