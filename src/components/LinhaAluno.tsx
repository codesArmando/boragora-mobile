import { StyleSheet, Text, View } from 'react-native';

import { Selo, type TipoSelo } from '@/components/Selo';
import { cores } from '@/theme/cores';
import { tipografia } from '@/theme/tipografia';

export function iniciais(nome: string) {
  return (
    nome
      .trim()
      // Hífen também separa: "Motorista-chefe" vira "MC", como no protótipo.
      .split(/[\s-]+/)
      .slice(0, 2)
      .map((parte) => parte[0]?.toLocaleUpperCase() ?? '')
      .join('')
  );
}

export function LinhaAluno({
  nome,
  selo,
  seloFinal,
  detalhe,
  tom = 'normal',
  avatar = true,
}: {
  nome: string;
  /** Selo ao lado do nome (ex.: "Você"). */
  selo?: TipoSelo;
  /** Selo na ponta direita da linha (ex.: "Cancelado", "Liberado"). */
  seloFinal?: TipoSelo;
  /** Texto pequeno abaixo do nome (ex.: "Cancelou depois da saída"). */
  detalhe?: string;
  /** `alerta` pinta o avatar e o detalhe de vermelho (C1, cancelamento tardio). */
  tom?: 'normal' | 'alerta';
  avatar?: boolean;
}) {
  const alerta = tom === 'alerta';
  return (
    <View style={estilos.linha}>
      {avatar && (
        <View style={[estilos.avatar, alerta && estilos.avatarAlerta]}>
          <Text style={[estilos.iniciais, alerta && estilos.textoAlerta]}>{iniciais(nome)}</Text>
        </View>
      )}
      <View style={estilos.textos}>
        <View style={estilos.nomeLinha}>
          <Text style={estilos.nome} numberOfLines={1}>
            {nome}
          </Text>
          {selo && <Selo tipo={selo} />}
        </View>
        {detalhe && <Text style={[estilos.detalhe, alerta && estilos.textoAlerta]}>{detalhe}</Text>}
      </View>
      {seloFinal && <Selo tipo={seloFinal} />}
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
  avatarAlerta: { backgroundColor: cores.alertaFundo },
  iniciais: { color: cores.destaque, fontFamily: tipografia.numero, fontSize: 14 },
  textos: { flex: 1, gap: 2 },
  nomeLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nome: { flexShrink: 1, color: cores.texto, fontFamily: tipografia.texto.medio, fontSize: 17 },
  detalhe: { color: cores.textoApagado, fontFamily: tipografia.texto.regular, fontSize: 14 },
  textoAlerta: { color: cores.perigo },
});
