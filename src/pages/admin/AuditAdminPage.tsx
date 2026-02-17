import { useEffect, useState } from 'react';
import { getAuditLogs } from '@/services/api';
import type { AuditLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const actionColors: Record<string, string> = {
  LOGIN: 'bg-blue-500/10 text-blue-600',
  LOGOUT: 'bg-muted text-muted-foreground',
  VIEW_STUDY: 'bg-green-500/10 text-green-600',
  OPEN_VIEWER: 'bg-purple-500/10 text-purple-600',
  CREATE_REPORT: 'bg-orange-500/10 text-orange-600',
  UPDATE_REPORT: 'bg-yellow-500/10 text-yellow-600',
  SIGN_REPORT: 'bg-emerald-500/10 text-emerald-600',
};

export default function AuditAdminPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => { getAuditLogs().then(setLogs); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Auditoria</h1>
        <p className="text-sm text-muted-foreground">Log de atividades do portal</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Registros de Auditoria</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Alvo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{log.user_name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${actionColors[log.action] || ''}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline">{log.target_type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{log.target_id || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
