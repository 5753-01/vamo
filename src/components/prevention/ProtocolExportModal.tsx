import React from 'react';
import { X, Download, Printer, ShieldCheck, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { PreventionProtocolConfig, Company } from '../../types';

interface ProtocolExportModalProps {
  protocols: PreventionProtocolConfig[];
  currentCompany: Company;
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolExportModal: React.FC<ProtocolExportModalProps> = ({
  protocols,
  currentCompany,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(protocols, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `protocolos-prevencion-blindajevial-${currentCompany.rut}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      id="protocol-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="protocol-export-modal-container"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Ficha Oficial de Protocolos de Prevención e Intervención
              </h2>
              <p className="text-xs text-slate-400">
                Auditable según Ley 18.290, Circular 3331 SUSESO y Reglamento RIOHS • {currentCompany.businessName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" />
              <span>Exportar JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / Document View */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-200 print:bg-white print:text-black">
          {/* Official Letterhead */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 print:border-black print:bg-white">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                  Documento de Cumplimiento Regulatorio Laboral
                </span>
                <h1 className="text-base font-bold text-white mt-1">
                  MATRIZ DE PROTOCOLOS DE PREVENCIÓN E INTERVENCIÓN ANTE CONTROLES DE ALCOHOL Y DROGAS
                </h1>
                <p className="text-xs text-slate-400">
                  Sistema Integrado Blindaje Vial 360 • Acreditado para Transporte Terrestre
                </p>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400">
                <div>FOLIO: <strong className="text-white">PROT-2026-CHL</strong></div>
                <div>EMISIÓN: 13-09-2026</div>
                <div>VERSIÓN: 3.2 (Vigente)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Razón Social:</span>
                <strong className="text-white">{currentCompany.businessName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">RUT Empresa:</span>
                <strong className="text-white">{currentCompany.rut}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Organismo Mutual:</span>
                <strong className="text-white">{currentCompany.mutualidad}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Marco Normativo:</span>
                <strong className="text-white">Ley 18.290 / SUSESO 3331</strong>
              </div>
            </div>
          </div>

          {/* Protocols List */}
          <div className="space-y-4">
            {protocols.map((proto) => (
              <div
                key={proto.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {proto.title}
                      </h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                          proto.riskLevel === 'critico'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : proto.riskLevel === 'alto'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : proto.riskLevel === 'moderado'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        Nivel de Riesgo: {proto.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Condición de Disparo: <span className="text-slate-200 font-semibold">{proto.thresholdCondition}</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <span
                      className={`px-2 py-1 rounded font-bold uppercase ${
                        proto.dispatchAllowed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {proto.dispatchAllowed ? 'Despacho Habilitado' : 'Despacho Bloqueado'}
                    </span>
                    <span className="block text-slate-400 mt-1">
                      Alcolock: <strong className="text-slate-200 uppercase">{proto.alcolockStateRequired}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300">
                  <strong>Base Legal / Fundamento:</strong> {proto.legalBasis}
                </div>

                {proto.sanctionRihohsReference && (
                  <div className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-800/40 p-2 rounded-lg">
                    <strong>Sanción Reglamentaria (RIOHS):</strong> {proto.sanctionRihohsReference}
                  </div>
                )}

                {/* Actions Table */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Acciones Automáticas de Intervención ({proto.actions.filter((a) => a.enabled).length} de {proto.actions.length} activadas):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {proto.actions.map((act) => (
                      <div
                        key={act.id}
                        className={`p-2 rounded-lg border text-[11px] flex items-start justify-between gap-2 ${
                          act.enabled
                            ? 'bg-slate-900 border-slate-700 text-slate-200'
                            : 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${act.enabled ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className="truncate">{act.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                            Ref: {act.legalReference} • Rol: {act.assignedRole}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400 shrink-0">
                          SLA {act.slaResolutionMinutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Certificado conforme a ISO 37301 y Circular 3331 SUSESO</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
