import { describe, it, expect } from 'vitest';
import { HeuristicRuleBasedProvider } from '../src/services/aiProvider';

describe('AIProvider y Modo Sin IA (Heurístico a Costo S/ 0)', () => {
  const provider = new HeuristicRuleBasedProvider();

  it('responde a consultas de precios y catálogo sin inventar datos', async () => {
    const res = await provider.sendMessage([
      { role: 'user', content: '¿Cuáles son los cursos y cuánto cuesta el taller?' }
    ]);
    expect(res.provider).toBe('no_ia_heuristic');
    expect(res.message).toContain('Programas Oficiales en ORATORIA JANM ELITE');
    expect(res.message).toContain('350.00');
    expect(res.matchedCourses).toBeDefined();
    expect(res.matchedCourses!.length).toBeGreaterThan(0);
  });

  it('identifica consultas sobre cursos para niños y jóvenes', async () => {
    const res = await provider.sendMessage([
      { role: 'user', content: '¿Tienen clases para mi hijo de 10 años?' }
    ]);
    expect(res.message).toContain('Niños y Adolescentes');
    expect(res.message).toContain('280.00');
  });

  it('detecta intención de atención humana y ofrece botón de WhatsApp', async () => {
    const res = await provider.sendMessage([
      { role: 'user', content: 'Deseo hablar con un asesor o una persona' }
    ]);
    expect(res.handoffRequested).toBe(true);
    expect(res.handoffUrl).toContain('wa.me');
  });

  it('reconoce solicitud de baja (Opt-out) y confirma cumplimiento', async () => {
    const res = await provider.sendMessage([
      { role: 'user', content: 'Solicito la baja de mis datos no deseo mensajes' }
    ]);
    expect(res.message).toContain('Solicitud de Baja Registrada');
    expect(res.message).toContain('Ley de Protección de Datos Personales');
  });

  it('responde sobre metodología práctica y vencer el miedo escénico', async () => {
    const res = await provider.sendMessage([
      { role: 'user', content: '¿Cómo me ayudan a vencer el miedo escénico y los nervios?' }
    ]);
    expect(res.message).toContain('80% Práctica, 20% Teoría');
    expect(res.message).toContain('Respiración diafragmática');
  });
});
