import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _openai;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { businessName, industry, services, prices, hours, address, policies, faq } = body;

    const prompt = `Genera un contexto completo y profesional para un chatbot AI de atención al cliente. Usa la siguiente información del negocio para crear un texto en español que el bot pueda usar para responder preguntas de clientes.

DATOS DEL NEGOCIO:
- Nombre: ${businessName || "No especificado"}
- Industria/Tipo: ${industry || "No especificado"}
- Servicios/Productos: ${services || "No especificado"}
- Precios: ${prices || "No especificado"}
- Horarios: ${hours || "No especificado"}
- Dirección: ${address || "No especificado"}
- Políticas: ${policies || "No especificado"}
- Preguntas frecuentes: ${faq || "No especificado"}

INSTRUCCIONES:
- Escribe en primera persona plural ("Somos...", "Ofrecemos...")
- Organiza la información de forma clara con secciones
- Si algún dato no fue proporcionado, omítelo (no inventes)
- Incluye toda la información relevante para que el bot pueda responder consultas
- Sé conciso pero completo
- No uses markdown, solo texto plano con saltos de línea`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const generatedContext = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ context: generatedContext });
  } catch (error) {
    console.error("Generate context error:", error);
    return NextResponse.json(
      { error: "Error al generar el contexto" },
      { status: 500 }
    );
  }
}
