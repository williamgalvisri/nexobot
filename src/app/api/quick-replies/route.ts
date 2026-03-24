import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  trigger: z.string().min(1).max(200),
  response: z.string().min(1).max(2000),
});

async function getBusinessForUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userId = (session.user as { id: string }).id;
  const business = await prisma.business.findFirst({
    where: { userId },
  });

  return business;
}

export async function GET() {
  const business = await getBusinessForUser();
  if (!business) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quickReplies = await prisma.quickReply.findMany({
    where: { businessId: business.id },
    orderBy: { trigger: "asc" },
  });

  return NextResponse.json({ quickReplies });
}

export async function POST(req: NextRequest) {
  const business = await getBusinessForUser();
  if (!business) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const quickReply = await prisma.quickReply.create({
      data: {
        businessId: business.id,
        trigger: data.trigger,
        response: data.response,
      },
    });

    return NextResponse.json({ quickReply }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Quick reply create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const business = await getBusinessForUser();
  if (!business) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  // Verify ownership
  const quickReply = await prisma.quickReply.findFirst({
    where: { id, businessId: business.id },
  });

  if (!quickReply) {
    return NextResponse.json({ error: "Quick reply not found" }, { status: 404 });
  }

  await prisma.quickReply.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
