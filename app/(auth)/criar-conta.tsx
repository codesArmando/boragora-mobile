import { router } from 'expo-router';
import { useState } from 'react';
import {
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
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { useSessao } from '@/contexts/SessaoContext';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

type Campos = { nome?: string; email?: string; senha?: string };

// A2: cadastro de aluno (ACE-02). `POST /auth/cadastro` já devolve o token, então a pessoa
// entra direto e o índice a leva para a tela inicial do aluno (A3 enquanto não tem turma).
export default function CriarConta() {
  const { cadastrar } = useSessao();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Campos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function aoCriar() {
    const novos: Campos = {};
    if (nome.trim() === '') novos.nome = 'Informe o nome.';
    if (email.trim() === '') novos.email = 'Informe o e-mail.';
    if (senha.length < 6) novos.senha = 'A senha precisa ter de 6 a 72 caracteres.';
    setErros(novos);
    setErroGeral(null);
    if (Object.keys(novos).length > 0) return;

    setSalvando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
    } catch (e) {
      if (e instanceof ErroApi && e.codigo === 'EMAIL_JA_CADASTRADO') {
        // A API devolve 409 sem `campos`; o erro vai para o campo de e-mail.
        setErros({ email: e.mensagem });
      } else if (e instanceof ErroApi && e.campos) {
        setErros(e.campos);
      } else {
        setErroGeral(e instanceof ErroApi ? e.mensagem : 'Não foi possível criar a conta.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Criar conta" voltar />
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={estilos.apoio}>
            Conta de aluno. Depois do cadastro, o motorista vincula você à sua van.
          </Text>
          {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}
          <CampoTexto
            rotulo="Nome completo"
            placeholder="Como o motorista conhece você"
            value={nome}
            onChangeText={setNome}
            erro={erros.nome}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />
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
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            senha
            autoComplete="new-password"
            textContentType="newPassword"
            onSubmitEditing={aoCriar}
          />
          <Botao rotulo="Criar conta" carregando={salvando} onPress={aoCriar} />
        </ScrollView>
        <View style={estilos.rodape}>
          <Text style={estilos.rodapeTexto}>Já tem conta?</Text>
          <Pressable accessibilityRole="link" onPress={() => router.back()} hitSlop={12}>
            <Text style={estilos.link}>Entrar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { gap: 18, padding: medidas.margemTela, paddingTop: 8 },
  apoio: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 23,
  },
  rodape: { alignItems: 'center', gap: 10, paddingTop: 12, paddingBottom: 28 },
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
