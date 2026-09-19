import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface ExportPdfCustomOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
  quality?: number;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

/**
 * Exports an HTML element to a high-legibility PDF document.
 * Powered by html2canvas-pro (with full support for modern CSS color functions like OKLCH/OKLAB)
 * and jsPDF with automatic multi-page slicing.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  customOptions?: ExportPdfCustomOptions
): Promise<void> {
  const margin: [number, number, number, number] =
    Array.isArray(customOptions?.margin) && customOptions.margin.length === 4
      ? (customOptions.margin as [number, number, number, number])
      : Array.isArray(customOptions?.margin) && customOptions.margin.length === 2
      ? [customOptions.margin[0], customOptions.margin[1], customOptions.margin[0], customOptions.margin[1]]
      : typeof customOptions?.margin === 'number'
      ? [customOptions.margin, customOptions.margin, customOptions.margin, customOptions.margin]
      : [8, 8, 10, 8];

  const orientation = customOptions?.orientation ?? 'portrait';
  const format = customOptions?.format ?? 'a4';
  const scale = customOptions?.scale ?? 2;
  const quality = customOptions?.quality ?? 0.98;

  // Render the DOM element using html2canvas-pro which natively supports OKLCH colors
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollY: 0,
    scrollX: 0,
    logging: false,
    imageSmoothing: true,
    imageSmoothingQuality: 'high',
    onclone: (clonedDoc, clonedElement) => {
      // Ensure the cloned report is fully visible and opaque even if offscreen in host
      if (clonedElement) {
        clonedElement.style.opacity = '1';
        clonedElement.style.visibility = 'visible';
        clonedElement.style.display = 'block';

        let parent = clonedElement.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.opacity = '1';
          parent.style.visibility = 'visible';
          parent = parent.parentElement;
        }
      }
    }
  });

  const pdf = new jsPDF({
    unit: 'mm',
    format,
    orientation
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginTop = margin[0];
  const marginRight = margin[1];
  const marginBottom = margin[2];
  const marginLeft = margin[3];

  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentHeight = pageHeight - marginTop - marginBottom;

  const mmPerPx = contentWidth / canvas.width;
  const pageCanvasHeight = Math.floor(contentHeight / mmPerPx);

  if (canvas.height <= pageCanvasHeight) {
    // Single page output
    const imgData = canvas.toDataURL('image/jpeg', quality);
    pdf.addImage(
      imgData,
      'JPEG',
      marginLeft,
      marginTop,
      contentWidth,
      canvas.height * mmPerPx
    );
  } else {
    // Multi-page slicing output
    let currentY = 0;
    let pageIndex = 0;

    while (currentY < canvas.height) {
      if (pageIndex > 0) {
        pdf.addPage(format, orientation);
      }

      const sliceHeight = Math.min(pageCanvasHeight, canvas.height - currentY);
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeight;

      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const sliceImgData = sliceCanvas.toDataURL('image/jpeg', quality);
        pdf.addImage(
          sliceImgData,
          'JPEG',
          marginLeft,
          marginTop,
          contentWidth,
          sliceHeight * mmPerPx
        );
      }

      currentY += sliceHeight;
      pageIndex++;
    }
  }

  // Save the generated PDF
  pdf.save(filename);
}



