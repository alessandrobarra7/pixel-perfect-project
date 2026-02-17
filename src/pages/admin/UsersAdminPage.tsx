import { useEffect, useState } from 'react';
import { getUsers } from '@/services/api';
import type { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const roleLabels: Record<string, string> = {
  admin_master: 'Admin Master',
  unit_admin: 'Admin Unidade',
  medico: 'Médico',
  viewer: 'Visualizador',
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { getUsers().then(setUsers); }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento de usuários do portal</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Lista de Usuários</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-foreground">{u.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{roleLabels[u.role]}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{u.unit_name}</TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? 'default' : 'secondary'}>
                      {u.is_active ? 'Ativo' : 'Inativo'}
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
