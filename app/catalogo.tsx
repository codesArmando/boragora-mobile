import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { DialogoConfirmacao } from '@/components/DialogoConfirmacao';
import { SeletorModal, type OpcaoSeletor } from '@/components/SeletorModal';
import { SeletorSegmentado } from '@/components/SeletorSegmentado';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { horaCompleta } from '@/utils/mascaras';

// Catálogo dos componentes de formulário e de ação (FND-03). Tela de desenvolvimento: sai
// quando o app estiver pronto, ou fica como referência para a equipe.

const grupos: OpcaoSeletor[] = [
  { id: 1, rotulo: 'Manhã · ida 06:30 · volta 12:00' },
  { id: 2, rotulo: 'Noite · ida 18:10 · volta 22:30' },
];

const motoristas: OpcaoSeletor[] = [
  { id: 1, rotulo: 'Carlos Menezes', descricao: 'carlos@boragora.local' },
  { id: 2, rotulo: 'Vanderlei Dias', descricao: 'vanderlei@boragora.local' },
];

export default function Catalogo() {
  const [periodo, setPeriodo] = useState<'MANHA' | 'TARDE' | 'NOITE'>('NOITE');
  const [trecho, setTrecho] = useState<'IDA' | 'VOLTA'>('IDA');
  const [nome, setNome] = useState('Noite');
  const [ida, setIda] = useState('18:10');
  const [senha, setSenha] = useState('');
  const [grupo, setGrupo] = useState<OpcaoSeletor['id'] | null>(2);
  const [motorista, setMotorista] = useState<OpcaoSeletor['id'] | null>(null);
  const [dialogo, setDialogo] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function simularEnvio() {
    setCarregando(true);
    setTimeout(() => setCarregando(false), 1500);
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Cabecalho
        titulo="Catálogo"
        subtitulo="FND-03 · componentes de formulário e de ação"
        acao={{ rotulo: 'Novo grupo', icone: 'plus', onPress: () => {} }}
      />
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Secao titulo="Botao">
          <Botao rotulo="Primário" onPress={() => {}} />
          <Botao rotulo="Contorno" variante="contorno" onPress={() => {}} />
          <Botao rotulo="Texto" variante="texto" onPress={() => {}} />
          <Botao rotulo="Perigo" variante="perigo" onPress={() => {}} />
          <Botao rotulo="Excluir grupo" variante="perigoContorno" onPress={() => {}} />
          <Botao rotulo="Desabilitado" desabilitado onPress={() => {}} />
          <Botao
            rotulo={carregando ? 'Salvando' : 'Tocar para simular carregando'}
            carregando={carregando}
            onPress={simularEnvio}
          />
        </Secao>

        <Secao titulo="CampoTexto">
          <CampoTexto rotulo="Nome do grupo" value={nome} onChangeText={setNome} />
          <CampoTexto
            rotulo="Saída da ida (máscara HH:mm)"
            mascara="hora"
            value={ida}
            onChangeText={setIda}
            erro={ida !== '' && !horaCompleta(ida) ? 'Use o formato HH:mm' : null}
          />
          <CampoTexto
            rotulo="Senha"
            senha
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
          />
          <CampoTexto
            rotulo="Nome da turma"
            value="Van 2"
            dica="Texto livre, até 60 caracteres. Ex.: Van 2 ou Van da Zona Sul."
          />
          <CampoTexto rotulo="Com erro" value="x" erro="Mensagem de erro do backend" />
        </Secao>

        <Secao titulo="SeletorSegmentado">
          <SeletorSegmentado
            rotulo="Período"
            opcoes={[
              { valor: 'MANHA', rotulo: 'Manhã' },
              { valor: 'TARDE', rotulo: 'Tarde' },
              { valor: 'NOITE', rotulo: 'Noite' },
            ]}
            valor={periodo}
            onChange={setPeriodo}
          />
          <SeletorSegmentado
            opcoes={[
              { valor: 'IDA', rotulo: 'Ida' },
              { valor: 'VOLTA', rotulo: 'Volta' },
            ]}
            valor={trecho}
            onChange={setTrecho}
          />
        </Secao>

        <Secao titulo="SeletorModal">
          <SeletorModal
            rotulo="Grupo"
            opcoes={grupos}
            valor={grupo}
            onSelecionar={(opcao) => setGrupo(opcao.id)}
          />
          <SeletorModal
            rotulo="Motorista responsável"
            opcoes={motoristas}
            valor={motorista}
            placeholder="Escolha um motorista"
            onSelecionar={(opcao) => setMotorista(opcao.id)}
            dica="Um motorista não pode conduzir duas turmas do mesmo grupo."
          />
          <SeletorModal rotulo="Sem opções" opcoes={[]} valor={null} onSelecionar={() => {}} />
        </Secao>

        <Secao titulo="Aviso">
          <Aviso
            titulo="Não dá mais para incluir a ida pelo app"
            texto="A van saiu às 18:10. Se ainda precisa ir, fale com o motorista pelo WhatsApp."
          />
          <Aviso
            tom="alerta"
            titulo="Ida cancelada depois da saída"
            texto="O motorista foi avisado."
          />
        </Secao>

        <Secao titulo="DialogoConfirmacao">
          <Botao rotulo="Abrir diálogo" variante="contorno" onPress={() => setDialogo(true)} />
        </Secao>
      </ScrollView>

      <DialogoConfirmacao
        visivel={dialogo}
        titulo="Cancelar a ida depois da saída?"
        mensagem="A van saiu às 18:10. O motorista é avisado na hora e não dá para marcar a ida de novo pelo app."
        rotuloConfirmar="Cancelar a ida"
        rotuloCancelar="Manter a ida"
        onConfirmar={() => setDialogo(false)}
        onCancelar={() => setDialogo(false)}
      />
    </SafeAreaView>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={estilos.secao}>
      <Text style={estilos.tituloSecao}>{titulo}</Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: medidas.margemTela,
    paddingBottom: 48,
    gap: 32,
  },
  secao: {
    gap: 14,
  },
  tituloSecao: {
    color: cores.destaque,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
