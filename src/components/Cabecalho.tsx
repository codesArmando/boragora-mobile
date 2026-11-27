import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BotaoAcao } from '@/components/BotaoAcao';
import { BotaoVoltar } from '@/components/BotaoVoltar';
import { cores } from '@/theme/cores';

type Acao = ComponentProps<typeof BotaoAcao>;

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
        {mostrarVoltar && <BotaoVoltar onPress={onVoltar} />}
        <Text accessibilityRole="header" numberOfLines={1} style={estilos.titulo}>
          {titulo}
        </Text>
        {acao && (
          <View style={estilos.acao}>
            <BotaoAcao rotulo={acao.rotulo} icone={acao.icone} onPress={acao.onPress} />
          </View>
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
  titulo: {
    flex: 1,
    color: cores.texto,
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    lineHeight: 30,
  },
  acao: {
    marginRight: 8,
  },
  subtitulo: {
    paddingLeft: 8,
    color: cores.textoApagado,
    fontSize: 14,
    fontWeight: '500',
  },
});
