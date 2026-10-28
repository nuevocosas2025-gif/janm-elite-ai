'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  RotateCcw, 
  PhoneCall, 
  Shield, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare
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
      content: '¡Hola! Te damos la más cordial bienvenida a ORATORIA JANM ELITE 🎓🌟\n\nEstamos aquí para orientarte sobre nuestros programas presenciales y virtuales de oratoria para adultos, jóvenes y niños, horarios de sábados, certificación oficial o conectarte directamente con una de nuestras asesoras de admisiones.\n\n¿Qué objetivo de comunicación te gustaría lograr hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ fullName: '', phone: '', email: '', courseName: '' });
  const [leadSuccess, setLeadSuccess] = useState(false);
  
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
      }
    } catch {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: '⚠️ Ocurrió una interrupción momentánea. Puedes pulsar el botón a continuación para comunicarte directamente por WhatsApp con nuestro equipo oficial.',
          handoffRequested: true,
          handoffUrl: 'https://wa.me/51984512345?text=Hola,%20deseo%20información%20sobre%20los%20cursos%20de%20Oratoria%20JANM%20Elite',
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
              content: `🎉 ¡Datos registrados con éxito!\n\nEstimado/a ${leadForm.fullName}, hemos registrado tu número (+51 ${leadForm.phone}). Tu asesora asignada te contactará en breve para reservar tu plaza.`,
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
    <div className="flex flex-col h-screen bg-[#070A12] text-slate-100">
      {/* HEADER DEL CHAT */}
      <header className="h-16 px-4 sm:px-6 border-b border-amber-500/30 bg-[#0B0F19] flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-black font-black text-lg shadow-md">
            J
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base text-white leading-tight">
                ORATORIA JANM ELITE
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                En línea
              </span>
            </div>
            <p className="text-[11px] text-amber-300 font-mono">Canal Oficial de Consultas y Admisiones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="px-3 py-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Aviso de Privacidad (Ley 29733)"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Privacidad</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-700"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BARRA DE PREGUNTAS RÁPIDAS */}
      <div className="px-4 py-2.5 bg-[#080B14] border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] text-amber-400/80 uppercase font-mono font-bold tracking-wider shrink-0">
          Consultas rápidas:
        </span>
        <button
          onClick={() => handleSend('¿Cuáles son los cursos disponibles y sus precios en soles?')}
          className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold hover:border-amber-400 transition-colors"
        >
          📚 Cursos y Costos
        </button>
        <button
          onClick={() => handleSend('¿Tienen cursos de oratoria para niños y adolescentes?')}
          className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold hover:border-amber-400 transition-colors"
        >
          🧒 Oratoria Junior
        </button>
        <button
          onClick={() => handleSend('¿Cómo es la certificación oficial al finalizar el curso?')}
          className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold hover:border-amber-400 transition-colors"
        >
          🎓 Certificación Oficial
        </button>
        <button
          onClick={() => handleSend('Deseo hablar directamente con una asesora por WhatsApp')}
          className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold transition-colors"
        >
          📞 Hablar con Asesora
        </button>
        <button
          onClick={() => setShowLeadModal(true)}
          className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 transition-colors font-bold"
        >
          ✍️ Reservar Vacante
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
              <div className="flex items-end gap-2.5 max-w-[88%] sm:max-w-[80%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center font-black text-black text-xs shrink-0 mb-1 shadow-md">
                    J
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-br-none'
                      : 'bg-[#0E1526] border border-slate-700/80 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {m.content}

                  {/* Botón de transferencia a WhatsApp cuando se requiera */}
                  {m.handoffRequested && m.handoffUrl && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <a
                        href={m.handoffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Abrir WhatsApp con Asesora Oficial</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {m.timestamp && (
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {m.timestamp}
                </span>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 font-mono pl-10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Consultando información oficial de la academia...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <footer className="p-4 bg-[#0B0F19] border-t border-slate-800 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre cursos, costos o escribe 'ASESOR' para atención por WhatsApp..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black rounded-2xl hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2.5">
          Atención en línea oficial. Información autorizada y protegida por la Ley N° 29733 de Protección de Datos Personales de Perú.
        </p>
      </footer>

      {/* MODAL DE RESERVA DE VACANTE */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Reserva de Vacante / Asesoría
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {leadSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-white font-black text-base">¡Datos Recibidos con Éxito!</h4>
                <p className="text-xs text-slate-300 mt-1">Una asesora oficial te contactará a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Déjanos tus datos para enviarte los horarios oficiales y asegurar tu vacante:
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={leadForm.fullName}
                    onChange={e => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    placeholder="Ej: Melissa Pérez"
                    className="w-full bg-[#080B14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp (9 dígitos):</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="Ej: 953711857"
                    className="w-full bg-[#080B14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Programa de Interés (Opcional):</label>
                  <input
                    type="text"
                    value={leadForm.courseName}
                    onChange={e => setLeadForm({ ...leadForm, courseName: e.target.value })}
                    placeholder="Ej: Oratoria y Liderazgo de Alto Impacto"
                    className="w-full bg-[#080B14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs hover:brightness-110 shadow-md cursor-pointer"
                  >
                    Confirmar Reserva con Asesora
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE PRIVACIDAD */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Aviso de Privacidad Oficial (Ley N° 29733)
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {PRIVACY_POLICY_NOTICE}
            </p>
            <div className="text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
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
