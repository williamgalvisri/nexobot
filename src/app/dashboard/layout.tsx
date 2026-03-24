"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Code,
  LogOut,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NexoLogo } from "@/components/Logo";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "Conversaciones", icon: MessageSquare },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/widget", label: "Widget", icon: Code },
  { href: "/dashboard/billing", label: "Plan y Uso", icon: CreditCard },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-neutral-900 md:flex">
        <div className="flex items-center px-6 py-5">
          <div className="text-white">
            <NexoLogo height="h-4" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-800/50"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-neutral-400")} />
                {item.label}
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-white" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-800 px-3 py-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-500 hover:bg-neutral-800/50 hover:text-white transition"
          >
            <LogOut className="h-5 w-5 text-neutral-400" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
