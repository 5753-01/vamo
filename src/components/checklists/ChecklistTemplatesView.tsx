import React, { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  Search,
  Filter,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Copy,
  Edit3,
  Trash2,
  Play,
  Layers,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Award,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  ChecklistTemplate,
  ChecklistInspectionExecution,
  VehicleCategory,
  TransportOperationType,
  Company,
  Vehicle,
  Driver
} from '../../types';
import {
  INITIAL_CHECKLIST_TEMPLATES,
  INITIAL_CHECKLIST_INSPECTIONS,
  VEHICLE_CATEGORY_LABELS,
  TRANSPORT_OPERATION_LABELS
} from '../../data/checklistTemplatesData';
import { BrandLogo } from '../BrandLogo';
import { ChecklistTemplateEditorModal } from './ChecklistTemplateEditorModal';
import { ChecklistExecutionModal } from './ChecklistExecutionModal';
import {
  generateChecklistTemplateBlankPDF,
  generateInspectionReportPDF
} from '../../utils/checklistPdfExport';

interface ChecklistTemplatesViewProps {
  company: Company;
  vehicles: Vehicle[];
  drivers: Driver[];
  currentUserName: string;
}

export const ChecklistTemplatesView: React.FC<ChecklistTemplatesViewProps> = ({
  company,
  vehicles,
  drivers,
  currentUserName
}) => {
  // Master templates list in state (persisted in localStorage or initial)
  const [templates, setTemplates] = useState<ChecklistTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('blindaje_vial_checklist_templates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved checklist templates', e);
    }
    return INITIAL_CHECKLIST_TEMPLATES;
  });

  // Inspections history in state
  const [inspections, setInspections] = useState<ChecklistInspectionExecution[]>(() => {
    try {
      const saved = localStorage.getItem('blindaje_vial_checklist_inspections');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved checklist inspections', e);
    }
    return INITIAL_CHECKLIST_INSPECTIONS;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'templates' | 'inspections' | 'analytics'>('templates');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [selectedOperationFilter, setSelectedOperationFilter] = useState<string>('all');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ChecklistTemplate | null>(null);

  const [isExecutionOpen, setIsExecutionOpen] = useState(false);
  const [executionTemplate, setExecutionTemplate] = useState<ChecklistTemplate | null>(null);

  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);

  // Save templates helper
  const handleSaveTemplate = (newOrUpdated: ChecklistTemplate) => {
    setTemplates((prev) => {
      const index = prev.findIndex((t) => t.id === newOrUpdated.id);
      let next: ChecklistTemplate[];
      if (index >= 0) {
        next = [...prev];
        next[index] = newOrUpdated;
      } else {
        next = [newOrUpdated, ...prev];
      }
      try {
        localStorage.setItem('blindaje_vial_checklist_templates', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save to local storage', err);
      }
      return next;
    });
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta plantilla de lista de chequeo?')) {
      setTemplates((prev) => {
        const next = prev.filter((t) => t.id !== id);
        try {
          localStorage.setItem('blindaje_vial_checklist_templates', JSON.stringify(next));
        } catch (err) {
          console.warn('Failed to save to local storage', err);
        }
        return next;
      });
    }
  };

  // Duplicate / Clone template
  const handleCloneTemplate = (original: ChecklistTemplate) => {
    const cloned: ChecklistTemplate = {
      ...original,
      id: `tmpl-cloned-${Date.now()}`,
      code: `${original.code}-COPIA`,
      name: `${original.name} (Personalizada)`,
      version: '1.0',
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    handleSaveTemplate(cloned);
  };

  // Add new inspection record
  const handleInspectionCompleted = (newInspection: ChecklistInspectionExecution) => {
    setInspections((prev) => {
      const next = [newInspection, ...prev];
      try {
        localStorage.setItem('blindaje_vial_checklist_inspections', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save inspection', err);
      }
      return next;
    });
  };

  // Download blank template PDF
  const handleDownloadBlankPdf = async (tmpl: ChecklistTemplate) => {
    setDownloadingPdfId(tmpl.id);
    try {
      await generateChecklistTemplateBlankPDF(tmpl, company);
    } catch (e) {
      console.error('Error generating blank PDF', e);
    } finally {
      setDownloadingPdfId(null);
    }
  };

  // Download completed inspection report PDF
  const handleDownloadInspectionPdf = async (insp: ChecklistInspectionExecution) => {
    const tmpl =
      templates.find((t) => t.id === insp.templateId) ||
      templates[0] ||
      INITIAL_CHECKLIST_TEMPLATES[0];
    setDownloadingPdfId(insp.id);
    try {
      await generateInspectionReportPDF(insp, tmpl, company);
    } catch (e) {
      console.error('Error generating inspection report PDF', e);
    } finally {
      setDownloadingPdfId(null);
    }
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      const matchesSearch =
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVehicle =
        selectedVehicleFilter === 'all' ||
        tmpl.applicableVehicleTypes.includes(selectedVehicleFilter as VehicleCategory);

      const matchesOperation =
        selectedOperationFilter === 'all' ||
        tmpl.applicableOperations.includes(selectedOperationFilter as TransportOperationType);

      return matchesSearch && matchesVehicle && matchesOperation;
    });
  }, [templates, searchQuery, selectedVehicleFilter, selectedOperationFilter]);

  // Quick statistics
  const stats = useMemo(() => {
    const totalInsp = inspections.length;
    const authorized = inspections.filter((i) => i.dispatchDecision === 'AUTORIZADO').length;
    const blocked = inspections.filter((i) => i.dispatchDecision === 'BLOQUEO_INMEDIATO').length;
    const conditioned = inspections.filter((i) => i.dispatchDecision === 'CONDICIONADO').length;
    const avgScore =
      totalInsp > 0
        ? (inspections.reduce((acc, i) => acc + i.complianceScore, 0) / totalInsp).toFixed(1)
        : '100.0';

    return {
      totalTemplates: templates.length,
      totalInsp,
      authorized,
      blocked,
      conditioned,
      avgScore
    };
  }, [templates, inspections]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Official Blindaje Vial Emblem */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <BrandLogo size="lg" mode="3d_photo" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Gestor de Listas de Chequeo & Garita de Control
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  ISO 39001 • SUSESO 92064-2025
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Cree, personalice y audite listas de chequeo pre-uso homologadas para cada tipología de
                vehículo y operación de transporte. Bloqueo automático de despacho por fallas críticas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsEditorOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Plantilla</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Plantillas Activas</span>
            <span className="text-lg font-bold text-white font-mono">{stats.totalTemplates}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Inspecciones Totales</span>
            <span className="text-lg font-bold text-sky-400 font-mono">{stats.totalInsp}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Despachos Autorizados</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{stats.authorized}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Bloqueos Inmediatos</span>
            <span className="text-lg font-bold text-rose-400 font-mono">{stats.blocked}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block font-medium">Cumplimiento Medio</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">{stats.avgScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'templates'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catálogo de Plantillas ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'inspections'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Historial de Inspecciones & Auditorías ({inspections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Seguridad & Fallas Críticas</span>
        </button>
      </div>

      {/* TAB 1: TEMPLATES CATALOG */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código, nombre o norma..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Vehicle Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Vehículo:</span>
                <select
                  value={selectedVehicleFilter}
                  onChange={(e) => setSelectedVehicleFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none"
                >
                  <option value="all">Todos los Vehículos</option>
                  {Object.keys(VEHICLE_CATEGORY_LABELS).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operation Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Operación:</span>
                <select
                  value={selectedOperationFilter}
                  onChange={(e) => setSelectedOperationFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none"
                >
                  <option value="all">Todas las Operaciones</option>
                  {Object.entries(TRANSPORT_OPERATION_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const totalItems = template.sections.reduce((acc, s) => acc + s.items.length, 0);
              const criticalItems = template.sections.reduce(
                (acc, s) => acc + s.items.filter((it) => it.criticality === 'CRITICO').length,
                0
              );

              return (
                <div
                  key={template.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Code, Version & Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BrandLogo size="sm" mode="3d_photo" showText={false} />
                        <div>
                          <span className="font-mono text-xs font-bold text-sky-400 block">
                            {template.code}
                          </span>
                          <span className="text-[10px] text-slate-400">v{template.version}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {template.isCustom && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-medium">
                            Personalizada
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold">
                          Certificada
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Operational Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {template.applicableOperations.map((op) => (
                        <span
                          key={op}
                          className="text-[10px] font-medium px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                        >
                          {TRANSPORT_OPERATION_LABELS[op]?.badge || op}
                        </span>
                      ))}
                    </div>

                    {/* Vehicle Compatibility Chips */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <Truck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span className="truncate">
                        {template.applicableVehicleTypes.join(', ')}
                      </span>
                    </div>

                    {/* Counts */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-950/50 rounded-lg border border-slate-800/80 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Secciones</span>
                        <strong className="text-white">{template.sections.length}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Controles</span>
                        <strong className="text-white">{totalItems}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-400 block">Críticos</span>
                        <strong className="text-rose-400">{criticalItems}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setExecutionTemplate(template);
                        setIsExecutionOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Inspección Garita</span>
                    </button>

                    {/* Blank PDF Button */}
                    <button
                      onClick={() => handleDownloadBlankPdf(template)}
                      disabled={downloadingPdfId === template.id}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                      title="Descargar Formato Vacío Oficial en PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Clone button */}
                    <button
                      onClick={() => handleCloneTemplate(template)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                      title="Clonar y Personalizar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsEditorOpen(true);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                      title="Editar Plantilla"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button if custom */}
                    {template.isCustom && (
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-slate-700"
                        title="Eliminar Plantilla Personalizada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
              <Layers className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">
                No se encontraron plantillas con los filtros seleccionados.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Intente ajustar los términos de búsqueda o cree una nueva plantilla personalizada.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSPECTIONS HISTORY */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Registro Pericial de Inspecciones Realizadas</h3>
                <p className="text-xs text-slate-400">
                  Actas firmadas digitalmente con sellado criptográfico bajo Dictamen SUSESO 92064-2025.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                {inspections.length} Actas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Folio / Fecha</th>
                    <th className="py-3 px-4">Vehículo & Operación</th>
                    <th className="py-3 px-4">Conductor & RUT</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Fallas (C / M)</th>
                    <th className="py-3 px-4 text-center">Dictamen Despacho</th>
                    <th className="py-3 px-4 text-right">Acta Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {inspections.map((insp) => {
                    const isApproved = insp.dispatchDecision === 'AUTORIZADO';
                    const isBlocked = insp.dispatchDecision === 'BLOQUEO_INMEDIATO';

                    return (
                      <tr key={insp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-sky-400 block">{insp.folio}</span>
                          <span className="text-[11px] text-slate-400">
                            {insp.date} {insp.time} hrs
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{insp.vehiclePlate}</span>
                          <span className="text-[11px] text-slate-400 block">{insp.vehicleType}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-200 block">{insp.driverName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{insp.driverRut}</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              insp.complianceScore >= 95
                                ? 'bg-emerald-950 text-emerald-300'
                                : insp.complianceScore >= 85
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {insp.complianceScore.toFixed(1)}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="text-rose-400 font-bold">{insp.criticalDefectsCount}</span>
                          <span className="text-slate-500"> / </span>
                          <span className="text-amber-400 font-bold">{insp.majorDefectsCount}</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : isBlocked
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : isBlocked ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                            <span>{insp.dispatchDecision.replace('_', ' ')}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDownloadInspectionPdf(insp)}
                            disabled={downloadingPdfId === insp.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                            title="Descargar Acta Pericial en PDF con Logo"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF Acta</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & FREQUENT DEFECTS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Defect Pareto Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Matriz de Puntos Críticos con Mayor Frecuencia de No Conformidad</span>
            </h3>
            <p className="text-xs text-slate-400">
              Monitoreo predictivo bajo norma ISO 39001 para intervenciones en taller preventivo.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Profundidad de surco en neumáticos (< 2.0 mm)', pct: 18, count: 6, crit: 'CRITICO' },
                { name: 'Extintor PQS vencido o con manómetro descargado', pct: 12, count: 4, crit: 'CRITICO' },
                { name: 'Cintas reflectantes 3M deterioradas o faltantes (DS 22)', pct: 15, count: 5, crit: 'MAYOR' },
                { name: 'Líneas de aire neumáticas con fuga audible', pct: 9, count: 3, crit: 'CRITICO' },
                { name: 'Focos de freno o retroceso inoperativos', pct: 8, count: 3, crit: 'CRITICO' },
                { name: 'Pértiga minera o baliza estroboscópica dañada', pct: 6, count: 2, crit: 'CRITICO' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="font-mono text-slate-400 font-bold">{item.count} fallas</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        item.crit === 'CRITICO' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.pct * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance Guarantee */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Blindaje Legal & Auditoría Preventiva SUSESO</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Toda lista de chequeo completada a través de Blindaje Vial 360 genera un folio único con
                estampa de tiempo inalterable y validación bajo el Dictamen SUSESO N° 92064-2025.
              </p>

              <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>Eximente de Responsabilidad Penal:</strong> Acredita el deber de cuidado del
                    empleador (Ley 16.744 Art. 66 bis).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>Exportación Automática en PDF:</strong> Los reportes emitidos incluyen el logo
                    oficial de Blindaje Vial, aptos para presentar ante Carabineros y el MTT.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong>Cadena de Custodia Digital:</strong> Cada respuesta queda sellada con hash
                    SHA-256 para prevenir adulteraciones posteriores.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center gap-3">
              <BrandLogo size="md" mode="3d_photo" />
              <div className="text-xs">
                <span className="font-bold text-white block">Ecosistema Blindaje Vial 360</span>
                <span className="text-slate-400">Protección legal integral para transporte y minería</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <ChecklistTemplateEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveTemplate}
          initialTemplate={editingTemplate}
          currentUser={{ name: currentUserName }}
        />
      )}

      {/* Execution Modal (Checkpoint / Garita) */}
      {isExecutionOpen && executionTemplate && (
        <ChecklistExecutionModal
          isOpen={isExecutionOpen}
          onClose={() => setIsExecutionOpen(false)}
          template={executionTemplate}
          company={company}
          vehicles={vehicles}
          drivers={drivers}
          currentUserName={currentUserName}
          onInspectionCompleted={handleInspectionCompleted}
        />
      )}
    </div>
  );
};
