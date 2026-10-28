'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { courseService, FALLBACK_COURSES } from '@/services/courseService';
import type { Course, CourseModality } from '@/types';
import { GraduationCap, Plus, Edit2, Trash2, Check, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getCourses(false);
      setCourses(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse({
      name: '',
      description: '',
      modality: 'Presencial',
      duration: '4 semanas',
      schedule: 'Sábados de 9:00 AM a 1:00 PM',
      price: 250,
      currency: 'PEN',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.name || !editingCourse.description) return;

    try {
      if (editingCourse.id) {
        await courseService.updateCourse(editingCourse.id, editingCourse);
      } else {
        await courseService.createCourse(editingCourse as any);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch {
      // Si Supabase falla localmente, actualizar estado en memoria
      if (editingCourse.id) {
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...editingCourse } as Course : c));
      } else {
        const newC: Course = {
          id: `c-local-${Date.now()}`,
          name: editingCourse.name!,
          description: editingCourse.description!,
          modality: editingCourse.modality as CourseModality || 'Presencial',
          duration: editingCourse.duration || '4 semanas',
          schedule: editingCourse.schedule || 'Sábados',
          price: Number(editingCourse.price) || 200,
          currency: 'PEN',
          is_active: editingCourse.is_active ?? true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCourses(prev => [newC, ...prev]);
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
              Catálogo Oficial de Cursos y Tarifas
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Información oficial utilizada por JANM Elite AI para responder a los prospectos sin inventar datos.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Programa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-janm-surface border border-janm-border flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {course.modality}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-amber-400">
                      S/ {course.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">{course.currency}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{course.description}</p>

                <div className="space-y-1.5 text-xs text-zinc-400 pt-3 border-t border-janm-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{course.schedule}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-janm-border/60 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(course)}
                  className="px-3 py-1.5 rounded-lg bg-janm-surfaceLight border border-janm-border text-zinc-300 hover:text-white text-xs flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL EDITAR / CREAR */}
        {isModalOpen && editingCourse && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-janm-surface border border-janm-borderGold rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">
                  {editingCourse.id ? 'Editar Programa' : 'Crear Nuevo Programa'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre del Curso</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, name: e.target.value })}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    required
                    value={editingCourse.description || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full bg-janm-dark border border-janm-border rounded-xl p-3 text-xs text-white outline-none focus:border-janm-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Modalidad</label>
                    <select
                      value={editingCourse.modality || 'Presencial'}
                      onChange={e => setEditingCourse({ ...editingCourse, modality: e.target.value as any })}
                      className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Precio en Soles (PEN)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingCourse.price ?? 250}
                      onChange={e => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })}
                      className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Duración</label>
                    <input
                      type="text"
                      value={editingCourse.duration || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                      placeholder="Ej. 8 semanas (32 horas)"
                      className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Horario</label>
                    <input
                      type="text"
                      value={editingCourse.schedule || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                      placeholder="Ej. Sábados 9am - 1pm"
                      className="w-full bg-janm-dark border border-janm-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-janm-gold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
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
