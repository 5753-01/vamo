import React, { useState } from 'react';
import { NavView } from '../../types';
import {
  ShieldCheck,
  Dices,
  Lock,
  Users,
  Activity,
  Microscope,
  FileSpreadsheet,
  QrCode,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';

interface BlindajeVialFlowDiagramProps {
  onNavigate?: (view: NavView) => void;
  className?: string;
}

/**
 * Diagrama Oficial Interactivo: Flujo de Control Blindaje Vial®
 * Reproducción fidedigna y enriquecida de la infografía oficial de Drive:
 * 1. Selección Aleatoria (SHA-256) -> Generador Aleatorio Seguro
 * 2. Control en Terreno -> Registro de Actas Digitales
 * 3. Dashboard & KPIs -> Monitoreo & Métricas
 * 4. Análisis de Muestras -> Integración con Laboratorio
 * 5. Resultados & Reportes -> Informe de Cumplimiento
 * 6. Cadena de Custodia -> Trazabilidad Certificada
 */
export const BlindajeVialFlowDiagram: React.FC<BlindajeVialFlowDiagramProps> = ({
  onNavigate,
  className = ''
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'visual' | 'cards' | 'legal'>('visual');

  const steps = [
    {
      step: 1,
      id: 'random_selection',
      title: 'Selección Aleatoria',
      subtitle: 'Generador Aleatorio Seguro',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-orange-600 text-white',
      borderHover: 'hover:border-orange-500',
      iconType: 'sha256_dice',
      targetView: 'random_selection' as NavView,
      normativa: 'Dictamen SUSESO 92.064 (Tomo 2) • Ley Karin N° 21.643 • Art. 154 bis Código del Trabajo',
      lead: 'Algoritmo criptográfico SHA-256 que elimina la discrecionalidad y el sesgo humano.',
      description:
        'El sistema ejecuta un sorteo matemático diario e inmodificable entre la dotación activa de conductores por base o terminal. La semilla del sorteo genera un hash inalterable que previene cualquier sospecha de acoso laboral, favoritismo o arbitrariedad conforme al Dictamen SUSESO 92.064.',
      indicators: [
        'Semilla criptográfica verificable por sindicatos y comités paritarios',
        'Imparcialidad total ante fiscalizaciones de la Dirección del Trabajo',
        'Protección efectiva contra denuncias por Ley Karin',
        'Registro de excepciones médicas y justificaciones formales'
      ]
    },
    {
      step: 2,
      id: 'field_control',
      title: 'Control en Terreno',
      subtitle: 'Registro de Actas Digitales',
      color: 'from-blue-600 to-indigo-700',
      badgeColor: 'bg-blue-900 text-white',
      borderHover: 'hover:border-blue-500',
      iconType: 'inspector_test',
      targetView: 'tests' as NavView,
      normativa: 'Ley 18.290 Art. 110-111 • OIML R 126 • Circular SUSESO sobre Metrología Evidencial',
      lead: 'Toma rápida in situ en garita 24/7 con etilómetros evidenciales y screening salival en 5 min.',
      description:
        'Operadores técnicos acreditados aplican pruebas de alcohotest con boquilla desechable termosellada (tolerancia 0,00 g/l para transporte) y screening rápido en saliva Assure Tech para 6 drogas (THC, Cocaína, Anfetaminas, Opiáceos, Benzodiacepinas, Metanfetaminas), resguardando la dignidad del trabajador.',
      indicators: [
        'Cero invasión corporal (saliva y aire espirado, sin toma de orina)',
        'Etilómetros con celda de combustible y certificado metrológico vigente',
        'Lectura digital en garita previa a la autorización de salida a ruta',
        'Firma biométrica o pin digital del conductor en tablet de terreno'
      ]
    },
    {
      step: 3,
      id: 'dashboard_kpis',
      title: 'Dashboard & KPIs',
      subtitle: 'Monitoreo & Métricas',
      color: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-900 text-white',
      borderHover: 'hover:border-cyan-500',
      iconType: 'dashboard_screen',
      targetView: 'dashboard' as NavView,
      normativa: 'ISO 37301 Sistema de Gestión de Compliance • ISO 39001 Seguridad Vial',
      lead: 'Telemetría de sobriedad en tiempo real, alertas tempranas y tasa de aptitud de flota.',
      description:
        'Centro de control unificado accesible para jefes de operaciones, gerentes de seguridad y auditores de compliance. Muestra en segundos el estado de cada servicio, conductores aptos, turnos bloqueados preventivamente y estadísticas para los comités paritarios.',
      indicators: [
        'Tasa de negatividad consolidada en tiempo real (> 99.8%)',
        'Alertas instantáneas por WhatsApp / Email ante casos no conformes',
        'Trazabilidad por ruta, faena minera, terminal y turno de conducción',
        'Exportación automatizada para auditorías de clientes mandantes'
      ]
    },
    {
      step: 4,
      id: 'lab_analysis',
      title: 'Análisis de Muestras',
      subtitle: 'Integración con Laboratorio',
      color: 'from-blue-700 to-indigo-900',
      badgeColor: 'bg-blue-900 text-white',
      borderHover: 'hover:border-indigo-500',
      iconType: 'lab_microscope',
      targetView: 'lab_portal' as NavView,
      normativa: 'ISO/IEC 17025 • Validación ISP • Estándar Forense GC/MS (Cromatografía de Gases)',
      lead: 'Confirmación cromatográfica de laboratorio clínico para casos presuntivos con plena validez judicial.',
      description:
        'Si un screening salival arroja un resultado presuntivo no negativo, la segunda alícuota se lacra herméticamente con precinto de seguridad numerado y se despacha de inmediato a la red de laboratorios toxicológicos acreditados para su confirmación cuantitativa por GC-MS.',
      indicators: [
        'Doble alícuota lacrada en presencia del conductor y supervisor',
        'Transporte con cadena de frío y monitoreo GPS de temperatura',
        'Emisión de informe pericial forense admisible ante Juzgados de Letras del Trabajo',
        'Confidencialidad médica y secreto profesional garantizado'
      ]
    },
    {
      step: 5,
      id: 'results_reports',
      title: 'Resultados & Reportes',
      subtitle: 'Informe de Cumplimiento',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-orange-600 text-white',
      borderHover: 'hover:border-orange-500',
      iconType: 'reports_clipboard',
      targetView: 'reports' as NavView,
      normativa: 'Ley 16.744 Deber de Protección del Empleador (Art. 184) • Dictámenes DT',
      lead: 'Actas de inspección inmutables y consolidados mensuales para mutualidades de seguridad.',
      description:
        'La plataforma genera automáticamente el acta legal de cada examen con sello de tiempo RFC 3161 y los informes de siniestralidad y cumplimiento exigidos por las mutualidades (ACHS, Mutual de Seguridad, IST, ISL) y clientes mandantes de la gran minería e industria forestal.',
      indicators: [
        'Generación de informe pericial con 1 clic en PDF firmado digitalmente',
        'Respaldo total del deber de cuidado del empleador ante accidentes de trayecto',
        'Historial consolidado por conductor con semáforo de riesgo preventivo',
        'Acreditación formal para licitaciones y contratos de transporte'
      ]
    },
    {
      step: 6,
      id: 'chain_custody',
      title: 'Cadena de Custodia',
      subtitle: 'Trazabilidad Certificada',
      color: 'from-blue-800 to-slate-900',
      badgeColor: 'bg-blue-900 text-white',
      borderHover: 'hover:border-emerald-500',
      iconType: 'custody_qr',
      targetView: 'custody_chains' as NavView,
      normativa: 'Ley 19.799 Firma Electrónica • Estándar RFC 3161 • Verificación Pública en Ruta',
      lead: 'Sello holográfico inviolable en parabrisas y código QR inalterable para fiscalización en ruta.',
      description:
        'Cada vehículo con control conforme recibe un sello holográfico con código QR único adherido al parabrisas. Cualquier pasajero, fiscalizador del Ministerio de Transportes o Carabinero de Chile puede escanear el QR desde su celular y comprobar de inmediato el folio, la fecha, la hora y el resultado 0,00 g/l.',
      indicators: [
        'Sello con cortes de seguridad autodestructibles contra adulteraciones',
        'Consulta pública inmediata sin necesidad de login o aplicaciones externas',
        'Registro geo-referenciado con coordenadas GPS de la garita de emisión',
        'Cierre del ciclo de blindaje vial que previene la salida de unidades riesgosas'
      ]
    }
  ];

  const currentStepData = steps.find((s) => s.step === selectedStep) || steps[0];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. OFFICIAL TITLE BANNER (Identical in concept to Image 2) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border border-blue-800/80 shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>METODOLOGÍA OFICIAL CERTIFICADA</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-amber-300">ISO 37301 / SUSESO</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Flujo de Control
              </h2>
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 tracking-tight">
                Blindaje Vial®
              </h2>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Circuito cerrado de 6 etapas que garantiza certeza científica, legal y metrológica desde el sorteo del conductor en garita hasta la fiscalización en ruta con código QR.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diagrama de Flujo
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Etapas en Detalle
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'legal'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Marco Legal
            </button>
          </div>
        </div>
      </div>

      {/* 2. VISUAL FLOW DIAGRAM (Direct Graphic Representation of Image 2) */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          {/* Main Flow Stage Canvas */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-8">
            {/* Top Row: Steps 1, 2, 3, 4 with connecting arrows */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4 px-2">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  FASE 1: EJECUCIÓN OPERACIONAL Y CONTROL PREVIO AL DESPACHO
                </span>
                <span className="hidden sm:inline">Puntos 1 a 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {steps.slice(0, 4).map((item, idx) => {
                  const isSelected = selectedStep === item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setSelectedStep(item.step)}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-900 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      {/* Step Number Badge & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${item.badgeColor}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          0{item.step}
                        </span>
                      </div>

                      {/* Graphic Illustration */}
                      <div className="py-4 flex items-center justify-center">
                        {item.iconType === 'sha256_dice' && (
                          <div className="flex items-center gap-3">
                            {/* Blue Padlock with SHA-256 */}
                            <div className="relative w-14 h-16 bg-blue-700 rounded-lg flex flex-col items-center justify-end p-1.5 shadow-md border border-blue-400/40">
                              <div className="absolute -top-4 w-8 h-8 border-4 border-slate-200 rounded-t-full" />
                              <div className="w-full bg-blue-950/80 rounded py-1 px-1 text-center">
                                <span className="font-mono text-[9px] font-black text-amber-300 tracking-tighter">
                                  SHA-256
                                </span>
                              </div>
                            </div>

                            {/* Dice Pair */}
                            <div className="flex flex-col gap-1.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-600 border border-blue-400 flex items-center justify-center text-white shadow-sm transform -rotate-6">
                                <div className="grid grid-cols-2 gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-blue-900 shadow-sm transform rotate-12">
                                <div className="grid grid-cols-2 gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {item.iconType === 'inspector_test' && (
                          <div className="flex items-center gap-3">
                            {/* Inspector Icon */}
                            <div className="w-12 h-14 bg-blue-800 rounded-xl border border-blue-400/50 flex flex-col items-center justify-center p-1 shadow-md">
                              <div className="w-6 h-3 bg-amber-400 rounded-t-sm mb-1" />
                              <div className="w-5 h-5 rounded-full bg-amber-200" />
                              <div className="w-8 h-4 bg-blue-900 rounded-b mt-0.5" />
                            </div>

                            {/* Testing Wand / Swab */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-bold text-amber-400">Oral/Aire</span>
                              <div className="w-12 h-2 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full shadow-sm" />
                              <span className="text-[9px] font-mono text-slate-400">0.00 g/l</span>
                            </div>

                            {/* Driver silhouette */}
                            <div className="w-10 h-12 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-1 opacity-85">
                              <div className="w-5 h-5 rounded-full bg-amber-100/90" />
                              <div className="w-7 h-4 bg-slate-700 rounded-b mt-0.5" />
                            </div>
                          </div>
                        )}

                        {item.iconType === 'dashboard_screen' && (
                          <div className="flex flex-col items-center">
                            {/* Monitor Screen */}
                            <div className="w-24 h-16 bg-slate-950 rounded-lg border-2 border-slate-700 p-1.5 flex flex-col justify-between shadow-md">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-[8px] font-mono text-cyan-400">KPIs LIVE</span>
                              </div>
                              <div className="flex items-end justify-between gap-1 h-7 pt-1">
                                <div className="w-2.5 h-3 bg-blue-500 rounded-t-xs" />
                                <div className="w-2.5 h-5 bg-emerald-500 rounded-t-xs" />
                                <div className="w-2.5 h-4 bg-cyan-400 rounded-t-xs" />
                                <div className="w-2.5 h-6 bg-amber-400 rounded-t-xs" />
                                <div className="w-2.5 h-5 bg-blue-600 rounded-t-xs" />
                              </div>
                            </div>
                            <div className="w-6 h-2 bg-slate-700 mt-0.5" />
                            <div className="w-10 h-1 bg-slate-600 rounded-full" />
                          </div>
                        )}

                        {item.iconType === 'lab_microscope' && (
                          <div className="flex items-center gap-3">
                            {/* Erlenmeyer Flask */}
                            <div className="w-11 h-14 bg-gradient-to-t from-teal-500/80 via-teal-700/60 to-transparent border-2 border-teal-300 rounded-b-xl flex flex-col items-center justify-end p-1 shadow-sm">
                              <div className="w-3 h-4 border-l-2 border-r-2 border-teal-300 -mt-6 bg-transparent" />
                              <span className="text-[8px] font-bold text-white">GC/MS</span>
                            </div>

                            {/* Microscope Silhouette */}
                            <div className="w-12 h-14 bg-slate-950 rounded-lg border border-indigo-400/60 flex items-center justify-center p-1 text-indigo-300 shadow-sm">
                              <Microscope className="w-8 h-8 text-cyan-400" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subtitle & Caption */}
                      <div className="text-center pt-2 border-t border-slate-800/80">
                        <p className="text-xs font-bold text-slate-200">{item.subtitle}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.lead}</p>
                      </div>

                      {/* Selection Glow Indicator */}
                      {isSelected && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-blue-400">
                          <span>Ver Detalles</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connecting Visual Feedback Loop (Arrows down and returning) */}
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 py-1">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-blue-500" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-blue-300 text-[11px]">
                <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                <span>TRAZABILIDAD Y CIERRE DEL CICLO DE BLINDAJE</span>
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent via-blue-500/30 to-blue-500" />
            </div>

            {/* Bottom Row: Steps 5 & 6 (Outputs & Certification) */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4 px-2">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  FASE 2: CERTIFICACIÓN, ACTA DIGITAL Y SELLO HOLOGRÁFICO CON QR
                </span>
                <span className="hidden sm:inline">Puntos 5 y 6</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                {steps.slice(4, 6).map((item) => {
                  const isSelected = selectedStep === item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setSelectedStep(item.step)}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/30'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      {/* Badge Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${item.badgeColor}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          0{item.step}
                        </span>
                      </div>

                      {/* Graphic Visual */}
                      <div className="py-4 flex items-center justify-center">
                        {item.iconType === 'reports_clipboard' && (
                          <div className="flex items-center gap-4">
                            {/* Clipboard with Pie Chart */}
                            <div className="w-16 h-20 bg-slate-100 rounded-lg border-2 border-slate-300 flex flex-col items-center justify-between p-2 shadow-md">
                              <div className="w-6 h-2 bg-slate-700 rounded-t-xs -mt-3" />
                              <div className="w-7 h-7 rounded-full border-4 border-blue-600 border-t-amber-500 my-1" />
                              <div className="w-full space-y-1">
                                <div className="h-1 bg-slate-300 rounded" />
                                <div className="h-1 bg-slate-300 rounded w-4/5" />
                              </div>
                            </div>
                            <div className="text-left">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold block">100% INMUTABLE</span>
                              <span className="text-xs font-bold text-white block">Informe Oficial</span>
                              <span className="text-[10px] text-slate-400">Sello RFC 3161</span>
                            </div>
                          </div>
                        )}

                        {item.iconType === 'custody_qr' && (
                          <div className="flex items-center gap-4">
                            {/* Certificate with QR and Shield */}
                            <div className="w-16 h-20 bg-gradient-to-br from-slate-950 to-blue-950 rounded-lg border border-blue-500/80 flex flex-col items-center justify-center p-1.5 shadow-md">
                              <div className="w-10 h-10 bg-white p-0.5 rounded flex items-center justify-center">
                                <QrCode className="w-9 h-9 text-slate-950" />
                              </div>
                              <span className="text-[7px] font-mono text-blue-300 font-bold mt-1">SELLO QR</span>
                            </div>

                            {/* Shield Badge */}
                            <div className="w-12 h-14 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-xl border-2 border-amber-200 flex flex-col items-center justify-center text-blue-950 shadow-md">
                              <CheckCircle2 className="w-7 h-7 text-blue-950" />
                              <span className="text-[8px] font-black tracking-tighter">0.00</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subtitle & Caption */}
                      <div className="text-center pt-2 border-t border-slate-800/80">
                        <p className="text-xs font-bold text-slate-200">{item.subtitle}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.lead}</p>
                      </div>

                      {/* Selection Glow */}
                      {isSelected && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-400">
                          <span>Ver Detalles</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Detail Drawer for Selected Step */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${currentStepData.badgeColor}`}>
                  0{currentStepData.step}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{currentStepData.title}</span>
                    <span className="text-slate-500 font-normal">|</span>
                    <span className="text-sm font-semibold text-blue-400">{currentStepData.subtitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentStepData.normativa}
                  </p>
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate(currentStepData.targetView)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Probar Herramienta en el Sistema</span>
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentStepData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentStepData.indicators.map((ind, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. STEP CARDS VIEW */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${item.badgeColor}`}>
                    {item.title}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold">Paso 0{item.step}</span>
                </div>

                <h4 className="font-bold text-white text-base leading-snug">
                  {item.subtitle}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold block">
                    Normativa Clave:
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {item.normativa}
                  </p>
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate(item.targetView)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  <span>Abrir en el Software</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. LEGAL COMPLIANCE MATRIX VIEW */}
      {activeTab === 'legal' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <span>Soporte Jurídico y Reglamentario del Flujo de Control</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Cómo cada fase técnica del Flujo Blindaje Vial® responde a una exigencia explícita de los Tribunales, la SUSESO y la Dirección del Trabajo.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-blue-400 font-mono font-bold">
                <span>FASE 1: SELECCIÓN ALEATORIA</span>
                <span>Art. 154 bis • Dictamen SUSESO 92.064 Tomo 2</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                La ley exige que los controles sean <strong>impersonales</strong> y no dependan del arbitrio de jefaturas. El generador criptográfico SHA-256 es el único medio auditable que descarta denuncias por tutela laboral o acoso bajo la Ley Karin N° 21.643.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-mono font-bold">
                <span>FASE 2: CONTROL EN TERRENO</span>
                <span>Ley 18.290 Art. 110-111 • OIML R 126</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                En el transporte profesional de personas y carga rige estándar <strong>0,00 g/l</strong>. El uso de etilómetros evidenciales con certificado de calibración metrológica y kits salivales no invasivos Assure Tech garantiza que ningún conductor tome el volante bajo sustancias.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-mono font-bold">
                <span>FASE 4: ANÁLISIS DE LABORATORIO</span>
                <span>ISO/IEC 17025 • Circular Clínicas SUSESO</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Para justificar el cese de funciones sin derecho a indemnización o un relevo forzoso, la prueba de screening rápida debe estar respaldada por una segunda alícuota analizada con cromatografía de gases y espectrometría de masas (GC-MS).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-indigo-400 font-mono font-bold">
                <span>FASE 6: CADENA DE CUSTODIA Y SELLO QR</span>
                <span>Ley 19.799 Firma Digital • RFC 3161</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Otorga certeza probatoria ante la Inspección del Trabajo y juzgados laborales. La existencia del acta digital con hash inalterable invierte la carga probatoria protegiendo el patrimonio y la responsabilidad penal del directorio de la empresa.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
