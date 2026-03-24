"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Bot,
  Loader2,
} from "lucide-react";

interface DashboardData {
  business: {
    id: string;
    name: string;
    plan: string;
    botName: string;
  };
  stats: {
    conversationsToday: number;
    totalConversations: number;
    totalLeads: number;
    totalMessages: number;
  };
  recentConversations: Array<{
    id: string;
    customerName: string;
    customerPhone: string | null;
    channel: string;
    status: string;
    lastMessage: string;
    lastMessageRole: string;
    updatedAt: string;
  }>;
  leads: Array<{
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  }>;
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "Hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/business/me");
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-400 py-20">
        No se pudo cargar el dashboard
      </div>
    );
  }

  const stats = [
    {
      label: "Conversaciones hoy",
      value: data.stats.conversationsToday.toString(),
      icon: MessageSquare,
    },
    {
      label: "Leads capturados",
      value: data.stats.totalLeads.toString(),
      icon: Users,
    },
    {
      label: "Total mensajes",
      value: data.stats.totalMessages.toString(),
      icon: TrendingUp,
    },
    {
      label: "Total conversaciones",
      value: data.stats.totalConversations.toString(),
      icon: Clock,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          {data.business.name} — Plan {data.business.plan}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-gray-900/50 p-6"
          >
            <div className="rounded-lg bg-brand-600/10 p-2 w-fit">
              <stat.icon className="h-5 w-5 text-brand-400" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Conversations */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">
          Conversaciones recientes
        </h2>
        {data.recentConversations.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-gray-900/50 p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">Aún no hay conversaciones</p>
            <p className="text-sm text-gray-500 mt-1">
              Cuando tus clientes chatean con tu bot, aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-gray-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs text-gray-400">
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Último mensaje</th>
                    <th className="px-6 py-3 font-medium">Canal</th>
                    <th className="px-6 py-3 font-medium">Tiempo</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentConversations.map((conv) => (
                    <tr
                      key={conv.id}
                      className="border-b border-white/5 hover:bg-white/[.02] transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/20 text-xs font-medium text-brand-400">
                            {conv.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              {conv.customerName}
                            </span>
                            {conv.customerPhone && (
                              <p className="text-xs text-gray-500">
                                {conv.customerPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                        {conv.lastMessageRole === "ASSISTANT" && (
                          <span className="text-brand-400 mr-1">Bot:</span>
                        )}
                        {conv.lastMessage.slice(0, 80)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                          {conv.channel === "WHATSAPP" ? "📱 WhatsApp" : "🌐 Widget"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {timeAgo(conv.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            conv.status === "ACTIVE"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {conv.status === "ACTIVE" ? "Activa" : "Cerrada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Widget Install Banner */}
      <div className="mt-8 rounded-xl border border-brand-500/20 bg-brand-600/5 p-6">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-brand-400" />
          <div>
            <p className="font-medium">Tu Business ID para el widget:</p>
            <code className="text-sm text-brand-300 bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
              {data.business.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
