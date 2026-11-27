import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EvitarTeclado } from '@/components/EvitarTeclado';
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

type Campos = Partial<Record<'nome' | 'email' | 'senha', string>>;

// Mesmo limite e mesma mensagem do backend (`CadastroRequisicao`).
const SENHA_MINIMA = 6;
const MENSAGEM_SENHA = 'A senha precisa ter de 6 a 72 caracteres.';

// A1 é a tela anterior; se a A2 foi aberta direto, volta substituindo a pilha.
function irParaEntrar() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/entrar');
  }
}

// A2: criar conta de aluno. Depois do cadastro o aluno já está logado; o layout (auth)
// manda para o índice, que abre a tela inicial do aluno (a A3, enquanto ele não tem turma).
export default function CriarConta() {
  const { cadastrar } = useSessao();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Campos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoCriar() {
    if (enviando) {
      return;
    }
    const novos: Campos = {};
    if (nome.trim() === '') {
      novos.nome = 'Informe o nome.';
    }
    if (email.trim() === '') {
      novos.email = 'Informe o e-mail.';
    }
    if (senha === '') {
      novos.senha = 'Informe a senha.';
    } else if (senha.length < SENHA_MINIMA) {
      novos.senha = MENSAGEM_SENHA;
    }
    setErros(novos);
    setErroGeral(null);
    if (Object.keys(novos).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
    } catch (e) {
      if (e instanceof ErroApi && e.codigo === 'EMAIL_JA_CADASTRADO') {
        setErros({ email: e.mensagem });
      } else if (e instanceof ErroApi) {
        // 400 VALIDACAO marca os campos; outros erros aparecem acima do formulário.
        setErros(e.campos ?? {});
        setErroGeral(e.campos === null ? e.mensagem : null);
      } else {
        setErroGeral('Não foi possível criar a conta. Tente de novo.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <EvitarTeclado style={estilos.corpo}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.topo}>
            <Cabecalho titulo="Criar conta" voltar onVoltar={irParaEntrar} />
          </View>

          <View style={estilos.principal}>
            <Text style={estilos.apoio}>
              Conta de aluno. Depois do cadastro, o motorista vincula você à sua van.
            </Text>

            <View style={estilos.formulario}>
              {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}
              <CampoTexto
                rotulo="Nome completo"
                placeholder="Como o motorista conhece você"
                value={nome}
                onChangeText={setNome}
                erro={erros.nome}
                editable={!enviando}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                maxLength={100}
                returnKeyType="next"
              />
              <CampoTexto
                rotulo="E-mail"
                placeholder="voce@email.com"
                value={email}
                onChangeText={setEmail}
                erro={erros.email}
                editable={!enviando}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <CampoTexto
                rotulo="Senha"
                placeholder="Crie uma senha"
                senha
                value={senha}
                onChangeText={setSenha}
                erro={erros.senha}
                editable={!enviando}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                maxLength={72}
                returnKeyType="go"
                onSubmitEditing={aoCriar}
              />
              <Botao
                rotulo="Criar conta"
                carregando={enviando}
                onPress={aoCriar}
                style={estilos.botao}
              />
            </View>
          </View>

          <View style={estilos.rodape}>
            <Text style={estilos.pergunta}>Já tem conta?</Text>
            <Botao
              rotulo="Entrar"
              variante="texto"
              desabilitado={enviando}
              onPress={irParaEntrar}
            />
          </View>
        </ScrollView>
      </EvitarTeclado>
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
    flexGrow: 1,
  },
  topo: {
    paddingTop: 12,
  },
  principal: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: medidas.margemTela + 4,
    gap: 28,
  },
  apoio: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  formulario: {
    gap: 18,
  },
  botao: {
    marginTop: 6,
  },
  rodape: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 32,
    paddingBottom: 28,
  },
  pergunta: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 15,
  },
});
