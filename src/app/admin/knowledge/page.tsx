'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { knowledgeService, FALLBACK_KNOWLEDGE } from '@/services/knowledgeService';
import type { KnowledgeDocument } from '@/types';
import { BookOpen, Plus, Edit3, Trash2, Check, Sparkles, Filter } from 'lucide-react';

export default function KnowledgeBaseAdminPage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<KnowledgeDocument> | null>(null);

  const fetchDocs = async () => {
    const data = await knowledgeService.getDocuments(selectedCategory);
    setDocuments(data);
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedCategory]);

  const handleOpenCreate = () => {
    setEditingDoc({
      title: '',
      content: '',
      category: 'GENERAL',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editingDoc.title || !editingDoc.content) return;

    try {
      if (editingDoc.id) {
        await knowledgeService.updateDocument(editingDoc.id, editingDoc);
      } else {
        await knowledgeService.createDocument(editingDoc as any);
      }
      setIsModalOpen(false);
      fetchDocs();
    } catch {
      if (editingDoc.id) {
        setDocuments(prev => prev.map(d => d.id === editingDoc.id ? { ...d, ...editingDoc } as KnowledgeDocument : d));
      } else {
        const newD: KnowledgeDocument = {
          id: `k-local-${Date.now()}`,
          title: editingDoc.title!,
          content: editingDoc.content!,
          category: editingDoc.category as any || 'GENERAL',
          is_active: true,
          updated_at: new Date().toISOString(),
        };
        setDocuments(prev => [newD, ...prev]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Base de Conocimiento y Preguntas Frecuentes (FAQs)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Documentos autorizados que alimentan al Asistente JANM AI para responder con 100% de exactitud.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold hover:brightness-110 shadow-gold-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Documento</span>
          </button>
        </div>

        {/* FILTROS POR CATEGORÍA */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {['ALL', 'CERTIFICACION', 'PRECIOS', 'METODOLOGIA', 'HORARIOS', 'DOCENTES', 'GENERAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-janm-surface border border-janm-border text-zinc-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>

        {/* LISTADO DE DOCUMENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-janm-surface border border-janm-border flex flex-col justify-between hover:border-amber-400/40 transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-amber-300">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mb-2">{doc.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">{doc.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-janm-border/60 flex justify-end">
                <button
                  onClick={() => {
                    setEditingDoc(doc);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-janm-surfaceLight border border-janm-border text-xs text-zinc-300 hover:text-amber-400 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {isModalOpen && editingDoc && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-janm-surface border border-janm-borderGold rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">
                  {editingDoc.id ? 'Editar Conocimiento' : 'Crear Documento de Conocimiento'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título del Tema</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.title || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoría</label>
                  <select
                    value={editingDoc.category || 'GENERAL'}
                    onChange={e => setEditingDoc({ ...editingDoc, category: e.target.value as any })}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                  >
                    <option value="CERTIFICACION">CERTIFICACION</option>
                    <option value="PRECIOS">PRECIOS</option>
                    <option value="METODOLOGIA">METODOLOGIA</option>
                    <option value="HORARIOS">HORARIOS</option>
                    <option value="DOCENTES">DOCENTES</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contenido Autorizado</label>
                  <textarea
                    rows={5}
                    required
                    value={editingDoc.content || ''}
                    onChange={e => setEditingDoc({ ...editingDoc, content: e.target.value })}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl p-3 text-xs text-white outline-none focus:border-janm-gold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
