# ☕ Sistema Cafeteria

<div align="center">

**Sistema completo de gestão e PDV (Ponto de Venda) para cafeterias**

Desenvolvido do zero com foco em aprendizado prático e boas práticas de desenvolvimento Fullstack.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

[Sobre](#-sobre-o-projeto) •
[Tecnologias](#️-tecnologias) •
[Roadmap](#️-roadmap) •
[Como Rodar](#-como-rodar-o-projeto) •
[Autor](#-autor)

</div>

---

## 📖 Sobre o Projeto

O **Sistema Cafeteria** nasceu como um desafio pessoal: construir, do zero, um sistema real de gestão para cafeterias — desde o cadastro de produtos até o fechamento de pedidos no caixa.

Mais do que um projeto de portfólio, é um laboratório de aprendizado prático em **arquitetura Fullstack**, **modelagem de banco de dados relacional**, **autenticação**, **regras de negócio** e **integração com serviços em nuvem**.

O desenvolvimento é feito em **Learning in Public**: cada etapa é documentada aqui, com data de conclusão, para que qualquer pessoa possa acompanhar a evolução do projeto em tempo real.

> 💡 Este projeto complementa o [**ParkSim**](https://github.com/Pietro2820/ParkSim), meu sistema de gerenciamento de estacionamento em Java + MySQL — juntos, formam uma dupla de projetos explorando diferentes stacks de backend.

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Por quê |
|---|---|---|
| **Frontend** | Next.js (App Router) | SSR, performance e uma estrutura moderna de rotas |
| **Linguagem** | TypeScript | Tipagem estática para evitar bugs em produção |
| **Estilização** | HTML + CSS puro | Controle total sobre o layout e domínio sólido de CSS |
| **Backend / Banco** | Supabase (PostgreSQL) | BaaS completo com Auth, Realtime e Row Level Security |
| **Versionamento** | Git + GitHub | Histórico público e documentado do desenvolvimento |
| **Pagamentos** *(futuro)* | Stripe / Mercado Pago | Integração com gateways de pagamento reais |

---

## 🗺️ Roadmap

Progresso do projeto por fase. Itens concluídos vêm marcados com a caixa preenchida e a respectiva data.

<details open>
<summary><strong>🏗️ Fase 0 — Setup Inicial</strong></summary>

- [x] Criar repositório no GitHub e configurar ambiente local — `29/08/2026`
- [x] Instalar Next.js com TypeScript e configurar o projeto — `29/08/2026`
- [x] Criar projeto no Supabase e obter credenciais — `29/08/2026`
- [x] Configurar `.env.local` e cliente Supabase — `29/08/2026`

</details>

<details open>
<summary><strong>🗄️ Fase 1 — Banco de Dados</strong></summary>

- [x] Criar tabelas de `categorias` e `produtos` — `29/08/2026`
- [x] Inserir dados de exemplo no banco — `29/08/2026`
- [x] Configurar políticas de acesso (RLS) — `29/08/2026`
- [ ] Criar tabelas de `pedidos` e `itens_pedido`
- [ ] Criar tabelas de `clientes` e `usuarios`

</details>

<details open>
<summary><strong>🖥️ Fase 2 — Frontend Básico</strong></summary>

- [x] Exibir cardápio na página inicial (`page.tsx`) — `29/08/2026`
- [ ] Criar tela de cadastro de produtos (CRUD)
- [ ] Criar tela de edição e exclusão de produtos
- [ ] Criar tela de listagem de categorias

</details>

<details>
<summary><strong>🧾 Fase 3 — PDV (Ponto de Venda)</strong></summary>

- [ ] Criar tela do PDV com lista de produtos
- [ ] Implementar carrinho de compras (adicionar/remover itens)
- [ ] Calcular total do pedido
- [ ] Finalizar pedido e salvar no banco

</details>

<details>
<summary><strong>💳 Fase 4 — Pagamento e Finalização</strong></summary>

- [ ] Integrar gateway de pagamento (Stripe ou Mercado Pago)
- [ ] Criar Edge Function para processar pagamento
- [ ] Atualizar status do pedido após pagamento

</details>

<details>
<summary><strong>📱 Fase 5 — Extras e Melhorias</strong></summary>

- [ ] Implementar sistema de login (Supabase Auth)
- [ ] Criar painel administrativo para gerentes
- [ ] Adicionar impressão térmica de cupons
- [ ] Criar KDS (Kitchen Display System) para baristas com Realtime
- [ ] Desenvolver app mobile para clientes (React Native)

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

## 📸 Screenshots

> Em breve: capturas de tela do sistema em funcionamento.

---

## 👨‍💻 Autor

**Pietro Cardoso**
Estudante de Ciência da Computação, com foco em desenvolvimento backend.

[![GitHub](https://img.shields.io/badge/GitHub-Pietro2820-181717?style=flat&logo=github)](https://github.com/Pietro2820)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-pietro--cardoso-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pietro-cardoso)

---

<div align="center">

**Desenvolvido com ☕ e código por Pietro Cardoso**

</div>
