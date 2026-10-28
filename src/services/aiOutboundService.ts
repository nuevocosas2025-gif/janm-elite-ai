/**
 * ORATORIA JANM ELITE - AGENTE DE SEGUIMIENTO Y MENSAJERÍA AUTOMÁTICA
 * Conecta los contactos de Google Sheets y redacta mensajes de WhatsApp personalizados con IA.
 */

import { normalizePhone } from '@/lib/security';

export interface OutboundContact {
  id: string;
  fullName: string;
  phone: string;
  courseInterest: string;
  lastStatus: string;
  notes?: string;
  generatedMessage?: string;
  whatsappUrl?: string;
}

export const aiOutboundService = {
  /**
   * Genera un mensaje altamente persuasivo y personalizado con IA para cada cliente de la hoja de cálculo
   */
  generatePersonalizedMessage(contact: {
    fullName: string;
    courseInterest?: string;
    notes?: string;
    lastStatus?: string;
  }): string {
    const firstName = contact.fullName.split(' ')[0] || contact.fullName;
    const course = contact.courseInterest || 'nuestros programas de Oratoria y Liderazgo';

    // Personalización según el tipo de curso
    if (course.toLowerCase().includes('niño') || course.toLowerCase().includes('junior') || course.toLowerCase().includes('adolescente')) {
      return `¡Hola ${firstName}! 👋 Te saluda el equipo de admisiones de *ORATORIA JANM ELITE*. Vimos que estabas interesada/o en el programa de *Oratoria para Niños y Adolescentes (Junior Elite)* para potenciar la seguridad y desenvolvimiento de tu hijo/a. 🌟\n\nEstamos abriendo cupos exclusivos para el nuevo ciclo de este mes con dinámicas 100% prácticas. ¿Te gustaría que te reserve una vacante con la tarifa promocional de S/ 280?`;
    }

    if (course.toLowerCase().includes('debate') || course.toLowerCase().includes('argumentaci')) {
      return `¡Hola ${firstName}! 🎯 Un saludo de *ORATORIA JANM ELITE*. Notamos tu interés en el programa especializado de *Debate, Argumentación y Negociación*. Queremos consultarte si aún estás buscando mejorar tus habilidades dialécticas y persuasión para tus proyectos profesionales. Tenemos vacantes abiertas para este viernes. ¿Te envío el temario detallado?`;
    }

    if (course.toLowerCase().includes('online') || course.toLowerCase().includes('media') || course.toLowerCase().includes('virtual')) {
      return `¡Hola ${firstName}! 🎙️ Te saluda *ORATORIA JANM ELITE*. Te escribimos respecto al programa de *Media Training y Comunicación Efectiva Online*. Las clases en vivo vía Zoom inician esta semana y aún nos quedan 3 cupos con certificación oficial. ¿Te gustaría participar de la sesión informativa?`;
    }

    // Mensaje por defecto para Oratoria de Alto Impacto
    return `¡Hola ${firstName}! 👋 Un cordial saludo de la academia *ORATORIA JANM ELITE*. Nos comunicamos contigo porque registraste tu interés en nuestro programa insignia *Oratoria y Liderazgo de Alto Impacto* para vencer el miedo escénico y hablar con autoridad ante cualquier público. 🏆\n\nLas clases de los sábados por la mañana inician pronto. ¿Deseas que te reservemos tu vacante o tienes alguna duda sobre los horarios?`;
  },

  /**
   * Prepara la lista de envíos generando enlaces directos de WhatsApp Click-to-Chat
   */
  prepareCampaign(contacts: {
    id: string;
    fullName: string;
    phone: string;
    courseInterest: string;
    lastStatus: string;
    notes?: string;
  }[]): OutboundContact[] {
    return contacts.map(c => {
      const message = this.generatePersonalizedMessage(c);
      const cleanPhone = normalizePhone(c.phone) || c.phone.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;

      return {
        ...c,
        generatedMessage: message,
        whatsappUrl,
      };
    });
  }
};
