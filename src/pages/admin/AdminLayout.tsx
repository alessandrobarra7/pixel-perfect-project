import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Building2, Users, Shield, ScrollText } from 'lucide-react';

const tabs = [
  { to: '/admin/units', label: 'Unidades', icon: Building2 },
  { to: '/admin/users', label: 'Usuários', icon: Users },
  { to: '/admin/permissions', label: 'Permissões', icon: Shield },
  { to: '/admin/audit', label: 'Auditoria', icon: ScrollText },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 mb-4 border-b border-border pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
