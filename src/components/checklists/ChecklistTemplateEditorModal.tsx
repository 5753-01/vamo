import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Shield,
  Layers,
  FileText,
  Clock,
  Car,
  Truck,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ChecklistTemplate,
  ChecklistTemplateSection,
  ChecklistTemplateItem,
  VehicleCategory,
  TransportOperationType,
  ChecklistItemCriticality,
  ChecklistFieldType
} from '../../types';
import {
  VEHICLE_CATEGORY_LABELS,
  TRANSPORT_OPERATION_LABELS
} from '../../data/checklistTemplatesData';
import { BrandLogo } from '../BrandLogo';

interface ChecklistTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ChecklistTemplate) => void;
  initialTemplate?: ChecklistTemplate | null;
  currentUser?: { name: string };
}

const ALL_VEHICLE_CATEGORIES: VehicleCategory[] = [
  'Tractocamión',
  'Semirremolque / Rampla',
  'Camión Aljibe / Cisterna',
  'Bus Interurbano / Transporte Personal',
  'Camioneta Faena Minera 4x4',
  'Furgón / Van Última Milla',
  'Maquinaria Pesada / Grúa Horquilla',
  'Camión Rígido / Pluma'
];

const ALL_OPERATIONS: TransportOperationType[] = [
  'carga_general',
  'sustancias_peligrosas',
  'mineria_alta_montana',
  'pasajeros_interurbano',
  'distribucion_urbana',
  'forestal_ripio',
  'faena_portuaria',
  'cadena_frio'
];

