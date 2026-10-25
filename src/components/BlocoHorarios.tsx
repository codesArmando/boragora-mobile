import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';

export function BlocoHorarios({
  horarioSaidaIda,
  horarioSaidaVolta,
}: {
  horarioSaidaIda: string;
  horarioSaidaVolta: string;
}) {
  return (
    <View style={estilos.container}>
      <View style={estilos.bloco}>
        <Text style={estilos.rotulo}>Saída da ida</Text>
        <Text style={estilos.horario}>{horarioSaidaIda}</Text>
      </View>
      <View style={estilos.bloco}>
        <Text style={estilos.rotulo}>Saída da volta</Text>
        <Text style={estilos.horario}>{horarioSaidaVolta}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8 },
  bloco: {
    flex: 1,
    padding: 12,
    gap: 2,
    backgroundColor: cores.superficieInterna,
    borderRadius: 12,
  },
  rotulo: { color: cores.textoSecundario, fontSize: 14 },
  horario: { color: cores.texto, fontSize: 23, fontWeight: '700' },
});
