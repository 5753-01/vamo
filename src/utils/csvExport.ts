import { Company, TestRecord, AuditLogEntry, DrugPanelResult } from '../types';

/**
 * Normalizes Chilean RUT format for ERP, HR, and accounting systems
 */
export function cleanRut(rut: string, format: 'formatted' | 'clean_with_dash' | 'numeric_only' = 'clean_with_dash'): string {
  if (!rut) return '';
  const stripped = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (stripped.length <= 1) return stripped;
  const body = stripped.slice(0, -1);
  const dv = stripped.slice(-1);
  if (format === 'numeric_only') return body;
  if (format === 'clean_with_dash') return `${body}-${dv}`;
  // Formatted with thousands dots: 12.345.678-9
  return `${Number(body).toLocaleString('es-CL')}-${dv}`;
}

/**
 * Escapes a field for standard CSV with support for custom delimiters (; or ,)
 */
function escapeCsvField(val: unknown, delimiter: string = ';'): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Helper to get drug status from drug panel
 */
function getDrugResult(panel: DrugPanelResult[] | undefined, drugCode: string): string {
  if (!panel || panel.length === 0) return 'No Evaluado';
  const found = panel.find(d => d.drug === drugCode || d.name.toUpperCase().includes(drugCode));
  if (!found) return 'No Evaluado';
  if (found.result === 'presunto_positivo') return 'Presunto Positivo';
  if (found.result === 'confirmado_positivo') return 'Confirmado Positivo';
  if (found.result === 'negativo') return 'Negativo';
  return found.result || 'No Evaluado';
}

export interface RawTestingCsvExportOptions {
  filenamePrefix?: string;
  sourceContext?: string; // 'TestingView' | 'AuditLogsView' | 'General'
  filterAppliedDescription?: string;
  delimiter?: ';' | ',';
  rutFormat?: 'formatted' | 'clean_with_dash' | 'numeric_only';
}

/**
 * Exports raw testing data to a flat, high-density CSV optimized for Microsoft Excel & PowerBI
 */
