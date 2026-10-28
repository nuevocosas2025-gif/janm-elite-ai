'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Users,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      const savedEmail = sessionStorage.getItem('janm_user_email');
      const savedRole = sessionStorage.getItem('janm_demo_role') as UserRole;

      if (!savedEmail) {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            router.replace('/login');
            return;
          }
          setUserEmail(data.session.user.email || 'usuario@oratoriajanmelite.com');
          setIsAuthenticated(true);
        } catch {
          router.replace('/login');
          return;
        }
      } else {
        setUserEmail(savedEmail);
        if (savedRole) setUserRole(savedRole);
        setIsAuthenticated(true);
      }
    };

    verifyAccess();
  }, [router]);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {}
    sessionStorage.removeItem('janm_demo_role');
    sessionStorage.removeItem('janm_user_email');
    router.push('/login');
  };

  // MÓDULOS ESENCIALES Y CLAROS - Sin redundancias ni términos complejos
  const navItems = [
    { label: 'Panel Principal', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Envío WhatsApp (Lotes de 10)', href: '/admin/outbound', icon: Send },
    { label: 'Clientes y Ventas (Excel CRM)', href: '/admin/prospects', icon: Users },
    { label: 'Cursos y Horarios', href: '/admin/courses', icon: GraduationCap },
    { label: 'Preguntas Frecuentes', href: '/admin/knowledge', icon: BookOpen },
    { label: 'Conexión con Excel', href: '/admin/integrations', icon: FileSpreadsheet },
    { label: 'Ajustes del Sistema', href: '/admin/settings', icon: Settings },
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center text-amber-300/80 text-xs font-mono">
        Iniciando consola institucional de Oratoria JANM Elite...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex selection:bg-amber-500 selection:text-black">
      {/* SIDEBAR DESKTOP - Diseño Premium de Alto Contraste */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0B0F19] border-r border-amber-500/20 shrink-0 shadow-2xl relative z-20">
        {/* Cabecera del Sidebar con brillo dorado */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-b from-amber-500/10 to-transparent">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              J
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-white block leading-tight">
                ORATORIA <span className="text-amber-400">JANM ELITE</span>
              </span>
              <span className="text-[10px] text-amber-300/80 font-mono uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                CONSOLA OFICIAL
              </span>
            </div>
          </Link>
        </div>

        {/* Lista de navegación limpia y directa */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Módulos de Gestión
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/25 to-amber-500/10 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil del usuario y accesos rápidos */}
        <div className="p-4 border-t border-white/10 bg-[#080B14]">
          <div className="mb-3 px-1">
            <span className="block text-xs font-bold text-white truncate">{userEmail}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                {userRole === 'admin' ? 'Coordinación' : 'Asesor'}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sistema Activo" />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Web</span>
            </Link>
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-72 max-w-[85%] bg-[#0B0F19] border-r border-amber-500/30 flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-black">
                  J
                </div>
                <span className="font-extrabold text-xs text-white">ORATORIA JANM ELITE</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10 bg-[#080B14]">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-200 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-br from-[#070A12] via-[#0A0E1A] to-[#070A12]">
        <header className="lg:hidden h-14 border-b border-white/10 bg-[#0B0F19] px-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-xs text-white">ORATORIA JANM ELITE · CONSOLA</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
