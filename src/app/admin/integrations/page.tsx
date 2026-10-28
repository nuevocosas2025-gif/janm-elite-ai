'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { googleSheetsService, DEFAULT_SHEETS_CONFIG } from '@/services/googleSheets';
import type { SheetRowPreview, SyncReport } from '@/types';
import { 
  FileSpreadsheet, 
  Link2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function IntegrationsAdminPage() {
  const [sheetInput, setSheetInput] = useState(DEFAULT_SHEETS_CONFIG.sheetId);
  const [tabName, setTabName] = useState(DEFAULT_SHEETS_CONFIG.tabName);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    tested: boolean;
    connected: boolean;
    headers: string[];
    rowCount: number;
    error?: string;
  } | null>(null);

  const [previews, setPreviews] = useState<SheetRowPreview[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionResult(null);
    const id = googleSheetsService.extractSheetId(sheetInput);

    try {
      const res = await googleSheetsService.testConnection(id, tabName);
      setConnectionResult({ tested: true, ...res });
    } finally {
      setIsTesting(false);
    }
  };

  const handleLoadPreview = async () => {
    setIsLoadingPreview(true);
    const id = googleSheetsService.extractSheetId(sheetInput);
    try {
      const rows = await googleSheetsService.previewRows(id, tabName);
      setPreviews(rows);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    const id = googleSheetsService.extractSheetId(sheetInput);
    try {
      const report = await googleSheetsService.executeSync(id, tabName);
      setSyncReport(report);
      // Actualizar vista previa
      handleLoadPreview();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Integraciones Externas y Google Sheets
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sincronización controlada con detección de cabeceras, normalización de WhatsApp y prevención de duplicados.
          </p>
        </div>

        {/* TARJETAS DE ESTADO DE TODAS LAS INTEGRACIONES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Supabase PostgreSQL</h4>
                <p className="text-[11px] text-emerald-400">RLS Activo & Conectado</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Motor IA (AIProvider)</h4>
                <p className="text-[11px] text-amber-300">Modo Heurístico / Gemini</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          </div>

          <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Google Sheets CRM</h4>
                <p className="text-[11px] text-zinc-400">
                  {connectionResult?.connected ? 'Vinculado' : 'Configurable'}
                </p>
              </div>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${connectionResult?.connected ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
          </div>
        </div>

        {/* PANEL DE CONFIGURACIÓN DE GOOGLE SHEETS */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-border space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-janm-gold" />
            Configuración de la Hoja de Contactos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                URL o ID de la Hoja de Google Sheets
              </label>
              <input
                type="text"
                value={sheetInput}
                onChange={e => setSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit o solo el ID"
                className="w-full bg-janm-dark border border-janm-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-janm-gold"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Sugerencia: Puedes pegar la URL completa compartida de Google Drive.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nombre de la Pestaña / Hoja
              </label>
              <input
                type="text"
                value={tabName}
                onChange={e => setTabName(e.target.value)}
                placeholder="Contactos o CRM"
                className="w-full bg-janm-dark border border-janm-border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-janm-gold"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !sheetInput.trim()}
              className="px-4 py-2 rounded-xl bg-janm-surfaceLight border border-janm-border text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-amber-400' : ''}`} />
              <span>Probar Conexión y Leer Cabeceras</span>
            </button>

            <button
              onClick={handleLoadPreview}
              disabled={isLoadingPreview || !sheetInput.trim()}
              className="px-4 py-2 rounded-xl bg-janm-surfaceLight border border-janm-border text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>Previsualizar Filas y Duplicados</span>
            </button>

            <button
              onClick={handleRunSync}
              disabled={isSyncing || !sheetInput.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold hover:brightness-110 shadow-gold-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSyncing ? 'Sincronizando...' : 'Ejecutar Sincronización Segura'}
            </button>
          </div>

          {/* RESULTADO DE LA PRUEBA DE CONEXIÓN */}
          {connectionResult && (
            <div className={`p-4 rounded-xl border text-xs ${
              connectionResult.connected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}>
              {connectionResult.connected ? (
                <div>
                  <div className="font-bold flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Conexión exitosa con Google Sheets ({connectionResult.rowCount} filas de datos encontradas)
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Cabeceras detectadas automáticamente:{' '}
                    <span className="text-zinc-200 font-mono">
                      {connectionResult.headers.join(', ') || 'Ninguna cabecera'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">No se pudo leer la hoja:</span>
                    <span>{connectionResult.error}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INFORME DE SINCRONIZACIÓN */}
          {syncReport && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Informe de Sincronización Completada
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-3">
                <div className="p-2 rounded bg-janm-dark/60">
                  <span className="text-lg font-bold text-white block">{syncReport.totalScanned}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Analizadas</span>
                </div>
                <div className="p-2 rounded bg-janm-dark/60">
                  <span className="text-lg font-bold text-emerald-400 block">{syncReport.imported}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Nuevas Importadas</span>
                </div>
                <div className="p-2 rounded bg-janm-dark/60">
                  <span className="text-lg font-bold text-blue-400 block">{syncReport.skippedDuplicates}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Duplicados Omitidos</span>
                </div>
                <div className="p-2 rounded bg-janm-dark/60">
                  <span className="text-lg font-bold text-red-400 block">{syncReport.errors.length}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Errores</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TABLA DE VISTA PREVIA CON DETECCIÓN DE DUPLICADOS */}
        {previews.length > 0 && (
          <div className="rounded-2xl bg-janm-surface border border-janm-border overflow-hidden">
            <div className="p-4 border-b border-janm-border bg-janm-dark/50 flex justify-between items-center">
              <h3 className="font-bold text-xs text-white">
                Vista Previa de Filas a Sincronizar ({previews.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                Regla: No sobrescribe destructivamente la hoja de origen
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-janm-border/60 bg-janm-dark/30 text-zinc-400">
                    <th className="py-2.5 px-4 font-semibold">Fila</th>
                    <th className="py-2.5 px-4 font-semibold">Nombre</th>
                    <th className="py-2.5 px-4 font-semibold">Teléfono Normalizado</th>
                    <th className="py-2.5 px-4 font-semibold">Correo</th>
                    <th className="py-2.5 px-4 font-semibold">Curso Indicado</th>
                    <th className="py-2.5 px-4 font-semibold">Estado de Coincidencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-janm-border/40">
                  {previews.map(row => (
                    <tr key={row.rowIndex} className="hover:bg-janm-surfaceLight/50">
                      <td className="py-2.5 px-4 font-mono text-zinc-500">#{row.rowIndex}</td>
                      <td className="py-2.5 px-4 font-semibold text-white">{row.fullName}</td>
                      <td className="py-2.5 px-4 font-mono text-emerald-400">{row.phone || '—'}</td>
                      <td className="py-2.5 px-4 text-zinc-400">{row.email || '—'}</td>
                      <td className="py-2.5 px-4 text-amber-300">{row.course}</td>
                      <td className="py-2.5 px-4">
                        {row.isDuplicate ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Duplicado ({row.matchReason})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Nuevo Prospecto
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
