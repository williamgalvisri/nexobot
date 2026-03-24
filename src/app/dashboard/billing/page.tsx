"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertTriangle,
  Check,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface UsageData {
  plan: string;
  conversationsUsed: number;
  conversationsLimit: number;
  trialDaysLeft: number | null;
  isTrialActive: boolean;
  planExpiresAt: string | null;
}

const plans = [
  {
    key: "STARTER",
    name: "Starter",
    price: 97,
    priceId: "price_1TEIhvKFIAprd6LJJCgBrHKt",
    conversations: "500",
    features: [
      "500 conversaciones/mes",
      "Widget para tu sitio web",
      "Captura automática de leads",
      "Dashboard de analytics",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    price: 297,
    priceId: "price_1TEIi7KFIAprd6LJvZbmpE4M",
    conversations: "2,000",
    popular: true,
    features: [
      "2,000 conversaciones/mes",
      "WhatsApp Business",
      "Widget personalizable",
      "Captura automática de leads",
      "Dashboard de analytics",
    ],
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    price: 497,
    priceId: "price_1TEIiQKFIAprd6LJnflbhkGk",
    conversations: "Ilimitadas",
    features: [
      "Conversaciones ilimitadas",
      "Todo en Pro",
      "WhatsApp Business",
      "Soporte directo por email",
    ],
  },
];

export default function BillingPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/business/usage")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch usage");
      })
      .then(setUsage)
      .catch(() => showToast("Error al cargar datos de uso", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (priceId: string, planName: string) => {
    setCheckoutLoading(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "Error al crear la sesión de pago", "error");
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      showToast("Error de conexión. Intenta de nuevo.", "error");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const usagePercent =
    usage && usage.conversationsLimit > 0
      ? Math.min((usage.conversationsUsed / usage.conversationsLimit) * 100, 100)
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Plan y Uso</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Gestiona tu suscripción y revisa tu uso mensual
        </p>
      </div>

      {/* Usage Card */}
      {usage && (
        <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                Plan actual
              </h2>
              <span className="inline-flex items-center rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-white">
                {usage.plan}
              </span>
            </div>
            {usage.isTrialActive && usage.trialDaysLeft !== null && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-1.5">
                <Clock className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-300">
                  Te quedan <span className="font-semibold text-white">{usage.trialDaysLeft} días</span> de prueba Pro
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-yellow-500" : "bg-white"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-neutral-400">
            <span className="text-white font-medium">{usage.conversationsUsed}</span>
            {" de "}
            <span className="text-white font-medium">
              {usage.conversationsLimit === -1 ? "∞" : usage.conversationsLimit}
            </span>
            {" conversaciones usadas este mes"}
          </p>

          {/* Warning banners */}
          {!usage.isTrialActive && usage.plan === "FREE" && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
              <p className="text-sm text-neutral-300">
                Tu prueba Pro ha terminado. Actualiza tu plan para desbloquear más conversaciones y funciones.
              </p>
            </div>
          )}

          {usagePercent >= 90 && usage.conversationsLimit !== -1 && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
              <p className="text-sm text-neutral-300">
                Estás cerca del límite de conversaciones. Actualiza tu plan para no interrumpir el servicio.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Plan Cards */}
      <h2 className="mb-4 text-lg font-semibold text-white">Planes disponibles</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = usage?.plan === plan.key;
          return (
            <div
              key={plan.key}
              className={`relative rounded-xl border p-6 transition ${
                plan.popular
                  ? "border-white/20 bg-neutral-900"
                  : "border-neutral-800 bg-neutral-900"
              } ${isCurrent ? "ring-2 ring-white/30" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900">
                    <Zap className="h-3 w-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-sm text-neutral-400">/mes</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  {plan.conversations} conversaciones/mes
                </p>
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 py-3 text-sm font-medium text-neutral-400 cursor-not-allowed"
                >
                  Plan actual
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.priceId, plan.name)}
                  disabled={checkoutLoading === plan.priceId}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition disabled:opacity-50"
                >
                  {checkoutLoading === plan.priceId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirigiendo...
                    </>
                  ) : (
                    <>
                      Actualizar a {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
