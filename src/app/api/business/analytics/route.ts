import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const business = await prisma.business.findFirst({ where: { userId } });
  if (!business) {
    return NextResponse.json({ error: "No business" }, { status: 404 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Conversations per day (last 30 days)
  const conversations = await prisma.conversation.findMany({
    where: { businessId: business.id, createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, channel: true },
  });

  // Build daily counts
  const dailyCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyCounts[key] = 0;
  }
  for (const c of conversations) {
    const key = c.createdAt.toISOString().slice(0, 10);
    if (dailyCounts[key] !== undefined) dailyCounts[key]++;
  }

  const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    label: new Date(date + "T12:00:00").toLocaleDateString("es", {
      day: "numeric",
      month: "short",
    }),
    conversations: count,
  }));

  // Channel distribution
  const channelCounts: Record<string, number> = { WIDGET: 0, WHATSAPP: 0, API: 0 };
  for (const c of conversations) {
    channelCounts[c.channel] = (channelCounts[c.channel] || 0) + 1;
  }
  const totalConvs = conversations.length || 1;
  const channelData = Object.entries(channelCounts)
    .filter(([, count]) => count > 0)
    .map(([channel, count]) => ({
      channel: channel === "WHATSAPP" ? "WhatsApp" : channel === "WIDGET" ? "Widget" : "API",
      count,
      percentage: Math.round((count / totalConvs) * 100),
    }));

  // Recent messages for "top questions" (last 50 user messages)
  const recentMessages = await prisma.message.findMany({
    where: {
      role: "USER",
      conversation: { businessId: business.id },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { content: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Simple keyword frequency
  const wordCounts: Record<string, number> = {};
  const stopWords = new Set([
    "hola", "que", "de", "la", "el", "en", "un", "una", "es", "por",
    "para", "con", "los", "las", "del", "al", "me", "mi", "te", "tu",
    "se", "si", "no", "ya", "hay", "como", "mas", "pero", "este",
    "esta", "esto", "muy", "bien", "a", "y", "o", "e", "u",
  ]);

  for (const msg of recentMessages) {
    const words = msg.content.toLowerCase().replace(/[^\w\sáéíóúñü]/g, "").split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
  }

  const topKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  // Hourly distribution
  const hourlyCounts = new Array(24).fill(0);
  for (const c of conversations) {
    hourlyCounts[c.createdAt.getHours()]++;
  }
  const peakHours = hourlyCounts
    .map((count, hour) => ({ hour, count }))
    .filter((h) => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return NextResponse.json({
    dailyData,
    channelData,
    topKeywords,
    peakHours,
  });
}
