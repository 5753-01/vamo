import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ChecklistTemplate,
  ChecklistInspectionExecution,
  Company
} from '../types';
import {
  VEHICLE_CATEGORY_LABELS,
  TRANSPORT_OPERATION_LABELS
} from '../data/checklistTemplatesData';

/**
 * Loads the official Blindaje Vial logo image as base64 data URL from /public
 */
async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo.jpg');
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Could not load logo as base64, using vector fallback', err);
    return null;
  }
}

/**
 * Draws the official Blindaje Vial 360 Shield Logo Vector Fallback
 */
function drawVectorEmblem(doc: jsPDF, x: number, y: number, size: number = 18): void {
  // Bezel / Outer Shield
  doc.setFillColor(30, 41, 59); // slate-800
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  
  // Custom shield shape
  doc.roundedRect(x, y, size, size, 2.5, 2.5, 'FD');
  
  // Inner gradient simulation
  doc.setFillColor(37, 99, 235); // blue-600
  doc.roundedRect(x + 1, y + 1, size - 2, size - 2, 2, 2, 'F');

  // Checkmark symbol
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.2);
  doc.line(x + size * 0.28, y + size * 0.52, x + size * 0.44, y + size * 0.70);
  doc.line(x + size * 0.44, y + size * 0.70, x + size * 0.76, y + size * 0.34);
}

/**
 * Generates an official, printable BLANK Checklist Template PDF
 * For physical inspections, audits, and ISO 39001 standard operating procedures.
 */
