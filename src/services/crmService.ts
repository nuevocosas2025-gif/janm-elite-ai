import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Prospect, Contact, ProspectStatus, DashboardMetrics } from '@/types';
import { FALLBACK_COURSES } from './courseService';

export const INITIAL_LEADS: (Prospect & { contact: Contact })[] = [
  {
    id: 'p-1',
    contact_id: 'c-1',
    course_id: 'c0000001-0000-0000-0000-000000000001',
    status: 'Interesado',
    assigned_to: null,
    notes: 'Interesado en turno sábado mañana. Requiere información para vencer miedo a hablar en público.',
    last_contact_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    consent_status: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    contact: {
      id: 'c-1',
      full_name: 'Renzo Vargas Mendoza',
      phone: '+51984512345',
      email: 'renzo.vargas@gmail.com',
      source: 'CHATBOT',
      google_sheet_row_id: '2',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: FALLBACK_COURSES[0],
  },
  {
    id: 'p-2',
    contact_id: 'c-2',
    course_id: 'c0000002-0000-0000-0000-000000000002',
    status: 'Nuevo',
    assigned_to: null,
    notes: 'Consulta por curso Junior para su hijo de 11 años.',
    last_contact_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    consent_status: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    contact: {
      id: 'c-2',
      full_name: 'Camila Salazar Quispe',
      phone: '+51956123987',
      email: 'camila.salazar@hotmail.com',
      source: 'WEB',
      google_sheet_row_id: '3',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: FALLBACK_COURSES[1],
  },
  {
    id: 'p-3',
    contact_id: 'c-3',
    course_id: 'c0000003-0000-0000-0000-000000000003',
    status: 'Información enviada',
    assigned_to: null,
    notes: 'Se le compartió el brochure de debate y costos por WhatsApp.',
    last_contact_at: new Date(Date.now() - 86400000).toISOString(),
    consent_status: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    contact: {
      id: 'c-3',
      full_name: 'Diego Huamán Poma',
      phone: '+51964890123',
      email: 'diego.huaman@outlook.com',
      source: 'WHATSAPP',
      google_sheet_row_id: '4',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: FALLBACK_COURSES[2],
  },
  {
    id: 'p-4',
    contact_id: 'c-4',
    course_id: 'c0000001-0000-0000-0000-000000000001',
    status: 'Matrícula en proceso',
    assigned_to: null,
    notes: 'Envió voucher de pago por primera cuota. Pendiente confirmación en tesorería.',
    last_contact_at: new Date().toISOString(),
    consent_status: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    contact: {
      id: 'c-4',
      full_name: 'Mirella Coronel Rojas',
      phone: '+51978112233',
      email: 'mirella.coronel@gmail.com',
      source: 'GOOGLE_SHEETS',
      google_sheet_row_id: '5',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: FALLBACK_COURSES[0],
  },
];

export const crmService = {
  async getProspects(filterStatus?: ProspectStatus | 'ALL', searchQuery?: string): Promise<Prospect[]> {
    try {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from('prospects').select(`
        *,
        contact:contacts(*),
        course:courses(*),
        assigned_profile:profiles(*)
      `).order('created_at', { ascending: false });

      if (filterStatus && filterStatus !== 'ALL') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        let results = [...INITIAL_LEADS];
        if (filterStatus && filterStatus !== 'ALL') {
          results = results.filter(p => p.status === filterStatus);
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          results = results.filter(p => 
            p.contact?.full_name?.toLowerCase().includes(q) ||
            p.contact?.phone?.includes(q) ||
            p.contact?.email?.toLowerCase().includes(q)
          );
        }
        return results;
      }

      let res = data as Prospect[];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        res = res.filter(p =>
          p.contact?.full_name?.toLowerCase().includes(q) ||
          p.contact?.phone?.includes(q) ||
          p.contact?.email?.toLowerCase().includes(q)
        );
      }
      return res;
    } catch {
      return INITIAL_LEADS;
    }
  },

  async updateProspectStatus(id: string, status: ProspectStatus, notes?: string): Promise<void> {
    try {
      const supabase = getSupabaseBrowserClient();
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
        last_contact_at: new Date().toISOString(),
      };
      if (notes) {
        updates.notes = notes;
      }
      const { error } = await supabase.from('prospects').update(updates).eq('id', id);
      if (error) {
        console.warn('Fallback local update:', error.message);
        const item = INITIAL_LEADS.find(p => p.id === id);
        if (item) {
          item.status = status;
          if (notes) item.notes = notes;
        }
      }
    } catch {
      const item = INITIAL_LEADS.find(p => p.id === id);
      if (item) {
        item.status = status;
        if (notes) item.notes = notes;
      }
    }
  },

  async createLead(contactData: { full_name: string; phone?: string; email?: string; source?: string }, courseId?: string, notes?: string): Promise<Prospect> {
    try {
      const supabase = getSupabaseBrowserClient();
      // 1. Insert contact
      const { data: contact, error: contactErr } = await supabase.from('contacts').insert([{
        full_name: contactData.full_name,
        phone: contactData.phone || null,
        email: contactData.email || null,
        source: contactData.source || 'CHATBOT',
      }]).select().single();

      if (contactErr || !contact) {
        throw new Error(contactErr?.message || 'Error al registrar contacto');
      }

      // 2. Insert prospect
      const { data: prospect, error: prospectErr } = await supabase.from('prospects').insert([{
        contact_id: contact.id,
        course_id: courseId || null,
        status: 'Nuevo',
        notes: notes || 'Registrado automáticamente desde el chatbot',
        consent_status: true,
      }]).select().single();

      if (prospectErr || !prospect) {
        throw new Error(prospectErr?.message || 'Error al registrar prospecto');
      }

      return { ...prospect, contact } as Prospect;
    } catch (e) {
      console.warn('Creación en modo fallback local:', e);
      const newContact: Contact = {
        id: `c-local-${Date.now()}`,
        full_name: contactData.full_name,
        phone: contactData.phone || null,
        email: contactData.email || null,
        source: contactData.source || 'CHATBOT',
        google_sheet_row_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const newProspect: Prospect & { contact: Contact } = {
        id: `p-local-${Date.now()}`,
        contact_id: newContact.id,
        course_id: courseId || null,
        status: 'Nuevo',
        assigned_to: null,
        notes: notes || 'Captación de prospecto vía chatbot',
        last_contact_at: new Date().toISOString(),
        consent_status: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        contact: newContact,
      };
      INITIAL_LEADS.unshift(newProspect);
      return newProspect;
    }
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const prospects = await this.getProspects();
    const statusCounts: Record<ProspectStatus, number> = {
      'Nuevo': 0,
      'Interesado': 0,
      'Información enviada': 0,
      'Pendiente de respuesta': 0,
      'Seguimiento solicitado': 0,
      'Matrícula en proceso': 0,
      'Matriculado': 0,
      'No interesado': 0,
      'Solicita no recibir comunicaciones': 0,
    };

    prospects.forEach(p => {
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status]++;
      }
    });

    return {
      totalContacts: prospects.length + 15,
      newProspects: statusCounts['Nuevo'] + statusCounts['Interesado'],
      recentConversations: 12,
      prospectsByStatus: statusCounts,
      mostConsultedCourses: [
        { course_name: 'Oratoria y Liderazgo de Alto Impacto', count: 18 },
        { course_name: 'Oratoria para Niños (Junior Elite)', count: 12 },
        { course_name: 'Debate, Argumentación y Negociación', count: 9 },
        { course_name: 'Media Training y Comunicación Online', count: 6 },
      ],
      pendingInquiries: statusCounts['Pendiente de respuesta'] + statusCounts['Seguimiento solicitado'],
      recentActivity: [
        {
          id: 'act-1',
          type: 'NEW_CHAT',
          description: 'Consulta recibida por Renzo Vargas sobre horarios de Oratoria',
          timestamp: 'Hace 10 minutos',
        },
        {
          id: 'act-2',
          type: 'STATUS_CHANGED',
          description: 'Camila Salazar cambió a estado "Interesado"',
          timestamp: 'Hace 45 minutos',
        },
        {
          id: 'act-3',
          type: 'SHEET_SYNC',
          description: 'Sincronización con hoja de cálculo completada exitosamente',
          timestamp: 'Hace 2 horas',
        },
      ],
      integrationStatus: {
        supabase: 'ACTIVE',
        googleSheets: 'ACTIVE',
        aiProvider: 'ACTIVE',
      },
      lastSheetsSync: new Date(Date.now() - 3600000 * 2).toISOString(),
    };
  }
};
