import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function InicioMotorista() {
  return (
    <TelaProvisoria
      telas="C0 e C0b"
      titulo="Hoje do motorista"
      entrega="LIS-04"
      links={[{ rotulo: 'Lista do dia da turma 1', href: '/motorista/hoje/1' }]}
    />
  );
}
