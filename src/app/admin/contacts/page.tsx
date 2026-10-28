'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService } from '@/services/crmService';
import type { Contact } from '@/types';
import { Search, Download, Users, Phone, Mail, FileSpreadsheet, Plus } from 'lucide-react';

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    crmService.getProspects().then(prospects => {
      const extracted = prospects.map(p => p.contact).filter(Boolean) as Contact[];
      setContacts(extracted);
      setIsLoading(false);
    });
  }, []);

  const filtered = contacts.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Nombre Completo', 'Teléfono', 'Correo', 'Origen', 'Fecha'];
    const rows = filtered.map(c => [
      `"${c.full_name}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.source}"`,
      `"${c.created_at}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contactos_janm_elite_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Directorio de Contactos de la Academia
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Base consolidada de alumnos potenciales provenientes del Chatbot, WhatsApp y Google Sheets.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-janm-surface border border-janm-border hover:border-amber-400/40 text-xs font-semibold text-zinc-200 hover:bg-janm-surfaceLight cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="p-4 rounded-2xl bg-janm-surface border border-janm-border flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar contacto por nombre, teléfono o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-janm-dark border border-janm-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
            />
          </div>
          <span className="text-xs text-zinc-500">
            Total listados: <strong>{filtered.length}</strong>
          </span>
        </div>

        {/* TABLA */}
        <div className="rounded-2xl bg-janm-surface border border-janm-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-janm-border/60 bg-janm-dark/50 text-zinc-400">
                  <th className="py-3 px-4 font-semibold">Nombre Completo</th>
                  <th className="py-3 px-4 font-semibold">WhatsApp / Teléfono</th>
                  <th className="py-3 px-4 font-semibold">Correo Electrónico</th>
                  <th className="py-3 px-4 font-semibold">Origen</th>
                  <th className="py-3 px-4 font-semibold">Fila Sheets</th>
                  <th className="py-3 px-4 font-semibold text-right">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-janm-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Cargando contactos...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      No se encontraron contactos.
                    </td>
                  </tr>
                ) : (
                  filtered.map(c => (
                    <tr key={c.id} className="hover:bg-janm-surfaceLight/50">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {c.full_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">
                        {c.phone || 'No registrado'}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {c.email || 'No registrado'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                          {c.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono">
                        {c.google_sheet_row_id ? `#${c.google_sheet_row_id}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-zinc-500 font-mono text-[11px]">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
