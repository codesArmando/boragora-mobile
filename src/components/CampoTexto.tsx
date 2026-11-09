import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { mascararHora } from '@/utils/mascaras';

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  rotulo: string;
  /** Mensagem de erro; também pinta a borda. */
  erro?: string | null;
  /** Texto de apoio abaixo do campo (some quando há erro). */
  dica?: string;
  /** Mostra o botão de ver/ocultar a senha. */
  senha?: boolean;
  /** `hora` aplica a máscara HH:mm e o teclado numérico, com o número em destaque. */
  mascara?: 'hora';
};

export function CampoTexto({
  rotulo,
  erro,
  dica,
  senha = false,
  mascara,
  onChangeText,
  ...resto
}: Props) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [focado, setFocado] = useState(false);
  const comErro = erro != null && erro !== '';

  function aoMudar(texto: string) {
    onChangeText?.(mascara === 'hora' ? mascararHora(texto) : texto);
  }

  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={[estilos.caixa, focado && estilos.caixaFocada, comErro && estilos.caixaComErro]}>
        <TextInput
          accessibilityLabel={rotulo}
          placeholderTextColor={cores.textoApagado}
          selectionColor={cores.destaque}
          keyboardType={mascara === 'hora' ? 'number-pad' : undefined}
          maxLength={mascara === 'hora' ? 5 : undefined}
          {...resto}
          secureTextEntry={senha && !senhaVisivel}
          onChangeText={aoMudar}
          onFocus={(evento) => {
            setFocado(true);
            resto.onFocus?.(evento);
          }}
          onBlur={(evento) => {
            setFocado(false);
            resto.onBlur?.(evento);
          }}
          style={[estilos.entrada, mascara === 'hora' && estilos.entradaHora]}
        />
        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            onPress={() => setSenhaVisivel((visivel) => !visivel)}
            style={estilos.olho}
          >
            <Feather name={senhaVisivel ? 'eye-off' : 'eye'} size={20} color={cores.textoApagado} />
          </Pressable>
        )}
      </View>
      {comErro ? (
        <Text accessibilityRole="alert" style={estilos.erro}>
          {erro}
        </Text>
      ) : dica ? (
        <Text style={estilos.dica}>{dica}</Text>
      ) : null}
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
    height: medidas.alturaCampo,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: medidas.raioCampo,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  caixaFocada: {
    borderColor: cores.destaque,
  },
  caixaComErro: {
    borderColor: cores.perigo,
  },
  entrada: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    color: cores.texto,
    fontSize: 16,
  },
  entradaHora: {
    fontSize: 22,
    fontWeight: '700',
  },
  olho: {
    minWidth: medidas.areaToqueMinima,
    height: medidas.areaToqueMinima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erro: {
    color: cores.perigo,
    fontSize: 14,
  },
  dica: {
    color: cores.textoApagado,
    fontSize: 14,
  },
});
