"use client";

import { useState } from "react";

/* ─── Credenciales MVP (hardcoded) ──────────────────────── */
const ADMIN_USER = "franco";
const ADMIN_PASS = "admin";

type AdminStep = "login" | "dashboard";
type NavItem = "Resumen" | "Consultas" | "Modelo ML" | "Configuración";

/* ─── Componente principal ───────────────────────────────── */
export default function AdminPage() {
  const [step, setStep]         = useState<AdminStep>("login");
  const [user, setUser]         = useState("");
  const [pass, setPass]         = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeNav, setActiveNav]   = useState<NavItem>("Resumen");

  /* ─── LOGIN ──── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setLoginError(false);
      setStep("dashboard");
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setStep("login");
    setUser("");
    setPass("");
    setLoginError(false);
  };

  /* ═══════════════════════════════════════
     VISTA: LOGIN
  ══════════════════════════════════════════ */
  if (step === "login") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 360,
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          borderRadius: 10,
          boxShadow: "var(--shadow-elevated)",
          padding: "32px 28px",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "#0f172a",
              borderRadius: 10,
              marginBottom: 14,
            }}>
              <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>S</span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
              SIAT-SM Admin
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              Acceso restringido
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-label)",
                marginBottom: 5,
              }}>
                Usuario
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Usuario"
                value={user}
                onChange={(e) => { setUser(e.target.value); setLoginError(false); }}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-label)",
                marginBottom: 5,
              }}>
                Contraseña
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setLoginError(false); }}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginTop: 4 }}
            >
              Ingresar
            </button>

            {loginError && (
              <p style={{ fontSize: 13, color: "#dc2626", textAlign: "center", margin: 0 }}>
                Credenciales incorrectas
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     VISTA: DASHBOARD
  ══════════════════════════════════════════ */
  const navItems: NavItem[] = ["Resumen", "Consultas", "Modelo ML", "Configuración"];

  const kpis = [
    { label: "Consultas Hoy",    value: "—",                          sub: "Sin datos aún" },
    { label: "Riesgo Promedio",  value: "—",                          sub: "Sin datos aún" },
    { label: "Alertas Activas",  value: "—",                          sub: "Sin datos aún" },
    { label: "Modelo en Uso",    value: "rf_riesgo_actualizado.pkl",   sub: "Versión activa" },
  ];

  const systemStatus = [
    {
      name: "Motor de decisión Python",
      status: "Activo ✓",
      statusColor: "#166534",
      statusBg: "#f0fdf4",
      detail: null,
    },
    {
      name: "Conexión n8n webhook",
      status: "Verificar →",
      statusColor: "#9a3412",
      statusBg: "#fff7ed",
      detail: "http://192.168.0.92:5678",
    },
    {
      name: "Base de datos Supabase",
      status: "Pendiente configuración",
      statusColor: "#713f12",
      statusBg: "#fefce8",
      detail: null,
    },
  ];

  const proximasFuncionalidades = [
    "Historial de consultas con filtros",
    "Reentrenamiento del modelo desde interfaz",
    "Exportación del dataset_pruebas_clinicas.csv",
    "Integración Supabase para persistencia",
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-secondary)" }}>

      {/* ─── SIDEBAR ─────────────────────────────────── */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "#0f172a",
              borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>S</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>SIAT-SM</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "9px 12px",
                borderRadius: 6,
                border: "none",
                background: activeNav === item ? "var(--bg-tertiary)" : "transparent",
                color: activeNav === item ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: 14,
                fontWeight: activeNav === item ? 500 : 400,
                cursor: "pointer",
                marginBottom: 2,
                textAlign: "left",
                transition: "background 120ms ease",
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0 10px" }}>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: "100%", fontSize: 13 }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ─── ÁREA PRINCIPAL ──────────────────────────── */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
            Dashboard · Vista General
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            Panel de administración SIAT-SM — Fase 1
          </p>
        </div>

        {/* KPI grid 4 columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {kpis.map(({ label, value, sub }) => (
            <div key={label} className="card" style={{ padding: "18px 20px" }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                {label}
              </p>
              <p style={{
                fontSize: value.length > 8 ? 13 : 26,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 4,
                wordBreak: "break-all",
              }}>
                {value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Estado del sistema */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
            Estado del Sistema
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {systemStatus.map((s, i) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: i < systemStatus.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 14, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 500 }}>
                    {s.name}
                  </p>
                  {s.detail && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{s.detail}</p>
                  )}
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: s.statusBg,
                  color: s.statusColor,
                  border: `1px solid ${s.statusColor}30`,
                  whiteSpace: "nowrap",
                }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas funcionalidades */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
            Próximas Funcionalidades
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {proximasFuncionalidades.map((f) => (
              <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>·</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Nota discreta */}
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Dashboard en desarrollo — Fase 1 SIAT-SM
        </p>
      </main>
    </div>
  );
}
