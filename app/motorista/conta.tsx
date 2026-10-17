import { PainelContaProvisorio } from '@/components/PainelSessaoProvisorio';
import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function ContaMotorista() {
  return (
    <TelaProvisoria telas="C6" titulo="Conta" entrega="ACE-04">
      <PainelContaProvisorio />
    </TelaProvisoria>
  );
}
