<div align="center">

<img src="./assets/banner.svg" alt="Sistema Cafeteria" width="100%"/>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-3B2314?style=for-the-badge&logo=next.js&logoColor=F7E7CE)
![TypeScript](https://img.shields.io/badge/TypeScript-5C3A21?style=for-the-badge&logo=typescript&logoColor=F7E7CE)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=1C1C1C)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8A5A34?style=for-the-badge&logo=postgresql&logoColor=F7E7CE)
![Zod](https://img.shields.io/badge/Zod-6B4226?style=for-the-badge&logo=zod&logoColor=F7E7CE)

<sub>☕ Sistema completo de gestão e PDV para cafeterias — do grão ao pedido finalizado ☕</sub>

<br/>

[Sobre](#-sobre-o-projeto) • [Arquitetura](#️-arquitetura-a-receita-por-trás-do-café) • [Banco de Dados](#️-do-grão-à-xícara-modelagem-do-banco) • [Cardápio Técnico](#️-cardápio-técnico) • [Etapas de Preparo](#️-etapas-de-preparo-roadmap) • [Segurança](#-segurança-em-camadas-o-cuidado-com-cada-grão) • [Como Rodar](#-como-servir-este-café-instalação) • [Baristas](#-baristas-autores)

</div>

<br/>

> ☕ **Nota do barista:** este projeto é preparado com carinho e documentado em tempo real — cada commit é um grão a mais na mistura.

---

## 📖 Sobre o Projeto

O **Sistema Cafeteria** é um sistema de gestão ponta a ponta para cafeterias — do cadastro de produtos ao fechamento de pedidos e relatórios de faturamento. Nasceu como laboratório prático de **arquitetura de software**, **modelagem de banco de dados relacional**, **lógica de negócio** e **integração com serviços em nuvem**, mas foi desenhado com padrões e organização de código pensados para produção real.

O cardápio é servido para **3 públicos distintos**, cada um com sua própria experiência:

- 🛒 **Cliente** — cardápio público, autoatendimento via totem (identificação por CPF), carrinho de compras e acompanhamento do pedido
- 👨‍🍳 **Operário** — cozinha (KDS) e balcão, com atualizações em tempo real, sem precisar dar F5
- 🛠️ **Admin** — gestão completa de cardápio, categorias, pedidos e relatórios

O desenvolvimento segue a filosofia de **Learning in Public** ☀️ — cada etapa é documentada aqui para que qualquer pessoa acompanhe a evolução em tempo real, do mesmo jeito que se acompanha um espresso sendo tirado.

> 💡 Este é o segundo projeto fullstack de Pietro, após o [**ParkSim**](https://github.com/Pietro2820/ParkSim) (Java + MySQL) — agora explorando uma stack moderna com Next.js e Supabase.

---

## ☕️ Arquitetura (a receita por trás do café)

Assim como um bom café depende de etapas bem definidas — moer, extrair, servir — o sistema segue uma arquitetura em camadas, para que backend e frontend evoluam em paralelo sem pisar um no pé do outro:

<div align="center">

| Camada | Papel na "receita" | Responsabilidade técnica |
|:---:|:---|:---|
| 🫘 `services/` | **Moagem** — prepara a matéria-prima | Única camada que fala com o Supabase/Storage: CRUD, queries, regras de negócio |
| ⚙️ `hooks/` | **Extração** — transforma em algo consumível | Estado reativo: loading, erros e ponte entre backend e frontend |
| ☕ `app/` + `components/` | **Serviço** — o que chega até a mesa | Interface (UI), consumindo **apenas** os hooks — nunca o Supabase diretamente |

</div>

```
Supabase (PostgreSQL)
        ↓
    services/        → 🫘 moagem dos dados
        ↓
     hooks/           → ⚙️ extração (estado, loading, erros)
        ↓
  app/ + components/  → ☕ o café servido (UI)
```

Dentro de `services/`, dois clients diferentes do Supabase são usados conforme o contexto:

- `lib/supabase/client.ts` — client de **browser**, usado por `services/`, hooks e componentes `'use client'`
- `lib/supabase/server.ts` — client de **server**, usado por `middleware.ts` e Server Components

Essa separação mantém a lógica de negócio isolada da interface — facilita testes, manutenção e a divisão de tarefas entre os desenvolvedores. Alguns princípios seguidos à risca:

- **Separação de responsabilidades** — a UI nunca chama o Supabase diretamente (regra de ouro)
- **Reatividade** — os hooks concentram o estado de loading, erro e dados
- **Regras de negócio no backend** — ex.: pedidos cancelados são ignorados nos relatórios
- **Tipagem estrita** — TypeScript em todas as camadas, do banco à tela

---

## 🗄️ Do Grão à Xícara: Modelagem do Banco

Cada mesa do café — cliente, produto, pedido — tem seu lugar no banco. As tabelas foram desenhadas para suportar o fluxo real de uma cafeteria com totem de autoatendimento, sem exigir login do cliente:

<div align="center">

| Tabela | Descrição |
|:---|:---|
| `categorias` | Categorias do cardápio (`id`, `nome`) |
| `produtos` | Itens do cardápio — `preco`, `estoque`, `avaliacao`, `imagem_url`, `disponivel` |
| `clientes` | Identidade do cliente por **CPF** (nome, `auth_user_id` opcional para integração futura com app de delivery) |
| `pedidos` | `numero_pedido` (gerado por trigger, reinicia diariamente), `cliente_id`, `cliente_nome`, `status`, `valor_total` |
| `itens_pedido` | Itens de cada pedido (FK cascade com `pedidos`) |
| `contadores_pedido` | Tabela auxiliar da trigger de numeração diária |

</div>

**Decisões de design que valem a pena registrar:**

- ☕ **`pedidos.cliente_id` aponta para `clientes`, não para `auth.users`.** Isso permite identificar o cliente pelo CPF no totem, **sem exigir login**. Quando (no futuro) um app de delivery for lançado, o mesmo CPF vincula o histórico existente a uma conta de login (`clientes.auth_user_id`), sem necessidade de migração de dados.
- 🔢 **Numeração de pedido via trigger (`numero_pedido`)**, não calculada no código da aplicação. Usa `INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING` para ser atômica — evita números duplicados quando dois pedidos são confirmados no mesmo instante (race condition). Reinicia todo dia.
- 👻 **Cliente só é gravado em `clientes` na confirmação final do pedido**, nunca ao simplesmente digitar o CPF — evita registros "fantasma" de gente que desistiu no meio do fluxo.
- 📺 **View `pedidos_publico`** — exposta para leitura anônima (painel de acompanhamento tipo "Senha #47 — Pronto", sem exigir login do cliente). Mostra apenas `numero_pedido`, `status` e `criado_em`, filtrada para pedidos do dia atual (performance). Nome, valor e observação do pedido **nunca** são expostos publicamente — ficam só na tabela real `pedidos`, protegida por RLS.

---

## 🛠️ Cardápio Técnico

<div align="center">

| Item do cardápio | Tecnologia | Por que está na receita |
|:---|:---|:---|
| ☕ **Base** | Next.js (App Router) | SSR, performance e estrutura moderna de rotas |
| 🥛 **Encorpamento** | TypeScript | Tipagem estática para segurança e produtividade |
| 🎨 **Latte art** | CSS Modules | Controle total sobre o layout, sem dependências pesadas |
| 🫘 **Grão selecionado** | Supabase (PostgreSQL) | BaaS completo com Auth, Realtime e Row Level Security |
| 🧪 **Filtro de qualidade** | Zod *(planejado)* | Validação de schema, barrando dados inválidos antes de chegar ao banco |
| 📋 **Ficha técnica** | Git + GitHub | Histórico público e documentado do desenvolvimento |

</div>

---

## 🗺️ Etapas de Preparo (Roadmap)

Do grão cru até o café servido — progresso do projeto por fase, com data de entrega nos itens concluídos.

<details>
<summary><strong>🌱 Fase 0 — Colheita & Setup</strong> <kbd>concluída</kbd></summary>

- [x] Criar repositório e configurar ambiente local — `29/08/2026`
- [x] Instalar Next.js com TypeScript — `29/08/2026`
- [x] Configurar projeto e cliente Supabase — `29/08/2026`

</details>

<details>
<summary><strong>🫘 Fase 1 — Blend & Modelagem de Banco de Dados</strong> <kbd>concluída</kbd></summary>

- [x] Criar tabelas de `categorias` e `produtos` (UUID e flag de disponibilidade) — `30/08/2026`
- [x] Criar tabelas de `pedidos` e `itens_pedido` com Foreign Keys — `30/08/2026`
- [x] Configurar ações de Cascade (exclusão de itens) e Restrict (proteção de histórico) — `30/08/2026`
- [x] Adicionar colunas de timestamp (`criado_em`, `atualizado_em`) com triggers automáticos — `31/08/2026`
- [x] Numeração de pedido diária via trigger atômica (`numero_pedido`) — `31/08/2026`
- [x] View pública `pedidos_publico` para acompanhamento sem login — `01/09/2026`

</details>

<details>
<summary><strong>⚙️ Fase 2 — Extração (Arquitetura de Backend)</strong> <kbd>concluída</kbd></summary>

- [x] Criar camada de services para abstrair chamadas ao Supabase — `31/08/2026`
- [x] Criar custom hooks reativos (`useProdutos`, `useCategorias`, `usePedidos`, `useAnalytics`) — `31/08/2026`
- [x] Implementar módulo de Analytics (faturamento diário, ticket médio, top produtos) — `31/08/2026`
- [x] Aplicar regras de negócio (ex.: ignorar pedidos cancelados nos relatórios) — `31/08/2026`
- [x] Campo de disponibilidade (`disponivel`) para controlar estoque sem apagar histórico — `31/08/2026`

</details>

<details open>
<summary><strong>🔐 Fase 3 — Torrando o Grão (Autenticação & Segurança)</strong> <kbd>concluída</kbd></summary>

- [x] Sistema de login (Supabase Auth) com papéis (`admin` / `operario`) atribuídos manualmente — `01/09/2026`
- [x] Middleware protegendo `/admin` e `/cozinha`, validando sessão via `getUser()` e checando papel — `01/09/2026`
- [x] Row Level Security (RLS) habilitado e testado em todas as tabelas — `01/09/2026`
- [x] Storage do bucket `produtos` público para leitura, escrita restrita a `admin` — `01/09/2026`

</details>

<details open>
<summary><strong>☕ Fase 4 — Servindo o Café (Frontend & PDV)</strong> <kbd>em andamento</kbd></summary>

- [x] Layout do painel administrativo (dashboard, cardápio, categorias, fila de pedidos) — `31/08/2026`
- [x] Modal de edição de produtos e filtros por categoria — `31/08/2026`
- [x] Status de pedidos com cores dinâmicas — `31/08/2026`
- [x] CRUD de produtos e categorias com dados reais via painel admin — `01/09/2026`
- [x] Upload de foto nos produtos (Supabase Storage) — `01/09/2026`
- [x] Modal de criação de categoria (substituindo `window.prompt`) — `01/09/2026`
- [ ] Fluxo de tela do cliente: identificação por CPF → carrinho → confirmação de nome → pedido
- [ ] Painel público de acompanhamento do pedido (`pedidos_publico`)
- [ ] Tela da cozinha (KDS) com atualizações em tempo real (Supabase Realtime, sem F5)

</details>

<details>
<summary><strong>🚀 Fase 5 — Café Pronto para o Cliente (Produção)</strong> <kbd>planejada</kbd></summary>

- [ ] Validação com Zod em todas as operações de escrita
- [ ] Edge Function para finalizar pedido com baixa de estoque atômica
- [ ] Integração com gateway de pagamento
- [ ] Testes automatizados (Vitest) e CI/CD (GitHub Actions)
- [ ] Observabilidade (Sentry) e performance (paginação, `next/image`, ISR)

</details>

---

## 🔐 Segurança em Camadas (o cuidado com cada grão)

Segurança não é um tempero opcional, é a base da receita. O projeto segue o princípio de **defense in depth** (defesa em profundidade), em três níveis:

**Nível 1 — Obrigatório (produção mínima)** <kbd>implementado ✅</kbd>
- Row Level Security (RLS) com políticas granulares em cada tabela:

  <div align="center">

  | Tabela | Leitura | Escrita |
  |:---|:---|:---|
  | `categorias`, `produtos` | Pública | Só `admin` |
  | `pedidos` (tabela real) | Só `admin`/`operario` | INSERT público (autoatendimento); UPDATE/DELETE só `admin`/`operario` — cliente nunca altera o próprio pedido após enviar |
  | `itens_pedido` | Só `admin`/`operario` | Igual a `pedidos` |
  | `clientes` | Próprio (via `auth_user_id`) ou `admin` | INSERT público; UPDATE só próprio/`admin` |
  | `pedidos_publico` (view) | Pública | — |

  </div>

- Autenticação via Supabase Auth (email + senha, confirmação de email obrigatória), com papéis definidos em `user_metadata.role` — ninguém se autopromove
- Middleware do Next.js protegendo `/admin` e `/cozinha`, validando sessão via `getUser()` (nunca `getSession()`, que não valida o JWT)
- Chaves seguras: `anon_key` é pública por design; `service_role_key` **nunca** entra no frontend — ela ignora o RLS, e fica restrita a Edge Functions/ambiente server quando implementado

**Nível 2 — Profissional (confiabilidade)** <kbd>em andamento</kbd>
- Validação com Zod em todos os services, barrando dados inválidos antes do banco *(planejado)*
- Middleware já protege as rotas sensíveis (ver Nível 1)
- Sanitização — nunca renderizar HTML cru vindo do usuário

**Nível 3 — Enterprise (produção robusta)** <kbd>planejada</kbd>
- Edge Functions para lógica sensível (cálculo de totais, baixa de estoque) rodando com `service_role`
- Headers de segurança (CSP, X-Frame-Options, HSTS) no `next.config.ts`
- Auditoria via trigger, registrando quem alterou o quê em uma tabela `audit_logs`
- Rate limiting contra spam de pedidos por IP/usuário

---

## 🚀 Como Servir Este Café (Instalação)

**Pré-requisitos:** Node.js 18+ e uma conta [Supabase](https://supabase.com/).

```bash
# 1. Clone o repositório
git clone https://github.com/Pietro2820/Sistema-Cafeteria-.git
cd Sistema-Cafeteria-

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
# NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e sirva-se. 🎉

---

## 🤝 Contribuindo

Este é um projeto de aprendizado aberto — a mesa está posta. Sugestões, issues e pull requests são bem-vindos: sinta-se à vontade para abrir uma *issue* com ideias, dúvidas ou correções.

---

## 👨‍🍳👩‍🍳 Baristas (Autores)

<div align="center">

<table>
<tr>
<td align="center" width="50%">
<strong>Pietro Cardoso</strong><br/>
<sub>Arquitetura de backend, modelagem de dados, lógica de negócio e segurança</sub><br/><br/>
<a href="https://github.com/Pietro2820"><img src="https://img.shields.io/badge/GitHub-Pietro2820-3B2314?style=flat&logo=github&logoColor=F7E7CE"/></a>
<a href="https://www.linkedin.com/in/pietro-cardoso"><img src="https://img.shields.io/badge/LinkedIn-pietro--cardoso-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
</td>
<td align="center" width="50%">
<strong>Kelly Cardoso</strong><br/>
<sub>Desenvolvimento frontend, UX e estilização</sub><br/><br/>
<a href="https://github.com/KellyCardosoB"><img src="https://img.shields.io/badge/GitHub-KellyCardosoB-3B2314?style=flat&logo=github&logoColor=F7E7CE"/></a>
<a href="https://www.linkedin.com/in/kellycardosob/"><img src="https://img.shields.io/badge/LinkedIn-kellycardosob-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
</td>
</tr>
</table>

</div>

---

<div align="center">

**Desenvolvido com ☕ e código por Pietro Cardoso e Kelly Cardoso**

<sub>🫘 Sem café, sem commits 🫘</sub>

<sub>Atualizado em: Setembro/2026</sub>

</div>