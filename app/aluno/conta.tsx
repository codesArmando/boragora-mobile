import { PainelContaProvisorio } from '@/components/PainelSessaoProvisorio';
import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function ContaAluno() {
  return (
    <TelaProvisoria telas="B9" titulo="Conta" entrega="ACE-03">
      <PainelContaProvisorio />
    </TelaProvisoria>
  );
}
