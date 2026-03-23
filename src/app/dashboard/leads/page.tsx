"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

const leads = [
  { id: 1, name: "Juan Pérez", email: "juan@email.com", phone: "+52 55 1234 5678", source: "WhatsApp", status: "new", date: "23 Mar 2026" },
  { id: 2, name: "María García", email: "maria@email.com", phone: null, source: "Widget", status: "contacted", date: "23 Mar 2026" },
  { id: 3, name: "Pedro López", email: null, phone: "+52 81 9876 5432", source: "WhatsApp", status: "qualified", date: "22 Mar 2026" },
  { id: 4, name: "Ana Torres", email: "ana.torres@email.com", phone: "+52 33 5555 1234", source: "Widget", status: "converted", date: "22 Mar 2026" },
  { id: 5, name: "Luis Morales", email: "luis.m@email.com", phone: "+52 55 8888 4321", source: "WhatsApp", status: "new", date: "21 Mar 2026" },
  { id: 6, name: "Carmen Díaz", email: "carmen@negocio.com", phone: "+52 55 7777 8888", source: "WhatsApp", status: "contacted", date: "21 Mar 2026" },
  { id: 7, name: "Roberto Sánchez", email: null, phone: "+52 81 2222 3333", source: "Widget", status: "new", date: "20 Mar 2026" },
  { id: 8, name: "Laura Fernández", email: "laura.f@gmail.com", phone: "+52 33 4444 5555", source: "WhatsApp", status: "qualified", date: "20 Mar 2026" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-400",
  qualified: "bg-green-500/10 text-green-400",
  converted: "bg-purple-500/10 text-purple-400",
  lost: "bg-red-500/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  converted: "Convertido",
  lost: "Perdido",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search)
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-gray-400">
            {leads.length} leads capturados
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Nuevos", count: leads.filter((l) => l.status === "new").length, color: "text-blue-400" },
          { label: "Contactados", count: leads.filter((l) => l.status === "contacted").length, color: "text-yellow-400" },
          { label: "Calificados", count: leads.filter((l) => l.status === "qualified").length, color: "text-green-400" },
          { label: "Convertidos", count: leads.filter((l) => l.status === "converted").length, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 bg-gray-900/50 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-500 placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
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
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[.02] transition">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{lead.name}</span>
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
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400">
                      {lead.source === "WhatsApp" ? "📱" : "🌐"} {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" /> {lead.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
