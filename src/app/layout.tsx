import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexoBot - Tu Empleado AI que Nunca Duerme",
  description:
    "Automatiza la atención al cliente de tu negocio con inteligencia artificial. Responde en WhatsApp y tu sitio web 24/7. Captura leads mientras duermes.",
  keywords: [
    "chatbot",
    "inteligencia artificial",
    "atención al cliente",
    "WhatsApp bot",
    "automatización",
    "leads",
    "negocios locales",
  ],
  openGraph: {
    title: "NexoBot - Tu Empleado AI que Nunca Duerme",
    description:
      "Automatiza la atención al cliente con AI. Responde 24/7 en WhatsApp y tu sitio web.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
