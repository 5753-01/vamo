import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  FileText,
  Download,
  Copy,
  Check,
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  SlidersHorizontal,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Company, TestRecord } from '../types';
import {
  exportHRPayrollToExcel,
  exportAccountingERPToExcel,
  exportTestsToExcel,
  exportHRPayrollCSV,
  exportAccountingERPCSV,
  exportRawTestingDataCSV,
  formatTestsForHRPayroll,
  formatTestsForAccountingERP,
  formatTestsForExcel,
  cleanRut
} from '../utils/exportManager';

export type IntegrationProfile = 'hr_payroll' | 'accounting_erp' | 'suseso_technical';
export type ExportFileFormat = 'xlsx' | 'csv_semicolon' | 'csv_comma';
export type RutFormatOption = 'clean_with_dash' | 'formatted' | 'numeric_only';

interface ExportIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  tests: TestRecord[];
  selectedTestIds?: string[];
  initialProfile?: IntegrationProfile;
}

export const ExportIntegrationModal: React.FC<ExportIntegrationModalProps> = ({
  isOpen,
  onClose,
  company,
  tests,
  selectedTestIds = [],
  initialProfile = 'hr_payroll'
}) => {
  const [profile, setProfile] = useState<IntegrationProfile>(initialProfile);
  const [fileFormat, setFileFormat] = useState<ExportFileFormat>('xlsx');
  const [rutFormat, setRutFormat] = useState<RutFormatOption>('clean_with_dash');
  
  // Filter states
  const [filterScope, setFilterScope] = useState<'all' | 'selected' | 'filtered'>('all');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | 'custom'>('all');
  const [customDateFrom, setCustomDateFrom] = useState<string>('');
  const [customDateTo, setCustomDateTo] = useState<string>('');
  const [selectedBase, setSelectedBase] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'apto_despacho' | 'no_apto_bloqueado'>('all');

  // Feedback states
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  // Extract unique bases from tests
  const availableBases = useMemo(() => {
    const bases = new Set<string>();
    tests.forEach(t => {
      if (t.driverBase) bases.add(t.driverBase);
    });
    return Array.from(bases);
  }, [tests]);

  // Compute filtered dataset
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      // 1. Scope filter
      if (filterScope === 'selected' && selectedTestIds.length > 0) {
        if (!selectedTestIds.includes(test.id)) return false;
      }

      // 2. Base filter
      if (selectedBase !== 'all' && test.driverBase !== selectedBase) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== 'all' && test.overallStatus !== statusFilter) {
        return false;
      }

      // 4. Date range filter
      if (dateRange !== 'all') {
        const testDateStr = test.timestamp.split(' ')[0];
        const testDate = new Date(testDateStr);
        const now = new Date();

        if (dateRange === '7d') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          if (testDate < sevenDaysAgo) return false;
        } else if (dateRange === '30d') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          if (testDate < thirtyDaysAgo) return false;
        } else if (dateRange === 'custom') {
          if (customDateFrom && testDateStr < customDateFrom) return false;
          if (customDateTo && testDateStr > customDateTo) return false;
        }
      }

      return true;
    });
  }, [tests, filterScope, selectedTestIds, selectedBase, statusFilter, dateRange, customDateFrom, customDateTo]);

  // Sample preview rows for the table
  const previewData = useMemo(() => {
    const sampleTests = filteredTests.slice(0, 4);
    if (sampleTests.length === 0) return { columns: [], rows: [] };

    if (profile === 'hr_payroll') {
      const rows = formatTestsForHRPayroll(company, sampleTests, rutFormat);
      const columns = Object.keys(rows[0] || {}).slice(0, 8);
      return { columns, rows };
    } else if (profile === 'accounting_erp') {
      const rows = formatTestsForAccountingERP(company, sampleTests, rutFormat);
      const columns = Object.keys(rows[0] || {}).slice(0, 8);
      return { columns, rows };
    } else {
      const rows = formatTestsForExcel(company, sampleTests);
      const columns = Object.keys(rows[0] || {}).slice(0, 8);
      return { columns, rows };
    }
  }, [filteredTests, profile, company, rutFormat]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadSuccessMsg(null);

    try {
      let generatedFileName = '';
      const filterOpts = {
        rutFormat,
        filenamePrefix:
          profile === 'hr_payroll'
            ? 'Export_RRHH_Buk_Talana'
            : profile === 'accounting_erp'
            ? 'Export_Contabilidad_Softland_ERP'
            : 'Export_Controles_SUSESO_Tecnico'
      };

      if (fileFormat === 'xlsx') {
        if (profile === 'hr_payroll') {
          generatedFileName = exportHRPayrollToExcel(company, filteredTests, filterOpts);
        } else if (profile === 'accounting_erp') {
          generatedFileName = exportAccountingERPToExcel(company, filteredTests, filterOpts);
        } else {
          generatedFileName = exportTestsToExcel(company, filteredTests, filterOpts);
        }
      } else {
        const delimiter = fileFormat === 'csv_semicolon' ? ';' : ',';
        if (profile === 'hr_payroll') {
          generatedFileName = exportHRPayrollCSV(company, filteredTests, {
            delimiter,
            rutFormat,
            filenamePrefix: filterOpts.filenamePrefix
          });
        } else if (profile === 'accounting_erp') {
          generatedFileName = exportAccountingERPCSV(company, filteredTests, {
            delimiter,
            rutFormat,
            filenamePrefix: filterOpts.filenamePrefix
          });
        } else {
          generatedFileName = exportRawTestingDataCSV(company, filteredTests, {
            delimiter,
            rutFormat,
            filenamePrefix: filterOpts.filenamePrefix,
            sourceContext: 'TestingView_Integration'
          });
        }
      }

      setDownloadSuccessMsg(`Archivo "${generatedFileName}" generado y descargado exitosamente.`);
      setTimeout(() => setDownloadSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Error al exportar:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (filteredTests.length === 0) return;

    let rows: Record<string, any>[] = [];
    if (profile === 'hr_payroll') {
      rows = formatTestsForHRPayroll(company, filteredTests, rutFormat);
    } else if (profile === 'accounting_erp') {
      rows = formatTestsForAccountingERP(company, filteredTests, rutFormat);
    } else {
      rows = formatTestsForExcel(company, filteredTests);
    }

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const tsvContent = [
      headers.join('\t'),
      ...rows.map(r => headers.map(h => String(r[h] ?? '')).join('\t'))
    ].join('\r\n');

    navigator.clipboard.writeText(tsvContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div
        id="export-integration-modal"
        className="relative w-full max-w-5xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 rounded-xl border border-indigo-400/30">
              <FileSpreadsheet className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Exportación e Integración de Registros
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  CSV / Excel
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Integración con sistemas contables (Softland, SAP, Defontana) y plataformas de RRHH (Buk, Talana, Payroll)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Profile Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              1. Seleccione el Perfil de Integración Externa
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* RRHH Profile */}
              <button
                type="button"
                onClick={() => setProfile('hr_payroll')}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  profile === 'hr_payroll'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${profile === 'hr_payroll' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Recursos Humanos & Nómina</h4>
                    <span className="text-[11px] text-indigo-600 font-medium">Buk · Talana · SAP HR · Workday</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  ID de empleado, RUT limpio sin puntos, asistencia de turno, códigos de incidencia y actas laborales.
                </p>
                {profile === 'hr_payroll' && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                )}
              </button>

              {/* Accounting Profile */}
              <button
                type="button"
                onClick={() => setProfile('accounting_erp')}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  profile === 'accounting_erp'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${profile === 'accounting_erp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Contabilidad & Costos ERP</h4>
                    <span className="text-[11px] text-emerald-600 font-medium">Softland · Defontana · SAP FI · Nubox</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Centros de costos, cuenta contable (510204), valorización de insumos en CLP y glosas de comprobante.
                </p>
                {profile === 'accounting_erp' && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                )}
              </button>

              {/* SUSESO / Forensic Technical */}
              <button
                type="button"
                onClick={() => setProfile('suseso_technical')}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  profile === 'suseso_technical'
                    ? 'border-slate-800 bg-slate-50 shadow-sm ring-1 ring-slate-800'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${profile === 'suseso_technical' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Auditoría SUSESO Completa</h4>
                    <span className="text-[11px] text-slate-600 font-medium">Dictamen 92064-2025 · Ley 18.290</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  40 columnas técnicas con detalle de reactivos por droga, calibración de equipos y trazabilidad SHA-256.
                </p>
                {profile === 'suseso_technical' && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-200" />
                )}
              </button>
            </div>
          </div>

          {/* Step 2: File Format & Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Format Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                2. Formato del Archivo
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="fileFormat"
                    value="xlsx"
                    checked={fileFormat === 'xlsx'}
                    onChange={() => setFileFormat('xlsx')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">.XLSX</span>
                    <span className="text-xs font-medium text-slate-800">Microsoft Excel Workbook (con pestañas de diccionario)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="fileFormat"
                    value="csv_semicolon"
                    checked={fileFormat === 'csv_semicolon'}
                    onChange={() => setFileFormat('csv_semicolon')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">.CSV (;)</span>
                    <span className="text-xs font-medium text-slate-800">CSV delimitado por Punto y Coma (Recomendado Softland / Excel Chile)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="fileFormat"
                    value="csv_comma"
                    checked={fileFormat === 'csv_comma'}
                    onChange={() => setFileFormat('csv_comma')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">.CSV (,)</span>
                    <span className="text-xs font-medium text-slate-800">CSV Estándar RFC-4180 (Coma, compatible con PowerBI y Python)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* RUT Format Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                3. Formato del RUT (Identificador Nacional)
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="rutFormat"
                    value="clean_with_dash"
                    checked={rutFormat === 'clean_with_dash'}
                    onChange={() => setRutFormat('clean_with_dash')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-slate-800">Limpio con guión (sin puntos)</span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">16890312-7</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="rutFormat"
                    value="formatted"
                    checked={rutFormat === 'formatted'}
                    onChange={() => setRutFormat('formatted')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-slate-800">Formato oficial con puntos</span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">16.890.312-7</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-400">
                  <input
                    type="radio"
                    name="rutFormat"
                    value="numeric_only"
                    checked={rutFormat === 'numeric_only'}
                    onChange={() => setRutFormat('numeric_only')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-slate-800">Solo cuerpo numérico (sin DV)</span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">16890312</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Filters Toolbar */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                4. Filtros Aplicables a la Exportación
              </span>
              <span className="text-xs font-medium text-slate-500">
                Registros listos para exportar:{' '}
                <strong className="text-indigo-600 font-bold text-sm">{filteredTests.length}</strong> de {tests.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Scope Selection (All vs Selected) */}
              {selectedTestIds.length > 0 && (
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Alcance</label>
                  <select
                    value={filterScope}
                    onChange={(e) => setFilterScope(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Todo el universo ({tests.length})</option>
                    <option value="selected">Solo seleccionados ({selectedTestIds.length})</option>
                  </select>
                </div>
              )}

              {/* Date range */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">Rango de Fecha</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Histórico completo</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="custom">Personalizado...</option>
                </select>
              </div>

              {/* Base Operacional */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">Base / Centro Costo</label>
                <select
                  value={selectedBase}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Todas las bases ({availableBases.length})</option>
                  {availableBases.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">Resultado Operativo</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Todos los resultados</option>
                  <option value="apto_despacho">Solo Aptos para Despacho</option>
                  <option value="no_apto_bloqueado">Solo No Aptos / Bloqueados</option>
                </select>
              </div>
            </div>

            {/* Custom Dates Row */}
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Desde Fecha</label>
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Hasta Fecha</label>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Previsualización de Columnas y Datos ({previewData.columns.length} columnas mostradas de muestra)
              </span>
              <span className="text-[11px] text-slate-500">
                Visualizando 4 de {filteredTests.length} filas
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="overflow-x-auto max-h-44">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      {previewData.columns.map(col => (
                        <th key={col} className="p-2.5 whitespace-nowrap border-r border-slate-200 last:border-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {previewData.rows.length === 0 ? (
                      <tr>
                        <td colSpan={previewData.columns.length || 1} className="p-4 text-center text-slate-400 italic">
                          No hay registros que coincidan con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      previewData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          {previewData.columns.map(col => (
                            <td key={col} className="p-2.5 whitespace-nowrap font-mono text-slate-700 border-r border-slate-100 last:border-0">
                              {String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Success message banner */}
          {downloadSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{downloadSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Empresa: <strong>{company.businessName}</strong> ({cleanRut(company.rut, 'clean_with_dash')})
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Copy to clipboard button */}
            <button
              type="button"
              onClick={handleCopyToClipboard}
              disabled={filteredTests.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Copiar datos delimitados por tabulaciones para pegar en Excel o Sheets"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar Tabla (TSV)</span>
                </>
              )}
            </button>

            {/* Download file button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={filteredTests.length === 0 || isDownloading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all text-white ${
                profile === 'accounting_erp'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              } disabled:opacity-50`}
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloading
                  ? 'Generando archivo...'
                  : `Exportar ${fileFormat === 'xlsx' ? 'Excel (.xlsx)' : 'CSV'}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
