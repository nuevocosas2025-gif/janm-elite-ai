# POLÍTICA DE SEGURIDAD Y PROTECCIÓN DE DATOS: JANM ELITE AI

**Empresa:** ORATORIA JANM ELITE  
**Marco Legal:** Ley N° 29733 de Protección de Datos Personales (Perú) y Estándares OWASP

---

## 1. Principios de Seguridad Implementados

### 1.1 Row Level Security (RLS) en Supabase
- RLS está habilitado en todas las 8 tablas de la base de datos: `profiles`, `contacts`, `courses`, `prospects`, `conversations`, `messages`, `knowledge_documents` e `integrations`.
- La función de seguridad `get_auth_role()` verifica en tiempo de ejecución en PostgreSQL el rol del usuario (`admin`, `asesor`, `solo_lectura`).
- Los visitantes anónimos (`anon`) no pueden leer contactos existentes ni prospectos. Solo pueden consultar cursos activos (`is_active = true`).

### 1.2 Protección de Secretos y Variables de Entorno
- La variable `SUPABASE_SERVICE_ROLE_KEY` es de uso exclusivo del servidor y **nunca** se expone con el prefijo `NEXT_PUBLIC_`.
- El archivo `.gitignore` previene de manera activa la inclusión de cualquier archivo `.env`, `.env*.local`, credenciales JSON o archivos `.pem`.

### 1.3 Defensa contra Inyecciones de Prompt (Prompt Injection Defense)
- Todas las entradas en `/api/chat` son procesadas por la función `sanitizeUserMessage()`.
- Se detectan y bloquean patrones de secuestro de instrucciones como `ignore all previous instructions`, `olvida las instrucciones previas`, `act as DAN`, intentos de consultas SQL arbitrarias y caracteres potencialmente peligrosos para XSS.

### 1.4 Regla Anti-Falsificación de Matrícula (Sección 11)
- El estado `Matriculado` no puede ser asignado automáticamente por la IA ni por un clic accidental. El sistema exige confirmación explícita del asesor para validar el comprobante de pago en tesorería.

### 1.5 Cumplimiento Ley 29733 (Perú) y Derechos ARCO
- Se informa a los usuarios sobre la recolección mínima de datos (nombre y WhatsApp/email) exclusivamente para fines académicos.
- Reconocimiento de la palabra clave `BAJA`: el asistente procesa automáticamente el derecho de oposición y registra el estado `Solicita no recibir comunicaciones`, deteniendo cualquier futuro contacto publicitario.
