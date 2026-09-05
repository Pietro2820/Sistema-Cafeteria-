"use client";

import { useState } from "react";
import "./LoginPainel.css";

interface LoginPanelProps {
  /** Chamado ao enviar o formulário, já com email e senha prontos pra sua função de auth. */
  onSubmit: (email: string, password: string) => void | Promise<void>;
  /** Controla o estado de carregamento (passe true enquanto sua chamada de auth estiver em andamento). */
  loading?: boolean;
  /** Mensagem de erro vinda da sua lógica de auth (ex: "E-mail ou senha incorretos."). */
  error?: string | null;
  /** Chamado ao clicar em "Esqueceu a senha?". Opcional. */
  onForgotPassword?: () => void;
  /** Chamado ao clicar em "Fale com o administrador". Opcional. */
  onContactAdmin?: () => void;
}

export default function LoginPanel({
  onSubmit,
  loading = false,
  error,
  onForgotPassword,
  onContactAdmin,
}: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const shownError = error ?? localError;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLocalError("Preencha e-mail e senha para continuar.");
      return;
    }
    setLocalError(null);
    onSubmit(email.trim(), password.trim());
  }

  return (
    <div className="login-panel">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">
        <div className="brand-splash">
          <LogoIcon />
          <span>
            Grão
            <small>Painel administrativo</small>
          </span>
        </div>

        <h1 className="title">Bem-vindo(a) de volta</h1>
        <p className="subtitle">Entre com suas credenciais para acessar o painel.</p>

        {shownError && (
          <div className="error-msg">
            <ErrorIcon />
            <span>{shownError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>E-mail</label>
            <div className="input-wrap">
              <MailIcon />
              <input
                type="email"
                placeholder="seuemail@grao.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label>Senha</label>
            <div className="input-wrap">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="row-between">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Manter conectado
            </label>
            {onForgotPassword && (
              <button type="button" className="link" onClick={onForgotPassword}>
                Esqueceu a senha?
              </button>
            )}
          </div>

          <button className="pill-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Entrando…
              </>
            ) : (
              "Entrar →"
            )}
          </button>
        </form>

        <div className="divider">acesso restrito à equipe</div>

        <p className="footer-note">
          Precisa de acesso?{" "}
          {onContactAdmin ? (
            <button type="button" className="link" onClick={onContactAdmin}>
              Fale com o administrador
            </button>
          ) : (
            "Fale com o administrador"
          )}
        </p>
      </div>
    </div>
  );
}

function LogoIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 60 60" fill="none">
      <ellipse cx="27" cy="32" rx="16" ry="21" transform="rotate(-18 27 32)" stroke="#1F3A2E" strokeWidth="2.2" />
      <path d="M27 13c-5 7 5 11 0 19s-5 11 0 18" stroke="#1F3A2E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M38 9c6-3 12 2 10 8-6 1-12-2-10-8z" fill="#B9862F" />
      <path d="M43 13c1.2 2 1.2 4.2 0 6.2" stroke="#1F3A2E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M17 17.5C15.5 18.5 13.8 19 12 19c-7 0-11-7-11-7a20.6 20.6 0 0 1 4.3-5.2M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a20.7 20.7 0 0 1-2.6 3.6M14.1 14.1a3 3 0 1 1-4.2-4.2" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}