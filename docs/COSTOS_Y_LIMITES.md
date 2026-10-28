# ANÁLISIS DE COSTOS, LÍMITES Y CONDICIONES DE USO: JANM ELITE AI

**Objetivo de Presupuesto:** S/ 0 (Cero Soles)  
**Documentación de Restricciones Comerciales y Alternativas**

---

## 1. Desglose de Servicios a Costo Cero

| Componente | Proveedor / Servicio | Plan | Costo Mensual | Límites Operativos Gratuitos |
| :--- | :--- | :--- | :--- | :--- |
| **Base de Datos & Auth** | Supabase PostgreSQL | Free Tier | S/ 0.00 | 500 MB base de datos, 50,000 usuarios activos mensuales, 2 proyectos activos. Pausa tras inactividad prolongada (se reactiva con 1 clic). |
| **Alojamiento Web Frontend/API** | Vercel / Cloudflare Pages | Free Tier | S/ 0.00 | Vercel: 100 GB ancho de banda mensual, 10s timeout serverless. Cloudflare: 100,000 peticiones/día. |
| **Motor de Inteligencia Artificial** | Google AI Studio (Gemini 1.5 Flash) | Free Tier | S/ 0.00 | 15 peticiones por minuto (RPM), 1 millón de tokens por minuto (TPM), 1,500 peticiones diarias. |
| **Modo de Respaldo Sin IA** | Motor Heurístico JANM | Local / In-memory | S/ 0.00 | Ilimitado. No requiere internet para procesar intenciones de catálogo, precios y FAQs. |
| **Sincronización Contactos** | Google Sheets API / CSV | Google Workspace | S/ 0.00 | Ilimitado para consultas normales de la academia. |
| **Repositorio y Versionamiento** | GitHub | Free | S/ 0.00 | Repositorios privados ilimitados, 2,000 minutos de GitHub Actions mensuales. |

---

## 2. Análisis Crítico: Vercel Hobby vs Uso Comercial (Sección 2 y 15)

### La Restricción de Vercel Hobby:
La sección 2 del manual de términos de servicio de Vercel establece que el plan gratuito (**Hobby**) está destinado a proyectos de aprendizaje, demostración o personales no lucrativos. Dado que ORATORIA JANM ELITE es una academia comercial que vende cursos y cobra matrículas:
> **Advertencia:** Operar indefinidamente en Vercel Hobby para una actividad puramente comercial de captación y cobro infringe formalmente los Términos de Servicio de Vercel.

### Alternativas Compatibles con Presupuesto Cero (S/ 0) para Uso Comercial:
1. **Cloudflare Pages:** Permite aplicaciones comerciales en su plan gratuito sin restricciones de cobro y con red CDN global.
2. **Netlify Starter:** Permite sitios de pequeñas empresas y proyectos comerciales iniciales en su tier gratuito.
3. **Docker Standalone en VPS Gratuito (Oracle Cloud Free Tier / Render / Fly.io):** Se puede ejecutar el contenedor Next.js estándar sin atarse a ningún proveedor serverless.
