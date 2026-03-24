"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Bot,
  Palette,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Building,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from "lucide-react";

export default function SettingsPage() {
  // Bot identity
  const [botName, setBotName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [personality, setPersonality] = useState("");
  const [language, setLanguage] = useState("es");
  const [widgetColor, setWidgetColor] = useState("#0a0a0a");

  // Business context (generated)
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");

  // Form fields for AI generation
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [services, setServices] = useState("");
  const [prices, setPrices] = useState("");
  const [hours, setHours] = useState("");
  const [address, setAddress] = useState("");
  const [policies, setPolicies] = useState("");
  const [faq, setFaq] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showRawContext, setShowRawContext] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
        setWidgetColor(b.widgetColor ?? "#0a0a0a");
        setBusinessName(b.name ?? "");
        // If there's already context, collapse the form
        if (b.botContext) setShowForm(false);
      } catch {
        setFeedback({
          type: "error",
          message: "No se pudieron cargar los datos",
        });
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
      setFeedback({
        type: "success",
        message: "Cambios guardados correctamente",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Error al guardar los cambios",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/business/generate-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry,
          services,
          prices,
          hours,
          address,
          policies,
          faq,
        }),
      });
      if (!res.ok) throw new Error("Error al generar");
      const data = await res.json();
      setContext(data.context);
      setShowRawContext(true);
      setFeedback({
        type: "success",
        message: "Contexto generado. Revísalo y guarda los cambios.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Error al generar el contexto con AI",
      });
    } finally {
      setGenerating(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-neutral-400";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Configuración del Bot
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Personaliza cómo tu bot interactúa con tus clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span
              className={`flex items-center gap-1.5 text-sm ${
                feedback.type === "success"
                  ? "text-emerald-400"
                  : "text-red-400"
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
            <h2 className="text-lg font-semibold text-white">
              Identidad del Bot
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre del bot</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Ej: Asistente, Luna, Max..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Personalidad</label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Ej: profesional, amigable, casual..."
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Saludo inicial</label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder="Ej: ¡Hola! ¿En qué puedo ayudarte hoy?"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Business Context - AI Assisted Form */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neutral-400" />
              <h2 className="text-lg font-semibold text-white">
                Información del Negocio
              </h2>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition"
            >
              {showForm ? "Ocultar formulario" : "Editar información"}
              {showForm ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mb-6 text-sm text-neutral-500">
            Completa los campos y la AI generará el contexto completo para tu
            bot. No necesitas llenar todos — solo lo que aplique a tu negocio.
          </p>

          {showForm && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                {/* Industry */}
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Tipo de negocio
                    </span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Ej: Clínica dental, Restaurante, Inmobiliaria..."
                    className={inputClass}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Dirección / Ubicación
                    </span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Reforma 123, CDMX"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" />
                    Servicios o productos que ofreces
                  </span>
                </label>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  rows={3}
                  placeholder={"Ej:\n- Limpieza dental\n- Blanqueamiento\n- Ortodoncia\n- Implantes"}
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Prices */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Precios
                  </span>
                </label>
                <textarea
                  value={prices}
                  onChange={(e) => setPrices(e.target.value)}
                  rows={3}
                  placeholder={"Ej:\n- Limpieza: $500 MXN\n- Blanqueamiento: $3,000 MXN\n- Consulta: Gratis"}
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Hours */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Horarios de atención
                  </span>
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Ej: Lunes a Viernes 9am-7pm, Sábados 9am-2pm"
                  className={inputClass}
                />
              </div>

              {/* Policies */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Políticas (cancelación, garantías, pagos)
                  </span>
                </label>
                <textarea
                  value={policies}
                  onChange={(e) => setPolicies(e.target.value)}
                  rows={2}
                  placeholder="Ej: Cancelaciones con 24h de anticipación. Aceptamos tarjeta y efectivo."
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* FAQ */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Preguntas frecuentes de tus clientes
                  </span>
                </label>
                <textarea
                  value={faq}
                  onChange={(e) => setFaq(e.target.value)}
                  rows={3}
                  placeholder={"Ej:\n- ¿Tienen estacionamiento? Sí, estacionamiento gratuito\n- ¿Aceptan seguros? Sí, todos los seguros principales"}
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generating
                  ? "Generando con AI..."
                  : "Generar contexto con AI"}
              </button>
            </div>
          )}

          {/* Raw context - editable */}
          <div className="mt-6">
            <button
              onClick={() => setShowRawContext(!showRawContext)}
              className="mb-3 flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition"
            >
              {showRawContext ? "Ocultar" : "Ver"} contexto generado
              {showRawContext ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showRawContext && (
              <div>
                <label className={labelClass}>
                  Contexto del bot (editable)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={12}
                  className={inputClass + " resize-none font-mono text-xs"}
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Este es el texto que tu bot usa para responder. Puedes
                  editarlo directamente o regenerarlo con el formulario.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Additional Instructions */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-white">
              Instrucciones adicionales
            </h2>
          </div>
          <p className="mb-4 text-sm text-neutral-500">
            Reglas especiales para tu bot: qué no debe hacer, cómo manejar
            ciertos casos, excepciones.
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            placeholder="Ej: Nunca dar descuentos sin autorización. Si preguntan por emergencias, dar el número de teléfono directo."
            className={inputClass + " resize-none"}
          />
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-semibold text-white">Apariencia</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Color del widget</label>
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
              <label className={labelClass}>Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputClass}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