export const ChecklistTemplateEditorModal: React.FC<ChecklistTemplateEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate,
  currentUser
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialTemplate;

  const [name, setName] = useState(initialTemplate?.name || '');
  const [code, setCode] = useState(initialTemplate?.code || 'CHK-CUSTOM-01');
  const [version, setVersion] = useState(initialTemplate?.version || '1.0');
  const [description, setDescription] = useState(
    initialTemplate?.description ||
      'Lista de chequeo operacional personalizada para cumplimiento de seguridad vial bajo Ley 18.290 y SUSESO.'
  );
  const [frequency, setFrequency] = useState<ChecklistTemplate['frequency']>(
    initialTemplate?.frequency || 'antes_despacho'
  );
  const [blockingPolicy, setBlockingPolicy] = useState<ChecklistTemplate['blockingPolicy']>(
    initialTemplate?.blockingPolicy || 'bloqueo_inmediato_criticos'
  );
  const [maxAllowedMajorDefects, setMaxAllowedMajorDefects] = useState<number>(
    initialTemplate?.maxAllowedMajorDefects ?? 1
  );

  const [selectedVehicles, setSelectedVehicles] = useState<VehicleCategory[]>(
    initialTemplate?.applicableVehicleTypes || ['Tractocamión', 'Semirremolque / Rampla']
  );
  const [selectedOperations, setSelectedOperations] = useState<TransportOperationType[]>(
    initialTemplate?.applicableOperations || ['carga_general']
  );

  const [sections, setSections] = useState<ChecklistTemplateSection[]>(
    initialTemplate?.sections || [
      {
        id: 'sec-1',
        title: '1. Documentación & Licencias Obligatorias',
        description: 'Requisitos de habilitación legal del vehículo y operador.',
        items: [
          {
            id: 'it-1',
            code: 'DOC-01',
            label: 'Licencia de Conducir profesional vigente adecuada a la unidad',
            description: 'Verificada en garita sin suspensiones.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 12',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-2',
            code: 'DOC-02',
            label: 'Revisión Técnica y Certificado de Emisiones al día',
            description: 'Documentos originales o digitales QR validados.',
            criticality: 'CRITICO',
            fieldType: 'fecha',
            normativeReference: 'Ley 18.290 Art. 89',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-2',
        title: '2. Sistemas Críticos de Seguridad Vial',
        description: 'Frenos, neumáticos y dirección según estándares de control.',
        items: [
          {
            id: 'it-3',
            code: 'SEG-01',
            label: 'Profundidad de surco en neumáticos (Mínimo legal 2.0 mm)',
            description: 'Medido con profundímetro en el surco de mayor desgaste.',
            criticality: 'CRITICO',
            fieldType: 'numerico',
            numericUnit: 'mm',
            minAcceptableValue: 2.0,
            maxAcceptableValue: 25.0,
            normativeReference: 'DS 54 / DS 212',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-4',
            code: 'SEG-02',
            label: 'Extintor de incendio PQS presurizado en verde y con mantención al día',
            description: 'Capacidad mínima reglamentaria según tonelaje de la unidad.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 594 Art. 45',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      }
    ]
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-2': true
  });

  const toggleSectionExpand = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const toggleVehicleCategory = (cat: VehicleCategory) => {
    if (selectedVehicles.includes(cat)) {
      if (selectedVehicles.length === 1) return; // al menos 1
      setSelectedVehicles(selectedVehicles.filter((v) => v !== cat));
    } else {
      setSelectedVehicles([...selectedVehicles, cat]);
    }
  };

  const toggleOperation = (op: TransportOperationType) => {
    if (selectedOperations.includes(op)) {
      if (selectedOperations.length === 1) return;
      setSelectedOperations(selectedOperations.filter((o) => o !== op));
    } else {
      setSelectedOperations([...selectedOperations, op]);
    }
  };

  // Section handling
  const handleAddSection = () => {
    const newId = `sec-${Date.now()}`;
    const nextNumber = sections.length + 1;
    const newSec: ChecklistTemplateSection = {
      id: newId,
      title: `${nextNumber}. Nueva Sección de Control Operativo`,
      description: 'Defina los puntos de verificación requeridos.',
      items: [
        {
          id: `it-${Date.now()}`,
          code: `ITM-01`,
          label: 'Punto de verificación de seguridad',
          criticality: 'CRITICO',
          fieldType: 'conforme_no_conforme',
          requiresPhotoOnDefect: false,
          requiresCommentOnDefect: true
        }
      ]
    };
    setSections([...sections, newSec]);
    setExpandedSections((prev) => ({ ...prev, [newId]: true }));
  };

  const handleDeleteSection = (secId: string) => {
    if (sections.length === 1) {
      alert('La plantilla debe contener al menos una sección de verificación.');
      return;
    }
    setSections(sections.filter((s) => s.id !== secId));
  };

  const handleUpdateSectionTitle = (secId: string, title: string) => {
    setSections(sections.map((s) => (s.id === secId ? { ...s, title } : s)));
  };

  const handleUpdateSectionDesc = (secId: string, description: string) => {
    setSections(sections.map((s) => (s.id === secId ? { ...s, description } : s)));
  };

  // Item handling
  const handleAddItem = (secId: string) => {
    setSections(
      sections.map((s) => {
        if (s.id !== secId) return s;
        const newItem: ChecklistTemplateItem = {
          id: `it-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          code: `ITM-${s.items.length + 1}`,
          label: 'Nuevo punto de chequeo normativo',
          criticality: 'CRITICO',
          fieldType: 'conforme_no_conforme',
          requiresPhotoOnDefect: false,
          requiresCommentOnDefect: true
        };
        return {
          ...s,
          items: [...s.items, newItem]
        };
      })
    );
  };

  const handleDeleteItem = (secId: string, itemId: string) => {
    setSections(
      sections.map((s) => {
        if (s.id !== secId) return s;
        if (s.items.length === 1) {
          alert('Cada sección debe tener al menos un ítem.');
          return s;
        }
        return {
          ...s,
          items: s.items.filter((it) => it.id !== itemId)
        };
      })
    );
  };

  const handleUpdateItem = (
    secId: string,
    itemId: string,
    updates: Partial<ChecklistTemplateItem>
  ) => {
    setSections(
      sections.map((s) => {
        if (s.id !== secId) return s;
        return {
          ...s,
          items: s.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it))
        };
      })
    );
  };

  // Stats calculation
  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const criticalItems = sections.reduce(
    (acc, s) => acc + s.items.filter((it) => it.criticality === 'CRITICO').length,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingrese el nombre de la plantilla.');
      return;
    }
    if (!code.trim()) {
      alert('Por favor ingrese un código normativo para la plantilla.');
      return;
    }
    if (sections.length === 0 || totalItems === 0) {
      alert('La plantilla debe tener al menos una sección con ítems de verificación.');
      return;
    }

    const template: ChecklistTemplate = {
      id: initialTemplate?.id || `tmpl-custom-${Date.now()}`,
      code: code.trim().toUpperCase(),
      version: version.trim() || '1.0',
      name: name.trim(),
      description: description.trim(),
      applicableVehicleTypes: selectedVehicles,
      applicableOperations: selectedOperations,
      frequency,
      blockingPolicy,
      maxAllowedMajorDefects,
      isOfficialCertified: true,
      sections,
      createdAt: initialTemplate?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: initialTemplate?.createdBy || currentUser?.name || 'Oficial de Cumplimiento Vial',
      isCustom: true
    };

    onSave(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header with Official Blindaje Vial Emblem */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" mode="3d_photo" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {isEditing ? 'Editar Plantilla de Checklist' : 'Diseñador de Plantillas de Seguridad'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Ley 18.290 • SUSESO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalice los estándares técnicos para diferentes vehículos y operaciones de transporte.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Card */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
              <FileText className="w-4 h-4" />
              <span>1. Identificación y Alcance de la Lista de Chequeo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre de la Plantilla <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Checklist Pre-Uso de Alta Montaña Faena Minera"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Código de Documento <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: CHK-MIN-01"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Versión</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Frecuencia de Aplicación
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="antes_despacho">Antes de Cada Despacho (Obligatorio)</option>
                  <option value="pre_uso_diario">Pre-Uso Diario (Inicio de Turno)</option>
                  <option value="semanal">Semanal Preventivo</option>
                  <option value="mensual">Mensual de Mantenimiento</option>
                  <option value="retorno_faena">Retorno de Faena / Descarga</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Política de Despacho
                </label>
                <select
                  value={blockingPolicy}
                  onChange={(e) => setBlockingPolicy(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-medium"
                >
                  <option value="bloqueo_inmediato_criticos">
                    Bloqueo Inmediato por Cualquier Ítem Crítico
                  </option>
                  <option value="tolerancia_condicionada">
                    Tolerancia Condicionada (Máx 24 hrs)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Descripción y Objetivo Normativo
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Indique el alcance operacional y marco regulatorio chileno aplicable..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Vehicle Types Applicability */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                <Truck className="w-4 h-4" />
                <span>2. Tipos de Vehículos Compatibles</span>
              </div>
              <span className="text-xs text-slate-400">
                Seleccionados: {selectedVehicles.length} de {ALL_VEHICLE_CATEGORIES.length}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Haga clic para asociar esta lista de chequeo a las diferentes categorías de flota:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_VEHICLE_CATEGORIES.map((cat) => {
                const isSelected = selectedVehicles.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleVehicleCategory(cat)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200 font-medium shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport Operations Applicability */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                <Layers className="w-4 h-4" />
                <span>3. Operaciones de Transporte Aplicables</span>
              </div>
              <span className="text-xs text-slate-400">
                Seleccionadas: {selectedOperations.length} de {ALL_OPERATIONS.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_OPERATIONS.map((op) => {
                const meta = TRANSPORT_OPERATION_LABELS[op];
                const isSelected = selectedOperations.includes(op);
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => toggleOperation(op)}
                    className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-sky-100 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold">{meta.badge}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isSelected
                            ? 'bg-sky-500 border-sky-300 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <span className="text-[11px] leading-tight text-slate-300 line-clamp-1">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section & Items Designer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>4. Secciones & Puntos de Chequeo Normativos</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Total Secciones: {sections.length} | Ítems: {totalItems} ({criticalItems} Críticos con
                  bloqueo de despacho)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Sección</span>
              </button>
            </div>

            {sections.map((section, sIdx) => {
              const isExpanded = !!expandedSections[section.id];
              return (
                <div
                  key={section.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all"
                >
                  {/* Section Title Bar */}
                  <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand(section.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-sky-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="text-xs font-mono text-slate-500">#{sIdx + 1}</span>
                    </button>

                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                      className="flex-1 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-sky-500 focus:bg-slate-900 px-2 py-1 text-sm font-bold text-white focus:outline-none rounded transition-colors"
                      placeholder="Título de la Sección"
                    />

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {section.items.length} ítems
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title="Eliminar Sección"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Body */}
                  {isExpanded && (
                    <div className="p-4 space-y-4">
                      <div>
                        <input
                          type="text"
                          value={section.description || ''}
                          onChange={(e) => handleUpdateSectionDesc(section.id, e.target.value)}
                          placeholder="Descripción u objetivo de esta sección (opcional)..."
                          className="w-full bg-slate-950/60 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
                        />
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        {section.items.map((item, iIdx) => (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-lg border text-xs space-y-2.5 transition-colors ${
                              item.criticality === 'CRITICO'
                                ? 'bg-slate-950/70 border-rose-900/40 hover:border-rose-700/60'
                                : item.criticality === 'MAYOR'
                                ? 'bg-slate-950/70 border-amber-900/40 hover:border-amber-700/60'
                                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="font-mono text-slate-400 font-semibold w-16">
                                  {item.code || `ITM-${iIdx + 1}`}
                                </span>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, { label: e.target.value })
                                  }
                                  placeholder="Enunciado del punto de inspección..."
                                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
                                  required
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Criticality selector */}
                                <select
                                  value={item.criticality}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      criticality: e.target.value as ChecklistItemCriticality
                                    })
                                  }
                                  className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none ${
                                    item.criticality === 'CRITICO'
                                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                                      : item.criticality === 'MAYOR'
                                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                                      : 'bg-slate-900 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  <option value="CRITICO">CRÍTICO (Bloquea)</option>
                                  <option value="MAYOR">MAYOR (24 hrs)</option>
                                  <option value="MENOR">MENOR (Obs.)</option>
                                </select>

                                {/* Field Type selector */}
                                <select
                                  value={item.fieldType}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      fieldType: e.target.value as ChecklistFieldType
                                    })
                                  }
                                  className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-1 rounded text-[11px] focus:outline-none"
                                >
                                  <option value="conforme_no_conforme">C / NC / N/A</option>
                                  <option value="numerico">Valor Numérico</option>
                                  <option value="fecha">Fecha Vigencia</option>
                                  <option value="texto">Texto Libre</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(section.id, item.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                  title="Eliminar ítem"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Secondary Row: Normative Ref & Description */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <input
                                type="text"
                                value={item.normativeReference || ''}
                                onChange={(e) =>
                                  handleUpdateItem(section.id, item.id, {
                                    normativeReference: e.target.value
                                  })
                                }
                                placeholder="Ref. Normativa (ej: Ley 18.290 Art. 75, DS 298)..."
                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-slate-600"
                              />

                              <input
                                type="text"
                                value={item.description || ''}
                                onChange={(e) =>
                                  handleUpdateItem(section.id, item.id, {
                                    description: e.target.value
                                  })
                                }
                                placeholder="Criterio de aceptación o tolerancia..."
                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-slate-600"
                              />
                            </div>

                            {/* Numeric Config if fieldType === 'numerico' */}
                            {item.fieldType === 'numerico' && (
                              <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px]">
                                <span className="text-slate-400">Unidad de Medida:</span>
                                <input
                                  type="text"
                                  value={item.numericUnit || 'mm'}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      numericUnit: e.target.value
                                    })
                                  }
                                  placeholder="mm, psi, kg..."
                                  className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                                />

                                <span className="text-slate-400">Mínimo Aceptable:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={item.minAcceptableValue ?? ''}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      minAcceptableValue: parseFloat(e.target.value) || 0
                                    })
                                  }
                                  placeholder="ej: 2.0"
                                  className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                                />

                                <span className="text-slate-400">Máximo Aceptable:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={item.maxAcceptableValue ?? ''}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      maxAcceptableValue: parseFloat(e.target.value) || 0
                                    })
                                  }
                                  placeholder="ej: 120"
                                  className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white"
                                />
                              </div>
                            )}

                            {/* Switches */}
                            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.requiresPhotoOnDefect}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      requiresPhotoOnDefect: e.target.checked
                                    })
                                  }
                                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                                />
                                <span>Requiere foto si resulta No Conforme</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.requiresCommentOnDefect}
                                  onChange={(e) =>
                                    handleUpdateItem(section.id, item.id, {
                                      requiresCommentOnDefect: e.target.checked
                                    })
                                  }
                                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                                />
                                <span>Comentario obligatorio en defecto</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Item Button */}
                      <button
                        type="button"
                        onClick={() => handleAddItem(section.id)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-lg text-xs text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1.5 font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Ítem a esta Sección</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Homologado para fiscalización de Carabineros, MTT y Dirección del Trabajo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear y Habilitar Plantilla'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
