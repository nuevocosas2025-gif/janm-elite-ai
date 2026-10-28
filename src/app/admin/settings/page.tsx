'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  ShieldCheck, 
  Coins, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Globe
} from 'lucide-react';

export default function SettingsAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Configuración del Sistema y Auditoría de Costos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cumplimiento de la regla de costo cero, términos de uso de Vercel y políticas de seguridad.
          </p>
        </div>

        {/* AUDITORÍA DE COSTO CERO (SECCIÓN 2) */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Coins className="w-5 h-5" />
            <span>Regla de Presupuesto Cero (S/ 0.00)</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            El sistema está diseñado y optimizado para funcionar sin incurrir en costos fijos de servidores, APIs comerciales obligatorias ni cargos recurrentes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-white block mb-1">Base de Datos & Auth</span>
              <span className="text-emerald-400">Supabase Free Tier (500 MB DB, 50k MAU)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-white block mb-1">Motor de IA</span>
              <span className="text-emerald-400">Gemini 1.5 Flash Free + Modo Heurístico S/ 0</span>
            </div>

            <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-white block mb-1">Sincronización CRM</span>
              <span className="text-emerald-400">Google Sheets API / Export CSV (Gratuito)</span>
            </div>
          </div>
        </div>

        {/* ANÁLISIS DE LICENCIA Y CONDICIONES DE VERCEL HOBBY (SECCIÓN 2 Y 15) */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Server className="w-5 h-5" />
            <span>Condiciones de Alojamiento: Vercel Hobby vs Uso Comercial</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Restricción de los Términos de Servicio de Vercel Hobby</span>
            </div>
            Los términos de Vercel especifican que el plan <strong>Hobby</strong> es exclusivamente para uso personal y no comercial. Si ORATORIA JANM ELITE utiliza esta aplicación como canal de ventas y cobro de matrículas directas, el plan Hobby podría no cumplir formalmente los términos comerciales.
          </div>

          <h3 className="font-bold text-xs text-white">Alternativas de Alojamiento Gratuitas y Compatibles con Presupuesto Cero:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <strong className="text-white block mb-1">1. Cloudflare Pages + Functions</strong>
              <p className="text-zinc-400 leading-relaxed">
                Permite despliegue de proyectos web comerciales con hasta 100,000 peticiones diarias gratis en su plan gratuito sin restricciones estrictas de monetización.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <strong className="text-white block mb-1">2. Docker Standalone en VPS / Render / Fly.io Free Tier</strong>
              <p className="text-zinc-400 leading-relaxed">
                Next.js exportado en contenedor Docker independiente, ejecutable en cualquier infraestructura propia o créditos gratuitos de la nube.
              </p>
            </div>
          </div>
        </div>

        {/* AUDITORÍA DE SEGURIDAD Y SECRETOS (SECCIÓN 6, 14 Y 17) */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lock className="w-5 h-5" />
            <span>Verificación de Protección de Secretos</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><code>.gitignore</code> configurado para bloquear <code>.env</code>, <code>.env*.local</code> y claves privadas.</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><code>SUPABASE_SERVICE_ROLE_KEY</code> jamás se envía al cliente web (exclusiva del backend).</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Row Level Security (RLS) activo y probado en todas las 8 tablas de Supabase.</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sanitización activa contra inyecciones de prompt y escape de etiquetas HTML.</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
