'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { aiOutboundService, type EvaSheetContact } from '@/services/aiOutboundService';
import {
  Send,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  Clock,
  Pause,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Edit2,
  Check,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

// Contactos oficiales extraídos fielmente de la hoja real CRM3 EVA (Elva Rinza, Tabla_1)
const INITIAL_EVA_SHEET_ROWS: EvaSheetContact[] = [
  {
    id: 'row-1',
    codigo: 'P - 2',
    nombres: 'Lead 938 368 153',
    responsable: 'EVA RINZA',
    numero: '+51938368153',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Sin respuesta a llamadas previas',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-2',
    codigo: 'P - 2',
    nombres: 'Lead 970 035 008',
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
    descripcion: 'Preguntó por curso presencial de sábados',
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
    nombres: 'Lead 995 113 030',
    responsable: 'EVA RINZA',
    numero: '+51995113030',
    estadoVenta: 'NO RESPONDE',
    descripcion: 'Visto en WhatsApp. Consulta por taller',
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
    nombres: 'Lead 925 190 501',
    responsable: 'EVA RINZA',
    numero: '+51925190501',
    estadoVenta: 'PERDIDO',
    descripcion: 'Pospuso para el próximo mes',
    estadoDespacho: 'PENDIENTE',
  },
  {
    id: 'row-9',
    codigo: 'P - 2',
    nombres: 'Lead 935 941 463',
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
    descripcion: 'Interesado en oratoria y liderazgo',
    estadoDespacho: 'PENDIENTE',
  },
];

export default function OutboundAutomatedPage() {
  const [contacts, setContacts] = useState<EvaSheetContact[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchSize] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Control de expansión de mensajes: individual o todos a la vez
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Edición rápida en línea del mensaje
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');

  // MOTOR DE DESPACHO AUTOMÁTICO EN COLA
  const [isAutoSending, setIsAutoSending] = useState(false);
  const [autoSendIndex, setAutoSendIndex] = useState<number | null>(null);

  // TEMPORIZADOR DE SEGURIDAD (30 MINUTOS)
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    // Generar mensajes atractivos sin asteriscos y con emojis vibrantes
    const prepared = aiOutboundService.prepareEvaCampaign(INITIAL_EVA_SHEET_ROWS);
    setContacts(prepared);
  }, []);

  // Reloj de cuenta regresiva
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCooldownActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isCooldownActive) {
      setIsCooldownActive(false);
      setToastMsg('⏰ ¡Pausa de seguridad de 30 minutos cumplida! El siguiente lote está listo.');
    }
    return () => clearInterval(interval);
  }, [isCooldownActive, secondsRemaining]);

  // Motor de automatización: Despacha automáticamente los 10 contactos
  useEffect(() => {
    if (!isAutoSending || autoSendIndex === null) return;

    const currentBatch = contacts.slice(currentBatchIndex * batchSize, (currentBatchIndex + 1) * batchSize);

    if (autoSendIndex >= currentBatch.length) {
      setIsAutoSending(false);
      setAutoSendIndex(null);
      setIsCooldownActive(true);
      setSecondsRemaining(30 * 60); // 30 minutos de seguridad
      setToastMsg('✅ ¡Lote de 10 contactos despachado en automático! Pausa de 30 minutos activada para proteger su número.');
      return;
    }

    const currentContact = currentBatch[autoSendIndex];

    // Marcar como despachado
    setContacts(prev =>
      prev.map(c => (c.id === currentContact.id ? { ...c, estadoDespacho: 'DESPACHADO' } : c))
    );

    // Abrir automáticamente el chat en WhatsApp Web
    if (currentContact.whatsappUrl) {
      window.open(currentContact.whatsappUrl, '_blank');
    }

    // Intervalo de 3.5 segundos entre cada envío para que el navegador procese sin bloquear
    const timeout = setTimeout(() => {
      setAutoSendIndex(prev => (prev !== null ? prev + 1 : null));
    }, 3500);

    return () => clearTimeout(timeout);
  }, [isAutoSending, autoSendIndex, contacts, currentBatchIndex, batchSize]);

  const handleStartAutoBatch = () => {
    setIsAutoSending(true);
    setAutoSendIndex(0);
    setToastMsg('⚡ Despacho automático iniciado: abriendo chats de WhatsApp consecutivamente cada 3.5 segundos...');
  };

  const handlePauseAutoBatch = () => {
    setIsAutoSending(false);
    setAutoSendIndex(null);
    setToastMsg('⏸️ Despacho automático en pausa.');
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const newExpanded: Record<string, boolean> = {};
    contacts.forEach(c => {
      newExpanded[c.id] = nextState;
    });
    setExpandedIds(newExpanded);
  };

  const handleStartEdit = (c: EvaSheetContact) => {
    setEditingId(c.id);
    setEditedText(c.mensajeGenerado || '');
  };

  const handleSaveEdit = (id: string) => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          const cleanPhone = c.numero.replace(/\D/g, '');
          const newUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(editedText)}`;
          return {
            ...c,
            mensajeGenerado: editedText,
            whatsappUrl: newUrl,
          };
        }
        return c;
      })
    );
    setEditingId(null);
    setToastMsg('✏️ Mensaje actualizado correctamente.');
    setTimeout(() => setToastMsg(null), 3000);
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
        {/* ENCABEZADO PRINCIPAL DE ALTO CONTRASTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0E1424] via-[#121B30] to-[#0E1424] p-6 rounded-3xl border border-amber-500/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              SISTEMA AUTOMATIZADO DE MENSAJERÍA
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Envío de Mensajes WhatsApp <span className="text-amber-400">· CRM3 EVA</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Mensajes persuasivos sin asteriscos, con iconos llamativos e integrados directamente a las columnas de su hoja de cálculo.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">RESPONSABLE ASIGNADA</span>
              <strong className="text-sm font-bold text-amber-400">EVA RINZA</strong>
            </div>
          </div>
        </div>

        {/* TOAST ALERTA */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMsg}</span>
          </div>
        )}

        {/* PANEL MAESTRO DE ACCIÓN: UN SOLO CLIC PARA LOS 10 */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F1629] via-[#0D1222] to-[#090C16] border border-amber-500/40 shadow-2xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-black text-xs tracking-wider">
                  LOTE {currentBatchIndex + 1} DE {totalBatches}
                </span>
                <span className="text-sm font-extrabold text-white">
                  Bloque de 10 Contactos Programados
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Progreso: <strong className="text-emerald-400 font-bold">{sentCountInBatch} de 10</strong> mensajes enviados.
              </p>
            </div>

            {/* BOTONES PRINCIPALES DE AUTOMATIZACIÓN */}
            <div className="flex flex-wrap items-center gap-3">
              {!isAutoSending ? (
                <button
                  onClick={handleStartAutoBatch}
                  disabled={isCooldownActive}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-black font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  <Zap className="w-5 h-5 fill-black" />
                  <span>ENVIAR LOTE COMPLETO EN AUTOMÁTICO</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseAutoBatch}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer animate-pulse"
                >
                  <Pause className="w-5 h-5 fill-black" />
                  <span>PAUSAR DESPACHO ({autoSendIndex! + 1}/10)</span>
                </button>
              )}

              {/* TEMPORIZADOR DE PAUSA (30 MIN) */}
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-inner">
                <Clock className="w-5 h-5 text-amber-400" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-400 block leading-tight">PAUSA ANTI-BLOQUEO</span>
                  <span className="text-xs font-black text-white">
                    {isCooldownActive ? (
                      <span className="text-amber-400 animate-pulse">{formatTimer(secondsRemaining)} (Activa)</span>
                    ) : (
                      '30:00 (Lista al terminar)'
                    )}
                  </span>
                </div>
              </div>

              {/* BOTÓN PARA EXPANDIR/CONTRAER TODOS LOS MENSAJES */}
              <button
                onClick={toggleExpandAll}
                className="px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                {allExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 text-amber-400" />
                    <span>Contraer Todos</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 text-amber-400" />
                    <span>Expandir Todos los Mensajes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 via-emerald-400 to-green-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${(sentCountInBatch / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* LISTA Y TARJETAS DE CONTACTOS CON DESPLIEGUE PROFESIONAL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Registros Oficiales de la Hoja (Filas 1 a 10)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Haga clic en «Ver Mensaje WhatsApp» en cualquier contacto para ver su tarjeta desplegada
            </span>
          </div>

          {currentBatch.map((c, index) => {
            const isSent = c.estadoDespacho === 'DESPACHADO';
            const isCurrentTarget = isAutoSending && autoSendIndex === index;
            const isExpanded = !!expandedIds[c.id];
            const isEditing = editingId === c.id;

            return (
              <div
                key={c.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isCurrentTarget
                    ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50'
                    : isSent
                    ? 'bg-[#0A101C] border-emerald-500/30'
                    : 'bg-[#0D1322] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* FILA DE DATOS PRINCIPALES DE LA HOJA DE CÁLCULO */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* IDENTIFICADOR Y CONTACTO */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-mono text-xs font-black text-amber-400 shrink-0">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          PB/L: {c.codigo}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                          {c.nombres}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {c.responsable}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400">
                        <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                          📱 {c.numero}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>{c.descripcion || 'Sin descripción'}</span>
                      </div>
                    </div>
                  </div>

                  {/* ESTADO DE VENTA Y BOTONES DE ACCIÓN */}
                  <div className="flex items-center gap-2.5 flex-wrap justify-between md:justify-end">
                    {/* Badge de Estado de Venta (Colores exactos del Excel) */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider ${
                        c.estadoVenta === 'CERRADO'
                          ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : c.estadoVenta === 'PERDIDO'
                          ? 'bg-red-600/90 text-white border border-red-500/50'
                          : 'bg-indigo-900/80 text-indigo-200 border border-indigo-500/40'
                      }`}
                    >
                      {c.estadoVenta}
                    </span>

                    {/* BOTÓN DESPLEGABLE PROFESIONAL */}
                    <button
                      onClick={() => toggleExpand(c.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isExpanded
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Ocultar Mensaje' : 'Ver Mensaje WhatsApp'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* ESTADO O ENVÍO MANUAL */}
                    {isSent ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Despachado
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
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* TARJETA DESPLEGABLE PROFESIONAL: VISTA PREVIA WHATSAPP */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800 bg-[#080C16] rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-w-3xl mx-auto space-y-3">
                      {/* Cabecera del mensaje */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-bold text-slate-300 font-mono">
                            Vista Previa de WhatsApp · Para: <strong className="text-white">{c.nombres}</strong> ({c.numero})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Estrategia: <strong className="text-amber-400">{c.estadoVenta}</strong>
                        </span>
                      </div>

                      {/* Burbuja estilo WhatsApp Web */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#005C4B] text-white shadow-xl border border-emerald-600/30 font-sans relative">
                        {isEditing ? (
                          <div className="space-y-3">
                            <textarea
                              value={editedText}
                              onChange={e => setEditedText(e.target.value)}
                              rows={5}
                              className="w-full bg-slate-950/90 text-white text-xs sm:text-sm p-3 rounded-xl border border-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveEdit(c.id)}
                                className="px-4 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-bold flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Guardar Cambios
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium text-slate-50">
                              {c.mensajeGenerado}
                            </p>
                            <div className="flex justify-end items-center gap-1 mt-2 text-[10px] text-emerald-200/80 font-mono">
                              <span>10:45 AM</span>
                              <span className="text-[#53BDEB] font-bold">✓✓</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* BARRA DE HERRAMIENTAS RÁPIDAS DEL MENSAJE */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.mensajeGenerado || '');
                              setCopiedId(c.id);
                              setTimeout(() => setCopiedId(null), 2500);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                          >
                            {copiedId === c.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">¡Copiado con éxito!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Copiar Mensaje</span>
                              </>
                            )}
                          </button>

                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Personalizar Texto</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={c.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setContacts(prev =>
                                prev.map(item => (item.id === c.id ? { ...item, estadoDespacho: 'DESPACHADO' } : item))
                              );
                            }}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir en WhatsApp Web</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NAVEGACIÓN DE LOTES */}
        <div className="p-5 rounded-3xl bg-[#0B0F19] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Mostrando 10 contactos por lote. La pausa de 30 minutos garantiza cero bloqueos en su línea.
          </span>
          <button
            onClick={() => {
              if (currentBatchIndex < totalBatches - 1) {
                setCurrentBatchIndex(prev => prev + 1);
                setIsCooldownActive(true);
                setSecondsRemaining(30 * 60);
              } else {
                alert('¡Has completado todos los registros del CRM!');
              }
            }}
            disabled={currentBatchIndex >= totalBatches - 1}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
          >
            Avanzar al Siguiente Lote ({currentBatchIndex + 2} de {totalBatches})
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
