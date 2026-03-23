"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare,
  Zap,
  BarChart3,
  Users,
  Globe,
  Shield,
  Clock,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
  Bot,
  Send,
  ChevronRight,
  Phone,
} from "lucide-react";

// ─── Navbar ──────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">NexoBot</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition">
            Características
          </a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">
            Precios
          </a>
          <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition">
            Testimonios
          </a>
          <a href="#faq" className="text-sm text-gray-400 hover:text-white transition">
            FAQ
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-gray-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-gray-400" onClick={() => setOpen(false)}>Características</a>
            <a href="#pricing" className="text-gray-400" onClick={() => setOpen(false)}>Precios</a>
            <a href="#testimonials" className="text-gray-400" onClick={() => setOpen(false)}>Testimonios</a>
            <Link href="/login" className="text-gray-400">Iniciar sesión</Link>
            <Link href="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white">
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <Zap className="h-4 w-4" />
            Potenciado por Inteligencia Artificial
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Tu empleado AI que{" "}
            <span className="gradient-text">nunca duerme</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
            Automatiza la atención al cliente de tu negocio. Responde en WhatsApp
            y tu sitio web <strong className="text-white">24/7</strong>. Captura
            leads y agenda citas mientras duermes.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30 transition-all"
            >
              Empezar gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-lg font-medium text-gray-300 hover:border-white/20 hover:text-white transition-all"
            >
              Ver demo en vivo
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-gray-950 bg-gradient-to-br from-brand-400 to-purple-500"
                />
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <span className="font-semibold text-white">+500 negocios</span>{" "}
              ya automatizan su atención al cliente
            </div>
          </div>
        </div>

        {/* Chat Demo */}
        <div id="demo" className="mx-auto mt-20 max-w-lg">
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}

// ─── Chat Demo ───────────────────────────────────────

