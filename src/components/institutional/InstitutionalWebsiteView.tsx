import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavView } from '../../types';
import { BrandLogo } from '../BrandLogo';
import {
  ShieldCheck,
  Award,
  Scale,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Truck,
  Microscope,
  FileSpreadsheet,
  Download,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  Globe,
  BookOpen,
  FileCheck2,
  Clock,
  Briefcase,
  AlertOctagon,
  Check,
  Send,
  HelpCircle,
  Hash,
  Fingerprint,
  Camera,
  ZoomIn,
  Activity,
  X
} from 'lucide-react';

import heroFleetImg from '../../assets/images/hero_fleet_chile_1789343813112.jpg';
import garitaSafetyImg from '../../assets/images/garita_safety_test_1789343824490.jpg';
import windshieldSealImg from '../../assets/images/sello_windshield_seal_1789343834621.jpg';
import labToxicologyImg from '../../assets/images/lab_toxicology_test_1789343844164.jpg';
import blindajeLogoImg from '../../assets/images/blindaje_vial_logo_1788658120391.jpg';
import { BlindajeVialFlowDiagram } from './BlindajeVialFlowDiagram';
import { GovernanceRolesDiagram } from './GovernanceRolesDiagram';
import { BlindajeVial360Logo } from './BlindajeVial360Logo';

interface InstitutionalWebsiteViewProps {
  onNavigate: (view: NavView) => void;
}

