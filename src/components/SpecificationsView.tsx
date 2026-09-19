import React, { useState, useMemo } from 'react';
import {
  SPECIFICATIONS_DATA,
  SpecificationItem,
  ROADMAP_PHASES_DATA,
  RoadmapPhaseItem,
  CRITICAL_RISKS_DATA,
  CriticalRiskItem,
  getPhaseForDeliverable,
  getCriticalRisksForDeliverable
} from '../data/specificationsData';
import { BrandLogo } from './BrandLogo';
import { PrintGuideDialog } from './PrintGuideDialog';
import technicalCoverImg from '../assets/images/technical_cover_1789798633692.jpg';
import {
  FileCode,
  Search,
  Filter,
  CheckCircle2,
  Download,
  ShieldCheck,
  Cpu,
  Scale,
  Activity,
  GraduationCap,
  Lock,
  Headphones,
  FileSpreadsheet,
  ExternalLink,
  Layers,
  Sparkles,
  Printer,
  ChevronRight,
  Palette,
  FileText,
  BadgeAlert,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Briefcase,
  Users,
  Check,
  BookOpen
} from 'lucide-react';

export const SpecificationsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedCriticalRisk, setSelectedCriticalRisk] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<SpecificationItem | null>(SPECIFICATIONS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'roadmap' | 'critical_risks' | 'caratula' | 'styleguide' | 'summary'>('matrix');

  // Print helper dialog
  const [showPrintGuide, setShowPrintGuide] = useState(false);
  const [showPrintTooltip, setShowPrintTooltip] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(SPECIFICATIONS_DATA.map((item) => item.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered items
  const filteredData = useMemo(() => {
    return SPECIFICATIONS_DATA.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.normativeOrTech.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kpis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString() === searchTerm.trim();

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSrc = selectedSource === 'all' || item.source === selectedSource;

      const phase = getPhaseForDeliverable(item.id);
      const matchesPhase = selectedPhase === 'all' || phase?.id === selectedPhase;

      const criticalRisks = getCriticalRisksForDeliverable(item.id);
      const matchesRisk = selectedCriticalRisk === 'all' || criticalRisks.some((r) => r.id === selectedCriticalRisk);

      return matchesSearch && matchesCat && matchesSrc && matchesPhase && matchesRisk;
    });
  }, [searchTerm, selectedCategory, selectedSource, selectedPhase, selectedCriticalRisk]);

  // Export to CSV with full integrated columns
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Categoría',
      'Componente',
      'Fase del Roadmap',
      'Riesgos Críticos Mitigados',
      'Tipo de Documento o Servicio',
      'Descripción Detallada',
      'Indicadores de Desempeño (KPIs)',
      'Normativa o Tecnología Aplicada',
      'Frecuencia o Duración',
      'Fuente',
      'Estado'
    ];

    const rows = filteredData.map((d) => {
      const phase = getPhaseForDeliverable(d.id);
      const risks = getCriticalRisksForDeliverable(d.id);
      return [
        d.id,
        `"${d.category}"`,
        `"${d.component}"`,
        `"${phase ? phase.name : 'Operación Continua'}"`,
        `"${risks.map((r) => r.id).join('; ') || 'Mitigación General'}"`,
        `"${d.serviceType.replace(/"/g, '""')}"`,
        `"${d.description.replace(/"/g, '""')}"`,
        `"${d.kpis.replace(/"/g, '""')}"`,
        `"${d.normativeOrTech.replace(/"/g, '""')}"`,
        `"${d.frequencyOrDuration.replace(/"/g, '""')}"`,
        `"${d.source}"`,
        `"${d.status}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BlindajeVial360_Matriz_Entregables_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tecnología':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'Legal y Normativo':
        return <Scale className="w-4 h-4 text-purple-400" />;
      case 'Operaciones':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'Capacitación':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'Seguridad de la Información':
        return <Lock className="w-4 h-4 text-rose-400" />;
      case 'Soporte y SLA':
        return <Headphones className="w-4 h-4 text-teal-400" />;
      case 'Estratégico y Gestión':
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const selectDeliverableById = (id: number) => {
    const item = SPECIFICATIONS_DATA.find((s) => s.id === id);
    if (item) {
      setSelectedItem(item);
      setActiveTab('matrix');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner with Brand Logo */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" showText={false} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold font-mono bg-[#0056B3] text-white px-3 py-1 rounded-lg shadow">
                    MATRIZ OFICIAL DE ENTREGABLES & ROADMAP
                  </span>
                  <span className="text-xs font-mono bg-slate-800 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-lg">
                    66 Entregables • 3 Fases • 5 Riesgos Críticos
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Especificaciones, Roadmap Operativo y Matriz de Riesgos Críticos
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidado normativo, estratégico y técnico de <strong>Blindaje Vial 360</strong>. Articula los 66 entregables clave con el <strong>Roadmap de Implementación (Fases 1, 2 y 3)</strong> y la <strong>Matriz de Mitigación de Riesgos Críticos</strong> ante la Dirección del Trabajo (DT), SUSESO (Dictamen 92064-2025) y los estándares ISO 37301 / 39001.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 bg-[#0056B3] hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl shadow-blue-600/30 transition cursor-pointer"
              title="Descargar matriz completa consolidada en formato CSV con Fases y Riesgos"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Matriz (CSV)</span>
            </button>

            {/* Print button with Guide integration */}
            <div className="relative inline-flex items-center w-full">
              <button
                id="print-specs-btn"
                onClick={() => window.print()}
                onMouseEnter={() => setShowPrintTooltip(true)}
                onMouseLeave={() => setShowPrintTooltip(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs py-3 px-4 rounded-l-2xl transition cursor-pointer"
                title="Imprimir o guardar PDF del dossier normativo"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Imprimir Dossier</span>
              </button>
              <button
                onClick={() => setShowPrintGuide(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-l-0 border-slate-700 p-3 rounded-r-2xl transition cursor-pointer"
                title="Ver guía de ajustes de impresión (Gráficos de fondo, formato A4)"
                aria-label="Guía de impresión óptima"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
              </button>

              {/* Tooltip on hover */}
              {showPrintTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-950/95 border border-amber-500/40 text-slate-200 text-[11px] rounded-xl p-2.5 shadow-2xl z-50 pointer-events-none animate-in fade-in duration-100">
                  <div className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Ajuste de Impresión</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-snug">
                    Active <strong>«Gráficos de fondo»</strong> en el diálogo del navegador para preservar los sellos normativos y colores heráldicos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Matriz de Entregables ({filteredData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-indigo-400 hover:text-indigo-200 bg-indigo-950/30 border border-indigo-800/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Roadmap & Fases (3 Fases)</span>
          </button>

          <button
            onClick={() => setActiveTab('critical_risks')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'critical_risks'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-400 hover:text-rose-200 bg-rose-950/30 border border-rose-800/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Riesgos Críticos (RSK 01-05)</span>
          </button>

          <button
            onClick={() => setActiveTab('caratula')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'caratula'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-cyan-400 hover:text-cyan-200 bg-cyan-950/40 border border-cyan-800/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Carátula Técnica ISO (Canal 2)</span>
          </button>

          <button
            onClick={() => setActiveTab('styleguide')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'styleguide'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Guía de Estilo Oficial</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Resumen Ejecutivo</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 px-3">
          Mostrando <strong>{filteredData.length}</strong> de <strong>{SPECIFICATIONS_DATA.length}</strong> especificaciones
        </div>
      </div>

      {/* TAB 1: SPECIFICATIONS MATRIX (66 DELIVERABLES CONECTADOS) */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por ID, tecnología, normativa, KPI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Selectors Grid */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Filter by Category */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold">Categoría:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todas ({SPECIFICATIONS_DATA.length})</option>
                  {categories
                    .filter((c) => c !== 'all')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c} ({SPECIFICATIONS_DATA.filter((i) => i.category === c).length})
                      </option>
                    ))}
                </select>
              </div>

              {/* Filter by Roadmap Phase */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-indigo-400 font-semibold">Fase:</span>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="bg-slate-950 border border-indigo-900/60 rounded-xl px-2.5 py-1.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Todas las Fases</option>
                  <option value="FASE_1">Fase 1: Diagnóstico & Legal (10)</option>
                  <option value="FASE_2">Fase 2: Tecnología & Capacitación (13)</option>
                  <option value="FASE_3">Fase 3: Operación & ISO 39001 (16)</option>
                </select>
              </div>

              {/* Filter by Critical Risk */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-rose-400 font-semibold">Riesgo:</span>
                <select
                  value={selectedCriticalRisk}
                  onChange={(e) => setSelectedCriticalRisk(e.target.value)}
                  className="bg-slate-950 border border-rose-900/60 rounded-xl px-2.5 py-1.5 text-xs text-rose-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">Todos los Riesgos</option>
                  <option value="RSK-01">RSK-01 (Impugnación RIOHS)</option>
                  <option value="RSK-02">RSK-02 (Culpa In Vigilando)</option>
                  <option value="RSK-03">RSK-03 (Privacidad Datos)</option>
                  <option value="RSK-04">RSK-04 (Rechazo Sindical)</option>
                  <option value="RSK-05">RSK-05 (Cadena de Custodia)</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || selectedPhase !== 'all' || selectedCriticalRisk !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPhase('all');
                    setSelectedCriticalRisk('all');
                    setSearchTerm('');
                  }}
                  className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg transition"
                >
                  Restablecer
                </button>
              )}
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left List */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2 max-h-[800px] overflow-y-auto">
              {filteredData.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const phase = getPhaseForDeliverable(item.id);
                const criticalRisks = getCriticalRisksForDeliverable(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                          #{item.id}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-medium text-slate-300">
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {phase && (
                          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                            {phase.id === 'FASE_1' ? 'Fase 1 Legal' : phase.id === 'FASE_2' ? 'Fase 2 Ops/Tech' : 'Fase 3 Monitoreo'}
                          </span>
                        )}

                        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white">{item.serviceType}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Critical risk badges if any */}
                    {criticalRisks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {criticalRisks.map((cr) => (
                          <span
                            key={cr.id}
                            className="text-[9px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>Mitiga {cr.id}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                      <span className="truncate max-w-[280px]">{item.normativeOrTech.split(';')[0]}</span>
                      <span className="text-blue-400 shrink-0">{item.source}</span>
                    </div>
                  </div>
                );
              })}

              {filteredData.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No se encontraron especificaciones con los filtros actuales.
                </div>
              )}
            </div>

            {/* Right Detail Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-20">
              {selectedItem ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          ENTREGABLE #{selectedItem.id}
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                          {selectedItem.source}
                        </span>
                        {getPhaseForDeliverable(selectedItem.id) && (
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono">
                            {getPhaseForDeliverable(selectedItem.id)?.id}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{selectedItem.serviceType}</h3>
                      <span className="text-xs text-slate-400">{selectedItem.component}</span>
                    </div>

                    <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg shrink-0">
                      {selectedItem.status}
                    </span>
                  </div>

                  {/* Associated Roadmap Phase Info */}
                  {getPhaseForDeliverable(selectedItem.id) && (
                    <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          FASE VINCULADA EN ROADMAP
                        </span>
                        <button
                          onClick={() => setActiveTab('roadmap')}
                          className="text-[10px] text-indigo-300 hover:text-white underline cursor-pointer flex items-center gap-0.5"
                        >
                          <span>Ver en Cronograma</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-semibold">
                        {getPhaseForDeliverable(selectedItem.id)?.name}
                      </p>
                      <p className="text-[11px] text-indigo-200/80">
                        Duración: {getPhaseForDeliverable(selectedItem.id)?.estimatedDuration}
                      </p>
                    </div>
                  )}

                  {/* Associated Critical Risks */}
                  {getCriticalRisksForDeliverable(selectedItem.id).length > 0 && (
                    <div className="bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-2xl space-y-2">
                      <span className="text-[10px] font-mono text-rose-300 font-bold uppercase flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        BLINDAJE DE RIESGO CRÍTICO LEGAL / LABORAL
                      </span>
                      {getCriticalRisksForDeliverable(selectedItem.id).map((cr) => (
                        <div key={cr.id} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-200">{cr.id}: {cr.riskTitle}</span>
                            <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded">
                              {cr.riskLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            {cr.legalLaborConsequence}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description Box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      DESCRIPCIÓN OPERACIONAL & TÉCNICA
                    </label>
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-200 leading-relaxed">
                      {selectedItem.description}
                    </div>
                  </div>

                  {/* KPIs Box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      INDICADORES DE DESEMPEÑO (KPIS)
                    </label>
                    <div className="bg-slate-950 border border-emerald-500/20 p-3.5 rounded-2xl text-xs text-emerald-300 leading-relaxed font-mono">
                      {selectedItem.kpis}
                    </div>
                  </div>

                  {/* Normative / Technology Box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-blue-400 font-bold flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      NORMATIVA O TECNOLOGÍA APLICADA
                    </label>
                    <div className="bg-slate-950 border border-blue-500/20 p-3.5 rounded-2xl text-xs text-blue-200 leading-relaxed">
                      {selectedItem.normativeOrTech}
                    </div>
                  </div>

                  {/* Frequency & Duration */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                      FRECUENCIA O DURACIÓN
                    </label>
                    <div className="bg-slate-950 border border-purple-500/20 p-3 rounded-xl text-xs text-purple-300 font-mono">
                      {selectedItem.frequencyOrDuration}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Seleccione una especificación de la lista para ver todos sus detalles.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROADMAP & FASES (CRONOGRAMA DE IMPLEMENTACIÓN) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                  PLAN DIRECTOR DE IMPLEMENTACIÓN Y OPERACIÓN
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Roadmap de 3 Fases: Legal, Tecnológico y Auditoría Continua
                </h2>
              </div>
              <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Duración Total: 10 Meses (Ciclo ISO 39001)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Estructura secuencial que garantiza que la operación de controles preventivos en ruta y terminales cuente con blindaje normativo previo ante la Dirección del Trabajo (DT) y la SUSESO, evitando cualquier contingencia sindical o litigio laboral.
            </p>
          </div>

          {/* 3 Phases Detailed Cards */}
          <div className="space-y-6">
            {ROADMAP_PHASES_DATA.map((phase, idx) => (
              <div
                key={phase.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-5 transition shadow-lg"
              >
                {/* Phase Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-extrabold flex items-center justify-center font-mono text-base">
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                        {phase.id} • {phase.estimatedDuration}
                      </span>
                      <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPhase(phase.id);
                      setActiveTab('matrix');
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer self-start md:self-auto shadow"
                  >
                    <span>Ver {phase.keyDeliverableIds.length} Entregables de esta Fase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Strategic Objective */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    OBJETIVO ESTRATÉGICO
                  </span>
                  <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl text-xs text-slate-200 leading-relaxed">
                    {phase.strategicObjective}
                  </div>
                </div>

                {/* Key Milestones */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    HITOS PRINCIPALES DE CUMPLIMIENTO
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {phase.keyMilestones.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables Chips in this phase */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    ENTREGABLES CLAVE VINCULADOS ({phase.keyDeliverableIds.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {phase.keyDeliverableIds.map((dId) => {
                      const deliverable = SPECIFICATIONS_DATA.find((s) => s.id === dId);
                      return (
                        <button
                          key={dId}
                          onClick={() => selectDeliverableById(dId)}
                          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
                          title={`Ver detalles de #${dId} - ${deliverable?.serviceType}`}
                        >
                          <span className="text-blue-400 font-mono font-bold">#{dId}</span>
                          <span className="truncate max-w-[200px]">{deliverable?.serviceType || `Entregable #${dId}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MATRIZ DE RIESGOS CRÍTICOS (RSK-01 A RSK-05) */}
      {activeTab === 'critical_risks' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                  MATRIZ DE RIESGOS CRÍTICOS & BLINDAJE JURÍDICO-OPERACIONAL
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  5 Riesgos Críticos Mitigados por el Programa Blindaje Vial 360
                </h2>
              </div>
              <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-700/50 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Marco Legal: DT • SUSESO • Código Civil • Ley 16.744
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Análisis formal de contingencias de máxima severidad jurídica, laboral y reputacional en el transporte de carga y pasajeros, detallando sus consecuencias legales auditables y las medidas de mitigación técnica integradas en la plataforma.
            </p>
          </div>

          {/* 5 Critical Risk Cards */}
          <div className="space-y-6">
            {CRITICAL_RISKS_DATA.map((risk) => (
              <div
                key={risk.id}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 space-y-5 transition shadow-xl"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold flex items-center justify-center font-mono shrink-0 text-sm">
                      {risk.id.replace('RSK-', 'R')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-rose-400">{risk.id}</span>
                        <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                          NIVEL {risk.riskLevel}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                          Probabilidad: {risk.probability}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                          Impacto: {risk.impact}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{risk.riskTitle}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCriticalRisk(risk.id);
                      setActiveTab('matrix');
                    }}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer self-start md:self-auto shadow"
                  >
                    <span>Ver Entregables de Mitigación</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Legal Consequence */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    CONSECUENCIA LEGAL / LABORAL DIRECTA
                  </span>
                  <div className="bg-rose-950/20 border border-rose-500/20 p-3.5 rounded-2xl text-xs text-rose-200 leading-relaxed font-sans">
                    {risk.legalLaborConsequence}
                  </div>
                </div>

                {/* Immediate Mitigation */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    MEDIDA DE MITIGACIÓN INMEDIATA AUDITABLE
                  </span>
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-2xl text-xs text-emerald-200 leading-relaxed">
                    {risk.immediateMitigation}
                  </div>
                </div>

                {/* Responsible & Deliverables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      RESPONSABLE DEL CUMPLIMIENTO
                    </span>
                    <p className="text-xs text-slate-200 font-semibold">{risk.responsible}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      ENTREGABLES BLINDADOS VINCULADOS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {risk.affectedDeliverableIds.map((dId) => {
                        const deliverable = SPECIFICATIONS_DATA.find((s) => s.id === dId);
                        return (
                          <button
                            key={dId}
                            onClick={() => selectDeliverableById(dId)}
                            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer flex items-center gap-1"
                            title={`Ver #${dId} - ${deliverable?.serviceType}`}
                          >
                            <span className="text-blue-400 font-bold">#{dId}</span>
                            <span className="truncate max-w-[140px]">{deliverable?.serviceType}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CARÁTULA & DOSSIER TÉCNICO (CANAL 2) */}
      {activeTab === 'caratula' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-cyan-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    DOCUMENTACIÓN TÉCNICA OFICIAL
                  </span>
                  <span className="bg-slate-800 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold px-3 py-1 rounded-full">
                    ISO 37301 • ISO 39001 • DICTAMEN 92064-2025
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Blindaje Vial 360 • Documento Técnico & Dossier Normativo
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Carátula técnica estandarizada para auditorías periciales, fiscalizaciones de la Dirección del Trabajo (DT), requerimientos SUSESO y certificaciones de interoperabilidad vehicular.
                </p>

                {/* ISO Technical Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-white block">ISO 39001</span>
                    <span className="text-[9px] text-slate-400">Seguridad Vial</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <Scale className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-white block">ISO 37301</span>
                    <span className="text-[9px] text-slate-400">Compliance Legal</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <Cpu className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-white block">SHA-256</span>
                    <span className="text-[9px] text-slate-400">Hash Inalterable</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-white block">ISP Acreditado</span>
                    <span className="text-[9px] text-slate-400">Metrología Dräger</span>
                  </div>
                </div>
              </div>

              {/* Technical Cover Image Card */}
              <div className="w-full lg:w-96 shrink-0 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/50 group">
                  <img
                    src={technicalCoverImg}
                    alt="Blindaje Vial 360 Documento Técnico"
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-950/90 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-cyan-500/40">
                      RESOLUCIÓN 8K BLUEPRINT
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = technicalCoverImg;
                      link.download = 'BlindajeVial360_Caratula_Tecnica_ISO.jpg';
                      link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Portada Técnica</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition cursor-pointer"
                    title="Imprimir Carátula"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STYLE GUIDE & OFFICIAL BRANDING */}
      {activeTab === 'styleguide' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                GUÍA DE ESTILO OFICIAL (ESPECIFICACIÓN #66 / FUENTE 21)
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Manual de Identidad Visual & Logotipo Oficial Blindaje Vial 360
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Definición de colores corporativos, tipografía, emblema heráldico de seguridad vial y reglas de aplicación.
              </p>
            </div>

            {/* Logo Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo on Dark Canvas */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Aplicación en Fondo Oscuro (Principal)</span>
                <BrandLogo size="xl" showText={true} />
                <span className="text-[11px] text-slate-500 font-mono">Software SaaS • Dashboard Ejecutivo</span>
              </div>

              {/* Logo on Light Canvas */}
              <div className="bg-slate-100 border border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-mono text-slate-600 uppercase font-bold">Aplicación en Fondo Claro / Impreso</span>
                <div className="flex items-center gap-3">
                  <BrandLogo size="lg" showText={false} variant="light" />
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-lg text-slate-900 font-sans tracking-wide">
                      BLINDAJE VIAL <span className="text-[#0056B3]">360</span>
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      Seguridad Vial & Compliance ISO 37301
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-600 font-mono">Actas Digitales • Informes Periciales PDF</span>
              </div>

              {/* Vector Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Significado del Emblema Heráldico</span>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Escudo Metálico 3D:</strong> Blindaje y protección jurídica y física frente a siniestros.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Checkmark Blanco:</strong> Verificación de aptitud técnica, resultado negativo y conformidad DT.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Arco Horizonte/Carretera:</strong> Enfoque integral en el transporte y operación en ruta.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Corporate Palette Cards */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Paleta Cromática Oficial y Códigos Hexadecimales
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="w-full h-12 rounded-xl bg-[#0056B3] flex items-center justify-center font-mono font-bold text-xs text-white shadow-inner">
                    #0056B3
                  </div>
                  <h4 className="text-xs font-bold text-white">Azul Seguridad Primario</h4>
                  <p className="text-[10px] text-slate-400">
                    Color representativo de la marca, botones primarios y encabezados.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="w-full h-12 rounded-xl bg-[#C41E3A] flex items-center justify-center font-mono font-bold text-xs text-white shadow-inner">
                    #C41E3A
                  </div>
                  <h4 className="text-xs font-bold text-white">Rojo Alerta / Bloqueo</h4>
                  <p className="text-[10px] text-slate-400">
                    Positivos presuntivos, bloqueos preventivos y alertas críticas de seguridad.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="w-full h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-mono font-bold text-xs text-white shadow-inner">
                    #059669
                  </div>
                  <h4 className="text-xs font-bold text-white">Verde Apto / Habilitado</h4>
                  <p className="text-[10px] text-slate-400">
                    Controles negativos (0.00 g/L), pases de despacho y certificados válidos.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="w-full h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-200 shadow-inner">
                    #0F172A
                  </div>
                  <h4 className="text-xs font-bold text-white">Gris Pizarra Oscuro</h4>
                  <p className="text-[10px] text-slate-400">
                    Fondo de alto contraste para garitas nocturnas y terminales de despacho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EXECUTIVE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">
              ALCANCE INTEGRAL DEL PROYECTO
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Resumen de Cobertura Tecnológica, Jurídica y Operativa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold">TECNOLOGÍA E INSTRUMENTAL</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alcoholímetros Dräger 6820 calibrados bajo NCh-ISO 17025, paneles salivales rápidos de 6 drogas Assure Tech con registro ISP y dispositivos Alcolocks para bloqueo preventivo de ignición.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold">MARCO JURÍDICO & SUSESO</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conformidad integral con el Dictamen SUSESO 92064-2025, Código del Trabajo Art. 184 y 154 N° 5, Ley Emilia (20.770), Ley de Tolerancia Cero (20.580) y Ley de Protección de la Vida Privada (19.628).
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">SOFTWARE & CRIPTOGRAFÍA</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Motor de sorteo aleatorio inopinado con semilla criptográfica SHA-256, bóveda inalterable AES-256, actas con geolocalización GPS, timestamp digital y API RESTful para integración con sistemas de RRHH/TMS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Print Guide Dialog */}
      <PrintGuideDialog
        isOpen={showPrintGuide}
        onClose={() => setShowPrintGuide(false)}
        onConfirmPrint={() => window.print()}
      />
    </div>
  );
};
