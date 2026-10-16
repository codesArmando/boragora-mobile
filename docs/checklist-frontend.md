# Checklist de Acompanhamento do Frontend
## Boragora Viagens — App de Controle de Passageiros de Van

**Referência:** `plano-implementacao-frontend.md` (versão 4). Cada entrega abaixo tem o mesmo código da seção 5 do plano. As telas citadas são as do protótipo revisado em 2026-10-13.

**Como usar:**
- Marcar `[x]` quando o item estiver concluído. Cada pessoa segue a ordem da sua trilha (seção 3.2 do plano). As ondas abaixo agrupam as entregas pela etapa do backend de que precisam para serem concluídas.
- Itens de **Construção** são marcados quando o código existe, compila e passa no lint.
- Itens de **Critérios de aceite** são conferidos no aparelho (ou no emulador) **com o backend real**, por uma pessoa da equipe diferente de quem construiu. A exceção são os itens com a indicação *(teste automatizado)*, que só são marcados com um teste do `jest-expo` passando.
- Entrega construída com dados falsos, enquanto a etapa do backend não fecha, fica com os critérios desmarcados e a anotação **"aguardando EN"** ao lado do título.
- A linha "Backend" de cada entrega diz o que precisa estar marcado no `checklist-backend.md` para os critérios poderem ser conferidos.
- Uma onda está concluída quando todas as suas entregas estão marcadas. Nesse momento, atualizar a tabela de progresso.
- Qualquer decisão tomada durante a execução que não esteja no plano vai para a tabela do final.

---

## Progresso geral

| Onda | Entrega | Backend necessário | Status | Concluída em |
|---|---|---|---|---|
| 0 | Fundação | E0, E2 e E3 (prontas) | Não iniciada | |
| 1 | Acesso e grupos | E2 e E3 (prontas) | Não iniciada | |
| 2 | Turmas e vínculos | E4 e E5 | Não iniciada | |
| 3 | Plano do dia | E6 | Não iniciada | |
| 4 | Listas do dia | E7 | Não iniciada | |
| 5 | Notificações | E8 | Não iniciada | |
| 6 | Fechamento | E9 | Não iniciada | |

Valores de status: Não iniciada, Em andamento, Aguardando backend, Concluída.

## Progresso por pessoa

| Pessoa | Entregas | Concluídas |
|---|---|---|
| 1 — Acesso, sessão, navegação e notificações | `FND-01`, `FND-05`, `FND-06`, `FND-07`, `ACE-01`, `ACE-02`, `NOT-01` a `NOT-03` | 0 de 9 |
| 2 — Gestão do motorista-chefe | `FND-03`, `GES-01` a `GES-11` | 0 de 12 |
| 3 — Motorista e listas de consulta | `FND-04`, `FND-08`, `LIS-01`, `LIS-03` a `LIS-06`, `GES-12`, `GES-13`, `ACE-04` | 0 de 10 |
| 4 — Aluno | `FND-02`, `ALU-01` a `ALU-06`, `LIS-02`, `ACE-03` | 0 de 9 |
| Todos | `FEC-01` a `FEC-04` | 0 de 4 |

---

## Onda 0 — Fundação

### `FND-01` Criar o projeto Expo e o esqueleto · pessoa 1
Backend: nenhum.

**Construção**
- [ ] Projeto Expo com TypeScript e expo-router no repositório `boragora-mobile`, clonado ao lado do `boragora-api` na pasta `Boragora/`
- [ ] `CLAUDE.md`, `.claude/settings.json` e `docs/` (plano, checklist e `prototipo/`) na raiz do repositório
- [ ] ESLint e Prettier configurados
- [ ] Atalho `@/` apontando para `src/`
- [ ] `.env.example` com `EXPO_PUBLIC_API_URL`
- [ ] Pastas `app/`, `assets/` e `src/` com `api/`, `repositories/mocks/`, `types/`, `components/`, `contexts/`, `theme/` e `utils/`
- [ ] Esqueleto: `theme/cores.ts` e `theme/medidas.ts` com os valores da seção 2.3 do plano
- [ ] Esqueleto: todos os arquivos de rota da seção 2.2 do plano, com telas provisórias
- [ ] Esqueleto: `api/api.ts` mínimo com `get`, `post`, `put` e `del` (URL base de `EXPO_PUBLIC_API_URL` e JSON), na forma final

