/**
 * SERVICE LAYER — Camada de abstração para API.
 * 
 * FASE 1: Usa dados mock locais.
 * FASE 3+: Trocar as implementações por fetch() ao backend FastAPI real.
 * 
 * Para integrar com API real, basta alterar as funções abaixo
 * mantendo as mesmas assinaturas (interfaces em @/types).
 */

import type {
  LoginRequest, LoginResponse, User, Study, Report, ReportTemplate,
  Unit, AuditLog, DashboardStats, PaginatedResponse, StudyFilters,
} from '@/types';
import {
  mockUsers, mockStudies, mockReports, mockTemplates,
  mockUnits, mockAuditLogs, mockDashboardStats, mockUserPasswords,
} from './mock-data';

// Simula delay de rede
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ====== AUTH ======

export async function login(req: LoginRequest): Promise<LoginResponse> {
  await delay(500);
  const user = mockUsers.find(u => u.email === req.email);
  if (!user) throw new Error('Credenciais inválidas');
  // Verifica senha — se vazia no mapa, aceita qualquer senha
  const expectedPw = mockUserPasswords[req.email];
  if (expectedPw !== '' && expectedPw !== undefined && req.password !== expectedPw) {
    throw new Error('Credenciais inválidas');
  }
  return {
    access_token: 'mock-jwt-token-' + user.id,
    token_type: 'bearer',
    user,
  };
}

export async function getMe(): Promise<User> {
  await delay();
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Não autenticado');
  const userId = token.replace('mock-jwt-token-', '');
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado');
  return user;
}

// ====== DASHBOARD ======

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return mockDashboardStats;
}

// ====== STUDIES ======

export async function getStudies(filters: StudyFilters = {}): Promise<PaginatedResponse<Study>> {
  await delay();
  let items = [...mockStudies];
  
  if (filters.patient_name) {
    const q = filters.patient_name.toUpperCase();
    items = items.filter(s => s.patient_name.includes(q));
  }
  if (filters.accession_number) {
    items = items.filter(s => s.accession_number.includes(filters.accession_number!));
  }
  if (filters.modality) {
    items = items.filter(s => s.modalities.includes(filters.modality!));
  }
  if (filters.date_from) {
    items = items.filter(s => s.study_date >= filters.date_from!);
  }
  if (filters.date_to) {
    items = items.filter(s => s.study_date <= filters.date_to!);
  }
  if (filters.report_status === 'pending') {
    items = items.filter(s => !s.report_status);
  } else if (filters.report_status) {
    items = items.filter(s => s.report_status === filters.report_status);
  }

  // Sort by date desc
  items.sort((a, b) => b.study_date.localeCompare(a.study_date));

  const page = filters.page || 1;
  const per_page = filters.per_page || 10;
  const total = items.length;
  const paged = items.slice((page - 1) * per_page, page * per_page);

  return {
    items: paged,
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  };
}

export async function getStudyById(id: string): Promise<Study> {
  await delay();
  const study = mockStudies.find(s => s.id === id);
  if (!study) throw new Error('Estudo não encontrado');
  return study;
}

// ====== REPORTS ======

export async function getReportByStudyId(studyId: string): Promise<Report | null> {
  await delay();
  return mockReports.find(r => r.study_id === studyId) || null;
}

export async function saveReport(report: Partial<Report> & { study_id: string; body: string }): Promise<Report> {
  await delay(400);
  const existing = mockReports.find(r => r.study_id === report.study_id);
  if (existing) {
    Object.assign(existing, { ...report, updated_at: new Date().toISOString() });
    return existing;
  }
  const newReport: Report = {
    id: 'rpt-' + Date.now(),
    unit_id: 'u1',
    study_id: report.study_id,
    author_user_id: 'usr2',
    author_name: 'Dra. Maria Silva',
    template_id: report.template_id || null,
    body: report.body,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    signed_at: null,
  };
  mockReports.push(newReport);
  return newReport;
}

// ====== TEMPLATES ======

export async function getTemplates(): Promise<ReportTemplate[]> {
  await delay();
  return mockTemplates;
}

// ====== UNITS ======

export async function getUnits(): Promise<Unit[]> {
  await delay();
  return mockUnits;
}

// ====== USERS ======

export async function getUsers(): Promise<User[]> {
  await delay();
  return mockUsers;
}

// ====== AUDIT ======

export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay();
  return mockAuditLogs;
}
