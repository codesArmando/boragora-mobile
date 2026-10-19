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
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setMotoristas(await listarMotoristas());
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar os motoristas.');
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
        <EstadoErro
          mensagem={erro}
          onTentarDeNovo={() => {
            setErro(null);
            void carregar();
          }}
        />
      )}

      {motoristas !== null && motoristas.length === 0 && (
        <EstadoVazio titulo="Nenhum motorista cadastrado">
          <Botao rotulo="Novo motorista" onPress={() => router.push(NOVO_MOTORISTA)} />
        </EstadoVazio>
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
          ItemSeparatorComponent={() => <View style={estilos.separador} />}
          ListFooterComponent={
            <Text style={estilos.dica}>
              A turma de cada motorista é definida em Turmas. Um motorista não pode conduzir duas
              turmas do mesmo grupo.
            </Text>
          }
          renderItem={({ item }) => (
            <LinhaPessoa
              nome={item.nome}
              email={item.email}
              selo={item.id === usuario?.id ? 'Você' : undefined}
            />
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
    height: 1,
    backgroundColor: cores.borda,
  },
  dica: {
    marginTop: 16,
    paddingHorizontal: 4,
    color: cores.textoApagado,
    fontSize: 15,
  },
});
