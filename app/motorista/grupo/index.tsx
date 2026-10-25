import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BlocoHorarios } from '@/components/BlocoHorarios';
import { Cartao } from '@/components/Cartao';
import { TelaDados } from '@/components/TelaDados';
import { listarGrupos } from '@/repositories/grupoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export default function GruposMotorista() {
  const carregar = useCallback(() => listarGrupos(), []);

  return (
    <TelaDados
      carregar={carregar}
      titulo="Grupos"
      subtitulo="Acompanhe as outras turmas dos grupos em que você atua."
      vazio={(grupos) => grupos.length === 0}
      renderizar={(grupos) => (
        <View style={estilos.lista}>
          {grupos.map((grupo) => (
            <Cartao key={grupo.id}>
              <Text style={estilos.nome}>{grupo.nome}</Text>
              <Text style={estilos.detalhe}>
                {grupo.minhaTurma ? `Sua turma: ${grupo.minhaTurma.nome} · ` : ''}
                {grupo.totalTurmas} turmas no grupo
              </Text>
              <BlocoHorarios
                horarioSaidaIda={grupo.horarioSaidaIda}
                horarioSaidaVolta={grupo.horarioSaidaVolta}
              />
              <Link href={`/motorista/grupo/${grupo.id}`} asChild>
                <Pressable style={estilos.botao}>
                  <Text style={estilos.textoBotao}>Exibir detalhes ›</Text>
                </Pressable>
              </Link>
            </Cartao>
          ))}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  detalhe: { color: cores.textoSecundario, fontSize: 16 },
  botao: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: { color: cores.texto, fontSize: 16, fontWeight: '700' },
});
