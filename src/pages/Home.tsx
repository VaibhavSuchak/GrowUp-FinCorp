import { ShieldCheck, Zap, UserCheck, Landmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import EMICalculator from '../components/sections/EMICalculator';
import Services from '../components/sections/Services';
import LoanProcess from '../components/sections/LoanProcess';
import Testimonials from '../components/sections/Testimonials';
import HeroSlider from '../components/sections/HeroSlider';
import AboutOverview from '../components/sections/AboutOverview';

const Home = () => {
    const [content, setContent] = useState({
        heroTitle: 'Plan Your Repayment',
        heroSubtitle: 'Use our easy EMI calculator to understand your monthly commitments. Adjust the loan amount, interest rate, and tenure to find an EMI that perfectly fits your budget before you apply.',
        featuresTitle: 'Why Choose GrowUp?',
        featuresSubtitle: 'Experience seamless borrowing with our expert guidance.',
        ctaText: 'Get Free Consultation'
    });

    const [features, setFeatures] = useState([
        { title: 'Expert Guidance', desc: 'Our team of financial experts provides personalized advice to help you choose the right loan.', icon: UserCheck, color: '#2563eb' },
        { title: 'Fast Processing', desc: 'We prioritize speed and efficiency to get your loan approved and disbursed quickly.', icon: Zap, color: '#ea580c' },
        { title: 'Transparent Process', desc: 'No hidden charges or complex terms. We keep you informed at every step of your journey.', icon: ShieldCheck, color: '#059669' },
        { title: 'Strategic Partnerships', desc: 'Collaborating with 10+ premier banking institutions and NBFCs to provide competitive rates.', icon: Landmark, color: '#7c3aed' }
    ]);

    const { data: homeContentData } = useSupabaseQuery('homepage', async () =>
        await supabase.from('site_content').select('*').eq('section_key', 'homepage').single()
    );

    const { data: featureContentData } = useSupabaseQuery('why_choose_us', async () =>
        await supabase.from('site_content').select('*').eq('section_key', 'why_choose_us').single()
    );

    useEffect(() => {
        // Preload primary routes for instant transitions
        const preloadRoutes = () => {
            import('./About').catch(() => { });
            import('./ServicesPage').catch(() => { });
            import('./EMICalculatorPage').catch(() => { });
            import('./Contact').catch(() => { });
        };
        const timer = setTimeout(preloadRoutes, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (homeContentData) {
            setContent(prev => ({ ...prev, ...JSON.parse((homeContentData as any).content) }));
        }
    }, [homeContentData]);

    useEffect(() => {
        if (featureContentData) {
            const parsed = JSON.parse((featureContentData as any).content);
            // We keep the new icons/colors but use the dynamic text if available
            setFeatures(prev => [
                { ...prev[0], title: parsed.title1 || prev[0].title, desc: parsed.desc1 || prev[0].desc },
                { ...prev[1], title: parsed.title2 || prev[1].title, desc: parsed.desc2 || prev[1].desc },
                { ...prev[2], title: parsed.title3 || prev[2].title, desc: parsed.desc3 || prev[2].desc },
                { ...prev[3], title: parsed.title4 || prev[3].title, desc: parsed.desc4 || prev[3].desc }
            ]);
        }
    }, [featureContentData]);

    return (
        <div className="home-page">
            <HeroSlider />
            <AboutOverview />

            {/* EMI Calculator Section */}
            <section className="calculator-section" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center', maxWidth: '800px' }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem' }}>
                            {content.heroTitle.includes(' ') ? (
                                <>
                                    {content.heroTitle.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{content.heroTitle.split(' ').slice(-1)}</span>
                                </>
                            ) : (
                                <span className="text-gradient">{content.heroTitle}</span>
                            )}
                        </h2>
                        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                            {content.heroSubtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    >
                        <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(15, 184, 160, 0.15) 0%, transparent 70%)', zIndex: -1, borderRadius: '50%' }} />
                        <EMICalculator />
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="features" style={{
                padding: '8rem 0',
                background: `linear-gradient(rgba(248, 250, 252, 0.92), rgba(248, 250, 252, 0.92)), url('https://images.unsplash.com/photo-1454165833767-151671e3a041?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat`,
                position: 'relative'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '5rem' }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
                            {content.featuresTitle.includes(' ') ? (
                                <>
                                    {content.featuresTitle.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{content.featuresTitle.split(' ').slice(-1)}</span>
                                </>
                            ) : (
                                <span className="text-gradient">{content.featuresTitle}</span>
                            )}
                        </h2>
                        <p style={{ maxWidth: '600px', margin: '0.8rem auto 0', fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)' }}>
                            {content.featuresSubtitle}
                        </p>
                    </motion.div>

                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '2rem'
                    }}>
                        {features.map((feat, i) => {
                            const Icon = (feat as any).icon || Zap;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.15 * i }}
                                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                    className="glass-card feature-card"
                                    style={{
                                        padding: '2.5rem 2rem',
                                        borderRadius: '24px',
                                        background: '#fff',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{
                                        marginBottom: '1.5rem',
                                        display: 'inline-flex',
                                        background: `${(feat as any).color}15`,
                                        padding: '1.2rem',
                                        borderRadius: '20px'
                                    }}>
                                        <Icon size={32} color={(feat as any).color} />
                                    </div>
                                    <h3 style={{ marginBottom: '0.8rem', fontSize: '1.25rem', fontWeight: 800 }}>{feat.title}</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Services />
            <LoanProcess />
            <Testimonials />
        </div>
    );
};

export default Home;
