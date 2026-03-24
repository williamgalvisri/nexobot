"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-400",
  CONTACTED: "bg-yellow-500/10 text-yellow-400",
  QUALIFIED: "bg-green-500/10 text-green-400",
  CONVERTED: "bg-purple-500/10 text-purple-400",
  LOST: "bg-red-500/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  CONVERTED: "Convertido",
  LOST: "Perdido",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const bizRes = await fetch("/api/business/me");
        if (bizRes.ok) {
          const bizData = await bizRes.json();
          setBusinessId(bizData.business.id);
          setLeads(bizData.leads);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="mt-1 text-sm text-gray-400">
          {leads.length} leads capturados
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-16 text-center">
          <Users className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <p className="text-lg text-gray-400">Sin leads aún</p>
          <p className="text-sm text-gray-500 mt-2">
            Cuando el bot capture información de contacto de tus clientes, los
            leads aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-gray-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-400">
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Contacto</th>
                  <th className="px-6 py-3 font-medium">Fuente</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/[.02] transition"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {lead.name ?? "Sin nombre"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Mail className="h-3 w-3" /> {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </span>
                        )}
                        {!lead.email && !lead.phone && (
                          <span className="text-xs text-gray-500">
                            Sin datos
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400">
                        {lead.source === "WHATSAPP" ? "📱" : "🌐"}{" "}
                        {lead.source === "WHATSAPP" ? "WhatsApp" : "Widget"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusColors[lead.status] ?? statusColors.NEW
                        }`}
                      >
                        {statusLabels[lead.status] ?? "Nuevo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />{" "}
                        {new Date(lead.createdAt).toLocaleDateString("es")}
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
  );
}
