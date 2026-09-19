/**
 * Chilean Driver License OCR and RUT Verification Utilities
 * Blindaje Vial 360 - Ley 18.290 de Tránsito & CONASET
 */

export interface LicenseOcrResult {
  rut: string;
  licenseExpiry: string; // YYYY-MM-DD
  fullName?: string;
  licenseClasses?: string[];
  municipality?: string;
  issueDate?: string | null;
  confidence?: number;
  legibility?: 'alta' | 'media' | 'baja';
  notes?: string;
  matchedDriverId?: string | null;
  isFallback?: boolean;
}

/**
 * Validates a Chilean RUT using the official Modulo 11 check digit algorithm.
 */
export function validateChileanRut(rut: string): boolean {
  if (!rut || typeof rut !== 'string') return false;
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return false;

  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expectedDv = '0';
  if (remainder === 11) expectedDv = '0';
  else if (remainder === 10) expectedDv = 'K';
  else expectedDv = String(remainder);

  return dv === expectedDv;
}

/**
 * Formats a raw or unformatted string into canonical Chilean RUT format: XX.XXX.XXX-X
 */
export function formatChileanRut(rawRut: string): string {
  if (!rawRut) return '';
  const clean = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return rawRut.trim();

  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);

  // Group thousands with dots
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
}

/**
 * Normalizes an extracted date string into ISO YYYY-MM-DD.
 * Handles formats like 'DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'DD MM YYYY'.
 */
export function normalizeDateToIso(rawDate: string): string {
  if (!rawDate) return '';
  const trimmed = rawDate.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return trimmed;
}

/**
 * Generates an authentic, high-resolution graphic simulation of a Chilean Driver License
 * (Formato oficial Comisión Nacional de Seguridad de Tránsito - CONASET)
 * using HTML5 Canvas. This is ideal for testing OCR instantly without needing physical documents.
 */
export function generateSampleChileanLicense(sample: {
  rut: string;
  fullName: string;
  licenseClasses: string[];
  expiryDate: string;
  issueDate: string;
  municipality: string;
  folio: string;
}): string {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background card with subtle Chilean security guilloche pattern
  const grad = ctx.createLinearGradient(0, 0, 900, 560);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(0.5, '#e2e8f0');
  grad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 560);

  // Rounded outer border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#0284c7';
  ctx.strokeRect(10, 10, 880, 540);

  // Top header banner: REPÚBLICA DE CHILE
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(16, 16, 868, 85);

  // Chilean flag colors strip
  ctx.fillStyle = '#0284c7'; // Blue
  ctx.fillRect(16, 101, 868, 6);
  ctx.fillStyle = '#e11d48'; // Red
  ctx.fillRect(16, 107, 868, 6);

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('REPÚBLICA DE CHILE', 120, 52);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('LICENCIA DE CONDUCTOR • LEY N° 18.290', 120, 80);

  // Emblem / Star simulation
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(60, 58, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('★', 47, 68);

  // Photo Area Placeholder
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(40, 135, 190, 240);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 135, 190, 240);

  // Silhouette avatar inside photo area
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(135, 210, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(135, 330, 75, Math.PI, Math.PI * 2);
  ctx.fill();

  // Photo watermark
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('SEGURIDAD VIAL CHILE', 55, 360);

  // Document Fields Section
  const leftX = 260;

  // 1. APELLIDOS Y NOMBRES
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('1. APELLIDOS Y NOMBRES', leftX, 155);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(sample.fullName.toUpperCase(), leftX, 185);

  // 2. R.U.N. / R.U.T.
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('2. R.U.N. (ROL ÚNICO NACIONAL)', leftX, 225);
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(sample.rut, leftX, 255);

  // 3. CLASES AUTORIZADAS
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('3. CLASE(S) DE LICENCIA', leftX, 295);

  let badgeX = leftX;
  sample.licenseClasses.forEach((cls) => {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(badgeX, 305, 55, 35);
    ctx.strokeStyle = '#0369a1';
    ctx.strokeRect(badgeX, 305, 55, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(cls, badgeX + 12, 330);
    badgeX += 65;
  });

  // 4. FECHA PRÓXIMO CONTROL / VENCIMIENTO (Highlighted in red/amber border for high OCR saliency)
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('4. VENCIMIENTO / PRÓXIMO CONTROL:', leftX, 380);

  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(leftX, 390, 240, 48);
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 2;
  ctx.strokeRect(leftX, 390, 240, 48);

  ctx.fillStyle = '#9f1239';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(sample.expiryDate, leftX + 18, 426);

  // 5. FECHA OTORGAMIENTO
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('5. OTORGAMIENTO:', leftX + 270, 380);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(sample.issueDate, leftX + 270, 415);

  // 6. MUNICIPALIDAD
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('6. MUNICIPALIDAD OTORGANTE:', leftX, 470);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(sample.municipality.toUpperCase(), leftX, 492);

  // Folio and security chip bottom right
  ctx.fillStyle = '#64748b';
  ctx.font = '12px monospace';
  ctx.fillText(`FOLIO: ${sample.folio}`, 700, 520);

  // Barcode simulation at the bottom left
  ctx.fillStyle = '#0f172a';
  for (let i = 40; i < 230; i += 4) {
    const w = (i % 3 === 0) ? 3 : 1.5;
    ctx.fillRect(i, 400, w, 40);
  }
  ctx.font = '10px monospace';
  ctx.fillText(sample.rut.replace(/[^0-9kK]/g, ''), 70, 455);

  return canvas.toDataURL('image/jpeg', 0.92);
}
