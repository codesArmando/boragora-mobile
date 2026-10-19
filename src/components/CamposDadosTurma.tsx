import { StyleSheet, Text, View } from 'react-native';

import { CampoTexto } from '@/components/CampoTexto';
import { cores } from '@/theme/cores';
import { NOME_TURMA_MAXIMO, type ErrosDadosTurma } from '@/utils/turma';

type Props = {
  nome: string;
  numeroVan: string;
  capacidade: string;
  onNome: (texto: string) => void;
  onNumeroVan: (texto: string) => void;
  onCapacidade: (texto: string) => void;
  erros: ErrosDadosTurma;
  dicaNome: string;
  /** Texto abaixo do número da van e da capacidade. */
  dicaNumeros: string;
  desabilitado?: boolean;
};

// Nome, número da van e capacidade: iguais na D4 (nova turma) e na D5a (editar turma).
export function CamposDadosTurma({
  nome,
  numeroVan,
  capacidade,
  onNome,
  onNumeroVan,
  onCapacidade,
  erros,
  dicaNome,
  dicaNumeros,
  desabilitado = false,
}: Props) {
  return (
    <>
      <CampoTexto
        rotulo="Nome da turma"
        value={nome}
        onChangeText={onNome}
        erro={erros.nome}
        dica={dicaNome}
        editable={!desabilitado}
        maxLength={NOME_TURMA_MAXIMO}
        autoCapitalize="words"
      />
      <View style={estilos.linha}>
        <View style={estilos.metade}>
          <CampoTexto
            rotulo="Número da van"
            value={numeroVan}
            onChangeText={onNumeroVan}
            erro={erros.numeroVan}
            editable={!desabilitado}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        <View style={estilos.metade}>
          <CampoTexto
            rotulo="Capacidade"
            value={capacidade}
            onChangeText={onCapacidade}
            erro={erros.capacidade}
            editable={!desabilitado}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
      <Text style={estilos.dica}>{dicaNumeros}</Text>
    </>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  metade: {
    flex: 1,
  },
  dica: {
    marginTop: -8,
    color: cores.textoApagado,
    fontSize: 14,
  },
});
