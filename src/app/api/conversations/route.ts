import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const searchParams = req.nextUrl.searchParams;
  const conversationId = searchParams.get("id");

  // Get user's business
  const business = await prisma.business.findFirst({
    where: { userId },
  });

  if (!business) {
    return NextResponse.json({ error: "No business" }, { status: 404 });
  }

  // If specific conversation requested
  if (conversationId) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, businessId: business.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json({ conversation });
  }

  // List all conversations
  const conversations = await prisma.conversation.findMany({
    where: { businessId: business.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      customerName: c.customerName ?? "Visitante",
      customerEmail: c.customerEmail,
      customerPhone: c.customerPhone,
      channel: c.channel,
      status: c.status,
      lastMessage: c.messages[0]?.content ?? "",
      lastMessageRole: c.messages[0]?.role ?? "USER",
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });
}
