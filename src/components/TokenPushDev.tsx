import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { obterTokenPush, pushDisponivel } from '@/push/push';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';
import { medidas } from '@/theme/medidas';

// Só em desenvolvimento (NOT-01): mostra o Expo push token do aparelho, para colar na
// ferramenta de teste do Expo (https://expo.dev/notifications). Não aparece no app publicado.
export function TokenPushDev() {
  const disponivel = pushDisponivel();
  const [texto, setTexto] = useState(
    disponivel
      ? 'Buscando o token…'
      : 'Sem push aqui: use o development build em um aparelho Android.',
  );

  useEffect(() => {
    let ativo = true;
    if (!__DEV__ || !disponivel) {
      return;
    }
    void obterTokenPush().then((token) => {
      if (ativo) {
        setTexto(token ?? 'Sem token: confira a permissão e o projectId do EAS.');
      }
    });
    return () => {
      ativo = false;
    };
  }, [disponivel]);

  if (!__DEV__) {
    return null;
  }
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.rotulo}>Token de push (desenvolvimento)</Text>
      <Text selectable style={estilos.token}>
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    gap: 4,
    padding: 12,
    borderRadius: medidas.raioCartao,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: cores.borda,
  },
  rotulo: { fontFamily: tipografia.texto.semibold, color: cores.textoApagado, fontSize: 12 },
  token: { fontFamily: tipografia.texto.regular, color: cores.textoSecundario, fontSize: 13 },
});
