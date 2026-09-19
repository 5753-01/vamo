import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RealtimePushNotification, RoleType, NavView } from '../../types';
import { pushNotificationService } from '../../services/pushNotificationService';
import {
  Bell,
  ShieldAlert,
  CalendarX,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  SlidersHorizontal,
  Flame,
  UserCheck,
  Truck,
  CheckCheck
} from 'lucide-react';

interface SupervisorPushNotificationCenterProps {
  onNavigate?: (view: NavView) => void;
}

export const SupervisorPushNotificationCenter: React.FC<SupervisorPushNotificationCenterProps> = ({
  onNavigate
}) => {
  const {
    currentUser,
    drivers,
    realtimePushNotifications,
    unreadPushCount,
    criticalPushCount,
    acknowledgePushNotification,
    checkLicenseExpirationsNow,
    sendPushNotification
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high_risk' | 'license' | 'unacknowledged'>('all');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Subscribe to connection status and browser permission
  useEffect(() => {
    setBrowserPermission(pushNotificationService.getPermissionStatus());
    setSoundEnabled(pushNotificationService.isSoundEnabled());

    const unsubscribeStatus = pushNotificationService.subscribeStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubscribeStatus();
    };
  }, []);

  const handleRequestBrowserPermission = async () => {
    const permission = await pushNotificationService.requestPermission();
    setBrowserPermission(permission);
    if (permission === 'granted') {
      pushNotificationService.playAlertSound('standard_chime');
      setFeedbackMessage('¡Permiso de notificaciones push concedido exitosamente!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    pushNotificationService.setSoundEnabled(next);
    if (next) {
      pushNotificationService.playAlertSound('standard_chime');
    }
  };

  const handleScanLicenses = async () => {
    setIsScanning(true);
    try {
      const generated = await checkLicenseExpirationsNow();
      if (generated.length > 0) {
        setFeedbackMessage(`Se detectaron y notificaron ${generated.length} licencias vencidas o por vencer.`);
      } else {
        setFeedbackMessage('Escaneo finalizado: Todas las licencias de la flota se encuentran vigentes.');
      }
    } catch (err) {
      console.warn('Error scanning licenses:', err);
    } finally {
      setIsScanning(false);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleSimulateHighRiskTest = async () => {
    pushNotificationService.playAlertSound('urgent_alarm');
    const testCode = `CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await sendPushNotification({
      type: 'high_risk_test',
      severity: 'critica',
      title: '🚨 TEST ALTO RIESGO EN TERRENO: Alcohotest 0.65 g/L (Garita Maipú)',
      body: 'Control preventivo obligatorio detectó 0.65 g/L en conductor Manuel Silva (RUT 13.921.844-5). Despacho bloqueado de inmediato según Ley 18.290 y protocolo de tolerancia cero.',
      companyId: currentUser.companyId,
      targetRoles: ['supervisor', 'prevencionista', 'company_admin', 'superadmin'],
      testData: {
        testId: `tst-${Date.now()}`,
        testCode,
        driverId: 'drv-003',
        driverName: 'Manuel Silva',
        driverRut: '13.921.844-5',
        driverBase: 'Garita Maipú Terminal Sur',
        vehiclePlate: 'LPT-442',
        operatorName: `${currentUser.name} (Garita Maipú)`,
        alcoholValueGramsPerLiter: 0.65,
        alcoholStatus: 'positivo_ebriedad',
        drugsOverallStatus: 'negativo',
        riskReason: 'Alcohotest positivo sobre tolerancia cero (0.65 g/L)',
        actionRequired: 'Bloqueo inmediato de despacho, relevo de ruta y acta de infracción'
      },
      targetView: 'tests',
      audioChime: 'urgent_alarm'
    });
    setFeedbackMessage('Test de alto riesgo simulado y transmitido a todos los supervisores en tiempo real.');
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleSimulateLicenseExpiry = async () => {
    pushNotificationService.playAlertSound('warning_beep');
    await sendPushNotification({
      type: 'license_expired',
      severity: 'critica',
      title: '📅 LICENCIA VENCIDA (Ley 18.290 Art. 110): Roberto Arriagada',
      body: 'El conductor Roberto Arriagada (RUT 15.632.110-K, Base Concepción) registra licencia Clase A3 vencida desde hace 5 días. Prohibido asignar turnos o despachos de pasajeros.',
      companyId: currentUser.companyId,
      targetRoles: ['supervisor', 'prevencionista', 'company_admin', 'superadmin'],
      licenseData: {
        driverId: 'drv-009',
        driverName: 'Roberto Arriagada',
        driverRut: '15.632.110-K',
        driverBase: 'Base Concepción',
        licenseClass: ['A3'],
        licenseExpiry: '2026-09-08',
        daysOverdue: 5,
        isExpired: true,
        legalArticle: 'Art. 110-111 Ley 18.290 de Tránsito',
        companyName: currentUser.companyName
      },
      targetView: 'license_validator',
      audioChime: 'urgent_alarm'
    });
    setFeedbackMessage('Notificación de licencia vencida emitida en tiempo real a los supervisores.');
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleAcknowledge = async (id: string) => {
    await acknowledgePushNotification(id, currentUser.name);
  };

  const handleNavigateToView = (view?: NavView) => {
    if (view && onNavigate) {
      onNavigate(view);
      setIsOpen(false);
    }
  };

  // Filtered items
  const filteredNotifications = realtimePushNotifications.filter((n) => {
    if (filter === 'high_risk') return n.type === 'high_risk_test';
    if (filter === 'license') return n.type === 'license_expired' || n.type === 'license_expiring_soon';
    if (filter === 'unacknowledged') return !n.isAcknowledged;
    return true;
  });

  const highRiskCount = realtimePushNotifications.filter((n) => n.type === 'high_risk_test').length;
  const licenseCount = realtimePushNotifications.filter((n) => n.type === 'license_expired' || n.type === 'license_expiring_soon').length;
  const unacknowledgedCount = realtimePushNotifications.filter((n) => !n.isAcknowledged).length;

  return (
    <>
      {/* Trigger Button in Navbar / Header */}
      <button
        id="btn-supervisor-push-bell"
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
          criticalPushCount > 0
            ? 'bg-rose-950/70 border-rose-600 text-rose-200 shadow-md shadow-rose-950/40 hover:bg-rose-900/80'
            : unreadPushCount > 0
            ? 'bg-amber-950/50 border-amber-600 text-amber-200 hover:bg-amber-900/60'
            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
        }`}
        title="Centro de Notificaciones Push en Tiempo Real para Supervisores"
      >
        <div className="relative">
          <Bell className={`w-4 h-4 ${criticalPushCount > 0 ? 'text-rose-400 animate-bounce' : 'text-blue-400'}`} />
          {/* Real-time pulse dot */}
          <span
            className={`absolute -top-1 -left-1 w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : connectionStatus === 'connecting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-500'
            }`}
            title={`WebSocket: ${connectionStatus}`}
          />
        </div>

        <span className="hidden md:inline font-bold">Push Supervisores</span>

        {/* Counter Badge */}
        {unreadPushCount > 0 && (
          <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full ${
            criticalPushCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-600 text-white'
          }`}>
            {unreadPushCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Modal Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-2xl bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">
                      Alertas Push en Tiempo Real
                    </h3>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
                      SUPERVISORES 24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Detección instantánea de Tests de Alto Riesgo y Vencimientos de Licencia (Ley 18.290 / SUSESO)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connectivity & Device Settings Banner */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
              {/* WebSocket Live Status */}
              <div className="flex items-center gap-2">
                {connectionStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    WebSocket En Vivo (Puerto 3000)
                  </span>
                ) : connectionStatus === 'connecting' ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Conectando canal en tiempo real...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                    <WifiOff className="w-3 h-3 text-slate-500" />
                    Canal Desconectado (Modo Polling)
                  </span>
                )}
              </div>

              {/* Right Controls: Browser Push & Audio Chime */}
              <div className="flex items-center gap-2">
                {/* Browser Push Permission Toggle */}
                {browserPermission === 'granted' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Push Navegador Activo
                  </span>
                ) : browserPermission === 'denied' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/60 text-rose-300 border border-rose-800 text-[11px]" title="Permiso bloqueado en el navegador">
                    Push Bloqueado
                  </span>
                ) : (
                  <button
                    onClick={handleRequestBrowserPermission}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition shadow cursor-pointer"
                  >
                    <Bell className="w-3 h-3" />
                    Activar Push Navegador
                  </button>
                )}

                {/* Sound Toggle */}
                <button
                  onClick={handleToggleSound}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition cursor-pointer ${
                    soundEnabled
                      ? 'bg-slate-800 text-blue-300 border-blue-500/40 hover:bg-slate-750'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700 line-through'
                  }`}
                  title={soundEnabled ? 'Silenciar alertas sonoras' : 'Activar alertas sonoras'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{soundEnabled ? 'Alarma ON' : 'Silencio'}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Tools Bar */}
            <div className="px-6 py-3 bg-slate-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  id="btn-scan-licenses-realtime"
                  disabled={isScanning}
                  onClick={handleScanLicenses}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition cursor-pointer disabled:opacity-50"
                  title="Verifica en tiempo real todas las fechas de vencimiento de licencias de la flota"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Escaneando Licencias...' : 'Escanear Vencimientos Ahora'}</span>
                </button>

                <button
                  id="btn-simulate-high-risk-test"
                  onClick={handleSimulateHighRiskTest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition cursor-pointer"
                  title="Prueba la emisión de una alerta de test de alto riesgo con alarma y push"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Simular Test 0.65 g/L</span>
                </button>

                <button
                  id="btn-simulate-license-expired"
                  onClick={handleSimulateLicenseExpiry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition cursor-pointer"
                  title="Prueba la emisión de una alerta por licencia vencida"
                >
                  <CalendarX className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simular Licencia Vencida</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {drivers.length} Conductores en Flota
              </span>
            </div>

            {/* Feedback Message if any */}
            {feedbackMessage && (
              <div className="mx-6 mt-3 p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="px-6 pt-3 pb-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Todas ({realtimePushNotifications.length})
              </button>

              <button
                onClick={() => setFilter('high_risk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filter === 'high_risk'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Tests de Alto Riesgo ({highRiskCount})</span>
              </button>

              <button
                onClick={() => setFilter('license')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filter === 'license'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <CalendarX className="w-3.5 h-3.5 text-amber-400" />
                <span>Licencias Vencidas / Por Vencer ({licenseCount})</span>
              </button>

              <button
                onClick={() => setFilter('unacknowledged')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filter === 'unacknowledged'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                <span>Pendientes de Atención ({unacknowledgedCount})</span>
              </button>
            </div>

            {/* Notifications Scrollable List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">
                    No hay notificaciones push en este filtro
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    El sistema supervisa continuamente los controles de alcohotest en garitas y el estado de las licencias de conducir de la flota.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isCritical = notif.severity === 'critica';
                  const isHighRiskTest = notif.type === 'high_risk_test';
                  const isLicense = notif.type === 'license_expired' || notif.type === 'license_expiring_soon';

                  return (
                    <div
                      key={notif.id}
                      className={`rounded-xl border p-4 transition-all duration-200 ${
                        isCritical
                          ? 'bg-rose-950/20 border-rose-800/60 hover:border-rose-600'
                          : notif.severity === 'alta'
                          ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-600'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {/* Top Meta Line */}
                      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                              isCritical
                                ? 'bg-rose-600 text-white'
                                : notif.severity === 'alta'
                                ? 'bg-amber-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {notif.severity}
                          </span>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(notif.timestamp).toLocaleString('es-CL', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* Acknowledged Badge */}
                        {notif.isAcknowledged ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            <CheckCheck className="w-3 h-3" />
                            Atendido por {notif.acknowledgedBy}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(notif.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded border border-amber-700 transition cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Atender Alerta
                          </button>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="pt-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {isHighRiskTest ? (
                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <CalendarX className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <span>{notif.title}</span>
                        </h4>

                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {notif.body}
                        </p>

                        {/* Structured High Risk Test Details */}
                        {notif.testData && (
                          <div className="mt-3 bg-slate-950/80 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5 font-mono">
                            <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px]">
                              <span>Folio Control: <strong className="text-slate-200">{notif.testData.testCode}</strong></span>
                              <span>Operador: <strong className="text-slate-200">{notif.testData.operatorName}</strong></span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px]">
                              <span>Conductor: <strong className="text-slate-200">{notif.testData.driverName} ({notif.testData.driverRut})</strong></span>
                              <span>Vehículo: <strong className="text-slate-200">{notif.testData.vehiclePlate || 'S/P'}</strong></span>
                            </div>
                            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-rose-400 font-bold">
                              <span>Motivo de Bloqueo:</span>
                              <span>{notif.testData.riskReason}</span>
                            </div>
                            <div className="text-[11px] text-amber-300/90 font-sans">
                              📌 Acción requerida: {notif.testData.actionRequired}
                            </div>
                          </div>
                        )}

                        {/* Structured License Details */}
                        {notif.licenseData && (
                          <div className="mt-3 bg-slate-950/80 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5 font-mono">
                            <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px]">
                              <span>Conductor: <strong className="text-slate-200">{notif.licenseData.driverName}</strong></span>
                              <span>RUT: <strong className="text-slate-200">{notif.licenseData.driverRut}</strong></span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px]">
                              <span>Clase: <strong className="text-slate-200">{notif.licenseData.licenseClass.join('/')}</strong></span>
                              <span>Vencimiento: <strong className={notif.licenseData.isExpired ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                                {notif.licenseData.licenseExpiry} ({notif.licenseData.daysOverdue > 0 ? `${notif.licenseData.daysOverdue} días vencida` : `vence en ${Math.abs(notif.licenseData.daysOverdue)} días`})
                              </strong></span>
                            </div>
                            <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex justify-between">
                              <span>Marco Legal:</span>
                              <span className="text-slate-300 font-semibold">{notif.licenseData.legalArticle}</span>
                            </div>
                          </div>
                        )}

                        {/* Bottom Actions Bar */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400">
                            ID: {notif.id}
                          </span>

                          <div className="flex items-center gap-2">
                            {notif.targetView && (
                              <button
                                onClick={() => handleNavigateToView(notif.targetView)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition cursor-pointer"
                              >
                                <span>{isHighRiskTest ? 'Ver Garita de Test' : 'Ver Validador de Licencias'}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 text-xs text-slate-400 flex items-center justify-between">
              <div>
                Supervisando como: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role})
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-rose-400 font-bold">{criticalPushCount} Críticas</span>
                <span>•</span>
                <span className="text-slate-300">{realtimePushNotifications.length} Históricas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
