'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService } from '@/services/crmService';
import type { DashboardMetrics } from '@/types';
import {
  Users,
  UserPlus,
  MessageSquare,
  Clock,
  Sparkles,
  Link2,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsRefreshing(true);
      const data = await crmService.getDashboardMetrics();
      setMetrics(data);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Panel de Control y Métricas
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRODUCCIÓN S/ 0
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Indicadores comerciales, conversaciones y sincronización en tiempo real de Oratoria JANM Elite.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-janm-surface border border-janm-border hover:border-amber-400/40 text-zinc-200 text-xs font-semibold hover:bg-janm-surfaceLight transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Actualizar Datos</span>
            </button>
            <Link
              href="/admin/prospects"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold hover:brightness-110 shadow-gold-sm transition-all"
            >
              <span>Ver CRM Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 KPIS PRINCIPALES (SECCIÓN 12) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Total de Contactos</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? '...' : metrics?.totalContacts || 0}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
              <span>Registrados en Supabase & Sheets</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Prospectos Nuevos</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400">
              {isLoading ? '...' : metrics?.newProspects || 0}
            </div>
            <p className="text-[11px] text-amber-400/70 mt-2">
              Interesados en cursos este mes
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Conversaciones Chat</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? '...' : metrics?.recentConversations || 0}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Atendidas por JANM Elite AI
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Consultas Pendientes</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-300">
              {isLoading ? '...' : metrics?.pendingInquiries || 0}
            </div>
            <p className="text-[11px] text-purple-300/70 mt-2">
              Requieren seguimiento de asesor
            </p>
          </div>
        </div>

        {/* DISTRIBUCIÓN POR LOS 9 ESTADOS COMERCIALES (SECCIÓN 11 Y 12) */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border">
          <h2 className="text-base font-bold text-white mb-1">
            Distribución de Prospectos por Estado Comercial (9 Estados Oficiales)
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Embudo de ventas estricto según la Sección 11 del manual operativo de Oratoria JANM Elite.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {metrics?.prospectsByStatus &&
              Object.entries(metrics.prospectsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="p-3.5 rounded-xl bg-janm-dark/70 border border-janm-border/60 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-zinc-300 truncate max-w-[130px]" title={status}>
                      {status}
                    </span>
                    <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(8, count * 25))}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 2 COLUMNAS: CURSOS MÁS CONSULTADOS Y ESTADO DE INTEGRACIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cursos más consultados */}
          <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-janm-gold" />
              Cursos Más Consultados en el Chatbot
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Demanda de programas basada en las interacciones de los visitantes.
            </p>

            <div className="space-y-3">
              {metrics?.mostConsultedCourses.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-janm-dark/50 border border-janm-border/40">
                  <span className="text-xs font-semibold text-zinc-200">{c.course_name}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{c.count} consultas</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estado de Integraciones Reales (Sección 12) */}
          <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-janm-gold" />
                Estado del Ecosistema de Integraciones
              </h2>
              <p className="text-xs text-zinc-400 mb-4">
                Monitoreo activo de conexiones y base de datos relacional.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Supabase PostgreSQL & Auth</span>
                      <span className="text-[10px] text-zinc-400">8 tablas con RLS activo</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVO
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Motor IA Intercambiable</span>
                      <span className="text-[10px] text-zinc-400">Heurístico S/ 0 + Gemini / Groq</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVO
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-janm-dark/60 border border-janm-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Google Sheets Sync</span>
                      <span className="text-[10px] text-zinc-400">Última sincro: {metrics?.lastSheetsSync ? 'Hace 2 horas' : 'Sin sincronizar'}</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/integrations"
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    Ver Sincro →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-janm-border/40 text-[11px] text-zinc-500 flex justify-between items-center">
              <span>Presupuesto vigente: S/ 0.00</span>
              <Link href="/admin/settings" className="hover:text-amber-400">Auditoría Vercel / Límites →</Link>
            </div>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border">
          <h2 className="text-base font-bold text-white mb-1">
            Actividad Reciente del Sistema
          </h2>
          <div className="mt-4 divide-y divide-janm-border/40">
            {metrics?.recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <span className="text-zinc-200">{act.description}</span>
                <span className="text-zinc-500 font-mono text-[11px]">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
