import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { KnowledgeDocument } from '@/types';

export const FALLBACK_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: 'k-1',
    title: 'Certificación y Valor Curricular',
    content: 'Al aprobar con 80% de asistencia mínima y sustentación final, el participante obtiene Certificado oficial a nombre de ORATORIA JANM ELITE con horas pedagógicas y validación digital.',
    category: 'CERTIFICACION',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'k-2',
    title: 'Modalidades de Pago y Facilidades',
    content: 'Pagos mediante transferencia (BCP, Interbank, BBVA, Banco de la Nación), Yape y Plin. Para programas de 8 semanas se puede abonar en 2 cuotas quincenales sin recargo.',
    category: 'PRECIOS',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'k-3',
    title: 'Metodología Vivencial y Práctica',
    content: 'El método JANM ELITE combina 80% práctica y 20% fundamentación retórica. Grabaciones diagnósticas en alta resolución, manejo de escenario, dicción, modulación y técnicas anti-nervios.',
    category: 'METODOLOGIA',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'k-4',
    title: 'Horarios y Flexibilidad',
    content: 'Contamos con turnos de mañana, tarde y noche, así como grupos exclusivos los fines de semana (sábados intensivos) y modalidad 100% online en vivo.',
    category: 'HORARIOS',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'k-5',
    title: 'Plana Docente de Alto Nivel',
    content: 'Mentores especializados con amplia trayectoria en oratoria forense, conferencias internacionales, comunicación política y neurocomunicación.',
    category: 'DOCENTES',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
];

export const knowledgeService = {
  async getDocuments(category?: string): Promise<KnowledgeDocument[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from('knowledge_documents').select('*').eq('is_active', true);
      if (category && category !== 'ALL') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return category && category !== 'ALL'
          ? FALLBACK_KNOWLEDGE.filter(k => k.category === category)
          : FALLBACK_KNOWLEDGE;
      }
      return data as KnowledgeDocument[];
    } catch {
      return FALLBACK_KNOWLEDGE;
    }
  },

  async createDocument(doc: Omit<KnowledgeDocument, 'id' | 'updated_at'>): Promise<KnowledgeDocument> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('knowledge_documents').insert([doc]).select().single();
    if (error) throw new Error(error.message);
    return data as KnowledgeDocument;
  },

  async updateDocument(id: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('knowledge_documents').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as KnowledgeDocument;
  },

  async deleteDocument(id: string): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from('knowledge_documents').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};
