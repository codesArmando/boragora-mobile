import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function GruposMotorista() {
  return (
    <TelaProvisoria
      telas="C3a"
      titulo="Grupos"
      entrega="LIS-01"
      links={[{ rotulo: 'Grupo 1', href: '/motorista/grupo/1' }]}
    />
  );
}
