import { Badge } from '@/components/ui/badge';
import { CheckCircle2, X } from 'lucide-react';

const permissions = [
  { action: 'Visualizar Exames', admin_master: true, unit_admin: true, medico: true, viewer: true },
  { action: 'Laudar Exames', admin_master: true, unit_admin: false, medico: true, viewer: false },
  { action: 'Imprimir Laudos', admin_master: true, unit_admin: true, medico: true, viewer: true },
  { action: 'Editar Predefinidos', admin_master: true, unit_admin: false, medico: true, viewer: false },
  { action: 'Gerenciar Unidades', admin_master: true, unit_admin: false, medico: false, viewer: false },
  { action: 'Gerenciar Usuários', admin_master: true, unit_admin: true, medico: false, viewer: false },
  { action: 'Ver Auditoria', admin_master: true, unit_admin: true, medico: false, viewer: false },
  { action: 'Configurar DICOM', admin_master: true, unit_admin: false, medico: false, viewer: false },
];

const roles = [
  { key: 'admin_master', label: 'Admin Master' },
  { key: 'unit_admin', label: 'Admin Unidade' },
  { key: 'medico', label: 'Médico' },
  { key: 'viewer', label: 'Visualizador' },
];

export default function PermissionsAdminPage() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Grupos e Permissões</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">Matriz de permissões por perfil de acesso</p>
      </div>

      <div className="rounded border border-border bg-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Permissão</th>
              {roles.map(r => (
                <th key={r.key} className="px-3 py-2 text-center font-medium text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{r.label}</Badge>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map(perm => (
              <tr key={perm.action} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-medium text-foreground">{perm.action}</td>
                {roles.map(r => (
                  <td key={r.key} className="px-3 py-2 text-center">
                    {perm[r.key as keyof typeof perm] ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] mx-auto" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
