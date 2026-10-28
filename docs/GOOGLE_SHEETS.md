# GUÍA DE INTEGRACIÓN CON GOOGLE SHEETS

**Producto:** JANM ELITE AI  
**Servicio:** `src/services/googleSheets.ts`  
**Endpoint:** `POST /api/integrations/sheets/sync`

---

## 1. Funcionamiento de la Sincronización
La integración permite mantener la hoja existente de contactos de Google Drive como fuente de prospectos y sincronizarla hacia la base de datos principal de Supabase.

### Características Clave:
1. **Detección Dinámica de Cabeceras:** No requiere nombres de columnas fijos. Se leen las cabeceras de la primera fila y se mapean automáticamente (Nombre, Teléfono, Correo, Curso, Estado).
2. **Normalización de Teléfonos y Correos:**
   - Teléfonos de 9 dígitos de Perú se convierten automáticamente a formato internacional `+51XXXXXXXXX`.
   - Correos se limpian de espacios y se convierten a minúsculas.
3. **Detección y Prevención de Duplicados:**
   - Antes de insertar, el servicio evalúa si el teléfono o correo ya existen en el CRM.
   - Si existe una coincidencia, se marca como duplicado en la vista previa y se omite la inserción duplicada.
4. **Importación No Destructiva:**
   - La sincronización jamás sobrescribe ni elimina filas de la hoja original de Google Sheets.
5. **Tolerancia a Fallos:**
   - Si Google Sheets no está conectado o el ID es erróneo, la aplicación continúa funcionando normalmente mediante la pantalla de diagnóstico en `/admin/integrations`.

---

## 2. Instrucciones para Configurar la Hoja de Google Sheets (Costo S/ 0)
1. Abra su hoja de contactos en Google Drive.
2. Haga clic en **Compartir** > Cambiar a **"Cualquier usuario que tenga el enlace puede ver"** (Acceso de solo lectura público seguro).
3. Copie el enlace completo de la barra de direcciones del navegador.
4. Ingrese al panel administrativo en `/admin/integrations` y pegue la URL o el ID de la hoja.
5. Haga clic en **Probar Conexión y Leer Cabeceras**.
6. Revise la vista previa y pulse **Ejecutar Sincronización Segura**.
