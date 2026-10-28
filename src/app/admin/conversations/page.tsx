'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MessageSquare, Bot, User, Phone, CheckCircle2, Search } from 'lucide-react';

interface MockConversation {
  id: string;
  contactName: string;
  phone: string;
  channel: string;
  status: string;
  lastMessage: string;
  timestamp: string;
  messages: { sender: 'user' | 'assistant'; text: string; time: string }[];
}

const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv-1',
    contactName: 'Renzo Vargas Mendoza',
    phone: '+51 984 512 345',
    channel: 'WEB_CHAT',
    status: 'RESOLVED',
    lastMessage: '¿Deseas que un asesor te reserve una vacante o te envíe el temario?',
    timestamp: 'Hoy 18:30',
    messages: [
      { sender: 'user', text: 'Hola, buenas tardes. Quisiera saber los precios de oratoria para adultos.', time: '18:28' },
      { sender: 'assistant', text: '¡Hola Renzo! El programa oficial "Oratoria y Liderazgo de Alto Impacto" tiene una inversión de S/ 350.00 PEN por 8 semanas de entrenamiento intensivo.', time: '18:29' },
      { sender: 'user', text: '¿Los horarios son los sábados?', time: '18:29' },
      { sender: 'assistant', text: 'Sí, exactamente. Las clases presenciales se imparten los Sábados de 9:00 AM a 1:00 PM. ¿Deseas que un asesor te reserve una vacante o te envíe el temario detallado?', time: '18:30' },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Camila Salazar Quispe',
    phone: '+51 956 123 987',
    channel: 'WHATSAPP',
    status: 'OPEN',
    lastMessage: 'Quiero inscribir a mi hijo en el taller junior.',
    timestamp: 'Hoy 16:15',
    messages: [
      { sender: 'user', text: 'Hola, tienen clases para niños de 11 años?', time: '16:14' },
      { sender: 'assistant', text: '¡Por supuesto! Contamos con "Oratoria para Niños y Adolescentes (Junior Elite)" de 6 semanas los martes y jueves.', time: '16:14' },
      { sender: 'user', text: 'Quiero inscribir a mi hijo en el taller junior.', time: '16:15' },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Diego Huamán Poma',
    phone: '+51 964 890 123',
    channel: 'WEB_CHAT',
    status: 'WAITING_HUMAN',
    lastMessage: 'Deseo hablar con un asesor sobre pago en cuotas.',
    timestamp: 'Ayer',
    messages: [
      { sender: 'user', text: 'Deseo hablar con un asesor sobre pago en cuotas.', time: 'Ayer' },
      { sender: 'assistant', text: 'Con gusto. Hemos derivado tu solicitud a coordinación académica. Puedes hacer clic en el botón de WhatsApp para hablar ahora mismo.', time: 'Ayer' },
    ],
  },
];

export default function ConversationsAdminPage() {
  const [selectedConv, setSelectedConv] = useState<MockConversation>(MOCK_CONVERSATIONS[0]);
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter(c =>
    c.contactName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Historial de Conversaciones y Sesiones de Chat
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registro de interacciones con visitantes, detección de intención y derivaciones humanas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* LISTA DE CONVERSACIONES */}
          <div className="bg-janm-surface border border-janm-border rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-janm-border">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar conversación..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-janm-dark border border-janm-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-janm-border/40">
              {filtered.map(c => {
                const isSelected = selectedConv.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConv(c)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'hover:bg-janm-surfaceLight/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-white truncate max-w-[150px]">{c.contactName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{c.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mb-1">{c.lastMessage}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-300">
                      {c.channel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISOR DE MENSAJES */}
          <div className="lg:col-span-2 bg-janm-surface border border-janm-border rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-janm-border bg-janm-dark/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">{selectedConv.contactName}</h3>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {selectedConv.phone}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Estado: {selectedConv.status}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConv.messages.map((m, idx) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0 mb-1">
                          AI
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-amber-500 text-black font-medium'
                            : 'bg-janm-dark border border-janm-border text-zinc-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1 px-1 font-mono">{m.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
