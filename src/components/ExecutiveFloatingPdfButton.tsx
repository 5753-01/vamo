import React, { useState } from 'react';
import { FileDown, Printer, HelpCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { PrintGuideDialog } from './PrintGuideDialog';

interface ExecutiveFloatingPdfButtonProps {
  /** Optional custom title or report name */
  reportName?: string;
  /** Optional callback before calling window.print */
  onBeforePrint?: () => void;
  /** Optional bottom offset class (defaults to bottom-6 sm:bottom-8) */
  className?: string;
}

export const ExecutiveFloatingPdfButton: React.FC<ExecutiveFloatingPdfButtonProps> = ({
  reportName = 'Informe Ejecutivo de Cumplimiento',
  onBeforePrint,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handlePrintClick = () => {
    if (onBeforePrint) {
      onBeforePrint();
    }
    // Launch native browser print dialog
    window.print();
  };

  return (
    <>
      <aside
        aria-label="Controles de exportación PDF"
        className={`fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 no-print ${className}`}
      >
        <div className="relative group">
          {/* Subtle Attention Glow Ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 rounded-full blur-sm opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />

          {/* Floating Action Button Group */}
          <div className="relative flex items-stretch rounded-full bg-slate-900 border border-blue-400/40 shadow-2xl shadow-blue-950/80 overflow-hidden">
            {/* Primary Action Button */}
            <button
              id="executive-floating-pdf-btn"
              onClick={handlePrintClick}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-4 py-3 sm:px-5 sm:py-3.5 transition-all duration-200 cursor-pointer select-none"
              title="Generar PDF del Panel Ejecutivo vía ventana de impresión del navegador"
              aria-label="Generar PDF del panel ejecutivo"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <FileDown className="w-4 h-4 text-white" />
              </div>

              <div className="flex flex-col items-start leading-none text-left">
                <span className="font-extrabold tracking-wide flex items-center gap-1.5">
                  <span>Generar PDF</span>
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse hidden sm:inline" />
                </span>
                <span className="text-[10px] text-blue-200 font-mono mt-0.5 opacity-90">
                  A4 • SUSESO 92064
                </span>
              </div>
            </button>

            {/* Quick Guide Trigger Button */}
            <button
              id="executive-floating-guide-btn"
              onClick={() => setShowGuideModal(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border-l border-blue-500/30 px-3 flex items-center justify-center transition cursor-pointer"
              title="Ver guía de ajustes periciales para impresión (Gráficos de fondo, A4, márgenes)"
              aria-label="Guía de impresión de PDF"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Floating Instructions Tooltip Card */}
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-3 w-80 bg-slate-950/95 border border-blue-500/40 text-slate-200 text-xs rounded-2xl p-4 shadow-2xl backdrop-blur-md z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>Impresión Nativa & PDF A4</span>
                </div>
                <span className="text-[9px] font-mono bg-blue-950 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full font-bold">
                  @media print
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
                Al hacer clic se abrirá el cuadro de diálogo de impresión del navegador con el formato oficial de <strong>Blindaje Vial 360</strong>.
              </p>

              <div className="space-y-1.5 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 text-[11px]">
                <div className="flex items-start gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Destino:</strong> Seleccione «Guardar como PDF»</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Más ajustes:</strong> Active «Gráficos de fondo»</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Atajo de teclado: <strong className="font-mono text-slate-200">Ctrl+P</strong></span>
                <span className="text-blue-400 font-semibold">Clic en «?» para la guía</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Embedded Print Guide Dialog */}
      <PrintGuideDialog
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onConfirmPrint={() => window.print()}
      />
    </>
  );
};
