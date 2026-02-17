import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '@/services/api';
import type { DashboardStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ClipboardCheck, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const statCards = [
  { key: 'total_studies', label: 'Total Estudos', icon: FileText, color: 'text-primary' },
  { key: 'pending_reports', label: 'Laudos Pendentes', icon: Clock, color: 'text-destructive' },
  { key: 'signed_reports', label: 'Laudos Assinados', icon: ClipboardCheck, color: 'text-green-500' },
  { key: 'studies_today', label: 'Estudos Hoje', icon: Activity, color: 'text-primary' },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do portal radiológico</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((sc, i) => (
          <motion.div key={sc.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{sc.label}</CardTitle>
                <sc.icon className={`h-5 w-5 ${sc.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stats[sc.key]}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/studies" className="group">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">Ver Estudos</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/templates" className="group">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">Templates</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/users" className="group">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">Usuários</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recent_activity.map(log => (
              <div key={log.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-foreground">{log.user_name}</span>
                  <span className="ml-2 text-muted-foreground">{log.action.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
