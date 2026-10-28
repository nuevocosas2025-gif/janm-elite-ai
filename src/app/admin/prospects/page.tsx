'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService, type UnifiedCRMRecord } from '@/services/crmService';
import { VALID_PROSPECT_STATUSES } from '@/lib/security';
import type { ProspectStatus } from '@/types';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet, 
  Phone, 
  Send,
  Edit3, 
  Sparkles,
  Users,
  Check,
  X
} from 'lucide-react';

export default function ProspectsCRMPage() {
  const [prospects, setProspects] = useState<UnifiedCRMRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingProspect, setEditingProspect] = useState<UnifiedCRMRecord | null>(null);
  const [newStatus, setNewStatus] = useState<ProspectStatus>('Nuevo');
  const [newSalesStatus, setNewSalesStatus] = useState<string>('NO RESPONDE');
  const [newNotes, setNewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [enrollConfirmWarning, setEnrollConfirmWarning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchProspects = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getProspects();
      setProspects(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const handleOpenEdit = (p: UnifiedCRMRecord) => {
    setEditingProspect(p);
    setNewStatus(p.status);
    setNewSalesStatus(p.estadoVenta);
    setNewNotes(p.notes || '');
    setEnrollConfirmWarning(false);
  };

  const handleSaveStatus = async () => {
    if (!editingProspect) return;

    if (newStatus === 'Matriculado' && !enrollConfirmWarning) {
      setEnrollConfirmWarning(true);
      return;
    }

    setIsUpdating(true);
    try {
      await crmService.updateProspectStatus(editingProspect.id, newStatus, newNotes);
      setToastMsg(`Estado de ${editingProspect.contact?.full_name} actualizado a "${newStatus}"`);
      setTimeout(() => setToastMsg(null), 4000);
      setEditingProspect(null);
      await fetchProspects();
    } catch {
      alert('Error al actualizar registro');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtrado según búsqueda y estado
  const filtered = prospects.filter(p => {
    const matchesSearch = 
      p.contact?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contact?.phone?.includes(searchQuery) ||
      p.estadoVenta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.responsable?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedStatus === 'ALL') return matchesSearch;
    return matchesSearch && (p.estadoVenta === selectedStatus || p.status === selectedStatus);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO DE ALTO CONTRASTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0E1424] via-[#121B30] to-[#0E1424] p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              BASE DE DATOS UNIFICADA · CRM3 EVA
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Clientes y Ventas <span className="text-amber-400">(Excel CRM)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Visualización fiel con las cabeceras exactas de la hoja: PB/L, Nombres, Responsable, Número, Estado de Venta y Descripción.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">
              Total Registros: {prospects.length}
            </span>
          </div>
        </div>

        {/* NOTIFICACIÓN TOAST */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1322] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o estado..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#080B14] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-300">Filtrar por Estado:</span>
            <div className="flex gap-1.5">
              {['ALL', 'NO RESPONDE', 'PERDIDO', 'CERRADO'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {st === 'ALL' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABLA PRINCIPAL CON LAS CABECERAS EXACTAS DE GOOGLE SHEETS */}
        <div className="rounded-3xl bg-[#0D1322] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-[#080B14] flex justify-between items-center">
            <span className="font-black text-xs text-white flex items-center gap-2 tracking-wide uppercase">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Hoja: CRM3 EVA · Pestaña: Tabla_1 (Filas Reales Sincronizadas)
            </span>
            <span className="text-xs text-amber-300/80 font-mono font-bold">
              Mostrando {filtered.length} contactos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-300 font-mono">
                  <th className="py-3.5 px-4 font-bold text-amber-400">PB/L</th>
                  <th className="py-3.5 px-4 font-bold text-white">NOMBRES</th>
                  <th className="py-3.5 px-3 font-bold text-amber-400">RESPONSABLE</th>
                  <th className="py-3.5 px-4 font-bold text-emerald-400">NUMERO</th>
                  <th className="py-3.5 px-3 font-bold text-white">ESTADO DE VENTA</th>
                  <th className="py-3.5 px-4 font-bold text-slate-300">DESCRIPCION</th>
                  <th className="py-3.5 px-4 font-bold text-right text-amber-400">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Cargando datos del CRM...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No se encontraron registros con los criterios actuales.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const cleanPhone = (p.contact?.phone || '').replace(/\D/g, '');
                    const waLink = `https://wa.me/${cleanPhone}`;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* PB/L */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-xs">
                          {p.codigo}
                        </td>

                        {/* NOMBRES */}
                        <td className="py-3.5 px-4 font-extrabold text-white text-sm">
                          {p.contact?.full_name}
                        </td>

                        {/* RESPONSABLE */}
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {p.responsable}
                          </span>
                        </td>

                        {/* NUMERO */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-xs">
                          {p.contact?.phone}
                        </td>

                        {/* ESTADO DE VENTA */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider ${
                              p.estadoVenta === 'CERRADO'
                                ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : p.estadoVenta === 'PERDIDO'
                                ? 'bg-red-600/90 text-white'
                                : 'bg-indigo-900/80 text-indigo-200 border border-indigo-500/40'
                            }`}
                          >
                            {p.estadoVenta}
                          </span>
                        </td>

                        {/* DESCRIPCION */}
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                          <span className="line-clamp-2">{p.descripcion || p.notes}</span>
                        </td>

                        {/* ACCIONES */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-all cursor-pointer"
                              title="Abrir WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Actualizar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL PARA ACTUALIZAR ESTADO */}
        {editingProspect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-[#0E1424] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">
                  Actualizar Registro: <span className="text-amber-400">{editingProspect.contact?.full_name}</span>
                </h3>
                <button onClick={() => setEditingProspect(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Estado en el CRM:
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => {
                      setNewStatus(e.target.value as ProspectStatus);
                      setEnrollConfirmWarning(false);
                    }}
                    className="w-full bg-[#080B14] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {VALID_PROSPECT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {enrollConfirmWarning && (
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                    <p className="font-bold">⚠️ Confirmación de Matrícula (CERRADO):</p>
                    <p>
                      Marcar este contacto como matriculado registrará la venta exitosa en el reporte oficial. Presione «Confirmar y Guardar» para proceder.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Observaciones / Notas de Seguimiento:
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="Agregue notas sobre la llamada, interés o facilidades acordadas..."
                    className="w-full bg-[#080B14] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingProspect(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStatus}
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{enrollConfirmWarning ? 'Confirmar y Guardar' : 'Guardar Estado'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
