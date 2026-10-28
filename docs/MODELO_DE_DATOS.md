# MODELO DE DATOS RELACIONAL: JANM ELITE AI

**Base de Datos:** Supabase PostgreSQL  
**Esquema:** `public`  
**Migración Inicial:** `supabase/migrations/20261027000000_janm_elite_schema.sql`

---

## 1. Diagrama Entidad-Relación

```mermaid
erDiagram
    profiles ||--o{ prospects : "asignado a"
    profiles ||--o{ conversations : "atendida por"
    contacts ||--o{ prospects : "tiene"
    contacts ||--o{ conversations : "inicia"
    courses ||--o{ prospects : "interesado en"
    conversations ||--o{ messages : "contiene"

    profiles {
        uuid id PK
        text full_name
        user_role_type role
        timestamptz created_at
        timestamptz updated_at
    }

    contacts {
        uuid id PK
        text full_name
        text phone
        text email
        text source
        text google_sheet_row_id
        timestamptz created_at
        timestamptz updated_at
    }

    courses {
        uuid id PK
        text name
        text description
        text modality
        text duration
        text schedule
        numeric price
        text currency
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    prospects {
        uuid id PK
        uuid contact_id FK
        uuid course_id FK
        prospect_status_type status
        uuid assigned_to FK
        text notes
        timestamptz last_contact_at
        boolean consent_status
        timestamptz created_at
        timestamptz updated_at
    }

    conversations {
        uuid id PK
        uuid contact_id FK
        text channel
        text status
        timestamptz started_at
        timestamptz last_message_at
        uuid assigned_to FK
    }

    messages {
        uuid id PK
        uuid conversation_id FK
        text sender_type
        text content
        jsonb metadata
        timestamptz created_at
    }

    knowledge_documents {
        uuid id PK
        text title
        text content
        text category
        boolean is_active
        timestamptz updated_at
    }

    integrations {
        text id PK
        text provider
        text status
        timestamptz last_sync_at
        text last_error
        timestamptz updated_at
    }
```

---

## 2. Los 9 Estados Oficiales del Prospecto Comercial
Conforme a la Sección 11 del Documento Maestro:
1. `Nuevo`: Acaba de registrarse mediante el chatbot o formulario web.
2. `Interesado`: Ha realizado consultas específicas sobre un curso o temario.
3. `Información enviada`: Se le remitieron precios, horarios y brochures oficiales por WhatsApp o correo.
4. `Pendiente de respuesta`: Se espera confirmación de fecha o decisión del interesado.
5. `Seguimiento solicitado`: El interesado pidió que se le contacte en un horario o fecha posterior.
6. `Matrícula en proceso`: Se acordó la modalidad de pago o envió voucher provisional.
7. `Matriculado`: **Estado protegido.** Requiere confirmación manual del comprobante en tesorería.
8. `No interesado`: Desiste de tomar el programa en el ciclo actual.
9. `Solicita no recibir comunicaciones`: **Cumplimiento Ley 29733 (Perú).** Baja comercial inmediata.
