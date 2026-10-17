import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { setAuthToken, urlBase } from '@/api/api';
import { ErroApi } from '@/api/ErroApi';
import { CHAVE_TOKEN, useSessao } from '@/contexts/SessaoContext';
import { verificarApi } from '@/repositories/healthRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

// Painéis provisórios para testar a sessão no aparelho (FND-05 a FND-07). O de entrar sai
// com a A1 real (ACE-01); o de conta, com a B9 (ACE-03) e a C6 (ACE-04).

function mensagemDe(erro: unknown) {
  return erro instanceof ErroApi ? erro.mensagem : String(erro);
}

function useAcao() {
  const [ocupado, setOcupado] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  async function executar(acao: () => Promise<string | null>) {
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

  return { ocupado, resultado, executar };
}

// Teste de conexão (FND-05) e login. Depois de entrar, o índice redireciona pelo papel.
export function PainelEntrarProvisorio() {
  const { entrar } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { ocupado, resultado, executar } = useAcao();

  return (
    <View style={estilos.painel}>
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
        destaque
        desabilitado={ocupado}
        onPress={() => executar(async () => (await entrar(email, senha), null))}
      />
      <BotaoTeste
        rotulo="Testar conexão com a API"
        desabilitado={ocupado}
        onPress={() =>
          executar(async () => `API no ar (${(await verificarApi()).status}) em ${urlBase()}`)
        }
      />
      {resultado !== null && <Text style={estilos.resultado}>{resultado}</Text>}
    </View>
  );
}

// Usuário logado, `GET /me`, simulação de token expirado e "Sair".
export function PainelContaProvisorio() {
  const { usuario, recarregarUsuario, sair } = useSessao();
  const { ocupado, resultado, executar } = useAcao();

  // Simula um token expirado: grava um token inválido, como se o de 1 dia tivesse vencido.
  async function invalidarToken() {
    await SecureStore.setItemAsync(CHAVE_TOKEN, 'token-invalido');
    setAuthToken('token-invalido');
    return 'Token invalidado. Toque em "Chamar GET /me" ou feche e abra o app.';
  }

  if (usuario === null) {
    return null;
  }
  const { nome, email, papel, admin } = usuario;

  return (
    <View style={estilos.painel}>
      <Text style={estilos.resultado}>
        {nome} ({email}) · {papel}
        {admin ? ' · admin' : ''}
      </Text>
      <BotaoTeste
        rotulo="Chamar GET /me"
        desabilitado={ocupado}
        onPress={() => executar(async () => `GET /me ok: ${(await recarregarUsuario()).nome}`)}
      />
      <BotaoTeste
        rotulo="Invalidar token (simula expiração)"
        desabilitado={ocupado}
        onPress={() => executar(invalidarToken)}
      />
      <BotaoTeste
        rotulo="Sair"
        desabilitado={ocupado}
        onPress={() => executar(async () => (await sair(), null))}
      />
      {resultado !== null && <Text style={estilos.resultado}>{resultado}</Text>}
    </View>
  );
}

type BotaoTesteProps = {
  rotulo: string;
  destaque?: boolean;
  desabilitado: boolean;
  onPress: () => void;
};

function BotaoTeste({ rotulo, destaque = false, desabilitado, onPress }: BotaoTesteProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={destaque ? estilos.botao : estilos.botaoContorno}
    >
      <Text style={destaque ? estilos.textoBotao : estilos.textoBotaoContorno}>{rotulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  painel: {
    marginTop: 24,
    gap: 10,
  },
  resultado: {
    color: cores.textoSecundario,
    fontSize: 14,
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
  botao: {
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
