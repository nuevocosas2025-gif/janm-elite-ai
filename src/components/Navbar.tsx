'use client';

import Link from 'next/link';
import { Sparkles, MessageSquare, ShieldCheck, User, Send } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-janm-border/40 bg-janm-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-gold-sm group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-black text-lg">J</span>
          </div>
          <div>
            <span className="font-bold tracking-wider text-white text-base block leading-none">
              ORATORIA <span className="text-janm-gold">JANM ELITE</span>
            </span>
            <span className="text-[10px] text-zinc-400 tracking-widest font-mono uppercase">
              Academia de Liderazgo
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <Link href="#cursos" className="hover:text-janm-gold transition-colors">
            Cursos y Programas
          </Link>
          <Link href="#metodologia" className="hover:text-janm-gold transition-colors">
            Metodología
          </Link>
          <Link href="#certificacion" className="hover:text-janm-gold transition-colors">
            Certificación
          </Link>
          <Link href="/chat" className="hover:text-janm-gold transition-colors flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-4 h-4 text-janm-gold" />
            Asistente IA
          </Link>
          <Link href="/admin/outbound" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300">
            <Send className="w-4 h-4 text-emerald-400" />
            Envío WhatsApp IA
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm hover:brightness-110 shadow-gold-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatear Ahora</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 border border-janm-border/80 text-zinc-300 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-janm-surfaceLight hover:text-white transition-all"
          >
            <User className="w-4 h-4 text-janm-gold" />
            <span className="hidden sm:inline">Acceso Asesores</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
