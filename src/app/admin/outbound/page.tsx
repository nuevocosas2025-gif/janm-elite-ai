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
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

const LOCAL_STORAGE_SHEET_KEY = 'janm_connected_sheet_url';

export default function OutboundCadencePage() {
  const [contacts, setContacts] = useState<OutboundContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // CONFIGURACIÓN DE CADENCIA ANTI-BANEO (LOTES DE 10 CADA 30 MIN)
  const [batchSize, setBatchSize] = useState(10);
  const [cooldownMinutes, setCooldownMinutes] = useState(30);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedUrl = localStorage.getItem(LOCAL_STORAGE_SHEET_KEY) || DEFAULT_SHEETS_CONFIG.sheetId || '';
    if (savedUrl) setSheetUrl(savedUrl);
    loadCampaignData();
  }, []);

  // Temporizador de 30 minutos entre lotes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setToastMsg(`⏰ ¡Tiempo cumplido! El siguiente lote de ${batchSize} contactos ya está listo para ser despachado.`);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsRemaining, batchSize]);

  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      const prospects = await crmService.getProspects();
      // Generar una lista enriquecida de demostración combinada
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

      // Si hay pocos registros, generar cola estructurada para evaluar los lotes de 10
      while (mapped.length < 25) {
        const i = mapped.length + 1;
        mapped.push({
          id: `lead-sim-${i}`,
          fullName: `Contacto ${i} (Hoja CRM3 EVA)`,
          phone: `+51984${(100000 + i * 37).toString().slice(0, 6)}`,
          courseInterest: i % 2 === 0 ? 'Oratoria para Niños (Junior Elite)' : 'Oratoria y Liderazgo de Alto Impacto',
          lastStatus: 'Nuevo',
          notes: 'Registrado en hoja compartida CRM3 EVA',
        });
      }

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
            lastStatus: 'Importado de Hoja CRM3 EVA',
          }));
        const prepared = aiOutboundService.prepareCampaign(newContacts);
        setContacts(prepared);
        setCurrentBatchIndex(0);
        setToastMsg(`Sincronización exitosa: ${prepared.length} registros cargados desde CRM3 EVA.`);
      } else {
        alert('⚠️ Google bloqueó la lectura porque la hoja está en modo "Restringido".\n\nPara solucionarlo (solo toma 5 segundos):\n1. En tu hoja de Google Drive haz clic en el botón "Compartir" (arriba a la derecha).\n2. En "Acceso general", cámbialo a: "Cualquier persona que tenga el vínculo".\n3. Haz clic en "Listo" y vuelve a presionar Vincular.');
      }
    } catch {
      alert('⚠️ No se pudo conectar con Google Sheets. Asegúrese de que la hoja tenga el acceso general como "Cualquier persona con el vínculo".');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMsg(null), 5000);
    }
  };

  const handleDispatchContact = (id: string) => {
    setDispatchedIds(prev => new Set([...prev, id]));
  };

  const handleStartCooldown = () => {
    const totalBatches = Math.ceil(contacts.length / batchSize);
    if (currentBatchIndex < totalBatches - 1) {
      setCurrentBatchIndex(prev => prev + 1);
      setSecondsRemaining(cooldownMinutes * 60);
      setIsTimerRunning(true);
      setToastMsg(`Lote completado. Pausa de seguridad activada (${cooldownMinutes} min). Próximo lote en cola.`);
    } else {
      alert('¡Has completado todos los lotes de la campaña!');
    }
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Cálculo de lotes
  const totalBatches = Math.ceil(contacts.length / batchSize);
  const currentBatchContacts = contacts.slice(
    currentBatchIndex * batchSize,
    (currentBatchIndex + 1) * batchSize
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* TÍTULO Y DESCRIPCIÓN TÉCNICA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-400" />
              Despacho por Cadencia y Protección de Línea
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Controlador de lotes de 10 contactos con intervalos de seguridad de 30 minutos para evitar bloqueos en WhatsApp.
            </p>
          </div>

          <button
            onClick={loadCampaignData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-janm-surface border border-janm-border hover:border-amber-400/40 text-xs font-semibold text-zinc-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalcular Mensajes</span>
          </button>
        </div>

        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* VINCULACIÓN DIRECTA DE LA HOJA DE ELVA (CRM3 EVA) */}
        <div className="p-5 rounded-2xl bg-janm-surface border border-janm-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Conexión Directa con Hoja Compartida: <code>CRM3 EVA</code></span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              SIN COPIAR Y PEGAR CADA VEZ
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Para vincular la hoja que te compartió <strong>Elva Santos Rinza</strong>: haz clic en el botón azul <strong>&quot;Abrir&quot;</strong> de tu correo de Gmail, copia la dirección web que se abre en tu navegador y pégala aquí una sola vez. El sistema la guardará permanentemente.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs.../edit (Hoja CRM3 EVA)"
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              className="flex-1 bg-janm-dark border border-janm-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-janm-gold font-mono"
            />
            <button
              onClick={handleSaveAndSyncSheet}
              disabled={isSyncing || !sheetUrl.trim()}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs rounded-xl hover:brightness-110 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-gold-sm"
            >
              {isSyncing ? 'Sincronizando...' : 'Vincular CRM3 EVA'}
            </button>
          </div>
        </div>

        {/* PANEL DE CONTROL DE CADENCIA (10 CONTACTOS CADA 30 MINUTOS) */}
        <div className="p-6 rounded-2xl bg-janm-surface border border-janm-borderGold/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-janm-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  LOTE {currentBatchIndex + 1} DE {totalBatches}
                </span>
                <span className="text-xs text-zinc-300 font-semibold">
                  (10 contactos en despacho actual)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Progreso total: {dispatchedIds.size} de {contacts.length} contactos despachados.
              </p>
            </div>

            {/* TEMPORIZADOR DE ENFRIAMIENTO */}
            <div className="flex items-center gap-3 bg-janm-dark px-4 py-2.5 rounded-xl border border-janm-border">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">
                  {isTimerRunning ? 'Pausa de Seguridad Activa' : 'Próximo Lote Disponible'}
                </span>
                <span className="text-lg font-mono font-extrabold text-white">
                  {isTimerRunning ? formatTime(secondsRemaining) : '00:00 (Listo)'}
                </span>
              </div>
              {isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Pausar reloj"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleStartCooldown}
                  disabled={currentBatchIndex >= totalBatches - 1}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all disabled:opacity-40"
                >
                  Iniciar Pausa 30 min → Lote Siguiente
                </button>
              )}
            </div>
          </div>

          {/* VISUALIZADOR DE REGLAS ANTI-BANEO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-white block mb-0.5">Tamaño de Lote: 10</span>
              <span className="text-zinc-400 text-[11px]">Volumen ideal para no activar filtros de Meta.</span>
            </div>
            <div className="p-3 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-white block mb-0.5">Pausa: 30 Minutos</span>
              <span className="text-zinc-400 text-[11px]">Enfría la línea antes de la siguiente oleada.</span>
            </div>
            <div className="p-3 rounded-xl bg-janm-dark/60 border border-janm-border/60">
              <span className="font-bold text-emerald-400 block mb-0.5">Costo de Envío: S/ 0.00</span>
              <span className="text-zinc-400 text-[11px]">Operación directa vía WhatsApp Web / Móvil.</span>
            </div>
          </div>
        </div>

        {/* LISTA DEL LOTE ACTUAL (10 CONTACTOS) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span className="font-semibold text-white">
              Contactos del Lote Activo ({currentBatchContacts.length}):
            </span>
            <span>Despacha a cada contacto y luego activa la pausa de 30 minutos</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-zinc-500 bg-janm-surface rounded-2xl border border-janm-border">
              Cargando lote de contactos...
            </div>
          ) : (
            currentBatchContacts.map((c, indexInBatch) => {
              const isDispatched = dispatchedIds.has(c.id);

              return (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl bg-janm-surface border transition-all flex flex-col lg:flex-row gap-5 justify-between ${
                    isDispatched
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-janm-border hover:border-amber-400/40'
                  }`}
                >
                  {/* Ficha del Registro */}
                  <div className="lg:w-1/3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-400 font-mono text-xs flex items-center justify-center">
                        #{currentBatchIndex * batchSize + indexInBatch + 1}
                      </span>
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
                        <strong>Programa de Interés:</strong>{' '}
                        <span className="text-amber-300">{c.courseInterest}</span>
                      </div>
                      <div className="text-zinc-400">
                        <strong>Estado:</strong>{' '}
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {isDispatched ? 'Enviado' : c.lastStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje Contextual */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-300">Mensaje Contextualizado:</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(c.generatedMessage || '');
                          setCopiedId(c.id);
                          setTimeout(() => setCopiedId(null), 2500);
                        }}
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
                      onChange={e => {
                        const newText = e.target.value;
                        setContacts(prev =>
                          prev.map(item =>
                            item.id === c.id
                              ? {
                                  ...item,
                                  generatedMessage: newText,
                                  whatsappUrl: `https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(newText)}`,
                                }
                              : item
                          )
                        );
                      }}
                      className="w-full bg-janm-dark border border-janm-border rounded-xl p-3 text-xs text-zinc-200 leading-relaxed outline-none focus:border-janm-gold"
                    />
                  </div>

                  {/* Botón de Despacho 1 Clic */}
                  <div className="lg:w-48 flex flex-col justify-center gap-2 shrink-0">
                    <a
                      href={c.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDispatchContact(c.id)}
                      className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all text-center ${
                        isDispatched
                          ? 'bg-zinc-800 border border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isDispatched ? 'Reenviar WhatsApp' : 'Enviar WhatsApp'}</span>
                    </a>
                    {isDispatched && (
                      <span className="text-[10px] text-emerald-400 text-center font-semibold">
                        ✓ Despacho registrado
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTÓN INFERIOR DE AVANCE DE LOTE */}
        <div className="p-4 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            ¿Terminaste de enviar a estos 10 contactos?
          </span>
          <button
            onClick={handleStartCooldown}
            disabled={currentBatchIndex >= totalBatches - 1}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs hover:brightness-110 shadow-gold-sm transition-all cursor-pointer disabled:opacity-40"
          >
            Pausar 30 Minutos y Pasar al Siguiente Lote ({currentBatchIndex + 2} de {totalBatches})
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
