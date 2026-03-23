import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBotResponse } from "@/lib/ai";
import { sendWhatsAppMessage, parseWhatsAppWebhook } from "@/lib/whatsapp";

// WhatsApp verification (GET)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// WhatsApp incoming message (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseWhatsAppWebhook(body);

    if (!parsed) {
      return NextResponse.json({ status: "no_message" });
    }

    // Find business by WhatsApp phone number ID
    const business = await prisma.business.findFirst({
      where: { whatsappPhoneId: parsed.phoneNumberId },
    });

    if (!business) {
      return NextResponse.json({ status: "no_business" });
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        businessId: business.id,
        externalId: parsed.from,
        channel: "WHATSAPP",
        status: "ACTIVE",
      },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          businessId: business.id,
          channel: "WHATSAPP",
          externalId: parsed.from,
          customerPhone: parsed.from,
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: parsed.message,
      },
    });

    // Build history
    const history = [
      ...conversation.messages.map((m: { role: string; content: string }) => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: parsed.message },
    ].filter((m): m is { role: "user" | "assistant"; content: string } =>
      m.role === "user" || m.role === "assistant"
    );

    // Generate response
    const aiResponse = await generateBotResponse(
      history as Array<{ role: "user" | "assistant"; content: string }>,
      {
        businessName: business.name,
        botName: business.botName,
        botPersonality: business.botPersonality,
        botContext: business.botContext,
        botInstructions: business.botInstructions,
        language: business.language,
      }
    );

    // Save bot message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Send WhatsApp reply
    await sendWhatsAppMessage({
      to: parsed.from,
      body: aiResponse,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
