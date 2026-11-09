import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { LinhaPessoa } from '@/components/LinhaPessoa';
import { Selo } from '@/components/Selo';
import { useSessao } from '@/contexts/SessaoContext';
import { listarMotoristas } from '@/repositories/motoristaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { Motorista } from '@/types/motorista';

const NOVO_MOTORISTA = '/motorista/gestao/motoristas/novo';

// D9: motoristas cadastrados, com "Novo motorista". O chefe aparece com o selo "Você".
export default function Motoristas() {
  const { usuario } = useSessao();
  const [motoristas, setMotoristas] = useState<Motorista[] | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setMotoristas(await listarMotoristas());
      setErro(null);
    } catch (e) {
      setErro(e);
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

  const botaoNovo = {
    rotulo: 'Novo motorista',
    icone: 'plus',
    onPress: () => router.push(NOVO_MOTORISTA),
  } as const;

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Motoristas" acao={botaoNovo} />

      {motoristas === null && erro === null && <Carregando />}
      {motoristas === null && erro !== null && (
        <View style={estilos.estado}>
          <EstadoErro
            erro={erro}
            tentarNovamente={() => {
              setErro(null);
              void carregar();
            }}
          />
        </View>
      )}

      {motoristas !== null && motoristas.length === 0 && (
        <View style={estilos.estado}>
          <EstadoVazio mensagem="Nenhum motorista cadastrado">
            <View style={estilos.acaoVazia}>
              <Botao rotulo="Novo motorista" onPress={() => router.push(NOVO_MOTORISTA)} />
            </View>
          </EstadoVazio>
        </View>
      )}

      {motoristas !== null && motoristas.length > 0 && (
        <FlatList
          data={motoristas}
          keyExtractor={(motorista) => String(motorista.id)}
          contentContainerStyle={estilos.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={puxarParaAtualizar}
              tintColor={cores.destaque}
              colors={[cores.destaque]}
            />
          }
          ListFooterComponent={
            <Text style={estilos.dica}>
              A turma de cada motorista é definida em Turmas. Um motorista não pode conduzir duas
              turmas do mesmo grupo.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={estilos.linha}>
              <View style={estilos.pessoa}>
                <LinhaPessoa nome={item.nome} email={item.email} />
              </View>
              {item.id === usuario?.id && <Selo tipo="voce" />}
            </View>
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
  estado: {
    paddingHorizontal: medidas.margemTela,
  },
  acaoVazia: {
    alignSelf: 'stretch',
  },
  lista: {
    padding: medidas.margemTela,
    paddingTop: 16,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pessoa: {
    flex: 1,
  },
  dica: {
    marginTop: 16,
    paddingHorizontal: 4,
    color: cores.textoApagado,
    fontSize: 15,
  },
});
