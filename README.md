# Boragora Viagens — App

App de controle de passageiros de van, para alunos e motoristas. React Native + Expo (SDK 57) + expo-router, em TypeScript, com NativeWind para estilos.

O app consome a API do repositório [boragora-api](https://github.com/codesArmando/boragora-api). Clone os dois lado a lado, porque este repositório lê os documentos de `../boragora-api/docs/`:

```
Boragora/
├── boragora-api/
└── boragora-mobile/
```

```bash
git clone https://github.com/codesArmando/boragora-api.git
git clone https://github.com/codesArmando/boragora-mobile.git
```

## Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 LTS ou mais novo | Rodar o Expo e as ferramentas |
| App **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) | compatível com o SDK 57 (a versão atual da loja) | Abrir o app no celular sem build nativo |
| A API rodando | — | Veja o [README do boragora-api](../boragora-api/README.md) |

Também dá para usar um emulador Android (Android Studio) ou o simulador do iOS (Xcode, só no macOS), mas o caminho mais simples é o Expo Go no celular.

## Rodando localmente

### 1. Subir a API

O app precisa da API para quase tudo, a começar pelo login. Siga o README do `boragora-api`. Em resumo:

```bash
cd ../boragora-api
docker compose up -d
./gradlew bootRun
```

Confira se `http://localhost:8080/health` responde antes de seguir.

### 2. Instalar as dependências

```bash
cd ../boragora-mobile
npm ci
```

Use `npm ci` (e não `npm install`) para instalar exatamente as versões do `package-lock.json`.

### 3. Iniciar o Expo

```bash
npx expo start
```

Vai aparecer um QR code no terminal.

- **Android:** abra o Expo Go e escaneie o QR code.
- **iOS:** escaneie com a câmera do iPhone e toque no link para abrir no Expo Go.
- **Emulador Android:** com o emulador aberto, aperte `a` no terminal do Expo.

### 4. Entrar

A tela de login ainda é um painel provisório (o visual final vem na entrega ACE-01), mas já entra de verdade na API. Use o admin padrão que a API cria no perfil `dev`:

| Campo | Valor |
|---|---|
| E-mail | `admin@boragora.local` |
| Senha | `admin123` |

A tela de cadastro ainda não está pronta (entrega ACE-02). Para ter um usuário de aluno, crie-o pela API: no Swagger (`http://localhost:8080/swagger-ui.html`), chame `POST /auth/cadastro` com `nome`, `email` e `senha`.

## Como o app encontra a API

Não precisa configurar nada na maioria dos casos. Sem a variável `EXPO_PUBLIC_API_URL`, o app usa **o IP do computador que está rodando o Expo, na porta 8080** (veja `urlBase()` em `src/api/api.ts`). Ou seja, ele espera que a API rode na mesma máquina que o Expo.

Para isso funcionar:

- o celular e o computador precisam estar **na mesma rede Wi-Fi**;
- o firewall do computador precisa liberar conexões de entrada nas portas **8080** (API) e **8081** (Metro, o servidor do Expo).

Teste rápido: abra `http://<IP-do-computador>:8080/health` no navegador do celular. Se não abrir, o problema é de rede ou firewall, não do app.

### Quando definir `EXPO_PUBLIC_API_URL`

Copie o arquivo de exemplo e descomente a linha:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Defina quando:

- a API roda em outra máquina ou em outra porta;
- você usa `npx expo start --tunnel` (o IP do túnel não é o da API);
- a detecção automática pega o IP errado (por exemplo, com VPN ou várias placas de rede).

Nunca use `localhost` no celular: lá, `localhost` é o próprio celular. Depois de mudar o `.env`, reinicie o Expo com cache limpo: `npx expo start -c`.

## Comandos

| Comando | O que faz |
|---|---|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo start -c` | Inicia limpando o cache do Metro |
| `npm run lint` | ESLint + Prettier |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm test` | Testes (Jest) |
| `npm run format` | Formata o código com o Prettier |
| `npx expo install <pacote>` | Adiciona dependência na versão compatível com o SDK. Use no lugar de `npm install <pacote>` |
| `npx expo-doctor` | Diagnostica problemas de dependências e configuração |

Rode `npm run lint`, `npm run typecheck` e `npm test` antes de abrir um PR.

## Problemas comuns

| Sintoma | Causa provável e solução |
|---|---|
| Login falha com erro de rede ou fica carregando | O celular não alcança a API. Confira se a API está de pé, se estão na mesma Wi-Fi e se o firewall libera a 8080 (teste o `/health` pelo navegador do celular). |
| Expo Go diz que o projeto é incompatível com a versão do SDK | Atualize o Expo Go pela loja. O projeto usa o SDK 57. |
| O QR code não conecta | Rede corporativa ou de faculdade costuma bloquear conexões entre aparelhos. Tente `npx expo start --tunnel` e defina `EXPO_PUBLIC_API_URL` com um endereço da API que o celular alcance. |
| Mudei o `.env` e nada mudou | Reinicie com `npx expo start -c`. |
| `URL da API não encontrada. Defina EXPO_PUBLIC_API_URL no .env.` | O app não conseguiu descobrir o IP do Metro. Defina a variável no `.env`. |
| Versão web (`w` no terminal) não consegue chamar a API | A API ainda não tem CORS configurado, então o navegador bloqueia as chamadas. Use o celular ou um emulador. |
| Erro depois de adicionar uma biblioteca nativa | O Expo Go só traz os módulos nativos dele. Bibliotecas com código nativo próprio exigem um development build (`npx expo run:android`). |

## Estrutura

```
app/                  telas e rotas (expo-router): cada arquivo é uma tela
  (auth)/             entrar e criar conta
  aluno/              telas do aluno
  motorista/          telas do motorista
src/api/api.ts        cliente HTTP: único lugar que chama fetch
src/repositories/     acesso aos dados, usado pelas telas (e mocks dos endpoints que ainda não existem)
src/types/            tipos das respostas da API
src/theme/            cores, fontes e espaçamentos
docs/                 plano, checklist e protótipo das telas
```

Regras de camadas: tela (`app/`) → repositório (`src/repositories/`) → api (`src/api/api.ts`). A tela nunca chama `fetch` direto.

## Documentação

| Documento | Conteúdo |
|---|---|
| `docs/plano-implementacao-frontend.md` | Plano por entregas do app |
| `docs/checklist-frontend.md` | O que já está pronto no app |
| `docs/prototipo/README.md` | Índice do protótipo: liga cada tela ao arquivo e à entrega |
| `../boragora-api/docs/checklist-backend.md` | Quais endpoints da API já existem e podem ser integrados |
| `../boragora-api/docs/plano-implementacao-backend.md` | Formato das respostas da API |

Se a tela precisar de um endpoint que ainda não existe na API, use o objeto fixo de `src/repositories/mocks/` e anote "aguardando EN" no checklist.

## Como contribuir

1. Atualize a `master` e crie uma branch a partir dela, por exemplo `front/FND-08-nome-da-entrega`.
2. Siga a entrega em andamento no `docs/plano-implementacao-frontend.md`.
3. Rode lint, typecheck e testes.
4. Marque no `docs/checklist-frontend.md` os itens concluídos.
5. Abra um Pull Request para a `master`.
