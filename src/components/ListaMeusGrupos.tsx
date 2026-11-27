import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BlocoHorarios } from '@/components/BlocoHorarios';
import { Cartao } from '@/components/Cartao';
import { cores } from '@/theme/cores';
import type { Grupo } from '@/types/grupo';

export function ListaMeusGrupos({
  grupos,
  papel,
}: {
  grupos: Grupo[];
  papel: 'aluno' | 'motorista';
}) {
  const caminho = papel === 'aluno' ? '/aluno/grupo' : '/motorista/grupo';

  return (
    <View style={estilos.lista}>
      {grupos.map((grupo) => (
        <Link key={grupo.id} href={`${caminho}/${grupo.id}`} asChild>
          <Pressable accessibilityRole="button">
            <Cartao>
              <View style={estilos.dados}>
                <Text style={estilos.nome}>{grupo.nome}</Text>
                <Text style={estilos.detalhe}>
                  {grupo.minhaTurma ? `Sua turma: ${grupo.minhaTurma.nome} · ` : ''}
                  {grupo.totalTurmas} turmas no grupo
                </Text>
              </View>
              <BlocoHorarios
                horarioSaidaIda={grupo.horarioSaidaIda}
                horarioSaidaVolta={grupo.horarioSaidaVolta}
              />
              <Text style={estilos.botao}>Exibir detalhes ›</Text>
            </Cartao>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  dados: { gap: 4 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  detalhe: { color: cores.textoSecundario, fontSize: 15 },
  botao: {
    minHeight: 50,
    paddingVertical: 12,
    color: cores.texto,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: 14,
    overflow: 'hidden',
  },
});
