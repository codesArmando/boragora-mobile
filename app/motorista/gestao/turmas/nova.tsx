import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErroApi } from '@/api/ErroApi';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CamposDadosTurma } from '@/components/CamposDadosTurma';
import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { SeletorModal } from '@/components/SeletorModal';
import { listarGrupos } from '@/repositories/grupoRepository';
import { listarMotoristas } from '@/repositories/motoristaRepository';
import { criarTurma } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { Grupo } from '@/types/grupo';
import type { Motorista } from '@/types/motorista';
import { validarDadosTurma, type ErrosDadosTurma } from '@/utils/turma';

type Erros = ErrosDadosTurma & { grupo?: string; motorista?: string };

// D4: nova turma. Ao criar, abre a D5 da turma nova, para vincular os alunos.
export default function NovaTurma() {
  const [grupos, setGrupos] = useState<Grupo[] | null>(null);
  const [motoristas, setMotoristas] = useState<Motorista[] | null>(null);
  const [erroCarga, setErroCarga] = useState<string | null>(null);

  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [motoristaId, setMotoristaId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [numeroVan, setNumeroVan] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [listaGrupos, listaMotoristas] = await Promise.all([
        listarGrupos(),
        listarMotoristas(),
      ]);
      setGrupos(listaGrupos);
      setMotoristas(listaMotoristas);
      setErroCarga(null);
    } catch (e) {
      setErroCarga(e instanceof Error ? e.message : 'Não foi possível carregar os dados.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function criar() {
    const { erros: errosDados, dados } = validarDadosTurma(nome, numeroVan, capacidade);
    const novos: Erros = { ...errosDados };
    if (grupoId === null) {
      novos.grupo = 'Escolha o grupo.';
    }
    if (motoristaId === null) {
      novos.motorista = 'Escolha o motorista responsável.';
    }
    setErros(novos);
    setErroGeral(null);
    if (dados === null || grupoId === null || motoristaId === null) {
      return;
    }

    setSalvando(true);
    try {
      const turma = await criarTurma({ grupoId, motoristaId, ...dados });
      router.replace(`/motorista/gestao/turmas/${turma.id}`);
    } catch (e) {
      if (e instanceof ErroApi && e.codigo === 'CONFLITO_GRUPO_MOTORISTA') {
        // O conflito é do motorista naquele grupo: a mensagem fica junto do seletor.
        setErros({ motorista: e.mensagem });
      } else if (e instanceof ErroApi && e.campos !== null) {
        setErros({
          nome: e.campos.nome,
          numeroVan: e.campos.numeroVan,
          capacidade: e.campos.capacidade,
          grupo: e.campos.grupoId,
          motorista: e.campos.motoristaId,
        });
      } else {
        setErroGeral(e instanceof Error ? e.message : 'Não foi possível criar a turma.');
      }
    } finally {
      setSalvando(false);
    }
  }

  const carregando = grupos === null && motoristas === null && erroCarga === null;

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Nova turma" />

      {carregando && <Carregando />}
      {erroCarga !== null && (
        <EstadoErro
          mensagem={erroCarga}
          onTentarDeNovo={() => {
            setErroCarga(null);
            void carregar();
          }}
        />
      )}

      {grupos !== null && motoristas !== null && grupos.length === 0 && (
        <EstadoVazio
          titulo="Nenhum grupo cadastrado"
          texto="Toda turma pertence a um grupo. Crie o grupo primeiro."
        >
          <Botao rotulo="Novo grupo" onPress={() => router.push('/motorista/gestao/grupos/novo')} />
        </EstadoVazio>
      )}

      {grupos !== null && motoristas !== null && grupos.length > 0 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={estilos.corpo}
        >
          <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
            {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}

            <SeletorModal
              rotulo="Grupo"
              placeholder="Escolha o grupo"
              opcoes={grupos.map((grupo) => ({
                id: grupo.id,
                rotulo: `${grupo.nome} · ida ${grupo.horarioSaidaIda} · volta ${grupo.horarioSaidaVolta}`,
              }))}
              valor={grupoId}
              onSelecionar={(opcao) => setGrupoId(Number(opcao.id))}
              erro={erros.grupo}
              desabilitado={salvando}
            />
            <CamposDadosTurma
              nome={nome}
              numeroVan={numeroVan}
              capacidade={capacidade}
              onNome={setNome}
              onNumeroVan={setNumeroVan}
              onCapacidade={setCapacidade}
              erros={erros}
              dicaNome="Texto livre, até 60 caracteres. Ex.: Van 2 ou Van da Zona Sul."
              dicaNumeros="A capacidade fica só no cadastro. Ela não limita as confirmações."
              desabilitado={salvando}
            />
            <SeletorModal
              rotulo="Motorista responsável"
              placeholder="Escolha o motorista"
              opcoes={motoristas.map((motorista) => ({
                id: motorista.id,
                rotulo: motorista.nome,
                descricao: motorista.email,
              }))}
              valor={motoristaId}
              onSelecionar={(opcao) => setMotoristaId(Number(opcao.id))}
              erro={erros.motorista}
              dica="Um motorista não pode conduzir duas turmas do mesmo grupo."
              textoVazio="Nenhum motorista cadastrado. Cadastre um em Gestão › Motoristas."
              desabilitado={salvando}
            />
          </ScrollView>
          <View style={estilos.rodape}>
            <Text style={estilos.aviso}>Os alunos são vinculados no próximo passo.</Text>
            <Botao rotulo="Criar turma" carregando={salvando} onPress={criar} />
          </View>
        </KeyboardAvoidingView>
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
  rodape: {
    paddingHorizontal: medidas.margemTela + 4,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
  },
  aviso: {
    color: cores.textoSecundario,
    fontSize: 15,
    textAlign: 'center',
  },
});
