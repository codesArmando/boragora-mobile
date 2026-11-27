import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Cartao } from '@/components/Cartao';
import { LinhaAluno } from '@/components/LinhaAluno';
import { Selo } from '@/components/Selo';
import type { GrupoHoje, TurmaGrupoHoje } from '@/types/turma';
import { cores } from '@/theme/cores';

export function ListaDoGrupo({ grupo, papel }: { grupo: GrupoHoje; papel: 'aluno' | 'motorista' }) {
  const [trecho, setTrecho] = useState<'ida' | 'volta'>('ida');
  const turmas = grupo.minhaTurma
    ? [...grupo.turmas].sort((a, b) => Number(b.minhaTurma) - Number(a.minhaTurma))
    : grupo.turmas;

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Grupo {grupo.nome}</Text>
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
        <Cartao>
          <View style={estilos.cabecalhoTurma}>
            <View style={estilos.tituloGrupo}>
              <Text style={estilos.nomeTurma}>{turma.nome}</Text>
              <Selo tipo="suaTurma" />
            </View>
            <Feather name="chevron-right" size={22} color={cores.textoApagado} />
          </View>
          <Text style={estilos.resumoEsquerdo}>{resumo}</Text>
        </Cartao>
      ) : (
        <>
          <View style={estilos.cabecalhoTurma}>
            <Text style={estilos.nomeTurma}>{turma.nome}</Text>
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
                <View key={aluno.alunoId} style={estilos.linhaAluno}>
                  {/* flex: 1 deixa espaço para os selos; sem isso eles saíam da tela. */}
                  <View style={estilos.nomeAluno}>
                    <LinhaAluno
                      nome={aluno.nome}
                      selo={aluno.voce ? 'voce' : undefined}
                      avatar={false}
                    />
                  </View>
                  {cancelado ? <Selo tipo="cancelado" /> : null}
                  {trecho === 'volta' ? <Selo tipo={liberado ? 'liberado' : 'emAula'} /> : null}
                </View>
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
  titulo: { color: cores.texto, fontSize: 28, fontWeight: '800', fontStyle: 'italic' },
  horarios: { color: cores.textoApagado, fontSize: 14 },
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
  textoOpcao: { color: cores.textoSecundario, fontSize: 15, fontWeight: '600' },
  textoOpcaoAtiva: { color: cores.textoSobreDestaque, fontWeight: '700' },
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
  nomeTurma: { color: cores.texto, fontSize: 20, fontWeight: '700' },
  tituloGrupo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resumo: { color: cores.textoSecundario, fontSize: 14, flexShrink: 1, textAlign: 'right' },
  resumoEsquerdo: { color: cores.textoSecundario, fontSize: 14 },
  linhaAluno: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  nomeAluno: { flex: 1 },
  vazio: { paddingVertical: 16, color: cores.textoSecundario, textAlign: 'center' },
});