export async function generateChecklistTemplateBlankPDF(
  template: ChecklistTemplate,
  company: Company,
  userNotes?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const logoBase64 = await loadLogoBase64();

  // Top header navy banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent blue/sky strip
  doc.setFillColor(2, 132, 199); // sky-600
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Logo rendering
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'JPEG', margin, 5, 18, 18);
    } catch {
      drawVectorEmblem(doc, margin, 5, 18);
    }
  } else {
    drawVectorEmblem(doc, margin, 5, 18);
  }

  // Header Brand & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BLINDAJE VIAL 360', margin + 22, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('PROGRAMA DE SEGURIDAD VIAL LABORAL & GESTIÓN DE FLOTA', margin + 22, 17);
  doc.text('Ley 18.290 • Ley 16.744 • Dictamen SUSESO 92064-2025 • ISO 39001 / ISO 37301', margin + 22, 22);

  // Right Header Document Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('FORMATO OFICIAL DE INSPECCIÓN', pageWidth - margin, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`Código: ${template.code}`, pageWidth - margin, 16, { align: 'right' });
  doc.text(`Versión: ${template.version} • Vigente`, pageWidth - margin, 21, { align: 'right' });

  let currentY = 34;

  // Title Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(template.name.toUpperCase(), margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const splitDesc = doc.splitTextToSize(template.description, pageWidth - margin * 2 - 8);
  doc.text(splitDesc, margin + 4, currentY + 12);

  currentY += 24;

  // Operational Metadata Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 17, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Empresa:', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.businessName} (RUT: ${company.rut})`, margin + 20, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Mutualidad:', margin + 4, currentY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${company.mutualidad} • Base / Faena: ___________________________`, margin + 20, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Vehículos:', margin + 100, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(template.applicableVehicleTypes.slice(0, 3).join(', '), margin + 116, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Frecuencia:', margin + 100, currentY + 10);
  doc.setFont('helvetica', 'normal');
  const freqLabel =
    template.frequency === 'pre_uso_diario'
      ? 'Pre-Uso Diario'
      : template.frequency === 'antes_despacho'
      ? 'Antes de Cada Despacho'
      : 'Semanal';
  doc.text(`${freqLabel} • Política: Bloqueo Inmediato por Ítems Críticos`, margin + 116, currentY + 10);

  currentY += 21;

  // Fields to fill on physical inspection
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 14, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('DATOS DEL SERVICIO EN TERRENO / GARITA:', margin + 3, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.text('Fecha: ____/____/2026   Hora: ____:____   Patente Unidad: ____________   Patente Rampla: ____________', margin + 3, currentY + 9);
  doc.text('Conductor: ____________________________________  RUT: _________________  Odómetro: ____________ km', margin + 3, currentY + 13);

  currentY += 17;

  // Build items table
  const tableRows: any[] = [];

  template.sections.forEach((sec, sIdx) => {
    // Section Header Row
    tableRows.push([
      {
        content: `${sec.title.toUpperCase()}`,
        colSpan: 5,
        styles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 2
        }
      }
    ]);

    sec.items.forEach((item, iIdx) => {
      const critBadge =
        item.criticality === 'CRITICO'
          ? '[CRÍTICO]'
          : item.criticality === 'MAYOR'
          ? '[MAYOR]'
          : '[MENOR]';

      const fieldHint =
        item.fieldType === 'numerico'
          ? `(Medir en ${item.numericUnit || 'uds'})`
          : item.fieldType === 'fecha'
          ? '(Vencimiento)'
          : '';

      tableRows.push([
        `${sec.title.split('.')[0] || sIdx + 1}.${iIdx + 1}`,
        `${item.label} ${fieldHint}\nNorma: ${item.normativeReference || 'N/A'}${item.description ? `\nCriterio: ${item.description}` : ''}`,
        critBadge,
        '[  ] C    [  ] NC    [  ] N/A',
        ''
      ]);
    });
  });

  autoTable(doc, {
    startY: currentY,
    head: [['N°', 'Punto de Chequeo & Criterio Normativo', 'Criticidad', 'Estado', 'Observaciones / Hallazgo']],
    body: tableRows,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 92 },
      2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 32, halign: 'center' },
      4: { cellWidth: 'auto' }
    },
    didParseCell: (data) => {
      if (data.row.raw && Array.isArray(data.row.raw) && data.row.raw[2] === '[CRÍTICO]') {
        if (data.column.index === 2) {
          data.cell.styles.textColor = [190, 18, 60]; // rose-700
        }
      }
    }
  });

  // Footer / Signatures
  let finalY = (doc as any).lastAutoTable?.finalY || currentY + 60;
  if (finalY > pageHeight - 35) {
    doc.addPage();
    finalY = 20;
  }

  finalY += 6;

  // Signatures Box
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, finalY, (pageWidth - margin * 2) / 2 - 2, 22);
  doc.rect(margin + (pageWidth - margin * 2) / 2 + 2, finalY, (pageWidth - margin * 2) / 2 - 2, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Firma Conductor / Operador de Turno', margin + 4, finalY + 18);
  doc.text('Declaro haber realizado o verificado el chequeo previo', margin + 4, finalY + 20.5);

  doc.text('Firma y Timbre Inspector de Garita / Prevención', margin + (pageWidth - margin * 2) / 2 + 6, finalY + 18);
  doc.text('Autorización formal de despacho bajo Ley 18.290', margin + (pageWidth - margin * 2) / 2 + 6, finalY + 20.5);

  // Download PDF
  const filename = `Plantilla_Checklist_${template.code}_${template.version.replace('.', '_')}.pdf`;
  doc.save(filename);
}

/**
 * Generates an official Legal Audit PDF for a COMPLETED Inspection Execution
 * Includes captured findings, compliance percentage, dispatch decision,
 * cryptographic timestamp hash, and Blindaje Vial official seal.
 */
