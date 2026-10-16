import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function GruposAluno() {
  return (
    <TelaProvisoria
      telas="B8a"
      titulo="Meus grupos"
      entrega="LIS-01"
      links={[{ rotulo: 'Grupo 1', href: '/aluno/grupo/1' }]}
    />
  );
}
