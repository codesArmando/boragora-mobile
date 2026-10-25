import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { iniciais } from '@/components/LinhaAluno';
import { TelaDados } from '@/components/TelaDados';
import { useSessao } from '@/contexts/SessaoContext';
import { listarTurmasDoMotorista } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export default function ContaMotorista() {
  const { usuario, sair } = useSessao();
  const carregar = useCallback(() => listarTurmasDoMotorista(), []);
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
          {turmas.length > 0 && <Text style={estilos.rotulo}>MINHAS TURMAS</Text>}
          {turmas.length ? (
            <Cartao>
              {turmas.map((turma) => (
                <View key={turma.id} style={estilos.turma}>
                  <Text style={estilos.turmaNome}>
                    {turma.grupo.nome} · {turma.nome}
                  </Text>
                  <Text style={estilos.turmaDetalhe}>
                    Ida {turma.grupo.horarioSaidaIda}, volta {turma.grupo.horarioSaidaVolta}
                  </Text>
                </View>
              ))}
            </Cartao>
          ) : (
            <EstadoVazio mensagem="Você ainda não conduz nenhuma turma." />
          )}
          <Text style={estilos.nota}>
            Quem define a turma de cada motorista é o motorista-chefe.
          </Text>
          <Pressable onPress={() => void sair()} style={estilos.sair}>
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
  iniciais: { color: cores.textoSobreDestaque, fontSize: 24, fontWeight: '700' },
  dados: { flex: 1, gap: 2 },
  nome: { color: cores.texto, fontSize: 20, fontWeight: '700' },
  email: { color: cores.textoSecundario, fontSize: 15 },
  rotulo: { color: cores.textoApagado, fontSize: 13, fontWeight: '700' },
  turma: {
    minHeight: 54,
    justifyContent: 'center',
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  turmaNome: { color: cores.texto, fontSize: 17, fontWeight: '600' },
  turmaDetalhe: { color: cores.textoSecundario, fontSize: 14 },
  nota: { color: cores.textoApagado, fontSize: 14 },
  sair: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoSair: { color: cores.texto, fontSize: 17, fontWeight: '700' },
});
