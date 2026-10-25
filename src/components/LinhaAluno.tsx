import { StyleSheet, Text, View } from 'react-native';

import { Selo, type TipoSelo } from '@/components/Selo';
import { cores } from '@/theme/cores';

export function iniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toLocaleUpperCase() ?? '')
    .join('');
}

export function LinhaAluno({
  nome,
  selo,
  avatar = true,
}: {
  nome: string;
  selo?: TipoSelo;
  avatar?: boolean;
}) {
  return (
    <View style={estilos.linha}>
      {avatar && (
        <View style={estilos.avatar}>
          <Text style={estilos.iniciais}>{iniciais(nome)}</Text>
        </View>
      )}
      <Text style={estilos.nome}>{nome}</Text>
      {selo && <Selo tipo={selo} />}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    minHeight: 64,
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
  nome: { flex: 1, color: cores.texto, fontSize: 16 },
});
