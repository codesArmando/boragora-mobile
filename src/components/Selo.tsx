import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';

type Props = {
  rotulo: string;
  /** destaque: amarelo ("Você", "Sua turma"). neutro: cinza ("Vinculado"). contorno: "Sem turma". */
  tom?: 'destaque' | 'neutro' | 'contorno';
};

export function Selo({ rotulo, tom = 'destaque' }: Props) {
  return (
    <View style={[estilos.selo, estilos[tom]]}>
      <Text
        style={[estilos.texto, tom === 'destaque' ? estilos.textoEscuro : estilos[`texto_${tom}`]]}
      >
        {rotulo}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  destaque: { backgroundColor: cores.destaque },
  neutro: { backgroundColor: cores.borda },
  contorno: { borderWidth: 1, borderColor: cores.bordaBotaoSecundario },
  texto: { fontSize: 14, fontWeight: '700' },
  textoEscuro: { color: cores.textoSobreDestaque },
  texto_neutro: { color: cores.texto },
  texto_contorno: { color: cores.textoSecundario },
});
