import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { Contadores } from '@/components/Contadores';
import { EstadoVazio } from '@/components/EstadoVazio';
import { LinhaAluno } from '@/components/LinhaAluno';
import { TelaDados } from '@/components/TelaDados';
import { TituloComVoltar } from '@/components/TituloComVoltar';
import { buscarTurmaHoje } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';
import type { TurmaListaHoje } from '@/types/turma';
import { dataPorExtenso } from '@/utils/data';

type Lado = 'ida' | 'volta';

// C1 (ida), C2 (volta) e C5 (ninguém confirmou) da turma do motorista (LIS-05).
export default function ListaDoDia() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);
  const [lado, setLado] = useState<Lado>('ida');
  const carregar = useCallback(() => buscarTurmaHoje(id), [id]);
  const abrirAlunos = () => router.push(`/motorista/hoje/${id}/alunos`);

  return (
    <TelaDados
      carregar={carregar}
      titulo=""
      renderizar={(turma) => (
        <View style={estilos.conteudo}>
          <Cabecalho turma={turma} aoAbrirAlunos={abrirAlunos} />
          {turma.semConfirmacoes ? (
            <EstadoVazio
              ilustracao={
                <Image
                  source={require('../../../../assets/simbolo-boragora.png')}
                  style={estilos.ilustracao}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              }
              titulo="Ninguém confirmou ainda"
              mensagem="A lista de hoje aparece assim que o primeiro aluno marcar ida ou volta."
            >
              <Botao rotulo="Ver alunos da turma" variante="contorno" onPress={abrirAlunos} />
            </EstadoVazio>
          ) : (
            <>
              <Contadores {...turma.contadores} />
              <View style={estilos.seletor} accessibilityRole="tablist">
                <BotaoLado texto="Ida" ativo={lado === 'ida'} aoPressionar={() => setLado('ida')} />
                <BotaoLado
                  texto="Volta"
                  ativo={lado === 'volta'}
                  aoPressionar={() => setLado('volta')}
                />
              </View>
              <Lista turma={turma} lado={lado} />
            </>
          )}
        </View>
      )}
    />
  );
}

function Cabecalho({ turma, aoAbrirAlunos }: { turma: TurmaListaHoje; aoAbrirAlunos: () => void }) {
  return (
    <TituloComVoltar
      titulo={`${turma.nome} · ${turma.grupo.nome}`}
      subtitulo={`${dataPorExtenso()} · Ida ${turma.grupo.horarioSaidaIda} · Volta ${turma.grupo.horarioSaidaVolta}`}
      direita={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Alunos da turma"
          onPress={aoAbrirAlunos}
          style={estilos.atalhoAlunos}
        >
          <Feather name="users" size={20} color={cores.texto} />
        </Pressable>
      }
    />
  );
}

function Lista({ turma, lado }: { turma: TurmaListaHoje; lado: Lado }) {
  if (lado === 'ida') {
    return (
      <View>
        {turma.listaIda.map((aluno) => {
          const cancelou = aluno.situacao === 'CANCELADO_APOS_SAIDA';
          return (
            <LinhaAluno
              key={aluno.alunoId}
              nome={aluno.nome}
              selo={aluno.voce ? 'voce' : undefined}
              detalhe={cancelou ? 'Cancelou depois da saída' : undefined}
              tom={cancelou ? 'alerta' : 'normal'}
              seloFinal={cancelou ? 'cancelado' : undefined}
            />
          );
        })}
      </View>
    );
  }
  return (
    <View>
      {turma.listaVolta.map((aluno) => (
        <LinhaAluno
          key={aluno.alunoId}
          nome={aluno.nome}
          selo={aluno.voce ? 'voce' : undefined}
          seloFinal={aluno.statusVolta === 'LIBERADO' ? 'liberado' : 'emAula'}
        />
      ))}
    </View>
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
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="tab"
      accessibilityState={{ selected: ativo }}
      style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
    >
      <Text style={[estilos.opcaoTexto, ativo && estilos.opcaoTextoAtivo]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 14 },
  atalhoAlunos: {
    width: medidas.areaToqueMinima + 4,
    height: medidas.areaToqueMinima + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 24,
    backgroundColor: cores.superficie,
  },
  seletor: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
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
  opcaoTexto: { color: cores.textoSecundario, fontFamily: tipografia.texto.semibold, fontSize: 16 },
  opcaoTextoAtivo: { color: cores.textoSobreDestaque, fontFamily: tipografia.texto.negrito },
  ilustracao: { width: 190, height: 186 },
});
