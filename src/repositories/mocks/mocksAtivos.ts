// Interruptores dos dados falsos (decisão 14 do plano). Cada etapa do backend que ainda não
// fechou fica `true`; quando ela fechar e a tela for testada com a API real, a troca é virar
// o valor para `false`. O repositório já tem as duas versões.
export const mocksAtivos = {
  /** Motoristas e turmas: `GET`/`POST /admin/motoristas`, `/admin/turmas`, `GET /turmas/{id}`. */
  e4: true,
  /** Vínculos: `GET /admin/alunos`, `POST`/`DELETE /admin/turmas/{id}/alunos`. */
  e5: true,
  /** Grupos: `GET /grupos` e `GET /grupos/{id}` da etapa E3, concluída. */
  e3: false,
  /** Listagens do dia de motoristas, grupos e turmas. */
  e7: true,
};
