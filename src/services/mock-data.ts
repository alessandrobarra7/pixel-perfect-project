import type {
  User, Unit, Study, Report, ReportTemplate, AuditLog, DashboardStats,
} from '@/types';

// ====== UNITS ======
export const mockUnits: Unit[] = [];

// ====== USERS ======
export const mockUserPasswords: Record<string, string> = {
  'alessandro': '123456789',
  'gian': '123456789',
  'natan': '123456789',
  'lidiane': '123456789',
};

export const mockUsers: User[] = [
  { id: 'usr1', email: 'alessandro', full_name: 'Alessandro', role: 'admin_master', unit_id: '', unit_name: '', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'usr2', email: 'gian', full_name: 'Dr. Gian', role: 'medico', unit_id: '', unit_name: '', is_active: true, created_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-05T00:00:00Z' },
  { id: 'usr3', email: 'natan', full_name: 'Natan', role: 'unit_admin', unit_id: '', unit_name: '', is_active: true, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },
  { id: 'usr4', email: 'lidiane', full_name: 'Lidiane', role: 'viewer', unit_id: '', unit_name: '', is_active: true, created_at: '2026-01-12T00:00:00Z', updated_at: '2026-01-12T00:00:00Z' },
];

// ====== STUDIES ======
export const mockStudies: Study[] = [];

// ====== TEMPLATES ======
export const mockTemplates: ReportTemplate[] = [];

// ====== REPORTS ======
export const mockReports: Report[] = [];

// ====== AUDIT ======
export const mockAuditLogs: AuditLog[] = [];

// ====== DASHBOARD STATS ======
export const mockDashboardStats: DashboardStats = {
  total_studies: 0,
  pending_reports: 0,
  signed_reports: 0,
  studies_today: 0,
  recent_activity: [],
};
