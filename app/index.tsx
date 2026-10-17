import { Redirect } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSessao } from '@/contexts/SessaoContext';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// Ponto de entrada: redireciona conforme a sessão e o papel (FND-07). O chefe é MOTORISTA
// com `admin`, e usa as mesmas rotas do motorista, com a aba Gestão a mais.
export default function Index() {
  const { usuario, restaurando, erroRestauracao, restaurar } = useSessao();

  if (restaurando) {
    return (
      <View style={estilos.tela}>
        <ActivityIndicator color={cores.destaque} size="large" />
      </View>
    );
  }

  // Sem conexão ao abrir: o token continua gravado e o usuário tenta de novo (FND-06).
  if (erroRestauracao !== null) {
    return (
      <View style={estilos.tela}>
        <Text style={estilos.mensagem}>{erroRestauracao.mensagem}</Text>
        <Pressable onPress={restaurar} style={estilos.botao}>
          <Text style={estilos.textoBotao}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  if (usuario === null) {
    return <Redirect href="/entrar" />;
  }
  return <Redirect href={usuario.papel === 'ALUNO' ? '/aluno/hoje' : '/motorista/hoje'} />;
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    padding: medidas.margemTela,
    backgroundColor: cores.fundo,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: 16,
    textAlign: 'center',
  },
  botao: {
    minHeight: medidas.alturaBotao,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: {
    color: cores.textoSobreDestaque,
    fontSize: 16,
    fontWeight: '700',
  },
});
