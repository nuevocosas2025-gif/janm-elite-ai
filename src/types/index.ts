/**
 * ORATORIA JANM ELITE - MODELO DE TIPOS PRINCIPALES
 * Conforme a la sección 5 del documento maestro
 */

export type UserRole = 'admin' | 'asesor' | 'solo_lectura';

export interface Profile {
  id: string; // references auth.users
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string; // 'CHATBOT', 'WHATSAPP', 'GOOGLE_SHEETS', 'WEB', 'REFERIDO'
  google_sheet_row_id: string | null;
  created_at: string;
  updated_at: string;
}

// 9 estados comerciales exigidos en la Sección 11
export type ProspectStatus =
  | 'Nuevo'
  | 'Interesado'
  | 'Información enviada'
  | 'Pendiente de respuesta'
  | 'Seguimiento solicitado'
  | 'Matrícula en proceso'
  | 'Matriculado'
  | 'No interesado'
  | 'Solicita no recibir comunicaciones';

export interface Prospect {
  id: string;
  contact_id: string;
  course_id: string | null;
  status: ProspectStatus;
  assigned_to: string | null; // references Profile.id
  notes: string | null;
  last_contact_at: string | null;
  consent_status: boolean;
  created_at: string;
  updated_at: string;
  // Relaciones expandidas opcionales
  contact?: Contact;
  course?: Course;
  assigned_profile?: Profile;
}

export type CourseModality = 'Presencial' | 'Virtual' | 'Híbrido';

export interface Course {
  id: string;
  name: string;
  description: string;
  modality: CourseModality;
  duration: string; // ej: "4 semanas", "2 meses"
  schedule: string; // ej: "Sábados 9:00 AM - 1:00 PM"
  price: number;
  currency: string; // 'PEN' o 'USD'
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ConversationChannel = 'WEB_CHAT' | 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK';
export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_HUMAN' | 'RESOLVED' | 'CLOSED';

export interface Conversation {
  id: string;
  contact_id: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  started_at: string;
  last_message_at: string;
  assigned_to: string | null;
  // Relaciones
  contact?: Contact;
  messages?: Message[];
}

export type MessageSenderType = 'user' | 'assistant' | 'system' | 'agent';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: MessageSenderType;
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: 'PRECIOS' | 'HORARIOS' | 'METODOLOGIA' | 'CERTIFICACION' | 'DOCENTES' | 'GENERAL';
  is_active: boolean;
  updated_at: string;
}

export type IntegrationProvider = 'GOOGLE_SHEETS' | 'AI_GEMINI' | 'AI_GROQ' | 'AI_LOCAL' | 'SUPABASE';
export type IntegrationStatus = 'ACTIVE' | 'WARNING' | 'ERROR' | 'DISCONNECTED';

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  last_sync_at: string | null;
  last_error: string | null;
  updated_at: string;
}

// Métricas de Dashboard (Sección 12)
export interface DashboardMetrics {
  totalContacts: number;
  newProspects: number;
  recentConversations: number;
  prospectsByStatus: Record<ProspectStatus, number>;
  mostConsultedCourses: { course_name: string; count: number }[];
  pendingInquiries: number;
  recentActivity: {
    id: string;
    type: 'PROSPECT_CREATED' | 'STATUS_CHANGED' | 'NEW_CHAT' | 'SHEET_SYNC';
    description: string;
    timestamp: string;
  }[];
  integrationStatus: {
    supabase: IntegrationStatus;
    googleSheets: IntegrationStatus;
    aiProvider: IntegrationStatus;
  };
  lastSheetsSync: string | null;
}

// Configuración y Sincronización de Google Sheets (Sección 7)
export interface SheetsConfig {
  sheetId: string;
  sheetUrl?: string;
  tabName: string;
  columnsMapping: {
    fullName: string;
    phone: string;
    email: string;
    course: string;
    status: string;
    notes: string;
  };
}

export interface SheetRowPreview {
  rowIndex: number;
  fullName: string;
  phone: string;
  email: string;
  course: string;
  status: string;
  isDuplicate: boolean;
  matchReason?: string;
}

export interface SyncReport {
  totalScanned: number;
  imported: number;
  updated: number;
  skippedDuplicates: number;
  errors: { row: number; reason: string }[];
  timestamp: string;
}
