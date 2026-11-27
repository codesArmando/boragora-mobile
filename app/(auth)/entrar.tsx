import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErroApi } from '@/api/ErroApi';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { useSessao } from '@/contexts/SessaoContext';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

// A1: entrar com e-mail e senha (ACE-01). Depois do login, o layout de (auth) manda para o
// índice, que redireciona conforme o papel.
export default function Entrar() {
  const { entrar, sessaoExpirada } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function aoEntrar() {
    const novos: typeof erros = {};
    if (email.trim() === '') novos.email = 'Informe o e-mail.';
    if (senha === '') novos.senha = 'Informe a senha.';
    setErros(novos);
    setErroGeral(null);
    if (Object.keys(novos).length > 0) return;

    setEntrando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      if (e instanceof ErroApi && e.campos) {
        setErros(e.campos);
      } else {
        setErroGeral(e instanceof ErroApi ? e.mensagem : 'Não foi possível entrar.');
      }
    } finally {
      setEntrando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../assets/logo-boragora.png')}
            style={estilos.logo}
            resizeMode="contain"
            accessibilityLabel="Boragora Viagens"
          />
          {sessaoExpirada && (
            <Aviso tom="alerta" titulo="Sua sessão expirou" texto="Entre de novo para continuar." />
          )}
          {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}
          <CampoTexto
            rotulo="E-mail"
            placeholder="voce@email.com"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <CampoTexto
            rotulo="Senha"
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            senha
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={aoEntrar}
          />
          <Botao rotulo="Entrar" carregando={entrando} onPress={aoEntrar} />
        </ScrollView>
        <View style={estilos.rodape}>
          <Text style={estilos.rodapeTexto}>É aluno e ainda não tem conta?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/criar-conta')}
            hitSlop={12}
          >
            <Text style={estilos.link}>Criar conta</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    flexGrow: 1,
    paddingTop: 72,
    gap: 18,
    padding: medidas.margemTela,
  },
  logo: { width: '90%', height: 150, alignSelf: 'center', marginBottom: 24 },
  rodape: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    paddingBottom: 28,
  },
  rodapeTexto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 15,
  },
  link: {
    minHeight: medidas.areaToqueMinima,
    color: cores.destaque,
    fontFamily: tipografia.texto.negrito,
    fontSize: 16,
    textAlignVertical: 'center',
  },
});
