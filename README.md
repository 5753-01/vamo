# Blindaje Vial 360 — Sistema de Control y Custodia Toxicológica Laboral

Sistema integral de gestión, control y auditoría forense para pruebas de alcohotest y drogas en operaciones de transporte de carga y pasajeros en Chile, en estricto cumplimiento con el **Dictamen SUSESO 92064-2025**, la **Ley 18.290** (Tolerancia Cero) y la **Ley 16.744** (Accidentes del Trabajo y Enfermedades Profesionales).

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- Node.js 18+ o superior
- npm o bun / pnpm

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd blindaje-vial-360

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Scripts Disponibles

- `npm run dev`: Inicia el servidor fullstack (Express + Vite) en modo desarrollo.
- `npm run build`: Compila el frontend estático y empaqueta el backend en `dist/server.cjs`.
- `npm run start`: Inicia el servidor de producción con `node dist/server.cjs`.
- `npm run lint`: Ejecuta el validador TypeScript (`tsc --noEmit`).

---

## 📦 Cómo Exportar el Repositorio desde Google AI Studio

Puedes descargar o sincronizar el código fuente directamente desde la interfaz de Google AI Studio:

1. **Exportar a GitHub**:
   - En la esquina superior de la interfaz de AI Studio, haz clic en el menú **Settings** o en el ícono de los **tres puntos (`...`)**.
   - Selecciona **Export to GitHub**.
   - Conecta tu cuenta de GitHub y elige si deseas crear un repositorio nuevo público o privado.
   - Todos los commits y ramas se sincronizarán directamente con tu cuenta.

2. **Descargar archivo ZIP**:
   - En el mismo menú superior, selecciona **Download ZIP** o **Export project**.
   - Se descargará un archivo comprimido `.zip` con el 100% del código fuente, configuración, activos y dependencias.

---

## 🏛️ Arquitectura y Tecnologías

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas-Confetti, Recharts.
- **Backend**: Node.js + Express (`server.ts`) con integración segura y middleware Vite.
- **Seguridad Forense**: Sellado criptográfico **SHA-256**, verificación inalterable de bitácora y validación estricta de formatos de RUT chileno.
- **Modo Offline y PWA**: Service Worker (`public/sw.js`), almacenamiento local resiliente (`localStorage` + snapshot forense) y sincronización diferida automática.
- **Exportación de Datos**: Libros de cálculo nativos en **Microsoft Excel (.xlsx)** con `xlsx`, archivos **CSV estándar RFC-4180 UTF-8 BOM** y actas imprimibles en formato PDF para fiscalizaciones.

---

## 🛡️ Módulos Principales del Sistema

1. **Gestión de Controles Toxicológicos**: Registro de alcohotest en g/L y paneles de 6 drogas (THC, COC, AMP, BZO, OPI, MET) con bloqueo preventivo automático.
2. **Bitácora Forense Inalterable**: Registro auditable con IP, actor, timestamp y hashes SHA-256 encadenados.
3. **Selector Aleatorio Probabilístico**: Algoritmo conforme a la circular SUSESO para evitar sesgos en la toma de muestras preventivas.
4. **Matriz de Cumplimiento Normativo**: Checklist exhaustivo de dictámenes SUSESO, Ley 16.744, Ley 18.290 y normativas laborales vigentes en Chile.
5. **Centro de Respaldos Administrativos**: Exportador de respaldos consolidados y filtros temporales/geográficos para auditorías de mutualidades (ACHS, Mutual, IST) y Dirección del Trabajo (DT).
6. **Portal de Laboratorio y Cadena de Custodia**: Seguimiento de muestras confirmatorias enviadas a laboratorios toxicológicos acreditados.

---

## 📄 Licencia y Marco Legal
Desarrollado para operaciones de transporte en Chile.
Cumplimiento normativo estricto: **Dictamen SUSESO 92064-2025 / Ley 18.290 / Ley 16.744**.
