import type { ReactNode } from 'react';
import { KeyboardAvoidingView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

// Empurra o conteúdo para cima quando o teclado abre. O `behavior` vale também no Android:
// os apps Expo são edge-to-edge, a janela não encolhe mais com o teclado, e uma view sem
// `behavior` fica embaixo dele (guia "Keyboard handling" da Expo). Não usar junto com
// `softwareKeyboardLayoutMode: "pan"`, senão o campo sobe duas vezes.
export function EvitarTeclado({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <KeyboardAvoidingView behavior="padding" style={[estilos.area, style]}>
      {children}
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({ area: { flex: 1 } });
