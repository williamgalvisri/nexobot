"use client";

import { useState, useEffect } from "react";
import { Save, Bot, Palette, Globe, MessageSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [botName, setBotName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [personality, setPersonality] = useState("");
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");
  const [language, setLanguage] = useState("es");
  const [widgetColor, setWidgetColor] = useState("#6366f1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/business/me");
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();
        const b = data.business;
        setBotName(b.botName ?? "");
        setGreeting(b.botGreeting ?? "");
        setPersonality(b.botPersonality ?? "");
        setContext(b.botContext ?? "");
        setInstructions(b.botInstructions ?? "");
        setLanguage(b.language ?? "es");
        setWidgetColor(b.widgetColor ?? "#6366f1");
      } catch {
        setFeedback({ type: "error", message: "No se pudieron cargar los datos" });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/business/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botName,
          botGreeting: greeting,
          botPersonality: personality,
          botContext: context,
          botInstructions: instructions,
          language,
          widgetColor,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setFeedback({ type: "success", message: "Cambios guardados correctamente" });
    } catch {
      setFeedback({ type: "error", message: "Error al guardar los cambios" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuracion del Bot</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Personaliza como tu bot interactua con tus clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span
              className={`flex items-center gap-1.5 text-sm ${
                feedback.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {feedback.message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Bot Identity */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-white">Identidad del Bot</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Nombre del bot
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Personalidad
              </label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Ej: profesional, amigable, casual..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Saludo inicial
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        </section>

        {/* Business Context */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-white">Contexto del Negocio</h2>
          </div>
          <p className="mb-4 text-sm text-neutral-400">
            Escribe toda la informacion que tu bot necesita saber: servicios,
            precios, horarios, politicas, etc.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Informacion del negocio (servicios, precios, horarios)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500 resize-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Instrucciones adicionales
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                placeholder="Reglas especiales, excepciones, casos especificos..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500 resize-none placeholder:text-neutral-500"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-white">Apariencia</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Color del widget
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-neutral-700 bg-transparent"
                />
                <input
                  type="text"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="w-32 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
              >
                <option value="es">Espanol</option>
                <option value="en">English</option>
                <option value="pt">Portugues</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
