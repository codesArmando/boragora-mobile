import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

export type OpcaoSegmentada<T extends string> = { valor: T; rotulo: string };

type Props<T extends string> = {
  /** Título do grupo ("Período"). Sem ele, o seletor aparece sozinho (Ida/Volta, Em aula/Liberado). */
  rotulo?: string;
  opcoes: OpcaoSegmentada<T>[];
  valor: T;
  onChange: (valor: T) => void;
  desabilitado?: boolean;
};

export function SeletorSegmentado<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
  desabilitado = false,
}: Props<T>) {
  return (
    <View style={estilos.grupo}>
      {rotulo !== undefined && <Text style={estilos.rotulo}>{rotulo}</Text>}
      <View accessibilityRole="radiogroup" accessibilityLabel={rotulo} style={estilos.caixa}>
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === valor;
          return (
            <Pressable
              key={opcao.valor}
              accessibilityRole="radio"
              accessibilityLabel={opcao.rotulo}
              accessibilityState={{ selected: selecionada, disabled: desabilitado }}
              disabled={desabilitado}
              onPress={() => onChange(opcao.valor)}
              style={[
                estilos.opcao,
                selecionada && estilos.opcaoSelecionada,
                desabilitado && estilos.desabilitado,
              ]}
            >
              <Text style={[estilos.texto, selecionada && estilos.textoSelecionado]}>
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    gap: 8,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },
  caixa: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: medidas.raioBotao,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  opcao: {
    flex: 1,
    minHeight: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  opcaoSelecionada: {
    backgroundColor: cores.destaque,
  },
  desabilitado: {
    opacity: 0.4,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: 15,
    fontWeight: '600',
  },
  textoSelecionado: {
    color: cores.textoSobreDestaque,
    fontWeight: '700',
  },
});
