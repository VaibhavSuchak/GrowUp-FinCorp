import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { Target, Award, Users, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevealText from '../ui/animations/RevealText';
import ScrollReveal from '../ui/animations/ScrollReveal';

const STATS = [
    { value: '250+', label: 'Happy Clients', icon: Users },
    { value: '10+', label: 'Banking Partners', icon: Award },
    { value: '82%', label: 'Approval Rate', icon: Target },
    { value: '₹35Cr+', label: 'Loan Distributed', icon: TrendingUp },
];

const DEFAULT_CHECKLIST = [
    'Best Home Loan Service in Rajkot',
    'Finance Services in Rajkot & Gujarat',
    'Rajkot MSME & Business Loans Experts',
    'Mortgage & Loan Against Property',
    'Auto or Vehicle Loan',
    'Quick Approvals, Transparent Process',
];

export default function AboutOverview() {
    const navigate = useNavigate();
    const [content, setContent] = useState({
        title: "Rajkot's Most Trusted",
        titleHighlight: 'Loan Services Partner',
        description: "GrowUp FinCorp is Rajkot's leading financial advisory and loan distribution company. Since 2023, we have helped 250+ families and businesses across Rajkot, Saurashtra, and Gujarat access the best home loans, business loans, mortgage loans, and personal finance solutions — with complete transparency and doorstep service.",
        mission: "Our mission is to make quality financial services accessible to every person and business in Rajkot. We compare across 10+ banks to ensure you always get the lowest rate and the most suitable loan product.",
        goal: "To be Rajkot's first-choice financial partner — trusted for our expertise, transparency, and commitment to client success.",
        checklist: DEFAULT_CHECKLIST.join(', '),
    });
    const [checkItems, setCheckItems] = useState(DEFAULT_CHECKLIST);

    const { data: aboutData } = useSupabaseQuery('about', async () =>
        await supabase.from('site_content').select('*').eq('section_key', 'about').single()
    );

    useEffect(() => {
        if (aboutData) {
            try {
                const parsed = JSON.parse((aboutData as any).content);
                setContent(prev => ({ ...prev, ...parsed }));
                if (parsed.checklist) {
                    setCheckItems(parsed.checklist.split(',').map((s: string) => s.trim()).filter(Boolean));
                }
            } catch { }
        }
    }, [aboutData]);

    return (
        <section style={{ padding: '8rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle background grid */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'radial-gradient(circle, #1a3a6b 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    {/* Left — Visual Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Main image card */}
                        <div style={{
                            borderRadius: '32px', overflow: 'hidden',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
                            aspectRatio: '4/5', position: 'relative'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000"
                                alt="GrowUp FinCorp – Best Loan Service Rajkot"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,30,80,0.7) 0%, transparent 60%)' }} />
                            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', color: '#fff' }}>
                                <div style={{ fontSize: '0.75rem', color: '#2ec4b6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem' }}>Rajkot, Gujarat</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Finance Services in Rajkot</div>
                            </div>
                        </div>

                        {/* Floating stat card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            style={{
                                position: 'absolute', top: '2rem', right: '-2rem',
                                background: '#0f172a', borderRadius: '20px',
                                padding: '1.4rem 1.8rem',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                                color: '#fff', textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2ec4b6', lineHeight: 1 }}>250+</div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Clients</div>
                        </motion.div>

                        {/* Floating approval card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            style={{
                                position: 'absolute', bottom: '10rem', left: '-2rem',
                                background: '#fff', borderRadius: '20px',
                                padding: '1.2rem 1.6rem',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                border: '1px solid #f1f5f9'
                            }}
                        >
                            <div style={{ width: 46, height: 46, borderRadius: '14px', background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Award size={24} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>10+</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Banking Partners</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right — Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', border: '1px solid #dbeafe' }}>
                            About GrowUp FinCorp
                        </span>

                        <RevealText
                            text={content.title}
                            type="words"
                            style={{
                                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                                fontWeight: 900,
                                color: '#0f172a',
                                lineHeight: 1.05,
                                marginBottom: '0.4rem',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '-2px'
                            }}
                        />
                        <RevealText
                            text={content.titleHighlight}
                            type="words"
                            delay={0.2}
                            style={{
                                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                                fontWeight: 900,
                                color: '#1d4ed8',
                                lineHeight: 1.05,
                                marginBottom: '1.8rem',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '-2px'
                            }}
                        />

                        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.85, marginBottom: '2rem' }}>
                            {content.description}
                        </p>

                        {/* Checklist */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(max(200px, 45%), 1fr))',
                            gap: '0.7rem 1.5rem',
                            marginBottom: '2.5rem'
                        }}>
                            {checkItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                                    <CheckCircle2 size={17} color="#2563eb" style={{ flexShrink: 0 }} />
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 15px 35px rgba(29,78,216,0.3)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate('/contact')}
                            style={{
                                background: 'linear-gradient(135deg, #1a3a6b, #1d4ed8)',
                                color: '#fff', border: 'none',
                                padding: '1rem 2.5rem', borderRadius: '50px',
                                fontSize: '1rem', fontWeight: 800,
                                cursor: 'pointer', display: 'inline-flex',
                                alignItems: 'center', gap: '0.8rem'
                            }}
                        >
                            Get Free Consultation <ArrowRight size={20} />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Stats Strip */}
                <ScrollReveal
                    stagger={0.2}
                    direction="up"
                    className="stats-strip"
                    style={{
                        marginTop: '6rem',
                        display: 'grid',
                        gap: '1px',
                        background: '#e2e8f0',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                    }}
                >
                    {STATS.map((stat, i) => (
                        <div key={i} style={{ background: '#fff', padding: '2.5rem 2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#1d4ed8', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginTop: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    ))}
                </ScrollReveal>
            </div>

            <style>{`
                .stats-strip { grid-template-columns: repeat(4, 1fr); }
                @media (max-width: 1024px) {
                    .stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 500px) {
                    .stats-strip { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