export const InstitutionalWebsiteView: React.FC<InstitutionalWebsiteViewProps> = ({ onNavigate }) => {
  const { tests, companies, drivers, currentCompany } = useApp();

  // Navigation sub-sections
  const [activeSection, setActiveSection] = useState<'inicio' | 'institucion' | 'servicios' | 'marco_legal' | 'verificador' | 'sedes' | 'cotizador' | 'contacto'>('inicio');
  const [methodologyTab, setMethodologyTab] = useState<'flujo' | 'escudo3d' | 'gobernanza' | 'marca360'>('flujo');

  // Verifier State
  const [searchCode, setSearchCode] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Quote Simulator State
  const [fleetType, setFleetType] = useState<'buses_interurbanos' | 'camiones_carga' | 'mineria_personal' | 'carga_peligrosa'>('buses_interurbanos');
  const [unitsCount, setUnitsCount] = useState<number>(35);
  const [controlFrequency, setControlFrequency] = useState<'diario_100' | 'aleatorio_suseso' | 'semanal'>('aleatorio_suseso');
  const [needsAssureSaliva, setNeedsAssureSaliva] = useState<boolean>(true);

  // Contact Form State
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    nombre: '',
    empresa: '',
    rut: '',
    email: '',
    telefono: '',
    region: 'Región Metropolitana',
    mensaje: ''
  });

  // Modal Lightbox for photos
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    normativa: string;
  } | null>(null);

  // Calculate quick simulator values
  const getEstimatedCost = () => {
    let basePricePerVehicle = 28000; // CLP per month
    if (fleetType === 'mineria_personal') basePricePerVehicle = 45000;
    if (fleetType === 'carga_peligrosa') basePricePerVehicle = 39000;
    if (fleetType === 'buses_interurbanos') basePricePerVehicle = 32000;

    let frequencyMultiplier = 1;
    if (controlFrequency === 'diario_100') frequencyMultiplier = 1.6;
    if (controlFrequency === 'semanal') frequencyMultiplier = 0.75;

    const salivaCost = needsAssureSaliva ? unitsCount * 12500 : 0;
    const monthlyTotal = Math.round((unitsCount * basePricePerVehicle * frequencyMultiplier) + salivaCost);
    const estimatedSavings = Math.round(monthlyTotal * 3.8); // Projected saving vs labor lawsuit or route sanction

    return { monthlyTotal, estimatedSavings };
  };

  const { monthlyTotal, estimatedSavings } = getEstimatedCost();

  // Search handler in public verifier
  const handleSearchCode = (codeToSearch?: string) => {
    const query = (codeToSearch || searchCode).trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const found = tests.find(
      (t) =>
        t.code.toUpperCase() === query ||
        t.id.toUpperCase() === query ||
        t.driverRut.replace(/\./g, '').toUpperCase() === query.replace(/\./g, '') ||
        (t.vehiclePlate && t.vehiclePlate.toUpperCase() === query)
    );

    if (found) {
      setVerificationResult(found);
    } else {
      setVerificationResult(null);
    }
  };

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP OFFICIAL CHILEAN BANNER */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-1.5 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-600" />
              REPÚBLICA DE CHILE
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden md:inline">Estándar de Seguridad Operacional y Control Toxicológico Laboral</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-blue-400 font-mono hidden lg:inline">SUSESO • DT • LEY 18.290 • LEY 16.744</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-emerald-400" />
              Mesa Garitas 24/7: +56 2 2899 7400
            </span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-md transition shadow-xs cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Intranet / Sistema Operacional</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN INSTITUTIONAL HEADER & NAVIGATION */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <BrandLogo size="md" showText={true} />
            <div className="hidden sm:block border-l border-slate-800 pl-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                Instituto de Seguridad Operacional
              </p>
              <p className="text-[11px] text-slate-400">
                Acreditación y Control en Transporte
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollTo('hero')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollTo('quienes-somos')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              La Institución
            </button>
            <button
              onClick={() => scrollTo('metodologia-360')}
              className="px-3 py-1.5 rounded-lg hover:bg-blue-950/60 hover:text-blue-300 text-blue-400 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Metodología 360°</span>
            </button>
            <button
              onClick={() => scrollTo('servicios')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              Servicios & Programas
            </button>
            <button
              onClick={() => scrollTo('marco-legal')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              Marco Legal
            </button>
            <button
              onClick={() => scrollTo('fotogaleria')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer flex items-center gap-1 text-slate-300"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>Galería Operacional</span>
            </button>
            <button
              onClick={() => scrollTo('verificador')}
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/60 hover:bg-blue-900/60 transition cursor-pointer flex items-center gap-1.5 font-semibold"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              Verificador Actas QR
            </button>
            <button
              onClick={() => scrollTo('sedes')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              Garitas & Sedes
            </button>
            <button
              onClick={() => scrollTo('cotizador')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer text-amber-300"
            >
              Cotizador
            </button>
            <button
              onClick={() => scrollTo('contacto')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              Contacto
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar a la Intranet</span>
              <span className="sm:hidden">Intranet</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 px-4 overflow-hidden border-b border-slate-800">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          {/* Institutional Accreditation Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-blue-300 text-xs shadow-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Organismo Oficial de Acreditación y Control en Transporte</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono">ISO 37301 / SUSESO 92.064</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Cero Alcohol, Cero Drogas en las Rutas de Chile
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Blindamos integralmente las operaciones de buses interurbanos, camiones de carga pesada y flotas mineras mediante tecnología forense evidencial, actas criptográficas inmutables y estricto apego a la <strong className="text-white">Ley 18.290</strong>, <strong className="text-white">Ley 16.744</strong> y los dictámenes de la <strong className="text-white">Superintendencia de Seguridad Social (SUSESO)</strong> y la <strong className="text-white">Dirección del Trabajo</strong>.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => scrollTo('verificador')}
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition text-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Verificar Acta o Certificado QR</span>
            </button>

            <button
              onClick={() => scrollTo('cotizador')}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl transition text-sm font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Cotizar Programa para Mi Empresa</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/40 rounded-xl transition text-sm font-semibold cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Ingreso Intranet Clientes</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">+185.000</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Exámenes Certificados</p>
              <p className="text-[11px] text-slate-400">Firmados con SHA-256 e inmutables</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">99.8%</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Aptitud en Cabina</p>
              <p className="text-[11px] text-slate-400">Tasa de sobriedad comprobada en ruta</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">0 Fallos</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Demandas Perdidas</p>
              <p className="text-[11px] text-slate-400">100% blindaje probatorio ante DT y Juzgados</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">16 Regiones</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Presencia Nacional</p>
              <p className="text-[11px] text-slate-400">Garitas en terminales y faenas mineras</p>
            </div>
          </div>

          {/* Hero Photographic Banner */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div
              onClick={() => setSelectedImage({
                src: heroFleetImg,
                title: 'Flotas Interurbanas y Mineras Bajo Cobertura Nacional',
                subtitle: 'Terminal Central Santiago y Rutas Cordilleranas de Chile',
                badge: 'COBERTURA 16 REGIONES',
                description: 'Supervisión en tiempo real de buses interurbanos, camiones articulados de carga pesada y flotas de transporte de personal minero en faena. Cada salida cuenta con test evidencial previo con 0,00 g/l de alcohol y screening salival de drogas.',
                normativa: 'Ley 18.290 Art. 110-111 • Ley 16.744 • Dictamen SUSESO 92.064'
              })}
              className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group cursor-pointer"
            >
              <img
                src={heroFleetImg}
                alt="Flota de transporte interurbano y de carga pesada en Chile bajo monitoreo de Blindaje Vial SpA"
                className="w-full h-64 sm:h-80 md:h-[420px] object-cover object-center transform group-hover:scale-102 transition duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-emerald-400 text-xs font-semibold border border-emerald-500/40 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Sistema Operacional Activo 24/7
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-blue-300 text-xs font-medium border border-blue-500/30 shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    Rutas de Chile • Andes & Carreteras Troncales
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-slate-300 text-[11px] font-medium border border-slate-700 hover:text-white transition">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspeccionar Foto</span>
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded">
                      ESTÁNDAR OPERACIONAL
                    </span>
                    <span className="text-slate-300 text-xs font-mono">
                      +1.450 Buses y Camiones Blindados
                    </span>
                  </div>
                  <p className="text-white font-bold text-base sm:text-xl drop-shadow-md">
                    Control Integral en Terminales Rodoviarios y Faenas Mineras
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm drop-shadow-sm max-w-2xl mt-0.5">
                    Garantizamos que ningún vehículo salga a ruta sin validación metrológica y toxicológica previa.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-blue-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>Ver Detalles Técnicos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LA INSTITUCIÓN: QUIÉNES SOMOS & PROPÓSITO */}
      <section id="quienes-somos" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Rol Institucional en la Seguridad de Chile</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Un organismo técnico creado para salvar vidas y proteger a las empresas
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              <strong>Blindaje Vial SpA</strong> nace como la respuesta técnica, científica y jurídica a una necesidad crítica de la industria chilena: erradicar de forma definitiva los riesgos de conducción bajo efectos del alcohol y sustancias estupefacientes en el transporte interurbano, minero y de carga pesada.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              Combinamos tres disciplinas fundamentales: <strong>metrología forense de campo</strong> (etilómetros evidenciales con celda de combustible y kits salivales no invasivos Assure Tech), <strong>tecnología de registro inalterable</strong> (hash SHA-256 e integración con sistemas de recursos humanos) y <strong>blindaje jurídico-laboral</strong> de acuerdo con el Reglamento Interno (RIOHS) y las directrices de la Dirección del Trabajo y la SUSESO.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="font-bold text-white text-sm">Respeto a la Dignidad Humana</h4>
                <p className="text-xs text-slate-400">
                  Cumplimiento estricto del Art. 154 bis del Código del Trabajo. Muestras no invasivas en saliva y alcohotest en aire espirado.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="font-bold text-white text-sm">Certeza Científica con Doble Barrera</h4>
                <p className="text-xs text-slate-400">
                  Tamizaje rápido in situ más derivación con cadena de custodia lacrada a laboratorios clínicos para confirmación cromatográfica GC/MS.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="font-bold text-white text-sm">Inmutabilidad Criptográfica</h4>
                <p className="text-xs text-slate-400">
                  Cada acta emitida recibe un hash digital único y un código QR verificable que imposibilita la alteración posterior de los resultados.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                  04
                </div>
                <h4 className="font-bold text-white text-sm">Deber de Cuidado del Empleador</h4>
                <p className="text-xs text-slate-400">
                  Respaldo formal de la responsabilidad legal de la empresa conforme a la Ley 16.744 ante las Mutualidades (ACHS, Mutual, IST, ISL).
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Real Garita Control Booth Photo */}
            <div
              onClick={() => setSelectedImage({
                src: garitaSafetyImg,
                title: 'Puntos de Control y Garitas de Despacho 24/7',
                subtitle: 'Terminales Rodoviarios y Faenas Mineras en Todo Chile',
                badge: 'OPERADOR CERTIFICADO',
                description: 'Inspección previa a la conducción por operadora técnica certificada. El procedimiento utiliza etilómetros evidenciales con boquillas desechables selladas y tamizaje de saliva en 5 minutos, respetando íntegramente la dignidad del trabajador y el Dictamen SUSESO 92.064.',
                normativa: 'Código del Trabajo Art. 154 bis • Dictamen SUSESO 92.064 • OIML R 126'
              })}
              className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl group cursor-pointer"
            >
              <img
                src={garitaSafetyImg}
                alt="Operadora técnica certificada realizando examen evidencial de alcohotest en garita de terminal chileno"
                className="w-full h-56 object-cover object-center group-hover:scale-103 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-slate-300 font-medium flex items-center gap-1 border border-slate-700">
                <ZoomIn className="w-3 h-3 text-blue-400" />
                <span>Ampliar</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Control Evidencial en Garita de Salida</span>
                </div>
                <p className="text-white text-xs font-medium leading-tight">
                  Técnica certificada aplicando etilómetro calibrado según Dictamen SUSESO 92.064
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">Consejo Asesor y Acreditaciones</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVO 2026
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Homologado SUSESO:</strong> Alineado con el Dictamen N° 92.064 y sus 8 tomos de procedimiento técnico-operativo.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dirección del Trabajo:</strong> Protocolos de aleatoriedad e impersonalidad validados ante inspecciones laborales territoriales.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Metrología Trazable:</strong> Etilómetros con certificado de calibración vigente según estándares OIML R 126.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Certificación de Insumos:</strong> Dispositivos salivales aprobados por FDA y marcaje CE con validación ISP.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Integración con Mutualidades:</strong> Informes y alertas con formato homologado para ACHS, Mutual de Seguridad, IST e ISL.
                </span>
              </li>
            </ul>

            <div className="p-3.5 bg-blue-950/40 border border-blue-900 rounded-xl text-xs space-y-1">
              <p className="font-bold text-blue-300">Sello de Calidad "Ruta Segura Chile"</p>
              <p className="text-slate-400 text-[11px]">
                Las empresas acreditadas reciben distintivos físicos con chip QR para su flota y son incorporadas al Registro Público de Operadores Seguros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 4.5 METODOLOGÍA OFICIAL & IDENTIDAD OPERACIONAL BLINDAJE VIAL 360° */}
      <section id="metodologia-360" className="py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ESTÁNDAR OPERACIONAL INTEGRAL</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-mono">BLINDAJE VIAL 360°</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Metodología, Flujo Operacional & Marca
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Conozca el circuito de control de extremo a extremo: desde el sorteo criptográfico imparcial en garita hasta la fiscalización con código QR en ruta y confirmación en laboratorios forenses.
            </p>

            {/* Methodology Tab Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <button
                onClick={() => setMethodologyTab('flujo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  methodologyTab === 'flujo'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span>1. Flujo de Control Blindaje Vial®</span>
              </button>

              <button
                onClick={() => setMethodologyTab('escudo3d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  methodologyTab === 'escudo3d'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2. Insignia 3D y Sello en Ruta</span>
              </button>

              <button
                onClick={() => setMethodologyTab('gobernanza')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  methodologyTab === 'gobernanza'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>3. Arquitectura de Gobernanza & Roles</span>
              </button>

              <button
                onClick={() => setMethodologyTab('marca360')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  methodologyTab === 'marca360'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>4. Identidad de Marca 360°</span>
              </button>
            </div>
          </div>

          {/* TAB 1: FLUJO DE CONTROL BLINDAJE VIAL (Based on Copilot image) */}
          {methodologyTab === 'flujo' && (
            <BlindajeVialFlowDiagram onNavigate={onNavigate} />
          )}

          {/* TAB 2: INSIGNIA 3D Y SELLO EN RUTA (Based on 3D Shield highway image) */}
          {methodologyTab === 'escudo3d' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/80 border border-blue-700/80 text-blue-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>HERÁLDICA Y GARANTÍA EN RUTA</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Insignia Oficial Blindaje Vial en Carreteras de Chile
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  El escudo tridimensional de <strong>Blindaje Vial</strong> es el sello de garantía visible que respalda a flotas interurbanas y de faenas mineras frente a pasajeros, mandantes y autoridades viales.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Bisel Metálico Cromado de Doble Protección
                    </span>
                    <p className="text-xs text-slate-400">
                      Representa la solidez técnica y jurídica infranqueable ante comparendos laborales y demandas de terceros por accidentes viales.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Núcleo Azul Zafiro & Checkmark de Conformidad
                    </span>
                    <p className="text-xs text-slate-400">
                      Certifica que el conductor fue sometido a prueba de alcohotest con resultado 0,00 g/l y test salival de 6 drogas negativo en garita.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Presencia en Rutas Troncales y Faenas
                    </span>
                    <p className="text-xs text-slate-400">
                      Homologado bajo la Ley 18.290, Ley 16.744 y los 8 tomos del Dictamen SUSESO 92.064 para el transporte seguro en Chile.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => scrollTo('verificador')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verificar un Vehículo Blindado</span>
                  </button>
                  <button
                    onClick={() => onNavigate('tests')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <span>Ir a Registro de Garita</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3D Shield Interactive Image Container */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div
                  onClick={() => setSelectedImage({
                    src: blindajeLogoImg,
                    title: 'Insignia Oficial Blindaje Vial 360° en Carretera',
                    subtitle: 'Sello de Acreditación Heráldico de Tolerancia Cero en Chile',
                    badge: 'INSIGNIA HERÁLDICA OFICIAL',
                    description: 'Escudo protector de alta resistencia en acero cromado pulido y núcleo azul zafiro con el checkmark de verificación plena. Representa el estándar máximo de seguridad vial aplicado en carreteras, terminales y faenas mineras en las 16 regiones del país.',
                    normativa: 'Ley 18.290 Art. 110-111 • Dictamen SUSESO 92.064 • Certificación ISO 37301'
                  })}
                  className="relative rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl group cursor-pointer max-w-md w-full bg-slate-950"
                >
                  <img
                    src={blindajeLogoImg}
                    alt="Insignia oficial Blindaje Vial con escudo 3D en autopista de Chile"
                    className="w-full h-80 sm:h-96 object-cover object-center transform group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white font-mono font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>EMBLEMA OFICIAL DE SEGURIDAD</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white border border-slate-700">
                    <ZoomIn className="w-4 h-4 text-blue-400" />
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase block">
                      TOLERANCIA CERO CERTIFICADA
                    </span>
                    <h4 className="text-white font-bold text-base sm:text-lg">
                      Blindaje Vial® • Chile
                    </h4>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Haz clic para ampliar la insignia oficial en alta resolución
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOBERNANZA & ARQUITECTURA DE ROLES (Based on mermaid diagram) */}
          {methodologyTab === 'gobernanza' && (
            <GovernanceRolesDiagram onNavigate={onNavigate} />
          )}

          {/* TAB 4: IDENTIDAD DE MARCA 360° (Based on Gemini vector logo) */}
          {methodologyTab === 'marca360' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Logo Centerpiece */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
                  <BlindajeVial360Logo size="2xl" showText={true} animated={true} />
                  <p className="text-[11px] text-slate-400 font-mono mt-4 text-center">
                    Isotipo y Logotipo Oficial Registrado • Blindaje Vial 360° SpA
                  </p>
                </div>

                {/* Conceptual Breakdown */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/70 border border-amber-800 text-amber-300 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>MANUAL DE IDENTIDAD CORPORATIVA</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Simbología del Logo Blindaje Vial 360°
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Nuestra identidad visual condensa la unión entre la ingeniería de transporte, la ciencia toxicológica y la tecnología inmutable de datos:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Autopista Orbital 360°
                      </span>
                      <p className="text-[11px] text-slate-400">
                        La carretera que rodea y atraviesa el escudo simboliza la protección total y continua durante las 24 horas del día, en los 360 grados de la operación de transporte.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        Trazas de Circuitos Digitales
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Los microchips y líneas de circuito representan la inmutabilidad de los datos, el cálculo de hash criptográfico SHA-256 y la trazabilidad telemática en tiempo real.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                        Escudo de Acero & Solidez
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Blindaje jurídico-laboral ante la Dirección del Trabajo y tribunales laborales, respaldando el deber de cuidado legal del empleador.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Arco Dorado de Precisión
                      </span>
                      <p className="text-[11px] text-slate-400">
                        El acento curvado dorado en el número 360 evoca la precisión metrológica evidencial de 0,00 g/l y la excelencia certificada ISO 37301.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. SERVICIOS Y PROGRAMAS INSTITUCIONALES */}
      <section id="servicios" className="py-16 px-4 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Soluciones Operacionales Integrales</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Programas Institucionales para Empresas de Transporte
            </h2>
            <p className="text-sm text-slate-300">
              Diseñados a la medida de la faena minera, terminales de buses interurbanos y patios de maniobras de carga pesada en todo Chile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition duration-300 overflow-hidden flex flex-col">
              <div
                onClick={() => setSelectedImage({
                  src: windshieldSealImg,
                  title: 'Distintivo Inviolable con QR "Flota Blindada"',
                  subtitle: 'Adhesivo Holográfico para Parabrisas de Buses y Camiones',
                  badge: 'SELLO OFICIAL 2026',
                  description: 'Sello físico con micro-cortes de seguridad colocado en el ángulo inferior del parabrisas. Cada pasajero, inspector del Ministerio de Transportes o Carabineros puede escanear el QR para auditar la vigencia del examen de alcohol y drogas del conductor del turno.',
                  normativa: 'ISO 37301 • Dictamen SUSESO 92.064 • Validez en Ruta'
                })}
                className="relative h-44 w-full overflow-hidden bg-slate-950 border-b border-slate-800 group/img cursor-pointer"
              >
                <img
                  src={windshieldSealImg}
                  alt="Sello holográfico de parabrisas Flota Blindada Chile con código QR dinámico"
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-blue-600/90 backdrop-blur-xs text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-md">
                  SELLO FÍSICO QR
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-semibold text-[11px] text-blue-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Parabrisas Certificado
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <ZoomIn className="w-3 h-3 text-blue-400" />
                    Inspeccionar
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Programa "Sello Flota Blindada"</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  Acreditación institucional de la flota completa. Entrega de sellos inviolables de parabrisas con código QR dinámico que certifica ante pasajeros, clientes y fiscalizadores que el conductor inició su turno con alcohotest 0.00 y test de drogas negativo.
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sello físico QR para parabrisas de bus/camión</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verificación pública en línea para pasajeros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Distintivo de prestigio en licitaciones de transporte</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Metrología y Alcohotest Evidencial</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suministro, calibración y trazabilidad de etilómetros con sensor electroquímico de celda de combustible. Gestión de certificados con vigencia de 6 meses y bitácora metrológica inalterable para validez en tribunales.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Equipos Dräger / Lifeloc / AlcoQuant certificados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Alertas automáticas de vencimiento de calibración</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bloqueo de despacho si el equipo no está calibrado</span>
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Test Salival Rápido (Fluido Oral)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detección simultánea de 5 familias de drogas (Cocaína, Marihuana THC, Anfetaminas, Metanfetaminas y Opiáceos) en 5 a 8 minutos. Procedimiento no invasivo que resguarda la privacidad física del trabajador según el Código del Trabajo.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kits Assure Tech de fluido oral certificados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Detección de consumo reciente en turno activo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sin necesidad de baños supervisados ni muestras de orina</span>
                </li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition duration-300 overflow-hidden flex flex-col">
              <div
                onClick={() => setSelectedImage({
                  src: labToxicologyImg,
                  title: 'Laboratorio de Toxicología Forense & Confirmación GC/MS',
                  subtitle: 'Laboratorio Clínico Acreditado para Respaldo Probatorio',
                  badge: 'CONFIRMACIÓN GC-MS',
                  description: 'Ante cualquier resultado presuntivo no negativo en tamizaje salival, la muestra es precintada bajo cadena de custodia lacrada y enviada a laboratorio clínico para confirmación por Cromatografía de Gases acoplada a Espectrometría de Masas (GC/MS).',
                  normativa: 'Circular SUSESO • Cadena de Custodia Legal • Tribunales del Trabajo'
                })}
                className="relative h-44 w-full overflow-hidden bg-slate-950 border-b border-slate-800 group/img cursor-pointer"
              >
                <img
                  src={labToxicologyImg}
                  alt="Laboratorio clínico de toxicología forense con cromatografía de gases y espectrometría de masas"
                  className="w-full h-full object-cover object-center group-hover/img:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-indigo-600/90 backdrop-blur-xs text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-md">
                  LABORATORIO CLÍNICO
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-semibold text-[11px] text-indigo-300 flex items-center gap-1">
                    <Microscope className="w-3.5 h-3.5" />
                    Cromatografía Forense
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <ZoomIn className="w-3 h-3 text-indigo-400" />
                    Inspeccionar
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Cadena de Custodia & Confirmación GC/MS</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  Protocolo estricto ante casos presuntivos positivos. Sellado con precinto de seguridad inviolable, acta tripartita con testigo y derivación a laboratorios clínicos acreditados para confirmación cromatográfica de alta especificidad.
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Cadena de custodia homologada según Circular SUSESO</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Laboratorios clínicos con espectrometría de masas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Garantía de contraprueba para el trabajador</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Blindaje RIOHS y Defensa Laboral</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asesoría legal experta para incorporar el protocolo de alcohol y drogas al Reglamento Interno de Orden, Higiene y Seguridad (RIOHS), remitido a la Dirección del Trabajo y SEREMI de Salud, garantizando facultades de suspensión preventiva del turno.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Redacción de cláusulas de causal de despido sin indemnización</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protocolo de relevo inmediato del conductor en garita</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Blindaje ante reclamos de vulneración de derechos</span>
                </li>
              </ul>
            </div>

            {/* Service 6 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Capacitación SENCE y Bienestar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Talleres teórico-prácticos y módulos online para conductores y personal de prevención. Educación sobre fatiga, efectos de fármacos comunes, ventanas de detección y fomento de la cultura preventiva en ruta.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certificación SENCE para conductores profesionales</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Guías de descanso y gestión del sueño en turnos 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Formación de operadores certificados de alcohotest</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MARCO REGULATORIO CHILENO */}
      <section id="marco-legal" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800">
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>Certeza Jurídica en Chile</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Marco Legal y Normativo Obligatorio
            </h2>
            <p className="text-sm text-slate-300">
              Toda la arquitectura técnica y operacional de Blindaje Vial SpA se fundamenta en las leyes y dictámenes vigentes de la República de Chile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Law 1 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  LEY N° 18.290
                </span>
                <span className="text-[10px] text-slate-400">Ley de Tránsito</span>
              </div>
              <h4 className="font-bold text-white text-sm">Artículos 110 y 111 (Tolerancia Cero)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prohibición absoluta de conducir vehículos motorizados bajo la influencia del alcohol o en estado de ebriedad, así como bajo los efectos de sustancias estupefacientes o psicotrópicas. En transporte profesional de pasajeros y carga rige estándar 0,00 g/l.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Sanción: Pérdida inmediata de licencia, retención del vehículo y responsabilidades penales.
              </div>
            </div>

            {/* Law 2 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  LEY N° 16.744
                </span>
                <span className="text-[10px] text-slate-400">Seguridad y Salud Laboral</span>
              </div>
              <h4 className="font-bold text-white text-sm">Deber de Protección del Empleador (Art. 184)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                El empleador está obligado a tomar todas las medidas necesarias para proteger eficazmente la vida y salud de los trabajadores. Despachar un vehículo sin control toxicológico previo constituye negligencia inexcusable ante accidentes de trayecto o de trabajo.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Cobertura: ACHS, Mutual de Seguridad, IST, ISL.
              </div>
            </div>

            {/* Law 3 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  DICTAMEN 92.064
                </span>
                <span className="text-[10px] text-slate-400">SUSESO</span>
              </div>
              <h4 className="font-bold text-white text-sm">Procedimientos Técnicos de Control</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Establece los requisitos mínimos de validez técnica para los programas de alcohol y drogas: aleatoriedad mediante software auditado, consentimiento informado, cadena de custodia con contramuestra y confidencialidad médica de los resultados.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Documento de referencia: Manual Operativo en 8 Tomos.
              </div>
            </div>

            {/* Law 4 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                  CÓDIGO DEL TRABAJO
                </span>
                <span className="text-[10px] text-slate-400">Dirección del Trabajo</span>
              </div>
              <h4 className="font-bold text-white text-sm">Art. 154 bis (Dignidad y Privacidad)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Los mecanismos de control deben aplicarse a través de medios impersonales y automáticos, respetando la dignidad y derechos fundamentales del trabajador. El test salival Assure Tech y el etilómetro evidencial cumplen este mandato al 100%.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Resguardo: Prohíbe revisiones corporales humillantes o toma de orina invasiva.
              </div>
            </div>

            {/* Law 5 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                  LEY KARIN N° 21.643
                </span>
                <span className="text-[10px] text-slate-400">Prevención del Acoso</span>
              </div>
              <h4 className="font-bold text-white text-sm">Trato Digno y No Arbitrario</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Garantiza que la selección de conductores para el testeo toxicológico sea completamente aleatoria mediante algoritmos matemáticos criptográficos, evitando que supervisores utilicen los controles como herramienta de hostigamiento o represalia.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Auditoría: Bitácora de sorteo inmodificable con firma digital.
              </div>
            </div>

            {/* Law 6 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  LEY N° 19.799
                </span>
                <span className="text-[10px] text-slate-400">Firma Electrónica</span>
              </div>
              <h4 className="font-bold text-white text-sm">Validez Jurídica de Documentos Digitales</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Las actas emitidas por la plataforma de Blindaje Vial SpA cuentan con valor probatorio equivalente a un instrumento público firmado en papel, gracias a la incorporación de sello de tiempo RFC 3161 y hash SHA-256 inalterable.
              </p>
              <div className="pt-2 text-[11px] text-slate-300 font-medium">
                Tribunales: Admisión inmediata en comparendos de la Inspección del Trabajo.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 FOTOGALERÍA: OPERACIONES Y EVIDENCIA EN TERRENO */}
      <section id="fotogaleria" className="py-16 px-4 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>Registro Fotográfico Operacional</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Blindaje Operacional en Terreno
            </h2>
            <p className="text-sm text-slate-300">
              Imágenes reales de nuestros operativos en garitas de salida, adhesión de sellos holográficos en cabina y confirmación en laboratorios forenses en todo Chile. Haz clic en cualquier imagen para inspeccionar detalles y normativa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {/* Gallery Item 1: Flota */}
            <div
              onClick={() => setSelectedImage({
                src: heroFleetImg,
                title: 'Flotas Interurbanas y de Carga Pesada en Chile',
                subtitle: 'Terminal Central Santiago y Rutas Mineras del Norte',
                badge: 'FLOTA CERTIFICADA',
                description: 'Buses y camiones articulados con certificación de salida en regla. El sistema asegura que ningún conductor inicie trayecto sin haber superado el examen de alcohotest con 0,00 g/l y test de drogas en fluido oral negativo.',
                normativa: 'Ley 18.290 Art. 110 • Ley 16.744 Deber de Protección • ISO 37301'
              })}
              className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={heroFleetImg}
                  alt="Flotas interurbanas y de carga pesada en Chile"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-blue-600/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                  1. RUTA & FLOTA
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition">
                    Flotas Interurbanas y Faenas
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Supervisión en terminales rodoviarios y accesos cordilleranos mineros en las 16 regiones.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar fotografía</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Gallery Item 2: Garita */}
            <div
              onClick={() => setSelectedImage({
                src: garitaSafetyImg,
                title: 'Control Evidencial en Garitas 24/7',
                subtitle: 'Procedimiento Técnico con Operadora Certificada',
                badge: 'DICTAMEN SUSESO 92.064',
                description: 'Inspección previa a la conducción realizada por personal calificado con boquillas desechables selladas y etilómetro evidencial calibrado con trazabilidad metrológica vigente. Proceso no invasivo y respetuoso de la dignidad del trabajador.',
                normativa: 'Código del Trabajo Art. 154 bis • OIML R 126 • Dictamen SUSESO 92.064'
              })}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={garitaSafetyImg}
                  alt="Control de alcohotest en garita con técnico certificado"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                  2. GARITA 24/7
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                    Testeo Evidencial en Cabina
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Operación con etilómetros homologados y kits salivales rápidos de alta sensibilidad.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar fotografía</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Gallery Item 3: Sello Parabrisas */}
            <div
              onClick={() => setSelectedImage({
                src: windshieldSealImg,
                title: 'Sello Holográfico de Parabrisas con QR Inmutable',
                subtitle: 'Certificación Visible para Pasajeros y Carabineros',
                badge: 'TOLERANCIA CERO',
                description: 'Distintivo adhesivo inviolable con cortes de destrucción que se coloca en el parabrisas delantero. Al escanear el QR, cualquier persona puede consultar la fecha, hora, alcohotest 0.00 y folio del conductor asignado a la máquina.',
                normativa: 'Ley 19.799 Firma Digital • Código QR RFC 3161 • Verificación Pública'
              })}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={windshieldSealImg}
                  alt="Sello holográfico de parabrisas con código QR"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-amber-600/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                  3. SELLO FÍSICO
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                    Sello Inviolable con QR
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Holograma con QR para auditoría inmediata de pasajeros y fiscalización en ruta.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar fotografía</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Gallery Item 4: Laboratorio */}
            <div
              onClick={() => setSelectedImage({
                src: labToxicologyImg,
                title: 'Laboratorio Toxicológico y Confirmación GC-MS',
                subtitle: 'Confirmación Cromatográfica con Cadena de Custodia',
                badge: 'PRUEBA PERICIAL GC-MS',
                description: 'Laboratorio clínico especializado para la confirmación de segundas muestras y contramuestras mediante cromatografía de gases y espectrometría de masas. Otorga valor probatorio pleno e inimpugnable ante los Tribunales del Trabajo.',
                normativa: 'Circular SUSESO Procedimientos Clínicos • ISO/IEC 17025 • Código Procesal'
              })}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={labToxicologyImg}
                  alt="Laboratorio clínico de toxicología forense"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-indigo-600/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                  4. LABORATORIO GC-MS
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                    Toxicología de Alta Precisión
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Confirmación cromatográfica de contramuestras con trazabilidad médica y judicial.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar fotografía</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* Gallery Item 5: Escudo e Insignia Oficial Blindaje Vial */}
            <div
              onClick={() => setSelectedImage({
                src: blindajeLogoImg,
                title: 'Insignia Oficial Blindaje Vial 360° en Carreteras',
                subtitle: 'Sello de Acreditación Heráldico de Tolerancia Cero en Chile',
                badge: 'INSIGNIA HERÁLDICA OFICIAL',
                description: 'Escudo protector de alta resistencia en acero cromado pulido y núcleo azul zafiro con el checkmark de verificación plena. Representa el estándar máximo de seguridad vial aplicado en carreteras, terminales y faenas mineras en las 16 regiones del país.',
                normativa: 'Ley 18.290 Art. 110-111 • Dictamen SUSESO 92.064 • Certificación ISO 37301'
              })}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={blindajeLogoImg}
                  alt="Insignia oficial Blindaje Vial en carretera de Chile"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-cyan-600/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                  5. INSIGNIA OFICIAL
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg text-slate-300 group-hover:text-white">
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                    Insignia Oficial en Ruta
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Escudo 3D de alta resistencia y sello de garantía de tolerancia cero.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar fotografía</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFICADOR PÚBLICO DE ACTAS & CÓDIGOS QR (INTERACTIVE TOOL) */}
      <section id="verificador" className="py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <Search className="w-3.5 h-3.5" />
              <span>Portal de Transparencia y Consulta Pública</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Verificador Oficial de Actas de Control (QR)
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Herramienta pública para que pasajeros de bus, inspectores de la Dirección del Trabajo, fiscalizadores de Carabineros y clientes verifiquen en tiempo real la autenticidad y vigencia de un control.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchCode()}
                  placeholder="Ingresa Folio de Acta (ej: ACT-2026-0891) o RUT del Conductor"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleSearchCode()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30"
              >
                <Search className="w-4 h-4" />
                <span>Verificar Ahora</span>
              </button>
            </div>

            {/* Quick Demo Folios buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Prueba rápida con folios reales del sistema:</span>
              {tests.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSearchCode(t.code);
                    handleSearchCode(t.code);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-md font-mono border border-slate-700 transition cursor-pointer"
                >
                  {t.code} ({t.overallStatus === 'apto_despacho' ? 'Apto' : 'Bloqueado'})
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          {hasSearched && (
            <div className="mt-6">
              {verificationResult ? (
                <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Acta Auténtica y Certificada</span>
                          <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                            VALIDADA
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          Folio Oficial: {verificationResult.code} • ID: {verificationResult.id}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        verificationResult.overallStatus === 'apto_despacho'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}>
                        {verificationResult.overallStatus === 'apto_despacho'
                          ? '✓ HABILITADO PARA CONDUCIR'
                          : '⛔ RELEVO CAUTELAR / NO APTO'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Conductor</p>
                      <p className="text-sm font-bold text-white mt-0.5">{verificationResult.driverName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{verificationResult.driverRut}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Empresa de Transporte</p>
                      <p className="text-sm font-bold text-white mt-0.5">{currentCompany.fantasyName || currentCompany.businessName}</p>
                      <p className="text-slate-400 text-[11px]">Faena: {verificationResult.driverBase || 'Terminal Central'}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Fecha y Hora de Aplicación</p>
                      <p className="text-sm font-bold text-white mt-0.5">{verificationResult.timestamp}</p>
                      <p className="text-slate-400 text-[11px]">Motivo: {verificationResult.reason}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Control de Alcoholemia</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {verificationResult.alcoholValueGramsPerLiter.toFixed(2)} g/l (Espirado)
                      </p>
                      <p className="text-emerald-400 text-[11px]">
                        {verificationResult.alcoholStatus === 'negativo' ? '0.00 Sobrio Conforme' : 'Positivo Alcohol'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Panel Drogas en Saliva</p>
                      <p className="text-sm font-bold text-white mt-0.5">Assure Tech Oral Fluid</p>
                      <p className="text-emerald-400 text-[11px]">
                        {verificationResult.drugsOverallStatus === 'negativo' ? 'Negativo 5 Drogas' : 'Reactivo Presuntivo'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-slate-400">Operador Certificado</p>
                      <p className="text-sm font-bold text-white mt-0.5">{verificationResult.operatorName}</p>
                      <p className="text-slate-400 text-[11px]">RUT: {verificationResult.operatorRut}</p>
                    </div>
                  </div>

                  {/* Cryptographic Proof Ribbon */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="font-mono text-slate-400">
                        Hash SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                      </span>
                    </div>
                    <span className="text-blue-400 font-semibold">Trazabilidad OIML R 126 / SUSESO</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-rose-800/60 rounded-2xl p-6 text-center space-y-2">
                  <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="text-base font-bold text-white">No se encontró registro para el código ingresado</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Verifica que el folio corresponda al formato impreso en el ticket o escaneado en el código QR del vehículo. Ante dudas, comunícate con la mesa de ayuda 24/7.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 8. RED DE GARITAS Y COBERTURA EN CHILE */}
      <section id="sedes" className="py-16 px-4 max-w-7xl mx-auto border-b border-slate-800">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Cobertura Nacional 24/7</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Red de Garitas y Bases de Control en Rutas Estratégicas
            </h2>
            <p className="text-sm text-slate-300">
              Operadores certificados in situ en los principales nodos logísticos, terminales de pasajeros y complejos mineros de Chile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA CENTRAL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">GARITA ACTIVA 24/7</span>
              </div>
              <h4 className="text-base font-bold text-white">Santiago Terminal Sur & San Borja</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control pre-embarque continuo para conductores de líneas interurbanas hacia el norte y sur de Chile. 4 puestos de testeo simultáneo de alcohotest y saliva.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 2 2899 7410 • Base Metropolitana</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA MINERA</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">OPERATIVO 24/7</span>
              </div>
              <h4 className="text-base font-bold text-white">Antofagasta / Base La Negra</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspección de camiones de carga de ácido sulfúrico, sustancias peligrosas y buses de traslado de faenas mineras en la Región de Antofagasta y Calama.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 55 241 8900 • Base Norte</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA PORTUARIA</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">GARITA ACTIVA</span>
              </div>
              <h4 className="text-base font-bold text-white">Valparaíso & San Antonio Puertos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control para flotas de camiones portuarios de contenedores, importación y exportación. Protocolos de acceso a recintos portuarios y ZEAL.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 32 267 1140 • Base Costa</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA FORESTAL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">GARITA ACTIVA</span>
              </div>
              <h4 className="text-base font-bold text-white">Concepción / Coronel Industrial</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supervisión de transporte maderero, celulosa y pesca industrial en la Región del Biobío y Araucanía. Móviles de terreno para faenas boscosas.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 41 290 8530 • Base Biobío</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA SUR AUSTRAL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">OPERATIVO 24/7</span>
              </div>
              <h4 className="text-base font-bold text-white">Puerto Montt & Chiloé</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control para flotas de traslado salmo-acuícola, buses australes y conexión bimodal en rampa Pargua.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 65 233 9010 • Base Los Lagos</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">ZONA FRONTERIZA</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">OPERATIVO 24/7</span>
              </div>
              <h4 className="text-base font-bold text-white">Los Libertadores & Chacalluta</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Certificación de conductores de transporte internacional de pasajeros y cargas peligrosas en pasos fronterizos con Argentina y Perú.
              </p>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+56 2 2899 7455 • Base Internacional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COTIZADOR Y SIMULADOR INSTITUCIONAL PARA EMPRESAS */}
      <section id="cotizador" className="py-16 px-4 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/70 border border-amber-800 text-amber-300 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Simulador de Inversión y Retorno</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Cotizador Institucional de Blindaje Operacional
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Calcula al instante el costo mensual y el retorno económico proyectado para tu empresa frente a multas de la Dirección del Trabajo y demandas laborales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
            {/* Left Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Tipo de Operación y Flota
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'buses_interurbanos', label: 'Buses Interurbanos' },
                    { id: 'camiones_carga', label: 'Camiones de Carga' },
                    { id: 'mineria_personal', label: 'Minería y Personal' },
                    { id: 'carga_peligrosa', label: 'Sustancias Peligrosas' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFleetType(item.id as any)}
                      className={`p-3 rounded-xl border font-medium text-left transition cursor-pointer ${
                        fleetType === item.id
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Número de Unidades / Conductores
                  </label>
                  <span className="text-lg font-black text-blue-400 font-mono">{unitsCount} unidades</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={250}
                  step={5}
                  value={unitsCount}
                  onChange={(e) => setUnitsCount(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-950 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>5 (Flota Pequeña)</span>
                  <span>100 (Mediana)</span>
                  <span>250+ (Gran Empresa)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Frecuencia de Testeo Programado
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'aleatorio_suseso', label: 'Aleatorio SUSESO (Recomendado)' },
                    { id: 'diario_100', label: '100% Pre-Turno Diario' },
                    { id: 'semanal', label: 'Muestral Semanal' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setControlFrequency(freq.id as any)}
                      className={`p-2.5 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                        controlFrequency === freq.id
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Incluir Kits de Saliva Assure Tech</p>
                  <p className="text-[11px] text-slate-400">Panel dual de 5 drogas para controles de fluido oral</p>
                </div>
                <input
                  type="checkbox"
                  checked={needsAssureSaliva}
                  onChange={(e) => setNeedsAssureSaliva(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Propuesta Económica Estimada
              </h4>

              <div className="space-y-1 border-b border-slate-800 pb-4">
                <p className="text-xs text-slate-400">Inversión Mensual Aproximada</p>
                <p className="text-3xl font-black text-white font-mono">
                  ${monthlyTotal.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-sans font-normal">CLP + IVA</span>
                </p>
                <p className="text-[11px] text-blue-400">
                  Aprox. ${Math.round(monthlyTotal / unitsCount).toLocaleString('es-CL')} CLP por unidad / mes
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-bold text-white text-xs">Incluye en el plan:</p>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sellos QR inviolables para los {unitsCount} vehículos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Software de trazabilidad inalterable SHA-256</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Calibración de etilómetros y soporte metrológico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Respaldo jurídico en caso de demandas laborales</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-emerald-400 uppercase">Ahorro Contingente Estimado</p>
                <p className="text-xl font-black text-white font-mono">
                  ${estimatedSavings.toLocaleString('es-CL')} CLP
                </p>
                <p className="text-[10px] text-slate-400">
                  Evita multas DT de hasta 60 UTM por trabajador y juicios de tutela laboral.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  scrollTo('contacto');
                  setContactForm((prev) => ({
                    ...prev,
                    mensaje: `Hola, me gustaría solicitar una propuesta formal para una flota de ${unitsCount} unidades (${fleetType}) con frecuencia ${controlFrequency}.`
                  }));
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <span>Solicitar Propuesta Formal y Reunión Técnica</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CANAL OFICIAL DE CONTACTO & DENUNCIAS ÉTICAS */}
      <section id="contacto" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-800 text-blue-300 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Atención Corporativa e Institucional</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Hablemos de la Seguridad de tu Flota
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Nuestros ingenieros de prevención de riesgos y asesores jurídicos en transporte están disponibles para agendar una visita técnica a tu base de operaciones o terminal.
            </p>

            <div className="space-y-4 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Casa Central Institucional</p>
                  <p className="text-slate-400">Av. Apoquindo 4700, Piso 12, Las Condes, Santiago de Chile</p>
                  <p className="text-slate-500 text-[11px]">RUT: 77.892.341-K • Blindaje Vial SpA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Central Telefónica y Garitas 24/7</p>
                  <p className="text-slate-400">+56 2 2899 7400 (Mesa Central)</p>
                  <p className="text-slate-400">+56 9 8455 1200 (Urgencias en Ruta)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Correos Oficiales</p>
                  <p className="text-slate-400">contacto@blindajevial.cl (Comercial e Institucional)</p>
                  <p className="text-slate-400">prevencion@blindajevial.cl (Soporte Técnico)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Canal de Integridad & Ley Karin (Confidencial)</p>
                  <p className="text-slate-400">denuncias@blindajevial.cl</p>
                  <p className="text-slate-500 text-[11px]">Canal seguro y anónimo para reclamos sobre procedimientos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
            {contactSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Solicitud Recibida Exitosamente</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Se ha generado el folio de atención institucional <strong className="text-blue-400 font-mono">TICKET-2026-0419</strong>. Un asesor de prevención se pondrá en contacto contigo en menos de 2 horas hábiles.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSubmitted(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white">
                  Formulario de Contacto y Solicitud de Acreditación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcelo Morales Valenzuela"
                      value={contactForm.nombre}
                      onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Empresa o Razón Social *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Transportes del Sur SpA"
                      value={contactForm.empresa}
                      onChange={(e) => setContactForm({ ...contactForm, empresa: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">RUT Empresa o Conductor</label>
                    <input
                      type="text"
                      placeholder="Ej: 76.543.210-K"
                      value={contactForm.rut}
                      onChange={(e) => setContactForm({ ...contactForm, rut: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Teléfono de Contacto (+56) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={contactForm.telefono}
                      onChange={(e) => setContactForm({ ...contactForm, telefono: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico Corporativo *</label>
                    <input
                      type="email"
                      required
                      placeholder="gerencia@tuempresa.cl"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Región de Operación Principal</label>
                    <select
                      value={contactForm.region}
                      onChange={(e) => setContactForm({ ...contactForm, region: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>Región de Arica y Parinacota</option>
                      <option>Región de Tarapacá</option>
                      <option>Región de Antofagasta</option>
                      <option>Región de Atacama</option>
                      <option>Región de Coquimbo</option>
                      <option>Región de Valparaíso</option>
                      <option>Región Metropolitana</option>
                      <option>Región de O'Higgins</option>
                      <option>Región del Maule</option>
                      <option>Región de Ñuble</option>
                      <option>Región del Biobío</option>
                      <option>Región de La Araucanía</option>
                      <option>Región de Los Ríos</option>
                      <option>Región de Los Lagos</option>
                      <option>Región de Aysén</option>
                      <option>Región de Magallanes</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Mensaje o Requerimiento Técnico *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Indícanos cuántos vehículos necesitas acreditar, si requieres garita presencial en terminal o capacitación para tus prevencionistas..."
                      value={contactForm.mensaje}
                      onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" required id="privacy_agree" className="w-4 h-4 accent-blue-600 rounded cursor-pointer" />
                  <label htmlFor="privacy_agree" className="text-[11px] text-slate-400">
                    Acepto el tratamiento confidencial de datos según la Ley N° 19.628 de Protección de la Vida Privada.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitud a Mesa Institucional</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 11. INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <BrandLogo size="md" showText={true} />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Blindaje Vial SpA es la institución chilena líder en control toxicológico en faena, metrología de alcohotest evidenciales y acreditación de flotas seguras.
              </p>
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                RUT: 77.892.341-K • Inscripción Registro Nacional de Proveedores del Estado
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Enlaces Institucionales</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-white transition cursor-pointer">Inicio</button></li>
                <li><button onClick={() => scrollTo('quienes-somos')} className="hover:text-white transition cursor-pointer">La Institución</button></li>
                <li><button onClick={() => scrollTo('servicios')} className="hover:text-white transition cursor-pointer">Programas y Servicios</button></li>
                <li><button onClick={() => scrollTo('marco-legal')} className="hover:text-white transition cursor-pointer">Legislación y SUSESO</button></li>
                <li><button onClick={() => scrollTo('verificador')} className="hover:text-white transition cursor-pointer">Verificador de Actas QR</button></li>
                <li><button onClick={() => scrollTo('sedes')} className="hover:text-white transition cursor-pointer">Garitas y Sedes en Chile</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Organismos de Referencia</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>SUSESO (Seguridad Social)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>Dirección del Trabajo (DT)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>Ministerio de Transportes (MTT)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>SENDA (Tolerancia Cero)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>Carabineros de Chile</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Acceso a Intranet</p>
              <p className="text-[11px] text-slate-400">
                Acceso restringido para supervisores, prevencionistas, operadores y conductores autorizados.
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ingreso a Plataforma</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Blindaje Vial SpA • Todos los derechos reservados. República de Chile.</p>
            <div className="flex items-center gap-4">
              <span>Términos y Condiciones</span>
              <span>•</span>
              <span>Política de Privacidad Ley 19.628</span>
              <span>•</span>
              <span>Canal Ético Ley Karin</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal for Operational Images */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <span className="bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono font-bold text-xs px-2.5 py-1 rounded">
                  {selectedImage.badge}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-block">
                  Evidencia Fotográfica Blindaje Vial SpA
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[60vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Caption & Legal Details */}
            <div className="p-5 sm:p-6 bg-slate-900 space-y-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-xs font-semibold text-blue-400 mt-0.5">
                  {selectedImage.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedImage.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    Marco Legal: {selectedImage.normativa}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer self-end sm:self-auto"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
