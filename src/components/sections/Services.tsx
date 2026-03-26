import { Home, Briefcase, Building2, Car, FileText, PiggyBank, Settings, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

const staticServices = [
  {
    icon: Home,
    title: 'Home Loan',
    hash: '#home-loans',
    description: 'Achieve your dream of owning a home with our flexible home loan options.',
    color: '#3b82f6'
  },
  {
    icon: FileText,
    title: 'Mortgage or Loan Against Property',
    hash: '#loan-property',
    description: 'Unlock the value of your property with our mortgage loan solutions.',
    color: '#ef4444'
  },
  {
    icon: Car,
    title: 'Auto or Vehicle Loan',
    hash: '#auto-loans',
    description: 'Drive your dream vehicle with our competitive auto loan offers.',
    color: '#f59e0b'
  },
  {
    icon: Briefcase,
    title: 'Business Loan',
    hash: '#business-loans',
    description: 'Fuel your business growth with our customized business loans.',
    color: '#8b5cf6'
  },
  {
    icon: PiggyBank,
    title: 'Personal Loan',
    hash: '#personal-loans',
    description: 'Get financial support for your personal needs with our easy personal loans.',
    color: '#ec4899'
  },
  {
    icon: Settings,
    title: 'Machinery Loan',
    hash: '#machinery-loans',
    description: 'Upgrade your machinery and boost productivity with our machinery loans.',
    color: '#6366f1'
  },
  {
    icon: Building2,
    title: 'Project Loan',
    hash: '#project-loans',
    description: 'Finance your projects with our comprehensive project loan services.',
    color: '#14b8a6'
  },
];

const Services = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const radius = 220;

  const handleApply = (hash: string) => {
    navigate(`/services${hash}`);
    window.scrollTo(0, 0);
  };

  return (
    <section ref={sectionRef} style={{
      padding: 'clamp(4rem, 10vw, 8rem) 0',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{
        maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2.5rem',
        position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: '100%',
        paddingTop: isMobile ? '2rem' : '0'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '1rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-1.5px'
          }}>
            Our Service <span className="text-gradient">Ecosystem</span>
          </h2>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.05rem', fontWeight: 500, maxWidth: '600px', margin: '1rem auto' }}>
            {isMobile ? 'Explore our range of specialized financial solutions tailored for your growth.' : 'A universe of financial growth revolving around your success.'}
          </p>
        </div>

        {!isMobile ? (
          /* DESKTOP: CIRCULAR ECOSYSTEM */
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(500px, 90vw, 750px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="circular-container">
            {/* ... (rest of desktop layout) */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              style={{
                zIndex: 10,
                background: '#1a3a6b',
                padding: '3rem 2.5rem',
                borderRadius: '50%',
                boxShadow: '0 25px 60px rgba(26, 58, 107, 0.4), inset 0 0 20px rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                textAlign: 'center'
              }}
            >
              <Logo height={45} hideText />
              <h3 style={{
                marginTop: '1.2rem',
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: 900,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: "'Outfit', sans-serif",
                whiteSpace: 'nowrap'
              }}>
                GrowUp <span style={{ color: '#00F5FF' }}>Fincorp</span>
              </h3>

              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    inset: `-${20 + i * 20}px`,
                    border: `1px ${i % 2 === 0 ? 'solid' : 'dashed'} rgba(0, 245, 255, ${0.15 - i * 0.04})`,
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }}
                >
                  <motion.div
                    style={{
                      width: '6px',
                      height: '6px',
                      background: '#00F5FF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '-3px'
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* ROTATING ORBITAL NODES */}
            <motion.div
              animate={isInView ? { rotate: 360 } : {}}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {staticServices.map((svc, idx) => {
                const Icon = svc.icon;
                const currentRadius = radius + 60;
                const angle = (idx / staticServices.length) * 2 * Math.PI - Math.PI / 2;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? {
                      opacity: 1,
                      scale: 1,
                      x: Math.cos(angle) * currentRadius,
                      y: Math.sin(angle) * currentRadius
                    } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      width: '180px',
                      textAlign: 'center',
                      zIndex: 5
                    }}
                    className="service-node"
                  >
                    <motion.div
                      animate={isInView ? { rotate: -360 } : {}}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleApply(svc.hash)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '68px',
                        height: '68px',
                        background: '#ffffff',
                        borderRadius: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: svc.color,
                        border: '1.2px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.4)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: `${svc.color}05` }} />
                        <Icon size={28} strokeWidth={1.5} style={{ position: 'relative', zIndex: 1 }} />
                      </div>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#334155',
                        fontFamily: "'Outfit', sans-serif",
                        letterSpacing: '-0.1px',
                        whiteSpace: 'nowrap'
                      }}>{svc.title}</h4>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          /* MOBILE: MARQUEE RECTANGULAR LOOP */
          <div style={{ width: '100%', overflow: 'hidden', padding: '1rem 0' }}>
            {/* First Row: Moving Left */}
            <div style={{ display: 'flex', marginBottom: '1rem', width: '200%' }}>
              <motion.div
                animate={{ x: [0, '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ display: 'flex', gap: '12px', paddingRight: '12px' }}
              >
                {[...staticServices, ...staticServices].map((svc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApply(svc.hash)}
                    style={{
                      minWidth: '200px',
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${svc.color}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: svc.color
                    }}>
                      <svc.icon size={20} />
                    </div>
                    <h4 style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.2
                    }}>
                      {svc.title}
                    </h4>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Second Row: Moving Right */}
            <div style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
              <motion.div
                animate={{ x: ['-50%', 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ display: 'flex', gap: '12px', width: '200%' }}
              >
                {[...staticServices, ...staticServices].reverse().map((svc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApply(svc.hash)}
                    style={{
                      minWidth: '200px',
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${svc.color}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: svc.color
                    }}>
                      <svc.icon size={20} />
                    </div>
                    <h4 style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.2
                    }}>
                      {svc.title}
                    </h4>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Branding Hub Header */}
            <div style={{
              marginTop: '2.5rem',
              textAlign: 'center',
              background: '#1a3a6b',
              padding: '1.5rem',
              borderRadius: '20px',
              margin: '0 1rem',
              boxShadow: '0 15px 35px rgba(26, 58, 107, 0.25)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Logo height={32} hideText />
              <h3 style={{
                marginTop: '1rem',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 900,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontFamily: "'Outfit', sans-serif"
              }}>
                GrowUp <span style={{ color: '#00F5FF' }}>Fincorp</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                Your trusted ecosystem for financial growth.
              </p>
            </div>
          </div>
        )}

        {/* Global Styles for Desktop Only Hover Effects */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 769px) {
                .service-node:hover .svc-icon-hub {
                    transform: scale(1.1);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.1);
                    border-color: rgba(0,0,0,0.1);
                }
            }
            .text-gradient {
                background: linear-gradient(135deg, #3b82f6 0%, #2ec4b6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `}} />

        {/* Action Button */}
        <div style={{ marginTop: isMobile ? '1rem' : '2rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { navigate('/services'); window.scrollTo(0, 0); }}
            style={{
              padding: '0.8rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              borderRadius: '100px',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
            }}
          >
            Detailed Services
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Services;
