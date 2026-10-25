import { StyleSheet, Text, View } from 'react-native';

import { iniciais } from '@/components/LinhaAluno';
import { cores } from '@/theme/cores';

export function LinhaPessoa({
  nome,
  email,
  mostrarIniciais = true,
}: {
  nome: string;
  email: string;
  mostrarIniciais?: boolean;
}) {
  return (
    <View style={estilos.linha}>
      {mostrarIniciais && (
        <View style={estilos.avatar}>
          <Text style={estilos.iniciais}>{iniciais(nome)}</Text>
        </View>
      )}
      <View style={estilos.textos}>
        <Text style={estilos.nome}>{nome}</Text>
        <Text style={estilos.email}>{email}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficieInterna,
    borderRadius: 20,
  },
  iniciais: { color: cores.textoSecundario, fontSize: 14, fontWeight: '700' },
  textos: { flex: 1, gap: 3 },
  nome: { color: cores.texto, fontSize: 16 },
  email: { color: cores.textoApagado, fontSize: 14 },
});
