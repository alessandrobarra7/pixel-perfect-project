import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudyById } from '@/services/api';
import type { Study } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MonitorPlay, Maximize2, Info } from 'lucide-react';

export default function ViewerPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [study, setStudy] = useState<Study | null>(null);

  useEffect(() => {
    if (studyId) getStudyById(studyId).then(setStudy).catch(() => {});
  }, [studyId]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/studies"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Viewer DICOM</h1>
            {study && <p className="text-xs text-muted-foreground">{study.patient_name} — {study.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {study && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/reports/${study.id}`}>Laudar</Link>
            </Button>
          )}
          <Button variant="outline" size="icon" title="Tela cheia">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewer shell placeholder */}
      <Card className="flex flex-1 items-center justify-center border-2 border-dashed border-border">
        <CardContent className="text-center">
          <MonitorPlay className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">Viewer OHIF — Shell</h2>
          <p className="mb-4 max-w-md text-sm text-muted-foreground">
            Na Fase 3, este componente será substituído pelo OHIF Viewer real,
            conectado ao DICOMweb endpoint do Orthanc da unidade.
          </p>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            {study ? `Study UID: ${study.study_instance_uid}` : 'Carregando estudo...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
