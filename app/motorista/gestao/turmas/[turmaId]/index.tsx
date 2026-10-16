import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function GerenciarTurma() {
  return (
    <TelaProvisoria
      telas="D5"
      titulo="Gerenciar turma"
      entrega="GES-07, GES-08 e GES-11"
      links={[
        { rotulo: 'Editar', href: '/motorista/gestao/turmas/1/editar' },
        { rotulo: 'Vincular alunos', href: '/motorista/gestao/turmas/1/vincular' },
      ]}
    />
  );
}
