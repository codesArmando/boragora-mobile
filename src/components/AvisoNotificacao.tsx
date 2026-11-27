import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

type Props = {
  titulo: string;
  texto: string;
  aoTocar: () => void;
  aoFechar: () => void;
};

// Aviso dentro do app quando uma notificação chega com o app aberto (E1, NOT-03).
// Mesmo visual do cartão da E1: ícone do app, título, texto e "agora".
export function AvisoNotificacao({ titulo, texto, aoTocar, aoFechar }: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[estilos.camada, { top: top + 8 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${titulo}. ${texto}`}
        accessibilityHint="Abre a tela da notificação"
        accessibilityLiveRegion="polite"
        onPress={aoTocar}
        style={estilos.cartao}
      >
        <Image source={require('../../assets/icon.png')} style={estilos.icone} />
        <View style={estilos.textos}>
          <View style={estilos.linha}>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Text style={estilos.quando}>agora</Text>
          </View>
          {texto !== '' && <Text style={estilos.texto}>{texto}</Text>}
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar aviso"
        onPress={aoFechar}
        style={estilos.fechar}
      >
        <View style={estilos.alca} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  camada: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 10,
    elevation: 10,
    alignItems: 'stretch',
  },
  cartao: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: cores.superficieInterna,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titulo: {
    flex: 1,
    color: cores.texto,
    fontFamily: tipografia.texto.negrito,
    fontSize: 17,
    lineHeight: 22,
  },
  quando: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  texto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 15,
    lineHeight: 20,
  },
  fechar: {
    alignSelf: 'center',
    minHeight: medidas.areaToqueMinima,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  alca: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: cores.bordaBotaoSecundario,
  },
});
