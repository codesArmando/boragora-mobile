import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function Turmas() {
  return (
    <TelaProvisoria
      telas="D3"
      titulo="Turmas"
      entrega="GES-13"
      links={[
        { rotulo: 'Nova turma', href: '/motorista/gestao/turmas/nova' },
        { rotulo: 'Turma 1', href: '/motorista/gestao/turmas/1' },
      ]}
    />
  );
}
