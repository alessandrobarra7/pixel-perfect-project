import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudyById, getReportByStudyId, saveReport } from '@/services/api';
import type { Study, Report } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

// Default predefined snippets
const DEFAULT_SNIPPETS = [
  { id: '1', title: 'Tórax Normal', text: 'Campos pulmonares transparentes. Área cardíaca dentro dos limites da normalidade. Seios costofrênicos livres. Mediastino centrado.' },
  { id: '2', title: 'Crânio Normal', text: 'Parênquima cerebral de aspecto habitual. Sistema ventricular de dimensões normais. Estruturas da linha média centradas.' },
  { id: '3', title: 'Abdômen Normal', text: 'Fígado de dimensões e contornos normais. Vesícula biliar normodistendida. Pâncreas, baço e rins sem alterações.' },
  { id: '4', title: 'Impressão Normal', text: 'Exame dentro dos limites da normalidade.' },
  { id: '5', title: 'Coluna Lombar Normal', text: 'Corpos vertebrais de altura e sinal preservados. Discos intervertebrais sem herniações. Canal vertebral amplo.' },
];

interface Snippet {
  id: string;
  title: string;
  text: string;
}

export default function ReportEditorPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [study, setStudy] = useState<Study | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  // Snippets state — persisted to localStorage per user
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    try {
      const saved = localStorage.getItem('radportal_snippets');
      return saved ? JSON.parse(saved) : DEFAULT_SNIPPETS;
    } catch { return DEFAULT_SNIPPETS; }
  });
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('radportal_snippets', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    if (!studyId) return;
    Promise.all([
      getStudyById(studyId),
      getReportByStudyId(studyId),
    ]).then(([s, r]) => {
      setStudy(s);
      setReport(r);
      setBody(r?.body || '');
    });
  }, [studyId]);

  const handleSave = async () => {
    if (!studyId) return;
    setSaving(true);
    try {
      const saved = await saveReport({ study_id: studyId, body, template_id: report?.template_id || null });
      setReport(saved);
      toast.success('Laudo salvo');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const insertSnippet = (text: string) => {
    setBody(prev => prev ? prev + '\n\n' + text : text);
    toast.success('Texto inserido');
  };

  const addSnippet = () => {
    if (!newTitle.trim() || !newText.trim()) return;
    setSnippets(prev => [...prev, { id: Date.now().toString(), title: newTitle.trim(), text: newText.trim() }]);
    setNewTitle('');
    setNewText('');
    setShowAddForm(false);
    toast.success('Predefinido salvo');
  };

  const removeSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado');
  };

  if (!study) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to="/studies"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">
            Laudo — {study.patient_name}
          </h1>
          <p className="text-[10px] text-muted-foreground">{study.description} • {new Date(study.study_date).toLocaleDateString('pt-BR')}</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSave} disabled={saving}>
          <Save className="h-3.5 w-3.5" />
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      {/* Editor + Snippets */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="flex-1 resize-none font-mono text-xs leading-relaxed min-h-[300px]"
            placeholder="Digite o laudo aqui..."
          />
        </div>

        {/* Snippets panel */}
        <div className="w-64 flex flex-col border border-border rounded bg-card overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground">Predefinidos</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowAddForm(!showAddForm)}
              title="Adicionar predefinido"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div className="p-2 border-b border-border space-y-1.5 bg-muted/30">
              <Input
                placeholder="Título"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="h-7 text-xs"
              />
              <Textarea
                placeholder="Texto predefinido..."
                value={newText}
                onChange={e => setNewText(e.target.value)}
                className="text-xs min-h-[60px] resize-none"
                rows={3}
              />
              <div className="flex gap-1">
                <Button size="sm" className="h-6 text-[10px] flex-1" onClick={addSnippet}>Salvar</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setShowAddForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          {/* Snippet list */}
          <div className="flex-1 overflow-auto">
            {snippets.map(snippet => (
              <div
                key={snippet.id}
                className="group border-b border-border last:border-0 px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => insertSnippet(snippet.text)}
                title="Clique para inserir no laudo"
              >
                <div className="flex items-start gap-1.5">
                  <GripVertical className="h-3 w-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{snippet.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{snippet.text}</p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      className="p-0.5 hover:text-foreground text-muted-foreground"
                      onClick={e => { e.stopPropagation(); copySnippet(snippet.text); }}
                      title="Copiar"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      className="p-0.5 hover:text-destructive text-muted-foreground"
                      onClick={e => { e.stopPropagation(); removeSnippet(snippet.id); }}
                      title="Remover"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {snippets.length === 0 && (
              <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum predefinido</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
