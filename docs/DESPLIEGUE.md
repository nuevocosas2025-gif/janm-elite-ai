# GUÍA DE DESPLIEGUE EN PRODUCCIÓN: JANM ELITE AI

**Objetivo:** Despliegue seguro a costo cero en Vercel o plataformas compatibles (Cloudflare Pages, Netlify o Docker).

---

## 1. Despliegue en Vercel (Integración GitHub–Vercel)

### Paso 1: Configurar el Repositorio en GitHub
1. Cree un nuevo repositorio en GitHub (se recomienda privado para mayor seguridad).
2. Conecte su repositorio local:
   ```powershell
   git remote add origin https://github.com/TU_USUARIO/janm-elite-ai.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Importar Proyecto en Vercel
1. Inicie sesión en [vercel.com](https://vercel.com) con su cuenta de GitHub.
2. Haga clic en **Add New...** > **Project**.
3. Seleccione el repositorio `janm-elite-ai`.
4. El framework preset detectará automáticamente **Next.js**.

### Paso 3: Configurar Variables de Entorno en Vercel
En la sección **Environment Variables**, configure las siguientes variables (obtenidas de Supabase y Google):

| Nombre de Variable | Tipo | Descripción |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Público | URL del proyecto Supabase (ej: `https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Público | Anon/Publishable Key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secreto** | Service Role Key (solo si se ejecutan tareas administrativas en servidor) |
| `GOOGLE_SHEETS_ID` | Secreto | ID del documento de Google Sheets a sincronizar |
| `GOOGLE_SHEETS_TAB_NAME` | Config | Nombre de la pestaña (por defecto: `Contactos`) |
| `GEMINI_API_KEY` | Secreto Opcional | Clave gratuita de Google AI Studio |
| `ADMIN_CONTACT_WHATSAPP` | Config | Número oficial de WhatsApp para derivaciones (`+51984512345`) |

> **IMPORTANTE (SECCIÓN 15):** ¡Nunca exponga secretos con el prefijo `NEXT_PUBLIC_`!

### Paso 4: Desplegar y Verificar
1. Haga clic en **Deploy**.
2. Al finalizar, verifique el endpoint de estado:
   `https://tu-dominio.vercel.app/api/health`
3. Compruebe que devuelva `status: "HEALTHY"`.

---

## 2. Despliegue Alternativo en Cloudflare Pages (Comercial 100% Gratuito)
1. En el panel de Cloudflare, vaya a **Workers & Pages** > **Create application** > **Pages**.
2. Conecte el repositorio GitHub.
3. Build command: `npx @cloudflare/next-on-pages` o build estándar de Next.js.
4. Ingrese las variables de entorno de la tabla anterior.
