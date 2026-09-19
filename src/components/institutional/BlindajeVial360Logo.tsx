import React from 'react';

interface BlindajeVial360LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  variant?: 'dark' | 'light';
  animated?: boolean;
}

/**
 * Logotipo Oficial Vectorial BLINDAJE VIAL 360°
 * Basado en la identidad corporativa oficial:
 * - Escudo cromado biselado de seguridad vial
 * - Autopista peraltada azul y amarilla con giro orbital 360°
 * - Trazas de circuitos tecnológicos y microchips de trazabilidad
 * - Tipografía "BLINDAJE VIAL" y "360°" con arco dorado
 */
export const BlindajeVial360Logo: React.FC<BlindajeVial360LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'dark',
  animated = false
}) => {
  const isLight = variant === 'light';

  const sizeStyles = {
    sm: {
      box: 'w-9 h-9',
      title: 'text-sm font-black',
      subtitle: 'text-[9px]',
      badge: 'text-[8px] px-1 py-0.2'
    },
    md: {
      box: 'w-12 h-12',
      title: 'text-base font-black',
      subtitle: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.5'
    },
    lg: {
      box: 'w-16 h-16',
      title: 'text-xl font-black',
      subtitle: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5'
    },
    xl: {
      box: 'w-24 h-24',
      title: 'text-2xl sm:text-3xl font-black',
      subtitle: 'text-xs sm:text-sm',
      badge: 'text-xs px-2.5 py-1'
    },
    '2xl': {
      box: 'w-36 h-36',
      title: 'text-4xl font-black',
      subtitle: 'text-base',
      badge: 'text-sm px-3 py-1'
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Emblem: Shield + 360° Road + Tech Circuits */}
      <div
        className={`relative ${currentSize.box} shrink-0 transition-transform duration-300 ${
          animated ? 'hover:scale-105' : ''
        }`}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            {/* Chrome Bezel Gradient */}
            <linearGradient id="bvChromeBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="18%" stopColor="#CBD5E1" />
              <stop offset="45%" stopColor="#64748B" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="88%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Inner Shield Deep Blue */}
            <linearGradient id="bvInnerBlue" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0B2046" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Road Asphalt Gradient */}
            <linearGradient id="bvRoadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F2856" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Road Yellow Border */}
            <linearGradient id="bvRoadGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="bvCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND 360° OUTER ROAD LOOP (Back of shield) */}
          <path
            d="M45 125 C20 120 18 80 40 55 C65 28 140 18 165 42 C185 62 185 105 155 125"
            stroke="url(#bvRoadGold)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M46 123 C22 118 20 82 41 57 C65 30 138 20 163 44 C182 63 182 103 154 123"
            stroke="url(#bvRoadGradient)"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          {/* Dashed Road Lanes on Outer Loop */}
          <path
            d="M46 123 C22 118 20 82 41 57 C65 30 138 20 163 44 C182 63 182 103 154 123"
            stroke="#FEF08A"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* OUTER SHIELD CHROME BEZEL */}
          <path
            d="M100 20 L162 48 C162 115 130 158 100 178 C70 158 38 115 38 48 Z"
            fill="url(#bvChromeBezel)"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
          />

          {/* INNER SHIELD BEZEL (Dark Trim) */}
          <path
            d="M100 28 L154 52 C154 110 126 148 100 166 C74 148 46 110 46 52 Z"
            fill="#0F172A"
          />

          {/* SHIELD CORE (Sapphire Blue) */}
          <path
            d="M100 32 L150 55 C150 107 123 143 100 160 C77 143 50 107 50 55 Z"
            fill="url(#bvInnerBlue)"
          />

          {/* TECH CIRCUIT TRACES & NODES */}
          <g opacity="0.65">
            {/* Left Circuit */}
            <path
              d="M58 75 L72 75 L80 62 L92 62"
              stroke="#38BDF8"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="94" cy="62" r="2.2" fill="#38BDF8" />
            <circle cx="58" cy="75" r="2" fill="#38BDF8" />

            <path
              d="M62 98 L75 98 L84 108"
              stroke="#38BDF8"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="84" cy="108" r="2" fill="#38BDF8" />

            {/* Right Circuit */}
            <path
              d="M142 75 L128 75 L120 62 L108 62"
              stroke="#38BDF8"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="106" cy="62" r="2.2" fill="#38BDF8" />
            <circle cx="142" cy="75" r="2" fill="#38BDF8" />

            {/* Microchip Hexagon Nodes */}
            <polygon
              points="132,95 137,92 142,95 142,101 137,104 132,101"
              stroke="#38BDF8"
              strokeWidth="1.2"
              fill="none"
            />
            <polygon
              points="60,118 65,115 70,118 70,124 65,127 60,124"
              stroke="#38BDF8"
              strokeWidth="1.2"
              fill="none"
            />
          </g>

          {/* FOREGROUND HIGHWAY (Crossing Through the Shield) */}
          <g>
            {/* Roadbed */}
            <path
              d="M100 48 C100 48 112 85 138 108 C158 126 172 128 178 120 C186 108 178 86 160 70 L148 60 C128 45 106 46 100 48 Z"
              fill="url(#bvRoadGradient)"
            />

            {/* Main Road Highway Track into Horizon */}
            <path
              d="M80 152 C82 118 92 85 99 50 C101 50 103 50 104 50 C108 85 118 118 120 152 Z"
              fill="#0F244C"
            />

            {/* Highway Asphalt Curves */}
            <path
              d="M68 145 C78 115 92 78 100 50 C108 78 122 115 132 145 C118 138 82 138 68 145 Z"
              fill="url(#bvRoadGradient)"
            />

            {/* Road Yellow Shoulder Stripes */}
            <path
              d="M68 145 C78 115 92 78 100 50"
              stroke="url(#bvRoadGold)"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M132 145 C122 115 108 78 100 50"
              stroke="url(#bvRoadGold)"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Dashed Center Road Markings */}
            <path
              d="M100 138 L100 126 M100 114 L100 102 M100 92 L100 82 M100 74 L100 66 M100 60 L100 54"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Horizon Radiant Glow */}
            <circle
              cx="100"
              cy="50"
              r="4.5"
              fill="#38BDF8"
              filter="url(#bvCyanGlow)"
            />
          </g>

          {/* FRONT 360° HIGHWAY SWOOP (Wrapping out from bottom right to center) */}
          <path
            d="M152 116 C140 135 115 146 88 145 C64 144 48 132 40 118 C35 110 38 100 46 98 C54 96 60 105 68 114 C78 124 94 128 112 126 C128 124 142 115 152 104"
            stroke="url(#bvRoadGold)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Typography: BLINDAJE VIAL + 360° */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-black tracking-tight">
            <span
              className={`${currentSize.title} ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.04em' }}
            >
              BLINDAJE VIAL
            </span>
            {/* 360 with signature golden crescent arch */}
            <div className="inline-flex items-center">
              <span
                className={`${currentSize.title} ${
                  isLight ? 'text-blue-700' : 'text-blue-400'
                } font-mono font-extrabold`}
              >
                36
              </span>
              <div className="relative inline-flex items-center justify-center">
                <span
                  className={`${currentSize.title} ${
                    isLight ? 'text-blue-700' : 'text-blue-400'
                  } font-mono font-extrabold`}
                >
                  0
                </span>
                {/* Golden yellow crescent inside the '0' */}
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-1.5 h-2.5 rounded-r-full border-r-2 border-amber-400 transform -rotate-12" />
                </span>
              </div>
              <span
                className={`${
                  size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'
                } font-bold text-amber-400 -mt-2 ml-0.5`}
              >
                °
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`${currentSize.subtitle} font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              } font-mono`}
            >
              Seguridad Vial & Compliance ISO 37301
            </span>
            <span className={`${currentSize.badge} font-bold rounded-sm bg-blue-600/20 text-blue-400 border border-blue-500/30 hidden sm:inline-block`}>
              SUSESO 92.064
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
