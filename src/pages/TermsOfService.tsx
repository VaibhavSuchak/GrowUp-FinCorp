import { motion } from 'framer-motion';
import { Scale, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/layout/PageHero';

const TermsOfService = () => {
    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <PageHero
                title="Terms of Service"
                subtitle="Guidelines and Rules for Using Our Platform"
                badge="Legal Terms"
            />

            <div className="container" style={{ maxWidth: '900px', margin: '40px auto 0 auto', padding: '0 1.5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '24px',
                        padding: 'clamp(2rem, 5vw, 4rem)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <Scale size={32} color="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Agreement to Terms</h2>
                    </div>

                    <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: '2rem' }}>
                            By accessing or using the <strong>GrowUp FinCorp</strong> website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
                        </p>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Nature of Services</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            GrowUp FinCorp operates as a financial aggregator and consultant. We facilitate the connection between potential borrowers and official lending institutions (Banks and NBFCs). <strong>We are not a direct lender</strong> and do not disburse funds directly. The final decision to approve or reject any loan application rests solely with the respective bank or financial institution.
                        </p>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. User Responsibilities</h3>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                            {[
                                'You must be at least 18 years old to use our services.',
                                'You agree to provide true, accurate, current, and complete information during the application process.',
                                'You agree not to use the platform for any fraudulent or illegal activity.',
                                'You understand that submitting false documents is a criminal offense and will lead to immediate rejection.'
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <CheckCircle2 color="var(--accent-mint)" size={18} style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>3. Fees and Charges</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            GrowUp FinCorp provides consulting services. Any processing fees, administrative charges, or interest rates associated with your approved loan are charged directly by the lending bank or NBFC as per their official schedule of charges. We ensure absolute transparency with no hidden processing fee surprises.
                        </p>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>4. Limitation of Liability</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            While we strive to provide the best possible service and secure the lowest interest rates for your profile, GrowUp FinCorp cannot be held liable for any damages, rejection of loan applications, or changes in bank policies. Our liability is strictly limited to the facilitation of your application file.
                        </p>

                        <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                            <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                                GrowUp FinCorp reserves the right to modify these Terms of Service at any time. Continued use of the platform after changes have been made constitutes your acceptance of the new terms.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
