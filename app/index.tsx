import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ErroApi } from '@/api/ErroApi';
import { TelaProvisoria } from '@/components/TelaProvisoria';
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
      setResultado(`API no ar (${resposta.status}) em ${process.env.EXPO_PUBLIC_API_URL}`);
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
    </TelaProvisoria>
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
});
