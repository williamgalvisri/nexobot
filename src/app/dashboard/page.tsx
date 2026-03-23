"use client";

import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
} from "lucide-react";

// Demo stats — in production these come from the API
const stats = [
  {
    label: "Conversaciones hoy",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "Leads capturados",
    value: "12",
    change: "+23%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Tasa de resolución",
    value: "87%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Tiempo de respuesta",
    value: "2.3s",
    change: "-0.5s",
    trend: "up",
    icon: Clock,
  },
];

const recentConversations = [
  {
    id: 1,
    customer: "Juan Pérez",
    message: "Quiero agendar una cita para el viernes",
    channel: "WhatsApp",
    time: "Hace 5 min",
    status: "active",
  },
  {
    id: 2,
    customer: "María García",
    message: "¿Cuál es el precio de la consulta?",
    channel: "Widget",
    time: "Hace 12 min",
    status: "resolved",
  },
  {
    id: 3,
    customer: "Pedro López",
    message: "Necesito cancelar mi cita de mañana",
    channel: "WhatsApp",
    time: "Hace 20 min",
    status: "active",
  },
  {
    id: 4,
    customer: "Ana Torres",
    message: "¿Tienen disponibilidad esta semana?",
    channel: "Widget",
    time: "Hace 45 min",
    status: "resolved",
  },
  {
    id: 5,
    customer: "Luis Morales",
    message: "Quiero saber sobre el tratamiento dental",
    channel: "WhatsApp",
    time: "Hace 1 hora",
    status: "resolved",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Resumen de la actividad de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-gray-900/50 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-brand-600/10 p-2">
                <stat.icon className="h-5 w-5 text-brand-400" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
              </span>
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
        <h2 className="mb-4 text-lg font-semibold">Conversaciones recientes</h2>
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
                {recentConversations.map((conv) => (
                  <tr
                    key={conv.id}
                    className="border-b border-white/5 hover:bg-white/[.02] transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/20 text-xs font-medium text-brand-400">
                          {conv.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-medium">
                          {conv.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {conv.message}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                        {conv.channel === "WhatsApp" ? "📱" : "🌐"}{" "}
                        {conv.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {conv.time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          conv.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {conv.status === "active" ? "Activa" : "Resuelta"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <button className="flex items-center gap-3 rounded-xl border border-white/5 bg-gray-900/50 p-6 text-left hover:border-brand-500/30 transition">
          <div className="rounded-lg bg-brand-600/10 p-3">
            <Bot className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <p className="font-medium">Configurar bot</p>
            <p className="text-xs text-gray-400">Personaliza las respuestas</p>
          </div>
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-white/5 bg-gray-900/50 p-6 text-left hover:border-brand-500/30 transition">
          <div className="rounded-lg bg-green-600/10 p-3">
            <MessageSquare className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium">Conectar WhatsApp</p>
            <p className="text-xs text-gray-400">Atiende por WhatsApp</p>
          </div>
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-white/5 bg-gray-900/50 p-6 text-left hover:border-brand-500/30 transition">
          <div className="rounded-lg bg-purple-600/10 p-3">
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium">Ver leads</p>
            <p className="text-xs text-gray-400">12 leads esta semana</p>
          </div>
        </button>
      </div>
    </div>
  );
}
