"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare,
  Zap,
  BarChart3,
  Users,
  Globe,
  Shield,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
  Bot,
  Send,
  ChevronDown,
  Phone,
  Sparkles,
  Clock,
  TrendingUp,
  Play,
} from "lucide-react";

/* ─── Animation Helpers ─────────────────────────────── */

function Animated({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Navbar ────────────────────────────────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-gray-950/70 px-6 py-3.5 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NexoBot</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              ["Características", "#features"],
              ["Precios", "#pricing"],
              ["Testimonios", "#testimonials"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/25"
            >
              Empezar gratis
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl border border-white/[0.06] bg-gray-950/95 px-6 py-5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {[
                ["Características", "#features"],
                ["Precios", "#pricing"],
                ["Testimonios", "#testimonials"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
              <hr className="border-white/5" />
              <Link href="/login" className="px-3 py-2 text-gray-400">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Empezar gratis
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 lg:pt-48">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-brand-600/15 blur-[150px]" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -left-40 top-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Copy */}
          <div>
            <Animated>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-300">
                <Sparkles className="h-4 w-4" />
                Potenciado por Inteligencia Artificial
              </div>
            </Animated>

            <Animated delay={0.1}>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Tu empleado AI
                <br />
                que{" "}
                <span className="gradient-text">nunca duerme</span>
              </h1>
            </Animated>

            <Animated delay={0.2}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400 lg:text-xl">
                Automatiza la atención al cliente de tu negocio. Responde en
                WhatsApp y tu sitio web{" "}
                <strong className="text-white">24/7</strong>. Captura leads y
                agenda citas mientras duermes.
              </p>
            </Animated>

            <Animated delay={0.3}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-brand-500/30 hover:-translate-y-0.5"
                >
                  Empezar gratis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  <Play className="h-4 w-4" />
                  Ver demo en vivo
                </a>
              </div>
            </Animated>

            <Animated delay={0.4}>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[
                    "photo-1507003211169-0a1dd7228f2d",
                    "photo-1494790108377-be9c29b29330",
                    "photo-1472099645785-5658abf4ff4e",
                    "photo-1438761681033-6461ffad8d80",
                    "photo-1500648767791-00dcc994a43e",
                  ].map((id) => (
                    <div
                      key={id}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-950"
                    >
                      <Image
                        src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=80`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-semibold text-white">+500 negocios</span>{" "}
                  ya automatizan su atención
                </div>
              </div>
            </Animated>
          </div>

          {/* Right: Chat Demo */}
          <Animated delay={0.3} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-600/20 via-violet-600/10 to-transparent blur-2xl" />
            <div id="demo">
              <ChatDemo />
            </div>
          </Animated>
        </div>
      </div>
    </section>
  );
}

/* ─── Chat Demo ─────────────────────────────────────── */

function ChatDemo() {
  const messages = [
    {
      role: "user" as const,
      text: "Hola, quiero agendar una cita para mañana",
    },
    {
      role: "bot" as const,
      text: "¡Hola! Con gusto te ayudo. Tenemos disponibilidad mañana a las 10:00, 14:00 y 16:30. ¿Cuál horario te funciona mejor?",
    },
    { role: "user" as const, text: "A las 2pm está perfecto" },
    {
      role: "bot" as const,
      text: "Excelente, reservé tu cita para mañana a las 14:00. ¿Me podrías compartir tu nombre y número para confirmar?",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Asistente AI</p>
          <p className="text-xs text-brand-200">En línea ahora</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="text-xs text-green-300">Activo</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 p-5">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-brand-600 text-white"
                  : "rounded-bl-md bg-gray-800/80 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/5 px-5 py-4">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent text-sm text-gray-400 outline-none placeholder:text-gray-600"
          disabled
        />
        <button className="rounded-lg bg-brand-600 p-2.5 transition hover:bg-brand-500">
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

/* ─── Stats ─────────────────────────────────────────── */

function Stats() {
  const stats = [
    { icon: Clock, value: "24/7", label: "Disponibilidad total" },
    { icon: Zap, value: "< 3s", label: "Tiempo de respuesta" },
    { icon: TrendingUp, value: "85%", label: "Consultas resueltas" },
    { icon: Users, value: "3x", label: "Más leads capturados" },
  ];

  return (
    <section className="relative border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/50 via-gray-900/50 to-violet-950/50" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-20 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Animated key={stat.label} delay={i * 0.1}>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10">
                <stat.icon className="h-6 w-6 text-brand-400" />
              </div>
              <div className="text-3xl font-bold text-white md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </div>
          </Animated>
        ))}
      </div>
    </section>
  );
}

/* ─── Features ──────────────────────────────────────── */

function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat AI Inteligente",
      description:
        "Respuestas naturales y contextuales que entienden tu negocio. Entrenado con tu información de servicios, precios y horarios.",
      image: "photo-1531746790095-e5995f1a0cc6",
      span: "lg:col-span-2",
    },
    {
      icon: Phone,
      title: "WhatsApp Business",
      description:
        "Conecta tu WhatsApp Business y responde automáticamente. Tus clientes chatean donde ya están.",
      image: null,
      span: "",
    },
    {
      icon: Users,
      title: "Captura de Leads",
      description:
        "Detecta automáticamente cuando un cliente quiere comprar y captura su información de contacto de forma natural.",
      image: null,
      span: "",
    },
    {
      icon: Globe,
      title: "Widget para tu Web",
      description:
        "Pega una línea de código en tu sitio web y ten un chatbot AI funcionando en minutos. Personaliza colores y estilo.",
      image: null,
      span: "",
    },
    {
      icon: BarChart3,
      title: "Analytics en Tiempo Real",
      description:
        "Mira cuántas conversaciones, leads capturados y consultas resueltas. Entiende a tus clientes con datos.",
      image: "photo-1551288049-bebda4e38f71",
      span: "lg:col-span-2",
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description:
        "Tus datos encriptados, servidores seguros y 99.9% de uptime. Tu negocio siempre disponible.",
      image: null,
      span: "",
    },
  ];

  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              Funcionalidades
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Todo lo que necesitas para{" "}
              <span className="gradient-text">automatizar tu atención</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Configura en minutos. Sin código. Sin complicaciones.
            </p>
          </div>
        </Animated>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Animated
              key={feature.title}
              delay={i * 0.08}
              className={feature.span}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gray-900/40 p-8 transition-all hover:border-brand-500/20 hover:bg-gray-900/60">
                {/* Background image for wide cards */}
                {feature.image && (
                  <div className="absolute inset-0 -z-10 opacity-10 transition-opacity group-hover:opacity-[0.15]">
                    <Image
                      src={`https://images.unsplash.com/${feature.image}?auto=format&fit=crop&w=1200&q=60`}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-brand-600/10 p-3 ring-1 ring-brand-500/20">
                    <feature.icon className="h-6 w-6 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Animated>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Registra tu negocio",
      description:
        "Crea tu cuenta gratis y agrega la información de tu negocio: servicios, precios, horarios, FAQ.",
      icon: Users,
    },
    {
      num: "02",
      title: "Personaliza tu bot",
      description:
        "Dale nombre, personalidad y las instrucciones que necesita. Como entrenar a un nuevo empleado, pero en 5 minutos.",
      icon: Bot,
    },
    {
      num: "03",
      title: "Conecta tus canales",
      description:
        "Pega el widget en tu sitio web y/o conecta WhatsApp Business. Listo para atender.",
      icon: Globe,
    },
    {
      num: "04",
      title: "Recibe leads 24/7",
      description:
        "Tu bot atiende clientes día y noche, captura información de contacto y tú cierras las ventas.",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand-600/8 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Funcionando en{" "}
              <span className="gradient-text">menos de 10 minutos</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Cuatro pasos simples para automatizar tu negocio
            </p>
          </div>
        </Animated>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Animated key={step.num} delay={i * 0.12}>
              <div className="relative rounded-2xl border border-white/[0.06] bg-gray-900/40 p-8 transition-all hover:border-brand-500/20">
                {/* Step number */}
                <div className="mb-6 text-6xl font-black text-brand-600/15">
                  {step.num}
                </div>

                <div className="mb-4 inline-flex rounded-xl bg-brand-600/10 p-3">
                  <step.icon className="h-5 w-5 text-brand-400" />
                </div>

                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>

                {/* Connector arrow (not on last) */}
                {i < 3 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-gray-700 lg:block">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            </Animated>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Social Proof Image Section ────────────────────── */

function SocialProof() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <Animated>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand-600/20 via-violet-600/10 to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973bc0b7e09?auto=format&fit=crop&w=800&q=80"
                  alt="Customer service team using NexoBot"
                  width={800}
                  height={500}
                  className="w-full object-cover"
                />
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -right-4 rounded-xl border border-white/10 bg-gray-900/90 p-4 shadow-2xl backdrop-blur-sm sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">+340%</p>
                    <p className="text-xs text-gray-400">
                      Aumento en leads capturados
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Animated>

          {/* Text */}
          <div>
            <Animated>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Negocios reales,{" "}
                <span className="gradient-text">resultados reales</span>
              </h2>
            </Animated>
            <Animated delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                Más de 500 negocios en Latinoamérica ya usan NexoBot para
                automatizar su atención al cliente y capturar más leads sin
                contratar personal adicional.
              </p>
            </Animated>

            <Animated delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {[
                  { value: "500+", label: "Negocios activos" },
                  { value: "1.2M+", label: "Conversaciones procesadas" },
                  { value: "98%", label: "Satisfacción de clientes" },
                  { value: "< 3s", label: "Tiempo promedio de respuesta" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Animated>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ───────────────────────────────────────── */

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
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              Precios transparentes
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Planes que{" "}
              <span className="gradient-text">crecen contigo</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Empieza gratis. Escala cuando lo necesites. Sin contratos.
            </p>
          </div>
        </Animated>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Animated key={plan.name} delay={i * 0.08}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all ${
                  plan.popular
                    ? "border-brand-500/50 bg-gray-900 shadow-2xl shadow-brand-600/10"
                    : "border-white/[0.06] bg-gray-900/40 hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                    Más popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="ml-1.5 text-sm text-gray-400">
                    {plan.period}
                  </span>
                </div>

                <Link
                  href="/register"
                  className={`mt-8 block rounded-xl py-3.5 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500"
                      : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Animated>
          ))}
        </div>

        <Animated>
          <p className="mt-10 text-center text-sm text-gray-500">
            Todos los planes incluyen 14 días de prueba gratis del plan Pro. Sin
            tarjeta de crédito.
          </p>
        </Animated>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────── */

function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Dentista",
      location: "CDMX",
      text: "Antes perdía 3 horas al día respondiendo WhatsApps. Ahora NexoBot agenda citas solo y yo me concentro en mis pacientes. El primer mes capturé 40 leads nuevos.",
      avatar: "photo-1494790108377-be9c29b29330",
    },
    {
      name: "Carlos Ruiz",
      role: "Inmobiliaria",
      location: "Monterrey",
      text: "Mis clientes preguntan por propiedades a las 11pm. Antes se iban con la competencia. Ahora NexoBot les responde al instante y me pasa los interesados.",
      avatar: "photo-1507003211169-0a1dd7228f2d",
    },
    {
      name: "Ana López",
      role: "Restaurante",
      location: "Guadalajara",
      text: "Lo instalé un viernes y el lunes ya tenía 15 reservaciones que el bot agendó solo. Recuperé la inversión en la primera semana.",
      avatar: "photo-1438761681033-6461ffad8d80",
    },
    {
      name: "Roberto Méndez",
      role: "Abogado",
      location: "Bogotá",
      text: "Lo que más me gusta es que el bot no inventa respuestas. Si no sabe algo, dice que me va a contactar. Profesional y confiable.",
      avatar: "photo-1472099645785-5658abf4ff4e",
    },
    {
      name: "Laura Torres",
      role: "E-commerce",
      location: "Lima",
      text: "Reduje el tiempo de respuesta de 2 horas a 3 segundos. Mis ventas subieron 35% el primer mes. No hay comparación.",
      avatar: "photo-1534528741775-53994a69daeb",
    },
    {
      name: "Diego Herrera",
      role: "Gimnasio",
      location: "Santiago",
      text: "El bot maneja todas las preguntas sobre horarios, precios y membresías. Mi equipo ya no tiene que repetir lo mismo 50 veces al día.",
      avatar: "photo-1500648767791-00dcc994a43e",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-y border-white/5 py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              Testimonios
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Lo que dicen nuestros{" "}
              <span className="gradient-text">clientes</span>
            </h2>
          </div>
        </Animated>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Animated key={t.name} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-gray-900/40 p-7 transition-all hover:border-white/10">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="mt-5 flex-1 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full">
                    <Image
                      src={`https://images.unsplash.com/${t.avatar}?auto=format&fit=crop&w=96&q=80`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </Animated>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────── */

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
    <section id="faq" className="py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Animated>
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Preguntas{" "}
            <span className="gradient-text">frecuentes</span>
          </h2>
        </Animated>

        <div className="mt-14 space-y-3">
          {faqs.map((faq, i) => (
            <Animated key={i} delay={i * 0.06}>
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-gray-900/40 transition-colors hover:border-white/10">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 font-medium">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                      openIdx === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIdx === i ? "auto" : 0,
                    opacity: openIdx === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-400">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            </Animated>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-32">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-brand-600/15 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <Animated>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            ¿Listo para dejar de
            <br />
            <span className="gradient-text">perder clientes?</span>
          </h2>
        </Animated>

        <Animated delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
            Cada minuto que un cliente espera una respuesta, es un cliente que se
            va con tu competencia. Automatiza tu atención hoy.
          </p>
        </Animated>

        <Animated delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-brand-500/30 hover:-translate-y-0.5"
            >
              Empezar gratis — 14 días Pro
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Animated>

        <Animated delay={0.3}>
          <p className="mt-5 text-sm text-gray-500">
            Sin tarjeta de crédito. Configuración en 10 minutos.
          </p>
        </Animated>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">NexoBot</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Automatiza la atención al cliente de tu negocio con inteligencia
              artificial. 24/7, sin descanso.
            </p>
          </div>

          {[
            {
              title: "Producto",
              links: [
                { label: "Características", href: "#features" },
                { label: "Precios", href: "#pricing" },
                { label: "Integraciones", href: "#" },
                { label: "API Docs", href: "#" },
              ],
            },
            {
              title: "Empresa",
              links: [
                { label: "Sobre nosotros", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Contacto", href: "#" },
                { label: "Trabaja con nosotros", href: "#" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacidad", href: "#" },
                { label: "Términos", href: "#" },
                { label: "Cookies", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NexoBot. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-gray-500 transition hover:text-white"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
