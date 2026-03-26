import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
    Home, Briefcase, Lightbulb, Building2, Car,
    ShieldCheck, CheckCircle2, Info, Clock, Users, Award,
    Mail, MapPin, Landmark,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import RevealText from '../components/ui/animations/RevealText';
import ScrollReveal from '../components/ui/animations/ScrollReveal';

/* ── Types ──────────────────────────────────────────── */
type FormData = {
    name: string;
    phone: string;
    email: string;
    city: string;
    loanType: string;
    loanAmount: string;
    remarks: string;
};

/* ── Loan type cards ─────────────────────────────────── */
const LOAN_TYPES = [
    { value: 'Home Loan', label: 'Home Loan', icon: Home, color: '#1a3a6b' },
    { value: 'Project Loan', label: 'Project Finance', icon: Landmark, color: '#2563eb' },
    { value: 'Business Loan', label: 'Business Loan', icon: Briefcase, color: '#0369a1' },
    { value: 'Personal Loan', label: 'Personal Loan', icon: Lightbulb, color: '#7c3aed' },
    { value: 'Loan Against Property', label: 'Mortgage / LAP', icon: Building2, color: '#b45309' },
    { value: 'Auto or Vehicle Loan', label: 'Auto / Vehicle', icon: Car, color: '#059669' },
    { value: 'Machinery Loan', label: 'Machinery Loan', icon: ShieldCheck, color: '#dc2626' },
];

const WHY_US = [
    { icon: ShieldCheck, title: 'One Form. Multiple Banks.', desc: 'We compare offers from 10+ banks and NBFCs to find the best rate for your profile.' },
    { icon: Users, title: 'Doorstep Service', desc: 'Our agents collect all documents directly from your home or office — no branch visits needed.' },
    { icon: Clock, title: 'Fast Processing', desc: 'Quicker turnaround on all applications with streamlined digital workflows.' },
    { icon: Award, title: 'No Hidden Charges', desc: 'Complete transparency — you only pay what the bank formally charges.' },
];

const inp = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    padding: '0.85rem 1.1rem',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e2e8f0'}`,
    background: '#f8fafc',
    fontSize: '0.97rem', color: '#0f172a',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: "'Inter', sans-serif",
    minHeight: '52px',
});

const label: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 700,
    color: '#475569', marginBottom: '0.5rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
};

const ErrMsg = ({ msg }: { msg?: string }) =>
    msg ? (
        <motion.span initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={11} /> {msg}
        </motion.span>
    ) : null;

