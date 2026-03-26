import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

/* ─── Creative Loading Animations ────────────────────────────────── */

// Pulse Dots Animation
export const PulseDotsLoader = () => (
  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--primary-color)',
        }}
      />
    ))}
  </div>
);

// Wave Loader
export const WaveLoader = () => (
  <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', height: '24px' }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        animate={{
          height: ['8px', '24px', '8px'],
          backgroundColor: ['#2ec4b6', '#ff9f1c', '#2ec4b6'],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.1,
          ease: 'easeInOut',
        }}
        style={{
          width: '3px',
          borderRadius: '2px',
          background: 'var(--primary-color)',
        }}
      />
    ))}
  </div>
);

// Rotating Ring Loader
export const RotatingRingLoader = () => (
  <div style={{ position: 'relative', width: '40px', height: '40px' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTop: '3px solid var(--primary-color)',
        borderRight: '3px solid var(--secondary-color)',
      }}
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderBottom: '2px solid var(--accent-gold)',
        borderLeft: '2px solid var(--accent-emerald)',
      }}
    />
  </div>
);

// Morphing Shape Loader
export const MorphingLoader = () => (
  <motion.div
    animate={{
      borderRadius: ['20%', '50%', '20%', '50%'],
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    style={{
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    }}
  />
);

// Financial Themed Loader (Premium Center-Aligned)
export const FinancialLoader = () => (
  <div style={{
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '3px solid rgba(46, 196, 182, 0.1)',
        borderTop: '3px solid #2ec4b6',
        borderRight: '3px solid rgba(46, 196, 182, 0.4)',
      }}
    />
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}
    >
      <TrendingUp size={28} color="#2ec4b6" strokeWidth={2.5} />
    </motion.div>
  </div>
);

// Branded Loader with Company Logo - Liquid Fill Creativity
export const BrandedLoader = () => {
  return (
    <div style={{ position: 'relative', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>

      {/* 1. Custom Liquid Fill SVG Logo */}
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <defs>
            <clipPath id="logo-mask">
              {/* Roof */}
              <path d="M10 42L50 18L90 42" />
              {/* Horizontal Bars */}
              <rect x="15" y="44" width="70" height="6" rx="3" />
              <rect x="15" y="80" width="70" height="6" rx="3" />
              {/* Columns */}
              <rect x="22" y="54" width="8" height="22" rx="4" />
              <rect x="38" y="54" width="8" height="22" rx="4" />
              <rect x="54" y="54" width="8" height="22" rx="4" />
              <rect x="70" y="54" width="8" height="22" rx="4" />
            </clipPath>
            <linearGradient id="liquid-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ec4b6" />
              <stop offset="100%" stopColor="#1a3a6b" />
            </linearGradient>
          </defs>

          {/* Base Layer (Unfilled Outline) */}
          <g style={{ opacity: 0.1, fill: '#1a3a6b' }}>
            <path d="M10 42L50 18L90 42" />
            <rect x="15" y="44" width="70" height="6" rx="3" />
            <rect x="15" y="80" width="70" height="6" rx="3" />
            <rect x="22" y="54" width="8" height="22" rx="4" />
            <rect x="38" y="54" width="8" height="22" rx="4" />
            <rect x="54" y="54" width="8" height="22" rx="4" />
            <rect x="70" y="54" width="8" height="22" rx="4" />
          </g>

          {/* Liquid Fill Layer */}
          <g clipPath="url(#logo-mask)">
            <motion.rect
              initial={{ y: 100 }}
              animate={{ y: [100, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              width="100"
              height="100"
              fill="url(#liquid-gradient)"
            />
          </g>
        </svg>

        {/* Very Subtle External Pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-10px',
            border: '2px solid #2ec4b6',
            borderRadius: '50%',
            zIndex: -1
          }}
        />
      </div>

      {/* 2. Professional Constant Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.4rem', color: '#1a3a6b', letterSpacing: '-0.5px' }}>GROWUP</span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: '1.4rem', color: '#2ec4b6' }}>FINCORP</span>
        </div>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            marginTop: '0.6rem',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#64748b',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Building Growth...
        </motion.div>
      </motion.div>
    </div>
  );
};

// Sparkle Loader
export const SparkleLoader = () => (
  <div style={{ position: 'relative', width: '50px', height: '50px' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Sparkles size={30} color="var(--secondary-color)" />
    </motion.div>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.6,
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'var(--primary-color)',
          transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-20px)`,
        }}
      />
    ))}
  </div>
);

// Gradient Pulse Loader
export const GradientPulseLoader = () => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    style={{
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: 'var(--primary-color)',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
    }}
  />
);

// Main Loading Component with different types
interface LoadingAnimationProps {
  type?: 'dots' | 'wave' | 'ring' | 'morph' | 'financial' | 'sparkle' | 'gradient' | 'branded';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingAnimation = ({
  type = 'financial',
  size = 'medium',
  text = 'Loading...',
  fullScreen = false
}: LoadingAnimationProps) => {
  const sizeMap = {
    small: { scale: 0.7, fontSize: '0.85rem' },
    medium: { scale: 1, fontSize: '1rem' },
    large: { scale: 1.5, fontSize: '1.2rem' },
  };

  const currentSize = sizeMap[size];

  const renderLoader = () => {
    switch (type) {
      case 'wave': return <WaveLoader />;
      case 'ring': return <RotatingRingLoader />;
      case 'morph': return <MorphingLoader />;
      case 'financial': return <FinancialLoader />;
      case 'sparkle': return <SparkleLoader />;
      case 'gradient': return <GradientPulseLoader />;
      case 'branded': return <BrandedLoader />;
      default: return <PulseDotsLoader />;
    }
  };

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        transform: `scale(${currentSize.scale})`,
      }}
    >
      {renderLoader()}
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: currentSize.fontSize,
            color: 'var(--text-secondary)',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            margin: 0,
          }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default LoadingAnimation;
