import { useEffect, useState } from 'react';
import { getUnits } from '@/services/api';
import type { Unit } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UnitsAdminPage() {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => { getUnits().then(setUnits); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Unidades</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento de unidades de saúde</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Lista de Unidades</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Orthanc URL</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-foreground">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.slug}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{u.orthanc_base_url || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? 'default' : 'secondary'}>
                      {u.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
