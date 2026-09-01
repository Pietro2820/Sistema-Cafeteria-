"use client";

import { useState, useEffect } from "react";
import "./AdminPanel.css";
import { useProdutos } from "@/hooks/useProdutos";
import { useCategorias } from "@/hooks/useCategorias";
import { usePedidos } from "@/hooks/usePedidos";

type SectionId = "geral" | "categorias" | "cardapio" | "pedidos";
type ModalMode = "criar" | "editar" | null;

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  preparo: "Preparando",
  pronto: "Pronto",
  cancelado: "Cancelado",
};

const TABS: { id: SectionId; label: string; icon: string }[] = [
  { id: "geral", label: "Geral", icon: "🏠" },
  { id: "cardapio", label: "Cardápio", icon: "📋" },
  { id: "categorias", label: "Categorias", icon: "🏷️" },
  { id: "pedidos", label: "Pedidos", icon: "🧾" },
];

export default function AdminPanel() {
  const { 
    produtos, 
    carregando: carregandoProdutos, 
    erro: erroProdutos, 
    adicionar: adicionarProduto, 
    atualizar: atualizarProduto, 
    excluir: excluirProduto 
  } = useProdutos();

  const { 
    categorias, 
    carregando: carregandoCats, 
    adicionar: adicionarCategoria 
  } = useCategorias();

  const { 
    pedidos, 
    carregando: carregandoPedidos, 
    atualizarStatus: mudarStatusPedido 
  } = usePedidos();

  const [activeSection, setActiveSection] = useState<SectionId>("geral");
  const [activeChip, setActiveChip] = useState<string>("Todos");
  
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [formNome, setFormNome] = useState("");
  const [formPreco, setFormPreco] = useState("");
  const [formEstoque, setFormEstoque] = useState(0);
  const [formDisponivel, setFormDisponivel] = useState(true);
  const [formCategoriaId, setFormCategoriaId] = useState<number | null>(null);

  useEffect(() => {
    if (modalMode === "editar" && selectedId) {
      const item = produtos.find(p => p.id === selectedId);
      if (item) {
        setFormNome(item.nome);
        setFormPreco(item.preco.toString().replace(".", ","));
        setFormEstoque(item.estoque);
        setFormDisponivel(item.disponivel);
        setFormCategoriaId(item.categoria_id);
      }
    } else if (modalMode === "criar") {
      setFormNome("");
      setFormPreco("");
      setFormEstoque(0);
      setFormDisponivel(true);
      setFormCategoriaId(categorias[0]?.id || null);
    }
  }, [modalMode, selectedId, produtos, categorias]);

  function goTo(section: SectionId) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirModalCriar() {
    setModalMode("criar");
    setSelectedId(null);
  }

  function abrirModalEditar(id: string) {
    setSelectedId(id);
    setModalMode("editar");
  }

  function fecharModal() {
    setModalMode(null);
    setSelectedId(null);
  }

  async function handleSalvarProduto() {
    if (!formNome || !formPreco) {
      alert("Nome e preço são obrigatórios!");
      return;
    }

    const precoNumerico = parseFloat(formPreco.replace(",", "."));

    const dadosProduto = {
      nome: formNome,
      preco: precoNumerico,
      estoque: formEstoque,
      disponivel: formDisponivel,
      categoria_id: formCategoriaId,
      descricao: "Descrição do produto",
      avaliacao: 5.0,
    };

    try {
      if (modalMode === "criar") {
        await adicionarProduto(dadosProduto);
      } else if (modalMode === "editar" && selectedId) {
        await atualizarProduto(selectedId, dadosProduto);
      }
      fecharModal();
    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);
      alert(`Erro ao salvar: ${err.message}`);
    }
  }

  async function handleExcluirProduto(id: string) {
    if (window.confirm("Tem certeza que deseja excluir este item permanentemente?")) {
      try {
        await excluirProduto(id);
      } catch (err: any) {
        console.error("Erro ao excluir:", err);
        alert(`Erro ao excluir: ${err.message}`);
      }
    }
  }

  async function handleNovaCategoria() {
    const nome = prompt("Nome da nova categoria:");
    if (nome && nome.trim() !== "") {
      try {
        await adicionarCategoria(nome.trim());
      } catch (err: any) {
        alert(`Erro ao criar categoria: ${err.message}`);
      }
    }
  }

  if (carregandoProdutos || carregandoCats || carregandoPedidos) {
    return (
      <div className="admin-panel" style={{ padding: 40, textAlign: 'center', color: 'var(--forest)' }}>
        <p>Carregando dados do banco...</p>
      </div>
    );
  }

  if (erroProdutos) {
    return (
      <div className="admin-panel" style={{ padding: 40, textAlign: 'center', color: 'red' }}>
        <p>Erro ao carregar dados: {erroProdutos}</p>
      </div>
    );
  }

  const produtosFiltrados = activeChip === "Todos" 
    ? produtos 
    : produtos.filter(p => {
        const cat = categorias.find(c => c.id === p.categoria_id);
        return cat?.nome === activeChip;
      });

  return (
    <div className="admin-panel">
      <header className="topbar">
        <div className="logo">Grão<sup>”</sup></div>
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
                <h3>{pedidos.filter(p => p.status === 'pendente' || p.status === 'preparo').length} pedidos ativos</h3>
                <p>{pedidos.filter(p => p.status === 'pendente').length} aguardando confirmação</p>
              </div>
            </div>
            <div className="stat">
              <div className="badge">🗂️</div>
              <div>
                <h3>{produtos.length} itens no cardápio</h3>
                <p>Distribuídos em {categorias.length} categorias</p>
              </div>
            </div>
            <div className="stat">
              <div className="badge">✦</div>
              <div>
                <h3>
                  {produtos.length > 0 
                    ? (produtos.reduce((acc, p) => acc + (p.avaliacao || 0), 0) / produtos.length).toFixed(1)
                    : '0.0'} de avaliação
                </h3>
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
            <button className="pill-btn outline" onClick={handleNovaCategoria}>+ Nova categoria</button>
          </div>
          <div className="cat-grid">
            {categorias.map((cat, idx) => (
              <div className={`cat-card ${idx % 3 === 0 ? 'sage' : idx % 3 === 1 ? 'tan' : 'blush'}`} key={cat.id}>
                <div className="cat-photo" />
                <h3>{cat.nome}</h3>
                <span className="sub">Fresquinhos do dia</span>
                <p className="desc">Produtos selecionados com carinho para você.</p>
                <div className="cat-foot">
                  <span>{produtos.filter(p => p.categoria_id === cat.id).length} itens</span>
                  <button className="arrow-btn">→</button>
                </div>
              </div>
            ))}
            <div className="cat-card new" onClick={handleNovaCategoria}>
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
              <p>{produtos.length} itens ativos em {categorias.length} categorias</p>
            </div>
            <button className="pill-btn" onClick={abrirModalCriar}>+ Novo item</button>
          </div>

          <div className="chip-row">
            {["Todos", ...categorias.map(c => c.nome)].map((chip) => (
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
            {produtosFiltrados.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-photo">
                  <span className="rating-badge">
                    <span className="star">★</span> {item.avaliacao || '5.0'}
                  </span>
                  <div className="fab" onClick={() => abrirModalEditar(item.id)}>
                    ✎
                  </div>
                </div>
                <h3>{item.nome}</h3>
                <div className="menu-meta">
                  <span>Estoque: {item.estoque}</span>
                  <span className="menu-price">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="menu-actions">
                  <button className="pill-btn outline small" onClick={() => abrirModalEditar(item.id)}>
                    Editar
                  </button>
                  <button 
                    className="pill-btn outline small" 
                    style={{ color: 'var(--blush, red)', borderColor: 'var(--blush, red)' }}
                    onClick={() => handleExcluirProduto(item.id)}
                  >
                    Remover
                  </button>
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
                <li>{pedidos.filter(p => p.status === 'pendente').length} pedidos pendentes de confirmação</li>
                <li>{pedidos.filter(p => p.status === 'preparo').length} pedidos em preparo</li>
                <li>{pedidos.filter(p => p.status === 'pronto').length} pedidos prontos para retirada</li>
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
              <span>Total</span>
              <span>Status</span>
              <span />
            </div>
            {pedidos.map((order) => (
              <div className="order-row" key={order.id}>
                <span>#{order.id.slice(0, 8)}</span>
                <span>{order.cliente_nome || "Cliente Balcão"}</span>
                <span>R$ {order.valor_total.toFixed(2).replace('.', ',')}</span>
                <select 
                  className={`status ${order.status}`}
                  value={order.status}
                  onChange={(e) => mudarStatusPedido(order.id, e.target.value)}
                  style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 12 }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="preparo">Preparando</option>
                  <option value="pronto">Pronto</option>
                  <option value="cancelado">Cancelado</option>
                </select>
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

      {/* MODAL */}
      <div className={`modal-overlay${modalMode ? " active" : ""}`} onClick={fecharModal}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-photo">
            <button className="icon-btn back" onClick={fecharModal}>
              ←
            </button>
            <button className="icon-btn fav">♡</button>
          </div>
          <div className="modal-body">
            <h2>{modalMode === "criar" ? "Novo Item" : "Editar Item"}</h2>
            
            <div className="modal-label">Nome do Produto</div>
            <input 
              type="text" 
              className="pill-btn outline" 
              style={{ width: '100%', textAlign: 'left', marginBottom: 16, cursor: 'text' }}
              value={formNome}
              onChange={(e) => setFormNome(e.target.value)}
              placeholder="Ex: Cappuccino Cremoso"
            />

            <div className="modal-label">Preço (R$)</div>
            <input 
              type="text" 
              className="pill-btn outline" 
              style={{ width: '100%', textAlign: 'left', marginBottom: 16, cursor: 'text' }}
              value={formPreco}
              onChange={(e) => setFormPreco(e.target.value)}
              placeholder="0,00"
            />

            <div className="modal-label">Estoque</div>
            <div className="stepper" style={{ marginBottom: 16 }}>
              <button onClick={() => setFormEstoque(s => Math.max(0, s - 1))}>−</button>
              <span>{formEstoque}</span>
              <button onClick={() => setFormEstoque(s => s + 1)}>+</button>
            </div>

            <div className="modal-label">Disponibilidade</div>
            <div className="avail-row" style={{ marginBottom: 16 }}>
              <div 
                className={`avail-pill${formDisponivel ? " active" : ""}`} 
                onClick={() => setFormDisponivel(true)}
              >
                Disponível
              </div>
              <div 
                className={`avail-pill${!formDisponivel ? " active" : ""}`} 
                onClick={() => setFormDisponivel(false)}
              >
                Oculto / Sem estoque
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="icon-btn" onClick={fecharModal}>✕</button>
            <button className="pill-btn" onClick={handleSalvarProduto}>Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
}