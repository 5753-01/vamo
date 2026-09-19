import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Driver } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Printer,
  Send,
  Lock,
  Unlock,
  User,
  Award,
  Truck,
  Car,
  AlertCircle,
  Info,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Bell,
  Smartphone,
  Mail,
  FileCheck2,
  Camera,
  FileDown,
  FileText,
  History,
  ClipboardCheck
} from 'lucide-react';
import { DriverLicenseCameraOcrModal } from './DriverLicenseCameraOcrModal';
import {
  generateRecentLicensesAuditPDF,
  generateSingleDriverLicenseCertificatePDF,
  LicenseValidationAuditRecord
} from '../utils/licenseAuditPdfExport';

export interface LicenseValidationResult {
  driver: Driver;
  daysRemaining: number;
  status: 'vencida' | 'urgente' | 'proxima' | 'preventiva' | 'vigente';
  statusLabel: string;
  badgeClass: string;
  borderClass: string;
  isExpired: boolean;
  requiresImmediateAction: boolean;
  classesExplanation: string[];
}

// Chilean License Class Descriptions based on Ley 18.290
export const CHILEAN_LICENSE_CLASSES: Record<string, { title: string; desc: string; heavyDuty: boolean }> = {
  A1: { title: 'Clase A1', desc: 'Taxis y transporte remunerado de personas (Ley antigua)', heavyDuty: false },
  A2: { title: 'Clase A2', desc: 'Taxis, ambulancias y transporte privado/público hasta 17 asientos', heavyDuty: false },
  A3: { title: 'Clase A3', desc: 'Buses interurbanos, escolares y transporte de pasajeros sin límite de asientos', heavyDuty: true },
  A4: { title: 'Clase A4', desc: 'Camiones de carga simples sobre 3.500 kg de peso bruto vehicular', heavyDuty: true },
  A5: { title: 'Clase A5', desc: 'Tractocamiones articulados y camiones con remolque sobre 3.500 kg', heavyDuty: true },
  B: { title: 'Clase B', desc: 'Vehículos motorizados particulares de hasta 9 asientos o 3.500 kg', heavyDuty: false }
};

interface DriverLicenseValidatorProps {
  onSelectDriver?: (driverId: string) => void;
}

