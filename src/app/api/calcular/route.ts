import { NextRequest, NextResponse } from "next/server";

// URL del motor n8n en Oracle Cloud (hardcodeada para proyecto escolar)
const N8N_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
  ?? "https://n8n.maniaco.online/webhook/siat-sm";

const N8N_TIMEOUT_MS = 25_000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const upstream = await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Leer como text primero para no romper si n8n devuelve HTML (workflow inactivo)
    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'motor_error', status: upstream.status, detail: text.slice(0, 300) },
        { status: upstream.status }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'parse_error', message: 'n8n respondió sin JSON — verificá que el workflow esté activo', raw: text.slice(0, 200) },
        { status: 502 }
      );
    }

    return NextResponse.json(data as Record<string, unknown>);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "timeout", message: `El motor n8n no respondió en ${N8N_TIMEOUT_MS / 1000}s.` },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "network", message: "No se pudo conectar con el servidor n8n." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido." }, { status: 405 });
}
