'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, PhoneCall, CheckCircle } from 'lucide-react';
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
      content: '¡Hola! 👋 Soy **JANM ELITE AI**, el asistente oficial de Oratoria JANM Elite.\n\n¿En qué te puedo asesorar hoy? Puedes preguntarme por cursos, horarios, precios en soles o solicitar la llamada de un coordinador.',
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
          { role: 'assistant', content: 'Lo sentimos, hubo un retraso en la respuesta. ¿Deseas dejarnos tu número para contactarte?' },
        ]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Disculpa, no pudimos procesar tu mensaje. Puedes escribirnos al WhatsApp oficial +51 984 512 345.' },
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
      const data = await res.json();
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ ¡Gracias ${leadForm.fullName}! Hemos recibido tus datos (+51 ${leadForm.phone}). Un asesor de Oratoria JANM Elite se comunicará contigo hoy mismo.`,
        },
      ]);
    } catch {
      alert('Error al enviar tus datos. Por favor inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-5 py-3.5 rounded-full font-bold shadow-gold-md hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
          </div>
          <span className="text-xs font-semibold">¿Dudas? Consultas en Línea (24/7)</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-janm-surface border border-janm-borderGold rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 via-janm-surface to-zinc-900 p-4 border-b border-janm-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-janm-gold" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  ATENCIÓN VIRTUAL JANM ELITE
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </h4>
                <p className="text-[11px] text-zinc-400">Canal Institucional Oficial</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                className="text-xs text-amber-400 hover:underline px-2 py-1 rounded"
                title="Abrir en pantalla completa"
              >
                Pantalla completa
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips */}
          <div className="bg-janm-dark/60 px-3 py-2 border-b border-janm-border/40 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => sendMessage('¿Cuáles son los cursos y precios?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:border-amber-400 hover:text-amber-300 transition-colors"
            >
              📚 Cursos y Precios
            </button>
            <button
              onClick={() => sendMessage('¿Qué días y horarios tienen clases?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:border-amber-400 hover:text-amber-300 transition-colors"
            >
              ⏰ Horarios
            </button>
            <button
              onClick={() => setShowLeadForm(true)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              ✍️ Reservar Cupo
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-black font-medium shadow-gold-sm rounded-br-xs'
                      : 'bg-janm-surfaceLight border border-janm-border text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400/80 italic">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                JANM Elite AI está escribiendo...
              </div>
            )}
          </div>

          {/* Formulario opcional de captación */}
          {showLeadForm && !leadSubmitted && (
            <div className="bg-janm-dark p-3.5 border-t border-janm-borderGold/40 animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-amber-400">Solicitar Asesoría Personalizada</span>
                <button onClick={() => setShowLeadForm(false)} className="text-zinc-400 text-xs hover:text-white">✕</button>
              </div>
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Tu Nombre completo"
                  value={leadForm.fullName}
                  onChange={e => setLeadForm({ ...leadForm, fullName: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-janm-surface border border-janm-border text-white focus:border-amber-400 outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Número de WhatsApp (9 dígitos)"
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-janm-surface border border-janm-border text-white focus:border-amber-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs rounded hover:brightness-110 cursor-pointer"
                >
                  Enviar a Admisiones
                </button>
              </form>
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 bg-janm-dark border-t border-janm-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu consulta..."
              className="flex-1 bg-janm-surface border border-janm-border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 text-black hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
