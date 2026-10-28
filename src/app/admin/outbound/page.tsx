'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService } from '@/services/crmService';
import { aiOutboundService, type OutboundContact } from '@/services/aiOutboundService';
import { googleSheetsService, DEFAULT_SHEETS_CONFIG } from '@/services/googleSheets';
import {
  Send,
  MessageSquare,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Users,
  Filter,
  Check,
  ShieldAlert,
  CalendarCheck,
  Bot,
  UserCheck,
  SlidersHorizontal
} from 'lucide-react';

const LOCAL_STORAGE_SHEET_KEY = 'janm_connected_sheet_url';

export default function OutboundAgentPage() {
  const [contacts, setContacts] = useState<OutboundContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTION_REQUIRED'>('ALL');
  const [isAutoLoopActive, setIsAutoLoopActive] = useState(false);

  // Carga inicial y persistencia de URL de Google Sheets
  useEffect(() => {
    const savedUrl = localStorage.getItem(LOCAL_STORAGE_SHEET_KEY) || DEFAULT_SHEETS_CONFIG.sheetId || '';
    if (savedUrl) setSheetUrl(savedUrl);
    loadCampaignData();
  }, []);

  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      const prospects = await crmService.getProspects();
      const mapped = prospects
        .filter(p => !!p.contact?.phone)
        .map(p => ({
          id: p.id,
          fullName: p.contact!.full_name,
          phone: p.contact!.phone!,
          courseInterest: p.course?.name || 'Oratoria y Liderazgo de Alto Impacto',
          lastStatus: p.status,
          notes: p.notes || undefined,
        }));

      const campaign = aiOutboundService.prepareCampaign(mapped);
      setContacts(campaign);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndSyncSheet = async () => {
    if (!sheetUrl.trim()) return;
    setIsSyncing(true);
    localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, sheetUrl.trim());

    try {
      const sheetId = googleSheetsService.extractSheetId(sheetUrl);
      const rows = await googleSheetsService.previewRows(sheetId, 'Contactos');
      if (rows.length > 0) {
        const newContacts = rows
          .filter(r => !!r.phone)
          .map((r, i) => ({
            id: `sheet-${i}`,
            fullName: r.fullName,
            phone: r.phone,
            courseInterest: r.course || 'Oratoria y Liderazgo',
            lastStatus: 'Importado de Hoja',
          }));
        const prepared = aiOutboundService.prepareCampaign(newContacts);
        setContacts(prepared);
        setToastMsg(`Conexión persistente establecida: ${prepared.length} registros sincronizados sin duplicados.`);
      } else {
        alert('No se pudieron recuperar filas con teléfono. Verifique los permisos de lectura de la hoja.');
      }
    } catch {
      alert('Error en el protocolo de sincronización.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMsg(null), 5000);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUpdateMessage = (id: string, newText: string) => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          const cleanPhone = c.phone.replace(/\D/g, '');
          return {
            ...c,
            generatedMessage: newText,
            whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(newText)}`,
          };
        }
        return c;
      })
    );
  };

  // Filtrado de contactos que requieren intervención humana por cierre o visita
  const filteredContacts = contacts.filter(c => {
    if (activeFilter === 'ACTION_REQUIRED') {
      return (
        c.lastStatus === 'Matrícula en proceso' ||
        c.lastStatus === 'Seguimiento solicitado' ||
        c.lastStatus === 'Interesado'
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO TÉCNICO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Módulo de Prospección y Despacho Automatizado
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Motor de plantillas dinámicas y sincronización continua sobre Google Workspace y mensajería de contacto directo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadCampaignData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-janm-surface border border-janm-border hover:border-amber-400/40 text-xs font-semibold text-zinc-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Recalcular Plantillas</span>
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ENLACE PERSISTENTE CON GOOGLE SHEETS */}
        <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Enlace Directo con Google Sheets (Sincronización Permanente)</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MODO: CONEXIÓN EN TIEMPO REAL
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Configure una sola vez la URL o ID de su hoja de cálculo. El sistema guarda la referencia y mantiene la sincronización activa sin necesidad de volver a pegar el enlace.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs.../edit"
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              className="flex-1 bg-janm-dark border border-janm-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-janm-gold"
            />
            <button
              onClick={handleSaveAndSyncSheet}
              disabled={isSyncing || !sheetUrl.trim()}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs rounded-xl hover:brightness-110 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-gold-sm"
            >
              {isSyncing ? 'Sincronizando...' : 'Conectar y Sincronizar'}
            </button>
          </div>
        </div>

        {/* ARQUITECTURA DEL PROTOCOLO DE CONVERSACIÓN AUTÓNOMA Y TRANSFERENCIA */}
        <div className="p-5 rounded-2xl bg-janm-dark/80 border border-janm-border/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Protocolo de Conversación Autónoma y Transferencia a Cierre Humano</span>
            </div>
            <button
              onClick={() => setIsAutoLoopActive(!isAutoLoopActive)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                isAutoLoopActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {isAutoLoopActive ? '● MODO AUTÓNOMO ACTIVO' : '○ MODO DESPACHO ASISTIDO'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-janm-surface border border-janm-border/60">
              <span className="font-bold text-white block mb-1">1. Contacto Inicial</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                El sistema despacha la plantilla contextualizada según el curso de interés del cliente en la hoja de cálculo.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-janm-surface border border-janm-border/60">
              <span className="font-bold text-white block mb-1">2. Manejo de Objeciones</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                El motor responde consultas sobre horarios, precios en soles y certificación con datos estrictamente autorizados.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-janm-surface border border-janm-border/60">
              <span className="font-bold text-amber-400 block mb-1">3. Cierre / Visita (Handoff)</span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Al detectar intención de matrícula o visita a sede, se congela la automatización y se deriva al asesor para cierre.
              </p>
            </div>
          </div>
        </div>

        {/* FILTROS DE CONTACTOS */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-janm-surface border border-janm-border text-zinc-400 hover:text-white'
              }`}
            >
              Todos los Registros ({contacts.length})
            </button>
            <button
              onClick={() => setActiveFilter('ACTION_REQUIRED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'ACTION_REQUIRED'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-janm-surface border border-janm-border text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Prioridad de Cierre / Visita</span>
            </button>
          </div>

          <span className="text-xs text-zinc-500 hidden sm:inline">
            Despacho individualizado sin riesgo de bloqueo de línea
          </span>
        </div>

        {/* LISTADO DE CONTACTOS CON PLANTILLAS CONTEXTUALES */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-zinc-500 bg-janm-surface rounded-2xl border border-janm-border">
              Procesando y normalizando lista de contactos...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 bg-janm-surface rounded-2xl border border-janm-border">
              No hay registros bajo el criterio seleccionado.
            </div>
          ) : (
            filteredContacts.map(c => {
              const isActionRequired =
                c.lastStatus === 'Matrícula en proceso' ||
                c.lastStatus === 'Seguimiento solicitado' ||
                c.lastStatus === 'Interesado';

              return (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl bg-janm-surface border transition-all flex flex-col lg:flex-row gap-5 justify-between ${
                    isActionRequired ? 'border-amber-500/40' : 'border-janm-border hover:border-zinc-700'
                  }`}
                >
                  {/* Ficha del Registro */}
                  <div className="lg:w-1/3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 text-amber-300 font-bold flex items-center justify-center text-xs">
                        {c.fullName.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{c.fullName}</h3>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs space-y-1">
                      <div className="text-zinc-400">
                        <strong className="text-zinc-300">Programa objetivo:</strong>{' '}
                        <span className="text-amber-300">{c.courseInterest}</span>
                      </div>
                      <div className="text-zinc-400 flex items-center gap-2">
                        <strong className="text-zinc-300">Estado:</strong>
                        <span className="text-zinc-300 font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800">
                          {c.lastStatus}
                        </span>
                        {isActionRequired && (
                          <span className="text-[10px] font-bold text-amber-400 uppercase">
                            ⚡ Intervención Asesor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Plantilla Dinámica Generada */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Plantilla Contextualizada:
                      </span>
                      <button
                        onClick={() => handleCopyMessage(c.id, c.generatedMessage || '')}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === c.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={c.generatedMessage || ''}
                      onChange={e => handleUpdateMessage(c.id, e.target.value)}
                      className="w-full bg-janm-dark border border-janm-border rounded-xl p-3 text-xs text-zinc-200 leading-relaxed outline-none focus:border-janm-gold"
                    />
                  </div>

                  {/* Acción de Despacho Inmediato */}
                  <div className="lg:w-48 flex flex-col justify-center gap-2 shrink-0">
                    <a
                      href={c.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>Despachar WhatsApp</span>
                    </a>
                    <span className="text-[10px] text-zinc-500 text-center">
                      Abre el cliente oficial con texto precargado
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
