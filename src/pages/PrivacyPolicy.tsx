import { motion } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/layout/PageHero';

const PrivacyPolicy = () => {
    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <PageHero
                title="Privacy Policy"
                subtitle="Your Trust & Data Security is Our Top Priority"
                badge="Data Protection"
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
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <Shield size={32} color="var(--primary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Information Collection and Use</h2>
                    </div>

                    <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            At <strong>GrowUp FinCorp</strong>, we are committed to protecting the privacy and security of our clients. As a leading loan aggregator and financial consultant, we collect personal and financial information solely for the purpose of processing your loan applications with our partner Banks and Non-Banking Financial Companies (NBFCs).
                        </p>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Data We Collect</h3>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                            {['Basic Identity Information (Name, Date of Birth).', 'Contact Details (Phone number, Email address, Residential address).', 'Financial Documents (Bank statements, ITR, Salary slips).', 'KYC Documents (PAN Card, Aadhar Card, etc.).'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <CheckCircle2 color="var(--accent-cyan)" size={18} style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. How We Use Your Data</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Your information is strictly used to evaluate your eligibility, select the best possible financial products, and securely transmit your application to our authorized lending partners. <strong>We do not sell, rent, or lease your personal information to third-party marketing companies.</strong>
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', marginTop: '3rem' }}>
                            <Lock size={24} color="var(--accent-pink)" />
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>3. Data Security</h3>
                        </div>
                        <p style={{ marginBottom: '1.5rem' }}>
                            We implement robust, industry-standard security measures to ensure that your KYC records and financial documents are encrypted and stored safely. Access to your personal data is restricted to authorized employees and direct partner institutions processing your loan.
                        </p>

                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>4. Your Rights</h3>
                        <p style={{ marginBottom: '1.5rem' }}>
                            You hold the right to request access to the personal data we have collected, request corrections of any inaccuracies, and ask for the deletion of your data once your application process is concluded and regulatory retention periods expire.
                        </p>

                        <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <FileText size={20} color="var(--text-secondary)" />
                                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Contact Us Regarding Privacy</h4>
                            </div>
                            <p style={{ fontSize: '0.95rem', margin: 0 }}>
                                If you have any questions or concerns about this policy, please reach out to our support team through the Contact page.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
