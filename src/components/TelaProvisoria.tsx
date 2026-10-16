import { Link, router, useLocalSearchParams, usePathname, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// Tela provisória do esqueleto (FND-01). Cada entrega substitui a sua pela tela real.

type LinkProvisorio = { rotulo: string; href: Href };

type Props = {
  telas: string;
  titulo: string;
  entrega: string;
  links?: LinkProvisorio[];
  children?: ReactNode;
};

export function TelaProvisoria({ telas, titulo, entrega, links = [], children }: Props) {
  const caminho = usePathname();
  const parametros = useLocalSearchParams();
  const textoParametros = Object.entries(parametros)
    .map(([chave, valor]) => `${chave} = ${valor}`)
    .join(' · ');

  return (
    <SafeAreaView style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        {router.canGoBack() && (
          <Pressable onPress={() => router.back()} style={estilos.voltar}>
            <Text style={estilos.textoApagado}>‹ Voltar</Text>
          </Pressable>
        )}

        <Text style={estilos.telas}>{telas}</Text>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.textoApagado}>Tela provisória · {entrega}</Text>
        <Text style={estilos.textoApagado}>{caminho}</Text>
        {textoParametros !== '' && <Text style={estilos.textoApagado}>{textoParametros}</Text>}

        {links.length > 0 && (
          <View style={estilos.links}>
            {links.map((link) => (
              <Link key={link.rotulo} href={link.href} asChild>
                <Pressable style={estilos.link}>
                  <Text style={estilos.textoLink}>{link.rotulo}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: medidas.margemTela,
    gap: 6,
  },
  voltar: {
    minHeight: medidas.areaToqueMinima,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  telas: {
    color: cores.destaque,
    fontSize: 14,
    fontWeight: '700',
  },
  titulo: {
    color: cores.texto,
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  textoApagado: {
    color: cores.textoApagado,
    fontSize: 14,
  },
  links: {
    marginTop: 18,
    gap: 10,
  },
  link: {
    minHeight: medidas.areaToqueMinima,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: medidas.raioCartao,
  },
  textoLink: {
    color: cores.texto,
    fontSize: 16,
  },
});
