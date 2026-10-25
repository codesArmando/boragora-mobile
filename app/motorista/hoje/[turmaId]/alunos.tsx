import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { LinhaAluno } from '@/components/LinhaAluno';
import { TelaDados } from '@/components/TelaDados';
import { buscarDetalheTurma } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';

export default function AlunosDaTurma() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const id = Number(turmaId);
  const carregar = useCallback(() => buscarDetalheTurma(id), [id]);

  return (
    <TelaDados
      carregar={carregar}
      titulo="Alunos vinculados"
      renderizar={(turma) => (
        <View style={estilos.conteudo}>
          <Cartao>
            <LinhaInfo rotulo="Motorista" valor={turma.motorista.nome} />
            <LinhaInfo
              rotulo="Saídas"
              valor={`Ida ${turma.grupo.horarioSaidaIda} · Volta ${turma.grupo.horarioSaidaVolta}`}
            />
            <LinhaInfo
              rotulo="Capacidade da van"
              valor={turma.capacidade ? `${turma.capacidade} lugares` : 'Não informada'}
            />
          </Cartao>
          <Text style={estilos.rotulo}>ALUNOS VINCULADOS · {turma.alunos.length}</Text>
          {turma.alunos.map((aluno) => (
            <LinhaAluno key={aluno.id} nome={aluno.nome} />
          ))}
        </View>
      )}
    />
  );
}

function LinhaInfo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={estilos.info}>
      <Text style={estilos.infoRotulo}>{rotulo}</Text>
      <Text style={estilos.infoValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 12 },
  rotulo: { marginTop: 16, color: cores.textoApagado, fontSize: 14, fontWeight: '700' },
  info: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  infoRotulo: { flex: 1, color: cores.textoSecundario, fontSize: 16 },
  infoValor: { flex: 1, color: cores.texto, fontSize: 16, fontWeight: '600', textAlign: 'right' },
});
