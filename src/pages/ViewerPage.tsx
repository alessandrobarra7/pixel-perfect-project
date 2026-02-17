import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStudyById } from '@/services/api';
import type { Study } from '@/types';
import { formatPatientName } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';

export default function ViewerPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [study, setStudy] = useState<Study | null>(null);

  useEffect(() => {
    if (studyId) getStudyById(studyId).then(setStudy);
  }, [studyId]);

  if (!study) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to="/studies"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">
            Visualizar — {formatPatientName(study.patient_name)}
          </h1>
          <p className="text-[10px] text-muted-foreground">{study.description} • {new Date(study.study_date).toLocaleDateString('pt-BR')}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" title="Tela cheia">
          <Maximize2 className="h-3.5 w-3.5" /> Tela Cheia
        </Button>
      </div>

      <div className="flex-1 rounded border border-border bg-card flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Maximize2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">OHIF Viewer</p>
            <p className="text-xs text-muted-foreground mt-1">
              O visualizador DICOM será integrado aqui.<br />
              Conecte o Orthanc da unidade para carregar as imagens.
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              Study UID: {study.study_instance_uid}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
