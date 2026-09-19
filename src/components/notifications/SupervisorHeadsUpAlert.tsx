import React, { useEffect, useState } from 'react';
import { RealtimePushNotification, NavView } from '../../types';
import {
  AlertOctagon,
  CalendarX,
  X,
  ArrowRight,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  BellRing
} from 'lucide-react';

interface SupervisorHeadsUpAlertProps {
  notification: RealtimePushNotification | null;
  onDismiss: () => void;
  onNavigate?: (view: NavView) => void;
  onAcknowledge?: (id: string) => void;
}

export const SupervisorHeadsUpAlert: React.FC<SupervisorHeadsUpAlertProps> = ({
  notification,
  onDismiss,
  onNavigate,
  onAcknowledge
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      // Auto dismiss after 20 seconds if not acknowledged
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 20000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification]);

  if (!notification || !visible) return null;

  const isCritical = notification.severity === 'critica';
  const isTest = notification.type === 'high_risk_test';
  const isExpired = notification.type === 'license_expired';

  const handleAction = () => {
    if (onAcknowledge) {
      onAcknowledge(notification.id);
    }
    if (notification.targetView && onNavigate) {
      onNavigate(notification.targetView);
    }
    setVisible(false);
    onDismiss();
  };

  const handleAckOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAcknowledge) {
      onAcknowledge(notification.id);
    }
    setVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed top-16 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300">
      <div
        className={`rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all ${
          isCritical
            ? 'bg-rose-950/95 border-rose-500/80 text-rose-100 shadow-rose-950/50 ring-2 ring-rose-500/40'
            : 'bg-amber-950/95 border-amber-500/80 text-amber-100 shadow-amber-950/50 ring-2 ring-amber-500/40'
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/15">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isCritical ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'} animate-pulse`}>
              {isTest ? (
                <ShieldAlert className="w-5 h-5" />
              ) : isExpired ? (
                <CalendarX className="w-5 h-5" />
              ) : (
                <BellRing className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                  isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  ALERTA SUPERVISOR EN TIEMPO REAL
                </span>
                <span className="text-[10px] font-mono text-white/70">
                  {new Date(notification.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 leading-tight">
                {notification.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-2.5 text-xs text-white/90 leading-relaxed">
          <p>{notification.body}</p>

          {/* Test Specific Snippet */}
          {notification.testData && (
            <div className="mt-2.5 bg-black/40 rounded-lg p-2.5 border border-white/10 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/60">Conductor:</span>
                <span className="font-bold text-white">{notification.testData.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">RUT / Base:</span>
                <span className="text-white">{notification.testData.driverRut} • {notification.testData.driverBase}</span>
              </div>
              {notification.testData.alcoholValueGramsPerLiter > 0 && (
                <div className="flex justify-between text-rose-300 font-bold">
                  <span>Alcohotest:</span>
                  <span>{notification.testData.alcoholValueGramsPerLiter.toFixed(2)} g/L (BLOQUEADO)</span>
                </div>
              )}
              {notification.testData.reactiveDrugs && notification.testData.reactiveDrugs.length > 0 && (
                <div className="flex justify-between text-rose-300 font-bold">
                  <span>Panel Drogas:</span>
                  <span>{notification.testData.reactiveDrugs.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* License Specific Snippet */}
          {notification.licenseData && (
            <div className="mt-2.5 bg-black/40 rounded-lg p-2.5 border border-white/10 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/60">Conductor:</span>
                <span className="font-bold text-white">{notification.licenseData.driverName} ({notification.licenseData.driverRut})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Vencimiento:</span>
                <span className="font-bold text-rose-300">
                  {notification.licenseData.licenseExpiry} ({notification.licenseData.daysOverdue > 0 ? `${notification.licenseData.daysOverdue} días vencida` : `vence en ${Math.abs(notification.licenseData.daysOverdue)} días`})
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-white/70">
                <span>Normativa:</span>
                <span>{notification.licenseData.legalArticle}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
          <button
            onClick={handleAckOnly}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Confirmar Lectura</span>
          </button>

          <button
            onClick={handleAction}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition shadow cursor-pointer ${
              isCritical
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/50'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/50'
            }`}
          >
            <span>{isTest ? 'Ver Garita de Control' : 'Abrir Validador'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
