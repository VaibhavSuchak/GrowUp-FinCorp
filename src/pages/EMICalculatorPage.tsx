import { useState, useEffect } from 'react';
import EMICalculator from '../components/sections/EMICalculator';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const EMICalculatorPage = () => {
    const [content, setContent] = useState({
        title: 'Smart EMI Calculator',
        subtitle: 'Visualize your repayment structure and plan your future with precision. Instant results to help you make informed financial decisions.'
    });

    useEffect(() => {
        async function fetchEMIContent() {
            try {
                const { data, error } = await supabase.from('site_content').select('*').eq('section_key', 'emi_calculator').single();
                if (!error && data) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (err) {
                const localData = localStorage.getItem('mock_site_content');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (parsed.emi_calculator) setContent(prev => ({ ...prev, ...parsed.emi_calculator }));
                }
            }
        }
        fetchEMIContent();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Premium Header Hero Section */}
            <div style={{
                position: 'relative',
                padding: '160px 0 100px',
                backgroundImage: 'url(/assets/emi_header_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                {/* Navy Blue Overlay for Consistency */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(20, 48, 92, 0.95) 0%, rgba(26, 58, 107, 0.85) 100%)',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            marginBottom: '2rem',
                            letterSpacing: '-1.5px',
                            lineHeight: 1.1
                        }}>
                            {content.title.includes(' ') ? (
                                <>
                                    {content.title.split(' ').slice(0, -1).join(' ')} <span style={{ color: '#2ec4b6' }}>{content.title.split(' ').slice(-1)}</span>
                                </>
                            ) : content.title}
                        </h1>
                        <p style={{
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontSize: '1.25rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6,
                            marginBottom: '2rem'
                        }}>
                            {content.subtitle}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Calculator Section */}
            <div className="container" style={{ marginTop: '40px', position: 'relative', zIndex: 2, paddingBottom: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ width: '100%', maxWidth: '1000px' }}
                    >
                        <EMICalculator />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EMICalculatorPage;
