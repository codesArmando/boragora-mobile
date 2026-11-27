import { Link, router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cabecalho } from '@/components/Cabecalho';
import { Cartao } from '@/components/Cartao';
import { TelaDados } from '@/components/TelaDados';
import { listarTurmasAdmin } from '@/repositories/gestaoConsultaRepository';
import { cores } from '@/theme/cores';

export default function Turmas() {
  const carregar = useCallback(() => listarTurmasAdmin(), []);
  return (
    <View style={estilos.tela}>
      <Cabecalho
        titulo="Turmas"
        voltar
        acao={{
          rotulo: 'Nova turma',
          icone: 'plus',
          onPress: () => router.push('/motorista/gestao/turmas/nova'),
        }}
      />
      <TelaDados
        carregar={carregar}
        titulo=""
        recarregarAoFocar
        vazio={(turmas) => turmas.length === 0}
        mensagemVazia="Nenhuma turma cadastrada."
        renderizar={(turmas) => (
          <View style={estilos.lista}>
            {[...new Set(turmas.map((turma) => turma.grupo.id))].map((grupoId) => {
              const grupo = turmas.find((turma) => turma.grupo.id === grupoId)?.grupo;
              if (!grupo) return null;
              return (
                <View key={grupoId} style={estilos.grupo}>
                  <Text style={estilos.rotuloGrupo}>
                    {grupo.nome} · ida {grupo.horarioSaidaIda} · volta {grupo.horarioSaidaVolta}
                  </Text>
                  {turmas
                    .filter((turma) => turma.grupo.id === grupoId)
                    .map((turma) => (
                      <Link key={turma.id} href={`/motorista/gestao/turmas/${turma.id}`} asChild>
                        <Pressable accessibilityRole="button">
                          <Cartao>
                            <View style={estilos.linhaTopo}>
                              <Text style={estilos.nome}>{turma.nome}</Text>
                              <Text style={estilos.motorista}>{turma.motorista.nome}</Text>
                              <Feather name="chevron-right" size={20} color={cores.textoApagado} />
                            </View>
                            <Text style={estilos.detalhe}>{turma.totalAlunos} alunos</Text>
                          </Cartao>
                        </Pressable>
                      </Link>
                    ))}
                </View>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { gap: 24 },
  grupo: { gap: 10 },
  rotuloGrupo: {
    color: cores.textoApagado,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  linhaTopo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nome: { color: cores.texto, fontSize: 20, fontWeight: '700' },
  motorista: { flex: 1, color: cores.textoSecundario, fontSize: 15 },
  detalhe: { color: cores.texto, fontSize: 15 },
});
