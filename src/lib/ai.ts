import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? "Lo siento, no pude procesar tu mensaje.";
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
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system:
      "Extract contact information from the conversation. Return JSON with name, email, phone fields. Only include fields that were explicitly provided. Return null if no contact info found.",
    messages: [{ role: "user", content: conversation }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) return null;

  try {
    return JSON.parse(textBlock.text);
  } catch {
    return null;
  }
}
