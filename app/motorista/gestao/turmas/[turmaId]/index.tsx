import Feather from '@expo/vector-icons/Feather';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso } from '@/components/Aviso';
import { BotaoAcao } from '@/components/BotaoAcao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao';
import { EstadoErro } from '@/components/EstadoErro';
import { ModalSeletor, type OpcaoSeletor } from '@/components/SeletorModal';
import { removerAluno } from '@/repositories/alunoRepository';
import { listarMotoristas } from '@/repositories/motoristaRepository';
import { atualizarTurma, buscarTurma } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { Motorista } from '@/types/motorista';
import type { Turma, TurmaAluno } from '@/types/turma';
import { resumoDadosDaTurma, tituloDaTurma } from '@/utils/turma';

// D5: gerenciar turma. "Trocar" muda o motorista, "Editar" abre a D5a, "Vincular" abre a D6 e
// o X remove o aluno da turma (com confirmação, convenção 8).
export default function GerenciarTurma() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);

  const [turma, setTurma] = useState<Turma | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const [motoristas, setMotoristas] = useState<Motorista[] | null>(null);
  const [trocando, setTrocando] = useState(false);
  const [alunoARemover, setAlunoARemover] = useState<TurmaAluno | null>(null);
  const [removendo, setRemovendo] = useState(false);

  const carregar = useCallback(async () => {
    if (!Number.isInteger(id)) {
      setErro('Turma não encontrada.');
      return;
    }
    try {
      setTurma(await buscarTurma(id));
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar a turma.');
    }
  }, [id]);

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

  async function abrirTroca() {
    setAviso(null);
    try {
      setMotoristas(await listarMotoristas());
      setTrocando(true);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'Não foi possível carregar os motoristas.');
    }
  }

  async function trocarMotorista(opcao: OpcaoSeletor) {
    setTrocando(false);
    if (turma === null || opcao.id === turma.motorista.id) {
      return;
    }
    try {
      // Usa a resposta do PUT (convenção 7). Em caso de conflito, o motorista anterior fica.
      setTurma(
        await atualizarTurma(turma.id, {
          nome: turma.nome,
          numeroVan: turma.numeroVan,
          capacidade: turma.capacidade,
          motoristaId: Number(opcao.id),
        }),
      );
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'Não foi possível trocar o motorista.');
    }
  }

  async function remover() {
    if (turma === null || alunoARemover === null) {
      return;
    }
    setRemovendo(true);
    try {
      await removerAluno(turma.id, alunoARemover.id);
      setAlunoARemover(null);
      await carregar();
    } catch (e) {
      setAlunoARemover(null);
      setAviso(e instanceof Error ? e.message : 'Não foi possível remover o aluno.');
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo={turma === null ? 'Turma' : tituloDaTurma(turma)} />

      {turma === null && erro === null && <Carregando />}
      {turma === null && erro !== null && (
        <EstadoErro
          mensagem={erro}
          onTentarDeNovo={() => {
            setErro(null);
            void carregar();
          }}
        />
      )}

      {turma !== null && (
        <>
          <ScrollView
            contentContainerStyle={estilos.conteudo}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={puxarParaAtualizar}
                tintColor={cores.destaque}
                colors={[cores.destaque]}
              />
            }
          >
            {aviso !== null && <Aviso tom="alerta" titulo={aviso} />}

            <View style={estilos.cartao}>
              <LinhaDado
                rotulo="Motorista responsável"
                valor={turma.motorista.nome}
                acao="Trocar"
                onAcao={abrirTroca}
              />
              <View style={estilos.divisor} />
              <LinhaDado
                rotulo="Dados da turma"
                valor={resumoDadosDaTurma(turma)}
                acao="Editar"
                onAcao={() => router.push(`/motorista/gestao/turmas/${turma.id}/editar`)}
              />
            </View>

            <View style={estilos.cabecalhoAlunos}>
              <Text style={estilos.tituloAlunos}>Alunos vinculados · {turma.alunos.length}</Text>
              <BotaoAcao
                rotulo="Vincular"
                icone="plus"
                onPress={() => router.push(`/motorista/gestao/turmas/${turma.id}/vincular`)}
              />
            </View>

            {turma.alunos.length === 0 ? (
              <Text style={estilos.vazio}>Nenhum aluno vinculado ainda.</Text>
            ) : (
              turma.alunos.map((aluno) => (
                <View key={aluno.id} style={estilos.linhaAluno}>
                  <Text style={estilos.nomeAluno}>{aluno.nome}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${aluno.nome}`}
                    hitSlop={4}
                    onPress={() => setAlunoARemover(aluno)}
                    style={estilos.remover}
                  >
                    <Feather name="x" size={24} color={cores.textoSecundario} />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>

          <ModalSeletor
            visivel={trocando}
            titulo="Motorista responsável"
            opcoes={(motoristas ?? []).map((motorista) => ({
              id: motorista.id,
              rotulo: motorista.nome,
              descricao: motorista.email,
            }))}
            valor={turma.motorista.id}
            onSelecionar={trocarMotorista}
            onFechar={() => setTrocando(false)}
          />
          <DialogoConfirmacao
            visivel={alunoARemover !== null}
            titulo="Remover aluno da turma?"
            mensagem={`${alunoARemover?.nome ?? 'O aluno'} sai da ${turma.nome}. A conta dele continua existindo e ele pode ser vinculado de novo.`}
            rotuloConfirmar="Remover"
            rotuloCancelar="Manter na turma"
            carregando={removendo}
            onConfirmar={remover}
            onCancelar={() => setAlunoARemover(null)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function LinhaDado({
  rotulo,
  valor,
  acao,
  onAcao,
}: {
  rotulo: string;
  valor: string;
  acao: string;
  onAcao: () => void;
}) {
  return (
    <View style={estilos.linhaDado}>
      <View style={estilos.textosDado}>
        <Text style={estilos.rotuloDado}>{rotulo}</Text>
        <Text style={estilos.valorDado}>{valor}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${acao}: ${rotulo}`}
        onPress={onAcao}
        style={estilos.acaoDado}
      >
        <Text style={estilos.textoAcaoDado}>{acao}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: medidas.margemTela,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  cartao: {
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  divisor: {
    height: 1,
    backgroundColor: cores.borda,
  },
  linhaDado: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  textosDado: {
    flex: 1,
  },
  rotuloDado: {
    color: cores.textoApagado,
    fontSize: 14,
  },
  valorDado: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '600',
  },
  acaoDado: {
    minHeight: medidas.areaToqueMinima,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  textoAcaoDado: {
    color: cores.destaque,
    fontSize: 17,
    fontWeight: '700',
  },
  cabecalhoAlunos: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tituloAlunos: {
    flex: 1,
    color: cores.textoApagado,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
  linhaAluno: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  nomeAluno: {
    flex: 1,
    color: cores.texto,
    fontSize: 18,
  },
  remover: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