**Critérios de aceite**
- [ ] `npx expo start` abre o app no Expo Go *(verificação manual)*
- [ ] `npm run lint` passa sem erro

### `FND-02` Fontes, tipografia e imagens da marca · pessoa 4
Backend: nenhum.

**Construção**
- [ ] `theme/tipografia.ts` com os valores da seção 2.3 do plano (cores e medidas já vêm do esqueleto da `FND-01`)
- [ ] Barlow e Saira carregadas antes de esconder a tela de abertura
- [ ] Ícone do app e tela de abertura configurados, a partir de `docs/prototipo/marca/`
- [ ] Logo e símbolo copiados de `docs/prototipo/assets/` para `assets/`
- [ ] Componente `Tela` (área segura e fundo)

**Critérios de aceite**
- [ ] Uma tela de exemplo mostra título em Saira itálica, texto em Barlow e número em Saira, em Android *(verificação manual)*
- [ ] Ícone e tela de abertura aparecem com a marca *(verificação manual)*

### `FND-03` Componentes de formulário e de ação · pessoa 2
Backend: nenhum.

**Construção**
- [ ] `Botao` (primário, contorno, texto e perigo; carregando e desabilitado)
- [ ] `CampoTexto` (rótulo, mensagem de erro, senha e máscara `HH:mm`)
- [ ] `Cabecalho` (voltar, título, subtítulo e ação à direita)
- [ ] `SeletorSegmentado` (Ida/Volta, Em aula/Liberado, Manhã/Tarde/Noite)
- [ ] `Aviso` (alertas da B5 e da B6)
- [ ] `DialogoConfirmacao`
- [ ] `SeletorModal`

**Critérios de aceite**
- [ ] Todos os componentes aparecem em uma tela de catálogo *(verificação manual)*
- [ ] Toda área de toque tem pelo menos 44 de altura *(verificação manual)*
- [ ] A máscara `HH:mm` aceita só horários válidos *(teste automatizado)*

### `FND-04` Componentes de cartão e de lista · pessoa 3
Backend: nenhum.

**Construção**
- [ ] `Cartao` e `CartaoAtalho` (os cartões independentes da D1)
- [ ] `BlocoHorarios` e `Contadores`
- [ ] `LinhaAluno` (iniciais, nome e selo) e `LinhaPessoa` (iniciais, nome e e-mail)
- [ ] `Selo` (Você, Sua turma, Cancelado, Liberado, Em aula, Vinculado, Sem turma)
- [ ] `EstadoVazio`, `EstadoErro` (com "Tentar de novo") e `Carregando`
- [ ] `ListaAtualizavel` (puxar para atualizar)

**Critérios de aceite**
- [ ] A tela de catálogo reproduz um cartão da C0, a lista da C2 e os quatro cartões da D1 *(verificação manual)*

### `FND-05` `api.ts` completo, erros e tipos de acesso · pessoa 1
Backend: E0 (pronta) — formato padrão de erro.

**Construção**
- [ ] `api/api.ts` do esqueleto completado sem mudar a forma de chamar, com tempo limite
- [ ] Cabeçalho `Authorization` com o token da sessão
- [ ] Classe `ErroApi` com `status`, `codigo`, `mensagem` e `campos`
- [ ] Falha de rede convertida em "Sem conexão com o servidor"
- [ ] Ponto único para avisar a sessão sobre o 401
- [ ] `types/erro.ts`, `types/auth.ts` e `types/usuario.ts` (os demais tipos são criados por quem usa o endpoint primeiro, seção 2.5 do plano)

**Critérios de aceite**
- [ ] Resposta 200, erro no formato padrão, erro fora do formato e falha de rede tratados *(teste automatizado)*
- [ ] `GET /health` responde pelo aparelho *(verificação manual)*

### `FND-06` Sessão: login, token e expiração · pessoa 1
Backend: E2 (pronta) — `POST /auth/login`, `POST /auth/cadastro`, `GET /me`, 401 com token expirado.

**Construção**
- [ ] `repositories/authRepository.ts`
- [ ] `contexts/SessaoContext.tsx` com `entrar`, `cadastrar` e `sair`
- [ ] Token gravado no `expo-secure-store`
- [ ] Restauração da sessão com `GET /me` ao abrir o app
- [ ] 401 em rota autenticada limpa a sessão e leva à A1 com o aviso "Sua sessão expirou"

