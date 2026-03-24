"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Download,
  ChevronDown,
  ChevronRight,
  Save,
  StickyNote,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-400",
  CONTACTED: "bg-yellow-500/10 text-yellow-400",
  QUALIFIED: "bg-emerald-500/10 text-emerald-400",
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

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;

function exportLeadsToCsv(leads: Lead[]) {
  const headers = ["Nombre", "Email", "Telefono", "Estado", "Fuente", "Fecha"];
  const rows = leads.map((lead) => [
    lead.name ?? "Sin nombre",
    lead.email ?? "",
    lead.phone ?? "",
    statusLabels[lead.status] ?? lead.status,
    lead.source === "WHATSAPP" ? "WhatsApp" : "Widget",
    new Date(lead.createdAt).toLocaleDateString("es"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string>("");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

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

  const handleRowClick = useCallback(
    (lead: Lead) => {
      if (expandedLeadId === lead.id) {
        setExpandedLeadId(null);
      } else {
        setExpandedLeadId(lead.id);
        setEditStatus(lead.status);
        setEditNotes(lead.notes ?? "");
      }
    },
    [expandedLeadId]
  );

  const handleSave = useCallback(
    async (leadId: string) => {
      setSaving(true);
      try {
        const res = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId,
            status: editStatus,
            notes: editNotes,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al guardar");
        }

        const { lead: updatedLead } = await res.json();

        // Update the lead in local state
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? { ...l, status: updatedLead.status, notes: updatedLead.notes }
              : l
          )
        );

        showToast("Lead actualizado correctamente", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Error al guardar",
          "error"
        );
      } finally {
        setSaving(false);
      }
    },
    [editStatus, editNotes, showToast]
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {leads.length} leads capturados
          </p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={() => exportLeadsToCsv(leads)}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-16 text-center">
          <Users className="mx-auto h-16 w-16 text-neutral-500 mb-4" />
          <p className="text-lg text-neutral-400">Sin leads aun</p>
          <p className="text-sm text-neutral-500 mt-2">
            Cuando el bot capture informacion de contacto de tus clientes, los
            leads apareceran aqui
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-xs text-neutral-400">
                  <th className="w-8 px-3 py-3"></th>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Contacto</th>
                  <th className="px-6 py-3 font-medium">Fuente</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  return (
                    <tr key={lead.id} className="group">
                      {/* Main row as a single nested table row */}
                      <td
                        colSpan={6}
                        className="p-0 border-b border-neutral-800"
                      >
                        {/* Clickable row */}
                        <div
                          onClick={() => handleRowClick(lead)}
                          className="flex cursor-pointer items-center transition hover:bg-neutral-800/50"
                        >
                          <div className="w-8 flex-shrink-0 px-3 py-4">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-neutral-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-neutral-500" />
                            )}
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <span className="text-sm font-medium text-white">
                              {lead.name ?? "Sin nombre"}
                            </span>
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {lead.email && (
                                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                                  <Mail className="h-3 w-3" /> {lead.email}
                                </span>
                              )}
                              {lead.phone && (
                                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                                  <Phone className="h-3 w-3" /> {lead.phone}
                                </span>
                              )}
                              {!lead.email && !lead.phone && (
                                <span className="text-xs text-neutral-500">
                                  Sin datos
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <span className="text-xs text-neutral-400">
                              {lead.source === "WHATSAPP" ? "\uD83D\uDCF1" : "\uD83C\uDF10"}{" "}
                              {lead.source === "WHATSAPP" ? "WhatsApp" : "Widget"}
                            </span>
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                statusColors[lead.status] ?? statusColors.NEW
                              }`}
                            >
                              {statusLabels[lead.status] ?? "Nuevo"}
                            </span>
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                              <Calendar className="h-3 w-3" />{" "}
                              {new Date(lead.createdAt).toLocaleDateString("es")}
                            </span>
                          </div>
                        </div>

                        {/* Expanded detail panel */}
                        {isExpanded && (
                          <div className="border-t border-neutral-800 bg-neutral-950/50 px-10 py-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {/* Status selector */}
                              <div>
                                <label className="mb-2 block text-xs font-medium text-neutral-400">
                                  Estado
                                </label>
                                <select
                                  value={editStatus}
                                  onChange={(e) => setEditStatus(e.target.value)}
                                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                      {statusLabels[s]}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Notes textarea */}
                              <div>
                                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                                  <StickyNote className="h-3 w-3" />
                                  Notas
                                </label>
                                <textarea
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  rows={3}
                                  placeholder="Agrega notas sobre este lead..."
                                  className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                                />
                              </div>
                            </div>

                            {/* Save button */}
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => handleSave(lead.id)}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-50"
                              >
                                {saving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                                Guardar
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
