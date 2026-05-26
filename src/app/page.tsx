"use client";

import { useState, useEffect, useRef } from "react";
import { guardarConsulta } from "@/lib/supabase";

/* ─── Tipos ─────────────────────────────────────────────── */
interface FormData {
  DNI: string;
  NombreCompleto: string;
  SEXOa: number;
  EDADa: number;
  NIVEST: number;
  T112: number;
  T113: number;
  V121: number;
  W127: number;
  IMCa: number;
  CODIGO_INE: string;
}

interface Resultado {
  p_base: number;
  ivsm_score?: number;
  riesgo_total: number;
  categoria: string;
  tipo_alerta?: string;
  municipio?: string;
  nivel_aire?: string;
  ivsm_categoria?: string;
  recomendaciones?: string[];
  DNI?: string;
  NombreCompleto?: string;
}

type Step = "form" | "result";

/* ─── Helpers ────────────────────────────────────────────── */
function getBadgeClass(categoria: string): string {
  const c = categoria.toLowerCase();
  if (c.includes("críti") || c.includes("criti")) return "result-badge result-badge-critical";
  if (c.includes("preventi") || c.includes("alerta"))  return "result-badge result-badge-warning";
  if (c.includes("monitoreo") || c.includes("seguimiento")) return "result-badge result-badge-medium";
  return "result-badge result-badge-safe";
}

