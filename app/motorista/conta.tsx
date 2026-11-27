import Feather from '@expo/vector-icons/Feather';
import { useCallback } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { iniciais } from '@/components/LinhaAluno';
import { TelaDados } from '@/components/TelaDados';
import { useSessao } from '@/contexts/SessaoContext';
import { listarTurmasDoMotoristaComTotal } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';
import { medidas } from '@/theme/medidas';

export default function ContaMotorista() {
  const { usuario, sair } = useSessao();
  const carregar = useCallback(() => listarTurmasDoMotoristaComTotal(), []);
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
                {turmas.map((turma) => (
                  <View key={turma.id} style={estilos.turma}>
                    <Text style={estilos.turmaNome}>
                      {turma.grupo.nome} · {turma.nome}
                    </Text>
                    <Text style={estilos.turmaDetalhe}>
                      Ida {turma.grupo.horarioSaidaIda}, volta {turma.grupo.horarioSaidaVolta} ·{' '}
                      {turma.totalAlunos} {turma.totalAlunos === 1 ? 'aluno' : 'alunos'}
                    </Text>
                  </View>
                ))}
              </Cartao>
              <Text style={estilos.nota}>
                Quem define a turma de cada motorista é o motorista-chefe.
              </Text>
            </>
          ) : (
            <Text style={estilos.nota}>
              Você ainda não conduz nenhuma turma. Quem define a turma de cada motorista é o
              motorista-chefe.
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await sair();
              router.replace('/(auth)/entrar');
            }}
            style={estilos.sair}
          >
            <Feather name="log-out" size={20} color={cores.texto} />
            <Text style={estilos.textoSair}>Sair</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 14 },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: 32,
  },
  iniciais: { fontFamily: tipografia.texto.negrito, color: cores.textoSobreDestaque, fontSize: 24 },
  dados: { flex: 1, gap: 2 },
  nome: { fontFamily: tipografia.texto.negrito, color: cores.texto, fontSize: 20 },
  email: { fontFamily: tipografia.texto.regular, color: cores.textoSecundario, fontSize: 15 },
  rotulo: { fontFamily: tipografia.texto.negrito, color: cores.textoApagado, fontSize: 13 },
  turma: {
    minHeight: 74,
    justifyContent: 'center',
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  turmaNome: { fontFamily: tipografia.texto.semibold, color: cores.texto, fontSize: 17 },
  turmaDetalhe: {
    fontFamily: tipografia.texto.regular,
    color: cores.textoSecundario,
    fontSize: 14,
  },
  nota: { fontFamily: tipografia.texto.regular, color: cores.textoApagado, fontSize: 14 },
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
  textoSair: { fontFamily: tipografia.texto.negrito, color: cores.texto, fontSize: 17 },
});
