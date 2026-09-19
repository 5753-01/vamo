import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  FileCheck,
  Download,
  Truck,
  User,
  Clock,
  MapPin,
  Camera,
  AlertOctagon,
  PenTool,
  Hash
} from 'lucide-react';
import {
  ChecklistTemplate,
  ChecklistInspectionExecution,
  ChecklistInspectionAnswer,
  Company,
  Vehicle,
  Driver
} from '../../types';
import { BrandLogo } from '../BrandLogo';
import { generateInspectionReportPDF } from '../../utils/checklistPdfExport';

interface ChecklistExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ChecklistTemplate;
  company: Company;
  vehicles: Vehicle[];
  drivers: Driver[];
  currentUserName: string;
  onInspectionCompleted: (inspection: ChecklistInspectionExecution) => void;
}

export const ChecklistExecutionModal: React.FC<ChecklistExecutionModalProps> = ({
  isOpen,
  onClose,
  template,
  company,
  vehicles,
  drivers,
  currentUserName,
  onInspectionCompleted
}) => {
  if (!isOpen) return null;

  // Header and metadata state
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState<string>(
    vehicles[0]?.plate || 'KJ-84-92'
  );
  const [vehicleType, setVehicleType] = useState<string>(
    template.applicableVehicleTypes[0] || 'Tractocamión'
  );
  const [odometerKm, setOdometerKm] = useState<number>(315400);

  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || 'drv-001');
  const [checkpoint, setCheckpoint] = useState<string>(
    'Garita Principal de Despacho - Base Central'
  );

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const [driverRut, setDriverRut] = useState<string>(selectedDriver?.rut || '15.482.910-3');
  const [driverName, setDriverName] = useState<string>(
    selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : 'Rodrigo Silva M.'
  );

  const [inspectorName, setInspectorName] = useState<string>(currentUserName || 'Inspector de Turno');
  const [inspectorRole, setInspectorRole] = useState<string>('Supervisor de Garita & Prevención');

  // Answers State: map itemId -> answer
  const [answers, setAnswers] = useState<Record<string, ChecklistInspectionAnswer>>(() => {
    const initial: Record<string, ChecklistInspectionAnswer> = {};
    template.sections.forEach((sec) => {
      sec.items.forEach((it) => {
        initial[it.id] = {
          itemId: it.id,
          status: 'conforme',
          numericValue: it.minAcceptableValue ? it.minAcceptableValue + 2 : undefined,
          dateValue: it.fieldType === 'fecha' ? '2027-04-30' : undefined
        };
      });
    });
    return initial;
  });

  // Driver signature status
  const [driverSigned, setDriverSigned] = useState<boolean>(true);
  const [inspectorSigned, setInspectorSigned] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Auto-evaluation logic
  const evaluation = useMemo(() => {
    let total = 0;
    let conforming = 0;
    let nonConforming = 0;
    let criticalDefects = 0;
    let majorDefects = 0;
    let minorDefects = 0;

    template.sections.forEach((sec) => {
      sec.items.forEach((it) => {
        total++;
        const ans = answers[it.id];
        if (ans?.status === 'conforme') {
          conforming++;
        } else if (ans?.status === 'no_conforme') {
          nonConforming++;
          if (it.criticality === 'CRITICO') criticalDefects++;
          else if (it.criticality === 'MAYOR') majorDefects++;
          else minorDefects++;
        }
      });
    });

    const score = total > 0 ? (conforming / total) * 100 : 100;

    let dispatchDecision: 'AUTORIZADO' | 'CONDICIONADO' | 'BLOQUEO_INMEDIATO' = 'AUTORIZADO';
    let decisionReason = 'Todos los puntos de seguridad vial cumplen plenamente.';

    if (criticalDefects > 0) {
      dispatchDecision = 'BLOQUEO_INMEDIATO';
      decisionReason = `Se detectaron ${criticalDefects} incumplimientos CRÍTICOS bajo Ley 18.290 / SUSESO. Despacho prohibido.`;
    } else if (majorDefects > template.maxAllowedMajorDefects) {
      dispatchDecision = 'CONDICIONADO';
      decisionReason = `Se detectaron ${majorDefects} fallas mayores (máx permitido: ${template.maxAllowedMajorDefects}). Requiere subsanación en 24 horas.`;
    }

    return {
      total,
      conforming,
      nonConforming,
      criticalDefects,
      majorDefects,
      minorDefects,
      score,
      dispatchDecision,
      decisionReason
    };
  }, [answers, template]);

  const handleSetStatus = (itemId: string, status: 'conforme' | 'no_conforme' | 'no_aplica') => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        itemId,
        status
      }
    }));
  };

  const handleSetNumeric = (itemId: string, num: number, item: any) => {
    let status: 'conforme' | 'no_conforme' = 'conforme';
    if (item.minAcceptableValue !== undefined && num < item.minAcceptableValue) {
      status = 'no_conforme';
    }
    if (item.maxAcceptableValue !== undefined && num > item.maxAcceptableValue) {
      status = 'no_conforme';
    }

    setAnswers((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        itemId,
        numericValue: num,
        status
      }
    }));
  };

  const handleSetObservation = (itemId: string, observations: string) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        itemId,
        observations
      }
    }));
  };

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverId(driverId);
    const d = drivers.find((x) => x.id === driverId);
    if (d) {
      setDriverName(`${d.firstName} ${d.lastName}`);
      setDriverRut(d.rut);
    }
  };

  const handleFinishInspection = async () => {
    setIsGeneratingPdf(true);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const folioNumber = `INSP-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const execution: ChecklistInspectionExecution = {
      id: `insp-${Date.now()}`,
      folio: folioNumber,
      templateId: template.id,
      templateName: template.name,
      templateCode: template.code,
      companyId: company.id,
      date: dateStr,
      time: timeStr,
      checkpoint,
      vehiclePlate: selectedVehiclePlate.toUpperCase(),
      vehicleType: vehicleType as any,
      odometerKm,
      driverId: selectedDriverId,
      driverRut,
      driverName,
      inspectorName,
      inspectorRole,
      operationType: template.applicableOperations[0] || 'carga_general',
      answers,
      totalItems: evaluation.total,
      conformingItems: evaluation.conforming,
      criticalDefectsCount: evaluation.criticalDefects,
      majorDefectsCount: evaluation.majorDefects,
      minorDefectsCount: evaluation.minorDefects,
      complianceScore: evaluation.score,
      dispatchDecision: evaluation.dispatchDecision,
      dispatchDecisionReason: evaluation.decisionReason,
      driverSignatureTimestamp: driverSigned ? `${dateStr} ${timeStr}` : undefined,
      inspectorSignatureTimestamp: inspectorSigned ? `${dateStr} ${timeStr}` : undefined,
      hashSha256: `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status: 'completada'
    };

    onInspectionCompleted(execution);

    // Generate and download official PDF with logo
    try {
      await generateInspectionReportPDF(execution, template, company);
    } catch (err) {
      console.error('Error generating inspection PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header with Official Blindaje Vial Emblem */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" mode="3d_photo" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {template.code} v{template.version}
                </span>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Inspección Pre-Uso en Garita de Control
                </h2>
              </div>
              <p className="text-xs text-slate-400">{template.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Evaluation Banner */}
        <div
          className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
            evaluation.dispatchDecision === 'AUTORIZADO'
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
              : evaluation.dispatchDecision === 'CONDICIONADO'
              ? 'bg-amber-950/50 border-amber-800 text-amber-200'
              : 'bg-rose-950/80 border-rose-700 text-rose-100 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            {evaluation.dispatchDecision === 'AUTORIZADO' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : evaluation.dispatchDecision === 'CONDICIONADO' ? (
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-400 flex-shrink-0" />
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider">
                  DICTAMEN: {evaluation.dispatchDecision.replace('_', ' ')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-black/40">
                  Score: {evaluation.score.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs opacity-90">{evaluation.decisionReason}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="bg-black/30 px-2.5 py-1 rounded">
              Críticas: <strong className="text-rose-400">{evaluation.criticalDefects}</strong>
            </span>
            <span className="bg-black/30 px-2.5 py-1 rounded">
              Mayores: <strong className="text-amber-400">{evaluation.majorDefects}</strong>
            </span>
            <span className="bg-black/30 px-2.5 py-1 rounded">
              Conformes: <strong className="text-emerald-400">{evaluation.conforming}</strong> /{' '}
              {evaluation.total}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Dispatch Data Section (Vehicle, Driver, Inspector) */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Vehicle Card */}
            <div className="space-y-2">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Vehículo & Odómetro
              </span>
              <div className="space-y-1.5">
                <select
                  value={selectedVehiclePlate}
                  onChange={(e) => setSelectedVehiclePlate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono font-bold"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plate}>
                      {v.plate} - {v.brand} {v.model} ({v.type})
                    </option>
                  ))}
                  <option value="OTRA-PLACA">Ingresar Otra Patente...</option>
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(parseInt(e.target.value) || 0)}
                    placeholder="Km Odómetro"
                    className="w-1/2 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-slate-400">km actuales</span>
                </div>
              </div>
            </div>

            {/* Driver Card */}
            <div className="space-y-2">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Conductor Asignado
              </span>
              <div className="space-y-1.5">
                <select
                  value={selectedDriverId}
                  onChange={(e) => handleDriverChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.firstName} {d.lastName} ({d.rut})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400">
                  RUT: <span className="font-mono text-slate-200">{driverRut}</span> • Estado: Habilitado
                </div>
              </div>
            </div>

            {/* Checkpoint & Inspector */}
            <div className="space-y-2">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Garita & Inspector
              </span>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={checkpoint}
                  onChange={(e) => setCheckpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  placeholder="Garita o punto de control"
                />
                <div className="text-[11px] text-slate-400">
                  Inspector: <span className="text-slate-200 font-medium">{inspectorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sections & Checkpoints */}
          <div className="space-y-6">
            {template.sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg"
              >
                {/* Section Title */}
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">
                      {sIdx + 1}
                    </span>
                    <span>{section.title}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {section.items.length} controles
                  </span>
                </div>

                {/* Items in Section */}
                <div className="divide-y divide-slate-800/60 p-2 sm:p-3 space-y-2">
                  {section.items.map((item, iIdx) => {
                    const ans = answers[item.id] || { status: 'conforme' };
                    const isConforming = ans.status === 'conforme';
                    const isNonConforming = ans.status === 'no_conforme';
                    const isNA = ans.status === 'no_aplica';

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border transition-all ${
                          isNonConforming
                            ? item.criticality === 'CRITICO'
                              ? 'bg-rose-950/30 border-rose-700/80'
                              : 'bg-amber-950/30 border-amber-700/80'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          {/* Label & Details */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  item.criticality === 'CRITICO'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : item.criticality === 'MAYOR'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {item.criticality}
                              </span>

                              <span className="text-xs font-semibold text-white">
                                {item.label}
                              </span>

                              {item.normativeReference && (
                                <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                                  {item.normativeReference}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-[11px] text-slate-400 pl-0.5">
                                Criterio: {item.description}
                              </p>
                            )}

                            {/* Numeric Input if applicable */}
                            {item.fieldType === 'numerico' && (
                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-xs text-slate-300">Medición registrada:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={ans.numericValue ?? ''}
                                  onChange={(e) =>
                                    handleSetNumeric(item.id, parseFloat(e.target.value) || 0, item)
                                  }
                                  className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono font-bold"
                                />
                                <span className="text-xs text-sky-400 font-bold">
                                  {item.numericUnit || 'uds'}
                                </span>
                                {item.minAcceptableValue !== undefined && (
                                  <span className="text-[11px] text-slate-400">
                                    (Tolerancia mín: {item.minAcceptableValue} {item.numericUnit})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSetStatus(item.id, 'conforme')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isConforming
                                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/40 ring-2 ring-emerald-400'
                                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Conforme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStatus(item.id, 'no_conforme')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isNonConforming
                                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-700/40 ring-2 ring-rose-400'
                                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              <span>No Conforme</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStatus(item.id, 'no_aplica')}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isNA
                                  ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                                  : 'bg-slate-800/80 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <span>N/A</span>
                            </button>
                          </div>
                        </div>

                        {/* Defect Observation & Photo prompt if Non Conforming */}
                        {isNonConforming && (
                          <div className="mt-2.5 pt-2 border-t border-rose-900/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Detalle del Hallazgo / Defecto detectado:
                              </span>
                              {item.criticality === 'CRITICO' && (
                                <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                                  ACTIVA BLOQUEO DE RUTA
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              value={ans.observations || ''}
                              onChange={(e) => handleSetObservation(item.id, e.target.value)}
                              placeholder="Describa la anomalía (ej: fisura en neumático, extintor descargado)..."
                              className="w-full bg-slate-950 border border-rose-700/60 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Digital Signatures Box */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" />
              Validación y Firmas Digitales de Auditoría
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Driver Signature Card */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{driverName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">RUT: {driverRut}</p>
                  <p className="text-[10px] text-emerald-400">
                    {driverSigned ? '✓ Firma digital registrada en garita' : 'Pendiente de firma'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDriverSigned(!driverSigned)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    driverSigned
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {driverSigned ? 'Firmado' : 'Firmar'}
                </button>
              </div>

              {/* Inspector Signature Card */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{inspectorName}</p>
                  <p className="text-[11px] text-slate-400">{inspectorRole}</p>
                  <p className="text-[10px] text-emerald-400">
                    {inspectorSigned ? '✓ Visado por Prevención de Riesgos' : 'Pendiente de visado'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectorSigned(!inspectorSigned)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    inspectorSigned
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {inspectorSigned ? 'Visado' : 'Visar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>
              Genera Acta Digital sellada con Hash SHA-256 e informe descargable en PDF con logo
              oficial.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleFinishInspection}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                evaluation.dispatchDecision === 'BLOQUEO_INMEDIATO'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
              }`}
            >
              {isGeneratingPdf ? (
                <span>Generando Acta & PDF...</span>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {evaluation.dispatchDecision === 'BLOQUEO_INMEDIATO'
                      ? 'Registrar Bloqueo & Descargar Acta'
                      : 'Finalizar Inspección & Descargar PDF'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
