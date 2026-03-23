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
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  // Verify ownership
  const business = await prisma.business.findFirst({
    where: { id: businessId, userId },
  });

  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const leads = await prisma.lead.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ leads });
}
