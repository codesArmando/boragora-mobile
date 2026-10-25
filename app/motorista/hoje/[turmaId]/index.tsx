import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
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
            <View style={estilos.cabecalho}>
              <Text style={estilos.nome}>{turma.nome}</Text>
              <Text style={estilos.horarios}>
                {turma.grupo.nome} · {turma.grupo.horarioSaidaIda} / {turma.grupo.horarioSaidaVolta}
              </Text>
              <Link href={`/motorista/hoje/${turma.id}/alunos`} asChild>
                <Pressable style={estilos.botaoContorno}>
                  <Text style={estilos.textoBotao}>Alunos vinculados</Text>
                </Pressable>
              </Link>
            </View>
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
                          ? aluno.situacao === 'CANCELADO_APOS_SAIDA'
                            ? 'cancelado'
                            : 'emAula'
                          : aluno.statusVolta === 'LIBERADO'
                            ? 'liberado'
                            : 'emAula'
                      }
                    />
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
  cabecalho: { gap: 8 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  horarios: { color: cores.textoSecundario, fontSize: 16 },
  botaoContorno: {
    minHeight: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: { color: cores.texto, fontWeight: '700' },
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
  lista: { gap: 4 },
  alunoLinha: { flexDirection: 'row', alignItems: 'center' },
  vazio: { color: cores.textoSecundario, fontSize: 16, textAlign: 'center' },
});