function ChatDemo() {
  const messages = [
    { role: "user" as const, text: "Hola, quiero agendar una cita para mañana" },
    {
      role: "bot" as const,
      text: "¡Hola! Con gusto te ayudo a agendar tu cita. Tenemos disponibilidad mañana a las 10:00, 14:00 y 16:30. ¿Cuál horario te funciona mejor?",
    },
    { role: "user" as const, text: "A las 2pm está perfecto" },
    {
      role: "bot" as const,
      text: "Excelente, reservé tu cita para mañana a las 14:00. ¿Me podrías compartir tu nombre y número de teléfono para confirmar?",
    },
  ];

  return (
    <div className="glow rounded-2xl border border-white/10 bg-gray-900 p-1">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-xl bg-brand-600 px-5 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Asistente AI</p>
          <p className="text-xs text-brand-200">En línea</p>
        </div>
        <div className="ml-auto h-2 w-2 rounded-full bg-green-400" />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 p-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "rounded-br-md bg-brand-600 text-white"
                  : "rounded-bl-md bg-gray-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/5 px-4 py-3">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent text-sm text-gray-400 outline-none placeholder:text-gray-600"
          disabled
        />
        <button className="rounded-lg bg-brand-600 p-2">
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

// ─── Stats ───────────────────────────────────────────

function Stats() {
  const stats = [
    { value: "24/7", label: "Disponibilidad" },
    { value: "< 3s", label: "Tiempo de respuesta" },
    { value: "85%", label: "Consultas resueltas sin humano" },
    { value: "3x", label: "Más leads capturados" },
  ];

  return (
    <section className="border-y border-white/5 bg-gray-900/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold gradient-text md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat AI Inteligente",
      description:
        "Respuestas naturales y contextuales que entienden tu negocio. Entrenado con tu información de servicios, precios y horarios.",
    },
    {
      icon: Phone,
      title: "WhatsApp Business",
      description:
        "Conecta tu WhatsApp Business y responde automáticamente. Tus clientes chatean donde ya están.",
    },
    {
      icon: Users,
      title: "Captura de Leads",
      description:
        "Detecta automáticamente cuando un cliente quiere comprar y captura su información de contacto de forma natural.",
    },
    {
      icon: Globe,
      title: "Widget para tu Web",
      description:
        "Pega una línea de código en tu sitio web y ten un chatbot AI funcionando en minutos. Personaliza colores y estilo.",
    },
    {
      icon: BarChart3,
      title: "Analytics en Tiempo Real",
      description:
        "Mira cuántas conversaciones, leads capturados y consultas resueltas. Entiende a tus clientes con datos.",
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description:
        "Tus datos encriptados, servidores seguros y 99.9% de uptime. Tu negocio siempre disponible.",
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Todo lo que necesitas para{" "}
            <span className="gradient-text">automatizar tu atención</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Configura en minutos. Sin código. Sin complicaciones.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/5 bg-gray-900/50 p-8 hover:border-brand-500/30 hover:bg-gray-900 transition-all"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand-600/10 p-3">
                <feature.icon className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Registra tu negocio",
      description: "Crea tu cuenta gratis y agrega la información de tu negocio: servicios, precios, horarios, FAQ.",
    },
    {
      num: "02",
      title: "Personaliza tu bot",
      description: "Dale nombre, personalidad y las instrucciones que necesita. Como entrenar a un nuevo empleado, pero en 5 minutos.",
    },
    {
      num: "03",
      title: "Conecta tus canales",
      description: "Pega el widget en tu sitio web y/o conecta WhatsApp Business. Listo para atender.",
    },
    {
      num: "04",
      title: "Recibe leads mientras duermes",
      description: "Tu bot atiende clientes 24/7, captura información de contacto y tú cierras las ventas.",
    },
  ];

  return (
    <section className="border-y border-white/5 bg-gray-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Funcionando en <span className="gradient-text">menos de 10 minutos</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="text-5xl font-black text-brand-600/20">{step.num}</div>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: "Gratis",
      price: "$0",
      period: "para siempre",
      description: "Perfecto para probar NexoBot",
      features: [
        "50 conversaciones/mes",
        "Widget para tu sitio web",
        "1 negocio",
        "Respuestas AI básicas",
      ],
      cta: "Empezar gratis",
      popular: false,
    },
    {
      name: "Starter",
      price: "$97",
      period: "USD/mes",
      description: "Para negocios en crecimiento",
      features: [
        "500 conversaciones/mes",
        "Widget personalizable",
        "Captura de leads",
        "Dashboard de analytics",
        "Soporte por email",
      ],
      cta: "Elegir Starter",
      popular: false,
    },
    {
      name: "Pro",
      price: "$297",
      period: "USD/mes",
      description: "Para negocios serios",
      features: [
        "2,000 conversaciones/mes",
        "WhatsApp Business",
        "Multi-idioma",
        "Integración CRM",
        "Captura avanzada de leads",
        "Soporte prioritario",
        "API access",
      ],
      cta: "Elegir Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$497",
      period: "USD/mes",
      description: "Para operaciones grandes",
      features: [
        "Conversaciones ilimitadas",
        "Todo en Pro",
        "Múltiples negocios",
        "White-label",
        "Onboarding dedicado",
        "SLA 99.9%",
        "Soporte 24/7",
      ],
      cta: "Contactar ventas",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Planes que <span className="gradient-text">crecen contigo</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Empieza gratis. Escala cuando lo necesites. Sin contratos.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-brand-500 bg-gray-900 glow-sm"
                  : "border-white/5 bg-gray-900/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold">
                  Más popular
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="ml-1 text-sm text-gray-400">
                  {plan.period}
                </span>
              </div>

              <Link
                href="/register"
                className={`mt-8 block rounded-lg py-3 text-center text-sm font-medium transition ${
                  plan.popular
                    ? "bg-brand-600 text-white hover:bg-brand-500"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Todos los planes incluyen 14 días de prueba gratis del plan Pro. Sin tarjeta de crédito.
        </p>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Dentista, CDMX",
      text: "Antes perdía 3 horas al día respondiendo WhatsApps. Ahora NexoBot agenda citas solo y yo me concentro en mis pacientes. El primer mes capturé 40 leads nuevos.",
      stars: 5,
    },
    {
      name: "Carlos Ruiz",
      role: "Inmobiliaria, Monterrey",
      text: "Mis clientes preguntan por propiedades a las 11pm. Antes se iban con la competencia. Ahora NexoBot les responde al instante y me pasa los interesados.",
      stars: 5,
    },
    {
      name: "Ana López",
      role: "Restaurante, Guadalajara",
      text: "Lo instalé un viernes y el lunes ya tenía 15 reservaciones que el bot agendó solo. Recuperé la inversión en la primera semana.",
      stars: 5,
    },
    {
      name: "Roberto Méndez",
      role: "Abogado, Bogotá",
      text: "Lo que más me gusta es que el bot no inventa respuestas. Si no sabe algo, dice que me va a contactar. Profesional y confiable.",
      stars: 5,
    },
    {
      name: "Laura Torres",
      role: "E-commerce, Lima",
      text: "Reduje el tiempo de respuesta de 2 horas a 3 segundos. Mis ventas subieron 35% el primer mes. No hay comparación.",
      stars: 5,
    },
    {
      name: "Diego Herrera",
      role: "Gimnasio, Santiago",
      text: "El bot maneja todas las preguntas sobre horarios, precios y membresías. Mi equipo ya no tiene que repetir lo mismo 50 veces al día.",
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="border-y border-white/5 bg-gray-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Lo que dicen nuestros <span className="gradient-text">clientes</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/5 bg-gray-900/50 p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────

function FAQ() {
  const faqs = [
    {
      q: "¿Necesito saber programar?",
      a: "No. NexoBot se configura completamente desde el dashboard. Solo necesitas escribir la información de tu negocio y el bot aprende solo.",
    },
    {
      q: "¿Qué pasa si el bot no sabe responder algo?",
      a: "El bot nunca inventa información. Si no tiene la respuesta, le dice al cliente que un humano lo contactará pronto y te notifica para que hagas seguimiento.",
    },
    {
      q: "¿Funciona en español y otros idiomas?",
      a: "Sí. NexoBot soporta español, inglés, portugués y más. Detecta automáticamente el idioma del cliente y responde en el mismo.",
    },
    {
      q: "¿Puedo cancelar en cualquier momento?",
      a: "Sí. Sin contratos, sin penalizaciones. Cancelas y tu plan se mantiene activo hasta el final del período pagado.",
    },
    {
      q: "¿Cómo se conecta a WhatsApp?",
      a: "Usamos la API oficial de WhatsApp Business de Meta. Te guiamos paso a paso en la configuración, toma menos de 15 minutos.",
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Absolutamente. Usamos encriptación de extremo a extremo, servidores certificados y cumplimos con las regulaciones de protección de datos.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Preguntas <span className="gradient-text">frecuentes</span>
        </h2>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-gray-900/50"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronRight
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    openIdx === i ? "rotate-90" : ""
                  }`}
                />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed text-gray-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────

function FinalCTA() {
  return (
    <section className="border-t border-white/5 bg-gray-900/50 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold md:text-5xl">
          ¿Listo para dejar de perder clientes?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Cada minuto que un cliente espera una respuesta, es un cliente que se va
          con tu competencia. Automatiza tu atención hoy.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 transition-all"
          >
            Empezar gratis — 14 días Pro
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Sin tarjeta de crédito. Configuración en 10 minutos.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">NexoBot</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Automatiza la atención al cliente de tu negocio con inteligencia artificial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Producto</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition">Características</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Precios</a></li>
              <li><a href="#" className="hover:text-white transition">Integraciones</a></li>
              <li><a href="#" className="hover:text-white transition">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Empresa</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition">Trabaja con nosotros</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition">Términos</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NexoBot. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
