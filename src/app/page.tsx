"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare,
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
  Clock,
  TrendingUp,
  Zap,
  ArrowUpRight,
} from "lucide-react";

/* ─── Animation Helper ──────────────────────────────── */

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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
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
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            NexoBot
          </span>
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
              className="rounded-lg px-4 py-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Empezar gratis
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <X className="h-6 w-6 text-neutral-900" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-900" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-neutral-100 bg-white px-6 py-5 md:hidden"
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
                className="rounded-lg px-3 py-2 text-neutral-600 transition hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <hr className="border-neutral-100" />
            <Link href="/login" className="px-3 py-2 text-neutral-600">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white"
            >
              Empezar gratis
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 pt-24">
        <div className="max-w-2xl py-20">
          <Animated>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm text-neutral-600 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Potenciado por Inteligencia Artificial
            </div>
          </Animated>

          <Animated delay={0.1}>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Tu empleado AI
              <br />
              que nunca
              <br />
              <span className="text-neutral-400">duerme.</span>
            </h1>
          </Animated>

          <Animated delay={0.2}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-500">
              Automatiza la atención al cliente de tu negocio. Responde en
              WhatsApp y tu sitio web 24/7. Captura leads y agenda citas
              mientras duermes.
            </p>
          </Animated>

          <Animated delay={0.3}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
              >
                Empezar gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white/60 px-8 py-4 text-base font-medium text-neutral-700 backdrop-blur-sm transition hover:bg-white"
              >
                Ver demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Animated>

          <Animated delay={0.4}>
            <div className="mt-12 flex items-center gap-5">
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
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white"
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
              <div className="text-sm text-neutral-500">
                <span className="font-semibold text-neutral-900">+500</span>{" "}
                negocios confían en NexoBot
              </div>
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
      text: "¡Hola! Con gusto te ayudo. Tenemos disponibilidad mañana a las 10:00, 14:00 y 16:30. ¿Cuál te funciona?",
    },
    { role: "user" as const, text: "A las 2pm está perfecto" },
    {
      role: "bot" as const,
      text: "Reservé tu cita para mañana a las 14:00. ¿Me compartes tu nombre y número para confirmar?",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/50">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-900 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Asistente AI</p>
          <p className="text-xs text-neutral-400">En línea</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400">Activo</span>
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
                  ? "rounded-br-md bg-neutral-900 text-white"
                  : "rounded-bl-md bg-neutral-100 text-neutral-700"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-neutral-100 px-5 py-4">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent text-sm text-neutral-500 outline-none placeholder:text-neutral-400"
          disabled
        />
        <button className="rounded-full bg-neutral-900 p-2.5 transition hover:bg-neutral-800">
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

/* ─── Stats ─────────────────────────────────────────── */

function Stats() {
  const stats = [
    { value: "24/7", label: "Disponibilidad total", icon: Clock },
    { value: "< 3s", label: "Tiempo de respuesta", icon: Zap },
    { value: "85%", label: "Consultas resueltas", icon: TrendingUp },
    { value: "3x", label: "Más leads capturados", icon: Users },
  ];

  return (
    <section className="section-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-20 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Animated key={stat.label} delay={i * 0.08}>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
                <stat.icon className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="text-3xl font-bold text-white md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
            </div>
          </Animated>
        ))}
      </div>
    </section>
  );
}

/* ─── Demo Section ──────────────────────────────────── */

