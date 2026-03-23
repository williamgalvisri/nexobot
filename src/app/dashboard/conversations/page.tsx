"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, Bot, User } from "lucide-react";

const conversations = [
  {
    id: "1",
    customer: "Juan Pérez",
    phone: "+52 55 1234 5678",
    channel: "WhatsApp" as const,
    lastMessage: "Perfecto, nos vemos el viernes a las 10am",
    time: "Hace 5 min",
    unread: true,
    messages: [
      { role: "user", text: "Hola, quiero agendar una cita para el viernes", time: "10:30" },
      { role: "bot", text: "¡Hola Juan! Claro, tenemos disponibilidad el viernes a las 10:00, 14:00 y 16:30. ¿Cuál horario te funciona mejor?", time: "10:30" },
      { role: "user", text: "A las 10am está bien", time: "10:31" },
      { role: "bot", text: "Perfecto, tu cita está agendada para el viernes a las 10:00 AM. Te enviaremos un recordatorio el jueves. ¿Algo más en lo que pueda ayudarte?", time: "10:31" },
      { role: "user", text: "Perfecto, nos vemos el viernes a las 10am", time: "10:32" },
    ],
  },
  {
    id: "2",
    customer: "María García",
    phone: null,
    channel: "Widget" as const,
    lastMessage: "Gracias por la información",
    time: "Hace 12 min",
    unread: false,
    messages: [
      { role: "user", text: "¿Cuál es el precio de la consulta?", time: "10:15" },
      { role: "bot", text: "La consulta general tiene un costo de $500 MXN. Si necesitas una consulta especializada, el precio varía entre $800 y $1,200 MXN dependiendo del tratamiento. ¿Te gustaría agendar una cita?", time: "10:15" },
      { role: "user", text: "Gracias por la información", time: "10:18" },
    ],
  },
  {
    id: "3",
    customer: "Pedro López",
    phone: "+52 81 9876 5432",
    channel: "WhatsApp" as const,
    lastMessage: "¿Puedo reagendar para la próxima semana?",
    time: "Hace 20 min",
    unread: true,
    messages: [
      { role: "user", text: "Necesito cancelar mi cita de mañana", time: "10:05" },
      { role: "bot", text: "Entiendo, Pedro. Puedo cancelar tu cita de mañana. ¿Te gustaría reagendarla para otro día?", time: "10:05" },
      { role: "user", text: "¿Puedo reagendar para la próxima semana?", time: "10:08" },
    ],
  },
];

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const selected = conversations.find((c) => c.id === selectedId);
  const filtered = conversations.filter(
    (c) =>
      c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Conversaciones</h1>

      <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-white/5 bg-gray-900/50 overflow-hidden">
        {/* Conversation list */}
        <div className="w-80 flex-shrink-0 border-r border-white/5">
          <div className="border-b border-white/5 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-800 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-500 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full border-b border-white/5 p-4 text-left hover:bg-white/[.02] transition ${
                  selectedId === conv.id ? "bg-brand-600/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-sm font-medium text-brand-400">
                    {conv.customer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{conv.customer}</p>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {conv.channel === "WhatsApp" ? "📱" : "🌐"}
                      </span>
                      <p className="truncate text-xs text-gray-400">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat view */}
        {selected ? (
          <div className="flex flex-1 flex-col">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-sm font-medium text-brand-400">
                {selected.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium">{selected.customer}</p>
                <p className="text-xs text-gray-400">
                  {selected.phone ?? "Widget"} · {selected.channel}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-4">
                {selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        msg.role === "user"
                          ? "bg-gray-700"
                          : "bg-brand-600/20"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4 text-gray-300" />
                      ) : (
                        <Bot className="h-4 w-4 text-brand-400" />
                      )}
                    </div>
                    <div
                      className={`max-w-[60%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-brand-600 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`mt-1 text-[10px] ${
                          msg.role === "user"
                            ? "text-brand-200"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 mb-3" />
              <p>Selecciona una conversación</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
