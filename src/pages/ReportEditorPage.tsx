import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudyById, getReportByStudyId, saveReport, getTemplates } from '@/services/api';
import type { Study, Report, ReportTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportEditorPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [study, setStudy] = useState<Study | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!studyId) return;
    Promise.all([
      getStudyById(studyId),
      getReportByStudyId(studyId),
      getTemplates(),
    ]).then(([s, r, t]) => {
      setStudy(s);
      setReport(r);
      setTemplates(t);
      setBody(r?.body || '');
    });
  }, [studyId]);

  const handleTemplateSelect = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) setBody(tpl.body);
  };

  const handleSave = async () => {
    if (!studyId) return;
    setSaving(true);
    try {
      const saved = await saveReport({ study_id: studyId, body, template_id: report?.template_id || null });
      setReport(saved);
      toast.success('Laudo salvo como rascunho');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (!study) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/studies"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Editor de Laudo</h1>
            <p className="text-xs text-muted-foreground">{study.patient_name} — {study.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {report && <Badge variant={report.status === 'signed' ? 'default' : 'secondary'}>{report.status}</Badge>}
          <Button variant="outline" size="sm" onClick={() => setPreview(!preview)}>
            <Eye className="mr-1 h-4 w-4" /> {preview ? 'Editar' : 'Preview'}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="pt-4">
            {!preview ? (
              <Textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={20}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Digite o laudo aqui..."
              />
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-lg bg-muted p-4 text-foreground">
                {body || <span className="text-muted-foreground italic">Laudo vazio</span>}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Template</CardTitle></CardHeader>
            <CardContent>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger><SelectValue placeholder="Selecionar template" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Estudo</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Paciente:</strong> {study.patient_name}</p>
              <p><strong>Accession:</strong> {study.accession_number}</p>
              <p><strong>Data:</strong> {new Date(study.study_date).toLocaleDateString('pt-BR')}</p>
              <p><strong>Modalidade:</strong> {study.modalities.join(', ')}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                <Link to={`/viewer/${study.id}`}>Abrir Viewer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