**Critérios de aceite**
- [ ] Fechar e abrir o app mantém o login *(verificação manual)*
- [ ] Com token inválido ou expirado, o app volta para a A1 com o aviso *(verificação manual)*

### `FND-07` Navegação, abas e guarda por papel · pessoa 1
Backend: E2 (pronta) — `papel` e `admin` em `GET /me`.

**Construção**
- [ ] Abas do aluno: Hoje, Grupo, Conta
- [ ] Abas do motorista: Hoje, Grupo, Conta; do chefe: Hoje, Grupo, Gestão, Conta
- [ ] Aba Gestão escondida para quem não é admin; `gestao/_layout.tsx` recusa quem não é admin
- [ ] `index.tsx` redireciona: sem sessão → A1; `ALUNO` → `/aluno/hoje`; `MOTORISTA` (com ou sem `admin`) → `/motorista/hoje`
- [ ] Formulários da gestão (D2, D2b, D4, D5a, D6 e D7) sem barra de abas
- [ ] Pilhas "hoje" com `initialRouteName` "index"

**Critérios de aceite**
- [ ] O admin de desenvolvimento (`admin@boragora.local`) vê as quatro abas do chefe *(verificação manual)*
- [ ] Um motorista comum vê três abas e não consegue abrir `/motorista/gestao` *(verificação manual)*
- [ ] Um aluno vê as abas do aluno e não consegue abrir rotas de `motorista/` *(verificação manual)*

### `FND-08` Repositório e tela de modelo, dados falsos · pessoa 3
Backend: E3 (pronta) — `GET /grupos`.

**Construção**
- [ ] `repositories/grupoRepository.ts` com `listarGrupos` e `buscarGrupo`, e `types/grupo.ts`
- [ ] Tela de modelo com os quatro estados (carregando, erro, vazio, com dados) e recarga ao focar
- [ ] `repositories/mocks/` com os grupos do protótipo, tipados com `types/` (cada trilha acrescenta os dados falsos dos seus endpoints)
- [ ] Padrão documentado de troca entre objeto fixo e chamada real

**Critérios de aceite**
- [ ] A tela de modelo lista os grupos reais da API *(verificação manual)*
- [ ] A tela de modelo foi revisada por toda a equipe *(verificação manual)*

---

## Onda 1 — Acesso e grupos

### `ACE-01` Tela de entrar (A1) · pessoa 1
Backend: E2 (pronta) — login; mesmo 401 para senha errada, e-mail inexistente e usuário inativo.

**Construção**
- [ ] Tela A1 com logo, e-mail, senha, "Entrar" e link "Criar conta"

**Critérios de aceite**
- [ ] Login válido leva à tela inicial do papel *(verificação manual)*
- [ ] Login inválido mostra a mensagem do backend sem limpar o e-mail *(verificação manual)*
- [ ] O botão fica em estado de carregamento durante a chamada *(verificação manual)*

### `ACE-02` Tela de criar conta (A2) · pessoa 1
Backend: E2 (pronta) — cadastro; 409 `EMAIL_JA_CADASTRADO`.

**Construção**
- [ ] Tela A2 com nome, e-mail, senha, "Criar conta" e link "Entrar"

**Critérios de aceite**
- [ ] Cadastro válido deixa o aluno logado e abre a A3 *(verificação manual)*
- [ ] E-mail repetido marca o campo de e-mail com a mensagem do backend *(verificação manual)*
- [ ] Senha com menos de 6 caracteres é barrada no app e também tratada se vier como 400 *(verificação manual)*

### `NOT-01` Prova de conceito do push · pessoa 1
Backend: nenhum.

**Construção**
- [ ] Projeto no EAS e `projectId` na configuração do app
- [ ] Credenciais do Firebase (FCM) para Android
- [ ] `expo-notifications` com pedido de permissão e canal de notificações
- [ ] Development build instalado em um aparelho Android

**Critérios de aceite**
- [ ] O app mostra o Expo push token no aparelho *(verificação manual)*
- [ ] Uma notificação enviada pela ferramenta de teste do Expo chega ao aparelho *(verificação manual)*

