import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErroApi } from '@/api/ErroApi';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CamposDadosTurma } from '@/components/CamposDadosTurma';
import { Carregando } from '@/components/Carregando';
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao';
import { EstadoErro } from '@/components/EstadoErro';
import { atualizarTurma, buscarTurma, excluirTurma } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { Turma } from '@/types/turma';
import { validarDadosTurma, type ErrosDadosTurma } from '@/utils/turma';

// D5a: editar turma (nome, número da van e capacidade) e excluir. O grupo não muda e o
// motorista é trocado na D5.
export default function EditarTurma() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);

  const [turma, setTurma] = useState<Turma | null>(null);
  const [erroCarga, setErroCarga] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [numeroVan, setNumeroVan] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [erros, setErros] = useState<ErrosDadosTurma>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const camposPreenchidos = useRef(false);

  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Os campos são preenchidos só na primeira carga: recarregar ao focar não apaga a edição.
  const carregar = useCallback(async () => {
    if (!Number.isInteger(id)) {
      setErroCarga('Turma não encontrada.');
      return;
    }
    try {
      const carregada = await buscarTurma(id);
      if (!camposPreenchidos.current) {
        camposPreenchidos.current = true;
        setNome(carregada.nome);
        setNumeroVan(carregada.numeroVan === null ? '' : String(carregada.numeroVan));
        setCapacidade(carregada.capacidade === null ? '' : String(carregada.capacidade));
      }
      setTurma(carregada);
      setErroCarga(null);
    } catch (e) {
      setErroCarga(e instanceof Error ? e.message : 'Não foi possível carregar a turma.');
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function salvar() {
    if (turma === null) {
      return;
    }
    const { erros: novos, dados } = validarDadosTurma(nome, numeroVan, capacidade);
    setErros(novos);
    setErroGeral(null);
    if (dados === null) {
      return;
    }

    setSalvando(true);
    try {
      await atualizarTurma(turma.id, { ...dados, motoristaId: turma.motorista.id });
      router.back();
    } catch (e) {
      if (e instanceof ErroApi && e.campos !== null) {
        setErros({
          nome: e.campos.nome,
          numeroVan: e.campos.numeroVan,
          capacidade: e.campos.capacidade,
        });
      } else {
        setErroGeral(e instanceof Error ? e.message : 'Não foi possível salvar a turma.');
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (turma === null) {
      return;
    }
    setExcluindo(true);
    try {
      await excluirTurma(turma.id);
      setConfirmando(false);
      // Volta para a lista de turmas (D3), pulando a D5 da turma que já não existe.
      router.dismissTo('/motorista/gestao/turmas');
    } catch (e) {
      setConfirmando(false);
      setErroGeral(e instanceof Error ? e.message : 'Não foi possível excluir a turma.');
    } finally {
      setExcluindo(false);
    }
  }

  const ocupado = salvando || excluindo;

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Editar turma" />

      {turma === null && erroCarga === null && <Carregando />}
      {turma === null && erroCarga !== null && (
        <EstadoErro
          mensagem={erroCarga}
          onTentarDeNovo={() => {
            setErroCarga(null);
            void carregar();
          }}
        />
      )}

      {turma !== null && (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={estilos.corpo}
          >
            <ScrollView
              contentContainerStyle={estilos.conteudo}
              keyboardShouldPersistTaps="handled"
            >
              {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}

              <View style={estilos.cartaoGrupo}>
                <Text style={estilos.rotuloGrupo}>Grupo</Text>
                <Text style={estilos.valorGrupo}>
                  {`${turma.grupo.nome} · ida ${turma.grupo.horarioSaidaIda} · volta ${turma.grupo.horarioSaidaVolta}`}
                </Text>
                <Text style={estilos.notaGrupo}>O grupo não muda depois que a turma é criada.</Text>
              </View>

              <CamposDadosTurma
                nome={nome}
                numeroVan={numeroVan}
                capacidade={capacidade}
                onNome={setNome}
                onNumeroVan={setNumeroVan}
                onCapacidade={setCapacidade}
                erros={erros}
                dicaNome="Texto livre, até 60 caracteres."
                dicaNumeros="O motorista é trocado na tela da turma."
                desabilitado={ocupado}
              />
            </ScrollView>

            <View style={estilos.rodape}>
              <Botao
                rotulo="Salvar alterações"
                carregando={salvando}
                desabilitado={excluindo}
                onPress={salvar}
              />
              <Botao
                rotulo="Excluir turma"
                variante="perigoContorno"
                desabilitado={ocupado}
                onPress={() => {
                  setErroGeral(null);
                  setConfirmando(true);
                }}
              />
              <Text style={estilos.dica}>
                Excluir apaga os vínculos dos alunos, as viagens e as confirmações desta turma. Não
                dá para desfazer.
              </Text>
            </View>
          </KeyboardAvoidingView>

          <DialogoConfirmacao
            visivel={confirmando}
            titulo="Excluir esta turma?"
            mensagem={`A ${turma.nome} será apagada, junto com os vínculos dos alunos, as viagens e as confirmações. Não dá para desfazer.`}
            rotuloConfirmar="Excluir turma"
            rotuloCancelar="Manter turma"
            carregando={excluindo}
            onConfirmar={excluir}
            onCancelar={() => setConfirmando(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  corpo: {
    flex: 1,
  },
  conteudo: {
    padding: medidas.margemTela + 4,
    paddingTop: 16,
    gap: 20,
  },
  cartaoGrupo: {
    gap: 4,
    padding: 16,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  rotuloGrupo: {
    color: cores.textoApagado,
    fontSize: 14,
  },
  valorGrupo: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '600',
  },
  notaGrupo: {
    color: cores.textoApagado,
    fontSize: 15,
  },
  rodape: {
    paddingHorizontal: medidas.margemTela + 4,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  dica: {
    color: cores.textoApagado,
    fontSize: 14,
    textAlign: 'center',
  },
});
