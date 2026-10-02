"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  Recycle,
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userName: string;
  userRole: string;
  userTipe: string;
}

export function Sidebar({ userName, userRole, userTipe }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = userRole === "ADMIN";

  const navItems = isAdmin
    ? [
        {
          href: "/dashboard/admin",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ]
    : [
        {
          href: "/dashboard/user",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          href: "/dashboard/user/lapor",
          label: "Buat Laporan",
          icon: FileText,
        },
      ];

  const tipeLabels: Record<string, string> = {
    RUMAH_TANGGA: "Rumah Tangga",
    SEKOLAH: "Sekolah",
    KANTOR: "Kantor",
    LAINNYA: "Lainnya",
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">EcoTrack</h2>
            <p className="text-xs text-slate-500">Manajemen Sampah</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
        <div className="flex items-center gap-2 mb-1">
          {isAdmin && <Shield className="w-4 h-4 text-amber-400" />}
          <p className="text-sm font-medium text-white truncate">{userName}</p>
        </div>
        <p className="text-xs text-slate-400">
          {isAdmin ? "Administrator" : tipeLabels[userTipe] || userTipe}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => signOut({ redirectTo: "/login" })}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50">
        {sidebarContent}
      </aside>
    </>
  );
}
