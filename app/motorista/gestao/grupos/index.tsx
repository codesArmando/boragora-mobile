import Feather from '@expo/vector-icons/Feather';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { listarGrupos } from '@/repositories/grupoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { Grupo } from '@/types/grupo';
import { resumoDoGrupo } from '@/utils/grupo';

const NOVO_GRUPO = '/motorista/gestao/grupos/novo';

// D8: lista dos grupos, com "Novo grupo". Recarrega ao voltar para a tela e ao puxar para baixo.
export default function Grupos() {
  const [grupos, setGrupos] = useState<Grupo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setGrupos(await listarGrupos());
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar os grupos.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function puxarParaAtualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  function tentarDeNovo() {
    setErro(null);
    setGrupos(null);
    void carregar();
  }

  const botaoNovo = {
    rotulo: 'Novo grupo',
    icone: 'plus',
    onPress: () => router.push(NOVO_GRUPO),
  } as const;

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Grupos" acao={botaoNovo} />

      {grupos === null && erro === null && <Carregando />}
      {grupos === null && erro !== null && (
        <EstadoErro mensagem={erro} onTentarDeNovo={tentarDeNovo} />
      )}

      {grupos !== null && grupos.length === 0 && (
        <EstadoVazio titulo="Nenhum grupo cadastrado" texto="Crie o primeiro turno para começar.">
          <Botao rotulo="Novo grupo" onPress={() => router.push(NOVO_GRUPO)} />
        </EstadoVazio>
      )}

      {grupos !== null && grupos.length > 0 && (
        <FlatList
          data={grupos}
          keyExtractor={(grupo) => String(grupo.id)}
          contentContainerStyle={estilos.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={puxarParaAtualizar}
              tintColor={cores.destaque}
              colors={[cores.destaque]}
            />
          }
          ItemSeparatorComponent={() => <View style={estilos.separador} />}
          ListFooterComponent={
            <Text style={estilos.dica}>
              Toque em um grupo para editar os horários ou excluí-lo.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.nome}. ${resumoDoGrupo(item)}`}
              onPress={() => router.push(`/motorista/gestao/grupos/${item.id}`)}
              style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
            >
              <View style={estilos.textos}>
                <Text style={estilos.nome}>{item.nome}</Text>
                <Text style={estilos.resumo}>{resumoDoGrupo(item)}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={cores.textoApagado} />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    padding: medidas.margemTela,
    paddingTop: 16,
  },
  separador: {
    height: 12,
  },
  cartao: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  pressionado: {
    opacity: 0.8,
  },
  textos: {
    flex: 1,
    gap: 4,
  },
  nome: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
  },
  resumo: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
  dica: {
    marginTop: 16,
    paddingHorizontal: 4,
    color: cores.textoApagado,
    fontSize: 15,
  },
});
