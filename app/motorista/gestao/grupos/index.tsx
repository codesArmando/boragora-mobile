import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function Grupos() {
  return (
    <TelaProvisoria
      telas="D8"
      titulo="Grupos"
      entrega="GES-02"
      links={[
        { rotulo: 'Novo grupo', href: '/motorista/gestao/grupos/novo' },
        { rotulo: 'Grupo 1', href: '/motorista/gestao/grupos/1' },
      ]}
    />
  );
}
