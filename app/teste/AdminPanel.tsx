"use client";

import { useState } from "react";
import "./AdminPanel.css";

type SectionId = "geral" | "categorias" | "cardapio" | "pedidos";

interface MenuItem {
  id: string;
  name: string;
  rating: number;
  meta: string;
  price: string;
}

interface CategoryCard {
  id: string;
  colorClass: "sage" | "tan" | "blush";
  title: string;
  subtitle: string;
  desc: string;
  count: number;
}

interface OrderRow {
  id: string;
  customer: string;
  items: string;
  status: "pendente" | "preparo" | "pronto";
}

const CHIPS = ["Todos", "Bebidas quentes", "Bebidas frias", "Salgados", "Doces"];

const CATEGORIES: CategoryCard[] = [
  { id: "quentes", colorClass: "sage", title: "Bebidas quentes", subtitle: "Cafés & Chás", desc: "Cappuccinos, lattes e chocolates — os mais pedidos da casa.", count: 5 },
  { id: "salgados", colorClass: "tan", title: "Salgados", subtitle: "Fresquinhos do dia", desc: "Pães, folhados e tortas salgadas, preparados pela manhã.", count: 6 },
  { id: "doces", colorClass: "blush", title: "Doces", subtitle: "Feitos com carinho", desc: "Bolos e sobremesas de produção própria, sempre frescos.", count: 3 },
  { id: "frias", colorClass: "sage", title: "Bebidas frias", subtitle: "Para dias quentes", desc: "Cafés gelados, sucos naturais e chás gelados.", count: 4 },
];

const MENU_ITEMS: MenuItem[] = [
  { id: "item-1", name: "Cappuccino cremoso", rating: 4.8, meta: "Bebidas quentes · 160ml", price: "R$ 12,90" },
  { id: "item-2", name: "Bolo de fubá", rating: 4.6, meta: "Doces · fatia", price: "R$ 9,50" },
  { id: "item-3", name: "Pão de queijo (6un)", rating: 4.9, meta: "Salgados · 6 un", price: "R$ 14,00" },
  { id: "item-4", name: "Café gelado com leite", rating: 4.7, meta: "Bebidas frias · 300ml", price: "R$ 13,50" },
  { id: "item-5", name: "Torta de limão", rating: 4.5, meta: "Doces · fatia", price: "R$ 11,00" },
];

const ORDERS: OrderRow[] = [
  { id: "#0231", customer: "Mariana Souza", items: "2 itens", status: "pendente" },
  { id: "#0230", customer: "Lucas Ferreira", items: "1 item", status: "preparo" },
  { id: "#0229", customer: "Kelly Cardoso", items: "3 itens", status: "pronto" },
  { id: "#0228", customer: "Pietro Cardoso", items: "2 itens", status: "preparo" },
];

const STATUS_LABEL: Record<OrderRow["status"], string> = {
  pendente: "Pendente",
  preparo: "Preparando",
  pronto: "Pronto",
};

