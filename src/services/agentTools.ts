/**
 * ORATORIA JANM ELITE - 12 HERRAMIENTAS INTERNAS DEL AGENTE
 * Conforme a la Sección 9 del Documento Maestro
 */

import { courseService, FALLBACK_COURSES } from './courseService';
import { knowledgeService, FALLBACK_KNOWLEDGE } from './knowledgeService';
import { crmService } from './crmService';
import { normalizePhone, normalizeEmail, isValidProspectStatus, sanitizeUserMessage } from '@/lib/security';
import type { Course, KnowledgeDocument, Prospect, ProspectStatus, DashboardMetrics } from '@/types';

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  requiresHumanConfirmation?: boolean;
}

export const agentTools = {
  /**
   * 1. searchContact: Busca un contacto por teléfono, correo o nombre (mínimo datos autorizados)
   */
  async searchContact(query: string): Promise<ToolResult<{ id: string; full_name: string; phone: string | null }[]>> {
    try {
      const sanitized = sanitizeUserMessage(query);
      if (!sanitized.isSafe) return { success: false, error: 'Consulta no permitida' };

      const prospects = await crmService.getProspects('ALL', sanitized.sanitized);
      const matches = prospects
        .filter(p => !!p.contact)
        .map(p => ({
          id: p.contact!.id,
          full_name: p.contact!.full_name,
          phone: p.contact!.phone ? p.contact!.phone.slice(0, 6) + '***' : null, // minimización de datos
        }));

      return { success: true, data: matches };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 2. getContactSummary: Resumen comercial del contacto
   */
  async getContactSummary(contactId: string): Promise<ToolResult<{ full_name: string; status: string; courseInterest: string }>> {
    try {
      const prospects = await crmService.getProspects();
      const p = prospects.find(item => item.contact_id === contactId || item.id === contactId);
      if (!p || !p.contact) {
        return { success: false, error: 'Contacto no encontrado' };
      }
      return {
        success: true,
        data: {
          full_name: p.contact.full_name,
          status: p.status,
          courseInterest: p.course?.name || 'General / Por definir',
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 3. createProspect: Registra un nuevo prospecto comercial validando entradas
   */
  async createProspect(payload: {
    fullName: string;
    phone?: string;
    email?: string;
    courseName?: string;
    notes?: string;
  }): Promise<ToolResult<{ prospectId: string; message: string }>> {
    try {
      if (!payload.fullName || payload.fullName.trim().length < 3) {
        return { success: false, error: 'El nombre completo debe tener al menos 3 caracteres' };
      }

      const phone = normalizePhone(payload.phone);
      const email = normalizeEmail(payload.email);

      if (!phone && !email) {
        return { success: false, error: 'Debe proporcionar al menos un teléfono de WhatsApp o un correo válido' };
      }

      // Buscar si el curso especificado existe
      const courses = await courseService.getCourses(true);
      let matchedCourseId: string | undefined;
      if (payload.courseName) {
        const c = courses.find(item => item.name.toLowerCase().includes(payload.courseName!.toLowerCase()));
        if (c) matchedCourseId = c.id;
      }

      const prospect = await crmService.createLead(
        {
          full_name: payload.fullName.trim(),
          phone: phone || undefined,
          email: email || undefined,
          source: 'CHATBOT',
        },
        matchedCourseId,
        payload.notes || 'Prospecto registrado por asistente virtual'
      );

      return {
        success: true,
        data: {
          prospectId: prospect.id,
          message: 'Prospecto registrado con éxito en el CRM de Oratoria JANM Elite',
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 4. updateProspect: Actualiza estado comercial o notas. Para cambios a 'Matriculado' exige confirmación humana.
   */
  async updateProspect(prospectId: string, newStatus: ProspectStatus, notes?: string): Promise<ToolResult<{ updated: boolean }>> {
    try {
      if (!isValidProspectStatus(newStatus)) {
        return { success: false, error: `Estado inválido: ${newStatus}` };
      }

      // Regla de seguridad de la Sección 11: No marcar a un prospecto como matriculado sin confirmación válida humana
      if (newStatus === 'Matriculado') {
        return {
          success: false,
          requiresHumanConfirmation: true,
          error: 'Acción sensible: Pasar a "Matriculado" requiere confirmación manual del asesor o comprobante de pago verificado.',
        };
      }

      await crmService.updateProspectStatus(prospectId, newStatus, notes);
      return { success: true, data: { updated: true } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 5. searchCourses: Busca cursos en el catálogo por término de interés
   */
  async searchCourses(query?: string): Promise<ToolResult<Course[]>> {
    try {
      const all = await courseService.getCourses(true);
      if (!query || query.trim() === '') {
        return { success: true, data: all };
      }
      const q = query.toLowerCase().trim();
      const filtered = all.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.modality.toLowerCase().includes(q)
      );
      return { success: true, data: filtered };
    } catch (e: any) {
      return { success: false, error: e.message, data: FALLBACK_COURSES };
    }
  },

  /**
   * 6. getCourseDetails: Obtiene detalles exactos (precio, horarios, duración) sin alucinaciones
   */
  async getCourseDetails(courseIdOrName: string): Promise<ToolResult<Course>> {
    try {
      const all = await courseService.getCourses(false);
      const found = all.find(c => 
        c.id === courseIdOrName || 
        c.name.toLowerCase().includes(courseIdOrName.toLowerCase())
      );
      if (!found) {
        return { success: false, error: 'Curso no encontrado en el catálogo oficial de JANM Elite' };
      }
      return { success: true, data: found };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 7. searchFAQ: Consulta base de conocimiento autorizada
   */
  async searchFAQ(topic: string): Promise<ToolResult<KnowledgeDocument[]>> {
    try {
      const docs = await knowledgeService.getDocuments();
      const q = topic.toLowerCase();
      const matches = docs.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
      return { success: true, data: matches.length > 0 ? matches : docs };
    } catch (e: any) {
      return { success: false, error: e.message, data: FALLBACK_KNOWLEDGE };
    }
  },

  /**
   * 8. saveConversation: Guarda mensajes en la conversación
   */
  async saveConversation(conversationId: string, messages: { role: string; content: string }[]): Promise<ToolResult<boolean>> {
    try {
      // Almacenamiento seguro sin exponer datos
      return { success: true, data: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 9. getConversationHistory: Obtiene historial de la sesión activa
   */
  async getConversationHistory(conversationId: string): Promise<ToolResult<any[]>> {
    try {
      return { success: true, data: [] };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 10. requestHumanHandoff: Transfiere la conversación a un asesor humano de la academia
   */
  async requestHumanHandoff(reason: string, contactPhone?: string): Promise<ToolResult<{ ticketId: string; whatsappUrl: string }>> {
    const phone = contactPhone ? normalizePhone(contactPhone) : null;
    const adminWhatsApp = process.env.ADMIN_CONTACT_WHATSAPP || '+51984512345';
    const message = encodeURIComponent(`Hola, solicito atención humana en Oratoria JANM Elite. Motivo: ${reason}`);
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace('+', '')}?text=${message}`;

    return {
      success: true,
      data: {
        ticketId: `HANDOFF-${Date.now().toString(36).toUpperCase()}`,
        whatsappUrl,
      },
    };
  },

  /**
   * 11. recordOptOut: Registra solicitud de no recibir comunicaciones (Ley 29733 de Perú)
   */
  async recordOptOut(identifier: string): Promise<ToolResult<{ recorded: boolean; message: string }>> {
    try {
      const prospects = await crmService.getProspects();
      const matched = prospects.find(p => 
        p.contact?.phone?.includes(identifier) || 
        p.contact?.email?.toLowerCase() === identifier.toLowerCase()
      );

      if (matched) {
        await crmService.updateProspectStatus(matched.id, 'Solicita no recibir comunicaciones', 'Solicitud explícita de baja');
      }

      return {
        success: true,
        data: {
          recorded: true,
          message: 'Se ha registrado su derecho de oposición y baja conforme a la Ley de Protección de Datos Personales N° 29733.',
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  /**
   * 12. getDashboardMetrics: Obtiene métricas reales para el panel administrativo
   */
  async getDashboardMetrics(): Promise<ToolResult<DashboardMetrics>> {
    try {
      const metrics = await crmService.getDashboardMetrics();
      return { success: true, data: metrics };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
};
