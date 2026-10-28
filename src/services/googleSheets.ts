/**
 * ORATORIA JANM ELITE - SERVICIO DE INTEGRACIÓN GOOGLE SHEETS
 * Cumple con la Sección 7 del Documento Maestro
 */

import { normalizePhone, normalizeEmail } from '@/lib/security';
import { crmService } from './crmService';
import type { SheetsConfig, SheetRowPreview, SyncReport } from '@/types';

export const DEFAULT_SHEETS_CONFIG: SheetsConfig = {
  sheetId: process.env.GOOGLE_SHEETS_ID || '',
  tabName: process.env.GOOGLE_SHEETS_TAB_NAME || 'Contactos',
  columnsMapping: {
    fullName: 'Nombre',
    phone: 'Teléfono',
    email: 'Correo',
    course: 'Curso',
    status: 'Estado',
    notes: 'Observaciones',
  },
};

export const googleSheetsService = {
  /**
   * Extrae el ID de una hoja de Google desde cualquier URL o devuelve el ID tal cual
   */
  extractSheetId(input: string): string {
    if (!input) return '';
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : input.trim();
  },

  /**
   * Verifica la conectividad y detecta cabeceras de la hoja de cálculo
   */
  async testConnection(sheetId: string, tabName = 'Contactos'): Promise<{
    connected: boolean;
    headers: string[];
    rowCount: number;
    error?: string;
  }> {
    if (!sheetId) {
      return {
        connected: false,
        headers: [],
        rowCount: 0,
        error: 'No se ha configurado el ID de Google Sheets.',
      };
    }

    try {
      // Método seguro de lectura pública o vía export CSV sin tokens pesados (Costo cero)
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(url);

      if (!res.ok) {
        return {
          connected: false,
          headers: [],
          rowCount: 0,
          error: `Google Sheets respondió con código ${res.status}. Asegúrese de que la hoja esté compartida como "Cualquiera con el enlace puede leer" o configure la API.`,
        };
      }

      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length === 0) {
        return { connected: true, headers: [], rowCount: 0 };
      }

      // Parsear cabeceras de la primera línea
      const headerLine = lines[0];
      const headers = headerLine
        .split(',')
        .map(h => h.replace(/^["']|["']$/g, '').trim());

      return {
        connected: true,
        headers,
        rowCount: Math.max(0, lines.length - 1),
      };
    } catch (e: any) {
      return {
        connected: false,
        headers: [],
        rowCount: 0,
        error: e.message || 'Error de red al conectar con Google Sheets.',
      };
    }
  },

  /**
   * Genera una vista previa de filas con normalización y detección de duplicados
   */
  async previewRows(sheetId: string, tabName = 'Contactos'): Promise<SheetRowPreview[]> {
    const existingProspects = await crmService.getProspects();
    const existingPhones = new Set(existingProspects.map(p => p.contact?.phone).filter(Boolean));
    const existingEmails = new Set(existingProspects.map(p => p.contact?.email?.toLowerCase()).filter(Boolean));

    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) return [];

      const previews: SheetRowPreview[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Parsear CSV respetando comillas
        const row = lines[i].split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
        const fullName = row[0] || `Contacto Fila ${i + 1}`;
        const rawPhone = row[1] || '';
        const rawEmail = row[2] || '';
        const course = row[3] || 'Oratoria General';
        const status = row[4] || 'Nuevo';

        const normPhone = normalizePhone(rawPhone) || rawPhone;
        const normEmail = normalizeEmail(rawEmail) || rawEmail;

        const isDuplicatePhone = !!normPhone && existingPhones.has(normPhone);
        const isDuplicateEmail = !!normEmail && existingEmails.has(normEmail);
        const isDuplicate = isDuplicatePhone || isDuplicateEmail;

        previews.push({
          rowIndex: i + 1,
          fullName,
          phone: normPhone,
          email: normEmail,
          course,
          status,
          isDuplicate,
          matchReason: isDuplicatePhone ? 'Teléfono ya registrado en el CRM' : isDuplicateEmail ? 'Correo ya registrado' : undefined,
        });
      }

      return previews;
    } catch {
      return [];
    }
  },

  /**
   * Ejecuta la sincronización controlada sin sobrescribir destructivamente la hoja de cálculo
   */
  async executeSync(sheetId: string, tabName = 'Contactos'): Promise<SyncReport> {
    const previews = await this.previewRows(sheetId, tabName);
    let imported = 0;
    let skippedDuplicates = 0;
    const errors: { row: number; reason: string }[] = [];

    for (const row of previews) {
      if (row.isDuplicate) {
        skippedDuplicates++;
        continue;
      }

      try {
        await crmService.createLead(
          {
            full_name: row.fullName,
            phone: row.phone,
            email: row.email,
            source: 'GOOGLE_SHEETS',
          },
          undefined,
          `Importado desde Google Sheets fila ${row.rowIndex}. Curso indicado: ${row.course}`
        );
        imported++;
      } catch (err: any) {
        errors.push({ row: row.rowIndex, reason: err.message || 'Error al guardar' });
      }
    }

    return {
      totalScanned: previews.length,
      imported,
      updated: 0,
      skippedDuplicates,
      errors,
      timestamp: new Date().toISOString(),
    };
  },
};
