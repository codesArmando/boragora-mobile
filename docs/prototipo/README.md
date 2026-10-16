# Protótipo das telas — Boragora Viagens

Exportado em 2026-10-16 do canvas "Boragora Viagens — Marca e app" (revisão de 2026-10-13). Se o protótipo mudar no canvas, exportar de novo.

## O que tem aqui

| Pasta | Conteúdo | Para que serve |
|---|---|---|
| `png/` | Uma imagem por tela, em 780 × 1688 (390 × 844 em densidade 2x) | Ver a tela. É a referência visual principal. |
| `html/` | A mesma tela em HTML, que abre no navegador sem internet; os botões e links navegam entre as telas | Conferir valores exatos: cores, tamanhos de fonte, espaçamentos, raios e textos. |
| `assets/` | `logo-boragora.svg` (logo completa), `simbolo-boragora.svg` (van com coqueiro) e as fontes Barlow e Saira | Usar no app (`FND-02`). |
| `marca/` | Ícone do app em 1024 × 1024, com fundo amarelo e com fundo preto | Ícone e tela de abertura do app (`FND-02`). |

O HTML é um mockup estático: serve de referência e não deve ser copiado para o app. As telas do app são construídas com os componentes de React Native e o tema de `boragora-mobile/src/theme/`. Nomes, números e horários nas telas são dados de exemplo.

## Telas

O código no início do nome do arquivo é o mesmo usado em `plano-implementacao-frontend.md` e `checklist-frontend.md`.

### Acesso
| Arquivo | Tela | Entrega |
|---|---|---|
| `A1-Entrar` | Entrar | `ACE-01` |
| `A2-Criar-conta` | Criar conta (aluno) | `ACE-02` |
| `A3-Sem-turma` | Aluno sem turma | `ALU-01` |

### Aluno
| Arquivo | Tela | Entrega |
|---|---|---|
| `Tela-inicial-aluno` | Tela inicial do aluno (turmas de hoje) | `ALU-01` |
| `B1-Hoje-sem-plano` | Plano de hoje sem nada marcado | `ALU-02`, `ALU-03` |
| `B2-Hoje-plano-declarado` | Ida e volta marcadas | `ALU-02` a `ALU-04` |
| `B3-Hoje-apos-saida` | Depois da saída da ida | `ALU-04`, `ALU-05` |
| `B4-Cancelar-ida-tardio` | Confirmar cancelamento tardio | `ALU-05` |
| `B5-Ida-cancelada` | Ida cancelada, aviso do WhatsApp | `ALU-05` |
| `B6-Ida-bloqueada` | Ida bloqueada depois do horário | `ALU-06` |
| `B7-Dia-encerrado` | Dia encerrado | `ALU-06` |
| `B8a-Grupos-aluno` | Meus grupos | `LIS-01` |
| `B8-Grupo-aluno` | Grupo, trecho ida | `LIS-02` |
| `B8b-Grupo-aluno-volta` | Grupo, trecho volta | `LIS-02` |
| `B9-Conta` | Conta do aluno | `ACE-03` |

### Motorista e motorista-chefe
| Arquivo | Tela | Entrega |
|---|---|---|
| `C0-Motorista-turmas` | Hoje, minhas turmas | `LIS-04` |
| `C0b-Chefe-hoje-sem-turma` | Hoje do chefe que não conduz turma | `LIS-04` |
| `C1-Motorista-ida` | Lista da ida | `LIS-05` |
| `C2-Motorista-volta` | Lista da volta | `LIS-05` |
| `C5-Sem-viagem` | Sem confirmações hoje | `LIS-05` |
| `C4-Turma-alunos` | Alunos vinculados | `LIS-06` |
| `C3a-Motorista-grupos` | Meus grupos | `LIS-01` |
| `C3-Motorista-grupo` | Grupo, demais turmas | `LIS-03` |
| `C6-Motorista-conta` | Conta do motorista e do chefe | `ACE-04` |

### Motorista-chefe, aba Gestão
| Arquivo | Tela | Entrega |
|---|---|---|
| `D1-Gestao` | Gestão (quatro atalhos) | `GES-01` |
| `D8-Grupos` | Grupos | `GES-02` |
| `D2-Novo-grupo` | Novo grupo | `GES-03` |
| `D2b-Editar-grupo` | Editar e excluir grupo | `GES-04` |
| `D3-Turmas` | Turmas | `GES-13` |
| `D4-Nova-turma` | Nova turma | `GES-06` |
| `D5-Turma-gerenciar` | Gerenciar turma | `GES-07`, `GES-08`, `GES-11` |
| `D5a-Editar-turma` | Editar e excluir turma | `GES-08`, `GES-09` |
| `D6-Vincular-alunos` | Vincular alunos | `GES-10` |
| `D9-Motoristas` | Motoristas | `GES-05` |
| `D7-Novo-motorista` | Novo motorista | `GES-05` |
| `D10-Alunos` | Alunos (somente consulta) | `GES-12` |

### Notificações
| Arquivo | Tela | Entrega |
|---|---|---|
| `E1-Notificacoes` | Lembrete do aluno e cancelamento tardio do motorista | `NOT-03` |
