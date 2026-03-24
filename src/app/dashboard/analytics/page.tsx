"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";

interface Stats {
  totalConversations: number;
  totalLeads: number;
  totalMessages: number;
  conversationsToday: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/business/me");
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();
        setStats(data.stats);
      } catch {
        // Stats remain null, will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const summaryStats = [
    {
      label: "Total conversaciones",
      value: stats ? String(stats.totalConversations) : "0",
      icon: MessageSquare,
    },
    {
      label: "Total mensajes",
      value: stats ? String(stats.totalMessages) : "0",
      icon: TrendingUp,
    },
    {
      label: "Leads capturados",
      value: stats ? String(stats.totalLeads) : "0",
      icon: Users,
    },
    {
      label: "Conversaciones hoy",
      value: stats ? String(stats.conversationsToday) : "0",
      icon: Clock,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Resumen de actividad de tu negocio
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-neutral-800 p-2 w-fit">
                <stat.icon className="h-5 w-5 text-neutral-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart - not enough data */}
      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Conversaciones por dia</h2>
        <div className="flex items-center justify-center h-48 text-neutral-500 text-sm">
          Sin datos suficientes para mostrar la grafica
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Questions */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Preguntas mas frecuentes</h2>
          <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
            Sin datos suficientes
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Distribucion por canal</h2>
          <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
            Sin datos suficientes
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-neutral-400">
              Horarios pico
            </h3>
            <div className="flex items-center justify-center h-16 text-neutral-500 text-sm">
              Sin datos suficientes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
