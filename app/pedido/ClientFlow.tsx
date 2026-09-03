"use client";

import { useMemo, useRef, useState } from "react";
import "./ClientFlow.css";

type StepId =
  | "cpf"
  | "cardapio"
  | "carrinho"
  | "nome"
  | "pagamento-metodo"
  | "pagamento-pagina"
  | "finalizacao";

type PayType = "pix" | "cartao" | "dinheiro";
type Tone = "sage" | "tan" | "blush";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  cat: string;
  tone: Tone;
}

interface Category {
  key: string;
  label: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Cappuccino cremoso", desc: "Espresso, leite vaporizado, espuma", price: 12.9, cat: "bebidas-quentes", tone: "sage" },
  { id: 2, name: "Chocolate quente", desc: "Cacau 60%, leite integral", price: 10.9, cat: "bebidas-quentes", tone: "tan" },
  { id: 3, name: "Café gelado com leite", desc: "Extração fria, leite, gelo", price: 13.5, cat: "bebidas-frias", tone: "blush" },
  { id: 4, name: "Suco natural", desc: "Fruta da estação, sem açúcar", price: 9.9, cat: "bebidas-frias", tone: "sage" },
  { id: 5, name: "Pão de queijo (6un)", desc: "Receita mineira, fresquinho", price: 14.0, cat: "salgados", tone: "tan" },
  { id: 6, name: "Folhado de frango", desc: "Massa amanteigada, recheio cremoso", price: 11.5, cat: "salgados", tone: "blush" },
  { id: 7, name: "Bolo de fubá", desc: "Receita da casa, fatia generosa", price: 9.5, cat: "doces", tone: "sage" },
  { id: 8, name: "Torta de limão", desc: "Merengue tostado na hora", price: 11.0, cat: "doces", tone: "tan" },
];

const CATEGORIES: Category[] = [
  { key: "bebidas-quentes", label: "Bebidas quentes" },
  { key: "bebidas-frias", label: "Bebidas frias" },
  { key: "salgados", label: "Salgados" },
  { key: "doces", label: "Doces" },
];

const STAGES: Record<StepId, number> = {
  cpf: 1,
  cardapio: 2,
  carrinho: 3,
  nome: 4,
  "pagamento-metodo": 5,
  "pagamento-pagina": 5,
  finalizacao: 6,
};

const LABELS: Record<StepId, string> = {
  cpf: "Identificação",
  cardapio: "Cardápio",
  carrinho: "Carrinho",
  nome: "Seus dados",
  "pagamento-metodo": "Pagamento",
  "pagamento-pagina": "Pagamento",
  finalizacao: "Pedido confirmado",
};

const TONE_COLOR: Record<Tone, string> = {
  sage: "#4B6A45",
  tan: "#A9772F",
  blush: "#B5615A",
};

const PAY_LABELS: Record<PayType, string> = {
  pix: "Pix",
  cartao: "Cartão de crédito",
  dinheiro: "Dinheiro na entrega",
};

const DELIVERY_FEE = 5;

