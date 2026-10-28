'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Target,
  MessageSquare,
  GraduationCap,
  BookOpen,
  Link2,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Send,
  ExternalLink,
  ShieldAlert
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

  const navItems = [
    { label: 'Tablero de Control', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Módulo de Prospección', href: '/admin/outbound', icon: Send },
    { label: 'Pipeline Comercial', href: '/admin/prospects', icon: Target },
    { label: 'Directorio de Contactos', href: '/admin/contacts', icon: Users },
    { label: 'Bitácora de Sesiones', href: '/admin/conversations', icon: MessageSquare },
    { label: 'Estructura de Programas', href: '/admin/courses', icon: GraduationCap },
    { label: 'Repositorio de Conocimiento', href: '/admin/knowledge', icon: BookOpen },
    { label: 'Enlace Google Workspace', href: '/admin/integrations', icon: Link2 },
    { label: 'Control de Acceso y Roles', href: '/admin/users', icon: ShieldCheck },
    { label: 'Configuración del Sistema', href: '/admin/settings', icon: Settings },
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-janm-dark flex items-center justify-center text-zinc-400 text-xs font-mono">
        Verificando credenciales de acceso institucional...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-janm-dark text-slate-100 flex">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-janm-surface border-r border-janm-border/60 shrink-0">
        <div className="p-5 border-b border-janm-border/40 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center font-extrabold text-black text-base shadow-gold-sm">
              J
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white block leading-none">
                ORATORIA <span className="text-janm-gold">JANM ELITE</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">CONSOLA ADMINISTRATIVA</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-gold-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-janm-surfaceLight'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil del usuario y logout */}
        <div className="p-4 border-t border-janm-border/40 bg-janm-dark/60">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate">{userEmail}</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Perfil: {userRole}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-1.5 px-2 rounded-lg bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:text-white text-xs flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Portal Web</span>
            </Link>
            <button
              onClick={handleLogout}
              className="py-1.5 px-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-64 max-w-[80%] bg-janm-surface border-r border-janm-border flex flex-col z-10">
            <div className="p-4 border-b border-janm-border flex items-center justify-between">
              <span className="font-bold text-sm text-white">CONSOLA OPERATIVA</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-janm-border bg-janm-dark/60">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg bg-red-500/10 text-red-300 text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="lg:hidden h-14 border-b border-janm-border bg-janm-surface px-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-janm-surfaceLight"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-xs text-white">ORATORIA JANM ELITE · SISTEMA</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
