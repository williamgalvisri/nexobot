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
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const conversationsThisMonth = await prisma.conversation.count({
    where: { businessId: business.id, createdAt: { gte: startOfMonth } },
  });

  const isTrialExpired = business.planExpiresAt && business.planExpiresAt < now;
  const effectivePlan = isTrialExpired ? "FREE" : business.plan;

  const limits: Record<string, number> = {
    FREE: 50, STARTER: 500, PRO: 2000, ENTERPRISE: -1,
  };
  const limit = limits[effectivePlan] ?? 50;

  // Days left on trial
  let trialDaysLeft: number | null = null;
  if (business.planExpiresAt && !isTrialExpired) {
    trialDaysLeft = Math.ceil((business.planExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  return NextResponse.json({
    plan: effectivePlan,
    conversationsUsed: conversationsThisMonth,
    conversationsLimit: limit,
    trialDaysLeft,
    isTrialActive: !!trialDaysLeft && trialDaysLeft > 0,
    planExpiresAt: business.planExpiresAt,
  });
}