### `GES-01` Tela de gestão (D1) · pessoa 2
Backend: nenhum.

**Construção**
- [ ] Título "Gestão" e quatro `CartaoAtalho` independentes: Grupos, Turmas, Motoristas e Alunos
- [ ] Cada cartão abre a tela correspondente (D8, D3, D9 e D10)

**Critérios de aceite**
- [ ] A tela confere com a D1 do protótipo, sem lista nem botão de cadastro *(verificação manual)*

### `GES-02` Lista de grupos (D8) · pessoa 2
Backend: E3 (pronta) — `GET /grupos` com `totalTurmas`.

**Construção**
- [ ] Tela D8 com voltar, título "Grupos" e botão "Novo grupo"
- [ ] Um cartão por grupo com "Ida HH:mm · Volta HH:mm · N turmas", abrindo a D2b
- [ ] Estado vazio "Nenhum grupo cadastrado" com o mesmo botão

**Critérios de aceite**
- [ ] Lista os grupos reais da API *(verificação manual)*
- [ ] Ao voltar de um cadastro ou edição, a lista se atualiza *(verificação manual)*

### `GES-03` Novo grupo (D2) · pessoa 2
Backend: E3 (pronta) — criação; 400 quando a ida não é anterior à volta.

**Construção**
- [ ] `repositories/grupoRepository.ts` com `criarGrupo`
- [ ] Formulário com nome, período (Manhã/Tarde/Noite) e horários com máscara `HH:mm`

**Critérios de aceite**
- [ ] Salvar cria o grupo e volta para a D8 *(verificação manual)*
- [ ] Ida igual ou posterior à volta marca o campo indicado em `campos` *(verificação manual)*

### `GES-04` Editar e excluir grupo (D2b) · pessoa 2
Backend: E3 (pronta) — `GET /grupos/{id}`, `PUT` e `DELETE /admin/grupos/{id}`, 409 `GRUPO_COM_TURMAS`.

**Construção**
- [ ] `atualizarGrupo` e `excluirGrupo` no repositório
- [ ] Tela D2b carregada com os dados do grupo, "Salvar alterações" e "Excluir grupo"
- [ ] Diálogo de confirmação antes de excluir

**Critérios de aceite**
- [ ] Editar os horários reflete na D8 *(verificação manual)*
- [ ] Excluir grupo sem turmas volta para a D8 sem o grupo *(verificação manual)*
- [ ] Excluir grupo com turmas mostra a orientação de excluir as turmas antes *(verificação manual)*

### `LIS-01` Meus grupos (B8a e C3a) · pessoa 3
Backend: E3 (pronta) — `GET /grupos` com `minhaTurma`. Dados reais de aluno e motorista comum dependem de E4 e E5.

**Construção**
- [ ] Componente único para B8a (aluno) e C3a (motorista e chefe), mudando só o texto de apoio
- [ ] Cartão com grupo, "Sua turma: nome · N turmas no grupo" (ou só "N turmas no grupo" quando `minhaTurma` é nulo) e horários
- [ ] Estado vazio "Você ainda não está em nenhum grupo"

**Critérios de aceite**
- [ ] O chefe vê todos os grupos *(verificação manual)*
- [ ] Um aluno sem vínculo vê o estado vazio *(verificação manual)*
- [ ] Com vínculos reais (depois da E5), aluno e motorista veem só os seus grupos *(verificação manual)*

---

## Onda 2 — Turmas e vínculos

### `GES-05` Motoristas: lista e cadastro (D9 e D7) · pessoa 2
Backend: E4 — `GET /admin/motoristas` e `POST /admin/motoristas`.

**Construção**
- [ ] `repositories/motoristaRepository.ts`
- [ ] Tela D9 com voltar, "Novo motorista" e lista com iniciais, nome e e-mail (o chefe com o selo "Você")
- [ ] Tela D7 com nome, e-mail, senha e "Confirmar senha"
- [ ] Conferência de senha e confirmação feita no app, antes de chamar a API

**Critérios de aceite**
- [ ] Cadastrar volta para a D9 com o motorista novo na lista *(verificação manual)*
- [ ] Senhas diferentes são barradas no app *(verificação manual)*
- [ ] E-mail repetido marca o campo de e-mail *(verificação manual)*
- [ ] O motorista criado entra no app e vê as abas de motorista, sem Gestão *(verificação manual)*

