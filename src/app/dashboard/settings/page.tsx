"use client";

import { useState } from "react";
import { Save, Bot, Palette, Globe, MessageSquare } from "lucide-react";

export default function SettingsPage() {
  const [botName, setBotName] = useState("Asistente");
  const [greeting, setGreeting] = useState(
    "¡Hola! ¿En qué puedo ayudarte hoy?"
  );
  const [personality, setPersonality] = useState("profesional y amigable");
  const [context, setContext] = useState(
    "Somos una clínica dental con 10 años de experiencia.\n\nServicios:\n- Limpieza dental: $500 MXN\n- Blanqueamiento: $3,000 MXN\n- Ortodoncia: desde $15,000 MXN\n- Consulta general: $500 MXN\n\nHorario: Lunes a Viernes 9:00-18:00, Sábados 9:00-14:00\nDirección: Av. Reforma 123, CDMX\nTeléfono: 55 1234 5678"
  );
  const [instructions, setInstructions] = useState(
    "Si preguntan por emergencias, indicar que llamen al 55 1234 5678.\nSi preguntan por seguros, decir que aceptamos GNP, MetLife y Seguros Monterrey."
  );
  const [language, setLanguage] = useState("es");
  const [widgetColor, setWidgetColor] = useState("#6366f1");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración del Bot</h1>
          <p className="mt-1 text-sm text-gray-400">
            Personaliza cómo tu bot interactúa con tus clientes
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition">
          <Save className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>

      <div className="space-y-8">
        {/* Bot Identity */}
        <section className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-semibold">Identidad del Bot</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Nombre del bot
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Personalidad
              </label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Ej: profesional, amigable, casual..."
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Saludo inicial
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </section>

        {/* Business Context */}
        <section className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-semibold">Contexto del Negocio</h2>
          </div>
          <p className="mb-4 text-sm text-gray-400">
            Escribe toda la información que tu bot necesita saber: servicios,
            precios, horarios, políticas, etc.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Información del negocio (servicios, precios, horarios)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Instrucciones adicionales
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                placeholder="Reglas especiales, excepciones, casos específicos..."
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-semibold">Apariencia</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Color del widget
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <input
                  type="text"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="w-32 rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
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
