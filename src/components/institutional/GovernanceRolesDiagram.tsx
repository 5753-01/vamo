import React, { useState } from 'react';
import {
  Users,
  Building2,
  UserCheck,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  Microscope,
  Scale,
  QrCode,
  FileCheck2,
  Bell,
  ArrowDown,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { NavView } from '../../types';

interface GovernanceRolesDiagramProps {
  onNavigate?: (view: NavView) => void;
  className?: string;
}

/**
 * Diagrama de Gobernanza, Actores y Arquitectura de Roles
 * Basado en la estructura del diagrama corporativo (mermaid-diagram.svg):
 * 1. Nivel Superior: Los 3 Actores Clave (Empresas, Conductores, Supervisores)
 * 2. Núcleo Central: Plataforma Hub Blindaje Vial (Criptografía, Validaciones)
 * 3. Nivel Lateral: Laboratorios de Referencia y Fiscalizadores Oficiales
 * 4. Nivel Salidas: Actas QR, Sellos Parabrisas, Notificaciones de Alerta
 */
export const GovernanceRolesDiagram: React.FC<GovernanceRolesDiagramProps> = ({
  onNavigate,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('hub');

  const nodesInfo: Record<string, { title: string; subtitle: string; role: string; details: string[]; targetView?: NavView }> = {
    clients: {
      title: 'Empresas y Clientes Mandantes',
      subtitle: 'Dirección de Operaciones, Compliance & Prevención de Riesgos',
      role: 'Responsabilidad Legal (Art. 184 Ley 16.744) y Gestión de Flota',
      details: [
        'Monitoreo consolidado de flotas en terminales y faenas mineras',
        'Recepción inmediata de alertas tempranas ante no conformidades',
        'Informes ejecutivos automáticos para mutualidades (ACHS, Mutual, IST)',
        'Auditoría y control de cumplimiento normativo ISO 37301'
      ],
      targetView: 'dashboard'
    },
    drivers: {
      title: 'Conductores y Operadores de Flota',
      subtitle: 'Conductores Profesionales A1, A2, A3, A4, A5',
      role: 'Sujeto de Control Digno, No Invasivo y Aleatorio',
      details: [
        'Sorteo diario imparcial sin sesgo bajo algoritmo SHA-256',
        'Toma de muestra en 5 min (aire espirado y saliva, sin orina)',
        'Firma y recepción de credencial digital con código QR de aptitud',
        'Validación continua de vigencia de licencia de conducir según Ley 18.290'
      ],
      targetView: 'drivers_fleet'
    },
    inspectors: {
      title: 'Supervisores y Operadores en Garita',
      subtitle: 'Personal Técnico de Terreno en Terminales 24/7',
      role: 'Ejecución del Protocolo Evidencial y Levantamiento de Actas',
      details: [
        'Uso de etilómetros con certificado de calibración metrológica vigente',
        'Registro digital inmediato del resultado con captura fotográfica y geolocalización',
        'Colocación del sello holográfico inviolable en el parabrisas del vehículo',
        'Activación de protocolo de contramuestra y relevo seguro en caso presuntivo'
      ],
      targetView: 'tests'
    },
    hub: {
      title: 'Plataforma Central Blindaje Vial 360°',
      subtitle: 'Motor Criptográfico, Validador Normativo y Hub de Datos',
      role: 'Núcleo Inmutable de Inteligencia y Cumplimiento Legal',
      details: [
        'Cálculo de hash criptográfico SHA-256 con sellado de tiempo RFC 3161',
        'Validador automático de Licencias de Conducir (Ley 18.290 Art. 110-111)',
        'Generación de código QR público para auditoría de pasajeros y autoridades',
        'Integración bidireccional con laboratorios y plataformas de RRHH'
      ],
      targetView: 'dashboard'
    },
    laboratories: {
      title: 'Laboratorios Toxicológicos GC/MS',
      subtitle: 'Red Acreditada ISO/IEC 17025',
      role: 'Confirmación Cuantitativa Forense con Valor Pericial',
      details: [
        'Recepción de segundas muestras con precinto de seguridad lacrado',
        'Cromatografía de gases y espectrometría de masas para descarte o confirmación',
        'Emisión de informe pericial con firma electrónica avanzada Ley 19.799',
        'Soporte probatorio pleno ante Tribunales de Justicia'
      ],
      targetView: 'lab_portal'
    },
    regulators: {
      title: 'Entes Fiscalizadores y Mutualidades',
      subtitle: 'SUSESO • Dirección del Trabajo • Carabineros • ACHS • Mutual',
      role: 'Supervisión y Verificación de Cumplimiento Laboral y Vial',
      details: [
        'Auditoría de actas conforme al Dictamen SUSESO 92.064',
        'Cotejo público en ruta por Carabineros mediante escaneo del sello QR',
        'Respaldo ante comparendos de la Inspección del Trabajo',
        'Acreditación de diligencia debida del empleador'
      ],
      targetView: 'compliance_matrix'
    },
    outputs: {
      title: 'Entregables y Mecanismos de Seguridad',
      subtitle: 'Actas Digitales, Sello QR y Alertas Tempranas',
      role: 'Garantía Visible de Seguridad para el Público y la Flota',
      details: [
        'Sello holográfico de parabrisas visible para pasajeros y Carabineros',
        'Acta oficial digital descargable con hash inmutable y firma digital',
        'Alertas automáticas vía SMS y correo electrónico a jefaturas',
        'Certificado de salida conforme antes de ingresar a la carretera troncal'
      ],
      targetView: 'reports'
    }
  };

  const activeNodeInfo = nodesInfo[selectedNode] || nodesInfo.hub;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Container Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>ARQUITECTURA DE GOBERNANZA & ROLES</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ecosistema de Actores e Integraciones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Estructura formal de relacionamiento entre clientes, conductores, operadores de garita y el motor central de Blindaje Vial.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-bold block">
              ESTÁNDAR MULTI-ROL SEGURO
            </span>
            <span className="text-[11px] text-slate-400">Control de Acceso RBAC</span>
          </div>
        </div>

        {/* Visual Architecture Tree */}
        <div className="space-y-6">
          {/* Level 1: 3 Top Stakeholders (Representing top 3 blue boxes with user icons in mermaid-diagram.svg) */}
          <div>
            <div className="text-center text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
              NIVEL 1: USUARIOS Y ACTORES OPERACIONALES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Clients */}
              <div
                onClick={() => setSelectedNode('clients')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'clients'
                    ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-blue-950/40 border-blue-900/70 hover:border-blue-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Empresas & Mandantes</h4>
                  <p className="text-[11px] text-slate-300">Gerencia y Prevención</p>
                </div>
              </div>

              {/* Box 2: Drivers */}
              <div
                onClick={() => setSelectedNode('drivers')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'drivers'
                    ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-blue-950/40 border-blue-900/70 hover:border-blue-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Conductores de Flota</h4>
                  <p className="text-[11px] text-slate-300">Buses, Camiones y Minería</p>
                </div>
              </div>

              {/* Box 3: Inspectors */}
              <div
                onClick={() => setSelectedNode('inspectors')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'inspectors'
                    ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-blue-950/40 border-blue-900/70 hover:border-blue-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Supervisores en Garita</h4>
                  <p className="text-[11px] text-slate-300">Técnicos Certificados 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting converging lines down to central hub */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-mono">
              <ArrowDown className="w-3 h-3 text-blue-400" />
              <span>CONVERGENCIA EN EL MOTOR CENTRAL</span>
            </div>
          </div>

          {/* Level 2: Central Platform Hub (Representing Middle Primary Node in mermaid-diagram.svg) */}
          <div
            onClick={() => setSelectedNode('hub')}
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
              selectedNode === 'hub'
                ? 'bg-gradient-to-r from-blue-900/70 via-indigo-900/50 to-blue-900/70 border-blue-400 ring-2 ring-blue-500/40 shadow-xl'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 uppercase">
                    NÚCLEO DE PROCESAMIENTO CENTRAL
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    Plataforma Central Blindaje Vial 360°
                  </h4>
                  <p className="text-xs text-slate-300">
                    Motor Criptográfico SHA-256 • Validador Ley 18.290 • Base de Datos Inmutable
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 shrink-0">
                <span>Explorar Núcleo</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Connecting radiating lines */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-mono">
              <ArrowDown className="w-3 h-3 text-indigo-400" />
              <span>DERIVACIONES Y CANALES DE SALIDA</span>
            </div>
          </div>

          {/* Level 3: 3 Bottom / Lateral Output Blocks (Representing the grey downstream blocks in mermaid-diagram.svg) */}
          <div>
            <div className="text-center text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
              NIVEL 3: LABORATORIOS EXTERNOS, AUTORIDADES Y ENTREGABLES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Output 1: Laboratories */}
              <div
                onClick={() => setSelectedNode('laboratories')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'laboratories'
                    ? 'bg-slate-800 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 flex items-center justify-center shrink-0">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Laboratorios GC/MS</h4>
                  <p className="text-[11px] text-slate-400">Confirmación Toxicológica</p>
                </div>
              </div>

              {/* Output 2: Regulators */}
              <div
                onClick={() => setSelectedNode('regulators')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'regulators'
                    ? 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">SUSESO & Carabineros</h4>
                  <p className="text-[11px] text-slate-400">Fiscalización y Dictámenes</p>
                </div>
              </div>

              {/* Output 3: Outputs / Sello QR */}
              <div
                onClick={() => setSelectedNode('outputs')}
                className={`p-4 rounded-xl border transition duration-200 cursor-pointer flex items-center gap-3 ${
                  selectedNode === 'outputs'
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/80 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Sello Parabrisas & Actas</h4>
                  <p className="text-[11px] text-slate-400">Verificación QR Inmutable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details Box */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{activeNodeInfo.title}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-blue-400 font-semibold">{activeNodeInfo.subtitle}</span>
              </h4>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Rol: {activeNodeInfo.role}
              </p>
            </div>

            {onNavigate && activeNodeInfo.targetView && (
              <button
                onClick={() => onNavigate(activeNodeInfo.targetView!)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Módulo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {activeNodeInfo.details.map((det, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{det}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
