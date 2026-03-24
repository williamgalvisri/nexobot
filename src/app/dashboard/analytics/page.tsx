"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Stats {
  totalConversations: number;
  totalLeads: number;
  totalMessages: number;
  conversationsToday: number;
}

interface AnalyticsData {
  dailyData: Array<{ date: string; label: string; conversations: number }>;
  channelData: Array<{ channel: string; count: number; percentage: number }>;
  topKeywords: Array<{ word: string; count: number }>;
  peakHours: Array<{ hour: number; count: number }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, analyticsRes] = await Promise.all([
          fetch("/api/business/me"),
          fetch("/api/business/analytics"),
        ]);
        if (meRes.ok) {
          const data = await meRes.json();
          setStats(data.stats);
        }
        if (analyticsRes.ok) {
          setAnalytics(await analyticsRes.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  const maxKeywordCount = analytics?.topKeywords?.[0]?.count || 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Resumen de actividad de tu negocio (últimos 30 días)
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"
          >
            <div className="rounded-lg bg-neutral-800 p-2 w-fit">
              <stat.icon className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conversations per day chart */}
      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">
          Conversaciones por día
        </h2>
        {analytics?.dailyData && analytics.dailyData.some((d) => d.conversations > 0) ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#737373", fontSize: 11 }}
                  axisLine={{ stroke: "#262626" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#737373", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: "#a3a3a3" }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar
                  dataKey="conversations"
                  fill="#ffffff"
                  radius={[4, 4, 0, 0]}
                  name="Conversaciones"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-neutral-500 text-sm">
            Sin conversaciones en los últimos 30 días
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Keywords */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Temas más consultados
          </h2>
          {analytics?.topKeywords && analytics.topKeywords.length > 0 ? (
            <div className="space-y-3">
              {analytics.topKeywords.map((kw) => (
                <div key={kw.word} className="flex items-center gap-3">
                  <span className="w-24 truncate text-sm text-neutral-300">
                    {kw.word}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/90 transition-all"
                      style={{
                        width: `${(kw.count / maxKeywordCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-neutral-500">
                    {kw.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
              Sin datos suficientes
            </div>
          )}
        </div>

        {/* Channel Distribution + Peak Hours */}
        <div className="space-y-8">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Distribución por canal
            </h2>
            {analytics?.channelData && analytics.channelData.length > 0 ? (
              <div className="space-y-3">
                {analytics.channelData.map((ch) => (
                  <div key={ch.channel} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-neutral-300">
                      {ch.channel}
                    </span>
                    <div className="flex-1 h-6 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/90 transition-all"
                        style={{ width: `${ch.percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs text-neutral-500">
                      {ch.count} ({ch.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-neutral-500 text-sm">
                Sin datos suficientes
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Horarios pico
            </h2>
            {analytics?.peakHours && analytics.peakHours.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analytics.peakHours.map((h) => (
                  <div
                    key={h.hour}
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-center"
                  >
                    <p className="text-lg font-bold text-white">
                      {String(h.hour).padStart(2, "0")}:00
                    </p>
                    <p className="text-xs text-neutral-500">
                      {h.count} conv.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 text-neutral-500 text-sm">
                Sin datos suficientes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
