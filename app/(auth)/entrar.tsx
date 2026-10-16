import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function Entrar() {
  return (
    <TelaProvisoria
      telas="A1"
      titulo="Entrar"
      entrega="ACE-01"
      links={[{ rotulo: 'Criar conta', href: '/criar-conta' }]}
    />
  );
}
