/**
 * ORATORIA JANM ELITE - SERVICIO DE MENSAJERÍA AUTOMÁTICA SEGÚN ESTADO DE VENTA
 * Mensajes redactados con alta persuasión comercial, sin asteriscos (*) y con iconos llamativos.
 * Conectado con las cabeceras reales de la hoja CRM3 EVA:
 * PB/L, NOMBRES, RESPONSABLE, NUMERO, ESTADO DE VENTA, DESCRIPCION
 */

import { normalizePhone } from '@/lib/security';

export interface EvaSheetContact {
  id: string;
  codigo: string;
  nombres: string;
  responsable: string;
  numero: string;
  estadoVenta: 'NO RESPONDE' | 'PERDIDO' | 'CERRADO' | 'NUEVO' | string;
  descripcion?: string;
  mensajeGenerado?: string;
  whatsappUrl?: string;
  estadoDespacho: 'PENDIENTE' | 'EN_COLA' | 'DESPACHADO';
}

export const aiOutboundService = {
  /**
   * Genera el mensaje según el ESTADO DE VENTA exacto de la hoja de cálculo.
   * CERO ASTERISCOS (*) para cumplir con la indicación del usuario y con emojis llamativos.
   */
  generateMessageBySalesState(contact: {
    nombres: string;
    responsable: string;
    estadoVenta: string;
    descripcion?: string;
  }): string {
    const rawName = (contact.nombres || '').trim();
    const hasRealName = rawName.length > 0 && !rawName.toLowerCase().startsWith('contacto general');
    const firstName = hasRealName ? rawName.split(' ')[0] : '';
    const saludoNombre = firstName ? `¡Hola ${firstName}!` : '¡Hola!';
    const asesor = contact.responsable || 'Eva Rinza';
    const estado = (contact.estadoVenta || '').toUpperCase();

    // 1. Prospectos con estado 'PERDIDO' (Reactivación con Tarifa Especial y Beneficio Exclusivo)
    if (estado.includes('PERDIDO')) {
      return `${saludoNombre} 👋 Te saluda ${asesor} de la Academia ORATORIA JANM ELITE 🌟\n\nTe escribo porque anteriormente mostraste interés en vencer el miedo escénico y aprender a hablar con total seguridad y liderazgo ante cualquier público 🎤🏆\n\nSabemos que por tiempo o motivos personales no pudiste iniciar, pero este mes abrimos un grupo intensivo exclusivo con una tarifa preferencial especial ✨\n\n¿Te gustaría que te comparta los nuevos horarios de sábados y los beneficios de este ciclo? 📅🚀`;
    }

    // 2. Prospectos con estado 'NO RESPONDE' (Seguimiento Asertivo, Amable y de Bajo Compromiso)
    if (estado.includes('NO RESPO') || estado.includes('NO CONTESTA')) {
      return `${saludoNombre} 👋 Un cordial saludo de parte de ${asesor} en ORATORIA JANM ELITE 🌟\n\nMe comunico brevemente contigo para confirmar si aún estás evaluando capacitarte en oratoria y liderazgo este mes 🎤✨\n\nTenemos pocas vacantes disponibles en nuestras modalidades presencial y virtual con práctica real y personalizada 🏆\n\n¿Deseas que te reserve una vacante informativa sin ningún compromiso? 💬📅`;
    }

    // 3. Clientes con estado 'CERRADO' (Fidelización, Bienvenida y Confirmación de Inicio)
    if (estado.includes('CERRADO') || estado.includes('MATRICULADO')) {
      const recipient = hasRealName ? rawName : 'futuro/a líder';
      return `¡Estimado/a ${recipient}! 🎓👏 Te saluda con entusiasmo el equipo de ORATORIA JANM ELITE junto a tu asesora ${asesor} 🌟\n\nConfirmamos con alegría que tu matrícula está registrada y tu vacante asegurada para este ciclo 🏆✨\n\nEstamos preparando tu atril y micrófonos para iniciar tus prácticas reales desde la primera sesión 🎤🔥\n\n¿Tienes alguna duda sobre la hora de llegada o los materiales de tu primera clase? 💬`;
    }

    // 4. Prospecto 'NUEVO' o General
    return `${saludoNombre} 👋 Te saluda ${asesor} de la Academia ORATORIA JANM ELITE 🌟\n\nVimos tu interés en nuestros programas oficiales de oratoria y desarrollo de liderazgo para jóvenes y adultos 🎤✨\n\nNuestras clases son 100% prácticas e incluyen certificación oficial con valor curricular 🏆🥇\n\n¿Te gustaría conocer las promociones de este fin de semana y los horarios disponibles? 📅💬`;
  },

  /**
   * Prepara la lista completa de contactos enriquecida con URL oficial de WhatsApp
   */
  prepareEvaCampaign(contacts: {
    id: string;
    codigo: string;
    nombres: string;
    responsable: string;
    numero: string;
    estadoVenta: string;
    descripcion?: string;
  }[]): EvaSheetContact[] {
    return contacts.map(c => {
      const mensaje = this.generateMessageBySalesState(c);
      const cleanPhone = normalizePhone(c.numero) || c.numero.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(mensaje);
      const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;

      return {
        ...c,
        mensajeGenerado: mensaje,
        whatsappUrl,
        estadoDespacho: 'PENDIENTE',
      };
    });
  }
};
