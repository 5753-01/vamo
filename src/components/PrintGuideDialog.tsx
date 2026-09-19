import React, { useState } from 'react';
import {
  Printer,
  Info,
  CheckCircle2,
  X,
  FileText,
  Sliders,
  Sparkles,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface PrintGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint?: () => void;
}

export const PrintGuideDialog: React.FC<PrintGuideDialogProps> = ({
  isOpen,
  onClose,
  onConfirmPrint
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    onClose();
    // Allow brief render cycle before launching native print dialog
    setTimeout(() => {
      if (onConfirmPrint) {
        onConfirmPrint();
      } else {
        window.print();
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-guide-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 id="print-guide-title" className="text-sm font-bold text-white tracking-wide">
                Guía de Impresión Óptima • Blindaje Vial 360
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Ajustes recomendados para el diálogo nativo del navegador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            aria-label="Cerrar guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Las plantillas e informes ejecutivos de <strong>Blindaje Vial 360</strong> cuentan con reglas CSS de alta fidelidad para impresión y exportación pericial. Siga estas 3 recomendaciones en el cuadro nativo de su navegador:
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Recommendation 1: Gráficos de fondo */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>Activar «Gráficos de fondo»</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                    Esencial
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  En <em>Más opciones / Más ajustes</em>, marque la casilla <strong>Gráficos de fondo</strong> (Background graphics) para conservar los colores normativos de aptitud, sellos e indicadores Recharts.
                </p>
              </div>
            </div>

            {/* Recommendation 2: Tamaño y Orientación */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>Tamaño A4 o Carta • Orientación Vertical</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  El layout está diseñado bajo estándar métrico internacional A4 (o Carta/Letter) en formato vertical, garantizando saltos de página limpios y proporciones de tabla auditables.
                </p>
              </div>
            </div>

            {/* Recommendation 3: Encabezados y pie de página */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>Desmarcar «Encabezados y pies de página»</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                    Opcional
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Desactive esta casilla para evitar que el navegador añada la URL o fecha en el margen exterior, ya que el informe ya integra su propio sello de fecha, RUT y firma criptográfica.
                </p>
              </div>
            </div>
          </div>

          {/* Quick tip badge */}
          <div className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Atajo de teclado rápido:</span>
            </span>
            <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              Ctrl + P / ⌘ + P
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            Entendido
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Abrir Diálogo de Impresión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
