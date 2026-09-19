import React, { useState } from 'react';
import { X, Plus, ShieldAlert, CheckCircle } from 'lucide-react';
import {
  AutomaticInterventionAction,
  InterventionActionCategory,
  RoleType
} from '../../types';

interface NewCustomActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAction: (action: Omit<AutomaticInterventionAction, 'id'>) => void;
  protocolTitle: string;
}

export const NewCustomActionModal: React.FC<NewCustomActionModalProps> = ({
  isOpen,
  onClose,
  onAddAction,
  protocolTitle
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('ACT-CUSTOM-01');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InterventionActionCategory>('operacional');
  const [mandatoryByLaw, setMandatoryByLaw] = useState(false);
  const [legalReference, setLegalReference] = useState('RIOHS / Procedimiento Interno');
  const [slaResolutionMinutes, setSlaResolutionMinutes] = useState(15);
  const [assignedRole, setAssignedRole] = useState<RoleType>('supervisor');
  const [requiresSupervisorAck, setRequiresSupervisorAck] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddAction({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim() || 'Acción automática personalizada de prevención.',
      category,
      enabled: true,
      mandatoryByLaw,
      legalReference: legalReference.trim() || 'Normativa Interna de Flota',
      slaResolutionMinutes: Number(slaResolutionMinutes) || 15,
      assignedRole,
      requiresSupervisorAck
    });

    onClose();
  };

  return (
    <div
      id="custom-action-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="custom-action-modal-container"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Nueva Acción Automática de Intervención
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                Vinculada a: {protocolTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Nombre de la Acción Automática *
            </label>
            <input
              id="input-action-name"
              type="text"
              required
              placeholder="Ej: Bloqueo de Tarjeta de Combustible Copec"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Código Mnemotécnico *
              </label>
              <input
                id="input-action-code"
                type="text"
                required
                placeholder="ACT-FUEL-BLOCK"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Categoría de Intervención
              </label>
              <select
                id="select-action-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as InterventionActionCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="operacional">Operacional (Garita / Flota)</option>
                <option value="comunicacion_alertas">Comunicación & Alertas Push/Email</option>
                <option value="legal_laboral">Legal & Laboral (RIOHS / DT)</option>
                <option value="medica_toxicologica">Médica & Toxicológica (Mutual)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Descripción del Protocolo de Ejecución
            </label>
            <textarea
              id="textarea-action-desc"
              rows={2}
              placeholder="Detalla qué realiza automáticamente el sistema o qué debe hacer el responsable asignado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Rol Responsable Asignado
              </label>
              <select
                id="select-action-role"
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value as RoleType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="supervisor">Supervisor de Turno</option>
                <option value="prevencionista">Prevencionista de Riesgos</option>
                <option value="test_operator">Operador de Garita</option>
                <option value="company_admin">Jefe de Operaciones / Admin</option>
                <option value="laboratorio">Laboratorio Toxicológico</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                SLA de Resolución (Minutos)
              </label>
              <input
                id="input-action-sla"
                type="number"
                min={0}
                max={1440}
                value={slaResolutionMinutes}
                onChange={(e) => setSlaResolutionMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Referencia Legal / Base Normativa
            </label>
            <input
              id="input-action-legal"
              type="text"
              placeholder="Ej: Art. 184 Código del Trabajo / Cláusula 12 RIOHS"
              value={legalReference}
              onChange={(e) => setLegalReference(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                id="checkbox-action-mandatory"
                type="checkbox"
                checked={mandatoryByLaw}
                onChange={(e) => setMandatoryByLaw(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Acción de Cumplimiento Mandatorio por Ley (No recomendada para desactivar)</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                id="checkbox-action-ack"
                type="checkbox"
                checked={requiresSupervisorAck}
                onChange={(e) => setRequiresSupervisorAck(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Requiere Acuse de Recibo Formal y Firma del Supervisor en Garita</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-custom-action"
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar Acción</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
