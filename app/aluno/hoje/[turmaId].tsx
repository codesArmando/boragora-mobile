import Feather from '@expo/vector-icons/Feather';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  usePreventRemove,
  type NavigationAction,
} from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/Botao';
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
import type { EstadoPlano, PlanoDoDia, StatusVolta } from '@/types/plano';
import { dataDaApiPorExtenso } from '@/utils/data';
import { estadoDoPlano } from '@/utils/estadoDoPlano';
import {
  alteracoesDoRascunho,
  rascunhoDe,
  temAlteracoes,
  type RascunhoDoPlano,
} from '@/utils/rascunhoDoPlano';

// B1 a B7: plano de hoje de uma turma (ALU-02 a ALU-06). Os interruptores e o status da volta
// mudam só um rascunho; o "Confirmar" grava (pedido da equipe depois dos testes manuais). Toda
// regra de horário vem da API (`acoes`, `idaSaiu`, `voltaSaiu`); a tela só escolhe os textos.
export default function PlanoHojeAluno() {
  const { turmaId: parametro } = useLocalSearchParams<{ turmaId: string }>();
  const turmaId = Number(parametro);
  const navegacao = useNavigation();
  const [plano, setPlano] = useState<PlanoDoDia | null>(null);
  const [rascunho, setRascunho] = useState<RascunhoDoPlano | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);

  const aplicar = useCallback((novo: PlanoDoDia) => {
    setPlano(novo);
    setRascunho(rascunhoDe(novo));
  }, []);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      aplicar(await buscarPlano(turmaId));
    } catch (falha) {
      setErro(falha);
    } finally {
      setCarregando(false);
    }
  }, [turmaId, aplicar]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const alteracoes = plano && rascunho ? alteracoesDoRascunho(plano, rascunho) : {};
  const pendente = temAlteracoes(alteracoes);

  // Sair com alterações não confirmadas pergunta antes de descartar. Ao descartar, a trava
  // desliga primeiro e só depois a saída bloqueada é repetida (efeito abaixo).
  const [saidaDescartada, setSaidaDescartada] = useState<NavigationAction | null>(null);
  usePreventRemove(pendente && !salvando && saidaDescartada === null, ({ data }) => {
    Alert.alert('Descartar as alterações?', 'Você mudou o plano de hoje e não confirmou.', [
      { text: 'Continuar editando', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => setSaidaDescartada(data.action) },
    ]);
  });
  useEffect(() => {
    if (saidaDescartada !== null) navegacao.dispatch(saidaDescartada);
  }, [saidaDescartada, navegacao]);

  if (plano === null || rascunho === null) {
    return (
      <SafeAreaView style={estilos.tela} edges={['top']}>
        <Cabecalho titulo="Plano de hoje" voltar />
        <View style={estilos.conteudo}>
          {erro !== null && !carregando ? (
            <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
          ) : (
            <Carregando />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const salvo = plano;
  const atual = rascunho;
  const estado = estadoDoPlano(salvo);
  // Os avisos acompanham o que está na tela (rascunho), com os horários do que está salvo.
  const estadoNaTela = estadoDoPlano({ ...salvo, ...atual });
  const { grupo } = salvo.turma;
  const ida = grupo.horarioSaidaIda;
  const volta = grupo.horarioSaidaVolta;
  const podeAlterarIda = salvo.incluiIda ? salvo.acoes.podeCancelarIda : salvo.acoes.podeIncluirIda;
  const podeAlterarVolta = salvo.acoes.podeAlterarVolta && !salvo.voltaSaiu;
  // Com a volta já salva vale o bloco `acoes`; marcada só no rascunho, vale poder alterar a volta.
  const mostraStatus =
    atual.incluiVolta &&
    (salvo.incluiVolta ? salvo.acoes.podeAlterarStatusVolta : salvo.acoes.podeAlterarVolta);
  const statusEditavel = mostraStatus && !salvo.voltaSaiu;
  const podeConfirmar = podeAlterarIda || podeAlterarVolta || statusEditavel;

  function confirmar() {
    // B4: cancelar a ida depois da saída pede confirmação na folha inferior.
    if (alteracoes.ida === false && salvo.acoes.cancelamentoIdaSeraTardio) {
      setConfirmandoCancelamento(true);
      return;
    }
    void salvar();
  }

  async function salvar() {
    setSalvando(true);
    setErro(null);
    let resultado = salvo;
    try {
      if (alteracoes.ida !== undefined) resultado = await alterarIda(turmaId, alteracoes.ida);
      if (alteracoes.volta !== undefined) resultado = await alterarVolta(turmaId, alteracoes.volta);
      if (alteracoes.statusVolta !== undefined)
        resultado = await alterarStatusVolta(turmaId, alteracoes.statusVolta);
      aplicar(resultado);
      Alert.alert('Presença confirmada', resumoDoPlano(resultado), [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (falha) {
      // O que já foi gravado vira o plano salvo; o resto continua no rascunho para tentar de novo.
      setPlano(resultado);
      setErro(falha);
      // O servidor revalida o horário; com 422 a tela recarrega e se corrige.
      if (falha && typeof falha === 'object' && 'status' in falha && falha.status === 422) {
        await carregar();
      }
    } finally {
      setSalvando(false);
    }
  }

  // Texto de cada trecho: o que está salvo aparece como "Confirmada"; o que mudou só no
  // rascunho pede o "Confirmar".
  const idaMudou = atual.incluiIda !== salvo.incluiIda;
  const voltaMudou = atual.incluiVolta !== salvo.incluiVolta;
  const textoIda = salvo.cancelouAposSaida
    ? 'Cancelada depois da saída'
    : idaMudou
      ? atual.incluiIda
        ? 'Marcada · toque em Confirmar'
        : 'Desmarcada · toque em Confirmar'
      : salvo.idaSaiu && salvo.incluiIda
        ? `Confirmada · ${salvo.voltaSaiu ? 'saiu' : 'a van saiu'} às ${ida}`
        : salvo.idaSaiu
          ? `Encerrada às ${ida}`
          : salvo.incluiIda
            ? `Confirmada · sai às ${ida}`
            : `Sai às ${ida} · marque até lá`;
  const textoVolta = voltaMudou
    ? atual.incluiVolta
      ? 'Marcada · toque em Confirmar'
      : 'Desmarcada · toque em Confirmar'
    : salvo.voltaSaiu && salvo.incluiVolta
      ? `Confirmada · saiu às ${volta}`
      : salvo.voltaSaiu
        ? `Encerrada às ${volta}`
        : salvo.incluiVolta
          ? `Confirmada · sai às ${volta}`
          : `Sai às ${volta} · marque até lá`;

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho
        titulo="Plano de hoje"
        subtitulo={`${dataDaApiPorExtenso(salvo.data)} · ${grupo.nome} · ${salvo.turma.nome}`}
        voltar
      />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <CartaoTrecho
          titulo="Ida"
          texto={textoIda}
          marcado={atual.incluiIda}
          confirmado={atual.incluiIda && !idaMudou}
          travado={!podeAlterarIda}
          cancelado={salvo.cancelouAposSaida}
          desabilitado={salvando}
          onChange={(incluir) => setRascunho({ ...atual, incluiIda: incluir })}
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
          marcado={atual.incluiVolta}
          confirmado={atual.incluiVolta && !voltaMudou}
          travado={!podeAlterarVolta}
          desabilitado={salvando}
          onChange={(incluir) => setRascunho({ ...atual, incluiVolta: incluir })}
        />

        {mostraStatus && (
          <View style={estilos.status}>
            <Text style={estilos.rotuloStatus}>STATUS DA VOLTA</Text>
            <View style={estilos.opcoesStatus} accessibilityRole="radiogroup">
              {(['EM_AULA', 'LIBERADO'] as StatusVolta[]).map((status) => {
                const ativo = atual.statusVolta === status;
                return (
                  <Pressable
                    key={status}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: ativo, disabled: !statusEditavel }}
                    onPress={() => setRascunho({ ...atual, statusVolta: status })}
                    disabled={salvando || !statusEditavel}
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
            {statusEditavel && <Text style={estilos.dica}>Pode mudar até {volta}.</Text>}
          </View>
        )}

        <Text style={estilos.aviso}>{avisoDaSituacao(estadoNaTela, atual, ida, volta)}</Text>
        {erro !== null && <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />}

        {estado !== 'ENCERRADO' && podeConfirmar && (
          <View style={estilos.rodape}>
            <Botao
              rotulo="Confirmar"
              onPress={confirmar}
              carregando={salvando}
              desabilitado={!pendente}
            />
            <Text style={estilos.dicaRodape}>
              {pendente
                ? 'Toque em Confirmar para salvar as alterações.'
                : 'Mude a ida ou a volta e toque em Confirmar.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* B4: cancelamento da ida depois da saída, no "Confirmar". */}
      <DialogoConfirmacao
        visivel={confirmandoCancelamento}
        titulo="Cancelar a ida depois da saída?"
        mensagem={`A van saiu às ${ida}. O motorista é avisado na hora e não dá para marcar a ida de novo pelo app.`}
        rotuloConfirmar="Cancelar a ida"
        rotuloCancelar="Manter a ida"
        carregando={salvando}
        onCancelar={() => {
          setConfirmandoCancelamento(false);
          setRascunho((r) => (r ? { ...r, incluiIda: true } : r));
        }}
        onConfirmar={async () => {
          setConfirmandoCancelamento(false);
          await salvar();
        }}
      />
    </SafeAreaView>
  );
}

function avisoDaSituacao(
  estado: EstadoPlano,
  atual: RascunhoDoPlano,
  ida: string,
  volta: string,
): string {
  switch (estado) {
    case 'SEM_PLANO':
      return 'Sem nada marcado, você fica como ausente hoje e não aparece na lista do motorista.';
    case 'DECLARADO':
      return atual.incluiIda
        ? `Para cancelar a ida, desmarque e confirme. Depois das ${ida} o motorista é avisado na hora.`
        : `Você pode marcar a ida até ${ida}.`;
    case 'APOS_SAIDA':
      return 'Se desmarcar a ida agora, o motorista é avisado na hora e não dá para marcar de novo pelo app.';
    case 'IDA_CANCELADA':
    case 'IDA_BLOQUEADA':
      return atual.incluiVolta
        ? 'Se também não for voltar, desmarque a volta.'
        : `Você ainda pode marcar a volta até ${volta}.`;
    case 'ENCERRADO':
      return `A volta saiu às ${volta}. O plano de hoje não pode mais ser alterado.`;
  }
}

function resumoDoPlano(plano: PlanoDoDia): string {
  const ida = plano.incluiIda ? 'vou' : 'não vou';
  const volta = !plano.incluiVolta
    ? 'não vou'
    : plano.statusVolta === 'LIBERADO'
      ? 'vou (liberado)'
      : 'vou (em aula)';
  return `Seu plano de hoje foi salvo.\nIda: ${ida}\nVolta: ${volta}`;
}

function CartaoTrecho({
  titulo,
  texto,
  marcado,
  confirmado,
  travado,
  cancelado = false,
  desabilitado,
  onChange,
}: {
  titulo: string;
  texto: string;
  marcado: boolean;
  /** Marcado e já gravado: fica amarelo, como no protótipo. */
  confirmado: boolean;
  travado: boolean;
  cancelado?: boolean;
  desabilitado: boolean;
  onChange: (valor: boolean) => void;
}) {
  // Amarelo quando confirmado e ainda dá para mudar; escuro com cadeado quando o horário passou.
  const destaque = confirmado && !travado;
  return (
    <View
      style={[
        estilos.cartao,
        destaque && estilos.cartaoMarcado,
        marcado && !confirmado && !travado && estilos.cartaoPendente,
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
          trackColor={{
            false: cores.bordaBotaoSecundario,
            true: destaque ? cores.textoSobreDestaque : cores.destaque,
          }}
          thumbColor={
            destaque ? cores.destaque : marcado ? cores.textoSobreDestaque : cores.textoSecundario
          }
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
  cartaoPendente: { borderColor: cores.destaque },
  cartaoCancelado: { borderColor: cores.perigo },
  textosCartao: { flex: 1, gap: 6 },
  tituloCartao: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 30 },
  descricaoCartao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.medio,
    fontSize: 15,
  },
  textoSobreDestaque: { color: cores.textoSobreDestaque },
  textoCancelado: { color: cores.perigo },
  switchAndroid: { transform: [{ scale: 1.3 }] },
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
  dica: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
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
  rodape: { gap: 8, marginTop: 16 },
  dicaRodape: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
