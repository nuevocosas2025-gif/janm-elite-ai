import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Course } from '@/types';

// Datos oficiales semilla en caso de operar en modo offline o previo a migración
export const FALLBACK_COURSES: Course[] = [
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    name: 'Oratoria y Liderazgo de Alto Impacto',
    description: 'Programa avanzado para vencer el miedo escénico, modular la voz, dominar el lenguaje corporal y estructurar discursos persuasivos ante audiencias masivas o ejecutivas.',
    modality: 'Presencial',
    duration: '8 semanas (32 horas)',
    schedule: 'Sábados de 9:00 AM a 1:00 PM',
    price: 350.00,
    currency: 'PEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000002-0000-0000-0000-000000000002',
    name: 'Oratoria para Niños y Adolescentes (Junior Elite)',
    description: 'Desarrollo de seguridad emocional, elocuencia, expresión verbal y habilidades de socialización para niños de 7 a 15 años.',
    modality: 'Presencial',
    duration: '6 semanas (24 horas)',
    schedule: 'Martes y Jueves de 4:00 PM a 6:00 PM',
    price: 280.00,
    currency: 'PEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000003-0000-0000-0000-000000000003',
    name: 'Debate, Argumentación y Negociación Estratégica',
    description: 'Técnicas de dialéctica parlamentaria, contraargumentación rápida, pensamiento crítico y resolución de conflictos.',
    modality: 'Híbrido',
    duration: '4 semanas (16 horas)',
    schedule: 'Viernes de 6:00 PM a 8:00 PM y Sábados Virtual',
    price: 250.00,
    currency: 'PEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000004-0000-0000-0000-000000000004',
    name: 'Comunicación Efectiva y Media Training Online',
    description: 'Dominio de cámaras, webinars, podcasts y entrevistas radiales/televisivas con proyección profesional 100% en vivo.',
    modality: 'Virtual',
    duration: '4 semanas (16 horas)',
    schedule: 'Lunes y Miércoles de 7:30 PM a 9:30 PM vía Zoom',
    price: 200.00,
    currency: 'PEN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const courseService = {
  async getCourses(activeOnly = true): Promise<Course[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from('courses').select('*').order('price', { ascending: false });
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return activeOnly ? FALLBACK_COURSES.filter(c => c.is_active) : FALLBACK_COURSES;
      }
      return data as Course[];
    } catch {
      return activeOnly ? FALLBACK_COURSES.filter(c => c.is_active) : FALLBACK_COURSES;
    }
  },

  async getCourseById(id: string): Promise<Course | null> {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
      if (error || !data) {
        return FALLBACK_COURSES.find(c => c.id === id) || null;
      }
      return data as Course;
    } catch {
      return FALLBACK_COURSES.find(c => c.id === id) || null;
    }
  },

  async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('courses').insert([course]).select().single();
    if (error) throw new Error(error.message);
    return data as Course;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as Course;
  },

  async deleteCourse(id: string): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};
