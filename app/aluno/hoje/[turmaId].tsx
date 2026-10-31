import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoErro } from '@/components/EstadoErro';
import { Tela } from '@/components/Tela';
import { alterarIda, alterarStatusVolta, alterarVolta, buscarPlano } from '@/repositories/planoRepository';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';
import type { PlanoDoDia, StatusVolta } from '@/types/plano';
import { estadoDoPlano } from '@/utils/estadoDoPlano';

export default function PlanoHojeAluno() {
  const { turmaId: parametro } = useLocalSearchParams<{ turmaId: string }>();
  const turmaId = Number(parametro);
  const [plano, setPlano] = useState<PlanoDoDia | null>(null);
  const [erro, setErro] = useState<unknown>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

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

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  async function atualizar(acao: () => Promise<PlanoDoDia>) {
    setSalvando(true);
    setErro(null);
    try {
      setPlano(await acao());
    } catch (falha) {
      setErro(falha);
      // O servidor revalida o horário; recarrega o estado ao receber erro da API.
      if (falha && typeof falha === 'object' && 'status' in falha && falha.status === 422) {
        await carregar();
      }
    } finally {
      setSalvando(false);
    }
  }

  if (carregando && plano === null) return <Tela><Carregando /></Tela>;
  if (erro !== null && plano === null) return <Tela><EstadoErro erro={erro} tentarNovamente={() => void carregar()} /></Tela>;
  if (plano === null) return null;

  const estado = estadoDoPlano(plano);
  const grupo = plano.turma.grupo;
  const podeAlterarIda = plano.incluiIda ? plano.acoes.podeCancelarIda : plano.acoes.podeIncluirIda;

  function alternarIda(incluir: boolean) {
    if (!incluir && plano?.acoes.cancelamentoIdaSeraTardio) {
      Alert.alert(
        'Cancelar a ida?',
        'O motorista será avisado de que você cancelou a ida depois da saída.',
        [
          { text: 'Manter a ida', style: 'cancel' },
          { text: 'Cancelar a ida', style: 'destructive', onPress: () => void atualizar(() => alterarIda(turmaId, false)) },
        ],
      );
      return;
    }
    void atualizar(() => alterarIda(turmaId, incluir));
  }

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Pressable onPress={() => router.back()} style={estilos.voltar} accessibilityRole="button">
          <Text style={estilos.textoVoltar}>‹</Text>
        </Pressable>
        <Text style={estilos.titulo}>Plano de hoje</Text>
        <Text style={estilos.subtitulo}>{grupo.nome} · {plano.turma.nome}</Text>

        <Cartao>
          <View style={estilos.linhaCartao}>
            <View style={estilos.textosCartao}>
              <Text style={estilos.tituloCartao}>Ida</Text>
              <Text style={estilos.descricaoCartao}>
                {estado === 'IDA_BLOQUEADA' ? `Encerrada às ${grupo.horarioSaidaIda}` : `Sai às ${grupo.horarioSaidaIda} · marque até lá`}
              </Text>
            </View>
            <Switch
              value={plano.incluiIda}
              onValueChange={alternarIda}
              disabled={!podeAlterarIda || salvando}
              trackColor={{ false: cores.bordaBotaoSecundario, true: cores.destaque }}
              thumbColor={plano.incluiIda ? cores.textoSobreDestaque : cores.textoSecundario}
              accessibilityLabel="Marcar presença na ida"
            />
          </View>
        </Cartao>

        <Cartao>
          <View style={estilos.linhaCartao}>
            <View style={estilos.textosCartao}>
              <Text style={estilos.tituloCartao}>Volta</Text>
              <Text style={estilos.descricaoCartao}>Sai às {grupo.horarioSaidaVolta} · marque até lá</Text>
            </View>
            <Switch
              value={plano.incluiVolta}
              onValueChange={(incluir) => void atualizar(() => alterarVolta(turmaId, incluir))}
              disabled={!plano.acoes.podeAlterarVolta || salvando || plano.voltaSaiu}
              trackColor={{ false: cores.bordaBotaoSecundario, true: cores.destaque }}
              thumbColor={plano.incluiVolta ? cores.textoSobreDestaque : cores.textoSecundario}
              accessibilityLabel="Marcar presença na volta"
            />
          </View>
        </Cartao>

        {plano.incluiVolta && plano.acoes.podeAlterarStatusVolta && (
          <View style={estilos.statusBox}>
            <Text style={estilos.rotuloStatus}>Status da volta</Text>
            <Text style={estilos.descricaoStatus}>Pode mudar até {grupo.horarioSaidaVolta}</Text>
            <View style={estilos.opcoesStatus}>
              {(['EM_AULA', 'LIBERADO'] as StatusVolta[]).map((status) => (
                <Pressable
                  key={status}
                  onPress={() => void atualizar(() => alterarStatusVolta(turmaId, status))}
                  disabled={salvando}
                  style={[estilos.opcao, plano.statusVolta === status && estilos.opcaoAtiva]}
                >
                  <Text style={[estilos.textoOpcao, plano.statusVolta === status && estilos.textoOpcaoAtiva]}>
                    {status === 'EM_AULA' ? 'Em aula' : 'Liberado'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {estado === 'SEM_PLANO' && <Text style={estilos.aviso}>Sem nada marcado, você fica como ausente hoje e não aparece na lista do motorista.</Text>}
        {estado === 'IDA_CANCELADA' && <View style={estilos.alerta}><Text style={estilos.tituloAlerta}>Cancelada depois da saída</Text><Text style={estilos.aviso}>Avise o motorista também pelo WhatsApp.</Text></View>}
        {estado === 'IDA_BLOQUEADA' && <View style={estilos.alerta}><Text style={estilos.tituloAlerta}>Não dá mais para incluir a ida pelo app</Text><Text style={estilos.aviso}>A van saiu às {grupo.horarioSaidaIda}. Se ainda precisa ir, fale com o motorista pelo WhatsApp.</Text></View>}
        {estado === 'ENCERRADO' && <Text style={estilos.aviso}>A volta saiu às {grupo.horarioSaidaVolta}. O plano de hoje não pode mais ser alterado.</Text>}
        {estado === 'APOS_SAIDA' && <Text style={estilos.aviso}>A ida já saiu. Você ainda pode alterar a volta.</Text>}
        {erro !== null && <EstadoErro erro={erro} tentarNovamente={() => void carregar()} />}
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingBottom: 30, gap: 14 },
  voltar: { minHeight: medidas.areaToqueMinima, width: medidas.areaToqueMinima, justifyContent: 'center' },
  textoVoltar: { color: cores.texto, fontSize: 38, lineHeight: 42 },
  titulo: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 28, fontStyle: 'italic' },
  subtitulo: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 16, marginBottom: 8 },
  linhaCartao: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textosCartao: { flex: 1, gap: 8 },
  tituloCartao: { color: cores.texto, fontFamily: tipografia.titulo, fontSize: 27, fontStyle: 'italic' },
  descricaoCartao: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 15 },
  statusBox: { gap: 8, padding: 16, backgroundColor: cores.superficie, borderRadius: medidas.raioCartao, borderWidth: 1, borderColor: cores.borda },
  rotuloStatus: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 16 },
  descricaoStatus: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
  opcoesStatus: { flexDirection: 'row', gap: 8, marginTop: 6 },
  opcao: { flex: 1, minHeight: medidas.alturaBotao, justifyContent: 'center', alignItems: 'center', borderRadius: medidas.raioBotao, borderWidth: 1, borderColor: cores.bordaBotaoSecundario },
  opcaoAtiva: { backgroundColor: cores.destaque, borderColor: cores.destaque },
  textoOpcao: { color: cores.texto, fontFamily: tipografia.texto.semibold },
  textoOpcaoAtiva: { color: cores.textoSobreDestaque },
  aviso: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16, lineHeight: 24, marginTop: 10 },
  alerta: { padding: 16, backgroundColor: cores.alertaFundo, borderRadius: medidas.raioCartao },
  tituloAlerta: { color: cores.perigo, fontFamily: tipografia.texto.negrito, fontSize: 17 },
});