### `GES-13` Lista de turmas (D3) · pessoa 3
Backend: E4 — `GET /admin/turmas`; E5 para `totalAlunos` maior que zero.

**Construção**
- [ ] `listarTurmasAdmin` em `repositories/turmaRepository.ts`
- [ ] Tela D3 com voltar, título "Turmas" e botão "Nova turma"
- [ ] Turmas agrupadas por grupo ("nome · ida HH:mm · volta HH:mm"), com nome da turma, motorista e "N alunos"
- [ ] Estado vazio "Nenhuma turma cadastrada"

**Critérios de aceite**
- [ ] Lista as turmas reais, na ordem dos grupos *(verificação manual)*
- [ ] Tocar em uma turma abre a D5 dela *(verificação manual)*

### `GES-06` Nova turma (D4) · pessoa 2
Backend: E4 — `POST /admin/turmas` com `nome`, validação do nome, 409 `CONFLITO_GRUPO_MOTORISTA`.

**Construção**
- [ ] `criarTurma` no repositório
- [ ] Seletor de grupo e de motorista com `SeletorModal`
- [ ] Campos "Nome da turma" (obrigatório, até 60 caracteres), número da van e capacidade (opcionais)

**Critérios de aceite**
- [ ] Criar abre a D5 da turma nova *(verificação manual)*
- [ ] Nome em branco ou com mais de 60 caracteres mostra o erro no campo *(verificação manual)*
- [ ] Motorista que já conduz turma no grupo mostra o conflito junto ao seletor de motorista *(verificação manual)*

### `GES-07` Gerenciar turma: leitura (D5) · pessoa 2
Backend: E4 — `GET /turmas/{id}`.

**Construção**
- [ ] `buscarTurma` no repositório
- [ ] Tela D5 com motorista ("Trocar"), dados da turma ("Van nº N · N lugares", "Editar"), total de alunos e "Vincular"

**Critérios de aceite**
- [ ] A tela mostra os dados reais da turma, com os alunos em ordem alfabética *(verificação manual)*

### `GES-08` Trocar motorista e editar dados (D5 e D5a) · pessoa 2
Backend: E4 — `PUT /admin/turmas/{id}`; conflito também na troca.

**Construção**
- [ ] `atualizarTurma` no repositório
- [ ] "Trocar" na D5 abre o `SeletorModal` de motoristas e salva
- [ ] Tela D5a com o grupo (somente leitura), nome, número da van e capacidade, e "Salvar alterações"

**Critérios de aceite**
- [ ] Trocar o motorista reflete na D5 *(verificação manual)*
- [ ] Conflito de grupo na troca mostra a mensagem e mantém o motorista anterior *(verificação manual)*
- [ ] Editar o nome reflete na D5 e na D3 *(verificação manual)*

### `GES-09` Excluir turma (D5a) · pessoa 2
Backend: E4 — `DELETE /admin/turmas/{id}`.

**Construção**
- [ ] `excluirTurma` no repositório
- [ ] Botão "Excluir turma" com diálogo avisando que vínculos, viagens e confirmações são apagados

**Critérios de aceite**
- [ ] Excluir volta para a D3 sem a turma *(verificação manual)*
- [ ] Cancelar o diálogo não chama a API *(verificação manual)*

### `GES-10` Vincular alunos (D6) · pessoa 2
Backend: E5 — `GET /admin/alunos?turmaId=`, `POST /admin/turmas/{id}/alunos`, 409 `CONFLITO_GRUPO_ALUNO`.

**Construção**
- [ ] `repositories/alunoRepository.ts` com `buscarAlunos` e `vincularAlunos`
- [ ] Busca por nome ou e-mail, com pequena espera entre as teclas
- [ ] Linhas com "Sem turma", a turma de outro grupo, ou "Já está na [turma] deste grupo" com a caixa desabilitada
- [ ] Botão com a contagem ("Vincular 2 alunos")

**Critérios de aceite**
- [ ] Vincular dois alunos volta para a D5 com os dois na lista *(verificação manual)*
- [ ] Conflito no lote mostra quem causou e ninguém é vinculado *(verificação manual)*

### `GES-11` Remover aluno da turma (D5) · pessoa 2
Backend: E5 — `DELETE /admin/turmas/{id}/alunos/{alunoId}`.

