-- ==============================================================================
-- ORATORIA JANM ELITE - MIGRACIÓN INICIAL SUPABASE POSTGRESQL CON RLS
-- Archivo: 20261027000000_janm_elite_schema.sql
-- Cumple con Secciones 5, 6, 11 y 13 del Documento Maestro
-- ==============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerados para consistencia estricta
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('admin', 'asesor', 'solo_lectura');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE prospect_status_type AS ENUM (
    'Nuevo',
    'Interesado',
    'Información enviada',
    'Pendiente de respuesta',
    'Seguimiento solicitado',
    'Matrícula en proceso',
    'Matriculado',
    'No interesado',
    'Solicita no recibir comunicaciones'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla: profiles (Usuarios administrativos y roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'asesor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla: contacts (Contactos de la academia)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'CHATBOT',
  google_sheet_row_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- 5. Tabla: courses (Catálogo oficial de programas)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'Presencial',
  duration TEXT NOT NULL,
  schedule TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'PEN',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Tabla: prospects (Seguimiento comercial CRM)
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  status prospect_status_type NOT NULL DEFAULT 'Nuevo',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  last_contact_at TIMESTAMPTZ,
  consent_status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_contact ON public.prospects(contact_id);

-- 7. Tabla: conversations (Sesiones de chat)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'WEB_CHAT',
  status TEXT NOT NULL DEFAULT 'OPEN',
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 8. Tabla: messages (Mensajes individuales)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system', 'agent')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);

-- 9. Tabla: knowledge_documents (Base de conocimiento para IA y consultas)
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Tabla: integrations (Estado de integraciones externas)
CREATE TABLE IF NOT EXISTS public.integrations (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DISCONNECTED',
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TRIGGERS DE AUDITORÍA Y ACTUALIZACIÓN AUTOMÁTICA DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_prospects_updated_at BEFORE UPDATE ON public.prospects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_knowledge_updated_at BEFORE UPDATE ON public.knowledge_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS) - SECCIÓN 6
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Función de ayuda para verificar rol del usuario autenticado
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role_type AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES RLS
CREATE POLICY "profiles_select_authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update_self_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.get_auth_role() = 'admin');

-- COURSES RLS
CREATE POLICY "courses_select_public" ON public.courses
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "courses_modify_admin" ON public.courses
  FOR ALL TO authenticated
  USING (public.get_auth_role() = 'admin');

-- CONTACTS RLS (Privado: Anon no tiene acceso a contactos existentes)
CREATE POLICY "contacts_select_staff" ON public.contacts
  FOR SELECT TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor', 'solo_lectura'));

CREATE POLICY "contacts_modify_staff" ON public.contacts
  FOR INSERT TO authenticated
  WITH CHECK (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "contacts_update_staff" ON public.contacts
  FOR UPDATE TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "contacts_delete_admin" ON public.contacts
  FOR DELETE TO authenticated
  USING (public.get_auth_role() = 'admin');

-- PROSPECTS RLS
CREATE POLICY "prospects_select_staff" ON public.prospects
  FOR SELECT TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor', 'solo_lectura'));

CREATE POLICY "prospects_modify_staff" ON public.prospects
  FOR INSERT TO authenticated
  WITH CHECK (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "prospects_update_staff" ON public.prospects
  FOR UPDATE TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "prospects_delete_admin" ON public.prospects
  FOR DELETE TO authenticated
  USING (public.get_auth_role() = 'admin');

-- CONVERSATIONS & MESSAGES RLS
CREATE POLICY "conversations_select_staff" ON public.conversations
  FOR SELECT TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor', 'solo_lectura'));

CREATE POLICY "conversations_all_admin_asesor" ON public.conversations
  FOR ALL TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "messages_select_staff" ON public.messages
  FOR SELECT TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor', 'solo_lectura'));

CREATE POLICY "messages_all_admin_asesor" ON public.messages
  FOR ALL TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor'));

-- KNOWLEDGE DOCUMENTS RLS
CREATE POLICY "knowledge_select_staff" ON public.knowledge_documents
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "knowledge_modify_admin" ON public.knowledge_documents
  FOR ALL TO authenticated
  USING (public.get_auth_role() = 'admin');

-- INTEGRATIONS RLS
CREATE POLICY "integrations_select_staff" ON public.integrations
  FOR SELECT TO authenticated
  USING (public.get_auth_role() IN ('admin', 'asesor'));

CREATE POLICY "integrations_modify_admin" ON public.integrations
  FOR ALL TO authenticated
  USING (public.get_auth_role() = 'admin');
