import { NextRequest, NextResponse } from "next/server";

// Tiempo máximo de espera al motor n8n (Oracle puede tardar en el cold start)
const N8N_TIMEOUT_MS = 20_000;

export async function POST(req: NextRequest) {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!n8nUrl || n8nUrl.includes("TU_N8N_ORACLE") || n8nUrl.includes("TU_SUBDOMINIO")) {
    return NextResponse.json(
      { error: "Webhook URL de n8n no configurada. Añade NEXT_PUBLIC_N8N_WEBHOOK_URL en las variables de entorno." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

  try {
    const upstream = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Error del motor: ${upstream.status}`, detail: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
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

// Rechazar métodos distintos de POST
export async function GET() {
  return NextResponse.json({ error: "Método no permitido." }, { status: 405 });
}
