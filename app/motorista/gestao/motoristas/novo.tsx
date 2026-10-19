import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErroApi } from '@/api/ErroApi';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { criarMotorista } from '@/repositories/motoristaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Campos = Partial<Record<'nome' | 'email' | 'senha' | 'confirmacao', string>>;

const SENHA_MINIMA = 6;

// D7: novo motorista. A conferência de "Confirmar senha" é só do app: o backend recebe
// `nome`, `email` e `senha` (decisão 9 do plano).
export default function NovoMotorista() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Campos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function cadastrar() {
    const novos: Campos = {};
    if (nome.trim() === '') {
      novos.nome = 'Informe o nome do motorista.';
    }
    if (email.trim() === '') {
      novos.email = 'Informe o e-mail do motorista.';
    }
    if (senha.length < SENHA_MINIMA) {
      novos.senha = `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`;
    }
    if (confirmacao !== senha) {
      novos.confirmacao = 'As senhas não são iguais.';
    }
    setErros(novos);
    setErroGeral(null);
    if (Object.keys(novos).length > 0) {
      return;
    }

    setSalvando(true);
    try {
      await criarMotorista({ nome: nome.trim(), email: email.trim(), senha });
      router.back();
    } catch (e) {
      if (e instanceof ErroApi) {
        setErros(e.campos ?? {});
        setErroGeral(e.campos === null ? e.mensagem : null);
      } else {
        setErroGeral('Não foi possível cadastrar o motorista.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Novo motorista" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.corpo}
      >
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}
          <Text style={estilos.explicacao}>
            O motorista entra no app com este e-mail e esta senha. Depois, defina a turma dele em
            Gestão › Turmas.
          </Text>
          <CampoTexto
            rotulo="Nome completo"
            placeholder="Nome do motorista"
            value={nome}
            onChangeText={setNome}
            erro={erros.nome}
            editable={!salvando}
            autoCapitalize="words"
          />
          <CampoTexto
            rotulo="E-mail"
            placeholder="motorista@email.com"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            editable={!salvando}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CampoTexto
            rotulo="Senha de acesso"
            placeholder="Crie uma senha para ele"
            senha
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            editable={!salvando}
          />
          <CampoTexto
            rotulo="Confirmar senha"
            placeholder="Digite a senha novamente"
            senha
            value={confirmacao}
            onChangeText={setConfirmacao}
            erro={erros.confirmacao}
            editable={!salvando}
          />
        </ScrollView>
        <View style={estilos.rodape}>
          <Botao rotulo="Cadastrar motorista" carregando={salvando} onPress={cadastrar} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  corpo: {
    flex: 1,
  },
  conteudo: {
    padding: medidas.margemTela + 4,
    paddingTop: 16,
    gap: 20,
  },
  explicacao: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
  rodape: {
    paddingHorizontal: medidas.margemTela + 4,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