const TABS: { id: SectionId; label: string; icon: string }[] = [
  { id: "geral", label: "Geral", icon: "🏠" },
  { id: "cardapio", label: "Cardápio", icon: "📋" },
  { id: "categorias", label: "Categorias", icon: "🏷️" },
  { id: "pedidos", label: "Pedidos", icon: "🧾" },
];

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<SectionId>("geral");
  const [activeChip, setActiveChip] = useState<string>("Todos");
  const [activeAvail, setActiveAvail] = useState<string>("Disponível");
  const [stock, setStock] = useState<number>(18);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  function goTo(section: SectionId) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openModal(item: MenuItem) {
    setSelectedItem(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className="admin-panel">
      <header className="topbar">
        <div className="logo">
          Grão<sup>”</sup>
        </div>
        <nav className="tabs">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`tab${activeSection === tab.id ? " active" : ""}`}
              onClick={() => goTo(tab.id)}
            >
              {tab.id === "geral" ? "Visão geral" : tab.label}
            </div>
          ))}
        </nav>
        <div className="top-actions">
          <div className="icon-btn">🔍</div>
          <div className="avatar" />
        </div>
      </header>

      <div className="mobile-search">🔍 Buscar item, pedido ou categoria…</div>

      <div className="wrap">
        {/* VISÃO GERAL */}
        <section className={`section${activeSection === "geral" ? " active" : ""}`}>
          <div className="hero">
            <div>
              <span className="eyebrow">Bom dia, Pietro</span>
              <h1>
                Seu painel,
                <br />
                sempre <span className="accent">em ordem.</span>
              </h1>
              <p>
                Acompanhe pedidos, ajuste o cardápio e organize categorias — tudo em
                um só lugar, sem complicação.
              </p>
              <button className="pill-btn" onClick={() => goTo("pedidos")}>
                Ver pedidos de hoje →
              </button>
            </div>
            <div className="hero-art">
              <div className="cup" />
            </div>
          </div>

          <div className="stat-row">
            <div className="stat">
              <div className="badge">☕</div>
              <div>
                <h3>12 pedidos hoje</h3>
                <p>3 aguardando confirmação</p>
              </div>
            </div>
            <div className="stat">
              <div className="badge">🗂️</div>
              <div>
                <h3>42 itens no cardápio</h3>
                <p>Distribuídos em 6 categorias</p>
              </div>
            </div>
            <div className="stat">
              <div className="badge">✦</div>
              <div>
                <h3>4.9 de avaliação</h3>
                <p>Baseado nos últimos 30 dias</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS */}
        <section className={`section${activeSection === "categorias" ? " active" : ""}`}>
          <div className="section-head">
            <div>
              <h2>Categorias</h2>
              <p>Organize como os itens aparecem no cardápio do cliente</p>
            </div>
            <button className="pill-btn outline">+ Nova categoria</button>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <div className={`cat-card ${cat.colorClass}`} key={cat.id}>
                <div className="cat-photo" />
                <h3>{cat.title}</h3>
                <span className="sub">{cat.subtitle}</span>
                <p className="desc">{cat.desc}</p>
                <div className="cat-foot">
                  <span>{cat.count} itens</span>
                  <button className="arrow-btn">→</button>
                </div>
              </div>
            ))}
            <div className="cat-card new">
              <span style={{ fontSize: 26 }}>+</span>
              <span>Criar nova categoria</span>
            </div>
          </div>
        </section>

        {/* CARDÁPIO */}
        <section className={`section${activeSection === "cardapio" ? " active" : ""}`}>
          <div className="section-head">
            <div>
              <h2>Cardápio</h2>
              <p>18 itens ativos em 4 categorias</p>
            </div>
            <button className="pill-btn">+ Novo item</button>
          </div>

          <div className="chip-row">
            {CHIPS.map((chip) => (
              <div
                key={chip}
                className={`chip${activeChip === chip ? " active" : ""}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip === "Todos" ? "☕ Todos" : chip}
              </div>
            ))}
          </div>

          <div className="menu-grid">
            {MENU_ITEMS.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-photo">
                  <span className="rating-badge">
                    <span className="star">★</span> {item.rating}
                  </span>
                  <div className="fab" onClick={() => openModal(item)}>
                    ✎
                  </div>
                </div>
                <h3>{item.name}</h3>
                <div className="menu-meta">
                  <span>{item.meta}</span>
                  <span className="menu-price">{item.price}</span>
                </div>
                <div className="menu-actions">
                  <button className="pill-btn outline small" onClick={() => openModal(item)}>
                    Editar
                  </button>
                  <button className="pill-btn outline small">Remover</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PEDIDOS */}
        <section className={`section${activeSection === "pedidos" ? " active" : ""}`}>
          <div className="promo">
            <div className="hero-art">
              <div className="cup" />
            </div>
            <div>
              <span className="eyebrow">Fila de pedidos</span>
              <h2>Pedidos em andamento</h2>
              <p style={{ color: "rgba(246,239,224,0.8)", fontSize: 14, maxWidth: 380 }}>
                Acompanhe o status de cada pedido em tempo real e mantenha a
                cozinha alinhada com o salão.
              </p>
              <ul className="checklist">
                <li>3 pedidos pendentes de confirmação</li>
                <li>2 pedidos em preparo</li>
                <li>1 pedido pronto para retirada</li>
              </ul>
              <button className="pill-btn" style={{ background: "#F6EFE0", color: "var(--forest)" }}>
                Ver todos os pedidos →
              </button>
            </div>
          </div>

          <div className="order-list">
            <div className="order-row head">
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Itens</span>
              <span>Status</span>
              <span />
            </div>
            {ORDERS.map((order) => (
              <div className="order-row" key={order.id}>
                <span>{order.id}</span>
                <span>{order.customer}</span>
                <span>{order.items}</span>
                <span className={`status ${order.status}`}>{STATUS_LABEL[order.status]}</span>
                <button className="pill-btn outline small">Ver</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="footer-bar">
        <div className="footer-item">
          <span className="ic">🔄</span>
          <div>
            <b>Sempre sincronizado</b>
            <span>Alterações salvas em tempo real</span>
          </div>
        </div>
        <div className="footer-item">
          <span className="ic">🔒</span>
          <div>
            <b>Conexão segura</b>
            <span>Backup automático diário</span>
          </div>
        </div>
        <div className="footer-item">
          <span className="ic">🏅</span>
          <div>
            <b>Dados confiáveis</b>
            <span>Histórico completo de pedidos</span>
          </div>
        </div>
        <div className="footer-item">
          <span className="ic">🎧</span>
          <div>
            <b>Suporte 24/7</b>
            <span>Fale com o time quando precisar</span>
          </div>
        </div>
      </div>
      <div className="mini-footer">
        <span>© 2026 Painel Cafeteria</span>
        <span>Ajuda · Configurações · Sair</span>
        <span>v1.0</span>
      </div>

      {/* bottom nav mobile */}
      <nav className="bottom-nav">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`nav-btn${activeSection === tab.id ? " active" : ""}`}
            onClick={() => goTo(tab.id)}
          >
            <span className="ic">{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </nav>

      {/* modal editar item */}
      <div className={`modal-overlay${modalOpen ? " active" : ""}`}>
        <div className="modal-card">
          <div className="modal-photo">
            <button className="icon-btn back" onClick={closeModal}>
              ←
            </button>
            <button className="icon-btn fav">♡</button>
          </div>
          <div className="modal-body">
            <div className="modal-top">
              <div>
                <span className="rating-badge" style={{ position: "static", marginBottom: 8 }}>
                  <span className="star">★</span> {selectedItem?.rating ?? "-"}
                </span>
                <h2>{selectedItem?.name ?? ""}</h2>
              </div>
              <span className="modal-price">{selectedItem?.price ?? ""}</span>
            </div>

            <div className="modal-label">Disponibilidade</div>
            <div className="avail-row">
              {["Disponível", "Em falta", "Oculto"].map((label) => (
                <div
                  key={label}
                  className={`avail-pill${activeAvail === label ? " active" : ""}`}
                  onClick={() => setActiveAvail(label)}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="modal-label">Sobre</div>
            <p className="modal-desc">
              Espresso encorpado com leite vaporizado e uma camada cremosa de
              espuma, finalizado com um toque de canela. <a href="#">Ler mais</a>
            </p>

            <div className="modal-label">Estoque</div>
            <div className="stepper">
              <button onClick={() => setStock((s) => Math.max(0, s - 1))}>−</button>
              <span>{stock}</span>
              <button onClick={() => setStock((s) => s + 1)}>+</button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="icon-btn">🗑</button>
            <button className="pill-btn">Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
}