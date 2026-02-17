import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdmin } from '@/types';
import { cn } from '@/lib/utils';
import { FileText, Settings, LogOut } from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user ? canAccessAdmin(user.role) : false;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center h-10 px-4 border-b border-border bg-card shrink-0">
        <span className="text-sm font-bold text-foreground tracking-tight mr-6">LAUDS</span>

        <nav className="flex items-center gap-1">
          <Link
            to="/studies"
            className={cn(
              'px-3 py-1 rounded text-xs font-medium transition-colors',
              location.pathname.startsWith('/studies') || location.pathname.startsWith('/reports') || location.pathname.startsWith('/viewer')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <FileText className="inline h-3 w-3 mr-1 -mt-px" />
            Estudos
          </Link>

          {isAdmin && (
            <Link
              to="/admin/units"
              className={cn(
                'px-3 py-1 rounded text-xs font-medium transition-colors',
                location.pathname.startsWith('/admin')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Settings className="inline h-3 w-3 mr-1 -mt-px" />
              Administração
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <span className="text-[10px] text-muted-foreground mr-3 hidden sm:block">
          {user?.full_name}
        </span>
        <button
          onClick={logout}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Sair"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
