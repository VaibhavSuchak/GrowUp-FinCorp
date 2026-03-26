import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import PageHero from '../components/layout/PageHero';

const Disclaimer = () => {
    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <PageHero
                title="Legal Disclaimer"
                subtitle="Important Information Regarding Loan Approvals"
                badge="Disclaimer"
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
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <AlertTriangle size={32} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>General Disclaimer</h2>
                    </div>

                    <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: '2rem' }}>
                            The information contained on the <strong>GrowUp FinCorp</strong> website is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the lending products and interest rates displayed.
                        </p>

                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                                <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '4px' }} />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>Loan Approvals & Credit Scores</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Features, interest rates, and loan amounts quoted on our platform are indicative and subject to the borrower's credit profile (CIBIL score), income stability, and the strict discretionary policies of the respective partner Banks/NBFCs. Final approvals are at the sole discretion of the lending institutions.</p>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                                <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '4px' }} />
                                <div>
                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>Third-Party Links</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Through this website, you are able to link to other websites which are not under the control of GrowUp FinCorp. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
                                </div>
                            </div>
                        </div>

                        <p style={{ marginBottom: '1.5rem' }}>
                            GrowUp FinCorp takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control. Users are advised to read and understand the detailed banking terms and conditions before signing any loan agreement.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Disclaimer;
