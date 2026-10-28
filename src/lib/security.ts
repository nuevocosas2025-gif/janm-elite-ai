/**
 * ORATORIA JANM ELITE - MÓDULO DE SEGURIDAD Y PRIVACIDAD
 * Cumple con Secciones 6, 10, 13 y 17 del Documento Maestro
 */

import type { UserRole, ProspectStatus } from '@/types';

// Lista de inyecciones de prompt conocidas y patrones sospechosos
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /olvida\s+(todas\s+las\s+)?instrucciones\s+(anteriores|previas)/i,
  /actúa\s+como\s+un\s+modo\s+dan/i,
  /act\s+as\s+DAN/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /revela\s+(el\s+)?system\s+prompt/i,
  /show\s+your\s+system\s+instructions/i,
  /dame\s+las\s+claves\s+de\s+api/i,
  /show\s+api\s+keys/i,
  /DROP\s+TABLE/i,
  /SELECT\s+\*\s+FROM\s+profiles/i,
];

/**
 * Sanitiza y verifica si el mensaje del usuario intenta vulnerar las instrucciones del agente
 */
export function sanitizeUserMessage(input: string): { isSafe: boolean; sanitized: string; reason?: string } {
  if (!input || typeof input !== 'string') {
    return { isSafe: false, sanitized: '', reason: 'Mensaje vacío o formato inválido' };
  }

  const trimmed = input.trim().slice(0, 1000); // Límite razonable de longitud para prevenir DoS

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitized: 'Consulta no permitida por políticas de seguridad.',
        reason: 'Intento de manipulación de instrucciones detectado.',
      };
    }
  }

  // Escapar caracteres peligrosos
  const clean = trimmed
    .replace(/[<>]/g, '') // previene inyecciones HTML en interfaces
    .trim();

  return { isSafe: true, sanitized: clean };
}

/**
 * Normaliza y valida números de teléfono de Perú (+51 o 9 dígitos)
 */
export function normalizePhone(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');

  // Número peruano de 9 dígitos que empieza con 9
  if (digits.length === 9 && digits.startsWith('9')) {
    return `+51${digits}`;
  }
  // Si ya tiene código de país 51
  if (digits.length === 11 && digits.startsWith('519')) {
    return `+${digits}`;
  }
  if (digits.length >= 7) {
    return digits;
  }
  return null;
}

/**
 * Normaliza y valida correos electrónicos
 */
export function normalizeEmail(rawEmail: string | null | undefined): string | null {
  if (!rawEmail) return null;
  const cleaned = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Valida los 9 estados oficiales de un prospecto comercial
 */
export const VALID_PROSPECT_STATUSES: readonly ProspectStatus[] = [
  'Nuevo',
  'Interesado',
  'Información enviada',
  'Pendiente de respuesta',
  'Seguimiento solicitado',
  'Matrícula en proceso',
  'Matriculado',
  'No interesado',
  'Solicita no recibir comunicaciones',
] as const;

export function isValidProspectStatus(status: string): status is ProspectStatus {
  return VALID_PROSPECT_STATUSES.includes(status as ProspectStatus);
}

/**
 * Verifica permisos basados en rol en el servidor
 */
export function canManageUsers(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageCourses(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageProspects(role?: UserRole): boolean {
  return role === 'admin' || role === 'asesor';
}

export function canViewData(role?: UserRole): boolean {
  return role === 'admin' || role === 'asesor' || role === 'solo_lectura';
}

/**
 * Cláusula de Privacidad y Consentimiento de Datos Personales (Perú Ley 29733)
 */
export const PRIVACY_POLICY_NOTICE = `De conformidad con la Ley N° 29733 de Protección de Datos Personales de Perú, ORATORIA JANM ELITE recopila su nombre, teléfono y correo electrónico únicamente con el propósito de brindarle asesoría académica, resolver dudas sobre nuestros cursos y enviarle la información solicitada. Sus datos no serán transferidos a terceros. Puede revocar su consentimiento o solicitar la eliminación de sus datos en cualquier momento enviando la palabra "BAJA" o comunicándose con nuestra administración.`;
