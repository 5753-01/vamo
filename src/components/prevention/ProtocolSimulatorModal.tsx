import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldAlert,
  Flame,
  BellRing,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  PreventionProtocolConfig,
  ProtocolSimulationResult,
  Driver
} from '../../types';
import { useApp } from '../../context/AppContext';

interface ProtocolSimulatorModalProps {
  protocol: PreventionProtocolConfig;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNotifications?: () => void;
}

export const ProtocolSimulatorModal: React.FC<ProtocolSimulatorModalProps> = ({
  protocol,
  isOpen,
  onClose,
  onNavigateToNotifications
}) => {
  const { drivers, vehicles, simulateProtocolExecution, showToast } = useApp();

  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    drivers[0]?.id || 'drv-01'
  );
  const [alcoholReading, setAlcoholReading] = useState<number>(
    protocol.resultType === 'negativo'
      ? 0.00
      : protocol.resultType === 'positivo_alcohol_infraccion'
      ? 0.18
      : protocol.resultType === 'positivo_alcohol_ebriedad'
      ? 0.52
      : 0.00
  );
  const [selectedDrug, setSelectedDrug] = useState<string>('THC (Cannabis)');
  const [simulationResult, setSimulationResult] = useState<ProtocolSimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animatedStepIndex, setAnimatedStepIndex] = useState<number>(-1);

  if (!isOpen) return null;

  const currentDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setAnimatedStepIndex(-1);
    setSimulationResult(null);

    // Simular retraso y animación secuencial
    setTimeout(() => {
      const result = simulateProtocolExecution(protocol.id);
      setSimulationResult(result);
      setIsRunning(false);

      // Animar paso a paso
      result.steps.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatedStepIndex(idx);
        }, (idx + 1) * 250);
      });

      showToast(`Simulación completada: ${result.executedActionsCount} acciones ejecutadas.`);
    }, 600);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'bajo':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'moderado':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'alto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'critico':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div
      id="protocol-simulator-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="protocol-simulator-modal-container"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Simulador de Protocolo de Intervención en Vivo
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getRiskBadgeColor(protocol.riskLevel)}`}>
                  Nivel {protocol.riskLevel}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {protocol.title} • Verificación de disparos automáticos y bloqueos
              </p>
            </div>
          </div>
          <button
            id="btn-close-simulator"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Simulation Parameters */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>Parámetros del Escenario de Prueba en Garita</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Conductor Asignado
                </label>
                <select
                  id="select-sim-driver"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.rut})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Valor Alcohotest Simulado (g/L)
                </label>
                <input
                  id="input-sim-alcohol"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="3.00"
                  value={alcoholReading}
                  onChange={(e) => setAlcoholReading(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Sustancia Panel Drogas
                </label>
                <select
                  id="select-sim-drug"
                  value={selectedDrug}
                  onChange={(e) => setSelectedDrug(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="No reactivo">No reactivo (Negativo)</option>
                  <option value="THC (Cannabis)">THC (Cannabis)</option>
                  <option value="COC (Cocaína)">COC (Cocaína / Pasta Base)</option>
                  <option value="AMP (Anfetaminas)">AMP (Anfetaminas)</option>
                  <option value="OPI (Opiáceos)">OPI (Opiáceos / Fentanilo)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="text-slate-400">
                Condición del protocolo: <span className="font-semibold text-slate-200">{protocol.thresholdCondition}</span>
              </div>
              <button
                id="btn-trigger-simulation"
                disabled={isRunning}
                onClick={handleRunSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 transition text-xs disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluando Intervención...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ejecutar Simulación Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Output Area */}
          {simulationResult && (
            <div className="space-y-4 animate-fadeIn">
              {/* Summary Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  simulationResult.dispatchAllowed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      simulationResult.dispatchAllowed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {simulationResult.dispatchAllowed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertOctagon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {simulationResult.dispatchAllowed
                        ? 'AUTORIZACIÓN DE DESPACHO CONFORME'
                        : 'BLOQUEO PREVENTIVO DE DESPACHO ACTIVADO'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {simulationResult.summaryMessage}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Acciones ejecutadas: <strong className="text-white">{simulationResult.executedActionsCount}</strong> / {simulationResult.totalConfiguredActions}</span>
                      <span>•</span>
                      <span>Alcolock: <strong className="text-white uppercase">{protocol.alcolockStateRequired}</strong></span>
                      <span>•</span>
                      <span>Conductor: <strong className="text-white">{currentDriver.fullName}</strong></span>
                    </div>
                  </div>
                </div>

                {protocol.notificationSettings.sendRealtimePush && (
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-lg text-[10px] font-bold">
                      <BellRing className="w-3 h-3 text-blue-400 animate-pulse" />
                      Push Emitido en Vivo
                    </span>
                    {onNavigateToNotifications && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToNotifications();
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 underline mt-1"
                      >
                        Ver en Centro de Notificaciones
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Step by Step Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Secuencia de Intervención Automática
                </h4>
                <div className="space-y-2">
                  {simulationResult.steps.map((step, idx) => {
                    const isVisible = idx <= animatedStepIndex;
                    return (
                      <div
                        key={step.actionCode}
                        className={`p-3 rounded-xl border transition-all duration-300 flex items-start justify-between gap-3 ${
                          isVisible
                            ? step.status === 'bloqueo_critico'
                              ? 'bg-rose-950/30 border-rose-800/60 text-slate-200'
                              : step.status === 'ejecutado'
                              ? 'bg-slate-950/70 border-slate-700/80 text-slate-200'
                              : 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-60'
                            : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              step.status === 'bloqueo_critico'
                                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                                : step.status === 'ejecutado'
                                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {step.stepNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs text-white">
                                {step.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {step.actionCode}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  step.status === 'bloqueo_critico'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : step.status === 'ejecutado'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {step.status === 'bloqueo_critico'
                                  ? 'EJECUCIÓN CRÍTICA'
                                  : step.status === 'ejecutado'
                                  ? 'EJECUTADA OK'
                                  : 'OMITIDA (DESACTIVADA)'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            SLA: {step.slaMinutes}m
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            {step.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Base Legal Activa: <span className="text-slate-300 font-medium">{protocol.legalBasis}</span>
          </div>
          <button
            id="btn-close-simulator-bottom"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Cerrar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
