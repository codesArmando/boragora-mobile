import { StyleSheet, Text, View } from 'react-native';

import { Selo } from '@/components/Selo';
import { cores } from '@/theme/cores';
import { iniciais } from '@/utils/texto';

type Props = {
  nome: string;
  email: string;
  /** Selo à direita, como o "Você" do chefe na D9. */
  selo?: string;
};

// Linha de pessoa: círculo com iniciais, nome e e-mail (D9).
export function LinhaPessoa({ nome, email, selo }: Props) {
  return (
    <View accessible style={estilos.linha}>
      <View style={estilos.iniciais}>
        <Text style={estilos.textoIniciais}>{iniciais(nome)}</Text>
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.nome}>{nome}</Text>
        <Text style={estilos.email}>{email}</Text>
      </View>
      {selo !== undefined && <Selo rotulo={selo} />}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iniciais: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: cores.superficieInterna,
  },
  textoIniciais: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  textos: {
    flex: 1,
  },
  nome: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '500',
  },
  email: {
    color: cores.textoSecundario,
    fontSize: 15,
  },
});
