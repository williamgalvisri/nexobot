"use client";

import { useState } from "react";
import { Copy, Check, Code, ExternalLink } from "lucide-react";

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);
  const businessId = "tu-business-id";

  const widgetCode = `<!-- NexoBot Chat Widget -->
<script
  src="https://nexobot.com/widget.js"
  data-business-id="${businessId}"
  data-color="#6366f1"
  data-bot-name="Asistente"
  data-greeting="¡Hola! ¿En qué puedo ayudarte?"
  async>
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Instalar Widget</h1>
        <p className="mt-1 text-sm text-gray-400">
          Agrega el chatbot AI a tu sitio web en menos de 1 minuto
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
              1
            </div>
            <h2 className="text-lg font-semibold">Copia el código</h2>
          </div>

          <p className="mb-4 text-sm text-gray-400">
            Copia este código y pégalo antes de la etiqueta{" "}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 text-brand-400">
              {"</body>"}
            </code>{" "}
            en tu sitio web.
          </p>

          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border border-white/10 bg-gray-800 p-4 text-sm text-gray-300">
              <code>{widgetCode}</code>
            </pre>
            <button
              onClick={copyCode}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-600 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
              2
            </div>
            <h2 className="text-lg font-semibold">Personaliza (opcional)</h2>
          </div>

          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-gray-800 p-4">
              <code className="text-brand-400">data-color</code>
              <p className="mt-1 text-gray-400">
                Color del widget (hex). Default: #6366f1
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-gray-800 p-4">
              <code className="text-brand-400">data-bot-name</code>
              <p className="mt-1 text-gray-400">
                Nombre que muestra el bot. Default: Asistente
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-gray-800 p-4">
              <code className="text-brand-400">data-greeting</code>
              <p className="mt-1 text-gray-400">
                Mensaje inicial del bot al abrir el chat
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-gray-800 p-4">
              <code className="text-brand-400">data-position</code>
              <p className="mt-1 text-gray-400">
                Posición: &quot;right&quot; o &quot;left&quot;. Default: right
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
              3
            </div>
            <h2 className="text-lg font-semibold">¡Listo!</h2>
          </div>
          <p className="text-sm text-gray-400">
            Tu chatbot AI ya está funcionando en tu sitio web. Los visitantes
            verán un botón de chat en la esquina inferior derecha.
          </p>
        </div>

        {/* Platforms */}
        <div className="rounded-xl border border-white/5 bg-gray-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Compatible con todas las plataformas
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["WordPress", "Shopify", "Wix", "Squarespace", "Webflow", "HTML", "React", "Next.js"].map(
              (platform) => (
                <div
                  key={platform}
                  className="rounded-lg border border-white/10 bg-gray-800 px-4 py-3 text-center text-sm text-gray-300"
                >
                  {platform}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