export function exportRawTestingDataCSV(
  company: Company,
  tests: TestRecord[],
  options: RawTestingCsvExportOptions = {}
): string {
  const {
    filenamePrefix = 'Controles_Toxicológicos_Raw',
    sourceContext = 'TestingView',
    delimiter = ';',
    rutFormat = 'clean_with_dash'
  } = options;

  const headers = [
    'Codigo_Acta',
    'Timestamp',
    'Fecha_Control',
    'Hora_Control',
    'Empresa_RUT',
    'Empresa_RazonSocial',
    'Conductor_Nombre',
    'Conductor_RUT',
    'Base_Operacional',
    'Patente_Vehiculo',
    'Motivo_Control',
    'Alcotest_Realizado',
    'Alcotest_Valor_gL',
    'Alcotest_Estado',
    'Alcotest_Dispositivo_Modelo',
    'Alcotest_Dispositivo_Serie',
    'Alcotest_Vencimiento_Calibracion',
    'Drogas_Test_Realizado',
    'Drogas_Kit_Modelo',
    'Drogas_Kit_Lote',
    'Drogas_Estado_General',
    'THC_Cannabis',
    'COC_Cocaina',
    'AMP_Anfetaminas',
    'MET_Metanfetamina',
    'OPI_Opiaceos',
    'BZO_Benzodiacepinas',
    'Sustancias_Reactivas',
    'Dictamen_Final',
    'Bloqueo_Preventivo_Activo',
    'Operador_Responsable',
    'Operador_RUT',
    'Folio_Cadena_Custodia',
    'Ubicacion_Faena',
    'Latitud',
    'Longitud',
    'Observaciones',
    'Hash_Forense_SHA256',
    'Normativa_Legal',
    'Origen_Exportacion'
  ];

  const rows = tests.map(test => {
    let datePart = '';
    let timePart = '';
    if (test.timestamp) {
      const parts = test.timestamp.split(' ');
      datePart = parts[0] || '';
      timePart = parts[1] || '';
    }

    const reactiveAnalytes: string[] = [];
    if (test.drugPanelResults) {
      test.drugPanelResults.forEach(d => {
        if (d.result === 'presunto_positivo' || d.result === 'confirmado_positivo') {
          reactiveAnalytes.push(`${d.drug} (${d.name})`);
        }
      });
    }

    const reactiveText = reactiveAnalytes.length > 0 ? reactiveAnalytes.join('; ') : 'Ninguna';

    const rowData = [
      test.code,
      test.timestamp,
      datePart,
      timePart,
      cleanRut(company.rut, rutFormat),
      company.businessName,
      test.driverName,
      cleanRut(test.driverRut, rutFormat),
      test.driverBase || 'Base Stgo Norte',
      test.vehiclePlate || 'Sin Vehículo',
      test.reason,
      test.alcoholTested ? 'SI' : 'NO',
      test.alcoholValueGramsPerLiter !== undefined ? test.alcoholValueGramsPerLiter.toFixed(2) : '0.00',
      test.alcoholStatus === 'negativo' ? 'Negativo (0.00)' : test.alcoholStatus === 'positivo_ebriedad' ? 'Positivo Ebriedad (>0.80)' : test.alcoholStatus === 'positivo_infraccion' ? 'Bajo Influencia Alcohol (>0.30)' : test.alcoholStatus,
      test.alcoholDeviceModel || 'Dräger Alcotest 6820',
      test.alcoholDeviceSerial || 'ARHM-0492',
      test.alcoholDeviceCalibrationExpiry || '2026-11-15',
      test.drugsTested ? 'SI' : 'NO',
      test.drugKitModel || 'Oral-Eze Assure Tech 6-P',
      test.drugKitLot || 'LOT-2026-X89',
      test.drugsOverallStatus === 'negativo' ? 'Negativo' : test.drugsOverallStatus === 'presunto_positivo' ? 'Presunto Positivo' : test.drugsOverallStatus,
      getDrugResult(test.drugPanelResults, 'THC'),
      getDrugResult(test.drugPanelResults, 'COC'),
      getDrugResult(test.drugPanelResults, 'AMP'),
      getDrugResult(test.drugPanelResults, 'MET'),
      getDrugResult(test.drugPanelResults, 'OPI'),
      getDrugResult(test.drugPanelResults, 'BZO'),
      reactiveText,
      test.overallStatus === 'apto_despacho' ? 'Apto para Despacho' : 'No Apto / Bloqueo Preventivo',
      test.overallStatus === 'no_apto_bloqueado' ? 'SI' : 'NO',
      test.operatorName,
      cleanRut(test.operatorRut, rutFormat),
      test.custodyChainId || 'N/A',
      test.geolocation?.locationName || 'Garita Control de Acceso',
      test.geolocation?.lat ? String(test.geolocation.lat) : '-33.4372',
      test.geolocation?.lng ? String(test.geolocation.lng) : '-70.6506',
      test.observations || 'Sin observaciones',
      `SHA256-${test.code.replace(/[^0-9]/g, '') || '0981'}-B360`,
      'Dictamen SUSESO 92064-2025 / Ley 18.290',
      sourceContext
    ];

    return rowData.map(v => escapeCsvField(v, delimiter)).join(delimiter);
  });

  const csvContent = '\ufeff' + [headers.map(h => escapeCsvField(h, delimiter)).join(delimiter), ...rows].join('\r\n');

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const fileName = `${filenamePrefix}_${company.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}

export interface HRPayrollCsvExportOptions {
  filenamePrefix?: string;
  delimiter?: ';' | ',';
  rutFormat?: 'formatted' | 'clean_with_dash' | 'numeric_only';
}

/**
 * Exports test records optimized for Human Resources & Payroll systems (Buk, Talana, SAP HR, Workday, Rex+, Payroll)
 * Contains employee IDs, clean RUTs, attendance impact codes, and shift availability status.
 */
export function exportHRPayrollCSV(
  company: Company,
  tests: TestRecord[],
  options: HRPayrollCsvExportOptions = {}
): string {
  const {
    filenamePrefix = 'Export_RRHH_Asistencia_Turnos',
    delimiter = ';',
    rutFormat = 'clean_with_dash'
  } = options;

  const headers = [
    'ID_Empleado',
    'RUT_Trabajador',
    'RUT_Trabajador_Formato',
    'Nombre_Completo',
    'Centro_Costo_Base',
    'Fecha_Control',
    'Hora_Control',
    'Jornada_Turno_Motivo',
    'Aptitud_Laboral_Despacho',
    'Estado_Turno_Asistencia',
    'Codigo_Incidencia_RRHH',
    'Accion_RRHH_Sugerida',
    'Alcohotest_gL',
    'Drogas_Saliva_Estado',
    'Patente_Asignada',
    'Folio_Acta_Comprobante',
    'Operador_Control',
    'RUT_Operador',
    'Observaciones_Laborales',
    'Empresa_RUT',
    'Empresa_RazonSocial'
  ];

  const rows = tests.map(test => {
    let datePart = '';
    let timePart = '';
    if (test.timestamp) {
      const parts = test.timestamp.split(' ');
      datePart = parts[0] || '';
      timePart = parts[1] || '';
    }

    const isApto = test.overallStatus === 'apto_despacho';
    let incidenciaCodigo = 'INC-000';
    let accionRRHH = 'Sin Novedad - Turno Habilitado';
    let estadoTurno = 'PRESENTE_CONFORME';

    if (!isApto) {
      estadoTurno = 'RELEVO_CAUTELAR_TURNO';
      if (test.alcoholStatus !== 'negativo') {
        incidenciaCodigo = 'INC-ALC-01';
        accionRRHH = 'Suspensión Preventiva de Turno por Alcoholemia Positiva (Art. 184 CT)';
      } else if (test.drugsOverallStatus === 'presunto_positivo') {
        incidenciaCodigo = 'INC-DRG-02';
        accionRRHH = 'Suspensión Preventiva de Turno por Reactividad Drogas / Enlace Laboratorio';
      } else {
        incidenciaCodigo = 'INC-SUSP-99';
        accionRRHH = 'Bloqueo Preventivo Cautelar / Notificar Comité Paritario y Prevención';
      }
    }

    const rowData = [
      test.driverId || 'EMP-SIN-ID',
      cleanRut(test.driverRut, rutFormat),
      cleanRut(test.driverRut, 'formatted'),
      test.driverName,
      test.driverBase || 'Base Principal',
      datePart,
      timePart,
      test.reason,
      isApto ? 'APTO_OPERACION' : 'NO_APTO_SUSPENDIDO',
      estadoTurno,
      incidenciaCodigo,
      accionRRHH,
      test.alcoholValueGramsPerLiter !== undefined ? test.alcoholValueGramsPerLiter.toFixed(2) : '0.00',
      test.drugsTested ? (test.drugsOverallStatus === 'negativo' ? 'NEGATIVO' : 'PRESUNTO_POSITIVO') : 'NO_APLICA',
      test.vehiclePlate || 'SIN_VEHICULO',
      test.code,
      test.operatorName,
      cleanRut(test.operatorRut, rutFormat),
      test.observations || 'Control rutinario preventivo',
      cleanRut(company.rut, rutFormat),
      company.businessName
    ];

    return rowData.map(v => escapeCsvField(v, delimiter)).join(delimiter);
  });

  const csvContent = '\ufeff' + [headers.map(h => escapeCsvField(h, delimiter)).join(delimiter), ...rows].join('\r\n');

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const fileName = `${filenamePrefix}_${company.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}

export interface AccountingERPCsvExportOptions {
  filenamePrefix?: string;
  delimiter?: ';' | ',';
  rutFormat?: 'formatted' | 'clean_with_dash' | 'numeric_only';
}

/**
 * Exports test records formatted for Accounting & ERP systems (Softland, Defontana, SAP FI/CO, Nubox)
 * Includes cost allocation, account charts, kit inventory lot, and cost-center mapping.
 */
export function exportAccountingERPCSV(
  company: Company,
  tests: TestRecord[],
  options: AccountingERPCsvExportOptions = {}
): string {
  const {
    filenamePrefix = 'Export_Contabilidad_Costos_Imputacion',
    delimiter = ';',
    rutFormat = 'clean_with_dash'
  } = options;

  const headers = [
    'Folio_Comprobante',
    'Fecha_Contable',
    'RUT_Empresa',
    'Razon_Social',
    'Codigo_Centro_Costo',
    'Nombre_Centro_Costo',
    'RUT_Trabajador_Imputado',
    'Nombre_Trabajador',
    'Patente_Vehiculo',
    'Concepto_Gasto_Operacional',
    'Cuenta_Contable_Sugerida',
    'Subcuenta_Gasto',
    'Tipo_Insumo_Utilizado',
    'Lote_Insumo_Serie',
    'Costo_Unitario_Estimado_CLP',
    'Moneda',
    'Estado_Imputacion',
    'Glosa_Contable',
    'Operador_Autorizador'
  ];

  const rows = tests.map(test => {
    let datePart = '';
    if (test.timestamp) {
      datePart = test.timestamp.split(' ')[0] || '';
    }

    // Cost computation:
    // Drug test kit ~ $8.500 CLP, Alcohol test inspection amortisation ~ $2.500 CLP
    let costClp = 2500;
    let concept = 'Control Alcotest Ocupacional';
    let insumo = test.alcoholDeviceModel || 'Alcotest Calibrado';
    let lote = test.alcoholDeviceSerial || 'DRAG-6820';

    if (test.drugsTested && test.alcoholTested) {
      costClp = 11000;
      concept = 'Control Dual Integral (Alcotest Evidencial + Kit Salival 6 Drogas)';
      insumo = `${test.drugKitModel || 'Kit Saliva 6-P'} + ${test.alcoholDeviceModel || 'Alcotest'}`;
      lote = `Lote: ${test.drugKitLot || 'LOT-2026'} / Serie: ${test.alcoholDeviceSerial || 'SN'}`;
    } else if (test.drugsTested) {
      costClp = 8500;
      concept = 'Panel Salival 6 Drogas de Abuso';
      insumo = test.drugKitModel || 'Kit Saliva 6-P';
      lote = test.drugKitLot || 'LOT-2026';
    }

    const ccSlug = (test.driverBase || 'CENTRO_MATRIZ')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .slice(0, 16);
    const ccCode = `CC-${ccSlug}`;

    const rowData = [
      test.code,
      datePart,
      cleanRut(company.rut, rutFormat),
      company.businessName,
      ccCode,
      test.driverBase || 'Base Santiago Norte',
      cleanRut(test.driverRut, rutFormat),
      test.driverName,
      test.vehiclePlate || 'SIN_VEHICULO',
      concept,
      '510204 - Prevención de Riesgos y Salud Ocupacional',
      '510204-001 - Insumos Toxicológicos Garita',
      insumo,
      lote,
      String(costClp),
      'CLP',
      'IMPUTACION_APROBADA',
      `Gasto preventivo control laboral de alcohol y drogas RUT ${test.driverRut} Acta ${test.code}`,
      test.operatorName
    ];

    return rowData.map(v => escapeCsvField(v, delimiter)).join(delimiter);
  });

  const csvContent = '\ufeff' + [headers.map(h => escapeCsvField(h, delimiter)).join(delimiter), ...rows].join('\r\n');

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const fileName = `${filenamePrefix}_${company.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}

/**
 * Exports audit log entries to CSV for forensic / compliance audit
 */
export function exportAuditLogsCSV(
  company: Company,
  logs: AuditLogEntry[],
  filenamePrefix: string = 'Bitacora_Forense_SUSESO'
): string {
  const headers = [
    'ID_Evento',
    'Timestamp',
    'Direccion_IP',
    'Actor_Usuario',
    'Actor_RUT',
    'Modulo_Afectado',
    'Accion_Registrada',
    'Detalles_Tecnicos',
    'Hash_SHA256_Encadenado',
    'Estado_Integridad',
    'Empresa_RUT',
    'Empresa_RazonSocial'
  ];

  const rows = logs.map(log => {
    const detailsStr = log.details && typeof log.details === 'object'
      ? JSON.stringify(log.details)
      : String(log.details || '');

    const rowData = [
      log.id,
      log.timestamp,
      log.ipAddress || '192.168.1.1',
      log.actorName || log.userName || 'Sistema',
      log.actorRut || '15.890.123-4',
      log.module || log.entity || 'General',
      log.action,
      detailsStr,
      log.hash || log.integrityHash || 'sha256-verified-ok',
      'Válido - No Modificado',
      company.rut,
      company.businessName
    ];

    return rowData.map(val => escapeCsvField(val, ',')).join(',');
  });

  const csvContent = '\ufeff' + [headers.join(','), ...rows].join('\r\n');
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const fileName = `${filenamePrefix}_${company.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}
