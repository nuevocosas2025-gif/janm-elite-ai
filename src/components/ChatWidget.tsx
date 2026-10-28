'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall, CheckCircle, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Te damos la bienvenida a ORATORIA JANM ELITE 🌟\n\n¿En qué podemos orientarte hoy? Puedes consultarnos por nuestros programas, tarifas oficiales, horarios de sábados o solicitar que una asesora te contacte directamente.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ fullName: '', phone: '', email: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.response.message }]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: '¿Deseas que una de nuestras asesoras te llame o te escriba directamente a tu WhatsApp?' },
        ]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Puedes comunicarte de inmediato con nuestra coordinación académica al WhatsApp oficial.' },
      ]);
    } finally {
      setIsLoading(false);
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
          messages: [{ role: 'user', content: 'Solicitud de contacto y reserva' }],
          leadData: {
            fullName: leadForm.fullName,
            phone: leadForm.phone,
            email: leadForm.email,
          },
        }),
      });
      await res.json();
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ ¡Muchas gracias ${leadForm.fullName}! Hemos recibido tu número (${leadForm.phone}). Tu asesora asignada te escribirá hoy mismo para brindarte toda la información detallada.`,
        },
      ]);
    } catch {
      alert('Error al registrar datos. Por favor inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-6 py-4 rounded-full font-black shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 transition-all cursor-pointer group border-2 border-amber-300"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-black animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-wide">¿Consultas? Atención en Línea</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-[#0B0F19] border-2 border-amber-500/50 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0E1424] via-[#141C30] to-[#0E1424] p-4 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center font-black text-black text-base shadow-md">
                J
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 leading-tight">
                  ORATORIA JANM ELITE
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[10px] text-amber-300 font-mono">Atención Virtual Oficial 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                className="text-xs text-amber-400 hover:text-white px-2 py-1 rounded font-bold"
                title="Abrir en pantalla completa"
              >
                Pantalla completa
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Botones de consultas rápidas */}
          <div className="bg-[#080B14] px-3.5 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => sendMessage('¿Cuáles son los cursos y precios en soles?')}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold hover:border-amber-400 transition-all cursor-pointer"
            >
              📚 Cursos y Costos
            </button>
            <button
              onClick={() => sendMessage('¿Qué días y horarios tienen clases presenciales?')}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold hover:border-amber-400 transition-all cursor-pointer"
            >
              ⏰ Horarios Sábados
            </button>
            <button
              onClick={() => setShowLeadForm(true)}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold transition-all cursor-pointer"
            >
              ✍️ Reservar Vacante
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 whitespace-pre-line leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold shadow-md rounded-br-none'
                      : 'bg-[#121A2C] border border-slate-700/80 text-slate-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Escribiendo respuesta oficial...
              </div>
            )}
          </div>

          {/* Formulario rápido para reserva */}
          {showLeadForm && !leadSubmitted && (
            <div className="bg-[#080B14] p-4 border-t border-amber-500/30 animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                  Reserva Informativa de Vacante
                </span>
                <button onClick={() => setShowLeadForm(false)} className="text-slate-400 text-xs hover:text-white">✕</button>
              </div>
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Tu Nombre completo"
                  value={leadForm.fullName}
                  onChange={e => setLeadForm({ ...leadForm, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Número de WhatsApp (9 dígitos)"
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs rounded-xl hover:brightness-110 cursor-pointer shadow-md"
                >
                  Confirmar Datos para Asesoría
                </button>
              </form>
            </div>
          )}

          {/* Entrada de texto */}
          <div className="p-3.5 bg-[#080B14] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