export const DriverLicenseValidator: React.FC<DriverLicenseValidatorProps> = ({ onSelectDriver }) => {
  const { drivers, updateDriver, toggleDriverStatus, currentCompany, checkLicenseExpirationsNow, showToast } = useApp();

  // Reference audit date (default: September 13, 2026)
  const [referenceDate, setReferenceDate] = useState<string>('2026-09-13');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vencida' | 'urgente' | 'proxima' | 'preventiva' | 'vigente'>('all');
  const [filterBase, setFilterBase] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Interactive Live Check State
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [selectedLiveDriverId, setSelectedLiveDriverId] = useState<string>(drivers[0]?.id || '');
  const [customRutInput, setCustomRutInput] = useState<string>('');
  const [customExpiryInput, setCustomExpiryInput] = useState<string>('2026-10-15');
  const [customClassesInput, setCustomClassesInput] = useState<string[]>(['A5', 'A2']);
  const [isSimulatingCustom, setIsSimulatingCustom] = useState<boolean>(false);

  // Modals state
  const [renewDriver, setRenewDriver] = useState<Driver | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('2028-12-31');
  const [municipalityName, setMunicipalityName] = useState<string>('Dirección de Tránsito - I. Municipalidad de Santiago');
  const [renewFolio, setRenewFolio] = useState<string>('FOL-MTT-2026-8812');
  const [renewNotes, setRenewNotes] = useState<string>('');

  const [notifyDriver, setNotifyDriver] = useState<Driver | null>(null);
  const [notifySuccessMessage, setNotifySuccessMessage] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);

  // Validation History State for Recent Audits
  const [recentValidations, setRecentValidations] = useState<LicenseValidationAuditRecord[]>([
    {
      id: 'val-rec-001',
      timestamp: '19/09/2026 08:15',
      driverId: 'drv-008',
      rut: '12.430.871-3',
      fullName: 'Héctor Manuel Carrasco Pinto',
      licenseClasses: ['A5', 'A2'],
      licenseExpiry: '2026-08-25',
      daysRemaining: -19,
      status: 'vencida',
      statusLabel: 'Vencida (-19 días)',
      validationMethod: 'garita_control',
      methodLabel: 'Control Garita 24/7',
      checkpoint: 'Garita Principal - Base Central Santiago',
      auditorName: 'Insp. Carlos Henríquez (Garita)',
      dispatchDecision: 'bloqueo_inmediato',
      decisionLabel: 'Bloqueo Inmediato (Infracción Ley 18.290)',
      hashSha256: '9f83a4c5e2d10b784a9e33c7f12e8b91a20d419c8f6154b2a7e02319f8a42e10',
      notes: 'Licencia vencida detectada en control previo a salida de camión articulado. Bloqueo de despacho activado.'
    },
    {
      id: 'val-rec-002',
      timestamp: '19/09/2026 07:50',
      driverId: 'drv-007',
      rut: '17.891.204-5',
      fullName: 'Rodrigo Andrés Valenzuela Oporto',
      licenseClasses: ['A5', 'A4'],
      licenseExpiry: '2026-09-24',
      daysRemaining: 11,
      status: 'urgente',
      statusLabel: 'Urgente (11 días restantes)',
      validationMethod: 'ocr_camara',
      methodLabel: 'Cámara OCR Gemini',
      checkpoint: 'Control Despacho - Base San Bernardo',
      auditorName: 'Supervisor Luis Morales',
      dispatchDecision: 'advertencia_notificada',
      decisionLabel: 'Autorizado con Notificación Preventiva',
      hashSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      notes: 'Escaneado por OCR. Notificación preventiva enviada a WhatsApp y correo. Habilitado condicional.'
    },
    {
      id: 'val-rec-003',
      timestamp: '19/09/2026 07:30',
      driverId: 'drv-004',
      rut: '17.654.321-9',
      fullName: 'Felipe Andrés Poblete Toro',
      licenseClasses: ['A5', 'A4', 'B'],
      licenseExpiry: '2026-11-04',
      daysRemaining: 52,
      status: 'preventiva',
      statusLabel: 'Preventiva (52 días restantes)',
      validationMethod: 'garita_control',
      methodLabel: 'Control Garita 24/7',
      checkpoint: 'Garita Norte - Faena Lampa',
      auditorName: 'Insp. Marcela Gómez',
      dispatchDecision: 'autorizado',
      decisionLabel: 'Autorizado para Despacho',
      hashSha256: '4b8e210a56f790c81234567890abcdef1234567890abcdef1234567890abcdef',
      notes: 'Control previo regular. Psicotécnico y licencia vigentes conforme.'
    },
    {
      id: 'val-rec-004',
      timestamp: '19/09/2026 07:10',
      driverId: 'drv-001',
      rut: '15.482.930-4',
      fullName: 'Jorge Eduardo Muñoz Peña',
      licenseClasses: ['A5', 'A2', 'B'],
      licenseExpiry: '2027-11-15',
      daysRemaining: 428,
      status: 'vigente',
      statusLabel: 'Vigente (> 60 días)',
      validationMethod: 'garita_control',
      methodLabel: 'Control Garita 24/7',
      checkpoint: 'Garita Principal - Base Central Santiago',
      auditorName: 'Insp. Carlos Henríquez (Garita)',
      dispatchDecision: 'autorizado',
      decisionLabel: 'Autorizado para Despacho',
      hashSha256: '7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d',
      notes: 'Documentación al día. Salida autorizada para tractocamión a Valparaíso.'
    },
    {
      id: 'val-rec-005',
      timestamp: '19/09/2026 06:45',
      driverId: 'drv-002',
      rut: '16.890.312-7',
      fullName: 'Cristian Alejandro Vera Carrasco',
      licenseClasses: ['A5', 'A4'],
      licenseExpiry: '2028-04-10',
      daysRemaining: 574,
      status: 'vigente',
      statusLabel: 'Vigente (> 60 días)',
      validationMethod: 'inspeccion_terreno',
      methodLabel: 'Inspección en Terreno',
      checkpoint: 'Punto Control Ruta 5 Sur - Km 82',
      auditorName: 'Fiscalizador Vial Terreno',
      dispatchDecision: 'autorizado',
      decisionLabel: 'Autorizado para Despacho',
      hashSha256: '2a4c6e8f0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8f0b2d4f',
      notes: 'Fiscalización en ruta con verificación en línea. Sin observaciones.'
    }
  ]);

  const [historyFilterStatus, setHistoryFilterStatus] = useState<'all' | 'autorizado' | 'alerta' | 'bloqueado'>('all');
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');

  // Calculate days difference and analysis for a given driver
  const analyzeDriverLicense = (driver: Driver, targetDateStr: string): LicenseValidationResult => {
    const targetDate = new Date(targetDateStr);
    const expiryDate = new Date(driver.licenseExpiry);

    // Difference in days
    const diffTime = expiryDate.getTime() - targetDate.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: LicenseValidationResult['status'] = 'vigente';
    let statusLabel = '';
    let badgeClass = '';
    let borderClass = '';
    let isExpired = false;
    let requiresImmediateAction = false;

    if (daysRemaining < 0) {
      status = 'vencida';
      const daysAgo = Math.abs(daysRemaining);
      statusLabel = daysAgo === 0 ? 'VENCE HOY' : `VENCIDA HACE ${daysAgo} DÍAS`;
      badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      borderClass = 'border-rose-500/60 bg-rose-950/20';
      isExpired = true;
      requiresImmediateAction = true;
    } else if (daysRemaining <= 15) {
      status = 'urgente';
      statusLabel = daysRemaining === 0 ? 'VENCE HOY' : `VENCE EN ${daysRemaining} DÍAS (URGENTE)`;
      badgeClass = 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse';
      borderClass = 'border-red-500/50 bg-red-950/20';
      requiresImmediateAction = true;
    } else if (daysRemaining <= 30) {
      status = 'proxima';
      statusLabel = `VENCE EN ${daysRemaining} DÍAS (< 30 DÍAS)`;
      badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      borderClass = 'border-amber-500/40 bg-amber-950/15';
      requiresImmediateAction = true;
    } else if (daysRemaining <= 60) {
      status = 'preventiva';
      statusLabel = `VENCE EN ${daysRemaining} DÍAS (PREVENTIVA)`;
      badgeClass = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      borderClass = 'border-yellow-500/30 bg-yellow-950/10';
      requiresImmediateAction = false;
    } else {
      status = 'vigente';
      statusLabel = `VIGENTE (${daysRemaining} DÍAS RESTANTES)`;
      badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      borderClass = 'border-slate-800 bg-slate-900/60';
      requiresImmediateAction = false;
    }

    const classesExplanation = driver.licenseClass.map(
      (c) => `${c}: ${CHILEAN_LICENSE_CLASSES[c]?.desc || 'Clase autorizada'}`
    );

    return {
      driver,
      daysRemaining,
      status,
      statusLabel,
      badgeClass,
      borderClass,
      isExpired,
      requiresImmediateAction,
      classesExplanation
    };
  };

  // Helper to record a validation event in the official audit history
  const recordValidationToHistory = (
    driverData: {
      driverId?: string;
      rut: string;
      fullName: string;
      licenseClasses: string[];
      licenseExpiry: string;
    },
    method: 'ocr_camara' | 'garita_control' | 'ingreso_manual' | 'inspeccion_terreno',
    customNotes?: string
  ) => {
    const analysis = analyzeDriverLicense(
      {
        id: driverData.driverId || 'temp-drv',
        rut: driverData.rut,
        fullName: driverData.fullName,
        licenseClass: driverData.licenseClasses as Driver['licenseClass'],
        licenseExpiry: driverData.licenseExpiry,
        companyId: currentCompany.id,
        birthDate: '1985-01-01',
        phone: '+56 9 9999 9999',
        email: 'conductor@transportes.cl',
        assignedBase: 'Base Central',
        status: 'habilitado',
        psychotechnicalExpiry: '2027-01-01',
        totalTests: 0
      },
      referenceDate
    );

    const methodLabel =
      method === 'ocr_camara'
        ? 'Cámara OCR Gemini'
        : method === 'garita_control'
        ? 'Control Garita 24/7'
        : method === 'inspeccion_terreno'
        ? 'Inspección en Terreno'
        : 'Ingreso Manual';

    let dispatchDecision: LicenseValidationAuditRecord['dispatchDecision'] = 'autorizado';
    let decisionLabel = 'Autorizado para Despacho';

    if (analysis.status === 'vencida') {
      dispatchDecision = 'bloqueo_inmediato';
      decisionLabel = 'Bloqueo Inmediato (Infracción Ley 18.290)';
    } else if (analysis.status === 'urgente') {
      dispatchDecision = 'advertencia_notificada';
      decisionLabel = 'Autorizado con Notificación Preventiva';
    }

    const now = new Date();
    const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newRecord: LicenseValidationAuditRecord = {
      id: `val-rec-${Date.now()}`,
      timestamp: `${dateFormatted} ${timeFormatted}`,
      driverId: driverData.driverId,
      rut: driverData.rut,
      fullName: driverData.fullName,
      licenseClasses: driverData.licenseClasses,
      licenseExpiry: driverData.licenseExpiry,
      daysRemaining: analysis.daysRemaining,
      status: analysis.status,
      statusLabel: analysis.statusLabel,
      validationMethod: method,
      methodLabel,
      checkpoint: 'Garita Principal - Despacho 24/7',
      auditorName: 'Supervisor de Garita / Control Operacional',
      dispatchDecision,
      decisionLabel,
      hashSha256: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      notes: customNotes || `Inspección de vigencia metrológica y documental.`
    };

    setRecentValidations((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const handleOcrApplied = (data: {
    driverId?: string;
    rut: string;
    licenseExpiry: string;
    fullName?: string;
    licenseClasses?: string[];
  }) => {
    const driverName =
      data.fullName ||
      (data.driverId ? drivers.find((d) => d.id === data.driverId)?.fullName : undefined) ||
      'Conductor Validador OCR';
    const driverClasses =
      data.licenseClasses && data.licenseClasses.length > 0
        ? data.licenseClasses
        : data.driverId
        ? drivers.find((d) => d.id === data.driverId)?.licenseClass || ['A5']
        : ['A5'];

    // Register into history automatically
    recordValidationToHistory(
      {
        driverId: data.driverId,
        rut: data.rut,
        fullName: driverName,
        licenseClasses: driverClasses,
        licenseExpiry: data.licenseExpiry
      },
      'ocr_camara',
      'Extracción pericial de datos mediante escaneo inteligente con cámara OCR.'
    );

    if (data.driverId) {
      setSelectedLiveDriverId(data.driverId);
      setIsSimulatingCustom(false);
      showToast(`Conductor ${driverName} cargado y registrado en el historial de auditoría.`);
    } else {
      setIsSimulatingCustom(true);
      setCustomRutInput(data.rut);
      setCustomExpiryInput(data.licenseExpiry);
      if (data.licenseClasses && data.licenseClasses.length > 0) {
        setCustomClassesInput(data.licenseClasses);
      }
      showToast(`Datos extraídos por OCR aplicados al simulador y registrados en el historial (RUT: ${data.rut}).`);
    }
  };

  // Filtered validations for the history table
  const filteredRecentValidations = useMemo(() => {
    return recentValidations.filter((rec) => {
      // Search term
      if (historySearchTerm.trim()) {
        const query = historySearchTerm.toLowerCase();
        const matchesRut = rec.rut.toLowerCase().includes(query);
        const matchesName = rec.fullName.toLowerCase().includes(query);
        const matchesFolio = rec.id.toLowerCase().includes(query);
        if (!matchesRut && !matchesName && !matchesFolio) return false;
      }
      // Status filter
      if (historyFilterStatus === 'autorizado' && rec.dispatchDecision !== 'autorizado') return false;
      if (historyFilterStatus === 'alerta' && rec.dispatchDecision !== 'advertencia_notificada') return false;
      if (historyFilterStatus === 'bloqueado' && rec.dispatchDecision !== 'bloqueo_inmediato') return false;
      return true;
    });
  }, [recentValidations, historyFilterStatus, historySearchTerm]);

  // Export audit PDF handler
  const handleExportAuditPdf = () => {
    if (filteredRecentValidations.length === 0) {
      showToast('No existen validaciones recientes bajo el filtro seleccionado para generar el reporte.');
      return;
    }
    try {
      generateRecentLicensesAuditPDF(currentCompany, filteredRecentValidations, {
        referenceDate,
        checkpointName: 'Garita de Despacho & Control Operacional 24/7',
        auditorName: 'Supervisor de Garita & Prevención de Riesgos',
        notes: 'Auditoría periódica de cumplimiento Ley 18.290 Art. 110-111 y Dictamen SUSESO 92064-2025.'
      });
      showToast(`Reporte oficial de auditoría en PDF descargado exitosamente (${filteredRecentValidations.length} licencias).`);
    } catch (err) {
      console.error('Error al generar PDF de auditoría:', err);
      showToast('Error al generar el reporte PDF.');
    }
  };

  // Download individual certificate PDF
  const handleDownloadSinglePdf = (record: LicenseValidationAuditRecord) => {
    try {
      generateSingleDriverLicenseCertificatePDF(currentCompany, record, referenceDate);
      showToast(`Certificado individual de conductor ${record.fullName} descargado en PDF.`);
    } catch (err) {
      console.error('Error al generar certificado individual PDF:', err);
      showToast('Error al generar el certificado PDF.');
    }
  };

  // Analyze all drivers in registry
  const analyzedDrivers = useMemo(() => {
    return drivers.map((d) => analyzeDriverLicense(d, referenceDate));
  }, [drivers, referenceDate]);

  // Aggregate KPI metrics
  const metrics = useMemo(() => {
    const total = analyzedDrivers.length;
    const vencidas = analyzedDrivers.filter((a) => a.status === 'vencida').length;
    const urgentes = analyzedDrivers.filter((a) => a.status === 'urgente').length;
    const proximas = analyzedDrivers.filter((a) => a.status === 'proxima').length;
    const preventivas = analyzedDrivers.filter((a) => a.status === 'preventiva').length;
    const vigentes = analyzedDrivers.filter((a) => a.status === 'vigente').length;

    const atRiskCount = vencidas + urgentes + proximas;
    const complianceRate = total > 0 ? Math.round(((vigentes + preventivas) / total) * 100) : 100;

    return {
      total,
      vencidas,
      urgentes,
      proximas,
      preventivas,
      vigentes,
      atRiskCount,
      complianceRate
    };
  }, [analyzedDrivers]);

  // Filtered drivers for the management table
  const bases = useMemo(() => {
    return Array.from(new Set(drivers.map((d) => d.assignedBase)));
  }, [drivers]);

  const filteredList = useMemo(() => {
    return analyzedDrivers.filter((item) => {
      // Status filter
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }
      // Base filter
      if (filterBase !== 'all' && item.driver.assignedBase !== filterBase) {
        return false;
      }
      // Class filter
      if (filterClass !== 'all' && !item.driver.licenseClass.includes(filterClass as any)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.driver.fullName.toLowerCase().includes(query);
        const matchesRut = item.driver.rut.toLowerCase().includes(query);
        const matchesBase = item.driver.assignedBase.toLowerCase().includes(query);
        if (!matchesName && !matchesRut && !matchesBase) {
          return false;
        }
      }
      return true;
    });
  }, [analyzedDrivers, filterStatus, filterBase, filterClass, searchTerm]);

  // Export general registry PDF
  const handleExportGeneralRegistryPdf = () => {
    if (filteredList.length === 0) {
      showToast('No hay conductores en la nómina filtrada para exportar.');
      return;
    }
    const auditRecords: LicenseValidationAuditRecord[] = filteredList.map((item, idx) => ({
      id: `val-reg-${item.driver.id}-${idx + 1}`,
      timestamp: `${referenceDate} 08:00`,
      driverId: item.driver.id,
      rut: item.driver.rut,
      fullName: item.driver.fullName,
      licenseClasses: item.driver.licenseClass,
      licenseExpiry: item.driver.licenseExpiry,
      daysRemaining: item.daysRemaining,
      status: item.status,
      statusLabel: item.statusLabel,
      validationMethod: 'garita_control',
      methodLabel: 'Registro General Nómina',
      checkpoint: `Base ${item.driver.assignedBase || 'Central'}`,
      auditorName: 'Auditor de Seguridad Vial',
      dispatchDecision:
        item.status === 'vencida'
          ? 'bloqueo_inmediato'
          : item.status === 'urgente'
          ? 'advertencia_notificada'
          : 'autorizado',
      decisionLabel:
        item.status === 'vencida'
          ? 'Bloqueo Inmediato (Ley 18.290)'
          : item.status === 'urgente'
          ? 'Advertencia Notificada'
          : 'Habilitado Conforme',
      hashSha256: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      notes: `Examen psicotécnico: ${item.driver.psychotechnicalExpiry || 'N/A'}. Base: ${item.driver.assignedBase}.`
    }));

    try {
      generateRecentLicensesAuditPDF(currentCompany, auditRecords, {
        referenceDate,
        checkpointName: 'Consolidado General de Nómina Activa',
        auditorName: 'Jefe de Operaciones & Prevención',
        notes: `Nómina general de conductores filtrada (${filteredList.length} conductores).`
      });
      showToast(`Reporte consolidado de nómina descargado en PDF (${filteredList.length} conductores).`);
    } catch (err) {
      console.error('Error al generar PDF de nómina:', err);
      showToast('Error al generar el reporte PDF.');
    }
  };

  // Live selected driver or custom driver simulation
  const activeLiveAnalysis = useMemo(() => {
    if (isSimulatingCustom) {
      const mockDriver: Driver = {
        id: 'sim-drv-custom',
        companyId: currentCompany.id,
        fullName: 'Conductor Simulado (Cotejo en Garita)',
        rut: customRutInput || '16.452.981-4',
        birthDate: '1987-04-15',
        phone: '+56 9 9988 7766',
        email: 'simulacion@blindajevial.cl',
        licenseClass: customClassesInput as any,
        licenseExpiry: customExpiryInput,
        psychotechnicalExpiry: '2026-11-20',
        assignedBase: 'Garita Central Despacho',
        status: 'habilitado',
        totalTests: 0
      };
      return analyzeDriverLicense(mockDriver, referenceDate);
    }

    const found = analyzedDrivers.find((a) => a.driver.id === selectedLiveDriverId);
    return found || analyzedDrivers[0] || null;
  }, [isSimulatingCustom, customRutInput, customExpiryInput, customClassesInput, selectedLiveDriverId, analyzedDrivers, referenceDate, currentCompany]);

  // Handlers
  const handleMassBlockExpired = () => {
    const expiredList = analyzedDrivers.filter((a) => a.isExpired);
    if (expiredList.length === 0) return;

    expiredList.forEach((item) => {
      if (item.driver.status !== 'bloqueado_preventivo') {
        toggleDriverStatus(
          item.driver.id,
          'bloqueado_preventivo',
          `Bloqueo automático por Licencia Vencida el ${item.driver.licenseExpiry} (Ley 18.290 Art. 110-111)`
        );
      }
    });
  };

  const handleSaveRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewDriver || !newExpiryDate) return;

    updateDriver(renewDriver.id, {
      licenseExpiry: newExpiryDate
    });

    setRenewDriver(null);
  };

  const handleSendNotification = (driver: Driver) => {
    setNotifyDriver(driver);
    setNotifySuccessMessage(null);
  };

  const handleConfirmNotification = () => {
    if (!notifyDriver) return;
    setNotifySuccessMessage(`Notificación formal enviada a ${notifyDriver.fullName} (${notifyDriver.email || notifyDriver.phone}) y copia a Prevención de Riesgos.`);
    setTimeout(() => {
      setNotifyDriver(null);
      setNotifySuccessMessage(null);
    }, 2200);
  };

  const handleExportCsv = () => {
    const headers = ['RUT', 'Nombre Completo', 'Base', 'Clases', 'Fecha Vencimiento', 'Días Restantes', 'Estado Vigencia', 'Estado Despacho'];
    const rows = analyzedDrivers.map((a) => [
      a.driver.rut,
      `"${a.driver.fullName}"`,
      `"${a.driver.assignedBase}"`,
      `"${a.driver.licenseClass.join(', ')}"`,
      a.driver.licenseExpiry,
      a.daysRemaining,
      a.status.toUpperCase(),
      a.driver.status.toUpperCase()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Auditoria_Licencias_${currentCompany.rut}_${referenceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                AUDITORÍA DE HABILITACIÓN VIAL
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                LEY 18.290 ART. 110-111 & DICTAMEN SUSESO
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Total Registro: {metrics.total} Choferes
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
              <span>Validador de Vigencia de Licencias de Conducir</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-0.5">
              Inspección y cálculo matemático de fechas de caducidad contra el registro oficial de conductores.
              Garantiza tolerancia cero a licencias vencidas y dispara alertas preventivas escalonadas antes del despacho a ruta.
            </p>
          </div>

          {/* Reference Date Controller & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 self-start lg:self-auto">
            <div className="text-left">
              <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
                Fecha de Cotejo / Auditoría:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={referenceDate}
                  onChange={(e) => setReferenceDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-xs font-mono px-2.5 py-1 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setReferenceDate('2026-09-13')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white rounded-lg transition"
                  title="Restablecer a fecha de hoy"
                >
                  Hoy
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5">
              <button
                onClick={() => setIsOcrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg transition shadow-md group"
                title="Escanear licencia con cámara y extraer RUT y fecha de vencimiento mediante OCR"
              >
                <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>Escanear Licencia (OCR)</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                title="Descargar nómina completa en Excel/CSV"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Exportar CSV</span>
              </button>
              <button
                onClick={() => setPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                title="Imprimir acta oficial de fiscalización"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Acta Oficial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Alert Banner when there are critical/urgent licenses */}
        {metrics.atRiskCount > 0 && (
          <div className="p-4 rounded-xl border border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    ¡Alerta Vial Crítica! {metrics.atRiskCount} {metrics.atRiskCount === 1 ? 'Licencia Requiere' : 'Licencias Requieren'} Intervención Inmediata
                  </h4>
                  <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    RIESGO DE INFRACCIÓN GRAVÍSIMA
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Se detectaron <span className="font-bold text-rose-300">{metrics.vencidas} licencias vencidas</span> y{' '}
                  <span className="font-bold text-amber-300">{metrics.urgentes + metrics.proximas} próximas a caducar</span> en menos de 30 días.
                  El Art. 110 de la Ley de Tránsito prohíbe la conducción de vehículos de carga o pasajeros sin licencia profesional vigente.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={async () => {
                  const generated = await checkLicenseExpirationsNow();
                  showToast(`Alerta Push emitida en tiempo real a Supervisores (${generated.length} notificadas).`);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition w-full sm:w-auto cursor-pointer"
                title="Transmite inmediatamente notificaciones push por WebSocket a todos los supervisores"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerta Push a Supervisores</span>
              </button>
              {metrics.vencidas > 0 && (
                <button
                  onClick={handleMassBlockExpired}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow transition w-full sm:w-auto"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Despacho de Vencidos ({metrics.vencidas})</span>
                </button>
              )}
              <button
                onClick={() => setFilterStatus('urgente')}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition w-full sm:w-auto"
              >
                <span>Filtrar Urgentes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total */}
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-slate-800/90 border-blue-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Total Auditadas</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics.total}</p>
          <p className="text-[10px] text-slate-400 mt-1">100% Dotación activa</p>
        </div>

        {/* Card 2: Vencidas */}
        <div
          onClick={() => setFilterStatus('vencida')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'vencida'
              ? 'bg-rose-950/60 border-rose-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-bold">Vencidas</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{metrics.vencidas}</p>
          <p className="text-[10px] text-rose-300 font-semibold mt-1">
            {metrics.vencidas > 0 ? '¡Bloqueo obligatorio!' : 'Sin vencidas'}
          </p>
        </div>

        {/* Card 3: Urgente <= 15 días */}
        <div
          onClick={() => setFilterStatus('urgente')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'urgente'
              ? 'bg-red-950/60 border-red-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-red-400 mb-1">
            <span className="text-[11px] font-bold">Urgente (≤15d)</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-red-400">{metrics.urgentes}</p>
          <p className="text-[10px] text-red-300 font-semibold mt-1">Cita inmediata D.T.</p>
        </div>

        {/* Card 4: Próximas 16-30 días */}
        <div
          onClick={() => setFilterStatus('proxima')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'proxima'
              ? 'bg-amber-950/60 border-amber-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-bold">Próximas (16-30d)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{metrics.proximas}</p>
          <p className="text-[10px] text-amber-300 mt-1">Tramitación activa</p>
        </div>

        {/* Card 5: Preventivas 31-60 días */}
        <div
          onClick={() => setFilterStatus('preventiva')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'preventiva'
              ? 'bg-yellow-950/60 border-yellow-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-yellow-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-yellow-300 mb-1">
            <span className="text-[11px] font-bold">Preventivas (31-60d)</span>
            <Calendar className="w-4 h-4 text-yellow-300" />
          </div>
          <p className="text-2xl font-black text-yellow-300">{metrics.preventivas}</p>
          <p className="text-[10px] text-yellow-400/80 mt-1">Planificación mensual</p>
        </div>

        {/* Card 6: Vigentes > 60 días */}
        <div
          onClick={() => setFilterStatus('vigente')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            filterStatus === 'vigente'
              ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-bold">Vigentes (&gt;60d)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{metrics.vigentes}</p>
          <p className="text-[10px] text-emerald-300 mt-1">{metrics.complianceRate}% Conforme</p>
        </div>
      </div>

      {/* 3. LIVE VALIDATION IN GARITA & SIMULATOR PANEL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-base font-bold text-white">
                Módulo Interactivo: Validador de Licencia en Garita / Control Previo
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecciona en tiempo real a cualquier conductor del registro o realiza una simulación manual con cálculo de días y clases autorizadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsOcrModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition shadow-xs"
              title="Tomar fotografía a la licencia física para extraer RUT y Vencimiento mediante OCR"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Capturar con Cámara OCR</span>
            </button>
            <button
              onClick={() => setIsSimulatingCustom(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !isSimulatingCustom
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Seleccionar del Registro
            </button>
            <button
              onClick={() => setIsSimulatingCustom(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isSimulatingCustom
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cotejo Manual / Nuevo Conductor
            </button>
          </div>
        </div>

        {/* Live Controller Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Select or input */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {!isSimulatingCustom ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  Seleccionar Conductor del Registro ({drivers.length}):
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por nombre o RUT..."
                    value={liveSearchQuery}
                    onChange={(e) => setLiveSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {analyzedDrivers
                    .filter((a) => {
                      if (!liveSearchQuery) return true;
                      const q = liveSearchQuery.toLowerCase();
                      return a.driver.fullName.toLowerCase().includes(q) || a.driver.rut.toLowerCase().includes(q);
                    })
                    .map((item) => {
                      const isSelected = item.driver.id === selectedLiveDriverId;
                      return (
                        <div
                          key={item.driver.id}
                          onClick={() => setSelectedLiveDriverId(item.driver.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.driver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                              alt={item.driver.fullName}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                            />
                            <div className="truncate">
                              <p className="font-semibold truncate text-[12px]">{item.driver.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{item.driver.rut}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                              {item.daysRemaining < 0
                                ? 'VENCIDA'
                                : `${item.daysRemaining}d`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">Simulador de Licencia Externa</span>
                  <span className="text-[10px] text-slate-400">Cálculo al vuelo</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOcrModalOpen(true)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition group shadow-sm"
                >
                  <Camera className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                  <span>Tomar foto con cámara para auto-llenar datos</span>
                </button>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">RUT del Conductor:</label>
                  <input
                    type="text"
                    value={customRutInput}
                    onChange={(e) => setCustomRutInput(e.target.value)}
                    placeholder="18.940.112-9"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Fecha de Expiración en Licencia:</label>
                  <input
                    type="date"
                    value={customExpiryInput}
                    onChange={(e) => setCustomExpiryInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Clases Autorizadas (Marcar):</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['A1', 'A2', 'A3', 'A4', 'A5', 'B'].map((cls) => {
                      const isChecked = customClassesInput.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setCustomClassesInput(customClassesInput.filter((c) => c !== cls));
                            } else {
                              setCustomClassesInput([...customClassesInput, cls]);
                            }
                          }}
                          className={`py-1 px-2 rounded text-xs font-bold border transition ${
                            isChecked
                              ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Visual Certificate: The Validation Result Card */}
          <div className="lg:col-span-7">
            {activeLiveAnalysis ? (
              <div
                className={`p-6 rounded-2xl border-2 transition shadow-2xl relative overflow-hidden ${
                  activeLiveAnalysis.status === 'vencida'
                    ? 'border-rose-500/80 bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-900'
                    : activeLiveAnalysis.status === 'urgente'
                    ? 'border-red-500/80 bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-900'
                    : activeLiveAnalysis.status === 'proxima'
                    ? 'border-amber-500/80 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-900'
                    : 'border-emerald-500/60 bg-gradient-to-br from-slate-950 via-emerald-950/15 to-slate-900'
                }`}
              >
                {/* Status Watermark / Header Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeLiveAnalysis.driver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt={activeLiveAnalysis.driver.fullName}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">CERTIFICADO DIGITAL DE VIGENCIA</span>
                        <span className="text-[10px] font-mono text-slate-500">REF: {referenceDate}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {activeLiveAnalysis.driver.fullName}
                      </h4>
                      <p className="text-xs text-slate-300 font-mono">
                        RUT: {activeLiveAnalysis.driver.rut} • {activeLiveAnalysis.driver.assignedBase}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border shadow-md ${
                        activeLiveAnalysis.status === 'vencida'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : activeLiveAnalysis.status === 'urgente'
                          ? 'bg-red-600 text-white border-red-500 animate-pulse'
                          : activeLiveAnalysis.status === 'proxima'
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-emerald-600 text-white border-emerald-500'
                      }`}
                    >
                      {activeLiveAnalysis.status === 'vencida' ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>DENEGADO / LICENCIA VENCIDA</span>
                        </>
                      ) : activeLiveAnalysis.status === 'urgente' ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>ALERTA VIAL: RENOVACIÓN URGENTE</span>
                        </>
                      ) : activeLiveAnalysis.status === 'proxima' ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>ADVERTENCIA: PRÓXIMA A CADUCAR</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>HABILITADO PARA DESPACHO</span>
                        </>
                      )}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      {activeLiveAnalysis.statusLabel}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-800 text-xs">
                  <div className="space-y-1 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Fecha Expiración Licencia
                    </span>
                    <p className="text-white font-mono font-bold text-sm">
                      {activeLiveAnalysis.driver.licenseExpiry}
                    </p>
                    <p
                      className={`text-[11px] font-bold ${
                        activeLiveAnalysis.daysRemaining < 0
                          ? 'text-rose-400'
                          : activeLiveAnalysis.daysRemaining <= 15
                          ? 'text-red-400'
                          : activeLiveAnalysis.daysRemaining <= 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {activeLiveAnalysis.daysRemaining < 0
                        ? `Caducada hace ${Math.abs(activeLiveAnalysis.daysRemaining)} días`
                        : `${activeLiveAnalysis.daysRemaining} días restantes`}
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Examen Psicotécnico Mutual
                    </span>
                    <p className="text-white font-mono font-bold text-sm">
                      {activeLiveAnalysis.driver.psychotechnicalExpiry || 'No registrado'}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Mutual de Seguridad / ACHS
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Estado Operacional Actual
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {activeLiveAnalysis.driver.status === 'habilitado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          <Check className="w-3 h-3" /> Habilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                          <Lock className="w-3 h-3" /> Bloqueado Preventivo
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Control en garita 24/7
                    </p>
                  </div>
                </div>

                {/* Chilean License Classes Matrix */}
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Clases Autorizadas para Conducir en Chile (Ley 18.290):</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeLiveAnalysis.driver.licenseClass.map((c) => {
                      const spec = CHILEAN_LICENSE_CLASSES[c];
                      return (
                        <div
                          key={c}
                          className="bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs flex items-center gap-2"
                        >
                          <span className="font-mono font-black text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                            {c}
                          </span>
                          <span className="text-slate-300 text-[11px]">
                            {spec ? spec.title : c}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons for this driver */}
                {!isSimulatingCustom && (
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {activeLiveAnalysis.driver.status === 'habilitado' ? (
                        <button
                          onClick={() =>
                            toggleDriverStatus(
                              activeLiveAnalysis.driver.id,
                              'bloqueado_preventivo',
                              `Bloqueo por control de vigencia de licencia (${activeLiveAnalysis.statusLabel})`
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-lg transition"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloquear Preventivamente</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            toggleDriverStatus(
                              activeLiveAnalysis.driver.id,
                              'habilitado',
                              'Habilitación tras verificación documental de licencia'
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg transition"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Levantar Bloqueo</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setRenewDriver(activeLiveAnalysis.driver);
                          setNewExpiryDate('2028-12-31');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                        <span>Registrar Renovación</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          recordValidationToHistory(
                            {
                              driverId: activeLiveAnalysis.driver.id,
                              rut: activeLiveAnalysis.driver.rut,
                              fullName: activeLiveAnalysis.driver.fullName,
                              licenseClasses: activeLiveAnalysis.driver.licenseClass,
                              licenseExpiry: activeLiveAnalysis.driver.licenseExpiry
                            },
                            'garita_control',
                            `Verificación presencial en garita. Estado: ${activeLiveAnalysis.statusLabel}`
                          );
                          showToast(`Validación de ${activeLiveAnalysis.driver.fullName} registrada en el Historial de Auditoría.`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold rounded-lg transition"
                        title="Registrar esta verificación en el historial oficial de auditoría"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Registrar en Historial</span>
                      </button>

                      <button
                        onClick={() => handleSendNotification(activeLiveAnalysis.driver)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold rounded-lg transition"
                        title="Enviar alerta formal al conductor vía WhatsApp y Email"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notificar Conductor</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4. HISTORIAL DE VALIDACIONES RECIENTES & EXPORTACIÓN PDF DE AUDITORÍA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Header with Title and Prominent PDF Export Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <History className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                Historial de Validaciones Recientes de Licencias
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                {filteredRecentValidations.length} verificaciones
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registro inalterable de inspecciones en garita 24/7, escaneos OCR con cámara y decisiones de despacho (Ley 18.290 y Dictamen SUSESO N° 92064-2025).
            </p>
          </div>

          {/* Primary Export Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-export-recent-audit-pdf"
              onClick={handleExportAuditPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-950/40 hover:shadow-red-600/30 border border-red-500/40 group active:scale-95 cursor-pointer"
              title="Descargar Reporte Oficial de Auditoría en PDF para fiscalización legal y pericial"
            >
              <FileDown className="w-4 h-4 group-hover:-translate-y-0.5 transition duration-150" />
              <span>Exportar Reporte PDF de Auditoría</span>
              <span className="bg-red-950/80 border border-red-400/40 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold text-red-200">
                {filteredRecentValidations.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setHistoryFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                historyFilterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({recentValidations.length})
            </button>
            <button
              onClick={() => setHistoryFilterStatus('autorizado')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                historyFilterStatus === 'autorizado'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                Autorizados ({recentValidations.filter((r) => r.dispatchDecision === 'autorizado').length})
              </span>
            </button>
            <button
              onClick={() => setHistoryFilterStatus('alerta')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                historyFilterStatus === 'alerta'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-950/30 text-amber-300 border border-amber-800/50 hover:bg-amber-900/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                Con Alerta ({recentValidations.filter((r) => r.dispatchDecision === 'advertencia_notificada').length})
              </span>
            </button>
            <button
              onClick={() => setHistoryFilterStatus('bloqueado')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                historyFilterStatus === 'bloqueado'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/50'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>
                Bloqueados ({recentValidations.filter((r) => r.dispatchDecision === 'bloqueo_inmediato').length})
              </span>
            </button>
          </div>

          {/* Search within History */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por RUT, conductor o folio..."
              value={historySearchTerm}
              onChange={(e) => setHistorySearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* History Records Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Folio / Fecha & Hora</th>
                <th className="py-3 px-3">Conductor & RUT</th>
                <th className="py-3 px-3">Clases Habilitadas</th>
                <th className="py-3 px-3">Vencimiento & Plazo</th>
                <th className="py-3 px-3">Método de Validación</th>
                <th className="py-3 px-3">Decisión Despacho</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-normal">
              {filteredRecentValidations.length > 0 ? (
                filteredRecentValidations.map((rec) => {
                  const isBlocked = rec.dispatchDecision === 'bloqueo_inmediato';
                  const isWarning = rec.dispatchDecision === 'advertencia_notificada';
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isBlocked ? 'bg-rose-950/15' : isWarning ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Folio and Timestamp */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-bold text-slate-200">
                            {rec.timestamp}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            {rec.id}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {rec.checkpoint}
                          </span>
                        </div>
                      </td>

                      {/* Conductor & RUT */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xs">
                            {rec.fullName}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            RUT: {rec.rut}
                          </span>
                          {rec.auditorName && (
                            <span className="text-[10px] text-slate-500">
                              Auditor: {rec.auditorName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Classes */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {rec.licenseClasses.map((cls) => (
                            <span
                              key={cls}
                              className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Expiry & Days */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono font-semibold text-slate-200 text-xs">
                            {rec.licenseExpiry}
                          </span>
                          <span
                            className={`text-[10px] font-bold mt-0.5 ${
                              rec.daysRemaining < 0
                                ? 'text-rose-400'
                                : rec.daysRemaining <= 15
                                ? 'text-red-400'
                                : rec.daysRemaining <= 30
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {rec.statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* Validation Method */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {rec.validationMethod === 'ocr_camara' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                              <Camera className="w-3 h-3 text-purple-300" />
                              <span>Cámara OCR Gemini</span>
                            </span>
                          ) : rec.validationMethod === 'garita_control' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
                              <ShieldCheck className="w-3 h-3 text-blue-300" />
                              <span>Control Garita 24/7</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                              <span>{rec.methodLabel}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dispatch Decision */}
                      <td className="py-3 px-3">
                        {isBlocked ? (
                          <div className="inline-flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                              <XCircle className="w-3 h-3" />
                              <span>Bloqueo Inmediato</span>
                            </span>
                            <span className="text-[9px] text-rose-400 mt-0.5 font-medium">
                              Infracción Ley 18.290
                            </span>
                          </div>
                        ) : isWarning ? (
                          <div className="inline-flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Advertencia Notificada</span>
                            </span>
                            <span className="text-[9px] text-amber-400 mt-0.5 font-medium">
                              Vencimiento Próximo
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Autorizado</span>
                            </span>
                            <span className="text-[9px] text-emerald-400 mt-0.5 font-medium">
                              Despacho Habilitado
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadSinglePdf(rec)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Descargar Certificado Individual en PDF"
                          >
                            <FileText className="w-3 h-3 text-red-400" />
                            <span>PDF</span>
                          </button>
                          {rec.driverId && (
                            <button
                              onClick={() => {
                                setSelectedLiveDriverId(rec.driverId!);
                                setIsSimulatingCustom(false);
                                showToast(`Conductor ${rec.fullName} cargado en validador de garita.`);
                              }}
                              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                              title="Inspeccionar en Validador de Garita"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <History className="w-8 h-8 text-slate-600" />
                      <p className="text-xs font-medium text-slate-400">
                        No se encontraron registros de validaciones para los filtros aplicados.
                      </p>
                      <button
                        onClick={() => {
                          setHistoryFilterStatus('all');
                          setHistorySearchTerm('');
                        }}
                        className="text-xs text-cyan-400 hover:underline mt-1 cursor-pointer"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Audit Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Trazabilidad en tiempo real: {filteredRecentValidations.length} eventos auditados bajo cadena de custodia.
            </span>
          </div>
          <div className="font-mono text-slate-500 text-[10px]">
            Estándar ISO 39001 / SUSESO 92064-2025 • Folios criptográficos
          </div>
        </div>
      </div>

      {/* 5. DRIVERS REGISTRY TABLE WITH AUDIT & VISUAL ALERTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Table Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Registro General de Conductores ({filteredList.length} de {drivers.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspección visual de fechas de vencimiento, alertas de proximidad y controles de habilitación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export General Registry to PDF */}
            <button
              id="btn-export-general-registry-pdf"
              onClick={handleExportGeneralRegistryPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700/80 hover:bg-red-600 text-white text-xs font-semibold rounded-xl border border-red-500/30 transition shadow-sm cursor-pointer"
              title="Descargar reporte PDF consolidado de toda la nómina filtrada"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar Nómina (PDF)</span>
            </button>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar RUT o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Base */}
            <select
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todas las Bases</option>
              {bases.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Filter Class */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todas las Clases</option>
              <option value="A5">Clase A5 (Tractocamiones)</option>
              <option value="A4">Clase A4 (Carga Simple)</option>
              <option value="A3">Clase A3 (Buses Pasajeros)</option>
              <option value="A2">Clase A2 (Colectivos/Vans)</option>
              <option value="B">Clase B (Vehículos Menores)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({metrics.total})
          </button>
          <button
            onClick={() => setFilterStatus('vencida')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'vencida'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Vencidas ({metrics.vencidas})</span>
          </button>
          <button
            onClick={() => setFilterStatus('urgente')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'urgente'
                ? 'bg-red-600 text-white'
                : 'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Urgente ≤15d ({metrics.urgentes})</span>
          </button>
          <button
            onClick={() => setFilterStatus('proxima')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'proxima'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-950/40 text-amber-300 border border-amber-800/50 hover:bg-amber-900/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Próximas ≤30d ({metrics.proximas})</span>
          </button>
          <button
            onClick={() => setFilterStatus('preventiva')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'preventiva'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-950/40 text-yellow-300 border border-yellow-800/50 hover:bg-yellow-900/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Preventivas 31-60d ({metrics.preventivas})</span>
          </button>
          <button
            onClick={() => setFilterStatus('vigente')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'vigente'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vigentes ({metrics.vigentes})</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Conductor</th>
                <th className="py-3 px-3">Clases</th>
                <th className="py-3 px-3">Base Asignada</th>
                <th className="py-3 px-4">Vencimiento Licencia</th>
                <th className="py-3 px-4">Alerta de Vigencia</th>
                <th className="py-3 px-3">Psicotécnico</th>
                <th className="py-3 px-3">Estado Despacho</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron conductores que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  return (
                    <tr
                      key={item.driver.id}
                      className={`hover:bg-slate-800/40 transition duration-150 ${
                        item.status === 'vencida'
                          ? 'bg-rose-950/15'
                          : item.status === 'urgente'
                          ? 'bg-red-950/15'
                          : item.status === 'proxima'
                          ? 'bg-amber-950/10'
                          : ''
                      }`}
                    >
                      {/* Driver info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.driver.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                            alt={item.driver.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs hover:text-blue-400 transition cursor-pointer"
                               onClick={() => {
                                 setSelectedLiveDriverId(item.driver.id);
                                 setIsSimulatingCustom(false);
                               }}>
                              {item.driver.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {item.driver.rut}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* License Classes */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {item.driver.licenseClass.map((c) => (
                            <span
                              key={c}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono font-bold text-[10px] border border-slate-700"
                              title={CHILEAN_LICENSE_CLASSES[c]?.desc}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Base */}
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {item.driver.assignedBase}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3 px-4">
                        <p className="text-white font-mono font-bold text-xs">
                          {item.driver.licenseExpiry}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Ref: {referenceDate}
                        </p>
                      </td>

                      {/* Status Visual Alert Badge */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${item.badgeClass}`}
                          >
                            {item.status === 'vencida' ? (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            ) : item.status === 'urgente' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            ) : item.status === 'proxima' ? (
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                            ) : item.status === 'preventiva' ? (
                              <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span>{item.statusLabel}</span>
                          </span>

                          {item.isExpired && (
                            <p className="text-[10px] font-bold text-rose-400 animate-pulse">
                              ¡INFRACCIÓN LEY 18.290!
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Psicotécnico */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-slate-300 text-[11px]">
                          {item.driver.psychotechnicalExpiry || 'S/R'}
                        </span>
                      </td>

                      {/* Operational Status */}
                      <td className="py-3 px-3">
                        {item.driver.status === 'habilitado' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                            <Check className="w-3 h-3" /> Habilitado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold">
                            <Lock className="w-3 h-3" /> Bloqueado
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle lock */}
                          {item.driver.status === 'habilitado' ? (
                            <button
                              onClick={() =>
                                toggleDriverStatus(
                                  item.driver.id,
                                  'bloqueado_preventivo',
                                  `Bloqueo por alerta de licencia (${item.statusLabel})`
                                )
                              }
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 transition"
                              title="Bloquear preventivamente en garita"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                toggleDriverStatus(
                                  item.driver.id,
                                  'habilitado',
                                  'Levantamiento de bloqueo tras control documental'
                                )
                              }
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-emerald-300 transition"
                              title="Habilitar conductor"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Notify */}
                          <button
                            onClick={() => handleSendNotification(item.driver)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-300 transition"
                            title="Enviar alerta formal al conductor"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Renew */}
                          <button
                            onClick={() => {
                              setRenewDriver(item.driver);
                              setNewExpiryDate('2028-12-31');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900/60 text-slate-300 hover:text-blue-300 transition"
                            title="Registrar renovación de licencia"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Focus live card */}
                          <button
                            onClick={() => {
                              setSelectedLiveDriverId(item.driver.id);
                              setIsSimulatingCustom(false);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition"
                            title="Ver certificado en vivo"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: REGISTRAR RENOVACIÓN DE LICENCIA */}
      {renewDriver && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">
                  Registrar Renovación de Licencia de Conducir
                </h3>
              </div>
              <button
                onClick={() => setRenewDriver(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRenewal} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white text-sm">{renewDriver.fullName}</p>
                <p className="text-slate-400 font-mono">
                  RUT: {renewDriver.rut} • Clases: {renewDriver.licenseClass.join(', ')}
                </p>
                <p className="text-amber-400 text-[11px]">
                  Fecha Expiración Anterior: {renewDriver.licenseExpiry}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nueva Fecha de Vencimiento Otorgada:
                </label>
                <input
                  type="date"
                  required
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Municipalidad / Dirección de Tránsito Emisora:
                </label>
                <input
                  type="text"
                  required
                  value={municipalityName}
                  onChange={(e) => setMunicipalityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Folio o N° de Documento / Certificado de Tránsito:
                </label>
                <input
                  type="text"
                  value={renewFolio}
                  onChange={(e) => setRenewFolio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Observaciones / Pruebas Prácticas o Visuales:
                </label>
                <textarea
                  value={renewNotes}
                  onChange={(e) => setRenewNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: Aprobado examen visual con lentes ópticos según anotación en padrón..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRenewDriver(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition"
                >
                  Actualizar en Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: NOTIFICAR AL CONDUCTOR POR WHATSAPP / EMAIL */}
      {notifyDriver && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Notificación Formal de Vigencia de Licencia
                </h3>
              </div>
              <button
                onClick={() => setNotifyDriver(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {notifySuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{notifySuccessMessage}</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-white text-sm">{notifyDriver.fullName}</p>
                  <p className="text-slate-400 font-mono">
                    Teléfono: {notifyDriver.phone} • Email: {notifyDriver.email}
                  </p>
                  <p className="text-amber-400 font-semibold">
                    Fecha Vencimiento: {notifyDriver.licenseExpiry}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-semibold">
                    Mensaje Oficial a Enviar:
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-[11px] leading-relaxed">
                    <p className="font-bold text-blue-400 mb-1">
                      [BLINDAJE VIAL - DPTO. PREVENCIÓN DE RIESGOS]
                    </p>
                    <p>Estimado(a) {notifyDriver.fullName}:</p>
                    <p className="mt-1">
                      Le informamos que de acuerdo al registro de dotación de {currentCompany.businessName},
                      su Licencia de Conducir ({notifyDriver.licenseClass.join('/')}) vencerá el día{' '}
                      <strong>{notifyDriver.licenseExpiry}</strong>.
                    </p>
                    <p className="mt-1">
                      En cumplimiento del Art. 110 y 111 de la Ley 18.290 de Tránsito y los estándares de seguridad vial,
                      solicitamos agendar su hora de renovación en su Dirección de Tránsito correspondiente y entregar el nuevo certificado.
                    </p>
                    <p className="mt-1 text-slate-500 text-[10px]">
                      Folio Auditoría: BV-NOTIF-{referenceDate}-{notifyDriver.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Enviar SMS / WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Enviar Correo Electrónico</span>
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setNotifyDriver(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmNotification}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmar y Enviar Alerta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. MODAL: ACTA OFICIAL DE FISCALIZACIÓN (VISTA DE IMPRESIÓN) */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Printable Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  SISTEMA DE GESTIÓN Y AUDITORÍA VIAL BLINDAJE VIAL 360
                </p>
                <h2 className="text-xl font-black text-slate-950">
                  ACTA DE AUDITORÍA Y VIGENCIA DE LICENCIAS DE CONDUCIR
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Empresa: <span className="font-bold">{currentCompany.businessName}</span> (RUT: {currentCompany.rut})
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">FECHA DE EMISIÓN</p>
                <p className="font-mono text-sm font-bold text-slate-950">{referenceDate}</p>
                <p className="text-[10px] text-slate-500">Folio: ACT-LIC-{referenceDate}-01</p>
              </div>
            </div>

            {/* Printable Legal Statement */}
            <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
              <p className="font-bold text-slate-900">
                DECLARACIÓN JURADA DE CUMPLIMIENTO LEY 18.290 ART. 110-111 & LEY 16.744
              </p>
              <p>
                Se certifica que a la fecha señalada, se procedió a la revisión metrológica y documental de las licencias
                de conducir de la totalidad de la dotación activa de conductores asignados a la operación de transporte.
              </p>
              <p>
                Resultado Global: <span className="font-bold text-slate-900">{metrics.total} Conductores Auditados</span> •{' '}
                <span className="font-bold text-emerald-700">{metrics.vigentes} Vigentes</span> •{' '}
                <span className="font-bold text-amber-700">{metrics.proximas + metrics.urgentes} Próximas a vencer</span> •{' '}
                <span className="font-bold text-rose-700">{metrics.vencidas} Vencidas con bloqueo inmediato</span>.
              </p>
            </div>

            {/* Printable Drivers Table */}
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">RUT</th>
                  <th className="p-2 border-r border-slate-300">Conductor</th>
                  <th className="p-2 border-r border-slate-300">Clases</th>
                  <th className="p-2 border-r border-slate-300">Vence</th>
                  <th className="p-2 border-r border-slate-300">Días</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {analyzedDrivers.map((a) => (
                  <tr key={a.driver.id}>
                    <td className="p-2 font-mono text-[11px] border-r border-slate-200">{a.driver.rut}</td>
                    <td className="p-2 font-semibold border-r border-slate-200">{a.driver.fullName}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{a.driver.licenseClass.join(', ')}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{a.driver.licenseExpiry}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{a.daysRemaining}d</td>
                    <td className="p-2 font-bold text-[11px]">
                      {a.status === 'vencida' ? (
                        <span className="text-rose-600">VENCIDA (BLOQUEO)</span>
                      ) : a.status === 'urgente' ? (
                        <span className="text-red-600">URGENTE ≤15D</span>
                      ) : a.status === 'proxima' ? (
                        <span className="text-amber-600">PRÓXIMA ≤30D</span>
                      ) : (
                        <span className="text-emerald-700">CONFORME</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs">
              <div className="text-center space-y-1">
                <div className="border-b border-slate-400 w-48 mx-auto h-12" />
                <p className="font-bold text-slate-900">Encargado Prevención de Riesgos</p>
                <p className="text-slate-500">Transportes TransAndina SpA</p>
              </div>
              <div className="text-center space-y-1">
                <div className="border-b border-slate-400 w-48 mx-auto h-12" />
                <p className="font-bold text-slate-900">Supervisor de Garita y Despacho</p>
                <p className="text-slate-500">Blindaje Vial SpA</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Imprimir Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver License Camera OCR & Verification Modal */}
      <DriverLicenseCameraOcrModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        referenceDate={referenceDate}
        drivers={drivers}
        onApplyToLiveValidator={handleOcrApplied}
        onUpdateDriverExpiry={(driverId, newDate) => {
          updateDriver(driverId, { licenseExpiry: newDate });
          showToast('Fecha de vencimiento actualizada en la ficha oficial del conductor.');
        }}
        onBlockDriver={(driverId, reason) => {
          toggleDriverStatus(driverId, 'bloqueado_preventivo', reason);
          showToast('Bloqueo preventivo de despacho ordenado por licencia vencida.');
        }}
      />
    </div>
  );
};
