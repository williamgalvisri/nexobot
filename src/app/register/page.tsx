"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, Building, ArrowRight, Check } from "lucide-react";
import { NexoLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, businessName }),
      });

      if (res.ok) {
        showToast("¡Cuenta creada! Redirigiendo al dashboard...", "success");
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.ok) {
          window.location.href = "/dashboard";
        } else {
          showToast("Error al iniciar sesión automáticamente", "error");
          setLoading(false);
        }
      } else {
        const data = await res.json().catch(() => null);
        const message =
          data?.error || "Error al crear la cuenta. El email puede estar en uso.";
        showToast(message, "error");
        setLoading(false);
      }
    } catch {
      showToast("Error de conexión. Intenta de nuevo.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl text-white">
            <NexoLogo height="h-6" />
          </Link>
          <p className="mt-2 text-sm text-neutral-400">
            Crea tu cuenta y empieza a automatizar
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          {/* Benefits */}
          <div className="mb-6 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
            <p className="mb-2 text-sm font-medium text-white">
              Incluye 7 días gratis del plan Pro:
            </p>
            <ul className="space-y-1.5">
              {[
                "2,000 conversaciones/mes",
                "WhatsApp Business",
                "Captura de leads",
                "Analytics completos",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-neutral-400">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Tu nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Repite tu contraseña"
                  required
                  minLength={8}
                  className={`w-full rounded-lg border bg-neutral-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 ${
                    passwordError
                      ? "border-red-500 focus:border-red-400"
                      : "border-neutral-700 focus:border-neutral-500"
                  }`}
                />
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-400">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">
                Nombre de tu negocio
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Mi Negocio"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-500 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-neutral-500">
            Al registrarte aceptas nuestros{" "}
            <a href="#" className="text-neutral-400 underline">Términos</a> y{" "}
            <a href="#" className="text-neutral-400 underline">Política de Privacidad</a>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-white hover:text-neutral-300"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
