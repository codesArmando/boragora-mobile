import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoErro } from '@/components/EstadoErro';
import { PerfilConta } from '@/components/PerfilConta';
import { Tela } from '@/components/Tela';
import { useSessao } from '@/contexts/SessaoContext';
import { listarMinhasTurmas } from '@/repositories/planoRepository';
import type { TurmaDoAluno } from '@/types/plano';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';

export default function ContaAluno() {
  const { usuario, sair } = useSessao();
  const [turmas, setTurmas] = useState<TurmaDoAluno[] | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try { setTurmas(await listarMinhasTurmas()); }
    catch (falha) { setErro(falha); }
    finally { setCarregando(false); }
  }, []);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  async function encerrarSessao() {
    setSaindo(true);
    try { await sair(); }
    finally { setSaindo(false); }
  }

  if (usuario === null) return null;

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Conta</Text>
        <PerfilConta usuario={usuario} aoSair={() => void encerrarSessao()} ocupado={saindo} />
        <Text style={estilos.tituloSecao}>Minhas turmas</Text>
        {carregando && turmas === null ? <Carregando /> : erro !== null && turmas === null ? (
          <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
        ) : turmas?.length === 0 ? (
          <Text style={estilos.vazio}>Você ainda não está em nenhuma turma.</Text>
        ) : (
          <View style={estilos.lista}>
            {turmas?.map((turma) => (
              <Cartao key={turma.id}>
                <Text style={estilos.nomeTurma}>{turma.grupo.nome} · {turma.nome}</Text>
                <Text style={estilos.detalhe}>Motorista: {turma.motorista.nome}</Text>
              </Cartao>
            ))}
          </View>
        )}
        {erro !== null && turmas !== null && <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />}
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingBottom: 30, gap: 12 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 32, fontStyle: 'italic' },
  tituloSecao: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 23, fontStyle: 'italic', marginTop: 10 },
  lista: { gap: 12 },
  nomeTurma: { color: cores.texto, fontFamily: tipografia.numero, fontSize: 20 },
  detalhe: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 15 },
  vazio: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
});
