"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  Stethoscope,
  ClipboardList,
  BarChart3,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Evaluación de Riesgo",
    icon: Stethoscope,
    href: "/",
    active: true,
  },
  {
    label: "Historial",
    icon: ClipboardList,
    href: "/historial",
    badge: "Próximamente",
  },
  {
    label: "Estadísticas",
    icon: BarChart3,
    href: "/estadisticas",
    badge: "Próximamente",
  },
  {
    label: "Municipios",
    icon: MapPin,
    href: "/municipios",
    badge: "Próximamente",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
    badge: "Próximamente",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="gradient-text font-bold text-sm leading-tight truncate">
              SIAT-SM CRM
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400">Sistema de Alerta Temprana</span>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 rounded font-semibold">
                BETA
              </span>
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => onCollapseChange?.(true)}
            className="text-slate-500 hover:text-slate-300 transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => onCollapseChange?.(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors hidden md:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                isActive
                  ? "bg-gradient-to-r from-blue-500/15 to-blue-600/5 text-blue-400 border-l-[3px] border-blue-500 pl-[calc(0.75rem-3px)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
              {!collapsed && (
                <span className="text-sm font-medium truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-[10px] bg-white/5 text-slate-500 border border-white/10 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Status */}
        <div className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/15",
          collapsed && "justify-center"
        )}>
          <div className="relative shrink-0">
            <Wifi className="w-3.5 h-3.5 text-green-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          {!collapsed && (
            <span className="text-[11px] text-green-400 font-medium">Sistema Conectado</span>
          )}
        </div>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all",
              collapsed && "justify-center"
            )}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )}
            {!collapsed && (
              <span className="text-sm">
                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F1629] border border-white/10 text-slate-400 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1224] border-r border-white/6 transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 border-r border-white/6 bg-[#0D1224] transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
