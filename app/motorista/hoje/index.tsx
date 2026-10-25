import { Link, router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Contadores } from '@/components/Contadores';
import { TelaDados } from '@/components/TelaDados';
import { useSessao } from '@/contexts/SessaoContext';
import { listarTurmasDoMotorista } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export default function InicioMotorista() {
  const { usuario } = useSessao();
  const carregar = useCallback(() => listarTurmasDoMotorista(), []);

  return (
    <TelaDados
      carregar={carregar}
      titulo={usuario?.admin ? 'Olá, Vanderlei' : `Olá, ${usuario?.nome ?? ''}`}
      subtitulo="Acompanhe a presença de hoje em cada turma."
      vazio={(turmas) => turmas.length === 0}
      mensagemVazia={
        usuario?.admin ? 'Você não conduz nenhuma turma.' : 'Você não tem turma cadastrada.'
      }
      acaoVazia={
        usuario?.admin ? (
          <Pressable onPress={() => router.push('/motorista/grupo')} style={estilos.botaoContorno}>
            <Text style={estilos.textoBotaoContorno}>Ver grupos</Text>
          </Pressable>
        ) : null
      }
      renderizar={(turmas) => (
        <View style={estilos.lista}>
          {turmas.map((turma) => (
            <Cartao key={turma.id}>
              <View>
                <Text style={estilos.nome}>
                  {turma.grupo.nome} · {turma.nome}
                </Text>
                <Text style={estilos.horarios}>
                  Ida {turma.grupo.horarioSaidaIda} · Volta {turma.grupo.horarioSaidaVolta}
                </Text>
              </View>
              {turma.semConfirmacoes ? (
                <Text style={estilos.descricao}>Hoje: ninguém confirmou ainda</Text>
              ) : (
                <Contadores {...turma.contadores} />
              )}
              {turma.contadores.canceladosAposSaida > 0 && (
                <Text style={estilos.cancelamento}>
                  {turma.contadores.canceladosAposSaida} aluno cancelou depois da saída
                </Text>
              )}
              <Link href={`/motorista/hoje/${turma.id}`} asChild>
                <Pressable style={turma.semConfirmacoes ? estilos.botaoContorno : estilos.botao}>
                  <Text
                    style={turma.semConfirmacoes ? estilos.textoBotaoContorno : estilos.textoBotao}
                  >
                    Acessar turma
                  </Text>
                </Pressable>
              </Link>
            </Cartao>
          ))}
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 12 },
  nome: { color: cores.texto, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  horarios: { color: cores.textoSecundario, fontSize: 16 },
  descricao: { color: cores.textoSecundario, fontSize: 16 },
  cancelamento: { color: cores.perigo, fontSize: 16, fontWeight: '600' },
  botao: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: { color: cores.textoSobreDestaque, fontSize: 16, fontWeight: '700' },
  botaoContorno: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoBotaoContorno: { color: cores.texto, fontSize: 16, fontWeight: '700' },
});
