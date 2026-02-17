import type {
  User, Unit, Study, Report, ReportTemplate, AuditLog, DashboardStats,
  StudyModalityType, ReportStatus
} from '@/types';

// ====== UNITS ======
export const mockUnits: Unit[] = [
  { id: 'u1', name: 'UBS Central', slug: 'ubs-central', is_active: true, ae_title: 'UBS_CENTRAL', ip_address: '192.168.1.10', port: 4242, orthanc_base_url: 'http://192.168.1.10:8042', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'u2', name: 'Hospital Municipal', slug: 'hospital-municipal', is_active: true, ae_title: 'HOSP_MUN', ip_address: '192.168.2.20', port: 4242, orthanc_base_url: 'http://192.168.2.20:8042', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'u3', name: 'Clínica Norte', slug: 'clinica-norte', is_active: false, ae_title: 'CLIN_NORTE', ip_address: '10.0.0.5', port: 11112, orthanc_base_url: 'http://10.0.0.5:8042', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

// ====== USERS ======
export const mockUserPasswords: Record<string, string> = {
  'alessandro': '123456789',
  'gian': '123456789',
  'natan': '123456789',
  'lidiane': '123456789',
};

export const mockUsers: User[] = [
  { id: 'usr1', email: 'alessandro', full_name: 'Alessandro', role: 'admin_master', unit_id: 'u1', unit_name: 'UBS Central', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'usr2', email: 'gian', full_name: 'Dr. Gian', role: 'medico', unit_id: 'u1', unit_name: 'UBS Central', is_active: true, created_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-05T00:00:00Z' },
  { id: 'usr3', email: 'natan', full_name: 'Natan', role: 'unit_admin', unit_id: 'u2', unit_name: 'Hospital Municipal', is_active: true, created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z' },
  { id: 'usr4', email: 'lidiane', full_name: 'Lidiane', role: 'viewer', unit_id: 'u2', unit_name: 'Hospital Municipal', is_active: true, created_at: '2026-01-12T00:00:00Z', updated_at: '2026-01-12T00:00:00Z' },
];

// ====== STUDIES ======
const modalities: StudyModalityType[] = ['CR', 'CT', 'MR', 'US', 'DX', 'MG'];
const descriptions = ['Tórax PA', 'Crânio s/ contraste', 'Coluna lombar', 'Abdômen total', 'Mamografia bilateral', 'Joelho direito', 'Pelve AP'];
const patients = [
  { name: 'JOSE CARLOS SILVA', id: 'P001' },
  { name: 'MARIA APARECIDA OLIVEIRA', id: 'P002' },
  { name: 'PEDRO HENRIQUE SANTOS', id: 'P003' },
  { name: 'ANA LUCIA FERREIRA', id: 'P004' },
  { name: 'FRANCISCO SOUZA', id: 'P005' },
  { name: 'CLAUDIA MARIA COSTA', id: 'P006' },
  { name: 'JOAO BATISTA PEREIRA', id: 'P007' },
  { name: 'FERNANDA RODRIGUES', id: 'P008' },
];

function randomDate(daysBack: number) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split('T')[0];
}

export const mockStudies: Study[] = Array.from({ length: 40 }, (_, i) => {
  const patient = patients[i % patients.length];
  const mod = modalities[i % modalities.length];
  const statuses: (ReportStatus | null)[] = [null, null, 'draft', 'signed', null];
  return {
    id: `study-${String(i + 1).padStart(3, '0')}`,
    unit_id: i % 3 === 0 ? 'u2' : 'u1',
    study_instance_uid: `1.2.840.${10000 + i}`,
    patient_name: patient.name,
    patient_id: patient.id,
    accession_number: `ACC${String(2000 + i)}`,
    study_date: randomDate(60),
    modalities: [mod],
    description: descriptions[i % descriptions.length],
    report_status: statuses[i % statuses.length],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
});

// ====== TEMPLATES ======
export const mockTemplates: ReportTemplate[] = [
  { id: 'tpl1', unit_id: null, name: 'Tórax PA - Padrão', modality: 'CR', body: '**LAUDO RADIOLÓGICO**\n\nTórax em PA:\n\n- Campos pulmonares: \n- Área cardíaca: \n- Mediastino: \n- Seios costofrênicos: \n\n**IMPRESSÃO:**\n', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'tpl2', unit_id: null, name: 'TC Crânio - Padrão', modality: 'CT', body: '**LAUDO TOMOGRÁFICO - CRÂNIO**\n\nTécnica: \n\nParênquima cerebral:\n- Hemisférios: \n- Ventrículos: \n- Fossa posterior: \n\n**IMPRESSÃO:**\n', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'tpl3', unit_id: 'u1', name: 'US Abdômen - UBS Central', modality: 'US', body: '**LAUDO ULTRASSONOGRÁFICO - ABDÔMEN**\n\nFígado: \nVesícula: \nVias biliares: \nPâncreas: \nBaço: \nRins: \nBexiga: \n\n**IMPRESSÃO:**\n', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

// ====== REPORTS ======
export const mockReports: Report[] = [
  { id: 'rpt1', unit_id: 'u1', study_id: 'study-003', author_user_id: 'usr2', author_name: 'Dr. Gian Medicina', template_id: 'tpl1', body: '**LAUDO RADIOLÓGICO**\n\nTórax em PA:\n\n- Campos pulmonares: Transparentes\n- Área cardíaca: Normal\n- Mediastino: Sem alargamento\n- Seios costofrênicos: Livres\n\n**IMPRESSÃO:** Exame dentro dos limites da normalidade.\n', status: 'draft', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-02-10T10:30:00Z', signed_at: null },
  { id: 'rpt2', unit_id: 'u1', study_id: 'study-004', author_user_id: 'usr2', author_name: 'Dr. Gian Medicina', template_id: 'tpl2', body: '**LAUDO TOMOGRÁFICO - CRÂNIO**\n\nParênquima cerebral sem alterações.\nSistema ventricular de dimensões normais.\n\n**IMPRESSÃO:** Exame normal.\n', status: 'signed', created_at: '2026-02-08T14:00:00Z', updated_at: '2026-02-08T15:00:00Z', signed_at: '2026-02-08T15:00:00Z' },
];

// ====== AUDIT ======
export const mockAuditLogs: AuditLog[] = [
  { id: 'a1', user_id: 'usr1', user_name: 'Alessandro Mestre', unit_id: 'u1', action: 'LOGIN', target_type: 'SESSION', target_id: null, created_at: '2026-02-17T08:00:00Z' },
  { id: 'a2', user_id: 'usr2', user_name: 'Dr. Gian Medicina', unit_id: 'u1', action: 'VIEW_STUDY', target_type: 'STUDY', target_id: 'study-003', created_at: '2026-02-17T09:15:00Z' },
  { id: 'a3', user_id: 'usr2', user_name: 'Dr. Gian Medicina', unit_id: 'u1', action: 'CREATE_REPORT', target_type: 'REPORT', target_id: 'rpt1', created_at: '2026-02-17T09:20:00Z' },
  { id: 'a4', user_id: 'usr3', user_name: 'Dr. Jean Medicina', unit_id: 'u2', action: 'LOGIN', target_type: 'SESSION', target_id: null, created_at: '2026-02-17T10:00:00Z' },
  { id: 'a5', user_id: 'usr3', user_name: 'Dr. Jean Medicina', unit_id: 'u2', action: 'OPEN_VIEWER', target_type: 'STUDY', target_id: 'study-006', created_at: '2026-02-17T10:05:00Z' },
];

// ====== DASHBOARD STATS ======
export const mockDashboardStats: DashboardStats = {
  total_studies: 40,
  pending_reports: 24,
  signed_reports: 16,
  studies_today: 5,
  recent_activity: mockAuditLogs.slice(0, 5),
};
