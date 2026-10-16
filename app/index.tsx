import { TelaProvisoria } from '@/components/TelaProvisoria';

// Mapa de rotas do esqueleto (FND-01), para cada trilha abrir as suas telas sem login.
// A FND-07 troca esta tela pelo redirecionamento conforme a sessão e o papel.
export default function Index() {
  return (
    <TelaProvisoria
      telas="Mapa de rotas"
      titulo="Boragora Viagens"
      entrega="FND-07"
      links={[
        { rotulo: 'Acesso: Entrar (A1)', href: '/entrar' },
        { rotulo: 'Acesso: Criar conta (A2)', href: '/criar-conta' },
        { rotulo: 'Aluno: Hoje', href: '/aluno/hoje' },
        { rotulo: 'Aluno: Grupo', href: '/aluno/grupo' },
        { rotulo: 'Aluno: Conta', href: '/aluno/conta' },
        { rotulo: 'Motorista: Hoje', href: '/motorista/hoje' },
        { rotulo: 'Motorista: Grupo', href: '/motorista/grupo' },
        { rotulo: 'Motorista: Conta', href: '/motorista/conta' },
        { rotulo: 'Chefe: Gestão', href: '/motorista/gestao' },
      ]}
    />
  );
}
