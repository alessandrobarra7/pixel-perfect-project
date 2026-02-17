import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FileText, MonitorPlay, Users, Building2, ClipboardList,
  LogOut, Menu, X, Shield, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin_master', 'unit_admin', 'medico', 'viewer'] },
  { to: '/studies', label: 'Estudos', icon: FileText, roles: ['admin_master', 'unit_admin', 'medico', 'viewer'] },
  { to: '/admin/templates', label: 'Templates', icon: ClipboardList, roles: ['admin_master', 'unit_admin', 'medico'] },
  { to: '/admin/users', label: 'Usuários', icon: Users, roles: ['admin_master', 'unit_admin'] },
  { to: '/admin/units', label: 'Unidades', icon: Building2, roles: ['admin_master'] },
  { to: '/admin/audit', label: 'Auditoria', icon: Shield, roles: ['admin_master', 'unit_admin'] },
];

const roleLabels: Record<string, string> = {
  admin_master: 'Administrador',
  unit_admin: 'Admin Unidade',
  medico: 'Médico',
  viewer: 'Visualizador',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNav = navItems.filter(item => user && (item.roles as string[]).includes(user.role));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <MonitorPlay className="h-7 w-7 text-sidebar-primary" />
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">RadPortal</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNav.map(item => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {active && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.full_name}</p>
            <p className="text-xs text-sidebar-foreground/50">{user ? roleLabels[user.role] : ''}</p>
            {user?.unit_name && (
              <p className="mt-0.5 text-xs text-sidebar-foreground/40">{user.unit_name}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground">FASE 1 — Mock Data</span>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
