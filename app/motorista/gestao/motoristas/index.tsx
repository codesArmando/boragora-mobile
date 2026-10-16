import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function Motoristas() {
  return (
    <TelaProvisoria
      telas="D9"
      titulo="Motoristas"
      entrega="GES-05"
      links={[{ rotulo: 'Novo motorista', href: '/motorista/gestao/motoristas/novo' }]}
    />
  );
}
