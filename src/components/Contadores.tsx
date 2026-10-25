import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';

export function Contadores({
  vaoNaIda,
  voltam,
  liberados,
}: {
  vaoNaIda: number;
  voltam: number;
  liberados: number;
}) {
  return (
    <View style={estilos.container}>
      <Contador valor={vaoNaIda} rotulo="vão na ida" />
      <Contador valor={voltam} rotulo="voltam" />
      <Contador valor={liberados} rotulo="liberados" liberado />
    </View>
  );
}

function Contador({
  valor,
  rotulo,
  liberado = false,
}: {
  valor: number;
  rotulo: string;
  liberado?: boolean;
}) {
  return (
    <View style={[estilos.bloco, liberado && estilos.blocoLiberado]}>
      <Text style={[estilos.valor, liberado && estilos.valorLiberado]}>{valor}</Text>
      <Text style={estilos.rotulo}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8 },
  bloco: {
    flex: 1,
    minHeight: 76,
    padding: 10,
    gap: 2,
    backgroundColor: cores.superficieInterna,
    borderRadius: 12,
  },
  blocoLiberado: { backgroundColor: '#194509' },
  valor: { color: cores.texto, fontSize: 24, fontWeight: '700' },
  valorLiberado: { color: cores.liberadoFundo },
  rotulo: { color: cores.textoSecundario, fontSize: 13 },
});
