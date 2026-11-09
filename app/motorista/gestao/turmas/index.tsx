import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { TelaDados } from '@/components/TelaDados';
import { listarTurmasAdmin } from '@/repositories/gestaoConsultaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export default function Turmas() {
  const carregar = useCallback(() => listarTurmasAdmin(), []);
  return (
    <TelaDados
      carregar={carregar}
      titulo="Turmas"
      subtitulo="Cadastro das turmas da equipe."
      vazio={(turmas) => turmas.length === 0}
      mensagemVazia="Nenhuma turma cadastrada."
      acaoVazia={<BotaoNovaTurma />}
      renderizar={(turmas) => (
        <View style={estilos.lista}>
          <BotaoNovaTurma />
          {turmas.map((turma) => (
            <Link key={turma.id} href={`/motorista/gestao/turmas/${turma.id}`} asChild>
              <Pressable accessibilityRole="button">
                <Cartao>
                  <Text style={estilos.nome}>
                    {turma.grupo.nome} · {turma.nome}
                  </Text>
                  <Text style={estilos.detalhe}>Motorista · {turma.motorista.nome}</Text>
                  <Text style={estilos.detalhe}>{turma.totalAlunos} alunos</Text>
                </Cartao>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    />
  );
}

// Acessos da D3 do protótipo: "Nova turma" abre a D4 e o toque no cartão abre a D5 da turma.
function BotaoNovaTurma() {
  return (
    <Link href="/motorista/gestao/turmas/nova" asChild>
      <Pressable style={estilos.botao} accessibilityRole="button">
        <Text style={estilos.textoBotao}>+ Nova turma</Text>
      </Pressable>
    </Link>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  nome: { color: cores.texto, fontSize: 22, fontWeight: '700' },
  detalhe: { color: cores.textoSecundario, fontSize: 16 },
  botao: {
    minHeight: medidas.alturaBotao,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: { color: cores.textoSobreDestaque, fontSize: 16, fontWeight: '700' },
});
