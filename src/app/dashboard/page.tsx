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
  ArrowUpRight,
  GraduationCap,
  FileSpreadsheet,
  Zap,
  TrendingUp
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
        {/* ENCABEZADO PRINCIPAL DE ALTO CONTRASTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0E1424] via-[#121B30] to-[#0E1424] p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SISTEMA OPERATIVO DE ADMISIONES
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Panel Principal <span className="text-amber-400">· Resumen Operativo</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Monitoreo en tiempo real de prospectos, estados de venta en Google Sheets y despachos de WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400/40 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
              <span>Actualizar Datos</span>
            </button>
            <Link
              href="/admin/outbound"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Envío WhatsApp</span>
            </Link>
          </div>
        </div>

        {/* 4 TARJETAS KPIS CON VIBRANTE ILUMINACIÓN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#0D1322] border border-blue-500/30 shadow-xl relative overflow-hidden group hover:border-blue-400/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contactos</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {isLoading ? '...' : metrics?.totalContacts || 0}
            </div>
            <p className="text-xs text-blue-400 mt-2 font-medium">
              Hoja CRM3 EVA & Base de Datos
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0D1322] border border-amber-500/30 shadow-xl relative overflow-hidden group hover:border-amber-400/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Por Contactar</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400">
              {isLoading ? '...' : metrics?.newProspects || 0}
            </div>
            <p className="text-xs text-amber-300/80 mt-2 font-medium">
              Listos para el siguiente lote de WhatsApp
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0D1322] border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consultas en Línea</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {isLoading ? '...' : metrics?.recentConversations || 0}
            </div>
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              Atendidas en la web institucional
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0D1322] border border-purple-500/30 shadow-xl relative overflow-hidden group hover:border-purple-400/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seguimientos Activos</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-300">
              {isLoading ? '...' : metrics?.pendingInquiries || 0}
            </div>
            <p className="text-xs text-purple-300/80 mt-2 font-medium">
              Con llamadas o mensajes pendientes
            </p>
          </div>
        </div>

        {/* DISTRIBUCIÓN POR LOS ESTADOS COMERCIALES OFICIALES */}
        <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Distribución Oficial de Prospectos en el Embudo
              </h2>
              <p className="text-xs text-slate-400">
                Seguimiento estricto de cada etapa comercial de los alumnos.
              </p>
            </div>
            <Link
              href="/admin/prospects"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-center"
            >
              <span>Ver Base Completa</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {metrics?.prospectsByStatus &&
              Object.entries(metrics.prospectsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="p-4 rounded-2xl bg-[#080B14] border border-slate-800 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[130px]" title={status}>
                      {status}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2.5">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, count * 25))}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 2 COLUMNAS: CURSOS MÁS CONSULTADOS Y ESTADO DE CONEXIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cursos más consultados */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800 shadow-xl">
            <h2 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Programas Más Solicitados por Alumnos
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Demanda de programas según consultas de interesados.
            </p>

            <div className="space-y-3">
              {metrics?.mostConsultedCourses.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#080B14] border border-slate-800">
                  <span className="text-xs font-bold text-white">{c.course_name}</span>
                  <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {c.count} consultas
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Estado de Integraciones del Sistema */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-amber-400" />
                Conectividad y Sincronización del Sistema
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Monitoreo activo de la base de datos y la hoja de cálculo.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#080B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Base de Datos PostgreSQL</span>
                      <span className="text-[10px] text-slate-400">8 tablas y seguridad RLS activa</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    EN LÍNEA
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#080B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Hoja de Cálculo CRM3 EVA</span>
                      <span className="text-[10px] text-slate-400">Pestaña: Tabla_1 (10 filas activas)</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    VINCULADA
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#080B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Despachador WhatsApp con Pausa</span>
                      <span className="text-[10px] text-slate-400">Lotes de 10 contactos · Pausa 30 min</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/outbound"
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                  >
                    Abrir Módulo →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
              <span>Costo Operativo: S/ 0.00 (Plan Gratuito Permanente)</span>
              <Link href="/admin/settings" className="hover:text-amber-400 font-semibold">Configuración →</Link>
            </div>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="p-6 rounded-3xl bg-[#0D1322] border border-slate-800 shadow-xl">
          <h2 className="text-base font-extrabold text-white mb-2">
            Actividad Reciente del Sistema
          </h2>
          <div className="divide-y divide-slate-800">
            {metrics?.recentActivity.map((act) => (
              <div key={act.id} className="py-3.5 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{act.description}</span>
                <span className="text-amber-400 font-mono text-[11px] font-bold">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