const WhatsAppIcon = ({ size = 24, color = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

/* ── Component ───────────────────────────────────────── */
const Contact = () => {
    const location = useLocation();
    const prefilledLoanType = location.state?.loanType || '';

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: { loanType: prefilledLoanType },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [settings, setSettings] = useState({ phone: '+91 99245 42956', email: 'growupfincorp@gmail.com', address: 'Rajkot, Gujarat – 360001' });

    useEffect(() => {
        if (prefilledLoanType) setValue('loanType', prefilledLoanType);
    }, [prefilledLoanType, setValue]);

    useEffect(() => {
        document.title = 'Apply for Loan | GrowUp FinCorp – Rajkot';
        window.scrollTo(0, 0);
        async function fetchSettings() {
            try {
                const { data } = await supabase.from('site_settings').select('key, value');
                if (data) {
                    const obj: any = {};
                    data.forEach(r => { obj[r.key] = r.value; });
                    setSettings(prev => ({ ...prev, ...obj }));
                }
            } catch { /* use defaults */ }
        }
        fetchSettings();
    }, []);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
            const response = await fetch(`${API_URL}/api/inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                setIsSubmitted(true);
                toast.success('Application submitted successfully!');
                reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Hero Banner ─────────────────────────────── */}
            <section style={{
                background: `linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(26, 58, 107, 0.6) 100%), url('/images/contact_bg.png') center/cover no-repeat`,
                padding: 'clamp(5rem, 8vw, 7rem) 0 clamp(3rem, 5vw, 4rem)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
                <div className="cx-wrap" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ textAlign: 'center' }}>
                        <span style={{ background: 'rgba(46,196,182,0.15)', color: '#2ec4b6', border: '1px solid rgba(46,196,182,0.3)', padding: '0.45rem 1.2rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', display: 'inline-block', marginBottom: '1.5rem' }}>
                            Free Consultation · No Obligations
                        </span>
                        <RevealText
                            text="One Form."
                            type="words"
                            style={{
                                fontSize: 'clamp(2rem, 6vw, 3.8rem)',
                                fontWeight: 900,
                                color: '#fff',
                                lineHeight: 1.1,
                                marginBottom: '0.4rem',
                                letterSpacing: '-1.5px',
                                fontFamily: "'Outfit', sans-serif",
                                justifyContent: 'center'
                            }}
                        />
                        <RevealText
                            text="Multiple Banks."
                            type="words"
                            delay={0.2}
                            style={{
                                fontSize: 'clamp(2rem, 6vw, 3.8rem)',
                                fontWeight: 900,
                                color: '#2ec4b6',
                                lineHeight: 1.1,
                                marginBottom: '1.2rem',
                                letterSpacing: '-1.5px',
                                fontFamily: "'Outfit', sans-serif",
                                justifyContent: 'center'
                            }}
                        />
                        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                            Our experts compare offers from 10+ banks and NBFCs to find the best rate for your specific needs — home, business, personal, or mortgage loan.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Why Us strip ────────────────────────────── */}
            <ScrollReveal
                stagger={0.15}
                direction="up"
                className="cx-wrap"
                style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}
            >
                <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 16px 50px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', overflow: 'hidden' }}>
                    {WHY_US.map((item, i) => (
                        <div key={i} style={{ padding: '1.8rem 1.5rem', borderRight: i < WHY_US.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <item.icon size={19} color="#2563eb" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', margin: '0 0 0.3rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

            {/* ── Main two-col layout ──────────────────────── */}
            <div className="cx-main-grid cx-wrap">

                {/* LEFT: Form card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ background: '#fff', borderRadius: '24px', padding: 'clamp(2rem, 4vw, 3rem)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}
                >
                    {isSubmitted ? (
                        /* ── Success state ── */
                        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}
                            style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                            <div style={{ width: 90, height: 90, background: 'rgba(46,196,182,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '3px solid #2ec4b6' }}>
                                <CheckCircle2 size={52} color="#2ec4b6" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1a3a6b', marginBottom: '0.8rem' }}>Application Submitted!</h2>
                            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 2.5rem' }}>
                                Our team will review your application and contact you shortly to find the best loan deal.
                            </p>
                            <button onClick={() => setIsSubmitted(false)}
                                style={{ color: '#2563eb', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Inter', sans-serif" }}>
                                Submit another application
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {/* Secure badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: '50px', width: 'fit-content', marginBottom: '2rem', border: '1px solid #bbf7d0' }}>
                                <ShieldCheck size={16} color="#16a34a" />
                                <span style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 700 }}>100% Secure & Confidential</span>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>



                                {/* ── Personal details ── */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem', margin: '0 0 1.2rem' }}>Personal Details</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                                        <div>
                                            <label style={label}>Full Name *</label>
                                            <input
                                                style={inp(!!errors.name)}
                                                placeholder="As per PAN card"
                                                {...register('name', {
                                                    required: 'Full name is required',
                                                    minLength: { value: 3, message: 'Minimum 3 characters' },
                                                    pattern: { value: /^[A-Za-z\s]+$/, message: 'Only alphabets allowed' },
                                                })}
                                            />
                                            <ErrMsg msg={errors.name?.message} />
                                        </div>
                                        <div>
                                            <label style={label}>Mobile Number *</label>
                                            <input
                                                style={inp(!!errors.phone)}
                                                type="tel"
                                                placeholder="10-digit mobile number"
                                                onInput={e => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10); }}
                                                {...register('phone', {
                                                    required: 'Mobile is required',
                                                    pattern: { value: /^[6-9][0-9]{9}$/, message: 'Invalid Indian mobile number' },
                                                })}
                                            />
                                            <ErrMsg msg={errors.phone?.message} />
                                        </div>
                                        <div>
                                            <label style={label}>Email Address</label>
                                            <input
                                                style={inp(!!errors.email)}
                                                type="email"
                                                placeholder="yourname@email.com"
                                                {...register('email', {
                                                    pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' },
                                                })}
                                            />
                                            <ErrMsg msg={errors.email?.message} />
                                        </div>
                                        <div>
                                            <label style={label}>City / Location *</label>
                                            <input
                                                style={inp(!!errors.city)}
                                                placeholder="e.g. Rajkot"
                                                {...register('city', { required: 'City is required' })}
                                            />
                                            <ErrMsg msg={errors.city?.message} />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Loan details ── */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem', margin: '0 0 1.2rem' }}>Loan Requirements</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                                        <div>
                                            <label style={label}>Select Loan Type *</label>
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    defaultValue=""
                                                    style={{ ...inp(!!errors.loanType), appearance: 'none', cursor: 'pointer', background: '#fff' }}
                                                    {...register('loanType', { required: 'Please select a loan type' })}
                                                >
                                                    <option value="" disabled>Choose a loan type...</option>
                                                    {LOAN_TYPES.map(lt => (
                                                        <option key={lt.value} value={lt.value}>{lt.label}</option>
                                                    ))}
                                                </select>
                                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                            <ErrMsg msg={errors.loanType?.message} />
                                        </div>
                                        <div>
                                            <label style={label}>Required Amount (₹) *</label>
                                            <input
                                                style={inp(!!errors.loanAmount)}
                                                type="number" placeholder="e.g. 500000" min="0"
                                                onKeyDown={e => { if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault(); }}
                                                {...register('loanAmount', {
                                                    required: 'Amount is required',
                                                    min: { value: 10000, message: 'Minimum ₹10,000' },
                                                    max: { value: 100000000, message: 'Maximum ₹10 Crores' },
                                                })}
                                            />
                                            <ErrMsg msg={errors.loanAmount?.message} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={label}>Additional Remarks</label>
                                            <textarea
                                                style={{ ...inp(!!errors.remarks), resize: 'vertical', minHeight: '80px' }}
                                                placeholder="Specific requirements or questions?"
                                                rows={2}
                                                {...register('remarks', { maxLength: { value: 500, message: 'Maximum 500 characters' } })}
                                            />
                                            <ErrMsg msg={errors.remarks?.message} />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Submit ── */}
                                <div>
                                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                                        By submitting, you agree to our Terms of Service and consent to receiving communications regarding your application.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            width: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1a3a6b 100%)',
                                            color: '#fff', padding: '1.1rem', borderRadius: '12px',
                                            fontSize: '1rem', fontWeight: 800, border: 'none',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.75 : 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                                            boxShadow: '0 8px 28px rgba(15,23,42,0.25)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                                                Processing...
                                            </>
                                        ) : 'Submit Application →'}
                                    </motion.button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>

                {/* RIGHT: Info sidebar */}
                <div className="cx-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Why apply card */}
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                        style={{ background: '#1a3a6b', borderRadius: '20px', padding: '2rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                        <ShieldCheck size={120} color="rgba(255,255,255,0.04)" style={{ position: 'absolute', top: '5%', right: '-10%', pointerEvents: 'none' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', margin: '0 0 1.5rem' }}>Why Apply With Us?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', position: 'relative', zIndex: 1 }}>
                            {[
                                { n: '1', title: 'One Form. Multiple Banks.', desc: 'We compare across 10+ lenders to find the best rate for your specific profile.' },
                                { n: '2', title: 'Doorstep Document Collection', desc: 'Our agents collect all documents from your home or office — zero branch visits.' },
                                { n: '3', title: 'No Hidden Charges', desc: 'Full transparency — you only pay what the bank formally charges, nothing more.' },
                                { n: '4', title: 'Free Expert Consultation', desc: 'Senior loan advisors guide you through every step at zero cost.' },
                            ].map(item => (
                                <div key={item.n} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: 32, height: 32, background: '#2ec4b6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0f172a', fontSize: '0.85rem', flexShrink: 0 }}>
                                        {item.n}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.95rem', margin: '0 0 0.3rem' }}>{item.title}</h4>
                                        <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact info card */}
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ background: '#fff', borderRadius: '20px', padding: '1.8rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.3rem', margin: '0 0 1.3rem' }}>Reach Us Directly</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href={`https://wa.me/91${settings.phone.replace(/\\D/g, '').endsWith(settings.phone.replace(/\\D/g, '').slice(-10)) ? settings.phone.replace(/\\D/g, '').slice(-10) : '9924542956'}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: '#0f172a' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <WhatsAppIcon size={19} color="#16a34a" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp</div>
                                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a3a6b' }}>{settings.phone}</div>
                                </div>
                            </a>
                            <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: '#0f172a' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Mail size={17} color="#16a34a" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a3a6b', wordBreak: 'break-all' }}>{settings.email}</div>
                                </div>
                            </a>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <MapPin size={17} color="#ea580c" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a3a6b' }}>{settings.address}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick stats */}
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { val: '10+', label: 'Banking Partners' },
                            { val: '₹0', label: 'Consultation Fee' },
                            { val: '250+', label: 'Happy Families' },
                            { val: '100%', label: 'Transparent' },
                        ].map((stat, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '1.2rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a3a6b', fontFamily: "'Outfit', sans-serif" }}>{stat.val}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '0.2rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <style>{`
                .cx-wrap { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
                .cx-main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 3rem; align-items: flex-start; margin-top: 4rem; padding-bottom: 8rem; }
                input:focus, textarea:focus, select:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.08) !important; background: #fff !important; }
                @media (max-width: 1024px) { 
                    .cx-main-grid { grid-template-columns: 1fr; } 
                }
                @media (max-width: 640px) { 
                    .cx-wrap { padding: 0 1rem; } 
                    .cx-main-grid { margin-top: 2rem; }
                }
                .why-us-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
                @media (max-width: 1024px) { .why-us-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .why-us-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Contact;
