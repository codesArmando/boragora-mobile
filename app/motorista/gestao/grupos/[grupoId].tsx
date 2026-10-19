import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao';
import { EstadoErro } from '@/components/EstadoErro';
import { FormularioGrupo } from '@/components/FormularioGrupo';
import { atualizarGrupo, buscarGrupo, excluirGrupo } from '@/repositories/grupoRepository';
import { cores } from '@/theme/cores';
import type { Grupo } from '@/types/grupo';

// D2b: editar e excluir grupo. A exclusão passa por confirmação (convenção 8) e o backend
// recusa grupo com turmas (409 GRUPO_COM_TURMAS), com a orientação na mensagem.
export default function EditarGrupo() {
  const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
  const id = Number(grupoId);

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExcluir, setErroExcluir] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!Number.isInteger(id)) {
      setErro('Grupo não encontrado.');
      return;
    }
    try {
      setGrupo(await buscarGrupo(id));
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar o grupo.');
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function excluir() {
    setExcluindo(true);
    try {
      await excluirGrupo(id);
      setConfirmando(false);
      router.back();
    } catch (e) {
      setConfirmando(false);
      setErroExcluir(e instanceof Error ? e.message : 'Não foi possível excluir o grupo.');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho titulo="Editar grupo" />

      {grupo === null && erro === null && <Carregando />}
      {grupo === null && erro !== null && (
        <EstadoErro
          mensagem={erro}
          onTentarDeNovo={() => {
            setErro(null);
            void carregar();
          }}
        />
      )}

      {grupo !== null && (
        <>
          <FormularioGrupo
            inicial={{
              nome: grupo.nome,
              periodo: grupo.periodo,
              horarioSaidaIda: grupo.horarioSaidaIda,
              horarioSaidaVolta: grupo.horarioSaidaVolta,
            }}
            rotuloSalvar="Salvar alterações"
            ocupado={excluindo}
            erroExterno={erroExcluir}
            onSalvar={async (requisicao) => {
              setErroExcluir(null);
              await atualizarGrupo(grupo.id, requisicao);
              router.back();
            }}
            rodape={
              <>
                <Botao
                  rotulo="Excluir grupo"
                  variante="perigoContorno"
                  onPress={() => {
                    setErroExcluir(null);
                    setConfirmando(true);
                  }}
                />
                <Text style={estilos.dica}>
                  Só dá para excluir um grupo sem turmas. Exclua as turmas dele antes.
                </Text>
              </>
            }
          />
          <DialogoConfirmacao
            visivel={confirmando}
            titulo="Excluir este grupo?"
            mensagem={`O grupo ${grupo.nome} será apagado. Essa ação não pode ser desfeita.`}
            rotuloConfirmar="Excluir grupo"
            rotuloCancelar="Manter grupo"
            carregando={excluindo}
            onConfirmar={excluir}
            onCancelar={() => setConfirmando(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  dica: {
    color: cores.textoApagado,
    fontSize: 14,
    textAlign: 'center',
  },
});