**Construção**
- [ ] `removerAluno` no repositório
- [ ] Botão de remover em cada aluno da D5, com diálogo de confirmação

**Critérios de aceite**
- [ ] O aluno removido some da D5 e passa a aparecer como disponível na D6 *(verificação manual)*

### `GES-12` Lista de alunos (D10) · pessoa 3
Backend: E5 — `GET /admin/alunos` sem `turmaId`.

**Construção**
- [ ] `listarAlunos` no repositório (sem `turmaId`)
- [ ] Tela D10 com voltar, texto de "somente consulta", busca e total de alunos
- [ ] Linhas com nome, e-mail e selo "Vinculado" (quando `turmas` não está vazia) ou "Sem turma"
- [ ] Nenhuma ação ao tocar na linha

**Critérios de aceite**
- [ ] Aparecem alunos com e sem vínculo *(verificação manual)*
- [ ] Um aluno recém-cadastrado aparece como "Sem turma" e passa a "Vinculado" depois da D6 *(verificação manual)*

### `LIS-06` Alunos da turma (C4) · pessoa 3
Backend: E4 — `GET /turmas/{id}`; E5 para a lista ter alunos.

**Construção**
- [ ] Tela C4 com motorista, horários, capacidade (quando houver) e alunos vinculados com o total

**Critérios de aceite**
- [ ] A lista confere com a D5 da mesma turma *(verificação manual)*

---

## Onda 3 — Plano do dia

### `ALU-01` Tela inicial do aluno e A3 · pessoa 4
Backend: E6 — `GET /aluno/turmas`, inclusive lista vazia para aluno sem vínculo.

**Construção**
- [ ] `repositories/planoRepository.ts` com `listarMinhasTurmas`
- [ ] Um cartão por turma com `grupo.nome · turma.nome`, motorista, horários e resumo de hoje
- [ ] "Marcar presença" (primário) sem nada marcado; "Alterar presença" (contorno) nos outros casos
- [ ] A3 quando a lista vem vazia, com o e-mail da conta

**Critérios de aceite**
- [ ] Aluno sem vínculo vê a A3 *(verificação manual)*
- [ ] Aluno com duas turmas vê dois cartões com o resumo correto *(verificação manual)*

### `ALU-02` Plano de hoje: leitura e estados · pessoa 4
Backend: E6 — `GET` do plano com o bloco `acoes`; 403 sem vínculo.

**Construção**
- [ ] `buscarPlano` no repositório
- [ ] `utils/estadoDoPlano.ts` com os seis estados da tabela da seção 5.3 do plano
- [ ] Tela de plano com os cartões de Ida e Volta, textos da B1 e da B2
- [ ] A tela abre corretamente pela rota direta (destino da notificação de lembrete)

**Critérios de aceite**
- [ ] `estadoDoPlano` cobre as seis linhas da tabela *(teste automatizado)*
- [ ] Turma sem vínculo mostra acesso negado e volta *(verificação manual)*

### `ALU-03` Marcar e desmarcar ida e volta · pessoa 4
Backend: E6 — `PUT .../plano/ida` e `PUT .../plano/volta`.

**Construção**
- [ ] `alterarIda` e `alterarVolta` no repositório
- [ ] Cartões respondem ao toque só quando `acoes` permite
- [ ] 422 mostra a mensagem do backend e recarrega o plano

**Critérios de aceite**
- [ ] Marcar ida e volta passa da B1 para a B2 *(verificação manual)*
- [ ] Desmarcar tudo volta para a B1 *(verificação manual)*
- [ ] A tela inicial reflete a mudança ao voltar *(verificação manual)*

### `ALU-04` Status da volta · pessoa 4
Backend: E6 — `PUT .../plano/status-volta`; 422 `VOLTA_NAO_INCLUIDA`.

**Construção**
- [ ] `alterarStatusVolta` no repositório
- [ ] Seletor "Em aula / Liberado" só com a volta marcada, com o título "Status da volta" e "Pode mudar até HH:mm"

**Critérios de aceite**
- [ ] Trocar para "Liberado" grava e usa as cores de liberado *(verificação manual)*
- [ ] Desmarcar a volta esconde o seletor *(verificação manual)*

