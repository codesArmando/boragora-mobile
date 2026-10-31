import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { BlocoHorarios } from '@/components/BlocoHorarios';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoErro } from '@/components/EstadoErro';
import { Tela } from '@/components/Tela';
import { useSessao } from '@/contexts/SessaoContext';
import { listarMinhasTurmas } from '@/repositories/planoRepository';
import type { TurmaDoAluno } from '@/types/plano';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

export default function InicioAluno() {
  const [turmas, setTurmas] = useState<TurmaDoAluno[] | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setTurmas(await listarMinhasTurmas());
    } catch (falha) {
      setErro(falha);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Hoje</Text>
        {carregando && turmas === null ? (
          <Carregando />
        ) : erro !== null && turmas === null ? (
          <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
        ) : turmas?.length === 0 ? (
          <SemTurma />
        ) : (
          <View style={estilos.lista}>
            {turmas?.map((turma) => (
              <Cartao key={turma.id}>
                <Text style={estilos.nomeTurma}>{turma.grupo.nome} · {turma.nome}</Text>
                <Text style={estilos.motorista}>Motorista: {turma.motorista.nome}</Text>
                <BlocoHorarios
                  horarioSaidaIda={turma.grupo.horarioSaidaIda}
                  horarioSaidaVolta={turma.grupo.horarioSaidaVolta}
                />
                <Text style={estilos.resumo}>
                  Hoje: {turma.incluiIda ? 'ida marcada' : 'ida não marcada'} · {turma.incluiVolta ? 'volta marcada' : 'volta não marcada'}
                </Text>
                <Link href={`/aluno/hoje/${turma.id}`} asChild>
                  <Pressable style={[estilos.botao, (turma.incluiIda || turma.incluiVolta) && estilos.botaoContorno]} accessibilityRole="button">
                    <Text style={[estilos.botaoTexto, (turma.incluiIda || turma.incluiVolta) && estilos.botaoTextoContorno]}>
                      {turma.incluiIda || turma.incluiVolta ? 'Alterar presença' : 'Marcar presença'}
                    </Text>
                  </Pressable>
                </Link>
              </Cartao>
            ))}
          </View>
        )}
        {erro !== null && turmas !== null && (
          <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
        )}
      </ScrollView>
    </Tela>
  );
}

function SemTurma() {
  const { usuario } = useSessao();
  return (
    <View style={estilos.semTurma}>
      <Image source={require('../../../assets/icon.png')} style={estilos.simbolo} />
      <Text style={estilos.tituloVazio}>Você ainda não está em uma van</Text>
      <Text style={estilos.textoVazio}>Peça ao motorista-chefe para vincular sua conta a uma turma.</Text>
      <Text style={estilos.email}>{usuario?.email}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingBottom: 28, gap: 18 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 32, fontStyle: 'italic' },
  lista: { gap: 14 },
  nomeTurma: { color: cores.texto, fontFamily: tipografia.numero, fontSize: 22 },
  motorista: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
  resumo: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 15 },
  botao: { minHeight: medidas.alturaBotao, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.destaque, borderRadius: medidas.raioBotao },
  botaoContorno: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.bordaBotaoSecundario },
  botaoTexto: { color: cores.textoSobreDestaque, fontFamily: tipografia.texto.negrito, fontSize: 16 },
  botaoTextoContorno: { color: cores.texto },
  semTurma: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 50 },
  simbolo: { width: 112, height: 112 },
  tituloVazio: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 26, fontStyle: 'italic', textAlign: 'center' },
  textoVazio: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16, textAlign: 'center' },
  email: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14, marginTop: 12 },
});
