import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { SeletorSegmentado } from '@/components/SeletorSegmentado';
import { ErroApi } from '@/api/ErroApi';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import type { GrupoRequisicao, Periodo } from '@/types/grupo';
import { horaCompleta } from '@/utils/mascaras';

type Props = {
  /** Valores iniciais: vazios na D2, os do grupo na D2b. */
  inicial?: GrupoRequisicao;
  rotuloSalvar: string;
  /** Chama a API. Se lançar `ErroApi`, o formulário mostra a mensagem e marca os campos. */
  onSalvar: (requisicao: GrupoRequisicao) => Promise<void>;
  /** Desabilita o formulário enquanto outra ação da tela roda (excluir, na D2b). */
  ocupado?: boolean;
  /** Mensagem de erro vinda de fora do formulário (excluir, na D2b). */
  erroExterno?: string | null;
  /** Conteúdo abaixo do botão de salvar (excluir, na D2b). */
  rodape?: ReactNode;
};

type Campos = Partial<Record<keyof GrupoRequisicao, string>>;

const periodos: { valor: Periodo; rotulo: string }[] = [
  { valor: 'MANHA', rotulo: 'Manhã' },
  { valor: 'TARDE', rotulo: 'Tarde' },
  { valor: 'NOITE', rotulo: 'Noite' },
];

// Formulário de grupo, igual na D2 (novo) e na D2b (editar). O app só confere o que dá para
// ver na tela (nome preenchido, horário completo); a ordem ida/volta é regra do backend.
export function FormularioGrupo({
  inicial,
  rotuloSalvar,
  onSalvar,
  ocupado = false,
  erroExterno = null,
  rodape,
}: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [periodo, setPeriodo] = useState<Periodo>(inicial?.periodo ?? 'MANHA');
  const [ida, setIda] = useState(inicial?.horarioSaidaIda ?? '');
  const [volta, setVolta] = useState(inicial?.horarioSaidaVolta ?? '');
  const [errosCampos, setErrosCampos] = useState<Campos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const erros: Campos = {};
    if (nome.trim() === '') {
      erros.nome = 'Informe o nome do grupo.';
    }
    if (!horaCompleta(ida)) {
      erros.horarioSaidaIda = 'Use o formato HH:mm.';
    }
    if (!horaCompleta(volta)) {
      erros.horarioSaidaVolta = 'Use o formato HH:mm.';
    }
    setErrosCampos(erros);
    setErroGeral(null);
    if (Object.keys(erros).length > 0) {
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        nome: nome.trim(),
        periodo,
        horarioSaidaIda: ida,
        horarioSaidaVolta: volta,
      });
    } catch (e) {
      if (e instanceof ErroApi) {
        setErrosCampos(e.campos ?? {});
        // Sem campo indicado, a mensagem vai no aviso do topo.
        setErroGeral(e.campos === null ? e.mensagem : null);
      } else {
        setErroGeral('Não foi possível salvar o grupo.');
      }
    } finally {
      setSalvando(false);
    }
  }

  const travado = salvando || ocupado;
  const aviso = erroGeral ?? erroExterno;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={estilos.tela}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        {aviso !== null && <Aviso tom="alerta" titulo={aviso} />}

        <CampoTexto
          rotulo="Nome do grupo"
          value={nome}
          onChangeText={setNome}
          erro={errosCampos.nome}
          editable={!travado}
          autoCapitalize="words"
          maxLength={100}
        />
        <SeletorSegmentado
          rotulo="Período"
          opcoes={periodos}
          valor={periodo}
          onChange={setPeriodo}
          desabilitado={travado}
        />
        <View style={estilos.horarios}>
          <View style={estilos.horario}>
            <CampoTexto
              rotulo="Saída da ida"
              mascara="hora"
              value={ida}
              onChangeText={setIda}
              erro={errosCampos.horarioSaidaIda}
              editable={!travado}
              placeholder="00:00"
            />
          </View>
          <View style={estilos.horario}>
            <CampoTexto
              rotulo="Saída da volta"
              mascara="hora"
              value={volta}
              onChangeText={setVolta}
              erro={errosCampos.horarioSaidaVolta}
              editable={!travado}
              placeholder="00:00"
            />
          </View>
        </View>
        <Text style={estilos.explicacao}>
          Os horários valem para todas as vans do grupo. Eles definem até quando o aluno marca a ida
          e a volta e quando um cancelamento vira tardio.
        </Text>
      </ScrollView>

      <View style={estilos.rodape}>
        <Botao
          rotulo={rotuloSalvar}
          carregando={salvando}
          desabilitado={ocupado}
          onPress={salvar}
        />
        {rodape}
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    padding: medidas.margemTela + 4,
    paddingTop: 16,
    gap: 20,
  },
  horarios: {
    flexDirection: 'row',
    gap: 12,
  },
  horario: {
    flex: 1,
  },
  explicacao: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
  rodape: {
    paddingHorizontal: medidas.margemTela + 4,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
});
