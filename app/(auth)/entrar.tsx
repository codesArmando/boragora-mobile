import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EvitarTeclado } from '@/components/EvitarTeclado';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErroApi } from '@/api/ErroApi';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { Logo } from '@/components/Logo';
import { useSessao } from '@/contexts/SessaoContext';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

type Campos = Partial<Record<'email' | 'senha', string>>;

// A1: entrar. Depois do login, o layout (auth) manda para o índice, que escolhe a tela
// inicial pelo papel (FND-07). Erro de login mostra a mensagem do backend e mantém o e-mail.
export default function Entrar() {
  const { entrar, sessaoExpirada } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Campos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function aoEntrar() {
    if (entrando) {
      return;
    }
    const novos: Campos = {};
    if (email.trim() === '') {
      novos.email = 'Informe o e-mail.';
    }
    if (senha === '') {
      novos.senha = 'Informe a senha.';
    }
    setErros(novos);
    setErroGeral(null);
    if (Object.keys(novos).length > 0) {
      return;
    }

    setEntrando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      if (e instanceof ErroApi) {
        setErros(e.campos ?? {});
        setErroGeral(e.campos === null ? e.mensagem : null);
      } else {
        setErroGeral('Não foi possível entrar. Tente de novo.');
      }
    } finally {
      setEntrando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <EvitarTeclado style={estilos.corpo}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.principal}>
            <View style={estilos.logo}>
              <Logo largura={300} />
            </View>

            <View style={estilos.formulario}>
              {sessaoExpirada && erroGeral === null && (
                <Aviso titulo="Sua sessão expirou" texto="Entre de novo para continuar." />
              )}
              {erroGeral !== null && <Aviso tom="alerta" titulo={erroGeral} />}
              <CampoTexto
                rotulo="E-mail"
                placeholder="voce@email.com"
                value={email}
                onChangeText={setEmail}
                erro={erros.email}
                editable={!entrando}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <CampoTexto
                rotulo="Senha"
                placeholder="Sua senha"
                senha
                value={senha}
                onChangeText={setSenha}
                erro={erros.senha}
                editable={!entrando}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={aoEntrar}
              />
              <Botao
                rotulo="Entrar"
                carregando={entrando}
                onPress={aoEntrar}
                style={estilos.botao}
              />
            </View>
          </View>

          <View style={estilos.rodape}>
            <Text style={estilos.pergunta}>É aluno e ainda não tem conta?</Text>
            <Botao
              rotulo="Criar conta"
              variante="texto"
              desabilitado={entrando}
              onPress={() => router.push('/criar-conta')}
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
    justifyContent: 'space-between',
    paddingHorizontal: medidas.margemTela + 4,
  },
  principal: {
    paddingTop: 80,
    gap: 44,
  },
  logo: {
    alignItems: 'center',
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
