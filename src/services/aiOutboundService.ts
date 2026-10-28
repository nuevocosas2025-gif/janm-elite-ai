/**
 * ORATORIA JANM ELITE - SERVICIO DE MENSAJERÍA AUTOMÁTICA SEGÚN ESTADO DE VENTA
 * Adaptado a la estructura real de la hoja: NOMBRES, RESPONSABLE, NUMERO, ESTADO DE VENTA, DESCRIPCION.
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
   * Genera el mensaje según el ESTADO DE VENTA exacto de la hoja de cálculo
   */
  generateMessageBySalesState(contact: {
    nombres: string;
    responsable: string;
    estadoVenta: string;
    descripcion?: string;
  }): string {
    const nombreLimpio = contact.nombres.trim();
    const saludoNombre = nombreLimpio ? `¡Hola ${nombreLimpio.split(' ')[0]}!` : '¡Hola!';
    const asesor = contact.responsable || 'Eva Rinza';
    const estado = (contact.estadoVenta || '').toUpperCase();

    // 1. Prospectos con estado 'PERDIDO' (Estrategia: Reactivación con Tarifa Especial)
    if (estado.includes('PERDIDO')) {
      return `${saludoNombre} 👋 Te saluda ${asesor} de la Academia *ORATORIA JANM ELITE*. Te escribo porque anteriormente mostraste interés en vencer el miedo escénico y hablar con poder en público. 🏆\n\nSabemos que por tiempo o motivos personales no pudiste iniciar, pero este mes abrimos un *grupo intensivo con una tarifa preferencial exclusiva*. ¿Te gustaría que te comparta los nuevos horarios de sábados?`;
    }

    // 2. Prospectos con estado 'NO RESPONDE' (Estrategia: Seguimiento Asertivo de Bajo Compromiso)
    if (estado.includes('NO RESPO') || estado.includes('NO CONTESTA')) {
      return `${saludoNombre} 👋 Un cordial saludo de parte de ${asesor} en *ORATORIA JANM ELITE*. Me comunico brevemente contigo para confirmar si aún estás evaluando capacitarte en oratoria y liderazgo este mes. Tenemos vacantes limitadas en modalidad presencial y virtual. ¿Deseas que te reserve una vacante informativa sin compromiso?`;
    }

    // 3. Clientes con estado 'CERRADO' (Estrategia: Fidelización y Confirmación de Inicio)
    if (estado.includes('CERRADO') || estado.includes('MATRICULADO')) {
      return `Estimado/a ${nombreLimpio || 'Alumno/a'}, ¡un saludo de la Academia *ORATORIA JANM ELITE*! 🎓 Confirmamos que tu proceso de matrícula ha sido gestionado con éxito junto a tu asesora ${asesor}. Estamos listos para recibirte en el salón con atriles y micrófono en mano para iniciar tu transformación oratoria. ¿Tienes alguna consulta sobre la primera clase?`;
    }

    // 4. Prospecto 'NUEVO' o General
    return `${saludoNombre} 👋 Te saluda ${asesor} de la Academia *ORATORIA JANM ELITE*. Vimos tu registro de interés en nuestros programas oficiales de oratoria para adultos y jóvenes. 🌟 ¿Te gustaría conocer los horarios de este fin de semana y la certificación oficial con valor curricular?`;
  },

  /**
   * Prepara la lista completa de contactos enriquecida
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
