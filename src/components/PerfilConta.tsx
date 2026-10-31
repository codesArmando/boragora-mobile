import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Usuario } from '@/types/usuario';
import { cores } from '@/theme/cores';
import { medidas } from '@/theme/medidas';
import { tipografia } from '@/theme/tipografia';

function iniciais(nome: string) {
  return nome.split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
}

export function PerfilConta({ usuario, aoSair, ocupado = false }: {
  usuario: Usuario;
  aoSair: () => void;
  ocupado?: boolean;
}) {
  return (
    <View style={estilos.container}>
      <View style={estilos.avatar}><Text style={estilos.iniciais}>{iniciais(usuario.nome)}</Text></View>
      <Text style={estilos.nome}>{usuario.nome}</Text>
      <Text style={estilos.email}>{usuario.email}</Text>
      <Pressable onPress={aoSair} disabled={ocupado} style={estilos.botao} accessibilityRole="button">
        <Text style={estilos.textoBotao}>{ocupado ? 'Saindo…' : 'Sair'}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { alignItems: 'center', gap: 12, paddingVertical: 26 },
  avatar: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.superficieInterna, borderWidth: 1, borderColor: cores.borda },
  iniciais: { color: cores.destaque, fontFamily: tipografia.numero, fontSize: 28 },
  nome: { color: cores.texto, fontFamily: tipografia.texto.negrito, fontSize: 20, textAlign: 'center' },
  email: { color: cores.textoSecundario, fontFamily: tipografia.texto.regular, fontSize: 16 },
  botao: { minHeight: medidas.alturaBotao, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: cores.perigo, borderRadius: medidas.raioBotao, marginTop: 12 },
  textoBotao: { color: cores.perigo, fontFamily: tipografia.texto.negrito, fontSize: 16 },
});