function getBarColor(riesgo: number): string {
  if (riesgo >= 0.75) return "#dc2626";
  if (riesgo >= 0.5)  return "#ea580c";
  if (riesgo >= 0.25) return "#ca8a04";
  return "#16a34a";
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function Spinner() {
  return (
    <svg style={{ width: 16, height: 16, animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
    </svg>
  );
}

const DEFAULTS: FormData = {
  DNI: "",
  NombreCompleto: "",
  SEXOa: 1,
  EDADa: 45,
  NIVEST: 8,
  T112: 1,
  T113: 0,
  V121: 2,
  W127: 1,
  IMCa: 2,
  CODIGO_INE: "28079",
};

/* ─── Componente principal ───────────────────────────────── */
export default function HomePage() {
  const [step, setStep]         = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(DEFAULTS);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading]   = useState(false);
  const [netError, setNetError] = useState<string | null>(null);
  const sessionIdRef            = useRef<string>(generateSessionId());

  /* Privacidad en F5 */
  useEffect(() => {
    setStep("form");
    setFormData(DEFAULTS);
    setResultado(null);
    setNetError(null);
    sessionIdRef.current = generateSessionId();
  }, []);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  /* ─── SUBMIT ─────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.DNI.trim() || !formData.NombreCompleto.trim()) {
      setNetError("DNI y Nombre Completo son obligatorios.");
      return;
    }
    setLoading(true);
    setNetError(null);

    const t0 = Date.now();

    try {
      // Llamada al proxy interno /api/calcular (evita CORS con Oracle n8n)
      const res = await fetch("/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SEXOa:      formData.SEXOa,
          EDADa:      formData.EDADa,
          NIVEST:     formData.NIVEST,
          T112:       formData.T112,
          T113:       formData.T113,
          V121:       formData.V121,
          W127:       formData.W127,
          IMCa:       formData.IMCa,
          CODIGO_INE: formData.CODIGO_INE,
        }),
      });

      const duracion = Date.now() - t0;

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 504 || errData?.error === "timeout") {
          throw new Error("timeout");
        }
        if (res.status === 502 || errData?.error === "network") {
          throw new Error("network");
        }
        throw new Error(errData?.error ?? `Error ${res.status}`);
      }

      const data: Resultado = await res.json();

      // Guardar en Supabase (sin DNI ni nombre — privacidad)
      await guardarConsulta({
        sesion_id:        sessionIdRef.current,
        sexo:             formData.SEXOa,
        edad:             formData.EDADa,
        nivel_estudios:   formData.NIVEST,
        tabaquismo:       formData.T112,
        cigarrillos_dia:  formData.T113,
        actividad_fisica: formData.V121,
        alcohol:          formData.W127,
        imc_categoria:    formData.IMCa,
        codigo_ine:       formData.CODIGO_INE,
        p_base:           data.p_base,
        ivsm_score:       data.ivsm_score ?? null,
        riesgo_total:     data.riesgo_total,
        categoria:        data.categoria,
        tipo_alerta:      data.tipo_alerta ?? "sin_alerta",
        municipio:        data.municipio ?? null,
        duracion_ms:      duracion,
      });

      setResultado({ ...data, DNI: formData.DNI, NombreCompleto: formData.NombreCompleto });
      setStep("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      if (msg === "timeout") {
        setNetError("El motor n8n no respondió a tiempo. Verifica que la instancia de Oracle esté activa.");
      } else if (msg === "network") {
        setNetError("No se pudo conectar con el servidor n8n. Verifica la URL del webhook en las variables de entorno.");
      } else {
        setNetError(msg || "Error desconocido al procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaConsulta = () => {
    setStep("form");
    setResultado(null);
    setNetError(null);
    sessionIdRef.current = generateSessionId();
  };

  /* ─── VISTA: RESULTADO ─────────────────────────────────── */
  if (step === "result" && resultado) {
    const pct = Math.round(resultado.riesgo_total * 100);
    const barColor = getBarColor(resultado.riesgo_total);

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "32px 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                Resultado del análisis
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
                Paciente: <strong>{resultado.NombreCompleto}</strong> · DNI: {resultado.DNI}
              </p>
            </div>
            <button className="btn-secondary" onClick={handleNuevaConsulta} style={{ whiteSpace: "nowrap" }}>
              ← Nueva consulta
            </button>
          </div>

          {/* Score principal */}
          <div className="card" style={{ padding: "24px 24px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  Riesgo Total (RT)
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                    {pct}%
                  </span>
                  <span className={getBadgeClass(resultado.categoria)}>
                    {resultado.categoria}
                  </span>
                </div>
              </div>
              {resultado.municipio && (
                <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                  {resultado.municipio}<br />
                  <span style={{ fontSize: 11 }}>{resultado.ivsm_categoria ?? ""}</span>
                </p>
              )}
            </div>
            <div style={{ height: 10, background: "var(--bg-tertiary)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 5, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
              <span>Sin riesgo relevante</span>
              <span>Alerta crítica</span>
            </div>
          </div>

          {/* Grid métricas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Probabilidad base ML",  value: `${(resultado.p_base * 100).toFixed(1)}%`,                sub: "Modelo Random Forest" },
              { label: "Score RT global",        value: `${(resultado.riesgo_total * 100).toFixed(1)}%`,         sub: "Endógeno + ambiental + sinergia" },
              { label: "Índice IVSM",            value: resultado.ivsm_score != null ? `${(resultado.ivsm_score * 100).toFixed(1)}%` : "—", sub: "Calidad del aire local" },
              { label: "Nivel aire / Fuente",    value: resultado.nivel_aire ?? resultado.ivsm_categoria ?? "—", sub: "Datos MITECO / IVSM" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="card" style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: value.length > 8 ? 14 : 22, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{value}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Recomendaciones */}
          {resultado.recomendaciones && resultado.recomendaciones.length > 0 && (
            <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recomendaciones
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {resultado.recomendaciones.map((rec, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, color: "var(--text-secondary)", fontSize: 14 }}>
                    <span style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>·</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
            Los datos clínicos de esta consulta no han sido almacenados de forma identificable.<br />
            Al recargar la página, se borrarán automáticamente de esta sesión.
          </p>
        </div>
      </div>
    );
  }

  /* ─── VISTA: FORMULARIO ────────────────────────────────── */
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 500,
    color: "var(--text-label)", marginBottom: 5,
  };
  const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 0 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", padding: "32px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 8, padding: "6px 14px", marginBottom: 16, boxShadow: "var(--shadow-card)" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>SIAT-SM v{process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0"}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>
            Sistema de Análisis de Riesgo Cardiorrespiratorio
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            Modelo Random Forest · IVSM Municipal · Los datos no salen de la red
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* CARD 1 — Identificación */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Identificación del Paciente
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
              <div style={fieldWrap}>
                <label style={labelStyle}>
                  DNI <span title="Número de identificación — no se almacena en base de datos" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span>
                </label>
                <input className="input-field" type="text" placeholder="12345678A" value={formData.DNI} onChange={(e) => setField("DNI", e.target.value)} required />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>
                  Nombre Completo <span title="Solo para identificación local — no se persiste en servidores" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span>
                </label>
                <input className="input-field" type="text" placeholder="Apellidos, Nombre" value={formData.NombreCompleto} onChange={(e) => setField("NombreCompleto", e.target.value)} required />
              </div>
            </div>
          </div>

          {/* CARD 2 — Variables Clínicas */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Variables Clínicas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>

              <div style={fieldWrap}>
                <label style={labelStyle}>Sexo biológico <span title="Variable biológica de sexo asignado al nacer" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.SEXOa} onChange={(e) => setField("SEXOa", Number(e.target.value))}>
                  <option value={1}>1 — Masculino</option>
                  <option value={2}>2 — Femenino</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Edad (años) <span title="El modelo fue entrenado con adultos de 15 a 69 años" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <input className="input-field" type="number" min={15} max={69} value={formData.EDADa} onChange={(e) => setField("EDADa", Number(e.target.value))} />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Nivel de estudios <span title="Nivel educativo alcanzado. Indicador socioeconómico correlacionado con acceso a salud" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.NIVEST} onChange={(e) => setField("NIVEST", Number(e.target.value))}>
                  <option value={2}>2 — Sin estudios</option>
                  <option value={3}>3 — Primaria incompleta</option>
                  <option value={4}>4 — Primaria completa</option>
                  <option value={5}>5 — Secundaria</option>
                  <option value={6}>6 — Bachillerato</option>
                  <option value={7}>7 — FP</option>
                  <option value={8}>8 — Universitario</option>
                  <option value={9}>9 — Postgrado</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Hábito tabáquico <span title="El tabaquismo activo es el factor de riesgo modificable más relevante del modelo" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.T112} onChange={(e) => setField("T112", Number(e.target.value))}>
                  <option value={1}>1 — Nunca fumó</option>
                  <option value={2}>2 — Ex-fumador</option>
                  <option value={3}>3 — Fumador ocasional</option>
                  <option value={4}>4 — Fumador diario</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Cigarrillos/día (0 si no fuma) <span title="0 si nunca fumó o es ex-fumador. Máximo representado: 7+" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <input className="input-field" type="number" min={0} max={7} value={formData.T113} onChange={(e) => setField("T113", Number(e.target.value))} />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Actividad física <span title="La actividad intensa reduce el riesgo base hasta un 30%" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.V121} onChange={(e) => setField("V121", Number(e.target.value))}>
                  <option value={1}>1 — Ninguna</option>
                  <option value={2}>2 — Leve (caminar)</option>
                  <option value={3}>3 — Moderada (30 min/día)</option>
                  <option value={4}>4 — Intensa (deporte regular)</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Consumo de alcohol <span title="Escala ENSE 2017 de 1 (abstinencia) a 9 (dependencia severa)" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.W127} onChange={(e) => setField("W127", Number(e.target.value))}>
                  <option value={1}>1 — Nunca</option>
                  <option value={2}>2 — Mensual o menos</option>
                  <option value={3}>3 — 2–4 veces/mes</option>
                  <option value={4}>4 — 2–3 veces/semana</option>
                  <option value={5}>5 — 4+ veces/semana</option>
                  <option value={6}>6 — Diario moderado</option>
                  <option value={7}>7 — Diario intenso</option>
                  <option value={8}>8 — Dependencia leve</option>
                  <option value={9}>9 — Dependencia severa</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>IMC categorizado <span title="Índice de Masa Corporal. Calculado como peso(kg)/altura(m)²" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <select className="input-field" value={formData.IMCa} onChange={(e) => setField("IMCa", Number(e.target.value))}>
                  <option value={1}>1 — Bajo peso (&lt;18.5)</option>
                  <option value={2}>2 — Normopeso (18.5–24.9)</option>
                  <option value={3}>3 — Sobrepeso (25–29.9)</option>
                  <option value={4}>4 — Obesidad (≥30)</option>
                </select>
              </div>

              <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Código municipio INE <span title="5 dígitos. Usado para consultar el IVSM del municipio. 28079 = Madrid" style={{ cursor: "help", color: "var(--text-muted)" }}>ⓘ</span></label>
                <input className="input-field" type="text" maxLength={5} placeholder="28079" value={formData.CODIGO_INE} onChange={(e) => setField("CODIGO_INE", e.target.value.replace(/\D/g, ""))} style={{ maxWidth: 160 }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Por defecto: 28079 (Madrid)</span>
              </div>
            </div>
          </div>

          {netError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#7f1d1d" }}>
              {netError}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px 20px", fontSize: 15 }}>
            {loading ? <Spinner /> : null}
            {loading ? "Analizando..." : "Analizar Riesgo →"}
          </button>

        </form>

        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 20 }}>
          Los datos se procesan en el servidor n8n · El DNI y nombre no se almacenan en base de datos
        </p>
      </div>
    </div>
  );
}
