import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaoAtalho } from '@/components/CartaoAtalho';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// D1: quatro cartões independentes (decisão 5 do plano). Sem lista e sem botão de cadastro.
export default function Gestao() {
  return (
    <SafeAreaView style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <Text accessibilityRole="header" style={estilos.titulo}>
            Gestão
          </Text>
          <Text style={estilos.subtitulo}>Cadastros e vínculos do sistema.</Text>
        </View>

        <CartaoAtalho
          icone="clock"
          titulo="Grupos"
          descricao="Turnos e horários de saída"
          onPress={() => router.push('/motorista/gestao/grupos')}
        />
        <CartaoAtalho
          icone="truck"
          titulo="Turmas"
          descricao="Van, motorista e alunos de cada grupo"
          onPress={() => router.push('/motorista/gestao/turmas')}
        />
        <CartaoAtalho
          icone="user-check"
          titulo="Motoristas"
          descricao="Contas de motorista"
          onPress={() => router.push('/motorista/gestao/motoristas')}
        />
        <CartaoAtalho
          icone="users"
          titulo="Alunos"
          descricao="Contas criadas e vínculo com turmas"
          onPress={() => router.push('/motorista/gestao/alunos')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: medidas.margemTela,
    gap: 12,
  },
  cabecalho: {
    gap: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  titulo: {
    color: cores.texto,
    fontSize: 32,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
});
