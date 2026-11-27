import Feather from '@expo/vector-icons/Feather';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { iniciais } from '@/components/LinhaAluno';
import { TelaDados } from '@/components/TelaDados';
import { TokenPushDev } from '@/components/TokenPushDev';
import { useSessao } from '@/contexts/SessaoContext';
import { listarMinhasTurmas } from '@/repositories/planoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

// B9: conta do aluno (ACE-03), no mesmo formato da conta do motorista (C6).
export default function ContaAluno() {
  const { usuario, sair } = useSessao();
  const [saindo, setSaindo] = useState(false);
  const carregar = useCallback(() => listarMinhasTurmas(), []);

  async function encerrarSessao() {
    setSaindo(true);
    try {
      await sair();
    } finally {
      setSaindo(false);
    }
  }

  return (
    <TelaDados
      carregar={carregar}
      titulo="Conta"
      renderizar={(turmas) => (
        <View style={estilos.conteudo}>
          {usuario && (
            <View style={estilos.perfil}>
              <View style={estilos.avatar}>
                <Text style={estilos.iniciais}>{iniciais(usuario.nome)}</Text>
              </View>
              <View style={estilos.dados}>
                <Text style={estilos.nome}>{usuario.nome}</Text>
                <Text style={estilos.email}>{usuario.email}</Text>
              </View>
            </View>
          )}
          {turmas.length > 0 ? (
            <>
              <Text style={estilos.rotulo}>MINHAS TURMAS</Text>
              <Cartao>
                {turmas.map((turma, i) => (
                  <View key={turma.id} style={[estilos.turma, i > 0 && estilos.turmaSeguinte]}>
                    <Text style={estilos.turmaNome}>
                      {turma.grupo.nome} · {turma.nome}
                    </Text>
                    <Text style={estilos.turmaDetalhe}>
                      Motorista {turma.motorista.nome} · ida {turma.grupo.horarioSaidaIda}, volta{' '}
                      {turma.grupo.horarioSaidaVolta}
                    </Text>
                  </View>
                ))}
              </Cartao>
              <Text style={estilos.nota}>Quem vincula você a uma turma é o motorista.</Text>
            </>
          ) : (
            <Text style={estilos.nota}>
              Você ainda não está em nenhuma turma. Quem vincula você a uma turma é o motorista.
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => void encerrarSessao()}
            disabled={saindo}
            style={estilos.sair}
          >
            <Feather name="log-out" size={20} color={cores.texto} />
            <Text style={estilos.textoSair}>{saindo ? 'Saindo…' : 'Sair'}</Text>
          </Pressable>
          {__DEV__ && <TokenPushDev />}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 16 },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: 32,
  },
  iniciais: { color: cores.textoSobreDestaque, fontFamily: tipografia.numero, fontSize: 22 },
  dados: { flex: 1, gap: 4 },
  nome: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 20 },
  email: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 15 },
  rotulo: {
    marginTop: 8,
    color: cores.textoApagado,
    fontFamily: tipografia.texto.negrito,
    fontSize: 13,
    letterSpacing: 1,
  },
  turma: { gap: 4, paddingVertical: 4 },
  turmaSeguinte: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: cores.borda,
  },
  turmaNome: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 17 },
  turmaDetalhe: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 14,
  },
  nota: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
  sair: {
    minHeight: medidas.alturaBotao,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoSair: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 17 },
});
