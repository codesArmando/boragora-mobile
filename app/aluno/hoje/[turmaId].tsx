import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao';
import { EstadoErro } from '@/components/EstadoErro';
import {
  alterarIda,
  alterarStatusVolta,
  alterarVolta,
  buscarPlano,
} from '@/repositories/planoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';
import type { PlanoDoDia, StatusVolta } from '@/types/plano';
import { dataDaApiPorExtenso } from '@/utils/data';
import { estadoDoPlano } from '@/utils/estadoDoPlano';

// B1 a B7: plano de hoje de uma turma (ALU-02 a ALU-06). Toda regra de horário vem da API
// (`acoes`, `idaSaiu`, `voltaSaiu`); a tela só escolhe o texto de cada situação.
export default function PlanoHojeAluno() {
  const { turmaId: parametro } = useLocalSearchParams<{ turmaId: string }>();
  const turmaId = Number(parametro);
  const [plano, setPlano] = useState<PlanoDoDia | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setPlano(await buscarPlano(turmaId));
    } catch (falha) {
      setErro(falha);
    } finally {
      setCarregando(false);
    }
  }, [turmaId]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function atualizar(acao: () => Promise<PlanoDoDia>) {
    setSalvando(true);
    setErro(null);
    try {
      setPlano(await acao());
    } catch (falha) {
      setErro(falha);
      // O servidor revalida o horário; com 422 o estado mudou, então recarrega.
      if (falha && typeof falha === 'object' && 'status' in falha && falha.status === 422) {
        await carregar();
      }
    } finally {
      setSalvando(false);
    }
  }

  if (plano === null) {
    return (
      <SafeAreaView style={estilos.tela} edges={['top']}>
        <Cabecalho titulo="Plano de hoje" voltar />
        <View style={estilos.conteudo}>
          {carregando || erro === null ? (
            <Carregando />
          ) : (
            <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const estado = estadoDoPlano(plano);
  const { grupo } = plano.turma;
  const ida = grupo.horarioSaidaIda;
  const volta = grupo.horarioSaidaVolta;
  const idaTravada = !(plano.incluiIda ? plano.acoes.podeCancelarIda : plano.acoes.podeIncluirIda);
  const voltaTravada = !plano.acoes.podeAlterarVolta;

  function alternarIda(incluir: boolean) {
    if (!incluir && plano?.acoes.cancelamentoIdaSeraTardio) {
      setConfirmandoCancelamento(true);
      return;
    }
    void atualizar(() => alterarIda(turmaId, incluir));
  }

  const textoIda = plano.cancelouAposSaida
    ? 'Cancelada depois da saída'
    : plano.idaSaiu && plano.incluiIda
      ? `Confirmada · ${plano.voltaSaiu ? 'saiu' : 'a van saiu'} às ${ida}`
      : plano.idaSaiu
        ? `Encerrada às ${ida}`
        : plano.incluiIda
          ? `Confirmada · sai às ${ida}`
          : `Sai às ${ida} · marque até lá`;

  const textoVolta =
    plano.voltaSaiu && plano.incluiVolta
      ? `Confirmada · saiu às ${volta}`
      : plano.voltaSaiu
        ? `Encerrada às ${volta}`
        : plano.incluiVolta
          ? `Confirmada · sai às ${volta}`
          : `Sai às ${volta} · marque até lá`;

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho
        titulo="Plano de hoje"
        subtitulo={`${dataDaApiPorExtenso(plano.data)} · ${grupo.nome} · ${plano.turma.nome}`}
        voltar
      />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <CartaoTrecho
          titulo="Ida"
          texto={textoIda}
          marcado={plano.incluiIda}
          travado={idaTravada}
          cancelado={plano.cancelouAposSaida}
          desabilitado={salvando}
          onChange={alternarIda}
        />

        {estado === 'IDA_CANCELADA' && (
          <View style={estilos.alerta}>
            <Text style={estilos.tituloAlerta}>Avise o motorista também pelo WhatsApp</Text>
            <Text style={estilos.textoAlerta}>
              Ele já recebeu a notificação do app. Confirme com ele por mensagem.
            </Text>
          </View>
        )}
        {estado === 'IDA_BLOQUEADA' && (
          <View style={estilos.alerta}>
            <Text style={estilos.tituloAlerta}>Não dá mais para incluir a ida pelo app</Text>
            <Text style={estilos.textoAlerta}>
              A van saiu às {ida}. Se ainda precisa ir, fale com o motorista pelo WhatsApp.
            </Text>
          </View>
        )}

        <CartaoTrecho
          titulo="Volta"
          texto={textoVolta}
          marcado={plano.incluiVolta}
          travado={voltaTravada}
          desabilitado={salvando}
          onChange={(incluir) => void atualizar(() => alterarVolta(turmaId, incluir))}
        />

        {plano.incluiVolta && (
          <View style={estilos.status}>
            <Text style={estilos.rotuloStatus}>STATUS DA VOLTA</Text>
            <View style={estilos.opcoesStatus} accessibilityRole="radiogroup">
              {(['EM_AULA', 'LIBERADO'] as StatusVolta[]).map((status) => {
                const ativo = plano.statusVolta === status;
                return (
                  <Pressable
                    key={status}
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: ativo,
                      disabled: !plano.acoes.podeAlterarStatusVolta,
                    }}
                    onPress={() => void atualizar(() => alterarStatusVolta(turmaId, status))}
                    disabled={salvando || ativo || !plano.acoes.podeAlterarStatusVolta}
                    style={[
                      estilos.opcao,
                      ativo &&
                        (status === 'LIBERADO' ? estilos.opcaoLiberado : estilos.opcaoEmAula),
                    ]}
                  >
                    <Text
                      style={[
                        estilos.textoOpcao,
                        ativo &&
                          (status === 'LIBERADO'
                            ? estilos.textoOpcaoLiberado
                            : estilos.textoOpcaoEmAula),
                      ]}
                    >
                      {status === 'EM_AULA' ? 'Em aula' : 'Liberado'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {plano.acoes.podeAlterarStatusVolta && (
              <Text style={estilos.dicaStatus}>Pode mudar até {volta}.</Text>
            )}
          </View>
        )}

        <Text style={estilos.aviso}>{avisoDaSituacao(plano, estado, ida, volta)}</Text>
        {erro !== null && <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />}
      </ScrollView>

      {/* B4: cancelamento da ida depois da saída. */}
      <DialogoConfirmacao
        visivel={confirmandoCancelamento}
        titulo="Cancelar a ida depois da saída?"
        mensagem={`A van saiu às ${ida}. O motorista é avisado na hora e não dá para marcar a ida de novo pelo app.`}
        rotuloConfirmar="Cancelar a ida"
        rotuloCancelar="Manter a ida"
        carregando={salvando}
        onCancelar={() => setConfirmandoCancelamento(false)}
        onConfirmar={async () => {
          await atualizar(() => alterarIda(turmaId, false));
          setConfirmandoCancelamento(false);
        }}
      />
    </SafeAreaView>
  );
}

function avisoDaSituacao(
  plano: PlanoDoDia,
  estado: ReturnType<typeof estadoDoPlano>,
  ida: string,
  volta: string,
): string {
  switch (estado) {
    case 'SEM_PLANO':
      return 'Sem nada marcado, você fica como ausente hoje e não aparece na lista do motorista.';
    case 'DECLARADO':
      return plano.incluiIda
        ? `Para cancelar a ida, é só desmarcar. Depois das ${ida} o motorista é avisado na hora.`
        : `Você pode marcar a ida até ${ida}.`;
    case 'APOS_SAIDA':
      return 'Se desmarcar a ida agora, o motorista é avisado na hora e não dá para marcar de novo pelo app.';
    case 'IDA_CANCELADA':
    case 'IDA_BLOQUEADA':
      return plano.incluiVolta
        ? 'Se também não for voltar, desmarque a volta.'
        : `Você ainda pode marcar a volta até ${volta}.`;
    case 'ENCERRADO':
      return `A volta saiu às ${volta}. O plano de hoje não pode mais ser alterado.`;
  }
}

function CartaoTrecho({
  titulo,
  texto,
  marcado,
  travado,
  cancelado = false,
  desabilitado,
  onChange,
}: {
  titulo: string;
  texto: string;
  marcado: boolean;
  travado: boolean;
  cancelado?: boolean;
  desabilitado: boolean;
  onChange: (valor: boolean) => void;
}) {
  // Amarelo quando confirmado e ainda dá para mudar; escuro com cadeado quando o horário passou.
  const destaque = marcado && !travado;
  return (
    <View
      style={[
        estilos.cartao,
        destaque && estilos.cartaoMarcado,
        cancelado && estilos.cartaoCancelado,
      ]}
    >
      <View style={estilos.textosCartao}>
        <Text style={[estilos.tituloCartao, destaque && estilos.textoSobreDestaque]}>{titulo}</Text>
        <Text
          style={[
            estilos.descricaoCartao,
            destaque && estilos.textoSobreDestaque,
            cancelado && estilos.textoCancelado,
          ]}
        >
          {texto}
        </Text>
      </View>
      {travado ? (
        <Feather name="lock" size={24} color={cores.textoApagado} accessibilityLabel="Bloqueado" />
      ) : (
        <Switch
          value={marcado}
          onValueChange={onChange}
          disabled={desabilitado}
          trackColor={{ false: cores.bordaBotaoSecundario, true: cores.textoSobreDestaque }}
          thumbColor={marcado ? cores.destaque : cores.textoSecundario}
          accessibilityLabel={`Presença na ${titulo.toLowerCase()}`}
          // O switch nativo do Android é menor que o do protótipo.
          style={Platform.OS === 'android' ? estilos.switchAndroid : undefined}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { gap: 14, padding: medidas.margemTela, paddingTop: 8, paddingBottom: 30 },
  cartao: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: medidas.raioCartao,
  },
  cartaoMarcado: { backgroundColor: cores.destaque, borderColor: cores.destaque },
  cartaoCancelado: { borderColor: cores.perigo },
  textosCartao: { flex: 1, gap: 6 },
  tituloCartao: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 30 },
  descricaoCartao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.medio,
    fontSize: 15,
  },
  textoSobreDestaque: { color: cores.textoSobreDestaque },
  switchAndroid: { transform: [{ scale: 1.3 }] },
  textoCancelado: { color: cores.perigo },
  status: { gap: 10, marginTop: 6 },
  rotuloStatus: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.negrito,
    fontSize: 13,
    letterSpacing: 1,
  },
  opcoesStatus: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: medidas.raioBotao,
  },
  opcao: {
    flex: 1,
    minHeight: medidas.areaToqueMinima + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  opcaoEmAula: { backgroundColor: cores.textoSecundario },
  opcaoLiberado: { backgroundColor: cores.liberadoFundo },
  textoOpcao: { color: cores.textoSecundario, fontFamily: tipografia.texto.semibold, fontSize: 16 },
  textoOpcaoEmAula: { color: cores.textoSobreDestaque, fontFamily: tipografia.texto.negrito },
  textoOpcaoLiberado: { color: cores.liberadoTexto, fontFamily: tipografia.texto.negrito },
  dicaStatus: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
  aviso: {
    marginTop: 6,
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 23,
  },
  alerta: {
    gap: 4,
    padding: 16,
    backgroundColor: cores.alertaFundo,
    borderRadius: medidas.raioCartao,
  },
  tituloAlerta: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 17 },
  textoAlerta: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 15,
    lineHeight: 21,
  },
});
