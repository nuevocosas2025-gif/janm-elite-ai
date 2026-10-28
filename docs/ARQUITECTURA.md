# ARQUITECTURA DEL SISTEMA: JANM ELITE AI

**Empresa:** ORATORIA JANM ELITE  
**Producto:** JANM ELITE AI  
**Tecnologías:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, Supabase Auth, Google Sheets API.  
**Presupuesto Objetivo:** S/ 0 (Costo cero permanente en tiers gratuitos y open-source).

---

## 1. Visión General de la Arquitectura

```mermaid
flowchart TB
    subgraph ClientLayer["Capa de Cliente (Responsive Web)"]
        UI_Landing["Landing Page Pública (/)\nCatálogo & Widget Flotante"]
        UI_Chat["Web Chatbot (/chat)\nAtención 24/7 & Captación"]
        UI_Admin["Panel Administrativo (/dashboard)\nCRM, Métricas, Cursos, Integraciones"]
    end

    subgraph ServerLayer["Capa de Servidor (Next.js App Router)"]
        API_Chat["/api/chat\nRate Limit & Anti-Injection"]
        API_Sync["/api/integrations/sheets/sync\nSincronización Bidireccional"]
        API_Health["/api/health\nMonitoreo de Estado"]
        Service_Tools["agentTools (12 Funciones Seguras)"]
        Service_AI["AIProvider\n(Gemini / Groq / Modo Heurístico S/ 0)"]
    end

    subgraph DataLayer["Capa de Datos & Servicios Externos"]
        Supa_DB[(Supabase PostgreSQL\n8 Tablas con RLS Activo)]
        Supa_Auth[Supabase Auth\nRoles: Admin, Asesor, Solo Lectura]
        GSheets[Google Sheets\nHoja de Contactos Existente]
    end

    UI_Landing --> API_Chat
    UI_Chat --> API_Chat
    UI_Admin --> Supa_DB
    UI_Admin --> API_Sync

    API_Chat --> Service_AI
    Service_AI --> Service_Tools
    Service_Tools --> Supa_DB
    API_Sync --> GSheets
    API_Sync --> Supa_DB
```

---

## 2. Principios de Diseño
1. **Desacoplamiento Estricto:** La lógica de negocio no depende de un proveedor de IA propietario. Si no hay conexión o API keys, el sistema conmuta automáticamente al **Modo Heurístico Sin IA**, respondiendo consultas oficiales, buscando cursos, captando datos y transfiriendo a WhatsApp sin costo.
2. **Defensa en Profundidad (Zero Trust):** Todas las tablas cuentan con Row Level Security (RLS) habilitado. Las consultas y escrituras se validan en el servidor; el cliente jamás recibe la clave `service_role`.
3. **No Invocación de Modelos Pesados en Vercel:** Para no exceder los límites de tiempo de ejecución de las Serverless Functions de Vercel (10 segundos en Hobby / 15 en Pro), las llamadas a modelos son ligeras vía API o ejecutadas por el motor de reglas en memoria.
4. **Protección de Datos Personales (Perú Ley N° 29733):** Minimización de datos en respuestas públicas, aviso de privacidad visible, y mecanismo de revocación y baja inmediata con la palabra clave `BAJA`.
