"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Code, ExternalLink, Loader2 } from "lucide-react";

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch("/api/business/me");
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();
        setBusinessId(data.business.id);
      } catch {
        setBusinessId("error-cargando-id");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const serverUrl = typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.com";

  const widgetCode = `<!-- NexoBot Chat Widget -->
<script
  src="${serverUrl}/widget.js"
  data-business-id="${businessId}"
  data-color="#6366f1"
  data-bot-name="Asistente"
  data-greeting="Hola! En que puedo ayudarte?"
  async>
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Instalar Widget</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Agrega el chatbot AI a tu sitio web en menos de 1 minuto
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-900">
              1
            </div>
            <h2 className="text-lg font-semibold text-white">Copia el codigo</h2>
          </div>

          <p className="mb-4 text-sm text-neutral-400">
            Copia este codigo y pegalo antes de la etiqueta{" "}
            <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-400">
              {"</body>"}
            </code>{" "}
            en tu sitio web.
          </p>

          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-800 p-4 text-sm text-neutral-400">
              <code>{widgetCode}</code>
            </pre>
            <button
              onClick={copyCode}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-600 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
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
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-900">
              2
            </div>
            <h2 className="text-lg font-semibold text-white">Personaliza (opcional)</h2>
          </div>

          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <code className="text-neutral-400">data-color</code>
              <p className="mt-1 text-neutral-500">
                Color del widget (hex). Default: #6366f1
              </p>
            </div>
            <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <code className="text-neutral-400">data-bot-name</code>
              <p className="mt-1 text-neutral-500">
                Nombre que muestra el bot. Default: Asistente
              </p>
            </div>
            <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <code className="text-neutral-400">data-greeting</code>
              <p className="mt-1 text-neutral-500">
                Mensaje inicial del bot al abrir el chat
              </p>
            </div>
            <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <code className="text-neutral-400">data-position</code>
              <p className="mt-1 text-neutral-500">
                Posicion: &quot;right&quot; o &quot;left&quot;. Default: right
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-900">
              3
            </div>
            <h2 className="text-lg font-semibold text-white">Listo!</h2>
          </div>
          <p className="text-sm text-neutral-400">
            Tu chatbot AI ya esta funcionando en tu sitio web. Los visitantes
            veran un boton de chat en la esquina inferior derecha.
          </p>
        </div>

        {/* Platforms */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Compatible con todas las plataformas
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["WordPress", "Shopify", "Wix", "Squarespace", "Webflow", "HTML", "React", "Next.js"].map(
              (platform) => (
                <div
                  key={platform}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-center text-sm text-neutral-400"
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
