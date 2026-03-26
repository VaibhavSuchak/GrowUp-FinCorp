import { motion } from 'framer-motion';
import { Globe, Rocket, CheckCircle, Target, Shield, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PageHero from '../components/layout/PageHero';
import AboutOverview from '../components/sections/AboutOverview';

const About = () => {
    const [content, setContent] = useState<any>({
        headerTitle: 'The GrowUp Evolution',
        headerSubtitle: 'Redefining the lending ecosystem with technology, transparency, and a commitment to your financial growth.',
        profileTitle: 'Our Journey',
        profileDesc: 'Founded with a vision to simplify loans for every Indian.',
        y1: '2023', t1: 'The Beginning', d1: 'GrowUp FinCorp was established to bring absolute transparency to the loan sector in Rajkot.',
        y2: '2026', t2: 'Digital Scale-Up', d2: 'Expanding our digital infrastructure to reach more families across Gujarat with faster processing.',
        y3: '2030', t3: 'The Vision', d3: 'Aiming to be the most trusted and secure choice for end-to-end financial solutions in Saurashtra and beyond.'
    });

    const [whyUs, setWhyUs] = useState([
        { title: 'Expert Guidance', desc: 'Our team of financial experts provides personalized advice to help you choose the right loan.' },
        { title: 'Fast Processing', desc: 'We prioritize speed and efficiency to get your loan approved and disbursed quickly.' },
        { title: 'Transparent Process', desc: 'No hidden charges or complex terms. We keep you informed at every step.' },
        { title: 'Strategic Partnerships', desc: 'Collaborating with 10+ premier banking institutions and NBFCs to provide you with competitive rates and flexible loan structures.' }
    ]);

    const [, setSettings] = useState({
        phone: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        async function fetchAboutPage() {
            try {
                const { data: aboutData } = await supabase.from('site_content').select('*').eq('section_key', 'about_page').single();
                if (aboutData) setContent((prev: any) => ({ ...prev, ...JSON.parse(aboutData.content) }));

                const { data: evolData } = await supabase.from('site_content').select('*').eq('section_key', 'evolution').single();
                if (evolData) setContent((prev: any) => ({ ...prev, ...JSON.parse(evolData.content) }));

                const { data: whyData } = await supabase.from('site_content').select('*').eq('section_key', 'why_choose_us').single();
                if (whyData) {
                    const parsed = JSON.parse(whyData.content);
                    if (parsed.title1) {
                        setWhyUs([
                            { title: parsed.title1, desc: parsed.desc1 },
                            { title: parsed.title2, desc: parsed.desc2 },
                            { title: parsed.title3, desc: parsed.desc3 },
                            { title: parsed.title4, desc: parsed.desc4 }
                        ]);
                    }
                }

                const { data: settingsData, error: settingsError } = await supabase.from('site_settings').select('*');
                if (!settingsError && settingsData) {
                    let loaded: any = {};
                    settingsData.forEach((row: any) => {
                        loaded[row.key] = row.value;
                    });
                    setSettings(prev => ({ ...prev, ...loaded }));
                }
            } catch (err) {
                console.log("Using fallbacks for About page.");
            }
        }
        fetchAboutPage();
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="about-page" style={{ paddingTop: '0', minHeight: '100vh', background: '#f8fafc', overflow: 'hidden' }}>

            <PageHero
                title={content.headerTitle || 'Our Journey'}
                subtitle={content.headerSubtitle || 'Redefining the lending ecosystem with technology and trust.'}
                badge="Our Story"
                bgImage="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070"
            />

            <AboutOverview />

            <div className="container" style={{ margin: '0 auto', maxWidth: '1280px', padding: 'clamp(3rem, 5vw, 6rem) clamp(1rem, 4vw, 2rem)', position: 'relative', zIndex: 10 }}>

                {/* --- 1. Our Journey Timeline --- */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    style={{
                        background: '#ffffff',
                        borderRadius: 'clamp(20px, 4vw, 40px)',
                        padding: 'clamp(2rem, 5vw, 5rem)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)',
                        marginBottom: 'clamp(4rem, 8vw, 8rem)',
                        border: '1px solid #f1f5f9'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: '#eff6ff', color: '#2563eb', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            Our Evolution
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 900,
                            color: '#0f172a',
                            lineHeight: 1.2,
                            fontFamily: "'Outfit', sans-serif"
                        }}>
                            {content.profileTitle || 'From Inception to Gujarat\'s No.1'}
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        position: 'relative'
                    }}>
                        {/* Connecting Line (desktop only) */}
                        <div className="timeline-line" style={{
                            position: 'absolute',
                            top: '40px', left: '10%', right: '10%',
                            height: '2px', background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
                            zIndex: 0,
                            opacity: 0.3
                        }} />

                        {[
                            { year: content.y1, title: content.t1, desc: content.d1, icon: Globe, color: '#3b82f6', bg: '#eff6ff' },
                            { year: content.y2, title: content.t2, desc: content.d2, icon: Rocket, color: '#8b5cf6', bg: '#f5f3ff' },
                            { year: content.y3, title: content.t3, desc: content.d3, icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div key={idx} variants={fadeUp} style={{ position: 'relative', zIndex: 1, background: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: item.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '4px solid #ffffff', boxShadow: `0 0 0 2px ${item.color}` }}>
                                        <Icon size={32} color={item.color} />
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: item.color, fontFamily: "'Outfit', sans-serif", marginBottom: '0.5rem', lineHeight: 1 }}>{item.year || '----'}</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{item.title || 'Milestone'}</h3>
                                    <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc || 'Coming soon...'}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* --- 2. Mission & Values Cards --- */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: 'clamp(4rem, 8vw, 8rem)'
                    }}
                >
                    {/* Mission Card */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderRadius: '35px',
                            padding: '3.5rem',
                            color: '#fff',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
                        <Target size={48} color="#3b82f6" style={{ marginBottom: '2rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Our Mission</h2>
                        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem' }}>To empower Rajkot's families and businesses with transparent, technology-driven, and doorstep-delivered financial solutions, bridging the gap between aspirations and reality through personalized expert guidance and 10+ strategic banking partnerships.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#3b82f6', fontWeight: 700 }}>
                            <div style={{ width: '40px', height: '2px', background: '#3b82f6' }} />
                            Empowering Dreams
                        </div>
                    </motion.div>

                    {/* Values Card */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            background: '#fff',
                            borderRadius: '35px',
                            padding: '3.5rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                        }}
                    >
                        <Shield size={48} color="#2563eb" style={{ marginBottom: '2rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Our Values</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { title: 'Unwavering Integrity', desc: 'Providing honest, transparent advice with zero hidden costs in every transaction.' },
                                { title: 'Client-Centric Focus', desc: 'Your financial growth is our only priority, delivered through personalized doorstep service.' },
                                { title: 'Local Trust, Digital Speed', desc: 'Blending Rajkot\'s traditional trust with the efficiency of modern digital loan processing.' }
                            ].map((v, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ marginTop: '0.3rem', width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{v.title}</h4>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* --- 3. Why Choose Us (Grid) --- */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#0f172a', fontFamily: "'Outfit', sans-serif", letterSpacing: '-1px' }}>
                        Why Choose <span style={{ color: '#2ec4b6' }}>GrowUp?</span>
                    </h2>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}
                >
                    {whyUs.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ y: -10 }}
                            style={{
                                background: '#fff',
                                padding: '2.5rem',
                                borderRadius: '30px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ width: '60px', height: '60px', background: '#f0fdfa', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#2ec4b6' }}>
                                {idx === 0 && <Shield size={28} />}
                                {idx === 1 && <Rocket size={28} />}
                                {idx === 2 && <Globe size={28} />}
                                {idx === 3 && <Heart size={28} />}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{item.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>

            <style>{`
                .timeline-line { display: block; }
                @media (max-width: 992px) {
                    .timeline-line { display: none; }
                }
            `}</style>
        </div>
    );
};

export default About;
