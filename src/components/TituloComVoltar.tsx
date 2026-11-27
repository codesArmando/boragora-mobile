import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

// Título com seta de voltar para telas que montam o cabeçalho com os dados já carregados
// (C1, C4: "Van 2 · Noite"). Fica dentro do conteúdo do TelaDados, então não tem margem própria.
export function TituloComVoltar({
  titulo,
  subtitulo,
  direita,
}: {
  titulo: string;
  subtitulo?: string;
  /** Ação à direita do título (ex.: botão de alunos da C1). */
  direita?: ReactNode;
}) {
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.linha}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          hitSlop={8}
          style={estilos.voltar}
        >
          <Feather name="arrow-left" size={24} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo} numberOfLines={1} accessibilityRole="header">
          {titulo}
        </Text>
        {direita}
      </View>
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { gap: 6 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  voltar: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { flex: 1, color: cores.texto, fontFamily: tipografia.titulo, fontSize: 28 },
  subtitulo: { color: cores.textoApagado, fontFamily: tipografia.texto.medio, fontSize: 14 },
});