### `ALU-05` Cancelamento tardio da ida (B3, B4 e B5) · pessoa 4
Backend: E6 — cancelamento depois da saída grava `cancelouAposSaida`.

**Construção**
- [ ] Com `acoes.cancelamentoIdaSeraTardio`, desmarcar a ida abre o diálogo da B4
- [ ] B5 com o aviso do WhatsApp em texto, sem botão

**Critérios de aceite**
- [ ] "Manter a ida" fecha o diálogo sem chamar a API *(verificação manual)*
- [ ] "Cancelar a ida" leva à B5, com a volta ainda editável *(verificação manual)*

### `ALU-06` Ida bloqueada e dia encerrado (B6 e B7) · pessoa 4
Backend: E6 — 422 `IDA_ENCERRADA` e `DIA_ENCERRADO`; E0 (pronta) — `app.relogio.fixo`.

**Construção**
- [ ] B6: ida bloqueada com "Encerrada às HH:mm" e o aviso; volta disponível
- [ ] B7: tudo bloqueado com o texto de dia encerrado

**Critérios de aceite**
- [ ] Com o relógio fixo, todos os horários da tabela de aceite da etapa 6 do backend foram percorridos no app *(verificação manual)*
- [ ] Se o horário virar com a tela aberta, o 422 é tratado e a tela se corrige *(verificação manual)*

### `ACE-03` Conta do aluno (B9) · pessoa 4
Backend: E2 (pronta) para perfil e "Sair"; E6 para "Minhas turmas".

**Construção**
- [ ] Tela B9 com iniciais, nome, e-mail, minhas turmas e "Sair", em um componente de conta reaproveitado pela `ACE-04`

**Critérios de aceite**
- [ ] "Sair" limpa a sessão e volta para a A1 *(verificação manual)*
- [ ] As turmas conferem com a tela inicial do aluno *(verificação manual)*

---

## Onda 4 — Listas do dia

### `LIS-04` Hoje do motorista e do chefe (C0 e C0b) · pessoa 3
Backend: E7 — `GET /motorista/turmas` com contadores; lista vazia para o chefe sem turma.

**Construção**
- [ ] `repositories/hojeRepository.ts` com `listarMinhasTurmasHoje`
- [ ] C0: cartão por turma com horários e contadores, "Hoje: ninguém confirmou ainda" e o destaque de cancelamento tardio
- [ ] C0b: estado vazio do chefe sem turma, com o botão "Ver grupos"

**Critérios de aceite**
- [ ] Os contadores conferem com a lista do dia da turma *(verificação manual)*
- [ ] O chefe sem turma vê a C0b *(verificação manual)*

### `LIS-05` Lista do dia da turma (C1, C2 e C5) · pessoa 3
Backend: E7 — `GET /turmas/{id}/hoje`.

**Construção**
- [ ] `buscarTurmaHoje` no repositório
- [ ] Cabeçalho com `turma.nome · grupo.nome` e atalho para a C4; contadores; seletor Ida/Volta
- [ ] C5 quando `semConfirmacoes`
- [ ] Abre com o trecho Ida e funciona pela rota direta (destino da notificação de cancelamento tardio)

**Critérios de aceite**
- [ ] O cancelado tardio aparece primeiro na ida, com o selo "Cancelado", e fora da contagem *(verificação manual)*
- [ ] Na volta, os liberados aparecem primeiro *(verificação manual)*
- [ ] Turma sem confirmações mostra a C5 *(verificação manual)*

### `LIS-02` Grupo do aluno: ida e volta (B8 e B8b) · pessoa 4
Backend: E7 — `GET /grupos/{id}/hoje` com `minhaTurma` e `voce`; 403 fora do grupo.

**Construção**
- [ ] `buscarGrupoHoje` no repositório
- [ ] Tela com o componente `ListaDoGrupo` da `LIS-03`: turma do aluno primeiro com "Sua turma"; o próprio aluno com "Você"; cabeçalho "somente consulta"

**Critérios de aceite**
- [ ] Os nomes e contagens conferem com a lista do motorista da mesma turma *(verificação manual)*

### `LIS-03` Grupo do motorista e do chefe (C3) · pessoa 3
Backend: E7 — o mesmo endpoint.

