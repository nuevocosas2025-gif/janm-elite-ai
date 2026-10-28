import { describe, it, expect } from 'vitest';
import { agentTools } from '../src/services/agentTools';

describe('12 Herramientas Internas Seguras del Agente (Sección 9)', () => {
  it('searchCourses devuelve cursos oficiales autorizados', async () => {
    const res = await agentTools.searchCourses('liderazgo');
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data!.length).toBeGreaterThan(0);
    expect(res.data![0].name).toContain('Oratoria y Liderazgo');
  });

  it('getCourseDetails devuelve detalles precisos de precios y horarios', async () => {
    const res = await agentTools.getCourseDetails('Oratoria y Liderazgo');
    expect(res.success).toBe(true);
    expect(res.data?.price).toBe(350);
    expect(res.data?.currency).toBe('PEN');
    expect(res.data?.schedule).toContain('Sábados');
  });

  it('searchFAQ recupera respuestas oficiales sobre certificación', async () => {
    const res = await agentTools.searchFAQ('certificacion');
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    const doc = res.data!.find(d => d.category === 'CERTIFICACION');
    expect(doc?.content).toContain('Certificado');
  });

  it('createProspect valida datos requeridos y rechaza entradas sin teléfono ni correo', async () => {
    const invalidRes = await agentTools.createProspect({
      fullName: 'Juan Pérez',
    });
    expect(invalidRes.success).toBe(false);
    expect(invalidRes.error).toContain('WhatsApp o un correo');

    const validRes = await agentTools.createProspect({
      fullName: 'Carlos Mendoza',
      phone: '987654321',
      courseName: 'Debate',
    });
    expect(validRes.success).toBe(true);
    expect(validRes.data?.prospectId).toBeDefined();
  });

  it('updateProspect exige confirmación humana antes de pasar a "Matriculado" (Regla Sección 11)', async () => {
    const res = await agentTools.updateProspect('p-1', 'Matriculado');
    expect(res.success).toBe(false);
    expect(res.requiresHumanConfirmation).toBe(true);
    expect(res.error).toContain('requiere confirmación manual');
  });

  it('recordOptOut procesa el derecho de oposición y baja de comunicaciones (Ley 29733)', async () => {
    const res = await agentTools.recordOptOut('984512345');
    expect(res.success).toBe(true);
    expect(res.data?.recorded).toBe(true);
    expect(res.data?.message).toContain('Ley de Protección de Datos Personales');
  });

  it('requestHumanHandoff genera enlace seguro de derivación a WhatsApp', async () => {
    const res = await agentTools.requestHumanHandoff('Consulta sobre pagos');
    expect(res.success).toBe(true);
    expect(res.data?.whatsappUrl).toContain('wa.me');
  });

  it('getDashboardMetrics calcula métricas reales sin inventar valores', async () => {
    const res = await agentTools.getDashboardMetrics();
    expect(res.success).toBe(true);
    expect(res.data?.totalContacts).toBeGreaterThan(0);
    expect(res.data?.prospectsByStatus).toBeDefined();
  });
});
