import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const business = await prisma.business.findFirst({ where: { userId } });
  if (!business) {
    return NextResponse.json({ error: "No business" }, { status: 404 });
  }

  const { priceId } = await req.json();
  if (!priceId) {
    return NextResponse.json({ error: "priceId required" }, { status: 400 });
  }

  const stripe = getStripe();

  // Get or create Stripe customer
  let customerId = business.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: { businessId: business.id },
    });
    customerId = customer.id;
    await prisma.business.update({
      where: { id: business.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/dashboard/billing`,
    metadata: { businessId: business.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
