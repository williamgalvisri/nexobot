"use client";

import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const weekData = [
  { day: "Lun", conversations: 32, leads: 5 },
  { day: "Mar", conversations: 45, leads: 8 },
  { day: "Mié", conversations: 38, leads: 6 },
  { day: "Jue", conversations: 52, leads: 11 },
  { day: "Vie", conversations: 61, leads: 14 },
  { day: "Sáb", conversations: 28, leads: 4 },
  { day: "Dom", conversations: 15, leads: 2 },
];

const maxConv = Math.max(...weekData.map((d) => d.conversations));

const topQuestions = [
  { question: "¿Cuáles son sus horarios?", count: 87, pct: 100 },
  { question: "¿Cuánto cuesta la consulta?", count: 64, pct: 74 },
  { question: "¿Cómo agendo una cita?", count: 52, pct: 60 },
  { question: "¿Aceptan seguros?", count: 38, pct: 44 },
  { question: "¿Dónde están ubicados?", count: 31, pct: 36 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">
          Últimos 7 días de actividad
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total conversaciones", value: "271", change: "+18%", icon: MessageSquare },
          { label: "Leads capturados", value: "50", change: "+32%", icon: Users },
          { label: "Tasa de resolución", value: "87%", change: "+5%", icon: TrendingUp },
          { label: "Tiempo promedio", value: "2.1s", change: "-12%", icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-gray-900/50 p-6"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-brand-400" />
              <span className="flex items-center gap-1 text-xs text-green-400">
                {stat.change}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="mb-8 rounded-xl border border-white/5 bg-gray-900/50 p-6">
        <h2 className="mb-6 text-lg font-semibold">Conversaciones por día</h2>
        <div className="flex items-end gap-4 h-48">
          {weekData.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-gray-400">{d.conversations}</span>
              <div
                className="w-full rounded-t-md bg-brand-600/60 hover:bg-brand-500/80 transition"
                style={{ height: `${(d.conversations / maxConv) * 100}%` }}
              />
              <span className="text-xs text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Questions */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Preguntas más frecuentes</h2>
          <div className="space-y-4">
            {topQuestions.map((q, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{q.question}</span>
                  <span className="text-gray-500">{q.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-800">
                  <div
                    className="h-1.5 rounded-full bg-brand-500"
                    style={{ width: `${q.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Distribución por canal</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">📱 WhatsApp</span>
                <span className="text-gray-400">65% · 176 conversaciones</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-gray-800">
                <div className="h-3 rounded-full bg-green-500" style={{ width: "65%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">🌐 Widget Web</span>
                <span className="text-gray-400">35% · 95 conversaciones</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-gray-800">
                <div className="h-3 rounded-full bg-brand-500" style={{ width: "35%" }} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-gray-300">
              Horarios pico
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { time: "9-12", pct: "35%" },
                { time: "12-15", pct: "28%" },
                { time: "18-21", pct: "22%" },
              ].map((h) => (
                <div
                  key={h.time}
                  className="rounded-lg border border-white/10 bg-gray-800 px-3 py-2"
                >
                  <p className="text-lg font-bold text-brand-400">{h.pct}</p>
                  <p className="text-xs text-gray-400">{h.time}h</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
