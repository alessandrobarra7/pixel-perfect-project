import { useEffect, useState } from 'react';
import { getUnits } from '@/services/api';
import type { Unit } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export default function UnitsAdminPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', ae_title: '', ip_address: '', port: '', orthanc_base_url: '' });

  useEffect(() => { getUnits().then(setUnits); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', slug: '', ae_title: '', ip_address: '', port: '', orthanc_base_url: '' });
    setDialogOpen(true);
  };

  const openEdit = (u: Unit) => {
    setEditing(u);
    setForm({
      name: u.name,
      slug: u.slug,
      ae_title: u.ae_title || '',
      ip_address: u.ip_address || '',
      port: u.port?.toString() || '',
      orthanc_base_url: u.orthanc_base_url || '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setUnits(prev => prev.map(u => u.id === editing.id ? {
        ...u,
        name: form.name,
        slug: form.slug,
        ae_title: form.ae_title,
        ip_address: form.ip_address,
        port: form.port ? parseInt(form.port) : undefined,
        orthanc_base_url: form.orthanc_base_url,
        updated_at: new Date().toISOString(),
      } : u));
      toast.success('Unidade atualizada');
    } else {
      const newUnit: Unit = {
        id: 'u' + Date.now(),
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        is_active: true,
        ae_title: form.ae_title,
        ip_address: form.ip_address,
        port: form.port ? parseInt(form.port) : undefined,
        orthanc_base_url: form.orthanc_base_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUnits(prev => [...prev, newUnit]);
      toast.success('Unidade criada');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Unidades</h2>
        <Button size="sm" className="h-7 text-xs gap-1" onClick={openNew}>
          <Plus className="h-3 w-3" /> Nova Unidade
        </Button>
      </div>

      <div className="rounded border border-border bg-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Nome</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">AE Title</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">IP</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Porta</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {units.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-medium text-foreground">{u.name}</td>
                <td className="px-3 py-2 text-muted-foreground font-mono">{u.ae_title || '—'}</td>
                <td className="px-3 py-2 text-muted-foreground font-mono">{u.ip_address || '—'}</td>
                <td className="px-3 py-2 text-muted-foreground font-mono">{u.port || '—'}</td>
                <td className="px-3 py-2">
                  <Badge variant={u.is_active ? 'default' : 'secondary'}>
                    {u.is_active ? 'Ativa' : 'Inativa'}
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
            <DialogTitle className="text-sm">{editing ? 'Editar Unidade' : 'Nova Unidade'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Nome</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Slug</label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="h-8 text-xs" placeholder="ex: hospital-central" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">AE Title</label>
                <Input value={form.ae_title} onChange={e => setForm(f => ({ ...f, ae_title: e.target.value }))} className="h-8 text-xs font-mono" placeholder="ORTHANC" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">IP</label>
                <Input value={form.ip_address} onChange={e => setForm(f => ({ ...f, ip_address: e.target.value }))} className="h-8 text-xs font-mono" placeholder="192.168.1.1" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Porta</label>
                <Input value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} className="h-8 text-xs font-mono" placeholder="4242" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Orthanc URL</label>
              <Input value={form.orthanc_base_url} onChange={e => setForm(f => ({ ...f, orthanc_base_url: e.target.value }))} className="h-8 text-xs font-mono" placeholder="http://192.168.1.1:8042" />
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
