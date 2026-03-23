import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export const PLANS = {
  FREE: {
    name: "Gratis",
    price: 0,
    conversations: 50,
    features: [
      "50 conversaciones/mes",
      "Widget para tu sitio web",
      "1 negocio",
      "Respuestas AI básicas",
    ],
  },
  STARTER: {
    name: "Starter",
    price: 97,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    conversations: 500,
    features: [
      "500 conversaciones/mes",
      "Widget personalizable",
      "Captura de leads",
      "Dashboard de analytics",
      "Soporte por email",
    ],
  },
  PRO: {
    name: "Pro",
    price: 297,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    conversations: 2000,
    popular: true,
    features: [
      "2,000 conversaciones/mes",
      "WhatsApp Business",
      "Multi-idioma",
      "Integración CRM",
      "Captura avanzada de leads",
      "Soporte prioritario",
      "API access",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 497,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    conversations: -1, // unlimited
    features: [
      "Conversaciones ilimitadas",
      "Todo en Pro",
      "Múltiples negocios",
      "White-label",
      "Onboarding dedicado",
      "SLA 99.9%",
      "Soporte 24/7",
    ],
  },
} as const;

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  businessId: string
) {
  return getStripe().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { businessId },
  });
}

export async function createCustomer(email: string, name: string) {
  return getStripe().customers.create({ email, name });
}

export async function cancelSubscription(subscriptionId: string) {
  return getStripe().subscriptions.cancel(subscriptionId);
}
