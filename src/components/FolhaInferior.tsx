import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores } from '@/theme/cores';

type Props = {
  visivel: boolean;
  /** Toque fora da folha ou botão voltar do Android. */
  onFechar: () => void;
  children: ReactNode;
};

// Folha que sobe de baixo, com fundo escurecido (B4). Base do DialogoConfirmacao e do SeletorModal.
export function FolhaInferior({ visivel, onFechar, children }: Props) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onFechar}
    >
      <View style={estilos.tela}>
        <Pressable accessibilityLabel="Fechar" onPress={onFechar} style={StyleSheet.absoluteFill}>
          <View style={estilos.fundo} />
        </Pressable>
        <View accessibilityViewIsModal style={[estilos.folha, { paddingBottom: bottom + 20 }]}>
          <View style={estilos.alca} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  folha: {
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  alca: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: cores.bordaBotaoSecundario,
  },
});
