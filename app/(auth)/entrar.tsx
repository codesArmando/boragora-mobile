import { StyleSheet, Text } from 'react-native';

import { PainelEntrarProvisorio } from '@/components/PainelSessaoProvisorio';
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
        // Provisório (FND-03): atalho para o catálogo de componentes. Sai com a ACE-01.
        ...(__DEV__ ? [{ rotulo: 'Catálogo de componentes', href: '/catalogo' as const }] : []),
      ]}
    >
      {sessaoExpirada && <Text style={estilos.aviso}>Sua sessão expirou</Text>}
      <PainelEntrarProvisorio />
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
