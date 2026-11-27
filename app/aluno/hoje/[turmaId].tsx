import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  usePreventRemove,
  type NavigationAction,
} from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { BotaoVoltar } from '@/components/BotaoVoltar';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoErro } from '@/components/EstadoErro';
import { Tela } from '@/components/Tela';
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
import { estadoDoPlano } from '@/utils/estadoDoPlano';
import {
  alteracoesDoRascunho,
  rascunhoDe,
  temAlteracoes,
  type RascunhoDoPlano,
} from '@/utils/rascunhoDoPlano';

export default function PlanoHojeAluno() {
  const { turmaId: parametro } = useLocalSearchParams<{ turmaId: string }>();
  const turmaId = Number(parametro);
  const navegacao = useNavigation();
  const [plano, setPlano] = useState<PlanoDoDia | null>(null);
  // Os interruptores mudam só o rascunho; nada vai para a API antes do "Confirmar".
  const [rascunho, setRascunho] = useState<RascunhoDoPlano | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

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

  if (carregando && plano === null)
    return (
      <Tela>
        <BotaoVoltar />
        <Carregando />
      </Tela>
    );
  if (erro !== null && plano === null)
    return (
      <Tela>
        <BotaoVoltar />
        <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />
      </Tela>
    );
  if (plano === null || rascunho === null) return null;

  const salvo = plano;
  const atual = rascunho;
  const estado = estadoDoPlano(salvo);
  // O aviso de "sem nada marcado" acompanha o que está na tela, não o que está salvo.
  const estadoNaTela = estadoDoPlano({ ...salvo, ...atual });
  const grupo = salvo.turma.grupo;
  const podeAlterarIda = salvo.incluiIda ? salvo.acoes.podeCancelarIda : salvo.acoes.podeIncluirIda;
  const podeAlterarVolta = salvo.acoes.podeAlterarVolta && !salvo.voltaSaiu;
  // Com a volta já salva vale o bloco `acoes`; marcada só no rascunho, vale poder alterar a volta.
  const mostraStatus =
    atual.incluiVolta &&
    (salvo.incluiVolta ? salvo.acoes.podeAlterarStatusVolta : salvo.acoes.podeAlterarVolta);
  const podeConfirmar = podeAlterarIda || podeAlterarVolta || mostraStatus;

  function confirmar() {
    if (alteracoes.ida === false && salvo.acoes.cancelamentoIdaSeraTardio) {
      Alert.alert(
        'Cancelar a ida?',
        'O motorista será avisado de que você cancelou a ida depois da saída.',
        [
          {
            text: 'Manter a ida',
            style: 'cancel',
            onPress: () => setRascunho((r) => (r ? { ...r, incluiIda: true } : r)),
          },
          { text: 'Cancelar a ida', style: 'destructive', onPress: () => void salvar() },
        ],
      );
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

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <BotaoVoltar />
        <Text style={estilos.titulo}>Plano de hoje</Text>
        <Text style={estilos.subtitulo}>
          {grupo.nome} · {salvo.turma.nome}
        </Text>

        <Cartao>
          <View style={estilos.linhaCartao}>
            <View style={estilos.textosCartao}>
              <Text style={estilos.tituloCartao}>Ida</Text>
              <Text style={estilos.descricaoCartao}>
                {estado === 'IDA_BLOQUEADA'
                  ? `Encerrada às ${grupo.horarioSaidaIda}`
                  : `Sai às ${grupo.horarioSaidaIda} · marque até lá`}
              </Text>
            </View>
            <Switch
              value={atual.incluiIda}
              onValueChange={(incluir) => setRascunho({ ...atual, incluiIda: incluir })}
              disabled={!podeAlterarIda || salvando}
              trackColor={{ false: cores.bordaBotaoSecundario, true: cores.destaque }}
              thumbColor={atual.incluiIda ? cores.textoSobreDestaque : cores.textoSecundario}
              accessibilityLabel="Marcar presença na ida"
            />
          </View>
        </Cartao>

        <Cartao>
          <View style={estilos.linhaCartao}>
            <View style={estilos.textosCartao}>
              <Text style={estilos.tituloCartao}>Volta</Text>
              <Text style={estilos.descricaoCartao}>
                Sai às {grupo.horarioSaidaVolta} · marque até lá
              </Text>
            </View>
            <Switch
              value={atual.incluiVolta}
              onValueChange={(incluir) => setRascunho({ ...atual, incluiVolta: incluir })}
              disabled={!podeAlterarVolta || salvando}
              trackColor={{ false: cores.bordaBotaoSecundario, true: cores.destaque }}
              thumbColor={atual.incluiVolta ? cores.textoSobreDestaque : cores.textoSecundario}
              accessibilityLabel="Marcar presença na volta"
            />
          </View>
        </Cartao>

        {mostraStatus && (
          <View style={estilos.statusBox}>
            <Text style={estilos.rotuloStatus}>Status da volta</Text>
            <Text style={estilos.descricaoStatus}>Pode mudar até {grupo.horarioSaidaVolta}</Text>
            <View style={estilos.opcoesStatus}>
              {(['EM_AULA', 'LIBERADO'] as StatusVolta[]).map((status) => (
                <Pressable
                  key={status}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: atual.statusVolta === status }}
                  onPress={() => setRascunho({ ...atual, statusVolta: status })}
                  disabled={salvando}
                  style={[estilos.opcao, atual.statusVolta === status && estilos.opcaoAtiva]}
                >
                  <Text
                    style={[
                      estilos.textoOpcao,
                      atual.statusVolta === status && estilos.textoOpcaoAtiva,
                    ]}
                  >
                    {status === 'EM_AULA' ? 'Em aula' : 'Liberado'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {estadoNaTela === 'SEM_PLANO' && (
          <Text style={estilos.aviso}>
            Sem nada marcado, você fica como ausente hoje e não aparece na lista do motorista.
          </Text>
        )}
        {estado === 'IDA_CANCELADA' && (
          <View style={estilos.alerta}>
            <Text style={estilos.tituloAlerta}>Cancelada depois da saída</Text>
            <Text style={estilos.aviso}>Avise o motorista também pelo WhatsApp.</Text>
          </View>
        )}
        {estado === 'IDA_BLOQUEADA' && (
          <View style={estilos.alerta}>
            <Text style={estilos.tituloAlerta}>Não dá mais para incluir a ida pelo app</Text>
            <Text style={estilos.aviso}>
              A van saiu às {grupo.horarioSaidaIda}. Se ainda precisa ir, fale com o motorista pelo
              WhatsApp.
            </Text>
          </View>
        )}
        {estado === 'ENCERRADO' && (
          <Text style={estilos.aviso}>
            A volta saiu às {grupo.horarioSaidaVolta}. O plano de hoje não pode mais ser alterado.
          </Text>
        )}
        {estado === 'APOS_SAIDA' && (
          <Text style={estilos.aviso}>A ida já saiu. Você ainda pode alterar a volta.</Text>
        )}
        {erro !== null && <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />}

        {estado !== 'ENCERRADO' && podeConfirmar && (
          <View style={estilos.rodape}>
            <Botao
              rotulo="Confirmar"
              onPress={confirmar}
              carregando={salvando}
              desabilitado={!pendente}
            />
            <Text style={estilos.dica}>
              {pendente
                ? 'Toque em Confirmar para salvar as alterações.'
                : 'Mude a ida ou a volta e toque em Confirmar.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </Tela>
  );
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

const estilos = StyleSheet.create({
  conteudo: { paddingBottom: 30, gap: 14 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 28, fontStyle: 'italic' },
  subtitulo: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    marginBottom: 8,
  },
  linhaCartao: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textosCartao: { flex: 1, gap: 8 },
  tituloCartao: {
    color: cores.texto,
    fontFamily: tipografia.titulo,
    fontSize: 27,
    fontStyle: 'italic',
  },
  descricaoCartao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 15,
  },
  statusBox: {
    gap: 8,
    padding: 16,
    backgroundColor: cores.superficie,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  rotuloStatus: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 16 },
  descricaoStatus: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.regular,
    fontSize: 14,
  },
  opcoesStatus: { flexDirection: 'row', gap: 8, marginTop: 6 },
  opcao: {
    flex: 1,
    minHeight: medidas.alturaBotao,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: medidas.raioBotao,
    borderWidth: 1,
    borderColor: cores.bordaBotaoSecundario,
  },
  opcaoAtiva: { backgroundColor: cores.destaque, borderColor: cores.destaque },
  textoOpcao: { color: cores.texto, fontFamily: tipografia.texto.semibold },
  textoOpcaoAtiva: { color: cores.textoSobreDestaque },
  aviso: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  alerta: { padding: 16, backgroundColor: cores.alertaFundo, borderRadius: medidas.raioCartao },
  tituloAlerta: { color: cores.perigo, fontFamily: tipografia.texto.negrito, fontSize: 17 },
  rodape: { gap: 8, marginTop: 16 },
  dica: {
    color: cores.textoApagado,
    fontFamily: tipografia.texto.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
