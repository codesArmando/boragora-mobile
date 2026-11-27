import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';

type Props = {
  mensagem: string;
  /** Título em destaque acima da mensagem (C0b, C5). Sem ele, só a mensagem aparece. */
  titulo?: string;
  /** Ícone num círculo acima do título, como no protótipo (ex.: "truck"). */
  icone?: ComponentProps<typeof Feather>['name'];
  /** Ilustração no lugar do ícone (ex.: o símbolo da marca na C5). */
  ilustracao?: ReactNode;
  children?: ReactNode;
};

export function EstadoVazio({ mensagem, titulo, icone, ilustracao, children }: Props) {
  return (
    <View style={[estilos.container, titulo || icone || ilustracao ? estilos.destacado : null]}>
      {ilustracao}
      {icone && !ilustracao && (
        <View style={estilos.circulo}>
          <Feather name={icone} size={34} color={cores.destaque} />
        </View>
      )}
      {titulo && <Text style={estilos.titulo}>{titulo}</Text>}
      <Text style={estilos.texto}>{mensagem}</Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { paddingVertical: 32, alignItems: 'center', gap: 16 },
  destacado: { paddingTop: 72, gap: 12 },
  circulo: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 48,
  },
  titulo: {
    color: cores.texto,
    fontFamily: tipografia.texto.negrito,
    fontSize: 22,
    textAlign: 'center',
  },
  texto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.texto.regular,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
