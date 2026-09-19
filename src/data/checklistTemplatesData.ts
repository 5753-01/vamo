import {
  ChecklistTemplate,
  ChecklistInspectionExecution,
  VehicleCategory,
  TransportOperationType
} from '../types';

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, { label: string; icon: string }> = {
  'Tractocamión': { label: 'Tractocamión (Cabezal)', icon: 'Truck' },
  'Semirremolque / Rampla': { label: 'Semirremolque / Rampla', icon: 'Container' },
  'Camión Aljibe / Cisterna': { label: 'Camión Aljibe / Cisterna', icon: 'Fuel' },
  'Bus Interurbano / Transporte Personal': { label: 'Bus / Minibús de Personal', icon: 'Bus' },
  'Camioneta Faena Minera 4x4': { label: 'Camioneta Faena 4x4', icon: 'Car' },
  'Furgón / Van Última Milla': { label: 'Furgón / Van Última Milla', icon: 'Package' },
  'Maquinaria Pesada / Grúa Horquilla': { label: 'Maquinaria / Grúa Horquilla', icon: 'Wrench' },
  'Camión Rígido / Pluma': { label: 'Camión Rígido / Pluma', icon: 'Cog' }
};

export const TRANSPORT_OPERATION_LABELS: Record<
  TransportOperationType,
  { label: string; badge: string; color: string; normativeRef: string }
> = {
  sustancias_peligrosas: {
    label: 'Transporte de Sustancias Peligrosas (SUSPEL)',
    badge: 'DS 298 / NCh 382',
    color: 'from-amber-500 to-red-600',
    normativeRef: 'DS 298 MTT • NCh 2120 • NCh 382'
  },
  mineria_alta_montana: {
    label: 'Operación Minera & Alta Montaña',
    badge: 'DS 132 Sernageomin',
    color: 'from-blue-600 to-indigo-700',
    normativeRef: 'DS 132 Minería • Estándar Alta Montaña'
  },
  pasajeros_interurbano: {
    label: 'Transporte Interurbano & Personal',
    badge: 'DS 212 MTT',
    color: 'from-emerald-500 to-teal-700',
    normativeRef: 'DS 212 MTT • Ley 18.290 Art. 75'
  },
  distribucion_urbana: {
    label: 'Distribución Urbana & Última Milla',
    badge: 'Urbano / DS 54',
    color: 'from-cyan-500 to-blue-600',
    normativeRef: 'Ley 18.290 • Ordenanzas Municipales'
  },
  forestal_ripio: {
    label: 'Transporte Forestal & Rutas de Ripio',
    badge: 'Forestal / Ripio',
    color: 'from-emerald-600 to-green-800',
    normativeRef: 'Estándar Corma • Ley 18.290'
  },
  carga_general: {
    label: 'Carga General Carretera Larga Distancia',
    badge: 'Carretera / DS 54',
    color: 'from-sky-500 to-indigo-600',
    normativeRef: 'DS 54 • DS 22 MTT • Ley 18.290'
  },
  faena_portuaria: {
    label: 'Operación Portuaria & Faena Cerrada',
    badge: 'Portuario',
    color: 'from-blue-500 to-cyan-700',
    normativeRef: 'Reglamento Directemar • ISO 39001'
  },
  cadena_frio: {
    label: 'Transporte Frigorífico & Perecibles',
    badge: 'Cadena de Frío',
    color: 'from-teal-400 to-blue-600',
    normativeRef: 'RSA Dto. 977 • DS 54 MTT'
  }
};

