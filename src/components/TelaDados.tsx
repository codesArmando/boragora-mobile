import { useCallback, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotaoVoltar } from '@/components/BotaoVoltar';
import { Carregando } from '@/components/Carregando';
import { EstadoErro } from '@/components/EstadoErro';
import { EstadoVazio } from '@/components/EstadoVazio';
import { EvitarTeclado } from '@/components/EvitarTeclado';
import { ListaAtualizavel } from '@/components/ListaAtualizavel';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

export function TelaDados<T>({
  carregar,
  renderizar,
  titulo,
  sobretitulo,
  subtitulo,
  vazio,
  mensagemVazia = 'Nenhum item para mostrar.',
  acaoVazia,
  tituloVazio,
  iconeVazio,
  recarregarAoFocar = true,
  margemTopo = true,
  voltar = false,
}: {
  carregar: () => Promise<T>;
  renderizar: (dados: T) => ReactNode;
  titulo: string;
  /** Linha pequena acima do título (a data, na C0). */
  sobretitulo?: string;
  subtitulo?: string;
  vazio?: (dados: T) => boolean;
  mensagemVazia?: string;
  acaoVazia?: ReactNode;
  /** Estado vazio em destaque, com título e ícone (C0b). */
  tituloVazio?: string;
  iconeVazio?: ComponentProps<typeof EstadoVazio>['icone'];
  recarregarAoFocar?: boolean;
  /** `false` quando a tela já tem um cabeçalho próprio acima (evita a margem dobrada). */
  margemTopo?: boolean;
  /** Mostra a seta de voltar acima do conteúdo. Usar em toda tela empilhada (não inicial da aba). */
  voltar?: boolean;
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

  // Carrega sempre na primeira vez; `recarregarAoFocar` só decide se recarrega ao voltar
  // para a tela. Antes, com `false`, a tela nunca carregava e ficava no indicador.
  const jaCarregou = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (recarregarAoFocar || !jaCarregou.current) {
        jaCarregou.current = true;
        void buscar();
      }
    }, [buscar, recarregarAoFocar]),
  );

  return (
    <SafeAreaView style={estilos.tela} edges={margemTopo ? ['top'] : []}>
      {voltar && (
        <View style={estilos.barraVoltar}>
          <BotaoVoltar />
        </View>
      )}
      <EvitarTeclado>
        <ListaAtualizavel atualizando={atualizando} aoAtualizar={() => void buscar(true)}>
          <View style={estilos.conteudo}>
            {sobretitulo ? <Text style={estilos.sobretitulo}>{sobretitulo}</Text> : null}
            {titulo !== '' ? <Text style={estilos.titulo}>{titulo}</Text> : null}
            {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
            {carregando && dados === null ? (
              <Carregando />
            ) : erro !== null && dados === null ? (
              <EstadoErro erro={erro} tentarNovamente={() => void buscar()} />
            ) : dados !== null && vazio?.(dados) ? (
              <EstadoVazio mensagem={mensagemVazia} titulo={tituloVazio} icone={iconeVazio}>
                {acaoVazia}
              </EstadoVazio>
            ) : dados !== null ? (
              <View>{renderizar(dados)}</View>
            ) : null}
            {dados !== null && erro !== null && (
              <EstadoErro erro={erro} tentarNovamente={() => void buscar()} />
            )}
          </View>
        </ListaAtualizavel>
      </EvitarTeclado>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  barraVoltar: { paddingHorizontal: 12 },
  conteudo: { padding: medidas.margemTela, gap: 12 },
  sobretitulo: { color: cores.textoApagado, fontFamily: tipografia.texto.medio, fontSize: 14 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 32 },
  subtitulo: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
});
