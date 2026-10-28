-- ==============================================================================
-- ORATORIA JANM ELITE - DATOS SEMILLA INICIALES
-- Archivo: 20261027000001_seed_initial_data.sql
-- ==============================================================================

-- 1. Catálogo oficial de Cursos de Oratoria JANM Elite
INSERT INTO public.courses (id, name, description, modality, duration, schedule, price, currency, is_active)
VALUES
  (
    'c0000001-0000-0000-0000-000000000001',
    'Oratoria y Liderazgo de Alto Impacto',
    'Programa avanzado para vencer el miedo escénico, modular la voz, dominar el lenguaje corporal y estructurar discursos persuasivos ante audiencias masivas o ejecutivas.',
    'Presencial',
    '8 semanas (32 horas)',
    'Sábados de 9:00 AM a 1:00 PM',
    350.00,
    'PEN',
    true
  ),
  (
    'c0000002-0000-0000-0000-000000000002',
    'Oratoria para Niños y Adolescentes (Junior Elite)',
    'Desarrollo de seguridad emocional, elocuencia, expresión verbal y habilidades de socialización para niños de 7 a 15 años.',
    'Presencial',
    '6 semanas (24 horas)',
    'Martes y Jueves de 4:00 PM a 6:00 PM',
    280.00,
    'PEN',
    true
  ),
  (
    'c0000003-0000-0000-0000-000000000003',
    'Debate, Argumentación y Negociación Estratégica',
    'Técnicas de dialéctica parlamentaria, contraargumentación rápida, pensamiento crítico y resolución de conflictos.',
    'Híbrido',
    '4 semanas (16 horas)',
    'Viernes de 6:00 PM a 8:00 PM y Sábados Virtual',
    250.00,
    'PEN',
    true
  ),
  (
    'c0000004-0000-0000-0000-000000000004',
    'Comunicación Efectiva y Media Training Online',
    'Dominio de cámaras, webinars, podcasts y entrevistas radiales/televisivas con proyección profesional 100% en vivo.',
    'Virtual',
    '4 semanas (16 horas)',
    'Lunes y Miércoles de 7:30 PM a 9:30 PM vía Zoom',
    200.00,
    'PEN',
    true
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  schedule = EXCLUDED.schedule;

-- 2. Base de Conocimiento Inicial y Respuestas Frecuentes
INSERT INTO public.knowledge_documents (title, content, category, is_active)
VALUES
  (
    'Certificación Oficial',
    'Al finalizar satisfactoriamente cualquiera de nuestros programas con un 80% de asistencia mínima y aprobar la sustentación final, el alumno recibe un Diploma y Certificado a nombre de la Academia ORATORIA JANM ELITE con valor curricular y código QR verificable.',
    'CERTIFICACION',
    true
  ),
  (
    'Métodos de Pago y Flexibilidad',
    'Aceptamos pagos al contado mediante transferencias BCP, BBVA, Interbank, Banco de la Nación, así como aplicativos móviles Yape y Plin. También permitimos pagar en 2 cuotas quincenales para programas de 8 semanas sin intereses.',
    'PRECIOS',
    true
  ),
  (
    'Garantía de Aprendizaje y Práctica Constante',
    'Nuestra metodología es 80% práctica y 20% teórica. Cada sesión incluye dinámicas de respiración diafragmática, modulación vocal, improvisación y simulacros grabados en vídeo para autoevaluación.',
    'METODOLOGIA',
    true
  ),
  (
    'Ubicación y Sedes',
    'Nuestra sede central de atención e impartición presencial se encuentra en zona céntrica y segura, equipada con auditorio, atriles profesionales y sistema de audio de alta fidelidad. También contamos con campus virtual 24/7.',
    'GENERAL',
    true
  )
ON CONFLICT DO NOTHING;

-- 3. Estado de Integraciones
INSERT INTO public.integrations (id, provider, status, last_sync_at, last_error)
VALUES
  ('sheets_crm', 'GOOGLE_SHEETS', 'DISCONNECTED', NULL, 'Pendiente de vinculación con hoja de cálculo'),
  ('ai_engine', 'AI_GEMINI', 'ACTIVE', NOW(), NULL),
  ('supabase_db', 'SUPABASE', 'ACTIVE', NOW(), NULL)
ON CONFLICT (id) DO NOTHING;
