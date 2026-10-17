import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { setAuthToken, urlBase } from '@/api/api';
import { ErroApi } from '@/api/ErroApi';
import { TelaProvisoria } from '@/components/TelaProvisoria';
import { CHAVE_TOKEN, useSessao } from '@/contexts/SessaoContext';
import { verificarApi } from '@/repositories/healthRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// Mapa de rotas do esqueleto (FND-01), para cada trilha abrir as suas telas sem login.
// A FND-07 troca esta tela pelo redirecionamento conforme a sessão e o papel.
export default function Index() {
  const [verificando, setVerificando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  // Teste de conexão da FND-05: confere se o aparelho alcança a API.
  async function testarConexao() {
    setVerificando(true);
    setResultado(null);
    try {
      const resposta = await verificarApi();
      setResultado(`API no ar (${resposta.status}) em ${urlBase()}`);
    } catch (erro) {
      setResultado(erro instanceof ErroApi ? erro.mensagem : String(erro));
    } finally {
      setVerificando(false);
    }
  }

  return (
    <TelaProvisoria
      telas="Mapa de rotas"
      titulo="Boragora Viagens"
      entrega="FND-07"
      links={[
        { rotulo: 'Acesso: Entrar (A1)', href: '/entrar' },
        { rotulo: 'Acesso: Criar conta (A2)', href: '/criar-conta' },
        { rotulo: 'Aluno: Hoje', href: '/aluno/hoje' },
        { rotulo: 'Aluno: Grupo', href: '/aluno/grupo' },
        { rotulo: 'Aluno: Conta', href: '/aluno/conta' },
        { rotulo: 'Motorista: Hoje', href: '/motorista/hoje' },
        { rotulo: 'Motorista: Grupo', href: '/motorista/grupo' },
        { rotulo: 'Motorista: Conta', href: '/motorista/conta' },
        { rotulo: 'Chefe: Gestão', href: '/motorista/gestao' },
      ]}
    >
      <Pressable onPress={testarConexao} disabled={verificando} style={estilos.botao}>
        <Text style={estilos.textoBotao}>
          {verificando ? 'Testando…' : 'Testar conexão com a API'}
        </Text>
      </Pressable>
      {resultado !== null && <Text style={estilos.resultado}>{resultado}</Text>}
      <PainelSessao />
    </TelaProvisoria>
  );
}

function mensagemDe(erro: unknown) {
  return erro instanceof ErroApi ? erro.mensagem : String(erro);
}

// Painel provisório da FND-06, para testar a sessão no aparelho antes da A1 (ACE-01)
// e do redirecionamento por papel (FND-07). Sai junto com o mapa de rotas.
function PainelSessao() {
  const sessao = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  async function executar(acao: () => Promise<string>) {
    setOcupado(true);
    setResultado(null);
    try {
      setResultado(await acao());
    } catch (erro) {
      setResultado(mensagemDe(erro));
    } finally {
      setOcupado(false);
    }
  }

  // Simula um token expirado: grava um token inválido, como se o de 1 dia tivesse vencido.
  async function invalidarToken() {
    await SecureStore.setItemAsync(CHAVE_TOKEN, 'token-invalido');
    setAuthToken('token-invalido');
    return 'Token invalidado. Toque em "Chamar GET /me" ou feche e abra o app.';
  }

  let situacao: string;
  if (sessao.restaurando) {
    situacao = 'Restaurando a sessão…';
  } else if (sessao.erroRestauracao !== null) {
    situacao = `Erro ao restaurar: ${sessao.erroRestauracao.mensagem}`;
  } else if (sessao.usuario !== null) {
    const { nome, email: emailUsuario, papel, admin } = sessao.usuario;
    situacao = `Logado: ${nome} (${emailUsuario}) · ${papel}${admin ? ' · admin' : ''}`;
  } else {
    situacao = 'Sem sessão';
  }

  return (
    <View style={estilos.painel}>
      <Text style={estilos.tituloPainel}>Sessão (teste da FND-06)</Text>
      <Text style={estilos.resultado}>{situacao}</Text>

      {sessao.erroRestauracao !== null && (
        <BotaoTeste rotulo="Tentar de novo" desabilitado={ocupado} onPress={sessao.restaurar} />
      )}

      {sessao.usuario === null && !sessao.restaurando && (
        <>
          <TextInput
            style={estilos.campo}
            placeholder="E-mail"
            placeholderTextColor={cores.textoApagado}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={estilos.campo}
            placeholder="Senha"
            placeholderTextColor={cores.textoApagado}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <BotaoTeste
            rotulo="Entrar"
            desabilitado={ocupado}
            onPress={() =>
              executar(async () => `Bem-vindo, ${(await sessao.entrar(email, senha)).nome}`)
            }
          />
        </>
      )}

      {sessao.usuario !== null && (
        <>
          <BotaoTeste
            rotulo="Chamar GET /me"
            desabilitado={ocupado}
            onPress={() =>
              executar(async () => `GET /me ok: ${(await sessao.recarregarUsuario()).nome}`)
            }
          />
          <BotaoTeste
            rotulo="Invalidar token (simula expiração)"
            desabilitado={ocupado}
            onPress={() => executar(invalidarToken)}
          />
          <BotaoTeste
            rotulo="Sair"
            desabilitado={ocupado}
            onPress={() => executar(async () => (await sessao.sair(), 'Sessão encerrada.'))}
          />
        </>
      )}

      {resultado !== null && <Text style={estilos.resultado}>{resultado}</Text>}
    </View>
  );
}

type BotaoTesteProps = { rotulo: string; desabilitado: boolean; onPress: () => void };

function BotaoTeste({ rotulo, desabilitado, onPress }: BotaoTesteProps) {
  return (
    <Pressable onPress={onPress} disabled={desabilitado} style={estilos.botaoContorno}>
      <Text style={estilos.textoBotaoContorno}>{rotulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    marginTop: 18,
    minHeight: medidas.alturaBotao,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: {
    color: cores.textoSobreDestaque,
    fontSize: 16,
    fontWeight: '700',
  },
  resultado: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  painel: {
    marginTop: 24,
    gap: 10,
  },
  tituloPainel: {
    color: cores.destaque,
    fontSize: 14,
    fontWeight: '700',
  },
  campo: {
    minHeight: medidas.alturaCampo,
    paddingHorizontal: 16,
    color: cores.texto,
    fontSize: 16,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: medidas.raioCampo,
  },
  botaoContorno: {
    minHeight: medidas.areaToqueMinima,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: cores.bordaBotaoSecundario,
    borderWidth: 1,
    borderRadius: medidas.raioBotao,
  },
  textoBotaoContorno: {
    color: cores.texto,
    fontSize: 16,
  },
});
