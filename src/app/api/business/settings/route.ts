import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const settingsSchema = z.object({
  botName: z.string().min(1).optional(),
  botGreeting: z.string().min(1).optional(),
  botPersonality: z.string().optional(),
  botContext: z.string().optional(),
  botInstructions: z.string().optional(),
  language: z.string().optional(),
  widgetColor: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const business = await prisma.business.findFirst({
    where: { userId },
  });

  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(data.botName !== undefined && { botName: data.botName }),
        ...(data.botGreeting !== undefined && { botGreeting: data.botGreeting }),
        ...(data.botPersonality !== undefined && { botPersonality: data.botPersonality }),
        ...(data.botContext !== undefined && { botContext: data.botContext }),
        ...(data.botInstructions !== undefined && { botInstructions: data.botInstructions }),
        ...(data.language !== undefined && { language: data.language }),
        ...(data.widgetColor !== undefined && { widgetColor: data.widgetColor }),
      },
    });

    return NextResponse.json({
      business: {
        id: updated.id,
        name: updated.name,
        botName: updated.botName,
        botGreeting: updated.botGreeting,
        botPersonality: updated.botPersonality,
        botContext: updated.botContext,
        botInstructions: updated.botInstructions,
        language: updated.language,
        widgetColor: updated.widgetColor,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