function formatMoney(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

function formatCpf(raw: string) {
  let v = raw.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return v;
}

export default function ClientFlow() {
  const [step, setStep] = useState<StepId>("cpf");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedPay, setSelectedPay] = useState<PayType>("pix");
  const [activeChip, setActiveChip] = useState<string>("todos");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cardBumpKey, setCardBumpKey] = useState(0);
  const [cartShake, setCartShake] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [recap, setRecap] = useState({ name: "—", items: "—", pay: "—", total: "—" });

  const cartIconRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuWrapRef = useRef<HTMLDivElement>(null);

  const { qty, subtotal } = useMemo(() => {
    let q = 0;
    let s = 0;
    Object.entries(cart).forEach(([id, count]) => {
      const p = PRODUCTS.find((x) => x.id === Number(id));
      if (!p) return;
      q += count;
      s += p.price * count;
    });
    return { qty: q, subtotal: s };
  }, [cart]);

  const total = subtotal + (qty > 0 ? DELIVERY_FEE : 0);
  const cartBarVisible = qty > 0 && step === "cardapio";

  function goTo(next: StepId) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeQty(id: number, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const value = (next[id] || 0) + delta;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function flyToCart(startEl: HTMLElement, tone: Tone) {
    const target = cartIconRef.current;
    if (!target) return;
    const startRect = startEl.getBoundingClientRect();
    const dot = document.createElement("div");
    dot.className = "fly-dot";
    dot.style.background = TONE_COLOR[tone];
    dot.style.left = startRect.left + startRect.width / 2 + "px";
    dot.style.top = startRect.top + startRect.height / 2 + "px";
    dot.style.transform = "translate(-50%,-50%) scale(1)";
    dot.style.opacity = "1";
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      const tRect = target.getBoundingClientRect();
      requestAnimationFrame(() => {
        dot.style.left = tRect.left + tRect.width / 2 + "px";
        dot.style.top = tRect.top + tRect.height / 2 + "px";
        dot.style.transform = "translate(-50%,-50%) scale(0.25)";
        dot.style.opacity = "0";
      });
    });
    setTimeout(() => dot.remove(), 650);
  }

  function addToCart(evt: React.MouseEvent<HTMLButtonElement>, id: number) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    changeQty(id, 1);
    flyToCart(evt.currentTarget, product.tone);
    setCartShake(true);
    setTimeout(() => setCartShake(false), 450);
    setCardBumpKey((k) => k + 1);
  }

  function selectChip(key: string) {
    setActiveChip(key);
    if (key === "todos") {
      menuWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showPayPanel() {
    goTo("pagamento-pagina");
  }

  function finishOrder() {
    setRecap({
      name: name || "Cliente",
      items: qty + (qty === 1 ? " item" : " itens"),
      pay: PAY_LABELS[selectedPay],
      total: formatMoney(total),
    });
    setOrderNum("Pedido #" + (1000 + Math.floor(Math.random() * 9000)));
    goTo("finalizacao");
  }

  function resetFlow() {
    setCart({});
    setSelectedPay("pix");
    setCpf("");
    setName("");
    setPhone("");
    setActiveChip("todos");
    goTo("cpf");
  }

  return (
    <div className="client-flow">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="top">
        <div className="logo">
          <LogoIcon size={34} />
          <div className="logo-text">
            Grão
            <small>Café autoral</small>
          </div>
        </div>
        <div className="progress-label">
          <span>{LABELS[step]}</span>
          <span>{STAGES[step]} de 6</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(STAGES[step] / 6) * 100}%` }} />
        </div>
      </div>

      {/* STEP 1: CPF */}
      <section className={`step center-stage${step === "cpf" ? " active" : ""}`}>
        <div className="narrow">
          <div className="card">
            <div className="brand-splash">
              <LogoIcon size={46} />
              <span>
                Grão
                <small>Café autoral</small>
              </span>
            </div>
            <h1 className="step-title" style={{ textAlign: "center" }}>
              Bem-vindo(a)
            </h1>
            <p className="step-sub" style={{ textAlign: "center" }}>
              Informe seu CPF para identificar seu cadastro e agilizar o pedido.
            </p>
            <div className="field">
              <label>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                maxLength={14}
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
              />
            </div>
            <button className="pill-btn" onClick={() => goTo("cardapio")}>
              Continuar →
            </button>
          </div>
        </div>
      </section>

      {/* STEP 2: CARDÁPIO */}
      <section className={`step${step === "cardapio" ? " active" : ""}`}>
        <div className="wide">
          <h1 className="step-title">Cardápio</h1>
          <p className="step-sub">Escolha seus itens favoritos e adicione ao carrinho.</p>

          <div className="trust-row">
            <div className="trust">
              <div className="t-ic">
                <LeafIcon />
              </div>
              <div>
                <b>Grãos selecionados</b>
                <span>Direto de fazendas parceiras</span>
              </div>
            </div>
            <div className="trust">
              <div className="t-ic">
                <CupIcon />
              </div>
              <div>
                <b>Torra artesanal</b>
                <span>Sempre fresca, sempre boa</span>
              </div>
            </div>
            <div className="trust">
              <div className="t-ic">
                <HeartIcon />
              </div>
              <div>
                <b>Feito com carinho</b>
                <span>Em cada xícara servida</span>
              </div>
            </div>
          </div>

          <div className="chip-row">
            <div
              className={`chip${activeChip === "todos" ? " active" : ""}`}
              onClick={() => selectChip("todos")}
            >
              Todos
            </div>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className={`chip${activeChip === cat.key ? " active" : ""}`}
                onClick={() => selectChip(cat.key)}
              >
                {cat.label}
              </div>
            ))}
          </div>

          <div ref={menuWrapRef}>
            {CATEGORIES.map((cat) => {
              const items = PRODUCTS.filter((p) => p.cat === cat.key);
              return (
                <div
                  className="menu-section"
                  key={cat.key}
                  ref={(el) => {
                    sectionRefs.current[cat.key] = el;
                  }}
                >
                  <div className="menu-section-head">
                    <div className="ic">
                      <CategoryIcon catKey={cat.key} />
                    </div>
                    <h2>{cat.label}</h2>
                    <div className="rule" />
                  </div>
                  <div className="prod-grid">
                    {items.map((p) => (
                      <div className="prod-card" key={p.id}>
                        <div className={`prod-photo ${p.tone}`} />
                        <h3>{p.name}</h3>
                        <p className="desc">{p.desc}</p>
                        <div className="prod-foot">
                          <span className="price">{formatMoney(p.price)}</span>
                          <button className="add-btn" onClick={(e) => addToCart(e, p.id)}>
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEP 3: CARRINHO */}
      <section className={`step${step === "carrinho" ? " active" : ""}`}>
        <div className="narrow">
          <button className="back-link" onClick={() => goTo("cardapio")}>
            ← Voltar ao cardápio
          </button>
          <h1 className="step-title">Seu carrinho</h1>
          <p className="step-sub">Confira os itens antes de continuar.</p>

          {Object.keys(cart).length === 0 ? (
            <div className="empty-msg">Seu carrinho está vazio.</div>
          ) : (
            Object.entries(cart).map(([id, count]) => {
              const p = PRODUCTS.find((x) => x.id === Number(id));
              if (!p) return null;
              return (
                <div className="cart-item" key={id}>
                  <div className="thumb" />
                  <div className="info">
                    <h3>{p.name}</h3>
                    <span className="price">{formatMoney(p.price)}</span>
                  </div>
                  <div className="stepper">
                    <button onClick={() => changeQty(p.id, -1)}>−</button>
                    <span>{count}</span>
                    <button onClick={() => changeQty(p.id, 1)}>+</button>
                  </div>
                </div>
              );
            })
          )}

          <div className="card" style={{ padding: "18px 20px", marginTop: 6 }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Taxa de entrega</span>
              <span>{formatMoney(DELIVERY_FEE)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatMoney(qty > 0 ? subtotal + DELIVERY_FEE : 0)}</span>
            </div>
          </div>
          <div className="btn-row">
            <button className="pill-btn" disabled={Object.keys(cart).length === 0} onClick={() => goTo("nome")}>
              Continuar →
            </button>
          </div>
        </div>
      </section>

      {/* STEP 4: NOME */}
      <section className={`step center-stage${step === "nome" ? " active" : ""}`}>
        <div className="narrow">
          <button className="back-link" onClick={() => goTo("carrinho")}>
            ← Voltar ao carrinho
          </button>
          <div className="card">
            <div className="step-icon">
              <PersonIcon />
            </div>
            <h1 className="step-title" style={{ textAlign: "center" }}>
              Quase lá!
            </h1>
            <p className="step-sub" style={{ textAlign: "center" }}>
              Pra quem é esse pedido?
            </p>
            <div className="field">
              <label>Nome completo</label>
              <input type="text" placeholder="Digite seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Telefone (opcional)</label>
              <input type="text" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button className="pill-btn" onClick={() => goTo("pagamento-metodo")}>
              Ir para pagamento →
            </button>
          </div>
        </div>
      </section>

      {/* STEP 5a: MÉTODO DE PAGAMENTO */}
      <section className={`step center-stage${step === "pagamento-metodo" ? " active" : ""}`}>
        <div className="narrow">
          <button className="back-link" onClick={() => goTo("nome")}>
            ← Voltar
          </button>
          <div className="step-icon" style={{ marginBottom: 14 }}>
            <CardIcon />
          </div>
          <h1 className="step-title" style={{ textAlign: "center" }}>
            Forma de pagamento
          </h1>
          <p className="step-sub" style={{ textAlign: "center" }}>
            Escolha como prefere pagar.
          </p>

          {(
            [
              { type: "pix" as PayType, title: "Pix", desc: "Aprovação instantânea", icon: <GridIcon /> },
              { type: "cartao" as PayType, title: "Cartão de crédito", desc: "Visa, Mastercard e mais", icon: <CardIcon /> },
              { type: "dinheiro" as PayType, title: "Dinheiro na entrega", desc: "Pague ao receber", icon: <CoinIcon /> },
            ] as const
          ).map((opt) => (
            <div
              key={opt.type}
              className={`pay-option${selectedPay === opt.type ? " active" : ""}`}
              onClick={() => setSelectedPay(opt.type)}
            >
              <div className="ic">{opt.icon}</div>
              <div>
                <h3>{opt.title}</h3>
                <p>{opt.desc}</p>
              </div>
              <div className="radio-dot" />
            </div>
          ))}

          <button className="pill-btn" style={{ marginTop: 10 }} onClick={showPayPanel}>
            Continuar →
          </button>
        </div>
      </section>

      {/* STEP 5b: PÁGINA DE PAGAMENTO */}
      <section className={`step center-stage${step === "pagamento-pagina" ? " active" : ""}`}>
        <div className="narrow">
          <button className="back-link" onClick={() => goTo("pagamento-metodo")}>
            ← Trocar forma de pagamento
          </button>
          <div className="card">
            {selectedPay === "pix" && (
              <div className="pay-panel active">
                <h1 className="step-title" style={{ textAlign: "center" }}>
                  Pague com Pix
                </h1>
                <p className="step-sub" style={{ textAlign: "center" }}>
                  Escaneie o QR code ou copie o código abaixo.
                </p>
                <div className="qr-box" />
                <div className="pix-code">
                  <span>00020126580014BR.GOV.BCB.PIX0136grao-cafeteria...</span>
                  <button onClick={() => alert("Código copiado!")}>Copiar</button>
                </div>
              </div>
            )}

            {selectedPay === "cartao" && (
              <div className="pay-panel active">
                <h1 className="step-title">Cartão de crédito</h1>
                <p className="step-sub">Preencha os dados do seu cartão.</p>
                <div className="field">
                  <label>Número do cartão</label>
                  <input type="text" placeholder="0000 0000 0000 0000" />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Validade</label>
                    <input type="text" placeholder="MM/AA" />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>CVV</label>
                    <input type="text" placeholder="000" />
                  </div>
                </div>
                <div className="field">
                  <label>Nome impresso no cartão</label>
                  <input type="text" placeholder="Como está no cartão" />
                </div>
              </div>
            )}

            {selectedPay === "dinheiro" && (
              <div className="pay-panel active">
                <h1 className="step-title" style={{ textAlign: "center" }}>
                  Dinheiro na entrega
                </h1>
                <p className="step-sub" style={{ textAlign: "center" }}>
                  Leve o valor exato ou nos diga o troco necessário.
                </p>
                <div className="field">
                  <label>Troco para quanto?</label>
                  <input type="text" placeholder="Ex: R$ 50,00" />
                </div>
              </div>
            )}

            <div className="summary-row total" style={{ marginTop: 6 }}>
              <span>Total a pagar</span>
              <span>{formatMoney(total)}</span>
            </div>
            <button className="pill-btn" style={{ marginTop: 18 }} onClick={finishOrder}>
              Confirmar pagamento
            </button>
          </div>
        </div>
      </section>

      {/* STEP 6: FINALIZAÇÃO */}
      <section className={`step center-stage${step === "finalizacao" ? " active" : ""}`}>
        <div className="narrow">
          <div className="confirm-wrap">
            <div className="check-circle">
              <CheckIcon />
            </div>
            <h1 className="step-title">Pedido confirmado!</h1>
            <span className="order-num">{orderNum || "Pedido #0432"}</span>
            <div className="recap">
              <div className="r-row">
                <span>Cliente</span>
                <b>{recap.name}</b>
              </div>
              <div className="r-row">
                <span>Itens</span>
                <b>{recap.items}</b>
              </div>
              <div className="r-row">
                <span>Pagamento</span>
                <b>{recap.pay}</b>
              </div>
              <div className="r-row">
                <span>Total</span>
                <b>{recap.total}</b>
              </div>
              <div className="r-row">
                <span>Previsão</span>
                <b>~20 min</b>
              </div>
            </div>
            <button className="pill-btn" onClick={resetFlow}>
              Fazer novo pedido
            </button>
          </div>
        </div>
      </section>

      <div className={`cart-bar${cartBarVisible ? " show" : ""}${cartShake ? " shake" : ""}`}>
        <div className="cart-bar-left">
          <div className="cart-bar-icon" ref={cartIconRef}>
            <CartIcon />
          </div>
          <div className="cart-bar-info">
            <span>{qty + (qty === 1 ? " item" : " itens")}</span>
            <b key={cardBumpKey} className={cardBumpKey ? "bump" : ""}>
              {formatMoney(subtotal)}
            </b>
          </div>
        </div>
        <button onClick={() => goTo("carrinho")}>Ver carrinho →</button>
      </div>
    </div>
  );
}

function LogoIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <ellipse cx="27" cy="32" rx="16" ry="21" transform="rotate(-18 27 32)" stroke="#1F3A2E" strokeWidth="2.2" />
      <path d="M27 13c-5 7 5 11 0 19s-5 11 0 18" stroke="#1F3A2E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M38 9c6-3 12 2 10 8-6 1-12-2-10-8z" fill="#B9862F" />
      <path d="M43 13c1.2 2 1.2 4.2 0 6.2" stroke="#1F3A2E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M5 14C5 6 12 3 20 4c1 8-2 15-10 15-1.5 0-3-.3-4-1" />
      <path d="M5 14c3-1 6-3 8-6" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M6 10h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l-1-9z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M12 20s-7-4.35-9.5-8.5C.9 8 3.3 4 7.2 4c2 0 3.6 1.1 4.8 3 1.2-1.9 2.8-3 4.8-3 3.9 0 6.3 4 4.7 7.5C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <line x1="14" y1="14" x2="21" y2="14" />
      <line x1="14" y1="18" x2="21" y2="18" />
      <line x1="14" y1="21" x2="21" y2="21" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
      <polyline points="4 12 9 17 20 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="9" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
      <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6" />
    </svg>
  );
}

function CategoryIcon({ catKey }: { catKey: string }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 17,
    height: 17,
  };
  switch (catKey) {
    case "bebidas-quentes":
      return (
        <svg {...props}>
          <path d="M6 10h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l-1-9z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" />
          <path d="M18 12h1.5a2 2 0 0 1 0 4H18" />
        </svg>
      );
    case "bebidas-frias":
      return (
        <svg {...props}>
          <path d="M12 2v20M6 5l12 14M18 5L6 19M3 12h18" />
        </svg>
      );
    case "salgados":
      return (
        <svg {...props}>
          <path d="M4 12c0-4.5 3.5-8 8-8s8 3.5 8 8" />
          <path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3z" />
        </svg>
      );
    case "doces":
      return (
        <svg {...props}>
          <circle cx="12" cy="13" r="8" />
          <path d="M9 13a3 3 0 0 0 3 3 3 3 0 0 0 3-3" />
          <path d="M9 3.5C9.5 5 10.5 5.5 12 5.5s2.5-.5 3-2" />
        </svg>
      );
    default:
      return null;
  }
}