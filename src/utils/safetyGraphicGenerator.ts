/**
 * Utility to generate high-resolution SVG safety graphics for Chilean Transport Operations.
 * Acts as an offline/contingency vector renderer when AI Image generation quotas are exhausted (429),
 * or for instant print-ready industrial signage, decals, and infographics.
 */

export interface GraphicGeneratorOptions {
  prompt: string;
  companyName: string;
  companyRut?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16' | '3:4';
  stylePreset?: string;
}

export function generateSafetyGraphic(options: GraphicGeneratorOptions): {
  dataUrl: string;
  category: string;
  title: string;
  width: number;
  height: number;
} {
  const {
    prompt,
    companyName = 'Blindaje Vial SpA',
    companyRut = '77.892.341-K',
    aspectRatio = '16:9'
  } = options;

  const promptLower = prompt.toLowerCase();

  // Dimension determination based on aspect ratio
  let width = 1280;
  let height = 720;

  if (aspectRatio === '1:1') {
    width = 1000;
    height = 1000;
  } else if (aspectRatio === '4:3') {
    width = 1024;
    height = 768;
  } else if (aspectRatio === '3:4') {
    width = 768;
    height = 1024;
  } else if (aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  // Detect category from prompt
  const isSello = promptLower.includes('sello') || promptLower.includes('parabrisas') || promptLower.includes('emblema') || promptLower.includes('sticker') || aspectRatio === '1:1';
  const isInfografia = promptLower.includes('infograf') || promptLower.includes('paso a paso') || promptLower.includes('protocolo') || promptLower.includes('saliva') || promptLower.includes('assure');
  const isConcientizacion = promptLower.includes('concientiz') || promptLower.includes('campaña') || promptLower.includes('familia') || promptLower.includes('bienestar') || promptLower.includes('vida');

  let svgContent = '';
  let category = 'Señalética Garita';
  let title = 'Señalética Zona de Control';

  if (isSello) {
    category = 'Sello Parabrisas';
    title = 'Sello Oficial Flota Blindada';
    svgContent = renderSelloDecal(width, height, companyName, companyRut);
  } else if (isInfografia) {
    category = 'Infografía Técnica';
    title = 'Protocolo Test Saliva Rápida';
    svgContent = renderInfografiaSaliva(width, height, companyName);
  } else if (isConcientizacion) {
    category = 'Campaña Concientización';
    title = 'Afiche de Seguridad y Bienestar';
    svgContent = renderConcientizacionPoster(width, height, companyName, prompt);
  } else {
    // Default: Industrial Garita Sign
    category = 'Señalética Garita';
    title = 'Zona de Control Tolerancia Cero';
    svgContent = renderGaritaSign(width, height, companyName, prompt);
  }

  const encoded = encodeURIComponent(svgContent);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

  return {
    dataUrl,
    category,
    title,
    width,
    height
  };
}

// 1. Render Industrial Garita Sign (High Visibility Yellow/Blue Hazard Sign)
function renderGaritaSign(width: number, height: number, companyName: string, prompt: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="hazardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1E3A8A" />
    </linearGradient>
    <pattern id="hazardStripe" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="20" height="40" fill="#EAB308" />
      <rect x="20" width="20" height="40" fill="#0F172A" />
    </pattern>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#0B0F19" />

  <!-- Outer Hazard Border -->
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="url(#hazardStripe)" rx="16" />
  <rect x="35" y="35" width="${width - 70}" height="${height - 70}" fill="url(#hazardGrad)" rx="12" stroke="#334155" stroke-width="3" />

  <!-- Top Blue Header Banner -->
  <rect x="35" y="35" width="${width - 70}" height="100" fill="url(#headerGrad)" rx="12" />
  
  <!-- Chilean Flag Accent -->
  <g transform="translate(60, 60)">
    <rect width="40" height="25" fill="#FFFFFF" />
    <rect y="25" width="80" height="25" fill="#DC2626" />
    <rect width="40" height="25" fill="#2563EB" />
    <!-- White Star in Blue canton -->
    <polygon points="20,7 23,17 33,17 25,23 28,33 20,27 12,33 15,23 7,17 17,17" fill="#FFFFFF" transform="scale(0.6) translate(13, 8)" />
    <rect x="40" width="40" height="25" fill="#FFFFFF" />
  </g>

  <text x="160" y="75" fill="#93C5FD" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="bold" letter-spacing="2">
    PROGRAMA DE SEGURIDAD OPERACIONAL EN TRANSPORTE • CHILE
  </text>
  <text x="160" y="105" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="1">
    ${escapeXml(companyName.toUpperCase())}
  </text>

  <!-- Main Headline Zone -->
  <rect x="60" y="160" width="${width - 120}" height="70" fill="#EF4444" rx="8" filter="url(#shadow)" />
  <text x="${width / 2}" y="206" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="1.5">
    ⛔ ZONA DE CONTROL PREVENTIVO OBLIGATORIO ⛔
  </text>

  <!-- Subheadline: Tolerancia Cero -->
  <text x="${width / 2}" y="280" fill="#FACC15" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="2">
    TOLERANCIA CERO ALCOHOL Y DROGAS
  </text>

  <text x="${width / 2}" y="325" fill="#E2E8F0" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="middle">
    Aplicación de Alcohotest Evidencial y Test Rápido de Saliva en Fluido Oral antes del despacho
  </text>

  <!-- 3 Legal Pillars Box -->
  <g transform="translate(60, 360)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="${(width - 160) / 3}" height="140" fill="#1E293B" rx="10" stroke="#3B82F6" stroke-width="2" />
    <text x="20" y="35" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">LEY N° 18.290</text>
    <text x="20" y="65" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Art. 110 y 111</text>
    <text x="20" y="95" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Prohibición absoluta de conducir bajo efecto del alcohol y drogas estupefacientes.</text>

    <!-- Card 2 -->
    <rect x="${(width - 160) / 3 + 20}" y="0" width="${(width - 160) / 3}" height="140" fill="#1E293B" rx="10" stroke="#EAB308" stroke-width="2" />
    <text x="${(width - 160) / 3 + 40}" y="35" fill="#FACC15" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">LEY N° 16.744</text>
    <text x="${(width - 160) / 3 + 40}" y="65" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Seguridad Laboral</text>
    <text x="${(width - 160) / 3 + 40}" y="95" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Deber de protección de la empresa sobre conductores, tripulación y usuarios.</text>

    <!-- Card 3 -->
    <rect x="${((width - 160) / 3) * 2 + 40}" y="0" width="${(width - 160) / 3}" height="140" fill="#1E293B" rx="10" stroke="#10B981" stroke-width="2" />
    <text x="${((width - 160) / 3) * 2 + 60}" y="35" fill="#34D399" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">RIOHS INTERNO</text>
    <text x="${((width - 160) / 3) * 2 + 60}" y="65" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Trazabilidad SHA-256</text>
    <text x="${((width - 160) / 3) * 2 + 60}" y="95" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Controles in situ, actas digitales inmutables con notificación inmediata a jefatura.</text>
  </g>

  <!-- Footer Seal & Warnings -->
  <line x1="60" y1="${height - 120}" x2="${width - 60}" y2="${height - 120}" stroke="#334155" stroke-width="2" />
  
  <text x="60" y="${height - 85}" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">
    Certificación de Integridad Blindaje Vial SpA • Protocolo Operacional Homologado SUSESO / D.T.
  </text>
  <text x="60" y="${height - 65}" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">
    RECHAZO AL CONTROL: Constituye presunción fundada de no aptitud e inhabilita inmediatamente el despacho del servicio.
  </text>

  <!-- Right Seal Badge -->
  <g transform="translate(${width - 240}, ${height - 105})">
    <rect width="180" height="42" fill="#1E3A8A" rx="8" stroke="#60A5FA" stroke-width="1.5" />
    <text x="90" y="26" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">
      🛡️ PROTOCOLO ACTIVO
    </text>
  </g>
</svg>`;
}

// 2. Render Sello Parabrisas (Decal for Bus / Truck Windshield)
function renderSelloDecal(width: number, height: number, companyName: string, companyRut: string): string {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.44;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0284C7" flood-opacity="0.5" />
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="#090D16" />

  <!-- Outer Ring Outer Shadow -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0B1329" stroke="url(#goldGrad)" stroke-width="8" filter="url(#glow)" />
  <circle cx="${cx}" cy="${cy}" r="${r - 18}" fill="url(#ringGrad)" stroke="#38BDF8" stroke-width="3" stroke-dasharray="8 6" />

  <!-- Inner Dark Blue Field -->
  <circle cx="${cx}" cy="${cy}" r="${r - 65}" fill="#0F172A" stroke="url(#goldGrad)" stroke-width="4" />

  <!-- Central Shield Graphic -->
  <path d="M ${cx} ${cy - 120} L ${cx + 70} ${cy - 85} L ${cx + 70} ${cy + 15} C ${cx + 70} ${cy + 85}, ${cx} ${cy + 125}, ${cx} ${cy + 125} C ${cx} ${cy + 125}, ${cx - 70} ${cy + 85}, ${cx - 70} ${cy + 15} L ${cx - 70} ${cy - 85} Z" fill="#1E3A8A" stroke="#38BDF8" stroke-width="5" />
  
  <!-- Checkmark in Shield -->
  <path d="M ${cx - 30} ${cy + 10} L ${cx - 5} ${cy + 35} L ${cx + 35} ${cy - 25}" fill="none" stroke="#22C55E" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Top Curved Arc Banner (simulated via text) -->
  <text x="${cx}" y="${cy - r + 45}" fill="#FDE047" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="4">
    ★ SEGURIDAD OPERACIONAL ★
  </text>

  <!-- Big Title in Center -->
  <text x="${cx}" y="${cy + 70}" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="2">
    FLOTA BLINDADA
  </text>

  <text x="${cx}" y="${cy + 95}" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="1.5">
    TOLERANCIA CERO ALCOHOL Y DROGAS
  </text>

  <text x="${cx}" y="${cy + 115}" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">
    AUDITADO BAJO LEY 18.290 Y RIOHS
  </text>

  <!-- Bottom Company Stamp -->
  <text x="${cx}" y="${cy + r - 35}" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">
    ${escapeXml(companyName.toUpperCase())}
  </text>

  <!-- Hologram / Digital Hash Tag -->
  <text x="${cx}" y="${cy + r - 15}" fill="#38BDF8" font-family="monospace" font-size="10" text-anchor="middle">
    VERIFICACIÓN SHA-256 • VIGENCIA 2026-2027
  </text>
</svg>`;
}

// 3. Render Technical Saliva Protocol Infographic
function renderInfografiaSaliva(width: number, height: number, companyName: string): string {
  const cardW = (width - 140) / 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1120" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- Header -->
  <rect x="30" y="30" width="${width - 60}" height="90" fill="#1E293B" rx="14" stroke="#334155" stroke-width="2" />
  <text x="60" y="65" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">
    PROCEDIMIENTO OPERACIONAL ESTÁNDAR (POE) • TEST SALIVAL RÁPIDO
  </text>
  <text x="60" y="98" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="24" font-weight="900">
    Protocolo de Detección en Saliva (Oral Fluid) Assure Tech 5-8 Min
  </text>
  <text x="${width - 60}" y="80" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" text-anchor="end">
    ${escapeXml(companyName)}
  </text>

  <!-- 4 Step Cards -->
  <!-- STEP 1 -->
  <g transform="translate(40, 150)">
    <rect width="${cardW}" height="${height - 230}" fill="#0F172A" rx="12" stroke="#3B82F6" stroke-width="2" />
    <circle cx="45" cy="45" r="24" fill="#1E3A8A" />
    <text x="45" y="52" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">01</text>
    <text x="85" y="42" fill="#60A5FA" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">FASE PREVIA</text>
    <text x="85" y="60" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Inspección & Reposo</text>
    
    <line x1="20" y1="85" x2="${cardW - 20}" y2="85" stroke="#334155" stroke-width="1" />
    <text x="20" y="115" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• 10 min sin fumar ni comer</text>
    <text x="20" y="145" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Revisión bucal no invasiva</text>
    <text x="20" y="175" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Identificación con Cédula/RUT</text>
    <text x="20" y="205" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Presencia de testigo habilitado</text>

    <!-- Visual Icon Representation -->
    <rect x="25" y="${height - 350}" width="${cardW - 50}" height="80" fill="#1E293B" rx="8" />
    <text x="${cardW / 2}" y="${height - 305}" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      📋 Reposo Garantizado
    </text>
  </g>

  <!-- STEP 2 -->
  <g transform="translate(${40 + cardW + 20}, 150)">
    <rect width="${cardW}" height="${height - 230}" fill="#0F172A" rx="12" stroke="#EAB308" stroke-width="2" />
    <circle cx="45" cy="45" r="24" fill="#713F12" />
    <text x="45" y="52" fill="#FDE047" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">02</text>
    <text x="85" y="42" fill="#FACC15" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">RECOLECCIÓN</text>
    <text x="85" y="60" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Hisopo de Saliva</text>

    <line x1="20" y1="85" x2="${cardW - 20}" y2="85" stroke="#334155" stroke-width="1" />
    <text x="20" y="115" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Frotar colector en encías</text>
    <text x="20" y="145" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Recolección entre 5 a 8 min</text>
    <text x="20" y="175" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Indicador de saturación visual</text>
    <text x="20" y="205" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Inserción en cassette sellado</text>

    <rect x="25" y="${height - 350}" width="${cardW - 50}" height="80" fill="#1E293B" rx="8" />
    <text x="${cardW / 2}" y="${height - 305}" fill="#FACC15" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      ⏱️ Saturación 5 a 8 min
    </text>
  </g>

  <!-- STEP 3 -->
  <g transform="translate(${40 + (cardW + 20) * 2}, 150)">
    <rect width="${cardW}" height="${height - 230}" fill="#0F172A" rx="12" stroke="#10B981" stroke-width="2" />
    <circle cx="45" cy="45" r="24" fill="#064E3B" />
    <text x="45" y="52" fill="#6EE7B7" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">03</text>
    <text x="85" y="42" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">LECTURA IN SITU</text>
    <text x="85" y="60" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Bandas Control & Test</text>

    <line x1="20" y1="85" x2="${cardW - 20}" y2="85" stroke="#334155" stroke-width="1" />
    <text x="20" y="115" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• 2 Líneas (C+T): NEGATIVO</text>
    <text x="20" y="145" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• 1 Línea (Solo C): PRESUNTIVO (+)</text>
    <text x="20" y="175" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Sin línea C: INVÁLIDO</text>
    <text x="20" y="205" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Panel 5 drogas simultáneas</text>

    <rect x="25" y="${height - 350}" width="${cardW - 50}" height="80" fill="#1E293B" rx="8" />
    <text x="${cardW / 2}" y="${height - 305}" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      🔬 Lectura a los 10 min
    </text>
  </g>

  <!-- STEP 4 -->
  <g transform="translate(${40 + (cardW + 20) * 3}, 150)">
    <rect width="${cardW}" height="${height - 230}" fill="#0F172A" rx="12" stroke="#8B5CF6" stroke-width="2" />
    <circle cx="45" cy="45" r="24" fill="#4C1D95" />
    <text x="45" y="52" fill="#C4B5FD" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">04</text>
    <text x="85" y="42" fill="#A78BFA" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">CIERRE Y ACTA</text>
    <text x="85" y="60" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Firma & Hash SHA-256</text>

    <line x1="20" y1="85" x2="${cardW - 20}" y2="85" stroke="#334155" stroke-width="1" />
    <text x="20" y="115" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Firma electrónica conductor</text>
    <text x="20" y="145" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Generación de código único</text>
    <text x="20" y="175" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Alerta SMS/Email preventiva</text>
    <text x="20" y="205" fill="#CBD5E1" font-family="system-ui, sans-serif" font-size="12" font-weight="500">• Inhabilitación o despacho</text>

    <rect x="25" y="${height - 350}" width="${cardW - 50}" height="80" fill="#1E293B" rx="8" />
    <text x="${cardW / 2}" y="${height - 305}" fill="#C4B5FD" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      🔐 Blindaje Digital 100%
    </text>
  </g>

  <!-- Footer Banner -->
  <rect x="40" y="${height - 60}" width="${width - 80}" height="40" fill="#1E293B" rx="8" />
  <text x="${width / 2}" y="${height - 35}" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">
    Dispositivo aprobado por FDA / CE • No invasivo • Respeto irrestricto a la dignidad del trabajador según Art. 154 bis del Código del Trabajo
  </text>
</svg>`;
}

// 4. Render Awareness Poster (Campaña de Seguridad Vial & Conducción Sobria)
function renderConcientizacionPoster(width: number, height: number, companyName: string, prompt: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="posterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#posterGrad)" />

  <!-- Top Accent Bar -->
  <rect x="40" y="40" width="${width - 80}" height="10" fill="#38BDF8" rx="5" />

  <!-- Logo and Company -->
  <text x="${width / 2}" y="100" fill="#93C5FD" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" letter-spacing="3">
    CAMPAÑA DE BIENESTAR Y SEGURIDAD VIAL • ${escapeXml(companyName.toUpperCase())}
  </text>

  <!-- Big Core Message -->
  <text x="${width / 2}" y="180" fill="#FDE047" font-family="system-ui, sans-serif" font-size="34" font-weight="900" text-anchor="middle">
    EN CADA VIAJE, TU FAMILIA Y PASAJEROS
  </text>
  <text x="${width / 2}" y="230" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="1">
    CUENTAN CONTIGO
  </text>

  <!-- Graphic Shield in Circle -->
  <circle cx="${width / 2}" cy="340" r="70" fill="#1E293B" stroke="#38BDF8" stroke-width="4" />
  <text x="${width / 2}" y="360" font-size="54" text-anchor="middle">🛡️</text>

  <!-- 3 Principles -->
  <g transform="translate(60, 440)">
    <rect x="0" y="0" width="${width - 120}" height="80" fill="#1E293B" rx="12" stroke="#334155" stroke-width="2" />
    <text x="30" y="48" fill="#38BDF8" font-size="28">01</text>
    <text x="80" y="38" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Conducción 100% Despejada</text>
    <text x="80" y="60" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Cero alcohol, cero drogas y control estricto de medicamentos con efecto sedante.</text>
  </g>

  <g transform="translate(60, 540)">
    <rect x="0" y="0" width="${width - 120}" height="80" fill="#1E293B" rx="12" stroke="#334155" stroke-width="2" />
    <text x="30" y="48" fill="#22C55E" font-size="28">02</text>
    <text x="80" y="38" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">Descanso Efectivo y Reparador</text>
    <text x="80" y="60" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Respeta los límites de jornada laboral y duerme al menos 7 horas continuas antes de tu turno.</text>
  </g>

  <g transform="translate(60, 640)">
    <rect x="0" y="0" width="${width - 120}" height="80" fill="#1E293B" rx="12" stroke="#334155" stroke-width="2" />
    <text x="30" y="48" fill="#F59E0B" font-size="28">03</text>
    <text x="80" y="38" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">El Control Cuida Tu Vida</text>
    <text x="80" y="60" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Los test aleatorios de garita son una garantía de protección para ti, tus compañeros y tus usuarios.</text>
  </g>

  <!-- Footer -->
  <text x="${width / 2}" y="${height - 40}" fill="#64748B" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">
    Blindaje Vial SpA • Juntos construyendo rutas más seguras en Chile • Mutualidad Adherida
  </text>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