export const INITIAL_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  // 1. TRACTOCAMIÓN & SEMIRREMOLQUE CARGA GENERAL
  {
    id: 'tmpl-truck-carretera-01',
    code: 'CHK-TRK-CARRETERA',
    version: '2.4',
    name: 'Checklist Pre-Uso Tractocamión & Semirremolque (Carretera)',
    description:
      'Control operacional riguroso previo al despacho para unidades articuladas de larga distancia en rutas nacionales bajo Ley 18.290, DS 54 y DS 22.',
    applicableVehicleTypes: ['Tractocamión', 'Semirremolque / Rampla', 'Camión Rígido / Pluma'],
    applicableOperations: ['carga_general', 'distribucion_urbana', 'forestal_ripio'],
    frequency: 'antes_despacho',
    blockingPolicy: 'bloqueo_inmediato_criticos',
    maxAllowedMajorDefects: 1,
    isOfficialCertified: true,
    isCustom: false,
    createdAt: '2026-01-10',
    updatedAt: '2026-09-15',
    createdBy: 'Comité de Seguridad Blindaje Vial',
    sections: [
      {
        id: 'sec-doc-01',
        title: '1. Documentación Obligatoria & Habilitación de Conductor',
        description: 'Verificación legal obligatoria según Art. 5, 89 y 91 Ley 18.290.',
        items: [
          {
            id: 'it-doc-1',
            code: 'DOC-01',
            label: 'Revisión Técnica y Emisiones de Gases al día (Tracto y Rampla)',
            description: 'Certificado físico o digital vigente sin observaciones graves.',
            criticality: 'CRITICO',
            fieldType: 'fecha',
            normativeReference: 'Ley 18.290 Art. 89',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-doc-2',
            code: 'DOC-02',
            label: 'Seguro Obligatorio SOAP vigente para ambas patentes',
            description: 'Póliza vigente que cubre daños a terceros y ocupantes.',
            criticality: 'CRITICO',
            fieldType: 'fecha',
            normativeReference: 'Ley 18.490 Art. 1',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-doc-3',
            code: 'DOC-03',
            label: 'Licencia de Conducir Profesional A5 / A4 vigente del operador',
            description: 'Conductor habilitado sin suspensiones judiciales o administrativas.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 12',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-doc-4',
            code: 'DOC-04',
            label: 'Declaración de Descanso Legal Previo (Art. 25 bis Código del Trabajo)',
            description: 'Mínimo 8 horas de descanso continuo en tierra antes de tomar el servicio.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Código del Trabajo Art. 25 bis',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-frenos-01',
        title: '2. Sistema de Frenos, Neumáticos & Ruedas',
        description: 'Líneas neumáticas, presión de aire y estado de la banda de rodadura.',
        items: [
          {
            id: 'it-fr-1',
            code: 'FRN-01',
            label: 'Profundidad de surco en neumáticos tracto y rampla (Mínimo 2.0 mm)',
            description: 'Medición con profundímetro en el canal de mayor desgaste.',
            criticality: 'CRITICO',
            fieldType: 'numerico',
            numericUnit: 'mm',
            minAcceptableValue: 2.0,
            maxAcceptableValue: 20.0,
            normativeReference: 'DS 212 / DS 54 Art. 14',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-fr-2',
            code: 'FRN-02',
            label: 'Presión de inflado de neumáticos (100 - 120 PSI)',
            description: 'Comprobación de presión en frío con manómetro calibrado.',
            criticality: 'MAYOR',
            fieldType: 'numerico',
            numericUnit: 'psi',
            minAcceptableValue: 95,
            maxAcceptableValue: 125,
            normativeReference: 'Manual de Fabricante',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-fr-3',
            code: 'FRN-03',
            label: 'Líneas de aire neumáticas sin fugas audibles (Manómetro >= 100 PSI)',
            description: 'Carga completa de estanques de aire y verificación de caída de presión.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 75',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-fr-4',
            code: 'FRN-04',
            label: 'Indicadores testigo de torque (traba-tuercas) alineados',
            description: 'Todas las ruedas con sus pernos completos y flechas indicadoras enfrentadas.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Buenas Prácticas de Flota',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-luces-01',
        title: '3. Luces, Señalización & Visibilidad',
        description: 'Iluminación exterior reglamentaria según Decreto Supremo 22.',
        items: [
          {
            id: 'it-lc-1',
            code: 'LUC-01',
            label: 'Focos principales altos y bajos operativos y alineados',
            description: 'Ambos focos delanteros encendiendo con intensidad reglamentaria.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 22 MTT Art. 2',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-lc-2',
            code: 'LUC-02',
            label: 'Luces de freno, posición trasera y señalizadores de viraje',
            description: 'Funcionamiento simultáneo en cabezal y extremo posterior de la rampla.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 22 MTT Art. 4',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-lc-3',
            code: 'LUC-03',
            label: 'Alarma acústica y luces de retroceso operativas',
            description: 'Sonido intermitente claro audible a 15 metros de distancia.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 22 MTT Art. 8',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-lc-4',
            code: 'LUC-04',
            label: 'Cintas reflectantes 3M reglamentarias perimetrales limpias',
            description: 'Franjas rojo/blanco continuas en costados y traseras de la rampla.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 22 MTT Art. 12',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          }
        ]
      },
      {
        id: 'sec-acople-01',
        title: '4. Acople Mecánico (Quinta Rueda & Perno Rey)',
        description: 'Traba mecánica de seguridad y conexión de mangueras de servicio.',
        items: [
          {
            id: 'it-ac-1',
            code: 'ACP-01',
            label: 'Quinta rueda enganchada y pasador de seguridad bloqueado',
            description: 'Mordazas cerradas completamente alrededor del perno rey sin holgura excesiva.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 54 Art. 28',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-ac-2',
            code: 'ACP-02',
            label: 'Mangueras de aire espiraladas (roja y azul) y cable eléctrico 7 vías',
            description: 'Conexión firme sin roce contra el chasis o suelo de la cabina.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 54 Art. 30',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-ac-3',
            code: 'ACP-03',
            label: 'Patas de apoyo de la rampla totalmente retraídas y manivela trabada',
            description: 'Patas subidas a su posición máxima para evitar enganches en ruta.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Reglamento de Seguridad',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          }
        ]
      },
      {
        id: 'sec-emerg-01',
        title: '5. Equipos de Emergencia & Cabina',
        description: 'Elementos de seguridad vial exigidos para respuesta a siniestros.',
        items: [
          {
            id: 'it-em-1',
            code: 'EMG-01',
            label: 'Extintor PQS de 10 kg certificado con manómetro en verde y sello intacto',
            description: 'Vigencia de mantención anual visible en la etiqueta del proveedor.',
            criticality: 'CRITICO',
            fieldType: 'fecha',
            normativeReference: 'DS 212 / DS 594 Art. 45',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-em-2',
            code: 'EMG-02',
            label: 'Dos cuñas reglamentarias de fijación de ruedas presentes',
            description: 'Cuñas metálicas o de goma de alta densidad aptas para el peso de la unidad.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 75',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-em-3',
            code: 'EMG-03',
            label: 'Cinturón de seguridad de 3 puntas operativo en todos los asientos',
            description: 'Hebilla traba firmemente y el mecanismo retráctil no se encuentra trabado.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 75 bis',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-em-4',
            code: 'EMG-04',
            label: 'Parabrisas sin trizaduras o piquetes en la línea visual del conductor',
            description: 'Visibilidad panorámica sin obstrucciones conforme a norma de revisión técnica.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 54 Art. 18',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: false
          }
        ]
      }
    ]
  },

  // 2. CAMIÓN ALJIBE / CISTERNA SUSTANCIAS PELIGROSAS (DS 298)
  {
    id: 'tmpl-hazmat-suspel-02',
    code: 'CHK-SUSPEL-DS298',
    version: '3.1',
    name: 'Checklist Crítico Carga Peligrosa & Estanque (DS 298 / SUSPEL)',
    description:
      'Inspección obligatoria de alta exigencia para transporte terrestre de sustancias peligrosas en estanques y aljibes bajo DS 298 MTT, NCh 382 y NCh 2120.',
    applicableVehicleTypes: ['Camión Aljibe / Cisterna', 'Tractocamión', 'Semirremolque / Rampla'],
    applicableOperations: ['sustancias_peligrosas', 'mineria_alta_montana'],
    frequency: 'antes_despacho',
    blockingPolicy: 'bloqueo_inmediato_criticos',
    maxAllowedMajorDefects: 0,
    isOfficialCertified: true,
    isCustom: false,
    createdAt: '2026-02-01',
    updatedAt: '2026-09-18',
    createdBy: 'Oficial de Cumplimiento Normativo SUSPEL',
    sections: [
      {
        id: 'sec-suspel-doc',
        title: '1. Documentación Legal & Cartilla de Emergencia SUSPEL',
        description: 'Requisitos específicos exigidos por el Decreto Supremo N° 298.',
        items: [
          {
            id: 'it-s-doc-1',
            code: 'SUS-DOC-01',
            label: 'Hoja de Datos de Seguridad de Transporte (HDST) vigente en cabina',
            description: 'En español, accesible de inmediato y con teléfono de emergencia 24/7.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 7 • NCh 2245',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-doc-2',
            code: 'SUS-DOC-02',
            label: 'Licencia A4 / A5 con Acreditación de Sustancias Peligrosas',
            description: 'Curso de capacitación de transporte de sustancias peligrosas vigente.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 11',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-doc-3',
            code: 'SUS-DOC-03',
            label: 'Certificado de estanqueidad e inspección periódica del estanque al día',
            description: 'Prueba hidrostática o ensayos no destructivos vigentes por organismo acreditado.',
            criticality: 'CRITICO',
            fieldType: 'fecha',
            normativeReference: 'DS 298 Art. 14',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-suspel-rot',
        title: '2. Rótulos, Placas NCh 2120 & Sistema Antiestático',
        description: 'Identificación visual obligatoria de los riesgos del producto.',
        items: [
          {
            id: 'it-s-rot-1',
            code: 'SUS-ROT-01',
            label: 'Rótulos de peligro NCh 2120 visibles en los 4 costados de la unidad',
            description: 'Diamantes de peligro sin rasgaduras, limpios y correspondientes a la carga UN.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 4 • NCh 2190',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-rot-2',
            code: 'SUS-ROT-02',
            label: 'Panel naranja con Número Naciones Unidas (UN) y código de riesgo',
            description: 'Números reflectantes reglamentarios legibles a 30 metros.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 5 • NCh 382',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-rot-3',
            code: 'SUS-ROT-03',
            label: 'Cable y pinza de puesta a tierra antiestática en buen estado',
            description: 'Continuidad eléctrica probada para disipar corrientes estáticas.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 19',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-rot-4',
            code: 'SUS-ROT-04',
            label: 'Interruptor maestro de corte de corriente (Master Switch) operativo',
            description: 'Corte eléctrico general accionable desde el exterior y la cabina.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 18',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-suspel-valv',
        title: '3. Válvulas, Escotillas & Control de Derrames',
        description: 'Hermeticidad del estanque y equipamiento para contención ambiental.',
        items: [
          {
            id: 'it-s-v-1',
            code: 'SUS-VLV-01',
            label: 'Válvula de corte rápido de emergencia (Fusible térmico/neumático)',
            description: 'Cierre instantáneo de válvulas de descarga en caso de emergencia.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 16',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-v-2',
            code: 'SUS-VLV-02',
            label: 'Escotillas superiores herméticas y sin filtraciones de vapores',
            description: 'Empaquetaduras en buen estado y pernos mariposa ajustados.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 15',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-v-3',
            code: 'SUS-VLV-03',
            label: 'Kit para control de derrames completo (Paños, barreras, pala antichispa)',
            description: 'Material absorbente homologado para la sustancia química transportada.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 21',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-s-v-4',
            code: 'SUS-VLV-04',
            label: 'Dos extintores de 10 kg PQS certificados y vigentes al alcance exterior',
            description: 'Ubicados en cajas protectoras de fácil apertura y con manómetros presurizados.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 298 Art. 20',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      }
    ]
  },

  // 3. CAMIONETA FAENA MINERA 4X4 (ESTÁNDAR MINERO)
  {
    id: 'tmpl-mining-4x4-03',
    code: 'CHK-MIN-4X4',
    version: '1.8',
    name: 'Checklist Pre-Uso Camioneta 4x4 Faena Minera (Alta Montaña)',
    description:
      'Control diario preventivo para camionetas de faena y vehículos livianos de transporte en minería bajo Estándar Sernageomin DS 132 e ISO 39001.',
    applicableVehicleTypes: ['Camioneta Faena Minera 4x4', 'Furgón / Van Última Milla'],
    applicableOperations: ['mineria_alta_montana', 'faena_portuaria', 'forestal_ripio'],
    frequency: 'pre_uso_diario',
    blockingPolicy: 'bloqueo_inmediato_criticos',
    maxAllowedMajorDefects: 1,
    isOfficialCertified: true,
    isCustom: false,
    createdAt: '2026-02-15',
    updatedAt: '2026-09-12',
    createdBy: 'Prevencionista Jefe Minería',
    sections: [
      {
        id: 'sec-min-disp',
        title: '1. Dispositivos Específicos de Seguridad Minera',
        description: 'Elementos de alta visibilidad exigidos por faenas mineras.',
        items: [
          {
            id: 'it-m-1',
            code: 'MIN-01',
            label: 'Pértiga telescópica de 3 metros con luz LED en la punta y banderín rojo',
            description: 'Encendido sincronizado con las luces o interruptor independiente.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Reglamento Interno Faena Minera',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-m-2',
            code: 'MIN-02',
            label: 'Baliza estroboscópica ámbar operativa en el techo o barra antivuelco',
            description: 'Destellos de alta intensidad visibles a 360 grados.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 132 Minería Art. 45',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-m-3',
            code: 'MIN-03',
            label: 'Tracción 4x4 (Alta / Baja) y bloqueo de diferencial funcionando',
            description: 'Acople suave de la doble tracción verificado antes de ingresar a faena.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Estándar de Control de Fatalidades',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-m-4',
            code: 'MIN-04',
            label: 'Radio base de comunicación VHF / UHF sintonizada en canal de garita',
            description: 'Transmisión y recepción clara para coordinación en caminos de acarreo.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Reglamento de Tránsito Minero',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-min-mec',
        title: '2. Mecánica, Neumáticos Todo Terreno & Emergencia',
        description: 'Traba-tuercas, cuñas de poliuretano y kit de alta montaña.',
        items: [
          {
            id: 'it-m-5',
            code: 'MIN-05',
            label: 'Profundidad de surco en neumáticos A/T (Mínimo 4.0 mm para faena)',
            description: 'Banda de rodadura apta para tracción en ripio, nieve y barro.',
            criticality: 'CRITICO',
            fieldType: 'numerico',
            numericUnit: 'mm',
            minAcceptableValue: 4.0,
            maxAcceptableValue: 18.0,
            normativeReference: 'Estándar Vehículos Livianos Minería',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-m-6',
            code: 'MIN-06',
            label: 'Dos cuñas de poliuretano de alta resistencia con soporte seguro',
            description: 'Cuñas con piola de seguridad presentes en el pickup o base.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 132 Art. 48',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-m-7',
            code: 'MIN-07',
            label: 'Cadenas para nieve/hielo en buen estado con tensores (Kit Invierno)',
            description: 'Juego completo de cadenas para las ruedas motrices probado.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Plan de Operación Invierno Minero',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-m-8',
            code: 'MIN-08',
            label: 'Dispositivo Alcolock / Test de alcohol en garita verificado',
            description: 'Dispositivo de bloqueo por aliento operativo y conductor evaluado.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Tolerancia Cero • Dictamen SUSESO',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      }
    ]
  },

  // 4. BUS INTERURBANO & TRANSPORTE DE PERSONAL (DS 212)
  {
    id: 'tmpl-bus-pasajeros-04',
    code: 'CHK-BUS-DS212',
    version: '2.0',
    name: 'Checklist Seguridad Pasajeros & Bus Interurbano (DS 212 MTT)',
    description:
      'Control integral de habitabilidad, cinturones de 3 puntas, tacógrafo y salidas de emergencia para transporte de pasajeros y personal de faena.',
    applicableVehicleTypes: ['Bus Interurbano / Transporte Personal'],
    applicableOperations: ['pasajeros_interurbano', 'mineria_alta_montana'],
    frequency: 'antes_despacho',
    blockingPolicy: 'bloqueo_inmediato_criticos',
    maxAllowedMajorDefects: 1,
    isOfficialCertified: true,
    isCustom: false,
    createdAt: '2026-03-01',
    updatedAt: '2026-09-17',
    createdBy: 'Jefe de Transporte Interurbano',
    sections: [
      {
        id: 'sec-bus-pas',
        title: '1. Seguridad en Salón de Pasajeros & Evacuación',
        description: 'Exigencias de protección de vidas humanas bajo normativa MTT.',
        items: [
          {
            id: 'it-b-1',
            code: 'BUS-01',
            label: 'Cinturones de seguridad de 3 puntas en TODOS los asientos operativos',
            description: 'Inspección del 100% de las butacas con anclajes firmes y hebillas suaves.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 212 MTT • Ley 18.290 Art. 75 bis',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-b-2',
            code: 'BUS-02',
            label: 'Martillos de impacto para rotura de ventanillas en sus soportes',
            description: 'Mínimo 4 martillos con cable de retención e instructivo visible.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 212 MTT Art. 32',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-b-3',
            code: 'BUS-03',
            label: 'Escotillas de techo de ventilación y escape libres de trabas',
            description: 'Mecanismo de apertura de emergencia probado desde el interior.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 212 MTT Art. 34',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-b-4',
            code: 'BUS-04',
            label: 'Pasillo central libre de equipaje y piso antideslizante seco',
            description: 'Vía de evacuación expedita sin obstáculos para los pasajeros.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 212 MTT Art. 28',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-bus-ctrl',
        title: '2. Dispositivos de Control de Velocidad & Descanso',
        description: 'Instrumentación para fiscalización de velocidad y fatiga humana.',
        items: [
          {
            id: 'it-b-5',
            code: 'BUS-05',
            label: 'Panel digital indicador de velocidad interior visible a pasajeros',
            description: 'Display encendido con lectura sincronizada con el odómetro/GPS.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 212 MTT Art. 19 bis',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-b-6',
            code: 'BUS-06',
            label: 'Tacógrafo / Registro electrónico de velocidad y tiempo de conducción',
            description: 'Disco o memoria activa con menos de 24 horas y sin saltos.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Código del Trabajo Art. 25 bis',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-b-7',
            code: 'BUS-07',
            label: 'Test de alcoholemia negativo y control de drogas al conductor de turno',
            description: '0.00 g/l en alcotest y panel reactivo de saliva en garita.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Dictamen SUSESO 92064-2025',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          }
        ]
      }
    ]
  },

  // 5. FURGÓN / CAMIÓN DISTRIBUCIÓN URBANA ÚLTIMA MILLA
  {
    id: 'tmpl-van-urbano-05',
    code: 'CHK-VAN-URBANA',
    version: '1.5',
    name: 'Checklist Distribución Urbana & Última Milla (Furgones / Camiones)',
    description:
      'Control diario de seguridad para flotas de reparto y mensajería en zonas de alta densidad urbana, estacionamientos y maniobras estrechas.',
    applicableVehicleTypes: ['Furgón / Van Última Milla', 'Camión Rígido / Pluma'],
    applicableOperations: ['distribucion_urbana', 'cadena_frio'],
    frequency: 'pre_uso_diario',
    blockingPolicy: 'bloqueo_inmediato_criticos',
    maxAllowedMajorDefects: 2,
    isOfficialCertified: true,
    isCustom: false,
    createdAt: '2026-03-10',
    updatedAt: '2026-09-14',
    createdBy: 'Supervisor de Flota Urbana',
    sections: [
      {
        id: 'sec-van-seg',
        title: '1. Maniobrabilidad, Retroceso & Visibilidad',
        description: 'Prevención de atropellos y colisiones en maniobras de reparto.',
        items: [
          {
            id: 'it-v-1',
            code: 'VAN-01',
            label: 'Cámara de retroceso o sensores de proximidad funcionando',
            description: 'Pantalla nítida en cabina para detección de peatones y obstáculos bajos.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Manual de Prevención de Riesgos',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-v-2',
            code: 'VAN-02',
            label: 'Espejos laterales convexos ajustados sin trizaduras',
            description: 'Eliminación óptima de puntos ciegos laterales para giros en esquinas.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 54 Art. 16',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-v-3',
            code: 'VAN-03',
            label: 'Cierre de puertas traseras y laterales con traba hermética',
            description: 'Evita la apertura accidental de compartimento de carga durante el tránsito.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 18.290 Art. 75',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: true
          }
        ]
      },
      {
        id: 'sec-van-erg',
        title: '2. Seguridad de Carga, Estiba & Ergonomía',
        description: 'Protección del operador frente a desplazamientos de bultos.',
        items: [
          {
            id: 'it-v-4',
            code: 'VAN-04',
            label: 'Mampara divisoria entre cabina y compartimento de carga fija y resistente',
            description: 'Reja o tabique que impide que los paquetes golpeen la espalda del conductor en frenadas.',
            criticality: 'CRITICO',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley 16.744 / DS 594',
            requiresPhotoOnDefect: true,
            requiresCommentOnDefect: true
          },
          {
            id: 'it-v-5',
            code: 'VAN-05',
            label: 'Extintor de 2 kg accesible desde la cabina y botiquín básico',
            description: 'Presurizado en verde con fijación rápida desmontable.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'DS 594 Art. 45',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          },
          {
            id: 'it-v-6',
            code: 'VAN-06',
            label: 'Cinturón de seguridad y soporte seguro para teléfono/PDA de reparto',
            description: 'Dispositivo GPS de ruta fijo en el tablero sin obstaculizar la visión frontal.',
            criticality: 'MAYOR',
            fieldType: 'conforme_no_conforme',
            normativeReference: 'Ley No Chat Art. 114 bis',
            requiresPhotoOnDefect: false,
            requiresCommentOnDefect: false
          }
        ]
      }
    ]
  }
];

export const INITIAL_CHECKLIST_INSPECTIONS: ChecklistInspectionExecution[] = [
  {
    id: 'insp-20260919-01',
    folio: 'INSP-20260919-001',
    templateId: 'tmpl-truck-carretera-01',
    templateName: 'Checklist Pre-Uso Tractocamión & Semirremolque (Carretera)',
    templateCode: 'CHK-TRK-CARRETERA',
    companyId: 'comp-trans-chile-1',
    date: '2026-09-19',
    time: '07:15',
    checkpoint: 'Garita Despacho Norte - Base Quilicura',
    vehiclePlate: 'KJ-84-92',
    vehicleType: 'Tractocamión',
    odometerKm: 342150,
    driverId: 'drv-001',
    driverRut: '15.482.910-3',
    driverName: 'Rodrigo Antonio Silva Morales',
    inspectorName: 'Juan Carlos Vergara',
    inspectorRole: 'Supervisor de Garita & Prevención',
    operationType: 'carga_general',
    answers: {
      'it-doc-1': { itemId: 'it-doc-1', status: 'conforme', dateValue: '2026-12-15' },
      'it-doc-2': { itemId: 'it-doc-2', status: 'conforme', dateValue: '2027-03-31' },
      'it-doc-3': { itemId: 'it-doc-3', status: 'conforme' },
      'it-doc-4': { itemId: 'it-doc-4', status: 'conforme' },
      'it-fr-1': { itemId: 'it-fr-1', status: 'conforme', numericValue: 6.8 },
      'it-fr-2': { itemId: 'it-fr-2', status: 'conforme', numericValue: 110 },
      'it-fr-3': { itemId: 'it-fr-3', status: 'conforme' },
      'it-fr-4': { itemId: 'it-fr-4', status: 'conforme' },
      'it-lc-1': { itemId: 'it-lc-1', status: 'conforme' },
      'it-lc-2': { itemId: 'it-lc-2', status: 'conforme' },
      'it-lc-3': { itemId: 'it-lc-3', status: 'conforme' },
      'it-lc-4': { itemId: 'it-lc-4', status: 'conforme' },
      'it-ac-1': { itemId: 'it-ac-1', status: 'conforme' },
      'it-ac-2': { itemId: 'it-ac-2', status: 'conforme' },
      'it-ac-3': { itemId: 'it-ac-3', status: 'conforme' },
      'it-em-1': { itemId: 'it-em-1', status: 'conforme', dateValue: '2027-01-20' },
      'it-em-2': { itemId: 'it-em-2', status: 'conforme' },
      'it-em-3': { itemId: 'it-em-3', status: 'conforme' },
      'it-em-4': { itemId: 'it-em-4', status: 'conforme' }
    },
    totalItems: 18,
    conformingItems: 18,
    criticalDefectsCount: 0,
    majorDefectsCount: 0,
    minorDefectsCount: 0,
    complianceScore: 100,
    dispatchDecision: 'AUTORIZADO',
    dispatchDecisionReason: 'Unidad y conductor cumplen 100% los requerimientos de seguridad vial.',
    driverSignatureTimestamp: '2026-09-19 07:18',
    inspectorSignatureTimestamp: '2026-09-19 07:20',
    hashSha256: '9a7b4f32e18d6c54789abce0123456789abcdef0123456789abcdef012345678',
    status: 'completada'
  },
  {
    id: 'insp-20260919-02',
    folio: 'INSP-20260919-002',
    templateId: 'tmpl-hazmat-suspel-02',
    templateName: 'Checklist Crítico Carga Peligrosa & Estanque (DS 298 / SUSPEL)',
    templateCode: 'CHK-SUSPEL-DS298',
    companyId: 'comp-trans-chile-1',
    date: '2026-09-19',
    time: '08:05',
    checkpoint: 'Garita Química Sur - Base San Bernardo',
    vehiclePlate: 'WP-77-31',
    vehicleType: 'Camión Aljibe / Cisterna',
    odometerKm: 215400,
    driverId: 'drv-002',
    driverRut: '17.912.450-K',
    driverName: 'Matías Ignacio Valenzuela Rojas',
    inspectorName: 'Patricia Morales Soto',
    inspectorRole: 'Ingeniero en Prevención de Riesgos',
    operationType: 'sustancias_peligrosas',
    answers: {
      'it-s-doc-1': { itemId: 'it-s-doc-1', status: 'conforme' },
      'it-s-doc-2': { itemId: 'it-s-doc-2', status: 'conforme' },
      'it-s-doc-3': { itemId: 'it-s-doc-3', status: 'conforme', dateValue: '2026-11-30' },
      'it-s-rot-1': { itemId: 'it-s-rot-1', status: 'conforme' },
      'it-s-rot-2': { itemId: 'it-s-rot-2', status: 'conforme' },
      'it-s-rot-3': { itemId: 'it-s-rot-3', status: 'conforme' },
      'it-s-rot-4': { itemId: 'it-s-rot-4', status: 'conforme' },
      'it-s-v-1': { itemId: 'it-s-v-1', status: 'conforme' },
      'it-s-v-2': { itemId: 'it-s-v-2', status: 'no_conforme', observations: 'Filtración menor en empaquetadura escotilla trasera' },
      'it-s-v-3': { itemId: 'it-s-v-3', status: 'conforme' },
      'it-s-v-4': { itemId: 'it-s-v-4', status: 'conforme' }
    },
    totalItems: 11,
    conformingItems: 10,
    criticalDefectsCount: 1,
    majorDefectsCount: 0,
    minorDefectsCount: 0,
    complianceScore: 90.9,
    dispatchDecision: 'BLOQUEO_INMEDIATO',
    dispatchDecisionReason: 'Falla crítica detectada en escotilla estanque (DS 298 Art. 15). Se ordena Bloqueo Inmediato de ruta y derivación a taller especializado.',
    driverSignatureTimestamp: '2026-09-19 08:12',
    inspectorSignatureTimestamp: '2026-09-19 08:14',
    hashSha256: 'b45c7890ef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'completada'
  }
];
