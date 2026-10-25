import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErroApi } from '@/api/ErroApi';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export function EstadoErro({
  erro,
  tentarNovamente,
}: {
  erro: unknown;
  tentarNovamente: () => void;
}) {
  const mensagem = erro instanceof ErroApi ? erro.mensagem : 'Não foi possível carregar os dados.';
  return (
    <View style={estilos.container}>
      <Text style={estilos.mensagem}>{mensagem}</Text>
      <Pressable onPress={tentarNovamente} style={estilos.botao} accessibilityRole="button">
        <Text style={estilos.botaoTexto}>Tentar de novo</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { paddingVertical: 24, alignItems: 'center', gap: 12 },
  mensagem: { color: cores.perigo, fontSize: 16, textAlign: 'center' },
  botao: {
    minHeight: medidas.areaToqueMinima,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  botaoTexto: { color: cores.texto, fontWeight: '700' },
});
