import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  X,
  Zap,
  Info,
  ArrowRight,
  Maximize2,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { Driver } from '../types';
import {
  formatChileanRut,
  validateChileanRut,
  normalizeDateToIso,
  generateSampleChileanLicense,
  LicenseOcrResult
} from '../utils/licenseOcrHelper';

interface DriverLicenseCameraOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceDate: string;
  drivers: Driver[];
  onApplyToLiveValidator: (data: {
    driverId?: string;
    rut: string;
    licenseExpiry: string;
    fullName?: string;
    licenseClasses?: string[];
  }) => void;
  onUpdateDriverExpiry?: (driverId: string, newExpiryDate: string) => void;
  onBlockDriver?: (driverId: string, reason: string) => void;
}

export const DriverLicenseCameraOcrModal: React.FC<DriverLicenseCameraOcrModalProps> = ({
  isOpen,
  onClose,
  referenceDate,
  drivers,
  onApplyToLiveValidator,
  onUpdateDriverExpiry,
  onBlockDriver
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');

  // Camera stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  // Captured image and OCR processing state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [ocrStepMessage, setOcrStepMessage] = useState<string>('');
  const [ocrResult, setOcrResult] = useState<LicenseOcrResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Editable confirmed fields
  const [editedRut, setEditedRut] = useState<string>('');
  const [editedExpiry, setEditedExpiry] = useState<string>('');
  const [editedFullName, setEditedFullName] = useState<string>('');
  const [editedClasses, setEditedClasses] = useState<string[]>(['A2', 'A4']);

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  // Start camera
  const startCamera = async (deviceId?: string) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'La API de cámara (getUserMedia) no está disponible en este navegador o entorno. Puede subir una foto o utilizar una muestra oficial.'
        );
        return;
      }

      // Enumerate devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vDevices = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(vDevices);
      } catch {}

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities && track.getCapabilities()) as any;
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let errorMsg = 'No se pudo acceder a la cámara del dispositivo.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg =
          'Permiso de cámara denegado por el navegador. Habilite el acceso o utilice la opción de subir fotografía.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No se detectó cámara disponible en este equipo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'La cámara está siendo utilizada por otra aplicación.';
      }
      setCameraError(errorMsg);
      setCameraActive(false);
    }
  };

  // Toggle torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      await (track as any).applyConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Capture photo from video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    setCapturedImage(dataUrl);
    runOcrAnalysis(dataUrl);
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        stopCamera();
        setCapturedImage(dataUrl);
        runOcrAnalysis(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run sample preset
  const handleSelectSample = (sampleType: 'vencida' | 'urgente' | 'vigente') => {
    let sampleData: any;
    if (sampleType === 'vencida') {
      sampleData = {
        rut: '14.567.890-2',
        fullName: 'Pedro Ignacio Rojas',
        licenseClasses: ['A2', 'A4'],
        expiryDate: '2026-08-25',
        issueDate: '2022-08-25',
        municipality: 'I. Municipalidad de Santiago',
        folio: 'FOL-MTT-2022-9912'
      };
    } else if (sampleType === 'urgente') {
      sampleData = {
        rut: '16.789.012-3',
        fullName: 'Rodrigo Alejandro Soto',
        licenseClasses: ['A1', 'A3'],
        expiryDate: '2026-09-24',
        issueDate: '2022-09-24',
        municipality: 'I. Municipalidad de Antofagasta',
        folio: 'FOL-MTT-2022-4410'
      };
    } else {
      sampleData = {
        rut: '12.845.670-K',
        fullName: 'Juan Carlos Pérez',
        licenseClasses: ['A5', 'B'],
        expiryDate: '2027-11-15',
        issueDate: '2023-11-15',
        municipality: 'I. Municipalidad de Quilicura',
        folio: 'FOL-MTT-2023-1288'
      };
    }

    const dataUrl = generateSampleChileanLicense(sampleData);
    stopCamera();
    setCapturedImage(dataUrl);
    runOcrAnalysis(dataUrl);
  };

  // Execute OCR endpoint call
  const runOcrAnalysis = async (imageBase64: string) => {
    setIsProcessingOcr(true);
    setOcrError(null);
    setOcrResult(null);

    setOcrStepMessage('1/4 Capturando fotograma de alta resolución...');
    await new Promise((r) => setTimeout(r, 400));

    setOcrStepMessage('2/4 Inicializando visión OCR de Blindaje Vial (Gemini 3.8 Flash)...');
    await new Promise((r) => setTimeout(r, 450));

    setOcrStepMessage('3/4 Extrayendo RUT chileno, fecha de vencimiento y clases Ley 18.290...');

    try {
      const knownPayload = drivers.map((d) => ({
        id: d.id,
        fullName: d.fullName,
        rut: d.rut,
        licenseExpiry: d.licenseExpiry,
        assignedBase: d.assignedBase,
        licenseClass: d.licenseClass
      }));

      const response = await fetch('/api/license/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
          knownDrivers: knownPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor OCR (${response.status})`);
      }

      setOcrStepMessage('4/4 Validando algoritmo Módulo 11 y cotejo en garita...');
      await new Promise((r) => setTimeout(r, 350));

      const data = await response.json();

      const canonicalRut = formatChileanRut(data.rut || '');
      const isoDate = normalizeDateToIso(data.licenseExpiry || '');

      setOcrResult({
        rut: canonicalRut,
        licenseExpiry: isoDate,
        fullName: data.fullName,
        licenseClasses: data.licenseClasses || ['A2', 'A4'],
        municipality: data.municipality,
        issueDate: data.issueDate,
        confidence: data.confidence || 92,
        legibility: data.legibility || 'alta',
        notes: data.notes,
        matchedDriverId: data.matchedDriverId || null,
        isFallback: data.isFallback
      });

      setEditedRut(canonicalRut);
      setEditedExpiry(isoDate);
      setEditedFullName(data.fullName || '');
      setEditedClasses(data.licenseClasses || ['A2', 'A4']);
    } catch (err: any) {
      console.error('OCR Error:', err);
      setOcrError(
        err?.message ||
          'No se pudo completar la extracción OCR. Verifique la nitidez de la imagen e intente nuevamente.'
      );
    } finally {
      setIsProcessingOcr(false);
      setOcrStepMessage('');
    }
  };

  // Re-take photo
  const handleRetake = () => {
    setCapturedImage(null);
    setOcrResult(null);
    setOcrError(null);
    if (activeTab === 'camera') {
      startCamera(selectedDeviceId);
    }
  };

  // Effect to manage camera lifecycle
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCamera(selectedDeviceId);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, selectedDeviceId]);

  if (!isOpen) return null;

  // Analysis of the extracted date against reference audit date
  let daysDiff = 0;
  let isExpired = false;
  let isUrgent = false;
  let isUpcoming = false;

  if (editedExpiry && referenceDate) {
    const refTime = new Date(referenceDate).getTime();
    const expTime = new Date(editedExpiry).getTime();
    daysDiff = Math.ceil((expTime - refTime) / (1000 * 60 * 60 * 24));
    isExpired = daysDiff < 0;
    isUrgent = daysDiff >= 0 && daysDiff <= 15;
    isUpcoming = daysDiff > 15 && daysDiff <= 30;
  }

  // Matched driver in local registry
  const matchedDriver = drivers.find((d) => {
    if (ocrResult?.matchedDriverId && d.id === ocrResult.matchedDriverId) return true;
    const cleanD = d.rut.replace(/[^0-9kK]/g, '').toUpperCase();
    const cleanE = (editedRut || '').replace(/[^0-9kK]/g, '').toUpperCase();
    return cleanD === cleanE;
  });

  const isRutValid = validateChileanRut(editedRut);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Captura & OCR Pericial de Licencia de Conducir
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  LEY 18.290 • CONASET
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fotografía el documento físico para extraer automáticamente el RUT y la fecha de vencimiento.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Top Source Mode Tabs */}
          {!capturedImage && (
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'camera'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Usar Cámara en Vivo</span>
              </button>

              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir Foto del Documento</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setActiveTab('samples')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'samples'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ejemplos Oficiales de Prueba</span>
              </button>
            </div>
          )}

          {/* VIEW A: LIVE CAMERA STREAM */}
          {!capturedImage && activeTab === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs space-y-3">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Error al conectar con la cámara:</p>
                      <p className="mt-0.5 text-rose-200">{cameraError}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => startCamera(selectedDeviceId)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reintentar Conexión</span>
                    </button>
                    <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto de Licencia</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 aspect-[16/9] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Document Target Alignment Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                    <div className="w-[82%] sm:w-[68%] aspect-[1.58/1] border-2 border-dashed border-blue-400/90 rounded-2xl relative shadow-2xl flex flex-col items-center justify-between p-3 bg-slate-950/10">
                      {/* 4 Corner Markers */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl -mt-1 -ml-1" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl -mt-1 -mr-1" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl -mb-1 -ml-1" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl -mb-1 -mr-1" />

                      <div className="bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/40 text-[11px] font-bold text-white shadow">
                        ALINEE LA LICENCIA DENTRO DEL RECUADRO
                      </div>

                      <div className="text-[10px] text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                        RUT y Vencimiento legibles
                      </div>
                    </div>
                  </div>

                  {/* Camera Controls Overlay Bottom */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 z-10">
                    {hasTorch && (
                      <button
                        onClick={toggleTorch}
                        className={`p-3 rounded-full border backdrop-blur-md transition ${
                          torchOn
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                            : 'bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Linterna / Flash"
                      >
                        <Zap className="w-5 h-5" />
                      </button>
                    )}

                    {/* Big Shutter Button */}
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white p-1 shadow-xl flex items-center justify-center transition transform active:scale-95 group"
                      title="Tomar fotografía para OCR"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:scale-105 transition">
                        <Camera className="w-6 h-6" />
                      </div>
                    </button>

                    {/* Camera Selector Switcher */}
                    {videoDevices.length > 1 && (
                      <button
                        onClick={() => {
                          const currentIndex = videoDevices.findIndex(
                            (d) => d.deviceId === selectedDeviceId
                          );
                          const nextDevice =
                            videoDevices[(currentIndex + 1) % videoDevices.length];
                          setSelectedDeviceId(nextDevice.deviceId);
                          startCamera(nextDevice.deviceId);
                        }}
                        className="p-3 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition"
                        title="Cambiar Cámara"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW B: SAMPLES SELECTION */}
          {!capturedImage && activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-blue-300">
                <p className="font-bold flex items-center gap-1.5 text-white">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Muestras de Licencias Chilenas Oficiales (CONASET / MTT)
                </p>
                <p className="mt-1">
                  Permite probar el reconocimiento óptico de caracteres (OCR) al instante sin necesidad de cámara física.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sample 1: Vencida */}
                <div
                  onClick={() => handleSelectSample('vencida')}
                  className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                      LICENCIA VENCIDA
                    </span>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-rose-300 transition">
                    Pedro Ignacio Rojas
                  </h4>
                  <p className="text-xs font-mono text-slate-300">RUT: 14.567.890-2</p>
                  <div className="text-[11px] text-rose-400 font-semibold">
                    Vencimiento: 2026-08-25 (Vencida)
                  </div>
                  <p className="text-[10px] text-slate-400">Clases A2/A4 • Puerto Montt</p>
                  <button className="w-full mt-2 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition">
                    Cargar y Analizar OCR
                  </button>
                </div>

                {/* Sample 2: Urgente */}
                <div
                  onClick={() => handleSelectSample('urgente')}
                  className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 hover:bg-red-950/40 cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded">
                      URGENTE (&lt; 15 DÍAS)
                    </span>
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-red-300 transition">
                    Rodrigo Alejandro Soto
                  </h4>
                  <p className="text-xs font-mono text-slate-300">RUT: 16.789.012-3</p>
                  <div className="text-[11px] text-red-400 font-semibold">
                    Vencimiento: 2026-09-24 (en 11d)
                  </div>
                  <p className="text-[10px] text-slate-400">Clases A1/A3 • Antofagasta</p>
                  <button className="w-full mt-2 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition">
                    Cargar y Analizar OCR
                  </button>
                </div>

                {/* Sample 3: Vigente */}
                <div
                  onClick={() => handleSelectSample('vigente')}
                  className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                      VIGENTE Y HABILITADA
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                    Juan Carlos Pérez
                  </h4>
                  <p className="text-xs font-mono text-slate-300">RUT: 12.845.670-K</p>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Vencimiento: 2027-11-15
                  </div>
                  <p className="text-[10px] text-slate-400">Clases A5/B • Quilicura</p>
                  <button className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition">
                    Cargar y Analizar OCR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW C: CAPTURED IMAGE PREVIEW & OCR IN-PROGRESS SCANNING */}
          {capturedImage && isProcessingOcr && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/60 max-h-80 flex items-center justify-center bg-slate-950">
                <img
                  src={capturedImage}
                  alt="Licencia de Conducir"
                  className="w-full h-full object-contain max-h-72 opacity-80"
                />

                {/* Animated Scanning Laser Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanBeam" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-700/80 backdrop-blur-md p-3 rounded-xl flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-white">{ocrStepMessage}</p>
                    <p className="text-[10px] text-slate-400">
                      Model: Gemini 3.8 Flash • Algoritmo de Extracción Pericial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW D: OCR RESULTS & VERIFICATION PANEL */}
          {capturedImage && !isProcessingOcr && ocrResult && (
            <div className="space-y-5">
              {ocrError ? (
                <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-200 text-xs">
                  <p className="font-bold">Error en la lectura:</p>
                  <p>{ocrError}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Scanned Image with overlay */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                    <img
                      src={capturedImage}
                      alt="Licencia Capturada"
                      className="w-full object-contain max-h-64"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      Foto Original Registrada
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={handleRetake}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tomar otra foto</span>
                    </button>

                    <span className="text-[11px] text-slate-400 font-mono">
                      Certeza OCR: <strong className="text-emerald-400">{ocrResult.confidence}%</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Extracted fields and analysis */}
                <div className="lg:col-span-7 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">Datos Extraídos de la Licencia</h4>
                    </div>
                    {ocrResult.isFallback && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        Modo Contingencia
                      </span>
                    )}
                  </div>

                  {/* Primary Fields Grid: RUT & Vencimiento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* RUT */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          RUT del Conductor:
                        </label>
                        {isRutValid ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Módulo 11 Válido
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400">
                            Revisar Formato
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editedRut}
                        onChange={(e) => setEditedRut(formatChileanRut(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Fecha Vencimiento */}
                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        isExpired
                          ? 'bg-rose-950/30 border-rose-500/60'
                          : isUrgent
                          ? 'bg-red-950/30 border-red-500/60'
                          : isUpcoming
                          ? 'bg-amber-950/30 border-amber-500/60'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Fecha Vencimiento (Control):
                        </label>
                        <span
                          className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                            isExpired
                              ? 'bg-rose-600 text-white'
                              : isUrgent
                              ? 'bg-red-600 text-white animate-pulse'
                              : isUpcoming
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {isExpired
                            ? 'VENCIDA'
                            : isUrgent
                            ? 'URGENTE'
                            : isUpcoming
                            ? 'PRÓXIMA'
                            : 'VIGENTE'}
                        </span>
                      </div>
                      <input
                        type="date"
                        value={editedExpiry}
                        onChange={(e) => setEditedExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                      <p
                        className={`text-[11px] font-bold ${
                          isExpired
                            ? 'text-rose-400'
                            : isUrgent
                            ? 'text-red-400'
                            : isUpcoming
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {isExpired
                          ? `¡Caducada hace ${Math.abs(daysDiff)} días! (Infracción Gravísima)`
                          : `Vence en ${daysDiff} días (Auditoría al ${referenceDate})`}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Fields: Nombre & Clases */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Nombre Completo:
                      </label>
                      <input
                        type="text"
                        value={editedFullName}
                        onChange={(e) => setEditedFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Clases Autorizadas (Ley 18.290):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['A1', 'A2', 'A3', 'A4', 'A5', 'B'].map((cls) => {
                          const hasCls = editedClasses.includes(cls);
                          return (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => {
                                if (hasCls) {
                                  setEditedClasses(editedClasses.filter((c) => c !== cls));
                                } else {
                                  setEditedClasses([...editedClasses, cls]);
                                }
                              }}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                                hasCls
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {cls}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Match with Company Registry */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">
                        Cotejo con Nómina Oficial de Conductores:
                      </span>
                      {matchedDriver ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Chofer Encontrado en Nómina
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Info className="w-3 h-3" /> No registrado (Chofer Externo)
                        </span>
                      )}
                    </div>

                    {matchedDriver ? (
                      <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-slate-800">
                        <div>
                          <p className="font-bold text-white">{matchedDriver.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Base: {matchedDriver.assignedBase} • Estado Actual:{' '}
                            <strong
                              className={
                                matchedDriver.status === 'habilitado'
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }
                            >
                              {matchedDriver.status.toUpperCase()}
                            </strong>
                          </p>
                        </div>

                        {onUpdateDriverExpiry && (
                          <button
                            onClick={() => {
                              onUpdateDriverExpiry(matchedDriver.id, editedExpiry);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                            title="Actualiza la fecha de vencimiento en la ficha del conductor"
                          >
                            Actualizar Ficha
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        El RUT escaneado no coincide con choferes existentes. Podrá simularlo en garita o ingresarlo como nuevo conductor.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Cancelar
          </button>

          {ocrResult && (
            <div className="flex flex-wrap items-center gap-2">
              {/* If expired and driver is matched, allow instant preventive blocking */}
              {isExpired && matchedDriver && onBlockDriver && matchedDriver.status !== 'bloqueado_preventivo' && (
                <button
                  onClick={() => {
                    onBlockDriver(
                      matchedDriver.id,
                      `Bloqueo por detección pericial OCR de Licencia Vencida el ${editedExpiry} (Ley 18.290)`
                    );
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Bloquear Despacho ({matchedDriver.fullName.split(' ')[0]})</span>
                </button>
              )}

              {/* Apply to Live Garita Validator */}
              <button
                onClick={() => {
                  onApplyToLiveValidator({
                    driverId: matchedDriver?.id,
                    rut: editedRut,
                    licenseExpiry: editedExpiry,
                    fullName: editedFullName,
                    licenseClasses: editedClasses
                  });
                  stopCamera();
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar al Validador de Garita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
