'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isRecovery, setIsRecovery] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // En desarrollo local o antes de que el usuario configure Supabase Auth,
        // permitimos el acceso con credenciales de prueba predefinidas
        if (password === 'admin123' || password === 'asesor123') {
          sessionStorage.setItem('janm_demo_role', password === 'admin123' ? 'admin' : 'asesor');
          sessionStorage.setItem('janm_user_email', email);
          router.push('/dashboard');
          return;
        }
        throw error;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Compruebe sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      setSuccessMsg('Se ha enviado un correo con instrucciones de recuperación.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al solicitar recuperación de contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo direct login helpers for development & testing
  const loginAsDemo = (role: 'admin' | 'asesor' | 'solo_lectura') => {
    sessionStorage.setItem('janm_demo_role', role);
    sessionStorage.setItem('janm_user_email', `${role}@oratoriajanmelite.com`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-janm-dark flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-black">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al portal público</span>
        </Link>

        <div className="bg-janm-surface border border-janm-borderGold rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-black font-extrabold mx-auto mb-4 shadow-gold-sm text-xl">
              J
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              ORATORIA JANM ELITE
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Portal Administrativo y Comercial · JANM AI
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isRecovery ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="usuario@oratoriajanmelite.com"
                    className="w-full bg-janm-dark border border-janm-border rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRecovery(true)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-janm-dark border border-janm-border rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-sm rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-gold-sm cursor-pointer"
              >
                {isLoading ? 'Verificando sesión...' : 'Ingresar al Sistema'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Ingresa tu correo institucional registrado para enviarte un enlace seguro de restablecimiento de contraseña.
              </p>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@oratoriajanmelite.com"
                  className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-janm-gold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecovery(false)}
                  className="w-1/2 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl text-xs hover:bg-zinc-800"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-xs hover:brightness-110"
                >
                  Enviar Enlace
                </button>
              </div>
            </form>
          )}

          {/* ACCESO RÁPIDO PARA PRUEBAS Y EVALUACIÓN DE ROLES (Sección 13) */}
          <div className="mt-8 pt-6 border-t border-janm-border/60">
            <span className="text-[11px] text-zinc-500 block text-center mb-3 uppercase tracking-wider font-mono">
              Acceso Rápido por Rol (Demostración)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('admin')}
                className="py-1.5 px-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 text-center"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('asesor')}
                className="py-1.5 px-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[11px] font-semibold text-blue-300 hover:bg-blue-500/20 text-center"
              >
                💼 Asesor
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('solo_lectura')}
                className="py-1.5 px-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 text-center"
              >
                👁️ Lectura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
