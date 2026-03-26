import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, CheckCircle2, ChevronRight, Users, Clock, Award, ShieldCheck,
    FileText, Banknote, ListChecks, HelpCircle, MapPin, Star, Sparkles, Building2,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import RevealText from '../components/ui/animations/RevealText';
import ScrollReveal from '../components/ui/animations/ScrollReveal';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'process', label: 'Process', icon: ListChecks },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

const WHY_US = [
    { icon: ShieldCheck, t: '10+ Banking Partners', d: 'Compare across 10+ banks and NBFCs.' },
    { icon: Clock, t: 'Fast Approvals', d: 'Doorstep collection, quick turnaround.' },
    { icon: Users, t: 'Doorstep Service', d: 'We come to you — home or office.' },
    { icon: Award, t: 'Zero Hidden Charges', d: 'Full transparency — no surprises.' },
];

export default function ServicesPage() {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState(SERVICES_DATA[0].id);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const svc = SERVICES_DATA.find(s => s.id === activeId) || SERVICES_DATA[0];
    const Icon = svc.icon;

    useEffect(() => {
        document.title = 'Loan Services in Rajkot | GrowUp FinCorp';
        window.scrollTo(0, 0);
        const hash = window.location.hash.slice(1);
        if (hash && SERVICES_DATA.find(s => s.anchor === hash)) setActiveId(hash);

        const handleScroll = () => {
            if (navRef.current) {
                setIsSticky(window.scrollY > 400);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const switchService = (id: string) => {
        setActiveId(id);
        setActiveTab('overview');
        if (contentRef.current && !isSticky) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleApply = () => {
        navigate('/contact', { state: { loanType: svc.title } });
        window.scrollTo(0, 0);
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

            {/* ── IMMERSIVE HERO ── */}
            <section style={{
                padding: 'clamp(8rem, 15vw, 12rem) 0 clamp(4rem, 8vw, 6rem)',
                background: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(26,58,107,0.88) 100%), url(${svc.image}) center/cover no-repeat`,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.8s ease-in-out'
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(46,196,182,0.1)', padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(46,196,182,0.2)', marginBottom: '2rem' }}>
                            <Sparkles size={14} color="#2ec4b6" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2ec4b6', textTransform: 'uppercase', letterSpacing: '2px' }}>Finance Solutions in Rajkot</span>
                        </div>

                        <RevealText
                            text={svc.headline}
                            type="words"
                            style={{
                                fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                letterSpacing: '-2px',
                                fontFamily: "'Outfit', sans-serif",
                                marginBottom: '1.5rem',
                                color: '#fff',
                                justifyContent: 'center'
                            }}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 3rem' }}
                        >
                            {svc.subheadline}
                        </motion.p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {svc.stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    style={{ textAlign: 'center', minWidth: '140px', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2ec4b6', marginBottom: '0.2rem' }}>{stat.val}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STICKY SERVICE SELECTOR ── */}
            <nav
                ref={navRef}
                style={{
                    position: isSticky ? 'fixed' : 'relative',
                    top: isSticky ? '70px' : '-2.5rem',
                    left: 0,
                    width: '100%',
                    zIndex: 100,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: isSticky ? '0.8rem 0' : '0',
                    background: isSticky ? 'rgba(255,255,255,0.9)' : 'transparent',
                    backdropFilter: isSticky ? 'blur(15px)' : 'none',
                    boxShadow: isSticky ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
                    borderBottom: isSticky ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}
            >
                <div className="container" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: isSticky ? '0' : '1rem', scrollbarWidth: 'none' }}>
                    {SERVICES_DATA.map(s => {
                        const active = s.id === activeId;
                        return (
                            <button
                                key={s.id}
                                onClick={() => switchService(s.id)}
                                style={{
                                    flex: '0 0 auto',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '16px',
                                    border: active ? `2px solid ${s.accent}` : '1px solid rgba(0,0,0,0.08)',
                                    background: active ? s.accent : '#fff',
                                    color: active ? '#fff' : '#475569',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.7rem',
                                    boxShadow: active ? `0 10px 20px ${s.accent}30` : '0 4px 15px rgba(0,0,0,0.03)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <s.icon size={18} />
                                {s.title}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* ── MAIN CONTENT ── */}
            <div className="container" ref={contentRef} style={{ marginTop: isSticky ? '4rem' : '1rem', paddingBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>

                    {/* Content Column */}
                    <main>
                        {/* Internal Tab Bar */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', background: '#fff', padding: '0.5rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {TABS.map(tab => {
                                const active = tab.id === activeTab;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            flex: '1 1 auto',
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: '14px',
                                            border: 'none',
                                            background: active ? '#f1f5f9' : 'transparent',
                                            color: active ? svc.accent : '#64748b',
                                            fontWeight: active ? 800 : 600,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.6rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                        {active && <motion.div layoutId="tab-pill" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: svc.accent }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Animated Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeId + activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {/* ── OVERVIEW ── */}
                                {activeTab === 'overview' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <section className="premium-card" style={{ padding: '3rem' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                                <div style={{ width: 50, height: 50, background: `${svc.accent}15`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Star size={24} color={svc.accent} />
                                                </div>
                                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>About {svc.title}</h2>
                                            </div>
                                            <p style={{ color: '#475569', lineHeight: 1.9, fontSize: '1.05rem', margin: 0 }}>{svc.desc}</p>
                                        </section>

                                        <ScrollReveal stagger={0.1} direction="up" className="grid-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                                            {svc.features.map((f, i) => (
                                                <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'all 0.3s' }}>
                                                    <div style={{ width: 34, height: 34, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CheckCircle2 size={18} color="#16a34a" />
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{f}</span>
                                                </div>
                                            ))}
                                        </ScrollReveal>
                                    </div>
                                )}

                                {/* ── PROCESS ── */}
                                {activeTab === 'process' && (
                                    <section className="premium-card" style={{ padding: '3rem' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '3rem' }}>Application Journey</h2>
                                        <div style={{ position: 'relative' }}>
                                            {/* Process Line */}
                                            <div style={{ position: 'absolute', top: '10px', left: '25px', bottom: '10px', width: '2px', background: `linear-gradient(to bottom, ${svc.accent} 0%, transparent 100%)`, opacity: 0.3 }} />

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                                {svc.process.map((step, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '2.5rem', position: 'relative', zIndex: 2 }}>
                                                        <div style={{ width: 52, height: 52, background: '#fff', border: `3px solid ${svc.accent}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: svc.accent, fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                                            {step.step}
                                                        </div>
                                                        <div style={{ marginTop: '0.4rem' }}>
                                                            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>{step.title}</h4>
                                                            <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* ── FAQs ── */}
                                {activeTab === 'faqs' && (
                                    <ScrollReveal stagger={0.1} direction="up" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        {svc.faqs.map((faq, i) => (
                                            <div key={i} style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', transition: 'all 0.3s' }}>
                                                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                                    <span style={{ color: svc.accent }}>Q.</span> {faq.q}
                                                </div>
                                                <div style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.8, paddingLeft: '2.4rem' }}>{faq.a}</div>
                                            </div>
                                        ))}
                                    </ScrollReveal>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    {/* Sidebar Column */}
                    <aside style={{ position: 'sticky', top: '150px', height: 'fit-content' }}>
                        {/* WHY APPLY CARD */}
                        <div style={{ background: '#0f172a', borderRadius: '32px', padding: '2.5rem', color: '#fff', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                            <Building2 size={120} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', bottom: '-20px', right: '-20px' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem' }}>The Fincorp Advantage</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', position: 'relative', zIndex: 1 }}>
                                {WHY_US.map((w, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <w.icon size={18} color="#2ec4b6" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{w.t}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>{w.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FINAL CTA CARD */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{ background: `linear-gradient(135deg, ${svc.accent} 0%, ${svc.accent}dd 100%)`, borderRadius: '32px', padding: '2.5rem', textAlign: 'center', color: '#fff', cursor: 'pointer' }}
                            onClick={handleApply}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Get Started</h3>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Experience the fastest loan processing in Rajkot.</p>
                            <button style={{ width: '100%', background: '#fff', color: svc.accent, border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
                                Apply for {svc.title} <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    </aside>

                </div>
            </div>

            <style>{`
                .grid-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.2rem; }
                @media (max-width: 1024px) { 
                    main { grid-column: 1 / -1; }
                    aside { display: none; }
                }
                .container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
            `}</style>
        </div>
    );
}
