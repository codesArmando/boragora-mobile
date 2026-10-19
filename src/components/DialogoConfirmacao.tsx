import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { FolhaInferior } from '@/components/FolhaInferior';
import { cores } from '@/theme/cores';

type Props = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  rotuloConfirmar: string;
  rotuloCancelar: string;
  /** Ação destrutiva (padrão): botão vermelho e ícone de alerta. Com `false`, botão amarelo. */
  destrutivo?: boolean;
  /** Mostra o carregamento no botão de confirmar e trava os dois botões. */
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

// Confirmação antes de ações destrutivas (convenção 8 do plano): excluir grupo, excluir turma,
// remover aluno e cancelamento tardio (B4). Cancelar é sempre o caminho seguro.
export function DialogoConfirmacao({
  visivel,
  titulo,
  mensagem,
  rotuloConfirmar,
  rotuloCancelar,
  destrutivo = true,
  carregando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <FolhaInferior visivel={visivel} onFechar={carregando ? () => {} : onCancelar}>
      {destrutivo && (
        <View style={estilos.icone}>
          <Feather name="alert-triangle" size={24} color={cores.perigo} />
        </View>
      )}
      <Text accessibilityRole="header" style={estilos.titulo}>
        {titulo}
      </Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
      <View style={estilos.botoes}>
        <Botao
          rotulo={rotuloConfirmar}
          variante={destrutivo ? 'perigo' : 'primario'}
          carregando={carregando}
          onPress={onConfirmar}
        />
        <Botao
          rotulo={rotuloCancelar}
          variante="contorno"
          desabilitado={carregando}
          onPress={onCancelar}
        />
      </View>
    </FolhaInferior>
  );
}

const estilos = StyleSheet.create({
  icone: {
    marginTop: 6,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A1A16',
  },
  titulo: {
    color: cores.texto,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
  botoes: {
    marginTop: 6,
    gap: 12,
  },
});
