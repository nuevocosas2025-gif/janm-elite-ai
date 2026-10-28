# REPORTE Y PROTOCOLO DE PRUEBAS: JANM ELITE AI

**Framework de Pruebas:** Vitest v3.2.7  
**Estado:** 20/20 Pruebas automatizadas ejecutadas y aprobadas.

---

## 1. Resumen de Ejecución de Pruebas Automatizadas

```text
 ✓ tests/security.test.ts (5 tests)
 ✓ tests/googleSheets.test.ts (2 tests)
 ✓ tests/aiProvider.test.ts (5 tests)
 ✓ tests/agentTools.test.ts (8 tests)

 Test Files  4 passed (4)
      Tests  20 passed (20)
   Duration  6.42s
```

---

## 2. Cobertura por Módulo

### 2.1 Seguridad y Privacidad (`tests/security.test.ts`)
- **Normalización de Teléfonos:** Verificación de conversión de formatos peruanos a `+51XXXXXXXXX`.
- **Normalización de Correos:** Validación de correos RFC y eliminación de espacios en blanco.
- **Validación de Estados Comerciales:** Comprobación estricta de que solo los 9 estados autorizados son admitidos.
- **Defensa Anti-Prompt Injection:** Detección de patrones maliciosos (`ignore instructions`, `act as DAN`, intentos de `DROP TABLE`).
- **Verificación de Roles en Servidor:** Validación de permisos para `admin`, `asesor` y `solo_lectura` sin posibilidad de escalamiento desde el cliente.

### 2.2 Herramientas Internas del Agente (`tests/agentTools.test.ts`)
- **Búsqueda y Detalle de Cursos:** Catálogo con precios en Soles (PEN), horarios y duración sin inventar datos.
- **Base de Conocimiento y Certificación:** Búsqueda en FAQs autorizadas.
- **Captación de Prospectos:** Validación obligatoria de teléfono o email.
- **Regla Anti-Falsificación de Matrícula (Sección 11):** Bloqueo y solicitud de confirmación humana obligatoria antes de marcar `Matriculado`.
- **Derecho de Oposición (Ley 29733 de Perú):** Registro de opt-out y detención de comunicaciones.
- **Métricas Reales del Dashboard:** Cálculo sin valores simulados.

### 2.3 Proveedor de IA y Modo Sin IA (`tests/aiProvider.test.ts`)
- **Modo Heurístico a Costo S/ 0:** Respuestas sobre programas, metodología 80/20, precios y miedo escénico.
- **Derivación a Asesor Humano:** Detección de intención y generación de enlace a WhatsApp.
- **Cumplimiento de Baja:** Respuesta inmediata ante solicitud de retiro de datos.

### 2.4 Integración con Google Sheets (`tests/googleSheets.test.ts`)
- **Extracción de ID:** Soporte para enlaces compartidos de Google Drive, enlaces edit y raw IDs.
- **Manejo de Errores Sin Conexión:** Tolerancia a fallos cuando no hay hoja configurada.

---

## 3. Instrucciones para Ejecutar las Pruebas en Windows
Abra una terminal de PowerShell en el directorio del proyecto y ejecute:
```powershell
npm test
```
Para ver los tests en modo observador continuo durante el desarrollo:
```powershell
npx vitest
```
