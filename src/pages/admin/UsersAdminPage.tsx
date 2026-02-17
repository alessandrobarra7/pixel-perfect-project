import { useEffect, useState } from 'react';
import { getUsers, getUnits } from '@/services/api';
import type { User, Unit, UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<string, string> = {
  admin_master: 'Admin Master',
  unit_admin: 'Admin Unidade',
  medico: 'Médico',
  viewer: 'Visualizador',
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'viewer' as UserRole, unit_id: '', password: '' });

  useEffect(() => {
    getUsers().then(setUsers);
    getUnits().then(setUnits);
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ full_name: '', email: '', role: 'viewer', unit_id: '', password: '' });
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ full_name: u.full_name, email: u.email, role: u.role, unit_id: u.unit_id, password: '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.full_name.trim() || !form.email.trim()) return;
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? {
        ...u,
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        unit_id: form.unit_id,
        unit_name: units.find(un => un.id === form.unit_id)?.name,
        updated_at: new Date().toISOString(),
      } : u));
      toast.success('Usuário atualizado');
    } else {
      const newUser: User = {
        id: 'usr' + Date.now(),
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        unit_id: form.unit_id,
        unit_name: units.find(un => un.id === form.unit_id)?.name,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuário criado');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Usuários</h2>
        <Button size="sm" className="h-7 text-xs gap-1" onClick={openNew}>
          <Plus className="h-3 w-3" /> Novo Usuário
        </Button>
      </div>

      <div className="rounded border border-border bg-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Nome</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Perfil</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Unidade</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-medium text-foreground">{u.full_name}</td>
                <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2"><Badge variant="outline">{roleLabels[u.role]}</Badge></td>
                <td className="px-3 py-2 text-muted-foreground">{u.unit_name}</td>
                <td className="px-3 py-2">
                  <Badge variant={u.is_active ? 'default' : 'secondary'}>
                    {u.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(u)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{editing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Nome Completo</label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="h-8 text-xs" />
            </div>
            {!editing && (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Senha</label>
                <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="h-8 text-xs" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Perfil</label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v as UserRole }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_master">Admin Master</SelectItem>
                    <SelectItem value="unit_admin">Admin Unidade</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Unidade</label>
                <Select value={form.unit_id} onValueChange={v => setForm(f => ({ ...f, unit_id: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {units.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="h-8 text-xs" onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
