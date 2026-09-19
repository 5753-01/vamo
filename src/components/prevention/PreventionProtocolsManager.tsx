import React, { useState } from 'react';
import {
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Play,
  RotateCcw,
  FileText,
  Plus,
  Bell,
  Mail,
  Volume2,
  Lock,
  Unlock,
  Building,
  UserCheck,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PreventionProtocolConfig,
  PreventionProtocolResultType,
  PreventionRiskLevel,
  InterventionActionCategory,
  AutomaticInterventionAction
} from '../../types';
import { ProtocolSimulatorModal } from './ProtocolSimulatorModal';
import { NewCustomActionModal } from './NewCustomActionModal';
import { ProtocolExportModal } from './ProtocolExportModal';

interface PreventionProtocolsManagerProps {
  onNavigateToNotifications?: () => void;
  onNavigateToTests?: () => void;
}

export const PreventionProtocolsManager: React.FC<PreventionProtocolsManagerProps> = ({
  onNavigateToNotifications,
  onNavigateToTests
}) => {
  const {
    preventionProtocols,
    updatePreventionProtocol,
    toggleProtocolAction,
    addCustomActionToProtocol,
    resetPreventionProtocolsToDefaults,
    currentCompany,
    showToast
  } = useApp();

  // Selected protocol in tab navigation
  const [selectedResultType, setSelectedResultType] =
    useState<PreventionProtocolResultType>('positivo_alcohol_infraccion');

  // Category filter for intervention actions
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showMatrixView, setShowMatrixView] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Active protocol
  const activeProtocol =
    preventionProtocols.find((p) => p.resultType === selectedResultType) ||
    preventionProtocols[0];

  // Helper for risk badge colors
  const getRiskColor = (risk: PreventionRiskLevel) => {
    switch (risk) {
      case 'bajo':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'moderado':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'alto':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          badge: 'bg-orange-600 text-white',
          border: 'border-orange-500/30',
          dot: 'bg-orange-400'
        };
      case 'critico':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          badge: 'bg-rose-600 text-white',
          border: 'border-rose-500/30',
          dot: 'bg-rose-400'
        };
    }
  };

  const getCategoryBadge = (cat: InterventionActionCategory) => {
    switch (cat) {
      case 'operacional':
        return { label: 'Operacional', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'comunicacion_alertas':
        return { label: 'Comunicación / Alertas', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'legal_laboral':
        return { label: 'Legal / Laboral RIOHS', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'medica_toxicologica':
        return { label: 'Médica / Toxicológica', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  // Filter actions for current protocol
  const filteredActions = activeProtocol.actions.filter((a) => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  const activeActionsCount = activeProtocol.actions.filter((a) => a.enabled).length;

  return (
    <div id="prevention-protocols-manager-view" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 mt-1">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Gestión de Protocolos de Prevención e Intervención
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 border border-blue-500/40 text-blue-300">
                LEY 18.290 • TOLERANCIA CERO • SUSESO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Configura los niveles de riesgo, umbrales reglamentarios y acciones automáticas
              de respuesta inmediata (bloqueo de despacho, corte Alcolock, alertas push y cadena de custodia)
              ante cada tipo de resultado en garita para <strong className="text-slate-200">{currentCompany.businessName}</strong>.
            </p>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            id="btn-open-matrix-view"
            onClick={() => setShowMatrixView(!showMatrixView)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition ${
              showMatrixView
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showMatrixView ? 'Ocultar Matriz Resumen' : 'Ver Matriz Comparativa'}</span>
          </button>

          <button
            id="btn-open-export-modal"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Ficha Oficial DT/SUSESO</span>
          </button>

          <button
            id="btn-open-simulator-modal"
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simular Intervención</span>
          </button>

          <button
            id="btn-reset-protocols"
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 hover:border-rose-800/60 transition"
            title="Restablecer a valores legales estándar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">
                ¿Restablecer Protocolos a Valores Estándar?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esta acción restablecerá los 7 protocolos, sus niveles de riesgo, umbrales y acciones automáticas
              a la configuración recomendada por la Ley 18.290 de Tránsito y la Circular 3331 de la SUSESO.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetPreventionProtocolsToDefaults();
                  setIsResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Sí, Restablecer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Matrix Overview (Toggleable) */}
      {showMatrixView && (
        <div
          id="comparative-matrix-overview"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Matriz Comparativa Global de Protocolos de Intervención (7 Resultados)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Resumen de gobernanza operacional y respuesta inmediata en garitas y ruta.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              7 Protocolos Activos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Resultado de Prueba</th>
                  <th className="py-2.5 px-3">Nivel Riesgo</th>
                  <th className="py-2.5 px-3">Despacho</th>
                  <th className="py-2.5 px-3">Alcolock</th>
                  <th className="py-2.5 px-3">Acciones Activas</th>
                  <th className="py-2.5 px-3">Alerta Push</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {preventionProtocols.map((proto) => {
                  const colors = getRiskColor(proto.riskLevel);
                  const isCurrent = proto.resultType === selectedResultType;
                  return (
                    <tr
                      key={proto.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isCurrent ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{proto.title}</div>
                        <div className="text-[11px] text-slate-400">{proto.thresholdCondition}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${colors.bg} ${colors.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {proto.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                            proto.dispatchAllowed ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {proto.dispatchAllowed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          {proto.dispatchAllowed ? 'Habilitado' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[11px] font-mono text-slate-300">
                        {proto.alcolockStateRequired}
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        <strong className="text-white">
                          {proto.actions.filter((a) => a.enabled).length}
                        </strong>{' '}
                        / {proto.actions.length}
                      </td>
                      <td className="py-3 px-3">
                        {proto.notificationSettings.sendRealtimePush ? (
                          <span className="text-blue-400 font-bold flex items-center gap-1 text-[11px]">
                            <Bell className="w-3 h-3" /> Push ON
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">OFF</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedResultType(proto.resultType);
                            setShowMatrixView(false);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded text-[11px] font-medium transition"
                        >
                          Configurar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocol Tabs Selector (Horizontal scrollable pills) */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Seleccionar Tipo de Resultado de Prueba para Configurar Protocolo:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {preventionProtocols.map((proto) => {
            const isSelected = proto.resultType === selectedResultType;
            const colors = getRiskColor(proto.riskLevel);
            return (
              <button
                key={proto.id}
                id={`tab-protocol-${proto.resultType}`}
                onClick={() => setSelectedResultType(proto.resultType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-white' : colors.dot
                  }`}
                />
                <span className="truncate max-w-[170px]">{proto.badgeLabel}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {proto.actions.filter((a) => a.enabled).length} act
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Protocol Card */}
      <div
        id="active-protocol-detail-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-6"
      >
        {/* Protocol Hero Banner */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-white">
                  {activeProtocol.title}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    getRiskColor(activeProtocol.riskLevel).bg
                  } ${getRiskColor(activeProtocol.riskLevel).border} ${
                    getRiskColor(activeProtocol.riskLevel).dot
                  }`}
                >
                  Riesgo {activeProtocol.riskLevel}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                    activeProtocol.dispatchAllowed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {activeProtocol.dispatchAllowed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {activeProtocol.dispatchAllowed ? 'Despacho Permitido' : 'Despacho Bloqueado'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{activeProtocol.subtitle}</p>
            </div>

            {/* Quick Actions for this protocol */}
            <div className="flex items-center gap-2">
              <button
                id="btn-simulate-active-protocol"
                onClick={() => setIsSimulatorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simular Este Protocolo</span>
              </button>
              <button
                id="btn-open-add-action"
                onClick={() => setIsAddActionOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
                <span>Agregar Acción</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {activeProtocol.description}
          </p>
        </div>

        {/* Protocol Settings Grid (Risk, Thresholds, Alcolock, Legal) */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Risk Level Selector */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Nivel de Riesgo Asignado *
            </label>
            <select
              id="select-protocol-risk-level"
              value={activeProtocol.riskLevel}
              onChange={(e) =>
                updatePreventionProtocol(activeProtocol.id, {
                  riskLevel: e.target.value as PreventionRiskLevel
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-semibold focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="bajo">Bajo (Conforme / Despacho)</option>
              <option value="moderado">Moderado (Retest / Atención)</option>
              <option value="alto">Alto (Bloqueo Preventivo / Infracción)</option>
              <option value="critico">Crítico (Peligro Extremo / Delito)</option>
            </select>
            <span className="text-[10px] text-slate-400 block">
              Determina la severidad de las alertas push y el escalamiento a gerencias.
            </span>
          </div>

          {/* Dispatch Permission Toggle */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Autorización de Despacho *
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                id="toggle-dispatch-allowed"
                onClick={() =>
                  updatePreventionProtocol(activeProtocol.id, {
                    dispatchAllowed: !activeProtocol.dispatchAllowed
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  activeProtocol.dispatchAllowed ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    activeProtocol.dispatchAllowed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-white">
                {activeProtocol.dispatchAllowed ? 'Habilitado (Salida OK)' : 'Bloqueado (Vehículo Retenido)'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Si está desactivado, el sistema bloquea la emisión de la hoja de ruta en garita.
            </span>
          </div>

          {/* Alcolock State Required */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Estado Requerido de Alcolock
            </label>
            <select
              id="select-protocol-alcolock"
              value={activeProtocol.alcolockStateRequired}
              onChange={(e) =>
                updatePreventionProtocol(activeProtocol.id, {
                  alcolockStateRequired: e.target.value as any
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-semibold focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="habilitado">Habilitado (Permitir Encendido)</option>
              <option value="bloqueo_temporal">Bloqueo Temporal (Traba Relay)</option>
              <option value="bloqueo_total_corte">Bloqueo Total / Corte Remoto CanBus</option>
            </select>
            <span className="text-[10px] text-slate-400 block">
              Comando telemático enviado a la ECU del vehículo.
            </span>
          </div>

          {/* Retest Timer (if applicable) */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tiempo Espera Retest (Minutos)
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <input
                id="input-retest-minutes"
                type="number"
                min={0}
                max={60}
                value={activeProtocol.retestWaitMinutes || 0}
                onChange={(e) =>
                  updatePreventionProtocol(activeProtocol.id, {
                    retestWaitMinutes: Number(e.target.value) || 0
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Estándar OIML R-126 exige 15 minutos en reposo para descarte de alcohol bucal.
            </span>
          </div>
        </div>

        {/* Condition Threshold & Legal Basis Inputs */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300">
              Condición Métrica / Umbral de Activación *
            </label>
            <input
              id="input-threshold-condition"
              type="text"
              value={activeProtocol.thresholdCondition}
              onChange={(e) =>
                updatePreventionProtocol(activeProtocol.id, {
                  thresholdCondition: e.target.value
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 block">
              Parámetro evaluado en tiempo real al registrar el examen en garita.
            </span>
          </div>

          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300">
              Base Legal Chilena Vinculada *
            </label>
            <input
              id="input-legal-basis"
              type="text"
              value={activeProtocol.legalBasis}
              onChange={(e) =>
                updatePreventionProtocol(activeProtocol.id, {
                  legalBasis: e.target.value
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 block">
              Norma que respalda la legalidad de la medida ante la Inspección del Trabajo.
            </span>
          </div>
        </div>

        {/* Automated Notification Channels */}
        <div className="px-6">
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-400" />
                <span>Canales de Notificación Automática Inmediata</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Disparados al confirmar resultado en garita
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Push WebSocket */}
              <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                <input
                  id="toggle-notify-push"
                  type="checkbox"
                  checked={activeProtocol.notificationSettings.sendRealtimePush}
                  onChange={(e) =>
                    updatePreventionProtocol(activeProtocol.id, {
                      notificationSettings: {
                        ...activeProtocol.notificationSettings,
                        sendRealtimePush: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-white block">Push en Tiempo Real</span>
                  <span className="text-[10px] text-slate-400">WebSocket a supervisores</span>
                </div>
              </label>

              {/* Email CPHS */}
              <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                <input
                  id="toggle-notify-cphs"
                  type="checkbox"
                  checked={activeProtocol.notificationSettings.sendEmailCphs}
                  onChange={(e) =>
                    updatePreventionProtocol(activeProtocol.id, {
                      notificationSettings: {
                        ...activeProtocol.notificationSettings,
                        sendEmailCphs: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-white block">Email CPHS / Prevención</span>
                  <span className="text-[10px] text-slate-400">Comité Paritario DS 54</span>
                </div>
              </label>

              {/* Email Management */}
              <label className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                <input
                  id="toggle-notify-management"
                  type="checkbox"
                  checked={activeProtocol.notificationSettings.sendEmailManagement}
                  onChange={(e) =>
                    updatePreventionProtocol(activeProtocol.id, {
                      notificationSettings: {
                        ...activeProtocol.notificationSettings,
                        sendEmailManagement: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-white block">Alerta a Gerencia</span>
                  <span className="text-[10px] text-slate-400">Operaciones & Legal</span>
                </div>
              </label>

              {/* Audio Chime Selector */}
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Alarma Sonora</span>
                </div>
                <select
                  id="select-audio-chime"
                  value={activeProtocol.notificationSettings.triggerAudioChime}
                  onChange={(e) =>
                    updatePreventionProtocol(activeProtocol.id, {
                      notificationSettings: {
                        ...activeProtocol.notificationSettings,
                        triggerAudioChime: e.target.value as any
                      }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                >
                  <option value="urgent_alarm">Alarma de Emergencia</option>
                  <option value="warning_beep">Beep de Advertencia</option>
                  <option value="standard_chime">Chime Estándar</option>
                  <option value="none">Silencioso (Sin Audio)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic Intervention Actions List */}
        <div className="px-6 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Protocolo de Intervención: Acciones Automáticas Configurales
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300">
                  {activeActionsCount} de {activeProtocol.actions.length} Habilitadas
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cada acción seleccionada se ejecutará automáticamente o creará una tarea crítica asignada con SLA estricto.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1 shrink-0">
                Filtrar:
              </span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'operacional', label: 'Operacional' },
                { id: 'comunicacion_alertas', label: 'Comunicaciones' },
                { id: 'legal_laboral', label: 'Legal/Laboral' },
                { id: 'medica_toxicologica', label: 'Médica/Lab' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition shrink-0 ${
                    categoryFilter === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredActions.map((action) => {
              const catBadge = getCategoryBadge(action.category);
              return (
                <div
                  key={action.id}
                  id={`action-card-${action.id}`}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                    action.enabled
                      ? 'bg-slate-950/70 border-slate-700/80 shadow-sm'
                      : 'bg-slate-950/30 border-slate-800/40 opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${catBadge.color}`}
                        >
                          {catBadge.label}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {action.code}
                        </span>
                        {action.mandatoryByLaw && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                            title="Medida exigida por la normativa vigente"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Exigida por Ley
                          </span>
                        )}
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        id={`toggle-action-${action.id}`}
                        onClick={() => toggleProtocolAction(activeProtocol.id, action.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          action.enabled ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                        title={action.enabled ? 'Desactivar acción' : 'Activar acción'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            action.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">
                      {action.name}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-mono">
                        Ref: {action.legalReference}
                      </span>
                      <span>•</span>
                      <span>Rol: <strong className="text-slate-200">{action.assignedRole}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-blue-400">
                      <Clock className="w-3 h-3" />
                      <span>SLA: {action.slaResolutionMinutes}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Modal */}
      <ProtocolSimulatorModal
        protocol={activeProtocol}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onNavigateToNotifications={onNavigateToNotifications}
      />

      {/* Add Custom Action Modal */}
      <NewCustomActionModal
        isOpen={isAddActionOpen}
        onClose={() => setIsAddActionOpen(false)}
        onAddAction={(newAction) => addCustomActionToProtocol(activeProtocol.id, newAction)}
        protocolTitle={activeProtocol.title}
      />

      {/* Official Export Modal */}
      <ProtocolExportModal
        protocols={preventionProtocols}
        currentCompany={currentCompany}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
