import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// primario: ação principal (amarelo). contorno: ação secundária. texto: link.
// perigo: ação destrutiva cheia (B4). perigoContorno: excluir (D2b, D5a).
export type VarianteBotao = 'primario' | 'contorno' | 'texto' | 'perigo' | 'perigoContorno';

type Props = {
  rotulo: string;
  onPress: () => void;
  variante?: VarianteBotao;
  carregando?: boolean;
  desabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
};

const visuais: Record<
  VarianteBotao,
  { fundo: string; texto: string; borda?: string; semAltura?: boolean }
> = {
  primario: { fundo: cores.destaque, texto: cores.textoSobreDestaque },
  contorno: { fundo: 'transparent', texto: cores.texto, borda: cores.bordaBotaoSecundario },
  texto: { fundo: 'transparent', texto: cores.destaque, semAltura: true },
  perigo: { fundo: cores.perigo, texto: cores.textoSobrePerigo },
  perigoContorno: { fundo: 'transparent', texto: cores.perigo, borda: cores.perigo },
};

export function Botao({
  rotulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  style,
}: Props) {
  const visual = visuais[variante];
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        visual.semAltura ? estilos.alturaTexto : estilos.alturaCheia,
        {
          backgroundColor: visual.fundo,
          borderColor: visual.borda,
          borderWidth: visual.borda ? 1.5 : 0,
          opacity: desabilitado ? 0.4 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={visual.texto} />
      ) : (
        <Text style={[estilos.rotulo, { color: visual.texto }]}>{rotulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: medidas.raioBotao,
  },
  alturaCheia: {
    minHeight: medidas.alturaBotao,
    paddingHorizontal: 16,
  },
  alturaTexto: {
    minHeight: medidas.areaToqueMinima,
    paddingHorizontal: 16,
  },
  rotulo: {
    fontSize: 17,
    fontWeight: '700',
  },
});
