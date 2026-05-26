/**
 * POST /api/rf-predict
 *
 * Runs StandardScaler + RandomForest inference server-side.
 * The model is bundled via require() — Turbopack/Webpack include it at build time,
 * no file-system access needed at runtime (works on any serverless platform).
 *
 * Request body:
 *   { SEXOa, EDADa, NIVEST, T112, T113, V121, W127, IMCa }  (raw, unscaled)
 *
 * Response:
 *   { p_base: number }  — probability of cardiorespiratory risk ∈ [0, 1]
 */

import { NextRequest, NextResponse } from "next/server";

// ── Scaler params (StandardScaler fitted on training data) ────────────────────
const MEANS  = [1.5195, 45.8924, 6.1993, 2.0501, 0.7095, 2.9176, 5.4888, 2.8407];
const SCALES = [0.4996, 14.1542, 1.9123, 1.0121, 1.5921, 1.2302, 2.6652, 1.2947];
const FEATURES = ["SEXOa","EDADa","NIVEST","T112","T113","V121","W127","IMCa"] as const;

// ── Model types ───────────────────────────────────────────────────────────────
type Tree = {
  l: number[];   // left children  (-1 = leaf)
  r: number[];   // right children (-1 = leaf)
  f: number[];   // feature index  (-2 = leaf)
  t: number[];   // threshold      (-2.0 = leaf)
  p: number[];   // P(class=1) at each node
};
type RFModel = { trees: Tree[] };

// ── Load model once at module init (bundled by Turbopack/Webpack via require) ──
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MODEL: RFModel = require("../../../../model/rf_compact.json");

// ── Inference helpers ──────────────────────────────────────────────────────────
function scale(features: number[]): number[] {
  return features.map((v, i) => (v - MEANS[i]) / SCALES[i]);
}

function predictTree(tree: Tree, s: number[]): number {
  let node = 0;
  while (tree.f[node] !== -2) {
    node = s[tree.f[node]] <= tree.t[node] ? tree.l[node] : tree.r[node];
  }
  return tree.p[node];
}

function rfPredict(raw: number[]): number {
  const s = scale(raw);
  const sum = MODEL.trees.reduce((acc, tree) => acc + predictTree(tree, s), 0);
  return sum / MODEL.trees.length;
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido." }, { status: 400 });
  }

  const raw: number[] = [];
  for (const feat of FEATURES) {
    const val = body[feat];
    if (val === undefined || val === null) {
      return NextResponse.json({ error: `Falta el campo: ${feat}` }, { status: 400 });
    }
    const num = Number(val);
    if (isNaN(num)) {
      return NextResponse.json({ error: `Campo inválido: ${feat} = ${val}` }, { status: 400 });
    }
    raw.push(num);
  }

  try {
    const p_base = rfPredict(raw);
    return NextResponse.json({ p_base: Math.round(p_base * 1e6) / 1e6 });
  } catch (err) {
    console.error("[rf-predict] Error en inferencia:", err);
    return NextResponse.json({ error: "Error interno del modelo RF." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido." }, { status: 405 });
}
