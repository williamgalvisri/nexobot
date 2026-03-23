import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.businessId;

      if (businessId && session.subscription) {
        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const priceId = subscription.items.data[0]?.price.id;
        let plan: "STARTER" | "PRO" | "ENTERPRISE" = "STARTER";

        if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "PRO";
        else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) plan = "ENTERPRISE";

        await prisma.business.update({
          where: { id: businessId },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            plan,
            planExpiresAt: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      const business = await prisma.business.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (business) {
        const priceId = subscription.items.data[0]?.price.id;
        let plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE" = "STARTER";

        if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "PRO";
        else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) plan = "ENTERPRISE";

        await prisma.business.update({
          where: { id: business.id },
          data: {
            stripePriceId: priceId,
            plan,
            planExpiresAt: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.business.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          plan: "FREE",
          stripeSubscriptionId: null,
          stripePriceId: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
