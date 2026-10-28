import { describe, it, expect } from 'vitest';
import { activeAIProvider } from '../src/services/aiProvider';
import { agentTools } from '../src/services/agentTools';

describe('Simulación en vivo del Comportamiento del Agente JANM ELITE AI', () => {
  it('Escenario 1: Prospecto pregunta por cursos y precios en soles', async () => {
    const res = await activeAIProvider.sendMessage([
      { role: 'user', content: 'Buenas tardes, ¿qué cursos tienen y cuánto cuesta la mensualidad?' }
    ]);
    console.log('\n================ ESCENARIO 1: CONSULTA DE CURSOS Y PRECIOS ================');
    console.log(res.message);
    expect(res.message).toContain('Programas Oficiales en ORATORIA JANM ELITE');
    expect(res.message).toContain('350.00');
  });

  it('Escenario 2: Madre de familia consulta por curso para su hijo menor', async () => {
    const res = await activeAIProvider.sendMessage([
      { role: 'user', content: 'Hola, tengo a mi hijo de 10 años que tiene mucha timidez para exponer en el colegio, ¿tienen algún taller para él?' }
    ]);
    console.log('\n================ ESCENARIO 2: ORATORIA PARA NIÑOS (JUNIOR) ================');
    console.log(res.message);
    expect(res.message).toContain('Niños y Adolescentes');
    expect(res.message).toContain('280.00');
  });

  it('Escenario 3: Consulta sobre certificación oficial con valor curricular', async () => {
    const res = await activeAIProvider.sendMessage([
      { role: 'user', content: '¿Al terminar el curso entregan diploma o certificado? ¿Tiene valor curricular?' }
    ]);
    console.log('\n================ ESCENARIO 3: CERTIFICACIÓN OFICIAL ================');
    console.log(res.message);
    expect(res.message).toContain('Certificación Oficial');
    expect(res.message).toContain('Certificado');
  });

  it('Escenario 4: Captación de datos y registro de nuevo prospecto', async () => {
    const res = await agentTools.createProspect({
      fullName: 'Renzo Vargas Mendoza',
      phone: '984512345',
      email: 'renzo.vargas@gmail.com',
      courseName: 'Oratoria y Liderazgo de Alto Impacto',
      notes: 'Interesado en turno sábado mañana.',
    });
    console.log('\n================ ESCENARIO 4: CAPTACIÓN Y REGISTRO EN CRM ================');
    console.log(res);
    expect(res.success).toBe(true);
    expect(res.data?.prospectId).toBeDefined();
  });

  it('Escenario 5: Solicitud de atención con asesor humano', async () => {
    const res = await activeAIProvider.sendMessage([
      { role: 'user', content: 'Prefiero hablar con una persona por favor, pásame con un asesor' }
    ]);
    console.log('\n================ ESCENARIO 5: DERIVACIÓN A ASESOR HUMANO (HANDOFF) ================');
    console.log(res.message);
    console.log('Enlace generado WhatsApp:', res.handoffUrl);
    expect(res.handoffRequested).toBe(true);
    expect(res.handoffUrl).toContain('wa.me');
  });

  it('Escenario 6: Solicitud de baja conforme a Ley 29733 (Opt-out)', async () => {
    const res = await activeAIProvider.sendMessage([
      { role: 'user', content: 'No deseo recibir más mensajes, solicito la baja de mi número' }
    ]);
    console.log('\n================ ESCENARIO 6: DERECHO DE BAJA / LEY 29733 ================');
    console.log(res.message);
    expect(res.message).toContain('Solicitud de Baja Registrada');
  });
});
