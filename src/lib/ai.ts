import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

interface ChatContext {
  businessName: string;
  botName: string;
  botPersonality: string;
  botContext: string | null;
  botInstructions: string | null;
  language: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateBotResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context);

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
  });

  return (
    response.choices[0]?.message?.content ??
    "Lo siento, no pude procesar tu mensaje."
  );
}

function buildSystemPrompt(context: ChatContext): string {
  const lang = context.language === "es" ? "español" : "English";

  return `Eres "${context.botName}", el asistente virtual de "${context.businessName}".

PERSONALIDAD: ${context.botPersonality}

IDIOMA: Responde siempre en ${lang}.

REGLAS:
- Sé conciso y útil. Máximo 2-3 oraciones por respuesta.
- Si el cliente pregunta algo que no sabes, di que transferirás su consulta a un humano.
- NUNCA inventes información sobre precios, horarios o servicios que no estén en tu contexto.
- Si detectas que el cliente quiere agendar una cita o comprar algo, pide su nombre, email y teléfono.
- Sé empático y profesional.

${context.botContext ? `INFORMACIÓN DEL NEGOCIO:\n${context.botContext}` : ""}

${context.botInstructions ? `INSTRUCCIONES ADICIONALES:\n${context.botInstructions}` : ""}

CAPTURA DE LEADS:
Cuando el usuario muestre interés real (quiere agendar, cotizar, comprar), solicita amablemente:
1. Nombre
2. Email o teléfono
Hazlo de forma natural, no como un formulario.`;
}

export async function extractLeadInfo(
  conversation: string
): Promise<{ name?: string; email?: string; phone?: string } | null> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 256,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Extract contact information from the conversation. Return JSON with name, email, phone fields. Only include fields that were explicitly provided. Return empty object {} if no contact info found.",
      },
      { role: "user", content: conversation },
    ],
  });

  try {
    const text = response.choices[0]?.message?.content;
    if (!text) return null;
    const data = JSON.parse(text);
    if (!data.name && !data.email && !data.phone) return null;
    return data;
  } catch {
    return null;
  }
}
