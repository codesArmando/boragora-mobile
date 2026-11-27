import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Contadores } from '@/components/Contadores';
import { LinhaAluno } from '@/components/LinhaAluno';
import { Selo } from '@/components/Selo';
import { TelaDados } from '@/components/TelaDados';
import { buscarTurmaHoje } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Lado = 'ida' | 'volta';

export default function ListaDoDia() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);
  const [lado, setLado] = useState<Lado>('ida');
  const carregar = useCallback(() => buscarTurmaHoje(id), [id]);

  return (
    <TelaDados
      carregar={carregar}
      titulo="Lista do dia"
      subtitulo="Acompanhe as confirmações da turma."
      renderizar={(turma) => {
        const lista = lado === 'ida' ? turma.listaIda : turma.listaVolta;
        return (
          <View style={estilos.conteudo}>
            <View style={estilos.cabecalhoLinha}>
              <View style={estilos.cabecalho}>
                <Text style={estilos.nome}>
                  {turma.nome} · {turma.grupo.nome}
                </Text>
                <Text style={estilos.horarios}>
                  Ida {turma.grupo.horarioSaidaIda} · Volta {turma.grupo.horarioSaidaVolta}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Alunos da turma"
                onPress={() => router.push(`/motorista/hoje/${turma.id}/alunos`)}
                style={estilos.atalhoAlunos}
              >
                <Feather name="users" size={20} color={cores.texto} />
              </Pressable>
            </View>
            <Contadores {...turma.contadores} />
            <View style={estilos.seletor}>
              <BotaoLado texto="Ida" ativo={lado === 'ida'} aoPressionar={() => setLado('ida')} />
              <BotaoLado
                texto="Volta"
                ativo={lado === 'volta'}
                aoPressionar={() => setLado('volta')}
              />
            </View>
            {turma.semConfirmacoes ? (
              <Cartao>
                <Text style={estilos.vazio}>Ninguém confirmou presença ainda.</Text>
              </Cartao>
            ) : (
              <View style={estilos.lista}>
                {lista.map((aluno) => (
                  <View key={aluno.alunoId} style={estilos.alunoLinha}>
                    {aluno.voce && <Selo tipo="voce" />}
                    <LinhaAluno
                      nome={aluno.nome}
                      selo={
                        'situacao' in aluno
                          ? undefined
                          : aluno.statusVolta === 'LIBERADO'
                            ? 'liberado'
                            : 'emAula'
                      }
                    />
                    {'situacao' in aluno && aluno.situacao === 'CANCELADO_APOS_SAIDA' ? (
                      <Text style={estilos.cancelamento}>Cancelou depois da saída</Text>
                    ) : null}
                    {'situacao' in aluno && aluno.situacao === 'CANCELADO_APOS_SAIDA' ? (
                      <Selo tipo="cancelado" />
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

function BotaoLado({
  texto,
  ativo,
  aoPressionar,
}: {
  texto: string;
  ativo: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable onPress={aoPressionar} style={[estilos.opcao, ativo && estilos.opcaoAtiva]}>
      <Text style={[estilos.opcaoTexto, ativo && estilos.opcaoTextoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 14 },
  cabecalho: { gap: 8, flex: 1 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  horarios: { color: cores.textoApagado, fontSize: 14, fontWeight: '500' },
  cabecalhoLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  atalhoAlunos: {
    width: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 22,
    backgroundColor: cores.superficie,
  },
  seletor: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: cores.superficieInterna,
    borderRadius: 12,
  },
  opcao: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  opcaoAtiva: { backgroundColor: cores.destaque },
  opcaoTexto: { color: cores.textoSecundario, fontWeight: '700' },
  opcaoTextoAtivo: { color: cores.textoSobreDestaque },
  lista: { gap: 0 },
  alunoLinha: { flexDirection: 'row', alignItems: 'center' },
  cancelamento: { color: cores.perigo, marginLeft: 52, marginBottom: 8 },
  vazio: { color: cores.textoSecundario, fontSize: 16, textAlign: 'center' },
});
