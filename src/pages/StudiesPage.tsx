import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStudies } from '@/services/api';
import type { Study, StudyFilters, PaginatedResponse, StudyModalityType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, MonitorPlay, FileEdit, ChevronLeft, ChevronRight } from 'lucide-react';

const modalityOptions: StudyModalityType[] = ['CR', 'CT', 'MR', 'US', 'DX', 'MG'];

function statusBadge(status: string | null) {
  if (!status) return <Badge variant="outline" className="text-muted-foreground">Pendente</Badge>;
  if (status === 'draft') return <Badge variant="secondary">Rascunho</Badge>;
  if (status === 'signed') return <Badge className="bg-green-600 text-white hover:bg-green-700">Assinado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default function StudiesPage() {
  const [data, setData] = useState<PaginatedResponse<Study> | null>(null);
  const [filters, setFilters] = useState<StudyFilters>({ page: 1, per_page: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (f: StudyFilters) => {
    setLoading(true);
    try {
      const result = await getStudies(f);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(filters); }, [filters, fetchData]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, patient_name: searchInput || undefined, page: 1 }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estudos</h1>
        <p className="text-sm text-muted-foreground">Lista de exames radiológicos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Buscar paciente..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={filters.modality || 'all'}
          onValueChange={v => setFilters(prev => ({ ...prev, modality: v === 'all' ? undefined : v as StudyModalityType, page: 1 }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {modalityOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select
          value={filters.report_status || 'all'}
          onValueChange={v => setFilters(prev => ({ ...prev, report_status: v === 'all' ? undefined : v as any, page: 1 }))}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status Laudo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="signed">Assinado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead className="hidden sm:table-cell">Accession</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Mod.</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Laudo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : !data?.items.length ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum estudo encontrado</TableCell></TableRow>
            ) : data.items.map(study => (
              <TableRow key={study.id}>
                <TableCell className="font-medium text-foreground max-w-[200px] truncate">{study.patient_name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{study.accession_number}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{new Date(study.study_date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell><Badge variant="outline">{study.modalities.join(', ')}</Badge></TableCell>
                <TableCell className="text-muted-foreground max-w-[150px] truncate">{study.description}</TableCell>
                <TableCell>{statusBadge(study.report_status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild title="Detalhes">
                      <Link to={`/studies/${study.id}`}><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Viewer">
                      <Link to={`/viewer/${study.id}`}><MonitorPlay className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Laudar">
                      <Link to={`/reports/${study.id}`}><FileEdit className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {data.page} de {data.total_pages} ({data.total} estudos)
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={data.page >= data.total_pages} onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}>
              Próxima <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
