# JANM ELITE AI · Plataforma de Atención y Gestión Comercial

Sistema web integral y agente inteligente desarrollado para la academia **ORATORIA JANM ELITE**. Diseñado bajo la **regla de costo cero estricto (S/ 0.00)** utilizando Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, Google Sheets API y una arquitectura de IA intercambiable (`AIProvider`) con modo heurístico de respaldo sin costo.

---

## 🌟 Características Principales

- **Chatbot Inteligente 24/7:** Atención de prospectos, explicación de programas, horarios y precios oficiales sin inventar datos. Derivación automática a WhatsApp de admisiones y captación de datos personales con consentimiento bajo la Ley N° 29733 de Perú.
- **Modo Sin IA Integrado:** Funciona al 100% incluso sin saldo ni claves de API de IA comerciales mediante un potente motor de reglas y búsqueda semántica en memoria.
- **CRM Comercial de Prospectos:** Embudo estricto con los **9 estados oficiales** (`Nuevo`, `Interesado`, `Información enviada`, `Pendiente de respuesta`, `Seguimiento solicitado`, `Matrícula en proceso`, `Matriculado`, `No interesado`, `Solicita no recibir comunicaciones`). Protección anti-falsificación que exige confirmación para marcar matrículas.
- **Sincronización con Google Sheets:** Mapeo flexible de cabeceras, normalización de números peruanos (+51), detección de duplicados e importación no destructiva.
- **Panel Administrativo Profesional:** Métricas reales calculadas desde la base de datos, administración de cursos, base de conocimiento y directorio de contactos con exportación a CSV.
- **Seguridad RBAC y RLS en Supabase:** Roles de `admin`, `asesor` y `solo_lectura` con políticas estrictas de Row Level Security y verificación en el servidor.
- **Identidad Visual de Élite:** Paleta premium en Negro (#08090C), Dorado brillante (#D4AF37) y Blanco con efectos de resplandor sutiles y diseño 100% adaptable a móviles y tablets.

---

## 📋 Requisitos Previos

- **Sistema Operativo:** Windows 10/11, macOS o Linux.
- **Node.js:** Versión 18.17+ o 20+ instalada (Verifique con `node -v`).
- **NPM:** Versión 9+ o 10+ (Verifique con `npm -v`).
- **Git:** Instalado en el sistema (Verifique con `git --version`).

---

## 🚀 Instalación y Desarrollo Local (Windows PowerShell)

### 1. Clonar o acceder a la carpeta del proyecto
```powershell
cd "C:\Users\HEINER\.gemini\antigravity\scratch\janm-elite-ai"
```

### 2. Instalar dependencias
```powershell
npm install
```

### 3. Configurar variables de entorno
Copie el archivo de ejemplo a su configuración local:
```powershell
Copy-Item .env.example .env.local
```
Edite `.env.local` con un editor de texto o VS Code:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tu_clave_aqui
GOOGLE_SHEETS_TAB_NAME=Contactos
```

### 4. Iniciar el servidor de desarrollo
```powershell
npm run dev
```
Abra su navegador en: `http://localhost:3000`

---

## 🗄️ Configuración de Supabase y Migraciones SQL

1. Cree una cuenta gratuita en [supabase.com](https://supabase.com) y cree un nuevo proyecto (Región recomendada: `sa-east-1` São Paulo).
2. En el panel de Supabase, ingrese al **SQL Editor**.
3. Copie y pegue el contenido de la migración inicial:
   `supabase/migrations/20261027000000_janm_elite_schema.sql`
4. Ejecute el script (**Run**). Esto creará las 8 tablas, los tipos enumerados, los triggers de actualización y las políticas de Row Level Security (RLS).
5. Copie y ejecute la migración de datos semilla:
   `supabase/migrations/20261027000001_seed_initial_data.sql`
6. En **Project Settings** > **API**, copie la **Project URL** y la **Publishable Key (Anon)** a su `.env.local`.

---

## 🧪 Ejecución de Pruebas Automatizadas

El proyecto cuenta con una suite completa de 20 pruebas que verifican seguridad, RLS, normalización de contactos, herramientas internas del agente y modo sin IA:

```powershell
npm test
```

---

## 📦 Compilación para Producción (Build)

Para comprobar que no existan errores de tipado TypeScript ni dependencias rotas:
```powershell
npm run build
```
Para iniciar el servidor en modo producción local:
```powershell
npm run start
```

---

## ☁️ Despliegue en Vercel y GitHub

### Preparación del Repositorio Git
```powershell
git init
git add .
git commit -m "feat: JANM ELITE AI MVP completo con CRM, Supabase y modo sin IA"
```

> **Verificación de Seguridad:** Antes de hacer push, verifique que `.env.local` no esté en seguimiento:
> ```powershell
> git status
> ```

### Vinculación con GitHub y Vercel
1. Cree un repositorio privado en su cuenta de GitHub.
2. Suba su código:
   ```powershell
   git remote add origin https://github.com/TU_USUARIO/janm-elite-ai.git
   git branch -M main
   git push -u origin main
   ```
3. En [vercel.com](https://vercel.com), importe el repositorio, configure las variables de entorno de la tabla en `docs/DESPLIEGUE.md` y haga clic en **Deploy**.
4. Revise las consideraciones comerciales del plan Vercel Hobby y sus alternativas gratuitas en `docs/COSTOS_Y_LIMITES.md`.

---

## 📚 Documentación Técnica Detallada

- [Arquitectura del Sistema](docs/ARQUITECTURA.md)
- [Modelo de Datos Relacional](docs/MODELO_DE_DATOS.md)
- [Integración con Google Sheets](docs/GOOGLE_SHEETS.md)
- [Seguridad y Privacidad (Ley 29733)](docs/SEGURIDAD.md)
- [Costos, Límites y Alternativas a Vercel Hobby](docs/COSTOS_Y_LIMITES.md)
- [Guía de Despliegue](docs/DESPLIEGUE.md)
- [Protocolo y Reporte de Pruebas](docs/PRUEBAS.md)

---

## 🛠️ Solución de Problemas Frecuentes

- **Error: "Could not find the table 'public.contacts'"**: Asegúrese de haber ejecutado el archivo `supabase/migrations/20261027000000_janm_elite_schema.sql` en el SQL Editor de Supabase. El sistema incluye un fallback local para permitir la navegación y pruebas incluso si la base de datos aún no ha sido migrada.
- **El Chatbot no responde con IA**: Si no configuró `GEMINI_API_KEY`, el sistema utiliza automáticamente el **Modo Heurístico Sin IA**, respondiendo consultas sobre cursos, precios, horarios, certificaciones y captando prospectos a costo cero.
- **Problema de permisos en el panel**: En el inicio de sesión (`/login`), puede utilizar los botones de **Acceso Rápido por Rol** para probar los privilegios de Administrador, Asesor o Solo Lectura.
