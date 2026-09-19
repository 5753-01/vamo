import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavView } from '../types';
import executiveCoverImg from '../assets/images/executive_cover_1789798615439.jpg';
import technicalCoverImg from '../assets/images/technical_cover_1789798633692.jpg';
import commercialCoverImg from '../assets/images/commercial_cover_1789798655593.jpg';
import platformCoverImg from '../assets/images/platform_cover_1789798669343.jpg';
import {
  Shield,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Download,
  Printer,
  ExternalLink,
  Copy,
  Check,
  Palette,
  Maximize2,
  Tv,
  FileCode,
  Briefcase,
  LayoutDashboard,
  CheckCircle2,
  Eye,
  Sliders,
  DollarSign,
  Users,
  Handshake,
  HeartHandshake,
  Activity,
  Radio,
  FileText,
  Lock,
  Compass
} from 'lucide-react';

interface BrandVisualKitViewProps {
  onNavigate?: (view: NavView) => void;
}

type ChannelKey = 'all' | 'executive' | 'technical' | 'commercial' | 'platform';

export const BrandVisualKitView: React.FC<BrandVisualKitViewProps> = ({ onNavigate }) => {
  const { currentCompany } = useApp();

  const [activeChannel, setActiveChannel] = useState<ChannelKey>('all');
  const [renderMode, setRenderMode] = useState<'photo' | 'interactive'>('photo');
  const [selectedCoverModal, setSelectedCoverModal] = useState<ChannelKey | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Customizable Metadata fields for real-time brand adaptation
  const [clientCompany, setClientCompany] = useState<string>('RedPuerto S.A.');
  const [locationLabel, setLocationLabel] = useState<string>('San Antonio, Región de Valparaíso');
  const [periodLabel, setPeriodLabel] = useState<string>('Septiembre 2026');
  const [validityDays, setValidityDays] = useState<number>(30);
  const [isoBadges, setIsoBadges] = useState<string>('ISO 37301 / ISO 39001');

  const copyToClipboard = (text: string, tokenKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadImage = (imgSrc: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-600 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Kit Visual Integral • Identidad 360°
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-bold px-3 py-1 rounded-full">
                4 Canales Sincronizados
              </span>
              <span className="bg-slate-800 text-slate-300 text-[11px] font-mono px-3 py-1 rounded-full">
                Cliente Activo: {clientCompany}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Consistencia de Marca en Todos los Canales
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Un único lenguaje gráfico de alto impacto corporativo: el emblemático escudo 3D cromado con bus y sensor de alcoholemia, la perspectiva de autopista hacia el horizonte al amanecer, y tipografía institucional rigurosa aplicada a <strong>Presentaciones Ejecutivas</strong>, <strong>Documentación Técnica</strong>, <strong>Material Comercial</strong> y <strong>Plataforma Digital</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                setClientCompany('RedPuerto S.A.');
                setLocationLabel('San Antonio, Región de Valparaíso');
                setPeriodLabel('Septiembre 2026');
                setValidityDays(30);
              }}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcwIcon className="w-4 h-4 text-blue-400" />
              <span>Restablecer Parámetros Oficiales</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar Kit PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Channels & View Mode */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          <button
            onClick={() => setActiveChannel('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeChannel === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver los 4 Canales (Matriz)</span>
          </button>

          <button
            onClick={() => setActiveChannel('executive')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeChannel === 'executive'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Presentación Ejecutiva</span>
          </button>

          <button
            onClick={() => setActiveChannel('technical')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeChannel === 'technical'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. Documento Técnico</span>
          </button>

          <button
            onClick={() => setActiveChannel('commercial')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeChannel === 'commercial'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Oferta de Servicio</span>
          </button>

          <button
            onClick={() => setActiveChannel('platform')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeChannel === 'platform'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Plataforma Digital</span>
          </button>
        </div>

        {/* Render Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono px-2">Visualizador:</span>
          <button
            onClick={() => setRenderMode('photo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              renderMode === 'photo'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Arte Oficial HD (8K)</span>
          </button>
          <button
            onClick={() => setRenderMode('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              renderMode === 'interactive'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Capa Vector / Dinámica</span>
          </button>
        </div>
      </div>

      {/* Dynamic Metadata Customizer Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Personalización en Vivo de Carátulas (Consistencia de Marca Multi-Cliente)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Empresa / Mandante:</label>
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
              placeholder="Ej: RedPuerto S.A."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ubicación / Territorio:</label>
            <input
              type="text"
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
              placeholder="Ej: San Antonio, Región de Valparaíso"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mes y Año de Emisión:</label>
            <input
              type="text"
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
              placeholder="Ej: Septiembre 2026"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Vigencia Propuesta (Días):</label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
              min={7}
              max={180}
            />
          </div>
        </div>
      </div>

      {/* Main 4 Channels Display Grid */}
      <div className={`grid gap-6 ${activeChannel === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* CHANNEL 1: PRESENTACIÓN EJECUTIVA */}
        {(activeChannel === 'all' || activeChannel === 'executive') && (
          <ChannelCard
            channelId="executive"
            title="Presentación Ejecutiva"
            subtitle="Seguridad Operacional Inteligente • Control Preventivo de Alcohol y Drogas"
            badge="CANAL 1 • DIRECTORIO & GERENCIA"
            badgeColor="bg-blue-600 text-white"
            imgSrc={executiveCoverImg}
            renderMode={renderMode}
            onOpenModal={() => setSelectedCoverModal('executive')}
            onDownload={() => downloadImage(executiveCoverImg, 'BlindajeVial360_Presentacion_Ejecutiva.jpg')}
            onNavigateTarget={() => onNavigate?.('integral_service')}
            navigateLabel="Abrir Deck de Presentación (12 Slides)"
          >
            {/* Interactive Vector Overlay for Channel 1 */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0A1A3A] via-[#081B4B] to-[#040C20] border border-blue-500/30 flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Subtle highway perspective background graphic */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <svg viewBox="0 0 800 450" className="w-full h-full object-cover">
                  <defs>
                    <linearGradient id="horizonGlow" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#FB923C" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#1E3A8A" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="roadPerspective" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                  </defs>
                  {/* Horizon Glow */}
                  <circle cx="400" cy="270" r="180" fill="url(#horizonGlow)" />
                  {/* Road */}
                  <polygon points="360,270 440,270 650,450 150,450" fill="url(#roadPerspective)" />
                  {/* Center Dash lines */}
                  <line x1="400" y1="270" x2="400" y2="450" stroke="#FDE047" strokeWidth="3" strokeDasharray="12,14" />
                  {/* Road Edges */}
                  <line x1="360" y1="270" x2="150" y2="450" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                  <line x1="440" y1="270" x2="650" y2="450" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                </svg>
              </div>

              {/* Top Client Brand Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-white tracking-wide">
                    {clientCompany}
                  </span>
                </div>

                <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-blue-400/40">
                  CONFIDENCIAL • GOBERNANZA
                </div>
              </div>

              {/* Main Center Content: Metallic Emblem + Typography */}
              <div className="relative z-10 flex items-center gap-5 sm:gap-8 my-auto">
                {/* 3D Metallic Shield Vector Emblem */}
                <div className="shrink-0 w-24 sm:w-32 h-28 sm:h-36 drop-shadow-2xl">
                  <ShieldVectorEmblem />
                </div>

                {/* Typography Hierarchy */}
                <div className="space-y-1 sm:space-y-2">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md font-sans">
                    Blindaje Vial 360
                  </h2>
                  <p className="text-base sm:text-2xl italic font-serif text-blue-200 tracking-wide font-medium">
                    Presentación Ejecutiva
                  </p>
                  <div className="pt-1 text-xs sm:text-sm font-semibold text-blue-100 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-cyan-300">Seguridad Operacional Inteligente</span>
                    <span className="hidden sm:inline text-blue-400">•</span>
                    <span className="text-slate-200">Control Preventivo de Alcohol y Drogas</span>
                  </div>
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="relative z-10 pt-3 border-t border-blue-400/20 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-blue-200/90 font-mono gap-1">
                <span>{locationLabel}</span>
                <span>•</span>
                <span>{periodLabel}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">Vigencia: {validityDays} días</span>
              </div>
            </div>
          </ChannelCard>
        )}

        {/* CHANNEL 2: DOCUMENTO TÉCNICO */}
        {(activeChannel === 'all' || activeChannel === 'technical') && (
          <ChannelCard
            channelId="technical"
            title="Documento Técnico"
            subtitle="Cumplimiento Normativo ISO 37301 / ISO 39001 • Auditoría y Control Preventivo"
            badge="CANAL 2 • INGENIERÍA & COMPLIANCE"
            badgeColor="bg-cyan-600 text-white"
            imgSrc={technicalCoverImg}
            renderMode={renderMode}
            onOpenModal={() => setSelectedCoverModal('technical')}
            onDownload={() => downloadImage(technicalCoverImg, 'BlindajeVial360_Documento_Tecnico.jpg')}
            onNavigateTarget={() => onNavigate?.('specifications')}
            navigateLabel="Ver Matriz de Especificaciones (54 Entregables)"
          >
            {/* Interactive Vector Overlay for Channel 2 */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#061833] via-[#032047] to-[#010D20] border border-cyan-500/30 flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Digital HUD Blueprint Grid */}
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top Tech Codes */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30">
                    HASH-SHA256: 8f9a4b...e21c
                  </span>
                </div>
                <div className="bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30">
                  EXP-SPEC-REV.2026.09
                </div>
              </div>

              {/* Center Content with Dual ISO Badges */}
              <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Emblem with HUD Ring */}
                  <div className="shrink-0 w-20 sm:w-28 h-24 sm:h-32">
                    <ShieldVectorEmblem variant="tech" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
                      Blindaje Vial 360
                    </h2>
                    <p className="text-base sm:text-2xl font-bold text-cyan-300 tracking-wide font-sans">
                      Documento Técnico
                    </p>
                    <div className="pt-1 text-xs sm:text-sm font-semibold text-slate-200">
                      <span className="text-white">Cumplimiento Normativo {isoBadges}</span>
                      <p className="text-cyan-200 text-xs mt-0.5">Auditoría y Control Preventivo Evidencial</p>
                    </div>
                  </div>
                </div>

                {/* Metallic ISO Shields */}
                <div className="hidden sm:flex flex-col gap-2 shrink-0">
                  <div className="bg-slate-900/95 border-2 border-cyan-400/80 rounded-xl p-2.5 text-center shadow-lg shadow-cyan-950/60 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono text-slate-400 leading-none">NORMA CHILENA</div>
                      <div className="text-xs font-black text-white font-mono">ISO 37301</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/95 border-2 border-cyan-400/80 rounded-xl p-2.5 text-center shadow-lg shadow-cyan-950/60 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono text-slate-400 leading-none">SEGURIDAD VIAL</div>
                      <div className="text-xs font-black text-white font-mono">ISO 39001</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Telemetry Footer */}
              <div className="relative z-10 pt-3 border-t border-cyan-400/20 flex items-center justify-between text-[10px] text-cyan-200/90 font-mono">
                <span>DICTAMEN SUSESO N.º 92064-2025</span>
                <span>•</span>
                <span>LEY 16.744 / ART. 154 N°5 DT</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">100% AUDITABLE</span>
              </div>
            </div>
          </ChannelCard>
        )}

        {/* CHANNEL 3: OFERTA DE SERVICIO (MATERIAL COMERCIAL) */}
        {(activeChannel === 'all' || activeChannel === 'commercial') && (
          <ChannelCard
            channelId="commercial"
            title="Oferta de Servicio"
            subtitle="Soluciones Integrales de Seguridad Vial • Reducción de Riesgos y Costos"
            badge="CANAL 3 • PROPUESTAS COMERCIALES B2B"
            badgeColor="bg-amber-600 text-white"
            imgSrc={commercialCoverImg}
            renderMode={renderMode}
            onOpenModal={() => setSelectedCoverModal('commercial')}
            onDownload={() => downloadImage(commercialCoverImg, 'BlindajeVial360_Oferta_Servicio.jpg')}
            onNavigateTarget={() => onNavigate?.('integral_service')}
            navigateLabel="Ver Cotizador B2B & Convenio Marco"
          >
            {/* Interactive Vector Overlay for Channel 3 */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#09224E] via-[#06183B] to-[#020B1C] border border-amber-500/30 flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Warm morning light sweep */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Slogan Top Banner */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>¡Su Seguridad, Nuestra Prioridad!</span>
                </div>

                <div className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700">
                  PROPUESTA B2B PERSONALIZADA
                </div>
              </div>

              {/* Center Content + Trust Badges */}
              <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Shield with Golden Ring */}
                  <div className="shrink-0 w-20 sm:w-28 h-24 sm:h-32">
                    <ShieldVectorEmblem variant="commercial" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
                      Blindaje Vial 360
                    </h2>
                    <p className="text-base sm:text-2xl italic font-serif text-amber-300 font-semibold">
                      Oferta de Servicio
                    </p>
                    <div className="pt-1 text-xs sm:text-sm font-medium text-slate-200">
                      <span>Soluciones Integrales de Seguridad Vial</span>
                      <p className="text-amber-200/90 text-xs font-semibold">Reducción Efectiva de Riesgos y Costos Operacionales</p>
                    </div>
                  </div>
                </div>

                {/* 4 Golden Commercial Badges */}
                <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
                  <div className="bg-slate-900/90 border border-amber-400/40 rounded-xl p-2 text-center flex flex-col items-center">
                    <Handshake className="w-5 h-5 text-amber-400 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-200">Convenio</span>
                  </div>
                  <div className="bg-slate-900/90 border border-amber-400/40 rounded-xl p-2 text-center flex flex-col items-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-200">Protección</span>
                  </div>
                  <div className="bg-slate-900/90 border border-amber-400/40 rounded-xl p-2 text-center flex flex-col items-center">
                    <DollarSign className="w-5 h-5 text-amber-300 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-200">Ahorro</span>
                  </div>
                  <div className="bg-slate-900/90 border border-amber-400/40 rounded-xl p-2 text-center flex flex-col items-center">
                    <Award className="w-5 h-5 text-blue-400 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-200">Garantía</span>
                  </div>
                </div>
              </div>

              {/* Commercial Footnote */}
              <div className="relative z-10 pt-3 border-t border-amber-400/20 flex items-center justify-between text-[10px] text-amber-200/90 font-mono">
                <span>CLIENTE: {clientCompany}</span>
                <span>•</span>
                <span>ACOMPAÑAMIENTO JURÍDICO & TÉCNICO</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">ROI POSITIVO &gt; 350%</span>
              </div>
            </div>
          </ChannelCard>
        )}

        {/* CHANNEL 4: PLATAFORMA DIGITAL */}
        {(activeChannel === 'all' || activeChannel === 'platform') && (
          <ChannelCard
            channelId="platform"
            title="Plataforma Digital"
            subtitle="Seguridad Operacional Inteligente • Monitoreo en Tiempo Real"
            badge="CANAL 4 • OPERACIONES EN VIVO & SAAS"
            badgeColor="bg-emerald-600 text-white"
            imgSrc={platformCoverImg}
            renderMode={renderMode}
            onOpenModal={() => setSelectedCoverModal('platform')}
            onDownload={() => downloadImage(platformCoverImg, 'BlindajeVial360_Plataforma_Digital.jpg')}
            onNavigateTarget={() => onNavigate?.('dashboard')}
            navigateLabel="Ir al Dashboard Operacional en Vivo"
          >
            {/* Interactive Vector Overlay for Channel 4 */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#051A3D] via-[#041533] to-[#010917] border border-emerald-500/30 flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Radar pulse background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-emerald-500/10 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/15 rounded-full pointer-events-none" />

              {/* Top Status HUD */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1 rounded-xl text-emerald-300">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span className="font-bold">TELEMETRÍA EN LÍNEA • GARITA ACTIVA</span>
                </div>

                <div className="bg-rose-950/80 border border-rose-600/50 text-rose-300 text-[10px] font-mono px-2.5 py-1 rounded-lg">
                  PROTOCOLO BLOQUEO INMEDIATO ACTIVO
                </div>
              </div>

              {/* Center Content + HUD telemetry widgets */}
              <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Digital Shield */}
                  <div className="shrink-0 w-20 sm:w-28 h-24 sm:h-32">
                    <ShieldVectorEmblem variant="digital" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
                      Blindaje Vial 360
                    </h2>
                    <p className="text-base sm:text-2xl font-bold text-emerald-400 tracking-wide font-sans">
                      Seguridad Operacional Inteligente
                    </p>
                    <div className="pt-1 text-xs sm:text-sm font-medium text-slate-200">
                      <span className="text-cyan-300 font-semibold">Monitoreo en Tiempo Real</span>
                      <p className="text-slate-300 text-xs">Plataforma Digital de Control Preventivo y Trazabilidad</p>
                    </div>
                  </div>
                </div>

                {/* HUD Live Widgets */}
                <div className="hidden sm:flex flex-col gap-2 shrink-0">
                  <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">ESTADO FLOTA</div>
                      <div className="text-xs font-bold text-emerald-300">45 CONDUCTORES OK</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-2.5 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">DISPOSITIVOS</div>
                      <div className="text-xs font-bold text-cyan-300">DRÄGER 6820 CALIBRADOS</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Footer */}
              <div className="relative z-10 pt-3 border-t border-emerald-400/20 flex items-center justify-between text-[10px] text-emerald-200/90 font-mono">
                <span>ALERTAS HEADS-UP EN TIEMPO REAL</span>
                <span>•</span>
                <span>AUDIT TRAIL BLOCKCHAIN HASH</span>
                <span>•</span>
                <span className="text-cyan-300 font-bold">DISPONIBILIDAD SLA 99.9%</span>
              </div>
            </div>
          </ChannelCard>
        )}
      </div>

      {/* Brand System Tokens & Consistency Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
              <span>Manual de Identidad & Design Tokens del Kit Visual 360</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Especificaciones de color, tipografía y elementos estructurales que garantizan coherencia institucional entre canales.
            </p>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                JSON.stringify(
                  {
                    primaryColor: '#0056B3',
                    deepNavy: '#0A1A3A',
                    chromeAccent: '#E2E8F0',
                    electricCyan: '#38BDF8',
                    emeraldCompliance: '#10B981',
                    goldenTrust: '#F59E0B',
                    typography: {
                      display: 'Montserrat, sans-serif',
                      body: 'Plus Jakarta Sans, sans-serif',
                      technical: 'JetBrains Mono, monospace'
                    }
                  },
                  null,
                  2
                ),
                'design-tokens'
              )
            }
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {copiedToken === 'design-tokens' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
            <span>{copiedToken === 'design-tokens' ? 'Tokens Copiados!' : 'Copiar JSON Tokens'}</span>
          </button>
        </div>

        {/* Color Palette Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Paleta Cromática Oficial
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <ColorSwatch
              name="Azul Blindaje"
              hex="#0056B3"
              description="Color institucional primario de alta confianza"
              bgClass="bg-[#0056B3]"
              onCopy={(hex) => copyToClipboard(hex, 'color-blue')}
              isCopied={copiedToken === 'color-blue'}
            />
            <ColorSwatch
              name="Azul Noche Profundo"
              hex="#0A1A3A"
              description="Fondo de carátulas y contraste ejecutivo"
              bgClass="bg-[#0A1A3A]"
              onCopy={(hex) => copyToClipboard(hex, 'color-navy')}
              isCopied={copiedToken === 'color-navy'}
            />
            <ColorSwatch
              name="Cromo Satinado"
              hex="#E2E8F0"
              description="Bisel metálico 3D del escudo de protección"
              bgClass="bg-slate-200 text-slate-900"
              onCopy={(hex) => copyToClipboard(hex, 'color-chrome')}
              isCopied={copiedToken === 'color-chrome'}
            />
            <ColorSwatch
              name="Cian Telemetría"
              hex="#38BDF8"
              description="Gráficos HUD de documentación técnica"
              bgClass="bg-sky-400 text-slate-950"
              onCopy={(hex) => copyToClipboard(hex, 'color-cyan')}
              isCopied={copiedToken === 'color-cyan'}
            />
            <ColorSwatch
              name="Verde Compliance"
              hex="#10B981"
              description="Certificación ISO 37301/39001 e idoneidad"
              bgClass="bg-emerald-500 text-slate-950"
              onCopy={(hex) => copyToClipboard(hex, 'color-emerald')}
              isCopied={copiedToken === 'color-emerald'}
            />
            <ColorSwatch
              name="Dorado Confianza"
              hex="#F59E0B"
              description="Horizonte al amanecer e insignias comerciales"
              bgClass="bg-amber-500 text-slate-950"
              onCopy={(hex) => copyToClipboard(hex, 'color-gold')}
              isCopied={copiedToken === 'color-gold'}
            />
          </div>
        </div>

        {/* Multi-Channel Consistency Matrix Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Matriz de Consistencia por Canal
          </h3>
          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Canal</th>
                  <th className="py-3 px-4">Audiencia Primaria</th>
                  <th className="py-3 px-4">Mensaje Clave</th>
                  <th className="py-3 px-4">Elemento Visual Distintivo</th>
                  <th className="py-3 px-4">Salida en Aplicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-blue-400" />
                    <span>Presentaciones Ejecutivas</span>
                  </td>
                  <td className="py-3 px-4">Directorios, Gerencias Generales, Inversionistas</td>
                  <td className="py-3 px-4 text-slate-200">Seguridad Operacional Inteligente & Control Preventivo</td>
                  <td className="py-3 px-4 text-blue-300">Carátula con autopista al amanecer + Escudo 3D</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-blue-400">Deck HD (12 Slides)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Documentación Técnica</span>
                  </td>
                  <td className="py-3 px-4">Auditores, Prevencionistas, Comités Paritarios, SUSESO</td>
                  <td className="py-3 px-4 text-slate-200">Cumplimiento Normativo ISO 37301/39001</td>
                  <td className="py-3 px-4 text-cyan-300">Overlay HUD digital, telemetría y sellos ISO</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-400">Matriz 54 Especificaciones</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Material Comercial</span>
                  </td>
                  <td className="py-3 px-4">Gerentes de Operaciones, Abastecimiento B2B</td>
                  <td className="py-3 px-4 text-slate-200">Soluciones Integrales & Reducción de Costos</td>
                  <td className="py-3 px-4 text-amber-300">Insignias doradas de confianza + Slogan de prioridad</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-amber-400">Oferta & Contratos B2B</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Plataforma Digital</span>
                  </td>
                  <td className="py-3 px-4">Operadores de Garita, Supervisores de Flota, Labs</td>
                  <td className="py-3 px-4 text-slate-200">Monitoreo en Tiempo Real & Bloqueo Preventivo</td>
                  <td className="py-3 px-4 text-emerald-300">HUD en vivo, estado de flota y cadena de custodia</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">Dashboard & Garita QR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fullscreen Cover Inspection Modal */}
      {selectedCoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Vista Ampliada • {selectedCoverModal.toUpperCase()} COVER
                </h3>
                <p className="text-xs text-slate-400">
                  Carátula oficial de alta resolución calibrada para impresión corporativa y difusión digital.
                </p>
              </div>
              <button
                onClick={() => setSelectedCoverModal(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src={
                  selectedCoverModal === 'executive'
                    ? executiveCoverImg
                    : selectedCoverModal === 'technical'
                    ? technicalCoverImg
                    : selectedCoverModal === 'commercial'
                    ? commercialCoverImg
                    : platformCoverImg
                }
                alt="Blindaje Vial 360 Cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Resolución: 3840 x 2160 (4K UHD) • Espacio de Color: sRGB
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const src =
                      selectedCoverModal === 'executive'
                        ? executiveCoverImg
                        : selectedCoverModal === 'technical'
                        ? technicalCoverImg
                        : selectedCoverModal === 'commercial'
                        ? commercialCoverImg
                        : platformCoverImg;
                    downloadImage(src, `BlindajeVial360_${selectedCoverModal}_Cover_HD.jpg`);
                  }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo HD</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// SUB-COMPONENTS
// =========================================================================

interface ChannelCardProps {
  channelId: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  imgSrc: string;
  renderMode: 'photo' | 'interactive';
  onOpenModal: () => void;
  onDownload: () => void;
  onNavigateTarget?: () => void;
  navigateLabel: string;
  children: React.ReactNode;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  title,
  subtitle,
  badge,
  badgeColor,
  imgSrc,
  renderMode,
  onOpenModal,
  onDownload,
  onNavigateTarget,
  navigateLabel,
  children
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
      {/* Top Header of Card */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
          <h3 className="text-lg font-bold text-white mt-1.5">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenModal}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
            title="Expandir en Pantalla Completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
            title="Descargar Carátula HD"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Display (Photo vs Interactive Vector) */}
      <div className="rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 group">
        {renderMode === 'photo' ? (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            {/* Quick Hover Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={onOpenModal}
                className="bg-white/90 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg hover:bg-white cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Vista Detallada</span>
              </button>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Bottom Integration Action */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
        <span className="text-[11px] font-mono text-slate-400">
          Sincronizado con el sistema
        </span>

        {onNavigateTarget && (
          <button
            onClick={onNavigateTarget}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition cursor-pointer"
          >
            <span>{navigateLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Official 3D Metallic Shield Vector Icon for interactive layer
const ShieldVectorEmblem: React.FC<{ variant?: 'executive' | 'tech' | 'commercial' | 'digital' }> = ({
  variant = 'executive'
}) => {
  const accentColor =
    variant === 'tech'
      ? '#38BDF8'
      : variant === 'commercial'
      ? '#F59E0B'
      : variant === 'digital'
      ? '#10B981'
      : '#2563EB';

  return (
    <svg viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
      <defs>
        {/* Chrome Metallic Bezel */}
        <linearGradient id="shieldChromeBezelVec" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="20%" stopColor="#CBD5E1" />
          <stop offset="45%" stopColor="#64748B" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="85%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Deep Blue Shield Center */}
        <linearGradient id="shieldBlueVec" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#0B2046" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
      </defs>

      {/* Outer Metallic Shield Bezel */}
      <path
        d="M80 6 L146 32 C146 112 110 162 80 184 C50 162 14 112 14 32 Z"
        fill="url(#shieldChromeBezelVec)"
        stroke="#94A3B8"
        strokeWidth="2"
      />

      {/* Inner Dark Rim */}
      <path
        d="M80 14 L138 37 C138 107 106 152 80 172 C54 152 22 107 22 37 Z"
        fill="#0F172A"
      />

      {/* Inner Blue Shield Field */}
      <path
        d="M80 18 L132 40 C132 102 102 145 80 164 C58 145 28 102 28 40 Z"
        fill="url(#shieldBlueVec)"
      />

      {/* Bus Silhouette in upper half */}
      <g transform="translate(48, 42)">
        <rect x="0" y="0" width="64" height="24" rx="4" fill="#FFFFFF" opacity="0.95" />
        <rect x="4" y="4" width="12" height="10" rx="1.5" fill="#0F172A" />
        <rect x="18" y="4" width="12" height="10" rx="1.5" fill="#0F172A" />
        <rect x="32" y="4" width="12" height="10" rx="1.5" fill="#0F172A" />
        <rect x="46" y="4" width="14" height="10" rx="1.5" fill="#0F172A" />
        {/* Bus Wheels */}
        <circle cx="16" cy="24" r="5" fill="#334155" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="48" cy="24" r="5" fill="#334155" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>

      {/* Breathalyzer / Safety Sensor in lower half */}
      <g transform="translate(68, 76)">
        {/* Sensor body */}
        <rect x="4" y="0" width="16" height="38" rx="4" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
        {/* Measuring display */}
        <rect x="7" y="6" width="10" height="12" rx="1.5" fill="#020617" />
        <rect x="8" y="8" width="8" height="2" fill={accentColor} />
        <rect x="8" y="12" width="5" height="2" fill="#10B981" />
        {/* Blow mouthpiece nozzle */}
        <rect x="9" y="-6" width="6" height="6" rx="1" fill="#94A3B8" />
        {/* Sensor wings / barrier handles */}
        <path d="M4 14 C-10 14 -16 26 -16 36 L-8 36 C-8 28 -2 20 4 20 Z" fill="#CBD5E1" />
        <path d="M20 14 C34 14 40 26 40 36 L32 36 C32 28 26 20 20 20 Z" fill="#CBD5E1" />
      </g>

      {/* Dynamic Accent Star / Glow */}
      <circle cx="80" cy="148" r="4" fill={accentColor} opacity="0.9" />
    </svg>
  );
};

interface ColorSwatchProps {
  name: string;
  hex: string;
  description: string;
  bgClass: string;
  onCopy: (hex: string) => void;
  isCopied: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  hex,
  description,
  bgClass,
  onCopy,
  isCopied
}) => {
  return (
    <div
      onClick={() => onCopy(hex)}
      className="bg-slate-950 border border-slate-800 rounded-2xl p-3 hover:border-slate-700 transition cursor-pointer group flex flex-col justify-between"
    >
      <div className={`w-full h-12 rounded-xl mb-2 flex items-center justify-center font-mono text-xs font-bold shadow-inner ${bgClass}`}>
        {isCopied ? '¡COPIADO!' : hex}
      </div>
      <div>
        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">
          {name}
        </div>
        <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
          {description}
        </div>
      </div>
    </div>
  );
};

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