function DemoSection() {
  return (
    <section id="demo" className="section-light py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Copy */}
          <Animated>
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
                Demo en vivo
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Mira cómo tu bot atiende clientes
              </h2>
              <p className="mt-4 max-w-md text-neutral-500">
                NexoBot entiende el contexto de tu negocio, agenda citas, responde
                preguntas y captura leads de forma natural — todo automático.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Respuestas instantáneas y naturales",
                  "Captura de datos de contacto automática",
                  "Agendamiento de citas inteligente",
                  "Escalamiento a humano cuando es necesario",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm text-neutral-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Animated>

          {/* Right: Chat Demo */}
          <Animated delay={0.15}>
            <ChatDemo />
          </Animated>
        </div>
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
        "Respuestas naturales y contextuales entrenadas con la información de tu negocio.",
    },
    {
      icon: Phone,
      title: "WhatsApp Business",
      description:
        "Conecta tu WhatsApp y responde automáticamente donde tus clientes ya están.",
    },
    {
      icon: Users,
      title: "Captura de Leads",
      description:
        "Detecta oportunidades de venta y captura información de contacto de forma natural.",
    },
    {
      icon: Globe,
      title: "Widget para tu Web",
      description:
        "Una línea de código y tienes un chatbot AI funcionando. Personaliza colores y estilo.",
    },
    {
      icon: BarChart3,
      title: "Analytics en Tiempo Real",
      description:
        "Conversaciones, leads capturados y métricas de rendimiento en un solo dashboard.",
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description:
        "Datos encriptados, servidores seguros y 99.9% de uptime para tu negocio.",
    },
  ];

  return (
    <section id="features" className="section-light py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
              Funcionalidades
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Todo lo que necesitas para automatizar tu atención
            </h2>
          </div>
        </Animated>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Animated key={feature.title} delay={i * 0.06}>
              <div className="group rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
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
        "Crea tu cuenta gratis y agrega la información de tu negocio: servicios, precios, horarios.",
    },
    {
      num: "02",
      title: "Personaliza tu bot",
      description:
        "Dale nombre, personalidad e instrucciones. Como entrenar un empleado, pero en 5 minutos.",
    },
    {
      num: "03",
      title: "Conecta tus canales",
      description:
        "Pega el widget en tu web y/o conecta WhatsApp Business. Listo para atender.",
    },
    {
      num: "04",
      title: "Recibe leads 24/7",
      description:
        "Tu bot atiende clientes día y noche, captura contactos y tú cierras las ventas.",
    },
  ];

  return (
    <section className="section-muted py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Left: Image */}
          <Animated>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Equipo colaborando con NexoBot"
                  width={800}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-6 -right-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">+340%</p>
                    <p className="text-xs text-neutral-500">Más leads capturados</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Animated>

          {/* Right: Steps */}
          <div>
            <Animated>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
                Cómo funciona
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                4 pasos para automatizar tu negocio
              </h2>
            </Animated>

            <div className="mt-12 space-y-8">
              {steps.map((step, i) => (
                <Animated key={step.num} delay={i * 0.1}>
                  <div className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Animated>
              ))}
            </div>
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
    <section id="pricing" className="section-light py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
              Precios
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Planes que crecen contigo
            </h2>
            <p className="mt-3 text-neutral-500">
              Empieza gratis. Escala cuando lo necesites. Sin contratos.
            </p>
          </div>
        </Animated>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Animated key={plan.name} delay={i * 0.06}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all ${
                  plan.popular
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-2xl"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-neutral-900">
                    Más popular
                  </div>
                )}

                <div>
                  <h3
                    className={`text-lg font-semibold ${plan.popular ? "text-white" : "text-neutral-900"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${plan.popular ? "text-neutral-400" : "text-neutral-500"}`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`ml-1.5 text-sm ${plan.popular ? "text-neutral-400" : "text-neutral-500"}`}
                  >
                    {plan.period}
                  </span>
                </div>

                <Link
                  href="/register"
                  className={`mt-8 block rounded-full py-3.5 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-white text-neutral-900 hover:bg-neutral-100"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm ${plan.popular ? "text-neutral-300" : "text-neutral-600"}`}
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Animated>
          ))}
        </div>

        <Animated>
          <p className="mt-10 text-center text-sm text-neutral-400">
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
      text: "Antes perdía 3 horas al día respondiendo WhatsApps. Ahora NexoBot agenda citas solo y yo me concentro en mis pacientes.",
      avatar: "photo-1494790108377-be9c29b29330",
    },
    {
      name: "Carlos Ruiz",
      role: "Inmobiliaria",
      location: "Monterrey",
      text: "Mis clientes preguntan a las 11pm. Antes se iban con la competencia. Ahora NexoBot les responde al instante.",
      avatar: "photo-1507003211169-0a1dd7228f2d",
    },
    {
      name: "Ana López",
      role: "Restaurante",
      location: "Guadalajara",
      text: "Lo instalé un viernes y el lunes ya tenía 15 reservaciones que el bot agendó solo. Recuperé la inversión en una semana.",
      avatar: "photo-1438761681033-6461ffad8d80",
    },
    {
      name: "Roberto Méndez",
      role: "Abogado",
      location: "Bogotá",
      text: "El bot no inventa respuestas. Si no sabe algo, dice que me va a contactar. Profesional y confiable.",
      avatar: "photo-1472099645785-5658abf4ff4e",
    },
    {
      name: "Laura Torres",
      role: "E-commerce",
      location: "Lima",
      text: "Reduje el tiempo de respuesta de 2 horas a 3 segundos. Mis ventas subieron 35% el primer mes.",
      avatar: "photo-1534528741775-53994a69daeb",
    },
    {
      name: "Diego Herrera",
      role: "Gimnasio",
      location: "Santiago",
      text: "El bot maneja todas las preguntas sobre horarios, precios y membresías. Mi equipo ya no repite lo mismo 50 veces al día.",
      avatar: "photo-1500648767791-00dcc994a43e",
    },
  ];

  return (
    <section id="testimonials" className="section-dark py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Animated>
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
              Testimonios
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
          </div>
        </Animated>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Animated key={t.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-neutral-800 bg-neutral-900 p-7">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-white text-white"
                    />
                  ))}
                </div>

                <p className="mt-5 flex-1 text-sm leading-relaxed text-neutral-300">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-neutral-800 pt-5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={`https://images.unsplash.com/${t.avatar}?auto=format&fit=crop&w=96&q=80`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-neutral-500">
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
      a: "El bot nunca inventa información. Si no tiene la respuesta, le dice al cliente que un humano lo contactará pronto y te notifica.",
    },
    {
      q: "¿Funciona en español y otros idiomas?",
      a: "Sí. NexoBot soporta español, inglés, portugués y más. Detecta automáticamente el idioma del cliente.",
    },
    {
      q: "¿Puedo cancelar en cualquier momento?",
      a: "Sí. Sin contratos, sin penalizaciones. Cancelas y tu plan se mantiene activo hasta el final del período pagado.",
    },
    {
      q: "¿Cómo se conecta a WhatsApp?",
      a: "Usamos la API oficial de WhatsApp Business de Meta. Te guiamos paso a paso, toma menos de 15 minutos.",
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Absolutamente. Encriptación de extremo a extremo, servidores certificados y cumplimiento de regulaciones de protección de datos.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="section-light py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: Heading + image */}
          <Animated>
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
                FAQ
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                ¿Tienes preguntas?
                <br />
                <span className="text-neutral-400">Nosotros respondemos.</span>
              </h2>
              <p className="mt-4 text-neutral-500">
                Si no encuentras lo que buscas, escríbenos y te ayudamos.
              </p>

              <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200">
                <Image
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
                  alt="Equipo de soporte"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </Animated>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Animated key={i} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-xl border transition-colors ${
                    openIdx === i
                      ? "border-neutral-300 bg-neutral-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="pr-4 font-medium text-neutral-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 ${
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
                    <div className="px-6 pb-5 text-sm leading-relaxed text-neutral-500">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="section-dark py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Animated>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            ¿Listo para dejar de
            <br />
            perder clientes?
          </h2>
        </Animated>

        <Animated delay={0.1}>
          <p className="mx-auto mt-6 max-w-md text-lg text-neutral-400">
            Cada minuto que un cliente espera, es un cliente que se va con tu
            competencia. Automatiza tu atención hoy.
          </p>
        </Animated>

        <Animated delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Empezar gratis — 14 días Pro
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Animated>

        <Animated delay={0.3}>
          <p className="mt-5 text-sm text-neutral-500">
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
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                <Bot className="h-5 w-5 text-neutral-900" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                NexoBot
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-500 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} NexoBot. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-neutral-600 transition hover:text-white"
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
      <DemoSection />
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
