import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function ListaDoDia() {
  return (
    <TelaProvisoria
      telas="C1, C2 e C5"
      titulo="Lista do dia"
      entrega="LIS-05"
      links={[{ rotulo: 'Alunos da turma 1', href: '/motorista/hoje/1/alunos' }]}
    />
  );
}
