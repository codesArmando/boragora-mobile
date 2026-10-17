import { StyleSheet, Text } from 'react-native';

import { TelaProvisoria } from '@/components/TelaProvisoria';
import { useSessao } from '@/contexts/SessaoContext';
import { cores } from '@/theme/cores';

export default function Entrar() {
  const { sessaoExpirada } = useSessao();

  return (
    <TelaProvisoria
      telas="A1"
      titulo="Entrar"
      entrega="ACE-01"
      links={[
        { rotulo: 'Criar conta', href: '/criar-conta' },
        { rotulo: 'Mapa de rotas', href: '/' },
      ]}
    >
      {sessaoExpirada && <Text style={estilos.aviso}>Sua sessão expirou</Text>}
    </TelaProvisoria>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    marginTop: 18,
    color: cores.perigo,
    fontSize: 16,
  },
});
