import { Search, FileText, CheckCircle, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const LoanProcess = () => {
    const [content, setContent] = useState({
        title: 'Simple 4-Step Process',
        subtitle: 'Your journey to financial growth is just four simple steps away. Fast, transparent, and completely digital.',
        step1: 'Check Eligibility',
        step1Desc: 'Use our online tools to estimate your loan eligibility based on income and credit score.',
        step2: 'Submit Documents',
        step2Desc: 'Upload required documents through our secure digital portal for seamless processing.',
        step3: 'Expert Review',
        step3Desc: 'Our strategic tie-ups with 10+ leading banks ensure thorough verification and competitive rate options.',
        step4: 'Loan Disbursal',
        step4Desc: 'Once approved, the loan amount is credited directly to your bank account with minimal delay.'
    });

    useEffect(() => {
        async function fetchProcessContent() {
            try {
                const { data, error } = await supabase.from('site_content').select('*').eq('section_key', 'loan_process').single();
                if (!error && data) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                } else {
                    throw new Error('Local');
                }
            } catch (err) {
                const localData = localStorage.getItem('mock_site_content');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (parsed.loan_process) setContent(prev => ({ ...prev, ...parsed.loan_process }));
                }
            }
        }
        fetchProcessContent();
    }, []);

    const steps = [
        {
            icon: <Search size={40} color="#2ec4b6" />,
            title: content.step1 || "Check Eligibility",
            desc: content.step1Desc || "Use our online tools to quickly estimate your loan eligibility based on income and credit score."
        },
        {
            icon: <FileText size={40} color="#2ec4b6" />,
            title: content.step2 || "Submit Documents",
            desc: content.step2Desc || "Upload minimal required documents through our secure digital portal for fast processing."
        },
        {
            icon: <CheckCircle size={40} color="#2ec4b6" />,
            title: content.step3 || "Fast Approval",
            desc: content.step3Desc || "Our strategic tie-ups with 10+ leading banks ensure swift verification and approval with competitive rates."
        },
        {
            icon: <PiggyBank size={40} color="#2ec4b6" />,
            title: content.step4 || "Quick Disbursal",
            desc: content.step4Desc || "Once approved, the loan amount is credited directly to your bank account with minimal delay."
        }
    ];

    return (
        <section style={{
            padding: '6rem 0', // Reduced for better screen fit
            position: 'relative',
            backgroundImage: 'url(/assets/process_bg_growth.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            minHeight: 'auto' // Allow it to be more compact
        }}>
            {/* Deep navy blue premium overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(20, 48, 92, 0.98) 0%, rgba(26, 58, 107, 0.95) 100%)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        marginBottom: '1rem',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-1px'
                    }}>
                        {content.title.includes(' ') ? (
                            <>
                                {content.title.split(' ').slice(0, -1).join(' ')} <span style={{ color: '#2ec4b6' }}>{content.title.split(' ').slice(-1)}</span>
                            </>
                        ) : content.title}
                    </h2>
                    <p style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: 1.6
                    }}>
                        {content.subtitle}
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.25rem',
                    position: 'relative'
                }} className="process-grid">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            style={{
                                textAlign: 'center',
                                padding: '2.5rem 1.25rem', // More compact padding
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                margin: '0 auto 1.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: '0.3s'
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{
                                marginBottom: '1rem',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: '#fff'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: '0.95rem',
                                color: 'rgba(255, 255, 255, 0.6)',
                                lineHeight: 1.5
                            }}>
                                {step.desc}
                            </p>

                            {/* Step Number Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1.5rem',
                                fontSize: '4rem',
                                fontWeight: 900,
                                color: 'rgba(255, 255, 255, 0.05)',
                                pointerEvents: 'none',
                                lineHeight: 1
                            }}>
                                {idx + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 1200px) {
                    .process-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 640px) {
                    .process-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default LoanProcess;
