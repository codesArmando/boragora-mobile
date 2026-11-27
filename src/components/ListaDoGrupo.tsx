import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Cartao } from '@/components/Cartao';
import { LinhaAluno } from '@/components/LinhaAluno';
import { Selo } from '@/components/Selo';
import type { GrupoHoje, TurmaGrupoHoje } from '@/types/turma';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

export function ListaDoGrupo({ grupo, papel }: { grupo: GrupoHoje; papel: 'aluno' | 'motorista' }) {
  const [trecho, setTrecho] = useState<'ida' | 'volta'>('ida');
  const turmas = grupo.minhaTurma
    ? [...grupo.turmas].sort((a, b) => Number(b.minhaTurma) - Number(a.minhaTurma))
    : grupo.turmas;

  return (
    <View style={estilos.container}>
      <View style={estilos.tituloLinha}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          hitSlop={8}
          style={estilos.voltar}
        >
          <Feather name="arrow-left" size={24} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo} numberOfLines={1}>
          Grupo {grupo.nome}
        </Text>
      </View>
      <Text style={estilos.horarios}>
        Ida {grupo.horarioSaidaIda} · Volta {grupo.horarioSaidaVolta}
        {papel === 'aluno' ? ' · somente consulta' : ''}
      </Text>
      <View style={estilos.seletor}>
        <BotaoTrecho rotulo="Ida" ativo={trecho === 'ida'} aoPressionar={() => setTrecho('ida')} />
        <BotaoTrecho
          rotulo="Volta"
          ativo={trecho === 'volta'}
          aoPressionar={() => setTrecho('volta')}
        />
      </View>
      {turmas.map((turma) => (
        <Turma key={turma.id} turma={turma} trecho={trecho} papel={papel} />
      ))}
      {turmas.length === 0 && <Text style={estilos.vazio}>Nenhuma turma neste grupo.</Text>}
    </View>
  );
}

function BotaoTrecho({
  rotulo,
  ativo,
  aoPressionar,
}: {
  rotulo: string;
  ativo: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Trecho ${rotulo}`}
      accessibilityState={{ selected: ativo }}
      onPress={aoPressionar}
      style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
    >
      <Text style={[estilos.textoOpcao, ativo && estilos.textoOpcaoAtiva]}>{rotulo}</Text>
    </Pressable>
  );
}

function Turma({
  turma,
  trecho,
  papel,
}: {
  turma: TurmaGrupoHoje;
  trecho: 'ida' | 'volta';
  papel: 'aluno' | 'motorista';
}) {
  const alunos = trecho === 'ida' ? turma.listaIda : turma.listaVolta;
  const { vaoNaIda, canceladosAposSaida, voltam, liberados } = turma.contadores;
  const contar = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
  const resumo =
    trecho === 'ida'
      ? `${contar(vaoNaIda, 'vai', 'vão')} · ${contar(canceladosAposSaida, 'cancelou', 'cancelaram')}`
      : `${contar(voltam, 'volta', 'voltam')} · ${contar(liberados, 'liberado', 'liberados')}`;
  const recolhida = papel === 'motorista' && turma.minhaTurma;
  const motoristas = turma.motorista;

  return (
    <View style={estilos.turma}>
      {recolhida ? (
        // A turma do próprio motorista vem resumida; o toque abre a lista do dia dela (C1).
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${turma.nome}, sua turma. ${resumo}`}
          onPress={() => router.push(`/motorista/hoje/${turma.id}`)}
        >
          <Cartao>
            <View style={[estilos.cabecalhoTurma, estilos.cabecalhoCartao]}>
              <View style={estilos.tituloGrupo}>
                <Text style={estilos.nomeTurma}>{turma.nome}</Text>
                <Selo tipo="suaTurma" />
              </View>
              <Feather name="chevron-right" size={22} color={cores.textoApagado} />
            </View>
            <Text style={estilos.resumoEsquerdo}>{resumo}</Text>
          </Cartao>
        </Pressable>
      ) : (
        <>
          <View style={estilos.cabecalhoTurma}>
            <View style={estilos.tituloGrupo}>
              <Text style={estilos.nomeTurma}>{turma.nome}</Text>
              {turma.minhaTurma && <Selo tipo="suaTurma" />}
            </View>
            <Text style={estilos.resumo}>
              {motoristas ? `${motoristas.nome} · ` : ''}
              {resumo}
            </Text>
          </View>
          {alunos.length ? (
            alunos.map((aluno) => {
              const cancelado = 'situacao' in aluno && aluno.situacao === 'CANCELADO_APOS_SAIDA';
              const liberado = 'statusVolta' in aluno && aluno.statusVolta === 'LIBERADO';
              return (
                <LinhaAluno
                  key={aluno.alunoId}
                  nome={aluno.nome}
                  selo={aluno.voce ? 'voce' : undefined}
                  avatar={false}
                  seloFinal={
                    cancelado
                      ? 'cancelado'
                      : trecho === 'volta'
                        ? liberado
                          ? 'liberado'
                          : 'emAula'
                        : undefined
                  }
                />
              );
            })
          ) : (
            <Text style={estilos.vazio}>Ninguém confirmou neste trecho.</Text>
          )}
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: 12 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  voltar: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { flex: 1, color: cores.texto, fontFamily: tipografia.titulo, fontSize: 28 },
  horarios: { fontFamily: tipografia.texto.regular, color: cores.textoApagado, fontSize: 14 },
  seletor: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
  },
  opcao: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  opcaoAtiva: { backgroundColor: cores.destaque },
  textoOpcao: { fontFamily: tipografia.texto.semibold, color: cores.textoSecundario, fontSize: 15 },
  textoOpcaoAtiva: { fontFamily: tipografia.texto.negrito, color: cores.textoSobreDestaque },
  turma: { marginTop: 4 },
  cabecalhoTurma: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  cabecalhoCartao: { minHeight: 0, borderBottomWidth: 0 },
  nomeTurma: { fontFamily: tipografia.texto.negrito, color: cores.texto, fontSize: 20 },
  tituloGrupo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resumo: {
    fontFamily: tipografia.texto.regular,
    color: cores.textoSecundario,
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
  resumoEsquerdo: {
    fontFamily: tipografia.texto.regular,
    color: cores.textoSecundario,
    fontSize: 14,
  },
  vazio: { paddingVertical: 16, color: cores.textoSecundario, textAlign: 'center' },
});
