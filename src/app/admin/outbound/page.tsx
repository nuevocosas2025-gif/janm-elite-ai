'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService } from '@/services/crmService';
import { aiOutboundService, type OutboundContact } from '@/services/aiOutboundService';
import { googleSheetsService } from '@/services/googleSheets';
import {
  Send,
  MessageSquare,
  Sparkles,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Users,
  Filter,
  Check
} from 'lucide-react';

export default function OutboundAgentPage() {
  const [contacts, setContacts] = useState<OutboundContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Carga inicial de prospectos existentes para generar la campaña
  const loadLeadsForCampaign = async () => {
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

  useEffect(() => {
    loadLeadsForCampaign();
  }, []);

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

  const handleImportFromSheet = async () => {
    if (!sheetUrl) return;
    setIsImporting(true);
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
            courseInterest: r.course || 'Oratoria de Alto Impacto',
            lastStatus: 'Nuevo desde Hoja',
          }));
        const prepared = aiOutboundService.prepareCampaign(newContacts);
        setContacts(prepared);
        setToastMsg(`¡Se cargaron ${prepared.length} contactos desde Google Sheets con mensajes personalizados generados por IA!`);
      } else {
        alert('No se encontraron filas con teléfono en la hoja. Verifique que la hoja esté compartida como pública.');
      }
    } catch {
      alert('Error al leer la hoja de cálculo');
    } finally {
      setIsImporting(false);
      setTimeout(() => setToastMsg(null), 5000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Agente de Seguimiento y Mensajería Automática con IA
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Envía mensajes personalizados por WhatsApp a los contactos de tu Excel de Google Drive con un solo clic.
            </p>
          </div>

          <button
            onClick={loadLeadsForCampaign}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-janm-surface border border-janm-border hover:border-amber-400/40 text-xs font-semibold text-zinc-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Regenerar Mensajes con IA</span>
          </button>
        </div>

        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* BARRA DE IMPORTACIÓN DESDE HOJA DE EXCEL GOOGLE DRIVE */}
        <div className="p-5 rounded-2xl bg-janm-surface border border-janm-borderGold/40 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Cargar Clientes desde tu Hoja de Excel (Google Sheets)</span>
          </div>
          <p className="text-xs text-zinc-400">
            Pega aquí el enlace de tu archivo de Google Drive. El agente extraerá los nombres y teléfonos y redactará automáticamente el mensaje de seguimiento ideal para cada persona.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Pega la URL de tu hoja de Google Drive aquí..."
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              className="flex-1 bg-janm-dark border border-janm-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-janm-gold"
            />
            <button
              onClick={handleImportFromSheet}
              disabled={isImporting || !sheetUrl.trim()}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs rounded-xl hover:brightness-110 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-gold-sm"
            >
              {isImporting ? 'Analizando con IA...' : 'Generar Mensajes para la Hoja'}
            </button>
          </div>
        </div>

        {/* LISTADO DE CLIENTES CON MENSAJES PERSONALIZADOS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Contactos listos para seguimiento: <strong>{contacts.length}</strong></span>
            <span>Mensajes adaptados al curso y tono de Oratoria JANM Elite</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-zinc-500 bg-janm-surface rounded-2xl border border-janm-border">
              El agente está analizando la lista y redactando los mensajes personalizados...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 bg-janm-surface rounded-2xl border border-janm-border">
              No hay contactos pendientes de seguimiento. Puedes pegar la URL de tu hoja arriba.
            </div>
          ) : (
            contacts.map(c => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-janm-surface border border-janm-border hover:border-amber-400/40 transition-all flex flex-col lg:flex-row gap-5 justify-between"
              >
                {/* Datos del Cliente */}
                <div className="lg:w-1/3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
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
                      <strong>Curso de interés:</strong> <span className="text-amber-300">{c.courseInterest}</span>
                    </div>
                    <div className="text-zinc-400">
                      <strong>Estado comercial:</strong> <span className="text-zinc-300 font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800">{c.lastStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Mensaje Redactado por la IA */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Mensaje redactado por el Agente IA:
                    </span>
                    <button
                      onClick={() => handleCopyMessage(c.id, c.generatedMessage || '')}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === c.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar texto</span>
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

                {/* Botón de Envío Directo */}
                <div className="lg:w-48 flex flex-col justify-center gap-2 shrink-0">
                  <a
                    href={c.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar WhatsApp</span>
                  </a>
                  <span className="text-[10px] text-zinc-500 text-center">
                    Abre WhatsApp Web o Móvil con el mensaje ya escrito
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
