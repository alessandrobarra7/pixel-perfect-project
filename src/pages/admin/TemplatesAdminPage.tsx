import { useEffect, useState } from 'react';
import { getTemplates } from '@/services/api';
import type { ReportTemplate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TemplatesAdminPage() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  useEffect(() => { getTemplates().then(setTemplates); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Templates de Laudo</h1>
        <p className="text-sm text-muted-foreground">Modelos de laudo radiológico</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Templates Disponíveis</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Escopo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                  <TableCell><Badge variant="outline">{t.modality || 'Geral'}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{t.unit_id ? 'Unidade' : 'Global'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
