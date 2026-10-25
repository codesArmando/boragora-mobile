import { useCallback, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { ListaAtualizavel } from '@/components/ListaAtualizavel';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export function TelaDados<T>({
  carregar,
  renderizar,
  titulo,
  subtitulo,
  vazio,
  mensagemVazia = 'Nenhum item para mostrar.',
  acaoVazia,
  recarregarAoFocar = true,
}: {
  carregar: () => Promise<T>;
  renderizar: (dados: T) => ReactNode;
  titulo: string;
  subtitulo?: string;
  vazio?: (dados: T) => boolean;
  mensagemVazia?: string;
  acaoVazia?: ReactNode;
  recarregarAoFocar?: boolean;
}) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const buscar = useCallback(
    async (puxado = false) => {
      if (puxado) setAtualizando(true);
      else setCarregando(true);
      setErro(null);
      try {
        setDados(await carregar());
      } catch (falha) {
        setErro(falha);
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [carregar],
  );

  useFocusEffect(
    useCallback(() => {
      if (recarregarAoFocar) void buscar();
    }, [buscar, recarregarAoFocar]),
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <ListaAtualizavel atualizando={atualizando} aoAtualizar={() => void buscar(true)}>
        <View style={estilos.conteudo}>
          <Text style={estilos.titulo}>{titulo}</Text>
          {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
          {carregando && dados === null ? (
            <Carregando />
          ) : erro !== null && dados === null ? (
            <EstadoErro erro={erro} tentarNovamente={() => void buscar()} />
          ) : dados !== null && vazio?.(dados) ? (
            <EstadoVazio mensagem={mensagemVazia}>{acaoVazia}</EstadoVazio>
          ) : dados !== null ? (
            <View>{renderizar(dados)}</View>
          ) : null}
          {dados !== null && erro !== null && (
            <EstadoErro erro={erro} tentarNovamente={() => void buscar()} />
          )}
        </View>
      </ListaAtualizavel>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: medidas.margemTela, gap: 12 },
  titulo: { color: cores.texto, fontSize: 32, fontWeight: '800', fontStyle: 'italic' },
  subtitulo: { color: cores.textoSecundario, fontSize: 18 },
});
