import { describe, it, expect } from 'vitest';
import { googleSheetsService } from '../src/services/googleSheets';

describe('Integración con Google Sheets (Sección 7)', () => {
  it('extrae el ID único de cualquier formato de URL compartida de Google Drive', () => {
    const url1 = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
    expect(googleSheetsService.extractSheetId(url1)).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');

    const url2 = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
    expect(googleSheetsService.extractSheetId(url2)).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');

    // ID directo
    expect(googleSheetsService.extractSheetId('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')).toBe('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  });

  it('maneja limpiamente la falta de ID sin lanzar excepciones no controladas', async () => {
    const res = await googleSheetsService.testConnection('');
    expect(res.connected).toBe(false);
    expect(res.error).toContain('No se ha configurado el ID');
  });
});
