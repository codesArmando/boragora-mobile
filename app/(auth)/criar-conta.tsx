import { TelaProvisoria } from '@/components/TelaProvisoria';

export default function CriarConta() {
  return (
    <TelaProvisoria
      telas="A2"
      titulo="Criar conta"
      entrega="ACE-02"
      links={[{ rotulo: 'Entrar', href: '/entrar' }]}
    />
  );
}
