'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { aiOutboundService, type EvaSheetContact } from '@/services/aiOutboundService';
import { googleSheetsService } from '@/services/googleSheets';
import {
  Send,
  Zap,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Layers,
  ChevronRight,
  User,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

// Contactos exactos extraídos directamente de la hoja CRM3 EVA de Elva Rinza
const INITIAL_EVA_SHEET_ROWS: EvaSheetContact[] = [
  {
    id: 'row-1',
    codigo: 'P - 2',
    nombres: 'Contacto General 1',
    responsable: 'EVA RINZA',
    numero: '+51938368153',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Sin respuesta a llamadas previas',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-2',
    codigo: 'P - 2',
    nombres: 'Contacto General 2',
    responsable: 'EVA RINZA',
    numero: '+51970035008',
    estadoVenta: 'PERDIDO',
    descripcion: 'Descartó por horario en ciclo anterior',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-3',
    codigo: 'P - 2',
    nombres: 'MELISSA',
    responsable: 'EVA RINZA',
    numero: '+51953711857',
    estadoVenta: 'PERDIDO',
    descripcion: 'Preguntó por curso de oratoria presencial',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-4',
    codigo: 'P - 2',
    nombres: 'KAROL',
    responsable: 'EVA RINZA',
    numero: '+51930254798',
    estadoVenta: 'PERDIDO',
    descripcion: 'Interesada en vencer miedo escénico',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-5',
    codigo: 'P - 2',
    nombres: 'NILTON JIMENES ALBERCA',
    responsable: 'EVA RINZA',
    numero: '+51976019090',
    estadoVenta: 'CERRADO',
    descripcion: 'Matrícula confirmada en tesorería',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-6',
    codigo: 'P - 2',
    nombres: 'Contacto General 6',
    responsable: 'EVA RINZA',
    numero: '+51995113030',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Visto en WhatsApp',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-7',
    codigo: 'P - 2',
    nombres: 'YANE',
    responsable: 'EVA RINZA',
    numero: '+51980393233',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Pidió información de costos y horarios',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-8',
    codigo: 'P - 2',
    nombres: 'Contacto General 8',
    responsable: 'EVA RINZA',
    numero: '+51925190501',
    estadoVenta: 'PERDIDO',
    descripcion: 'Pospuso para siguiente mes',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-9',
    codigo: 'P - 2',
    nombres: 'Contacto General 9',
    responsable: 'EVA RINZA',
    numero: '+51935941463',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Llamada no contestada',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-10',
    codigo: 'P - 2',
    nombres: 'CRISTIAN',
    responsable: 'EVA RINZA',
    numero: '+51949788452',
    estadoVenta: 'PERDIDO',
    descripcion: 'Interesado en oratoria ejecutiva',
    estadoDespacho: 'PENDIENTE',
  },
];

export default function OutboundAutomatedPage() {
  const [contacts, setContacts] = useState<EvaSheetContact[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchSize] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AUTOMATIZACIÓN DE DESPACHO EN COLA
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [autoSendIndex, setAutoSendIndex] = useState<number | null>(null);

  // TEMPORIZADOR DE SEGURIDAD (30 MINUTOS)
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    // Inicializar contactos con mensajes generados según su estado de venta real
    const prepared = aiOutboundService.prepareEvaCampaign(INITIAL_EVA_SHEET_ROWS);
    setContacts(prepared);
  }, []);

  // Reloj de enfriamiento
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCooldownActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isCooldownActive) {
      setIsCooldownActive(false);
      setToastMsg('⏰ ¡Pausa de 30 minutos cumplida! El siguiente lote está desbloqueado.');
    }
    return () => clearInterval(interval);
  }, [isCooldownActive, secondsRemaining]);

  // Motor de despacho automático en ráfaga controlada (Auto-Runner)
  useEffect(() => {
    if (!isAutoSending || autoSendIndex === null) return;

    const currentBatch = contacts.slice(currentBatchIndex * batchSize, (currentBatchIndex + 1) * batchSize);

    if (autoSendIndex >= currentBatch.length) {
      // Finalizó el lote completo de 10 contactos
      setIsAutoSending(false);
      setAutoSendIndex(null);
      setIsCooldownActive(true);
      setSecondsRemaining(30 * 60); // 30 minutos
      setToastMsg('✅ ¡Lote de 10 contactos despachado exitosamente! Pausa de 30 minutos activada.');
      return;
    }

    const currentContact = currentBatch[autoSendIndex];
    // Marcar como despachado en el estado
    setContacts(prev =>
      prev.map(c => (c.id === currentContact.id ? { ...c, estadoDespacho: 'DESPACHADO' } : c))
    );

    // Abrir la ventana de WhatsApp Web para el contacto actual
    if (currentContact.whatsappUrl) {
      window.open(currentContact.whatsappUrl, '_blank');
    }

    // Intervalo de 3.5 segundos entre cada contacto para no bloquear el navegador
    const timeout = setTimeout(() => {
      setAutoSendIndex(prev => (prev !== null ? prev + 1 : null));
    }, 3500);

    return () => clearTimeout(timeout);
  }, [isAutoSending, autoSendIndex, contacts, currentBatchIndex, batchSize]);

  const handleStartAutoBatch = () => {
    setIsAutoSending(true);
    setAutoSendIndex(0);
    setToastMsg('⚡ Despacho automático iniciado: abriendo chats secuencialmente cada 3.5 segundos...');
  };

  const handlePauseAutoBatch = () => {
    setIsAutoSending(false);
    setAutoSendIndex(null);
    setToastMsg('⏸️ Despacho automático pausado.');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalBatches = Math.ceil(contacts.length / batchSize);
  const currentBatch = contacts.slice(currentBatchIndex * batchSize, (currentBatchIndex + 1) * batchSize);
  const sentCountInBatch = currentBatch.filter(c => c.estadoDespacho === 'DESPACHADO').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO Y TÍTULO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Despacho Automatizado de Mensajería: Hoja <code>CRM3 EVA</code>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Visualización directa de las columnas oficiales: Nombres, Responsable, Número y Estado de Venta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-janm-surface border border-janm-border text-xs text-zinc-300 font-mono">
              Responsable: <strong className="text-amber-400">EVA RINZA</strong>
            </span>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* PANEL PRINCIPAL DE CONTROL DE AUTOMATIZACIÓN (UN SOLO CLIC PARA LOS 10) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-janm-surface via-zinc-900 to-janm-surface border border-janm-borderGold/50 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold">
                  LOTE {currentBatchIndex + 1} DE {totalBatches}
                </span>
                <h2 className="text-base font-bold text-white">
                  Despacho en Ráfaga: 10 Contactos
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Progreso del lote actual: <strong>{sentCountInBatch} de 10 contactos despachados</strong>.
              </p>
            </div>

            {/* BOTÓN MAESTRO DE ENVÍO AUTOMÁTICO */}
            <div className="flex items-center gap-3">
              {!isAutoSending ? (
                <button
                  onClick={handleStartAutoBatch}
                  disabled={isCooldownActive}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>INICIAR DESPACHO AUTOMÁTICO DEL LOTE</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseAutoBatch}
                  className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>PAUSAR DESPACHO ({autoSendIndex! + 1}/10)</span>
                </button>
              )}

              {/* RELOJ DE PAUSA DE SEGURIDAD */}
              <div className="p-2.5 bg-janm-dark rounded-xl border border-janm-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-zinc-500 block leading-none">PAUSA 30 MIN</span>
                  <span className="text-xs font-bold text-white">
                    {isCooldownActive ? formatTimer(secondsRemaining) : '00:00 (Inactivo)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO DEL LOTE */}
          <div className="w-full bg-janm-dark h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(sentCountInBatch / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* TABLA OFICIAL CON LAS CABECERAS EXACTAS DE LA HOJA DE GOOGLE SHEETS */}
        <div className="rounded-2xl bg-janm-surface border border-janm-border overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-janm-border bg-janm-dark/60 flex justify-between items-center">
            <span className="font-bold text-xs text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              CABECERAS IDENTIFICADAS DE LA HOJA: <code>CRM3 EVA</code> (Pestaña: <code>Tabla_1</code>)
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Lote activo: Filas 1 a 10
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-janm-border/60 bg-emerald-950/20 text-emerald-300 font-mono">
                  <th className="py-3 px-3 font-bold">PB/L</th>
                  <th className="py-3 px-4 font-bold">NOMBRES</th>
                  <th className="py-3 px-3 font-bold">RESPONSABLE</th>
                  <th className="py-3 px-3 font-bold">NUMERO</th>
                  <th className="py-3 px-3 font-bold">ESTADO DE VENTA</th>
                  <th className="py-3 px-4 font-bold">ESTRATEGIA DEL MENSAJE (AUTÓNOMO)</th>
                  <th className="py-3 px-3 font-bold text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-janm-border/40">
                {currentBatch.map((c, index) => {
                  const isSent = c.estadoDespacho === 'DESPACHADO';
                  const isCurrentTarget = isAutoSending && autoSendIndex === index;

                  return (
                    <tr
                      key={c.id}
                      className={`transition-colors ${
                        isCurrentTarget
                          ? 'bg-amber-500/15 border-l-4 border-amber-400'
                          : isSent
                          ? 'bg-emerald-950/15'
                          : 'hover:bg-janm-surfaceLight/50'
                      }`}
                    >
                      {/* PB/L */}
                      <td className="py-3.5 px-3 font-mono text-zinc-400 text-[11px]">
                        {c.codigo}
                      </td>

                      {/* NOMBRES */}
                      <td className="py-3.5 px-4 font-bold text-white text-xs">
                        {c.nombres}
                      </td>

                      {/* RESPONSABLE */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {c.responsable}
                        </span>
                      </td>

                      {/* NUMERO */}
                      <td className="py-3.5 px-3 font-mono text-emerald-400 text-xs">
                        {c.numero}
                      </td>

                      {/* ESTADO DE VENTA (Con los colores exactos de su Excel) */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            c.estadoVenta === 'CERRADO'
                              ? 'bg-emerald-500 text-black font-extrabold'
                              : c.estadoVenta === 'PERDIDO'
                              ? 'bg-red-700 text-white'
                              : 'bg-purple-900/60 text-purple-200 border border-purple-500/30'
                          }`}
                        >
                          {c.estadoVenta}
                        </span>
                      </td>

                      {/* MENSAJE GENERADO AUTOMÁTICO */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-md">
                          <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                            {c.mensajeGenerado}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.mensajeGenerado || '');
                              setCopiedId(c.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="text-[10px] text-amber-400 hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === c.id ? '✓ Copiado al portapapeles' : 'Ver y copiar mensaje'}
                          </button>
                        </div>
                      </td>

                      {/* ESTADO / ACCIÓN MANUAL O AUTOMÁTICA */}
                      <td className="py-3.5 px-3 text-right">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Enviado
                          </span>
                        ) : (
                          <a
                            href={c.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setContacts(prev =>
                                prev.map(item => (item.id === c.id ? { ...item, estadoDespacho: 'DESPACHADO' } : item))
                              );
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Enviar</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVEGACIÓN Y SIGUIENTE LOTE */}
        <div className="p-4 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Lote actual: 10 contactos ({sentCountInBatch} enviados). Pausa automática de 30 minutos al completar.
          </span>
          <button
            onClick={() => {
              if (currentBatchIndex < totalBatches - 1) {
                setCurrentBatchIndex(prev => prev + 1);
                setIsCooldownActive(true);
                setSecondsRemaining(30 * 60);
              } else {
                alert('¡Has completado todos los registros!');
              }
            }}
            disabled={currentBatchIndex >= totalBatches - 1}
            className="px-5 py-2 rounded-xl bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:text-white text-xs font-semibold disabled:opacity-40"
          >
            Avanzar al Lote Siguiente ({currentBatchIndex + 2} de {totalBatches})
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