export async function generateInspectionReportPDF(
  inspection: ChecklistInspectionExecution,
  template: ChecklistTemplate,
  company: Company
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const logoBase64 = await loadLogoBase64();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Decision Strip Accent
  if (inspection.dispatchDecision === 'AUTORIZADO') {
    doc.setFillColor(16, 185, 129); // emerald-500
  } else if (inspection.dispatchDecision === 'CONDICIONADO') {
    doc.setFillColor(245, 158, 11); // amber-500
  } else {
    doc.setFillColor(225, 29, 72); // rose-600
  }
  doc.rect(0, 0, pageWidth, 3.5, 'F');

  // Official Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'JPEG', margin, 5, 18, 18);
    } catch {
      drawVectorEmblem(doc, margin, 5, 18);
    }
  } else {
    drawVectorEmblem(doc, margin, 5, 18);
  }

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BLINDAJE VIAL 360', margin + 22, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('ACTA OFICIAL DE INSPECCIÓN PRE-USO & CONTROL OPERACIONAL DE FLOTA', margin + 22, 17);
  doc.text('Ley N° 18.290 • Ley N° 16.744 • Dictamen SUSESO N° 92064-2025 • ISO 39001', margin + 22, 22);

  // Right Header Folio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248);
  doc.text(`FOLIO: ${inspection.folio}`, pageWidth - margin, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`Fecha: ${inspection.date} ${inspection.time} hrs`, pageWidth - margin, 16, { align: 'right' });
  doc.text(`Base: ${inspection.checkpoint}`, pageWidth - margin, 21, { align: 'right' });

  let currentY = 33;

  // Decision Banner Box
  const isApproved = inspection.dispatchDecision === 'AUTORIZADO';
  const isBlocked = inspection.dispatchDecision === 'BLOQUEO_INMEDIATO';

  if (isApproved) {
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(52, 211, 153);
  } else if (isBlocked) {
    doc.setFillColor(255, 241, 242); // rose-50
    doc.setDrawColor(251, 113, 133);
  } else {
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(251, 191, 36);
  }
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (isApproved) {
    doc.setTextColor(6, 95, 70);
    doc.text('DICTAMEN: DESPACHO AUTORIZADO (CONFORME)', margin + 5, currentY + 6.5);
  } else if (isBlocked) {
    doc.setTextColor(159, 18, 57);
    doc.text('DICTAMEN: BLOQUEO INMEDIATO DE DESPACHO (NO AUTORIZADO)', margin + 5, currentY + 6.5);
  } else {
    doc.setTextColor(146, 64, 14);
    doc.text('DICTAMEN: DESPACHO CONDICIONADO A REPARACIÓN MENOR', margin + 5, currentY + 6.5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  const decisionText = `Cumplimiento: ${inspection.complianceScore.toFixed(1)}% | Fallas Críticas: ${inspection.criticalDefectsCount} | Fallas Mayores: ${inspection.majorDefectsCount} | Fallas Menores: ${inspection.minorDefectsCount}.\nMotivo: ${inspection.dispatchDecisionReason}`;
  const splitMotivo = doc.splitTextToSize(decisionText, pageWidth - margin * 2 - 10);
  doc.text(splitMotivo, margin + 5, currentY + 11.5);

  currentY += 22;

  // Metadata Grid: Vehicle, Driver, Company
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);

  // Column 1
  doc.text('DATOS DE LA EMPRESA & BASE', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Empresa: ${company.businessName}`, margin + 4, currentY + 9);
  doc.text(`RUT: ${company.rut} • Mutual: ${company.mutualidad}`, margin + 4, currentY + 13);
  doc.text(`Operación: ${TRANSPORT_OPERATION_LABELS[inspection.operationType]?.label || inspection.operationType}`, margin + 4, currentY + 17);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DATOS DEL VEHÍCULO', margin + 68, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Patente: ${inspection.vehiclePlate}`, margin + 68, currentY + 9);
  doc.text(`Categoría: ${inspection.vehicleType}`, margin + 68, currentY + 13);
  doc.text(`Odómetro: ${inspection.odometerKm ? `${inspection.odometerKm.toLocaleString('es-CL')} km` : 'No registrado'}`, margin + 68, currentY + 17);

  // Column 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CONDUCTOR & AUDITOR', margin + 128, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Conductor: ${inspection.driverName}`, margin + 128, currentY + 9);
  doc.text(`RUT: ${inspection.driverRut}`, margin + 128, currentY + 13);
  doc.text(`Inspector: ${inspection.inspectorName} (${inspection.inspectorRole})`, margin + 128, currentY + 17);

  currentY += 26;

  // Build Results Table
  const tableRows: any[] = [];

  template.sections.forEach((sec, sIdx) => {
    tableRows.push([
      {
        content: sec.title.toUpperCase(),
        colSpan: 5,
        styles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          cellPadding: 1.8
        }
      }
    ]);

    sec.items.forEach((item, iIdx) => {
      const answer = inspection.answers[item.id];
      const statusLabel =
        answer?.status === 'conforme'
          ? 'CONFORME'
          : answer?.status === 'no_conforme'
          ? 'NO CONFORME'
          : 'N/A';

      const critBadge =
        item.criticality === 'CRITICO'
          ? 'CRÍTICO'
          : item.criticality === 'MAYOR'
          ? 'MAYOR'
          : 'MENOR';

      let valueDetail = '';
      if (answer?.numericValue !== undefined) {
        valueDetail = ` (${answer.numericValue} ${item.numericUnit || ''})`;
      } else if (answer?.dateValue) {
        valueDetail = ` (Vence: ${answer.dateValue})`;
      }

      tableRows.push([
        `${sIdx + 1}.${iIdx + 1}`,
        `${item.label}${valueDetail}\nNorma: ${item.normativeReference || 'N/A'}`,
        critBadge,
        statusLabel,
        answer?.observations || (answer?.status === 'conforme' ? 'Verificado en terreno conforme' : '-')
      ]);
    });
  });

  autoTable(doc, {
    startY: currentY,
    head: [['N°', 'Ítem de Chequeo', 'Criticidad', 'Resultado', 'Detalle de Inspección / Observaciones']],
    body: tableRows,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      fontSize: 6.8,
      cellPadding: 1.5,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7
    },
    columnStyles: {
      0: { cellWidth: 9, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 80 },
      2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 'auto' }
    },
    didParseCell: (data) => {
      if (data.column.index === 3) {
        if (data.cell.raw === 'CONFORME') {
          data.cell.styles.textColor = [5, 150, 105]; // emerald-600
        } else if (data.cell.raw === 'NO CONFORME') {
          data.cell.styles.textColor = [225, 29, 72]; // rose-600
          data.cell.styles.fillColor = [255, 241, 242];
        }
      }
      if (data.column.index === 2 && data.cell.raw === 'CRÍTICO') {
        data.cell.styles.textColor = [190, 18, 60];
      }
    }
  });

  let finalY = (doc as any).lastAutoTable?.finalY || currentY + 60;
  if (finalY > pageHeight - 38) {
    doc.addPage();
    finalY = 20;
  }

  finalY += 5;

  // Signatures & Legal Custody
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  // Driver signature
  doc.rect(margin, finalY, (pageWidth - margin * 2) / 2 - 2, 22);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text('FIRMA DIGITAL DEL CONDUCTOR', margin + 4, finalY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`Nombre: ${inspection.driverName}`, margin + 4, finalY + 9);
  doc.text(`RUT: ${inspection.driverRut}`, margin + 4, finalY + 13);
  doc.text(`Timestamp: ${inspection.driverSignatureTimestamp || `${inspection.date} ${inspection.time}`}`, margin + 4, finalY + 17);
  doc.text('Aceptación de condiciones del vehículo e instrucción preventiva.', margin + 4, finalY + 20.5);

  // Inspector signature
  const inspX = margin + (pageWidth - margin * 2) / 2 + 2;
  doc.rect(inspX, finalY, (pageWidth - margin * 2) / 2 - 2, 22);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMA AUDITOR DE GARITA / PREVENCIONISTA', inspX + 4, finalY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`Nombre: ${inspection.inspectorName}`, inspX + 4, finalY + 9);
  doc.text(`Cargo: ${inspection.inspectorRole}`, inspX + 4, finalY + 13);
  doc.text(`Timestamp: ${inspection.inspectorSignatureTimestamp || `${inspection.date} ${inspection.time}`}`, inspX + 4, finalY + 17);
  doc.text('Validación legal de despacho conforme a Ley 18.290 y SUSESO.', inspX + 4, finalY + 20.5);

  finalY += 24;

  // Cryptographic Security Seal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Hash SHA-256 de Inalterabilidad: ${inspection.hashSha256} • Sistema Certificado Blindaje Vial 360`,
    margin,
    finalY + 3
  );

  const filename = `Acta_Inspeccion_${inspection.folio}_${inspection.vehiclePlate.replace(/-/g, '')}.pdf`;
  doc.save(filename);
}
