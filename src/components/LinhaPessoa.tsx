import { StyleSheet, Text, View } from 'react-native';

import { iniciais } from '@/components/LinhaAluno';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';

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
  iniciais: { fontFamily: tipografia.texto.negrito, color: cores.textoSecundario, fontSize: 14 },
  textos: { flex: 1, gap: 3 },
  nome: { fontFamily: tipografia.texto.regular, color: cores.texto, fontSize: 16 },
  email: { fontFamily: tipografia.texto.regular, color: cores.textoApagado, fontSize: 14 },
});
