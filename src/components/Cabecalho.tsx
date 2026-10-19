import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Acao = { rotulo: string; onPress: () => void };

type Props = {
  titulo: string;
  subtitulo?: string;
  /** Sem `voltar`, o botão aparece quando há para onde voltar. Com `false`, nunca aparece. */
  voltar?: boolean;
  /** Troca o `router.back()` padrão. */
  onVoltar?: () => void;
  /** Ação à direita do título, como o "Novo grupo" da D8. */
  acao?: Acao;
};

// Cabeçalho das telas de pilha. A área segura de cima fica com a tela (componente Tela, FND-02).
export function Cabecalho({ titulo, subtitulo, voltar, onVoltar, acao }: Props) {
  const mostrarVoltar = voltar ?? (onVoltar !== undefined || router.canGoBack());

  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.linha}>
        {mostrarVoltar && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={onVoltar ?? (() => router.back())}
            style={estilos.voltar}
          >
            <Feather name="arrow-left" size={26} color={cores.texto} />
          </Pressable>
        )}
        <Text accessibilityRole="header" numberOfLines={1} style={estilos.titulo}>
          {titulo}
        </Text>
        {acao && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={acao.rotulo}
            onPress={acao.onPress}
            style={estilos.acao}
          >
            <Text style={estilos.textoAcao}>{acao.rotulo}</Text>
          </Pressable>
        )}
      </View>
      {subtitulo !== undefined && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 12,
    gap: 2,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voltar: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    flex: 1,
    color: cores.texto,
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    lineHeight: 30,
  },
  acao: {
    minHeight: medidas.areaToqueMinima,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  textoAcao: {
    color: cores.destaque,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitulo: {
    paddingLeft: 8,
    color: cores.textoApagado,
    fontSize: 14,
    fontWeight: '500',
  },
});