**Construção**
- [ ] Componente `ListaDoGrupo` (seletor Ida/Volta, turmas e selos), reutilizado pela `LIS-02`
- [ ] Versão de `motorista/` da tela de grupo: turma do usuário recolhida, como atalho para a lista do dia; demais abertas

**Critérios de aceite**
- [ ] O chefe abre qualquer grupo e vê todas as turmas abertas onde não conduz turma *(verificação manual)*

### `ACE-04` Conta do motorista e do chefe (C6) · pessoa 3
Backend: E2 (pronta) para perfil e "Sair"; E7 para "Minhas turmas".

**Construção**
- [ ] Tela C6 reaproveitando o componente da B9, com as turmas que o usuário conduz

**Critérios de aceite**
- [ ] Para o chefe sem turma, "Minhas turmas" não aparece *(verificação manual)*
- [ ] "Sair" volta para a A1 *(verificação manual)*

---

## Onda 5 — Notificações

### `NOT-02` Registrar e remover o token · pessoa 1
Backend: E8 — `PUT /me/push-token` e `DELETE /me/push-token`.

**Construção**
- [ ] `repositories/pushRepository.ts`
- [ ] Envio do token depois do login; remoção antes de apagar a sessão ao sair

**Critérios de aceite**
- [ ] Depois do login, o token aparece gravado no backend *(verificação manual)*
- [ ] Com a permissão negada, o app segue funcionando sem erro *(verificação manual)*

### `NOT-03` Receber e abrir notificações (E1) · pessoa 1
Backend: E8 — push de cancelamento tardio e lembrete, com o campo `data`.

**Construção**
- [ ] Aviso dentro do app quando a notificação chega com o app aberto
- [ ] Tratamento do toque com o app aberto e fechado, conforme a tabela da seção 5.6 do plano

**Critérios de aceite**
- [ ] O lembrete abre a B1 da turma, e voltar leva à tela inicial do aluno *(verificação manual)*
- [ ] O cancelamento tardio abre a C1 da turma, para o motorista comum e para o chefe responsável *(verificação manual)*
- [ ] Sem `data`, o toque abre a tela inicial do papel *(verificação manual)*
- [ ] Títulos e textos conferem com a E1 *(verificação manual)*

---

## Onda 6 — Fechamento

### `FEC-01` Roteiro de teste de ponta a ponta · todos
Backend: E9 — carga de dados e `app.relogio.fixo`.

- [ ] Roteiro escrito: o chefe cria grupo, motorista e turma pela aba Gestão; o aluno se cadastra e aparece na D10 como "Sem turma"; o chefe vincula; o aluno declara o plano; o motorista vê a lista; o aluno cancela depois da saída; o motorista recebe o push e cai na C1 com o aluno cancelado
- [ ] Roteiro executado pela pessoa 1 *(verificação manual)*
- [ ] Roteiro executado pela pessoa 2 *(verificação manual)*
- [ ] Roteiro executado pela pessoa 3 *(verificação manual)*
- [ ] Roteiro executado pela pessoa 4 *(verificação manual)*

### `FEC-02` Teste no aparelho pela rede local · todos
Backend: E9 — API escutando em `0.0.0.0`.

- [ ] O app no celular faz login na API da máquina local *(verificação manual; também marca o último critério da E9 no `checklist-backend.md`)*

### `FEC-03` Revisão visual e de acessibilidade · todos

- [ ] Cada tela comparada com o protótipo *(verificação manual)*
- [ ] Botões só de ícone com rótulo de acessibilidade *(verificação manual)*
- [ ] Nenhuma tela mostra "Van N" montado pelo app *(verificação manual)*

### `FEC-04` README do app · todos

- [ ] Instalação e configuração de `EXPO_PUBLIC_API_URL`
- [ ] Como trocar dados falsos por reais
- [ ] Como gerar o development build
- [ ] Usuários de demonstração

---

## Pendências de conferência da equipe

- [ ] Confirmar com o professor se o Expo Push Service atende ao RNF04 (também listado no `checklist-backend.md`)
- [ ] Combinar como trocar `app.relogio.fixo` durante os testes das telas B1 a B7

---

## Decisões tomadas durante a execução

Registrar aqui tudo o que for decidido na implementação e não estiver no plano, inclusive divergências entre o protótipo e o plano (convenção 11).

| Data | Entrega | Decisão | Motivo |
|---|---|---|---|
| | | | |
