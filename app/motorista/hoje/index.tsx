import { Link, router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Contadores } from '@/components/Contadores';
import { TelaDados } from '@/components/TelaDados';
import { useSessao } from '@/contexts/SessaoContext';
import { listarTurmasDoMotorista } from '@/repositories/turmaRepository';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';
import { medidas } from '@/theme/medidas';
import { dataPorExtenso, primeiroNome } from '@/utils/data';

export default function InicioMotorista() {
  const { usuario } = useSessao();
  const carregar = useCallback(() => listarTurmasDoMotorista(), []);

  return (
    <TelaDados
      carregar={carregar}
      sobretitulo={dataPorExtenso()}
      // Primeiro nome de quem está logado, como no protótipo ("Olá, Vanderlei").
      titulo={`Olá, ${primeiroNome(usuario?.nome)}`}
      subtitulo="Acompanhe a presença de hoje em cada turma."
      vazio={(turmas) => turmas.length === 0}
      iconeVazio="truck"
      tituloVazio={
        usuario?.admin ? 'Você não conduz nenhuma turma' : 'Você ainda não conduz nenhuma turma'
      }
      mensagemVazia={
        usuario?.admin
          ? 'Acompanhe o dia de todas as turmas na aba Grupo. Cadastros e vínculos ficam na aba Gestão.'
          : 'O motorista-chefe define a turma de cada motorista. Enquanto isso, acompanhe os grupos na aba Grupo.'
      }
      acaoVazia={
        <Pressable
          onPress={() => router.push('/motorista/grupo')}
          style={[estilos.botaoContorno, estilos.botaoVazio]}
          accessibilityRole="button"
        >
          <Text style={estilos.textoBotaoContorno}>Ver grupos</Text>
        </Pressable>
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
                  {turma.contadores.canceladosAposSaida === 1
                    ? '1 aluno cancelou depois da saída'
                    : `${turma.contadores.canceladosAposSaida} alunos cancelaram depois da saída`}
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
  nome: { fontFamily: tipografia.titulo, color: cores.texto, fontSize: 26 },
  horarios: { fontFamily: tipografia.texto.regular, color: cores.textoSecundario, fontSize: 16 },
  descricao: { fontFamily: tipografia.texto.regular, color: cores.textoSecundario, fontSize: 16 },
  cancelamento: { fontFamily: tipografia.texto.semibold, color: cores.perigo, fontSize: 16 },
  botao: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: medidas.raioBotao,
  },
  textoBotao: {
    fontFamily: tipografia.texto.negrito,
    color: cores.textoSobreDestaque,
    fontSize: 16,
  },
  botaoVazio: { paddingHorizontal: 24, marginTop: 8 },
  botaoContorno: {
    minHeight: medidas.alturaBotao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.bordaBotaoSecundario,
    borderRadius: medidas.raioBotao,
  },
  textoBotaoContorno: { fontFamily: tipografia.texto.negrito, color: cores.texto, fontSize: 16 },
});
