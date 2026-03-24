import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const business = await prisma.business.findFirst({
    where: { userId },
    include: {
      _count: {
        select: {
          conversations: true,
          leads: true,
        },
      },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [conversationsToday, totalMessages, recentConversations, leads] =
    await Promise.all([
      prisma.conversation.count({
        where: { businessId: business.id, createdAt: { gte: today } },
      }),
      prisma.message.count({
        where: {
          conversation: { businessId: business.id },
        },
      }),
      prisma.conversation.findMany({
        where: { businessId: business.id },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      }),
      prisma.lead.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return NextResponse.json({
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      plan: business.plan,
      botName: business.botName,
      botGreeting: business.botGreeting,
      botPersonality: business.botPersonality,
      botContext: business.botContext,
      botInstructions: business.botInstructions,
      language: business.language,
      widgetColor: business.widgetColor,
    },
    stats: {
      conversationsToday,
      totalConversations: business._count.conversations,
      totalLeads: business._count.leads,
      totalMessages,
    },
    recentConversations: recentConversations.map((c) => ({
      id: c.id,
      customerName: c.customerName ?? "Visitante",
      customerPhone: c.customerPhone,
      channel: c.channel,
      status: c.status,
      lastMessage: c.messages[0]?.content ?? "",
      lastMessageRole: c.messages[0]?.role ?? "USER",
      updatedAt: c.updatedAt,
    })),
    leads,
  });
}
