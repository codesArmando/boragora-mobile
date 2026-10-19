import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoBusca } from '@/components/CampoBusca';
import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { buscarAlunosParaVincular, vincularAlunos } from '@/repositories/alunoRepository';
import { buscarTurma } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { AlunoAdmin } from '@/types/aluno';
import type { Turma } from '@/types/turma';
import { tituloDaTurma } from '@/utils/turma';

const ESPERA_DA_BUSCA_MS = 300;

function rotuloDaSituacao(aluno: AlunoAdmin): string {
  if (aluno.situacao === 'CONFLITO_NO_GRUPO') {
    return `Já está na ${aluno.turmaEmConflito ?? 'outra turma'} deste grupo`;
  }
  return aluno.turmas.length === 0 ? 'Sem turma' : aluno.turmas.join(', ');
}

// D6: vincular alunos à turma. Quem já está em outra turma do mesmo grupo aparece
// desabilitado (RN08); o backend revalida o lote inteiro (tudo ou nada).
export default function VincularAlunos() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);

  const [turma, setTurma] = useState<Turma | null>(null);
  const [alunos, setAlunos] = useState<AlunoAdmin[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [marcados, setMarcados] = useState<number[]>([]);
  const [erroVinculo, setErroVinculo] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(
    async (texto: string) => {
      if (!Number.isInteger(id)) {
        setErro('Turma não encontrada.');
        return;
      }
      try {
        const [dadosTurma, lista] = await Promise.all([
          buscarTurma(id),
          buscarAlunosParaVincular(id, texto),
        ]);
        setTurma(dadosTurma);
        setAlunos(lista);
        setErro(null);
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível carregar os alunos.');
      }
    },
    [id],
  );

  // Pequena espera entre as teclas, para não chamar a API a cada letra.
  useEffect(() => {
    const espera = setTimeout(() => setBuscaAplicada(busca), busca === '' ? 0 : ESPERA_DA_BUSCA_MS);
    return () => clearTimeout(espera);
  }, [busca]);

  useEffect(() => {
    const chamada = setTimeout(() => void carregar(buscaAplicada), 0);
    return () => clearTimeout(chamada);
  }, [buscaAplicada, carregar]);

  function alternar(aluno: AlunoAdmin) {
    setErroVinculo(null);
    setMarcados((atuais) =>
      atuais.includes(aluno.id) ? atuais.filter((m) => m !== aluno.id) : [...atuais, aluno.id],
    );
  }

  async function vincular() {
    setSalvando(true);
    setErroVinculo(null);
    try {
      await vincularAlunos(id, marcados);
      router.back();
    } catch (e) {
      setErroVinculo(e instanceof Error ? e.message : 'Não foi possível vincular os alunos.');
    } finally {
      setSalvando(false);
    }
  }

  const quantidade = marcados.length;
  const rotuloBotao =
    quantidade === 0
      ? 'Vincular alunos'
      : quantidade === 1
        ? 'Vincular 1 aluno'
        : `Vincular ${quantidade} alunos`;

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho
        titulo="Vincular alunos"
        subtitulo={turma === null ? undefined : tituloDaTurma(turma)}
      />

      <View style={estilos.busca}>
        <CampoBusca value={busca} onChangeText={setBusca} editable={!salvando} />
      </View>

      {alunos === null && erro === null && <Carregando />}
      {alunos === null && erro !== null && (
        <EstadoErro
          mensagem={erro}
          onTentarDeNovo={() => {
            setErro(null);
            void carregar(buscaAplicada);
          }}
        />
      )}

      {alunos !== null && (
        <>
          {erroVinculo !== null && (
            <View style={estilos.aviso}>
              <Aviso tom="alerta" titulo={erroVinculo} />
            </View>
          )}

          {alunos.length === 0 ? (
            <EstadoVazio
              titulo={
                buscaAplicada === '' ? 'Nenhum aluno para vincular' : 'Nenhum aluno encontrado'
              }
              texto={
                buscaAplicada === ''
                  ? 'Todos os alunos cadastrados já estão nesta turma.'
                  : 'Tente buscar por outro nome ou e-mail.'
              }
            />
          ) : (
            <FlatList
              data={alunos}
              keyExtractor={(aluno) => String(aluno.id)}
              contentContainerStyle={estilos.lista}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => <View style={estilos.separador} />}
              renderItem={({ item }) => {
                const bloqueado = item.situacao === 'CONFLITO_NO_GRUPO';
                const marcado = marcados.includes(item.id);
                return (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={`${item.nome}. ${rotuloDaSituacao(item)}`}
                    accessibilityState={{ checked: marcado, disabled: bloqueado }}
                    disabled={bloqueado || salvando}
                    onPress={() => alternar(item)}
                    style={estilos.linha}
                  >
                    <View
                      style={[
                        estilos.caixa,
                        marcado && estilos.caixaMarcada,
                        bloqueado && estilos.caixaBloqueada,
                      ]}
                    >
                      {marcado && (
                        <Feather name="check" size={20} color={cores.textoSobreDestaque} />
                      )}
                    </View>
                    <View style={estilos.textos}>
                      <Text style={[estilos.nome, bloqueado && estilos.nomeBloqueado]}>
                        {item.nome}
                      </Text>
                      <Text style={[estilos.situacao, bloqueado && estilos.situacaoConflito]}>
                        {rotuloDaSituacao(item)}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </>
      )}

      <View style={estilos.rodape}>
        <Botao
          rotulo={rotuloBotao}
          carregando={salvando}
          desabilitado={quantidade === 0}
          onPress={vincular}
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  busca: {
    paddingHorizontal: medidas.margemTela,
    paddingTop: 16,
    paddingBottom: 8,
  },
  aviso: {
    paddingHorizontal: medidas.margemTela,
    paddingBottom: 8,
  },
  lista: {
    paddingHorizontal: medidas.margemTela,
  },
  separador: {
    height: 1,
    backgroundColor: cores.borda,
  },
  linha: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  caixa: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: cores.textoSecundario,
  },
  caixaMarcada: {
    borderColor: cores.destaque,
    backgroundColor: cores.destaque,
  },
  caixaBloqueada: {
    borderColor: cores.borda,
    backgroundColor: cores.superficieInterna,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '600',
  },
  nomeBloqueado: {
    color: cores.textoApagado,
  },
  situacao: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
  situacaoConflito: {
    color: cores.perigo,
  },
  rodape: {
    paddingHorizontal: medidas.margemTela,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
});
