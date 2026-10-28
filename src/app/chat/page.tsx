'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  PhoneCall, 
  Shield, 
  User, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PRIVACY_POLICY_NOTICE } from '@/lib/security';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  handoffRequested?: boolean;
  handoffUrl?: string;
  timestamp?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Bienvenido a **ORATORIA JANM ELITE** 🎓\n\nSoy tu asesor inteligente. Puedo informarte sobre nuestros programas de oratoria para adultos, jóvenes y niños, horarios, certificación oficial o conectarte directamente con nuestro equipo de admisiones.\n\n¿Qué habilidad te gustaría potenciar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ fullName: '', phone: '', email: '', courseName: '' });
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'ERROR'>('CONNECTED');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) {
        throw new Error(`Error en el servidor: ${res.status}`);
      }

      const data = await res.json();
      if (data.response) {
        setMessages([
          ...newHistory,
          {
            role: 'assistant',
            content: data.response.message,
            handoffRequested: data.response.handoffRequested,
            handoffUrl: data.response.handoffUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setConnectionStatus('CONNECTED');
      }
    } catch (e) {
      setConnectionStatus('ERROR');
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: '⚠️ Ocurrió una interrupción momentánea de conexión. Puedes reintentar tu consulta o escribirnos directamente por WhatsApp al +51 984 512 345.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (confirm('¿Deseas reiniciar la conversación?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Conversación reiniciada. ¿En qué programa de ORATORIA JANM ELITE tienes interés?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.fullName || !leadForm.phone) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Registro de datos para reserva' }],
          leadData: leadForm,
        }),
      });

      if (res.ok) {
        setLeadSuccess(true);
        setTimeout(() => {
          setShowLeadModal(false);
          setLeadSuccess(false);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `🎉 **¡Datos registrados con éxito!**\n\nEstimado/a **${leadForm.fullName}**, hemos registrado tu número (+51 ${leadForm.phone}). Un coordinador de admisiones te contactará en breve para reservar tu plaza.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1200);
      }
    } catch {
      alert('Error al registrar sus datos. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-janm-dark text-slate-100">
      {/* HEADER DEL CHAT */}
      <header className="h-16 px-4 sm:px-6 border-b border-janm-border/60 bg-janm-surface flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-janm-surfaceLight transition-colors"
            title="Volver a la portada"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-black font-extrabold shadow-gold-sm">
            J
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white leading-tight">
                JANM ELITE AI
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                En línea
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Asesor Oficial de Oratoria y Liderazgo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-janm-surfaceLight rounded-lg text-xs flex items-center gap-1 transition-colors"
            title="Aviso de Privacidad (Ley 29733)"
          >
            <Shield className="w-4 h-4 text-janm-gold" />
            <span className="hidden sm:inline">Privacidad</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-2 text-zinc-400 hover:text-white hover:bg-janm-surfaceLight rounded-lg transition-colors"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* QUICK SUGGESTIONS BAR */}
      <div className="px-4 py-2 bg-janm-dark border-b border-janm-border/30 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] text-zinc-400 uppercase font-mono tracking-wider shrink-0">
          Sugerencias:
        </span>
        <button
          onClick={() => handleSend('¿Cuáles son los cursos disponibles y sus precios en soles?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-janm-surface border border-janm-border hover:border-amber-400 hover:text-amber-300 text-zinc-300 transition-colors"
        >
          📚 Cursos y Precios
        </button>
        <button
          onClick={() => handleSend('¿Tienen cursos de oratoria para niños?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-janm-surface border border-janm-border hover:border-amber-400 hover:text-amber-300 text-zinc-300 transition-colors"
        >
          🧒 Oratoria Junior
        </button>
        <button
          onClick={() => handleSend('¿Cómo es la certificación al finalizar?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-janm-surface border border-janm-border hover:border-amber-400 hover:text-amber-300 text-zinc-300 transition-colors"
        >
          🎓 Certificación
        </button>
        <button
          onClick={() => handleSend('Deseo hablar directamente con un asesor humano por WhatsApp')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-janm-surface border border-janm-border hover:border-amber-400 hover:text-amber-300 text-zinc-300 transition-colors"
        >
          📞 Hablar con Asesor
        </button>
        <button
          onClick={() => setShowLeadModal(true)}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-colors font-medium"
        >
          ✍️ Dejar Datos / Reserva
        </button>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[80%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mb-1">
                    <Bot className="w-4 h-4 text-janm-gold" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    isUser
                      ? 'bg-amber-500 text-black font-medium rounded-br-none shadow-gold-sm'
                      : 'bg-janm-surface border border-janm-border text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {m.content}

                  {/* Botón de transferencia a WhatsApp cuando se requiera */}
                  {m.handoffRequested && m.handoffUrl && (
                    <div className="mt-3 pt-3 border-t border-zinc-700/60">
                      <a
                        href={m.handoffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp con Asesor Oficial</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {m.timestamp && (
                <span className="text-[10px] text-zinc-500 mt-1 px-1">
                  {m.timestamp}
                </span>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400/80 italic pl-9">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            JANM Elite AI está procesando la mejor respuesta...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <footer className="p-4 bg-janm-surface border-t border-janm-border/60 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre cursos, costos o escribe 'ASESOR' para atención humana..."
            disabled={isLoading}
            className="flex-1 bg-janm-dark border border-janm-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold focus:ring-1 focus:ring-janm-gold transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-gold-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 text-center mt-2">
          JANM Elite AI no inventa datos comerciales. Información autorizada y protegida por la Ley N° 29733 de Perú.
        </p>
      </footer>

      {/* MODAL DE CAPTACIÓN DE LEAD */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-janm-surface border border-janm-borderGold rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-janm-gold" />
                Reserva de Vacante / Asesoría
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {leadSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-white font-bold text-base">¡Datos Recibidos!</h4>
                <p className="text-xs text-zinc-400 mt-1">Un coordinador te contactará a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.fullName}
                    onChange={e => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-janm-dark border border-janm-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Teléfono WhatsApp (9 dígitos) *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="Ej. 984512345"
                    className="w-full bg-janm-dark border border-janm-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="juan.perez@gmail.com"
                    className="w-full bg-janm-dark border border-janm-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-2.5 rounded bg-janm-dark/60 text-[11px] text-zinc-400 leading-snug">
                  🛡️ Sus datos están protegidos conforme a la Ley N° 29733 de Perú. No compartimos su número con terceros.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeadModal(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                  >
                    Confirmar Envío
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE POLÍTICA DE PRIVACIDAD */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-janm-surface border border-janm-borderGold rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-janm-gold" />
                Aviso de Privacidad y Derechos ARCO (Perú)
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
              <p>{PRIVACY_POLICY_NOTICE}</p>
              <p>
                <strong>Derechos ARCO:</strong> En cualquier momento usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición. Para solicitar su baja inmediata de comunicaciones promocionales, puede escribir en este chat la palabra <code>BAJA</code>.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
