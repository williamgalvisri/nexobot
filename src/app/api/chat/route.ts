import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBotResponse, extractLeadInfo } from "@/lib/ai";
import { z } from "zod";

const chatSchema = z.object({
  businessId: z.string(),
  conversationId: z.string().optional(),
  message: z.string().min(1).max(2000),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = chatSchema.parse(body);

    // Get business
    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Get or create conversation
    let conversation;
    if (data.conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: data.conversationId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          businessId: business.id,
          channel: "WIDGET",
          customerName: data.customerName,
          customerEmail: data.customerEmail,
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: data.message,
      },
    });

    // Build message history for AI
    const history = [
      ...conversation.messages.map((m: { role: string; content: string }) => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: data.message },
    ].filter((m): m is { role: "user" | "assistant"; content: string } =>
      m.role === "user" || m.role === "assistant"
    );

    // Generate AI response
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

    // Save bot response
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Try to extract lead info in background (don't block response)
    extractLeadInfo(
      history.map((m) => `${m.role}: ${m.content}`).join("\n")
    ).then(async (leadInfo) => {
      if (leadInfo && (leadInfo.name || leadInfo.email || leadInfo.phone)) {
        await prisma.lead.upsert({
          where: {
            id: `${conversation.id}-lead`,
          },
          create: {
            businessId: business.id,
            name: leadInfo.name,
            email: leadInfo.email,
            phone: leadInfo.phone,
            source: "WIDGET",
          },
          update: {
            name: leadInfo.name ?? undefined,
            email: leadInfo.email ?? undefined,
            phone: leadInfo.phone ?? undefined,
          },
        });
      }
    }).catch(() => {}); // Silently fail — don't block the chat

    return NextResponse.json({
      conversationId: conversation.id,
      message: aiResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
