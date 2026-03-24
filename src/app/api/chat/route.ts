import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBotResponse, extractLeadInfo } from "@/lib/ai";
import { sendLeadNotificationEmail } from "@/lib/email";
import { z } from "zod";

const chatSchema = z.object({
  businessId: z.string(),
  conversationId: z.string().nullish(),
  message: z.string().min(1).max(2000),
  customerName: z.string().nullish(),
  customerEmail: z.string().email().nullish(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = chatSchema.parse(body);

    // Get business (include user for lead notification emails)
    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
      include: { user: { select: { email: true } } },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Check plan limits
    const now = new Date();
    const isTrialExpired = business.planExpiresAt && business.planExpiresAt < now;
    const effectivePlan = isTrialExpired ? "FREE" : business.plan;

    // If trial expired, downgrade the business
    if (isTrialExpired && business.plan !== "FREE") {
      await prisma.business.update({
        where: { id: business.id },
        data: { plan: "FREE" },
      });
    }

    // Count conversations this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const conversationCount = await prisma.conversation.count({
      where: { businessId: business.id, createdAt: { gte: startOfMonth } },
    });

    // Plan limits
    const limits: Record<string, number> = {
      FREE: 50, STARTER: 500, PRO: 2000, ENTERPRISE: -1,
    };
    const limit = limits[effectivePlan] ?? 50;

    if (limit !== -1 && conversationCount >= limit) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de conversaciones de tu plan. Actualiza tu plan para continuar.", code: "PLAN_LIMIT" },
        { status: 429 }
      );
    }

    // Get or create conversation
    let conversation;
    if (data.conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: data.conversationId, businessId: business.id },
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

    // Check quick replies first (exact match, case-insensitive)
    const quickReply = await prisma.quickReply.findFirst({
      where: {
        businessId: business.id,
        trigger: { equals: data.message, mode: "insensitive" },
      },
    });

    if (quickReply) {
      // Save quick reply response
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "ASSISTANT",
          content: quickReply.response,
        },
      });

      return NextResponse.json({
        conversationId: conversation.id,
        message: quickReply.response,
      });
    }

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
        // Check if lead already exists (to detect new vs update)
        const existingLead = await prisma.lead.findUnique({
          where: { id: `${conversation.id}-lead` },
        });

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

        // Send email notification only for NEW leads and non-FREE plans
        if (!existingLead && effectivePlan !== "FREE" && business.user?.email) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          sendLeadNotificationEmail({
            ownerEmail: business.user.email,
            leadName: leadInfo.name ?? null,
            leadEmail: leadInfo.email ?? null,
            leadPhone: leadInfo.phone ?? null,
            source: "WIDGET",
            appUrl,
          }).catch(() => {}); // Don't block on email failure
        }
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
