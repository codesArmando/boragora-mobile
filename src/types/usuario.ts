export type Papel = 'MOTORISTA' | 'ALUNO';

// Resposta de `GET /me` e campo `usuario` do login e do cadastro.
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  admin: boolean;
}
