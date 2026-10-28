'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { crmService } from '@/services/crmService';
import { VALID_PROSPECT_STATUSES } from '@/lib/security';
import type { Prospect, ProspectStatus } from '@/types';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Edit3, 
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

export default function ProspectsCRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProspectStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [newStatus, setNewStatus] = useState<ProspectStatus>('Nuevo');
  const [newNotes, setNewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [enrollConfirmWarning, setEnrollConfirmWarning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchProspects = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getProspects(selectedStatus, searchQuery);
      setProspects(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [selectedStatus, searchQuery]);

  const handleOpenEdit = (p: Prospect) => {
    setEditingProspect(p);
    setNewStatus(p.status);
    setNewNotes(p.notes || '');
    setEnrollConfirmWarning(false);
  };

  const handleSaveStatus = async () => {
    if (!editingProspect) return;

    // Regla de Sección 11: Confirmación obligatoria antes de marcar 'Matriculado'
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
      fetchProspects();
    } catch {
      alert('Error al actualizar prospecto');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              CRM y Seguimiento Comercial de Prospectos
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Embudo oficial con 9 estados, control de consentimiento y confirmación de matrícula.
            </p>
          </div>
        </div>

        {/* NOTIFICACIÓN TOAST */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className="p-4 rounded-2xl bg-janm-surface border border-janm-border flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, WhatsApp o correo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-janm-dark border border-janm-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-janm-gold"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-janm-gold cursor-pointer"
            >
              <option value="ALL">Todos los Estados (9)</option>
              {VALID_PROSPECT_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA DE PROSPECTOS */}
        <div className="rounded-2xl bg-janm-surface border border-janm-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-janm-border/60 bg-janm-dark/50 text-zinc-400">
                  <th className="py-3 px-4 font-semibold">Prospecto / Contacto</th>
                  <th className="py-3 px-4 font-semibold">Curso de Interés</th>
                  <th className="py-3 px-4 font-semibold">Estado Comercial</th>
                  <th className="py-3 px-4 font-semibold">Canal / Origen</th>
                  <th className="py-3 px-4 font-semibold">Fecha Registro</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-janm-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Cargando prospectos del CRM...
                    </td>
                  </tr>
                ) : prospects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      No se encontraron prospectos con los filtros actuales.
                    </td>
                  </tr>
                ) : (
                  prospects.map(p => (
                    <tr key={p.id} className="hover:bg-janm-surfaceLight/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {p.contact?.full_name || 'Sin nombre'}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                          {p.contact?.phone && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Phone className="w-3 h-3" />
                              {p.contact.phone}
                            </span>
                          )}
                          {p.contact?.email && (
                            <span className="flex items-center gap-1 text-zinc-400 truncate max-w-[160px]">
                              <Mail className="w-3 h-3" />
                              {p.contact.email}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-amber-300">
                          {p.course?.name || 'Por definir'}
                        </span>
                        {p.notes && (
                          <p className="text-[11px] text-zinc-400 truncate max-w-[220px] mt-0.5">
                            {p.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          p.status === 'Matriculado'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : p.status === 'Matrícula en proceso'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : p.status === 'Interesado'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : p.status === 'Solicita no recibir comunicaciones'
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-zinc-300 font-mono text-[11px]">
                          {p.contact?.source || 'CHATBOT'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-1.5 rounded-lg bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Actualizar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE EDICIÓN DE ESTADO */}
        {editingProspect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-janm-surface border border-janm-borderGold rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">
                  Actualizar Prospecto: {editingProspect.contact?.full_name}
                </h3>
                <button
                  onClick={() => setEditingProspect(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nuevo Estado Comercial (Reglas Sección 11)
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => {
                      setNewStatus(e.target.value as ProspectStatus);
                      setEnrollConfirmWarning(false);
                    }}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                  >
                    {VALID_PROSPECT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* ADVERTENCIA DE SEGURIDAD PARA 'MATRICULADO' */}
                {newStatus === 'Matriculado' && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Confirmación Requerida (Sección 11):</strong>
                      No marques a un prospecto como matriculado sin confirmación válida del comprobante o pago en tesorería. ¿Confirmas que el pago fue verificado?
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Notas y Observaciones del Asesor
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="Detalles de la llamada, horario acordado, modalidad..."
                    className="w-full bg-janm-dark border border-janm-border rounded-xl p-3 text-xs text-white outline-none focus:border-janm-gold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProspect(null)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs hover:brightness-110 shadow-gold-sm cursor-pointer"
                  >
                    {isUpdating ? 'Guardando...' : newStatus === 'Matriculado' && !enrollConfirmWarning ? 'Validar Matrícula' : 'Confirmar y Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
