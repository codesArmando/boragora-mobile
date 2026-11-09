import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';

type Props = Omit<TextInputProps, 'style'> & {
  value: string;
  onChangeText: (texto: string) => void;
};

// Campo de busca com lupa (D6 e D10).
export function CampoBusca({ placeholder = 'Buscar por nome ou e-mail', ...resto }: Props) {
  return (
    <View style={estilos.caixa}>
      <Feather name="search" size={20} color={cores.textoApagado} />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={cores.textoApagado}
        selectionColor={cores.destaque}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        {...resto}
        style={estilos.entrada}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    height: medidas.alturaCampo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: medidas.raioCampo,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  entrada: {
    flex: 1,
    height: '100%',
    color: cores.texto,
    fontSize: 16,
  },
});
