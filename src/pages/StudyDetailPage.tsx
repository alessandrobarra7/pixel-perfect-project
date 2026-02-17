import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudyById } from '@/services/api';
import type { Study } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MonitorPlay, FileEdit } from 'lucide-react';

export default function StudyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [study, setStudy] = useState<Study | null>(null);

  useEffect(() => {
    if (id) getStudyById(id).then(setStudy).catch(() => {});
  }, [id]);

  if (!study) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const fields = [
    ['Paciente', study.patient_name],
    ['ID Paciente', study.patient_id],
    ['Accession', study.accession_number],
    ['Data', new Date(study.study_date).toLocaleDateString('pt-BR')],
    ['Modalidade', study.modalities.join(', ')],
    ['Descrição', study.description],
    ['Study UID', study.study_instance_uid],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/studies"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Detalhes do Estudo</h1>
          <p className="text-sm text-muted-foreground">{study.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Informações</CardTitle>
          <Badge variant={study.report_status === 'signed' ? 'default' : 'outline'}>
            {study.report_status || 'Pendente'}
          </Badge>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild><Link to={`/viewer/${study.id}`}><MonitorPlay className="mr-2 h-4 w-4" /> Abrir Viewer</Link></Button>
        <Button variant="outline" asChild><Link to={`/reports/${study.id}`}><FileEdit className="mr-2 h-4 w-4" /> Laudar</Link></Button>
      </div>
    </div>
  );
}
