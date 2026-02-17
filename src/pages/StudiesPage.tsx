import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStudies } from '@/services/api';
import type { Study, StudyFilters, PaginatedResponse } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileEdit, ChevronLeft, ChevronRight, Printer, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

function reportStatusIcon(status: string | null) {
  if (!status) return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === 'draft') return <AlertCircle className="h-3.5 w-3.5 text-warning" />;
  if (status === 'signed') return <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />;
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
}

function reportStatusLabel(status: string | null) {
  if (!status) return 'Pendente';
  if (status === 'draft') return 'Rascunho';
  if (status === 'signed') return 'Assinado';
  return status;
}

// Mock unit name mapping
const unitNames: Record<string, string> = {
  u1: 'UBS Central',
  u2: 'Hospital Municipal',
  u3: 'Clínica Norte',
};

export default function StudiesPage() {
  const [data, setData] = useState<PaginatedResponse<Study> | null>(null);
  const [filters, setFilters] = useState<StudyFilters>({ page: 1, per_page: 15 });
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
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-base font-semibold text-foreground">Estudos</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <Input
            placeholder="Buscar paciente..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="h-8 w-52 text-xs"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSearch}>
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded border border-border bg-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Data</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Paciente</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Unidade</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Impressão</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Laudar</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Status Envio</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : !data?.items.length ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum estudo encontrado</td>
              </tr>
            ) : data.items.map((study, i) => (
              <tr
                key={study.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {new Date(study.study_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-3 py-2 font-medium text-foreground max-w-[220px] truncate">
                  {study.patient_name}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {unitNames[study.unit_id] || study.unit_id}
                </td>
                <td className="px-3 py-2 text-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Imprimir laudo">
                    <Printer className="h-3.5 w-3.5" />
                  </Button>
                </td>
                <td className="px-3 py-2 text-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Laudar">
                    <Link to={`/reports/${study.id}`}>
                      <FileEdit className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1.5">
                    {reportStatusIcon(study.report_status)}
                    <span className="text-muted-foreground">{reportStatusLabel(study.report_status)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Página {data.page} de {data.total_pages}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={data.page <= 1} onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}>
              <ChevronLeft className="h-3 w-3 mr-0.5" /> Ant
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={data.page >= data.total_pages} onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}>
              Próx <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
