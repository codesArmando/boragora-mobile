import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function Gestao() {
  return (
    <TelaProvisoria
      telas="D1"
      titulo="Gestão"
      entrega="GES-01"
      links={[
        { rotulo: 'Grupos', href: '/motorista/gestao/grupos' },
        { rotulo: 'Turmas', href: '/motorista/gestao/turmas' },
        { rotulo: 'Motoristas', href: '/motorista/gestao/motoristas' },
        { rotulo: 'Alunos', href: '/motorista/gestao/alunos' },
      ]}
    />
  );
}
