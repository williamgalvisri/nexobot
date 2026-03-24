"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Bot, User, Loader2 } from "lucide-react";

interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string | null;
  channel: string;
  status: string;
  lastMessage: string;
  lastMessageRole: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.conversation?.messages ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      const interval = setInterval(() => fetchMessages(selectedId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Conversaciones</h1>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-16 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-neutral-500 mb-4" />
          <p className="text-lg text-neutral-400">Sin conversaciones aún</p>
          <p className="text-sm text-neutral-500 mt-2">
            Cuando clientes chateen con tu bot, las conversaciones aparecerán aquí en tiempo real
          </p>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          {/* Conversation list */}
          <div className="w-80 flex-shrink-0 border-r border-neutral-800 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full border-b border-neutral-800 p-4 text-left hover:bg-neutral-800/50 transition ${
                  selectedId === conv.id ? "bg-neutral-800" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-400">
                    {conv.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{conv.customerName}</p>
                      <span className="text-xs text-neutral-500">
                        {timeAgo(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-neutral-400 mt-0.5">
                      {conv.lastMessage.slice(0, 50)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Messages */}
          {selectedId ? (
            <div className="flex flex-1 flex-col">
              <div className="border-b border-neutral-800 px-6 py-4">
                <p className="font-medium text-white">
                  {conversations.find((c) => c.id === selectedId)?.customerName}
                </p>
                <p className="text-xs text-neutral-400">
                  {conversations.find((c) => c.id === selectedId)?.channel === "WHATSAPP"
                    ? "📱 WhatsApp"
                    : "🌐 Widget"}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.role === "USER" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800`}
                        >
                          {msg.role === "USER" ? (
                            <User className="h-4 w-4 text-neutral-400" />
                          ) : (
                            <Bot className="h-4 w-4 text-neutral-400" />
                          )}
                        </div>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                            msg.role === "USER"
                              ? "bg-white text-neutral-900"
                              : "bg-neutral-800 text-neutral-200"
                          }`}
                        >
                          {msg.content}
                          <div
                            className={`mt-1 text-[10px] ${
                              msg.role === "USER"
                                ? "text-neutral-500"
                                : "text-neutral-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString("es", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center text-neutral-500">
                <MessageSquare className="mx-auto h-12 w-12 mb-3" />
                <p>Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
