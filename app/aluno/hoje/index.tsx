import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function InicioAluno() {
  return (
    <TelaProvisoria
      telas="Tela inicial e A3"
      titulo="Hoje do aluno"
      entrega="ALU-01"
      links={[{ rotulo: 'Plano de hoje da turma 1', href: '/aluno/hoje/1' }]}
    />
  );
}
