"use client";

import { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

interface QuickReply {
  id: string;
  trigger: string;
  response: string;
}

export default function QuickRepliesPage() {
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const { showToast } = useToast();

  async function fetchQuickReplies() {
    try {
      const res = await fetch("/api/quick-replies");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setQuickReplies(data.quickReplies);
    } catch {
      showToast("Error al cargar respuestas rapidas", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuickReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!trigger.trim() || !response.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/quick-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: trigger.trim(), response: response.trim() }),
      });

      if (!res.ok) throw new Error("Error al crear");

      const data = await res.json();
      setQuickReplies((prev) => [...prev, data.quickReply]);
      setTrigger("");
      setResponse("");
      showToast("Respuesta rapida creada", "success");
    } catch {
      showToast("Error al crear respuesta rapida", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/quick-replies?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setQuickReplies((prev) => prev.filter((qr) => qr.id !== id));
      showToast("Respuesta rapida eliminada", "success");
    } catch {
      showToast("Error al eliminar respuesta rapida", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Respuestas rapidas</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Define respuestas automaticas que se envian sin usar AI cuando el mensaje coincide con el trigger
        </p>
      </div>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Plus className="h-5 w-5" />
          Nueva respuesta rapida
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="trigger"
              className="mb-1.5 block text-sm font-medium text-neutral-300"
            >
              Trigger (mensaje del usuario)
            </label>
            <input
              id="trigger"
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder='Ej: "horario", "precios", "ubicacion"'
              maxLength={200}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500 transition"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Coincidencia exacta, sin distinguir mayusculas/minusculas
            </p>
          </div>

          <div>
            <label
              htmlFor="response"
              className="mb-1.5 block text-sm font-medium text-neutral-300"
            >
              Respuesta automatica
            </label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="La respuesta que se enviara automaticamente..."
              maxLength={2000}
              rows={3}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !trigger.trim() || !response.trim()}
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Crear respuesta rapida
          </button>
        </div>
      </form>

      {/* List */}
      {quickReplies.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-12 text-center">
          <Zap className="mx-auto h-10 w-10 text-neutral-600" />
          <h3 className="mt-4 text-lg font-medium text-white">
            Sin respuestas rapidas
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Crea tu primera respuesta rapida para responder automaticamente sin usar AI
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quickReplies.map((qr) => (
            <div
              key={qr.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="text-sm font-medium text-white truncate">
                      {qr.trigger}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 whitespace-pre-wrap">
                    {qr.response}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(qr.id)}
                  className="shrink-0 rounded-lg bg-neutral-800 p-2 text-neutral-400 hover:bg-neutral-700 hover:text-red-400 transition"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
