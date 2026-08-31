# ☕ Sistema Cafeteria

<div align="center">

**Sistema completo de gestão e PDV (Ponto de Venda) para cafeterias**

Desenvolvido do zero com foco em aprendizado prático, arquitetura escalável e boas práticas de desenvolvimento Fullstack.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

[Sobre](#-sobre-o-projeto) • [Arquitetura](#-arquitetura) • [Tecnologias](#️-tecnologias) • [Roadmap](#️-roadmap) • [Como Rodar](#-como-rodar-o-projeto) • [Autores](#-autores)

</div>

---

## 📖 Sobre o Projeto

O **Sistema Cafeteria** é um sistema real de gestão para cafeterias — do cadastro de produtos ao fechamento de pedidos e relatórios de faturamento — construído do zero como laboratório prático de **arquitetura de software**, **modelagem de banco de dados relacional**, **lógica de negócio** e **integração com serviços em nuvem**.

O desenvolvimento é feito em **Learning in Public**: cada etapa fica documentada aqui para que qualquer pessoa possa acompanhar a evolução em tempo real.

> 💡 Este projeto complementa o [**ParkSim**](https://github.com/Pietro2820/ParkSim), meu sistema de gerenciamento de estacionamento em Java + MySQL — juntos, exploram diferentes stacks de backend.

---

## 🏗️ Arquitetura

Para garantir escalabilidade e permitir trabalho em equipe (Backend e Frontend separados), o projeto adota uma arquitetura em camadas:

- **`services/`** — Camada de dados. Toda a comunicação com o Supabase (CRUD, queries de agregação, regras de negócio).
- **`hooks/`** — Camada reativa. Ponte entre backend e frontend: gerencia estados de carregamento e erro, e chama as funções dos services.
- **`app/` e `components/`** — Camada de apresentação (UI), consumindo apenas os dados já tratados pelos hooks.

```
Supabase (PostgreSQL)
        ↓
    services/        → lógica de acesso a dados
        ↓
     hooks/           → estado, loading, erros
        ↓
  app/ + components/  → UI
```

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Por quê |
|---|---|---|
| **Frontend** | Next.js (App Router) | SSR, performance e estrutura moderna de rotas |
| **Linguagem** | TypeScript | Tipagem estática para segurança e autocompletar |
| **Estilização** | CSS Modules | Controle total sobre o layout sem dependências pesadas |
| **Backend / DB** | Supabase (PostgreSQL) | BaaS completo com Auth, Realtime e Row Level Security |
| **Versionamento** | Git + GitHub | Histórico público e documentado do desenvolvimento |

---

## 🗺️ Roadmap

Progresso do projeto por fase. Itens concluídos vêm marcados com a data.

<details open>
<summary><strong>🏗️ Fase 0 — Setup Inicial</strong></summary>

- [x] Criar repositório e configurar ambiente local — `29/08/2026`
- [x] Instalar Next.js com TypeScript — `29/08/2026`
- [x] Configurar projeto e cliente Supabase — `29/08/2026`

</details>

<details open>
<summary><strong>🗄️ Fase 1 — Modelagem de Banco de Dados</strong></summary>

- [x] Criar tabelas de `categorias` e `produtos` (com UUID e booleano de disponibilidade) — `30/08/2026`
- [x] Criar tabelas de `pedidos` e `itens_pedido` com Foreign Keys — `30/08/2026`
- [x] Configurar ações de Cascade (exclusão de itens) e Restrict (proteção de histórico) — `30/08/2026`

</details>

<details open>
<summary><strong>⚙️ Fase 2 — Arquitetura de Backend (Services & Hooks)</strong></summary>

- [x] Criar camada de Services para abstrair chamadas ao Supabase — `30/08/2026`
- [x] Criar Custom Hooks reativos (`useProdutos`, `usePedidos`, etc.) — `30/08/2026`
- [x] Implementar módulo de Analytics (Faturamento diário, Ticket Médio, Top Produtos) — `30/08/2026`
- [x] Aplicar regras de negócio (ignorar pedidos cancelados nos relatórios) — `30/08/2026`

</details>

<details>
<summary><strong>🖥️ Fase 3 — Frontend e PDV (Em andamento)</strong></summary>

- [ ] Criar tela de administração completa (CRUD visual)
- [ ] Criar tela do PDV com carrinho de compras
- [ ] Implementar cálculo de total e finalização de pedido

</details>

<details>
<summary><strong>🚀 Fase 4 — Produção e Extras</strong></summary>

- [ ] Implementar sistema de login (Supabase Auth)
- [ ] Configurar Row Level Security (RLS) para produção
- [ ] Adicionar Realtime para atualização instantânea da cozinha (KDS)
- [ ] Integração com gateway de pagamento

</details>

---

## 🚀 Como Rodar o Projeto

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

Acesse [http://localhost:3000](http://localhost:3000) no navegador. 🎉

---

## 👨‍💻👩‍💻 Autores

**Pietro Cardoso** — Arquitetura de backend, modelagem de dados e lógica de negócio.
[![GitHub](https://img.shields.io/badge/GitHub-Pietro2820-181717?style=flat&logo=github)](https://github.com/Pietro2820)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-pietro--cardoso-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pietro-cardoso)

**Kelly Cardoso** — Desenvolvimento frontend, experiência do usuário (UX) e estilização.
[![GitHub](https://img.shields.io/badge/GitHub-KellyCardosoB-181717?style=flat&logo=github)](https://github.com/KellyCardosoB)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kellycardosob-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kellycardosob/)

---

<div align="center">

**Desenvolvido com ☕ e código por Pietro Cardoso e Kelly Cardoso**

</div>