// ====== ENUMS ======

export type UserRole = 'admin_master' | 'unit_admin' | 'medico' | 'viewer';

export type ReportStatus = 'draft' | 'signed' | 'revised';

export type StudyModalityType = 'CR' | 'CT' | 'MR' | 'US' | 'DX' | 'MG' | 'XA' | 'RF' | 'NM' | 'PT' | 'OT';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_STUDY'
  | 'OPEN_VIEWER'
  | 'CREATE_REPORT'
  | 'UPDATE_REPORT'
  | 'SIGN_REPORT';

// ====== MODELS ======

export interface Unit {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  orthanc_base_url?: string;
  ae_title?: string;
  ip_address?: string;
  port?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  unit_id: string;
  unit_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Study {
  id: string;
  unit_id: string;
  orthanc_study_id?: string;
  study_instance_uid: string;
  patient_name: string;
  patient_id: string;
  accession_number: string;
  study_date: string;
  modalities: StudyModalityType[];
  description: string;
  report_status: ReportStatus | null;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplate {
  id: string;
  unit_id: string | null;
  name: string;
  modality: StudyModalityType | null;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  unit_id: string;
  study_id: string;
  author_user_id: string;
  author_name?: string;
  template_id: string | null;
  body: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  signed_at: string | null;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  unit_id: string;
  action: AuditAction;
  target_type: 'STUDY' | 'REPORT' | 'TEMPLATE' | 'USER' | 'SESSION';
  target_id: string | null;
  created_at: string;
  ip_address?: string;
}

// ====== API CONTRACTS ======

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface StudyFilters {
  patient_name?: string;
  accession_number?: string;
  date_from?: string;
  date_to?: string;
  modality?: StudyModalityType;
  report_status?: ReportStatus | 'pending';
  page?: number;
  per_page?: number;
}

export interface DashboardStats {
  total_studies: number;
  pending_reports: number;
  signed_reports: number;
  studies_today: number;
  recent_activity: AuditLog[];
}

// ====== PERMISSION HELPERS ======

export function canReport(role: UserRole): boolean {
  return role === 'medico' || role === 'admin_master';
}

export function canViewExam(_role: UserRole): boolean {
  return true; // all roles
}

export function canPrintReport(role: UserRole): boolean {
  return role === 'viewer' || role === 'medico' || role === 'admin_master' || role === 'unit_admin';
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin_master' || role === 'unit_admin';
}

/** Convert "SOBRENOME, NOME" to "NOME SOBRENOME" */
export function formatPatientName(name: string): string {
  if (name.includes(',')) {
    const parts = name.split(',').map(p => p.trim());
    return parts.reverse().join(' ');
  }
  return name;
}
