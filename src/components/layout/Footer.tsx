import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Star, Send, CheckCircle, Facebook, Instagram } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { SERVICES_DATA } from '../../data/servicesData';
import { invalidateSupabaseCache } from '../../hooks/useSupabaseQuery';
import Logo from '../ui/Logo';
import ScrollReveal from '../ui/animations/ScrollReveal';

/* ─── Same colours as Navbar ─────────────────────────────────── */
const NAV_BLUE_DARK = '#142e55';
const NAV_ACCENT = '#2ec4b6';

/* ─── Compact Star Rating ───────────────────────────────────── */
const StarRating = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n} type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 1 }}
                >
                    <Star
                        size={20}
                        fill={(hovered || value) >= n ? '#ff9f1c' : 'transparent'}
                        color={(hovered || value) >= n ? '#ff9f1c' : 'rgba(255,255,255,0.25)'}
                        strokeWidth={1.5}
                        style={{ transition: 'all 0.15s' }}
                    />
                </button>
            ))}
        </div>
    );
};

/* ─── Footer ────────────────────────────────────────────────── */
const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ name: '', loanType: '', rating: 0, message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState('');
    const [settings, setSettings] = useState({
        phone: '+91 99245 42956',
        email: 'growupfincorp@gmail.com',
        address: 'Rajkot, Gujarat, 360001',
        facebook: '#',
        instagram: 'https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ==',
        whatsapp: ''
    });
    const [content, setContent] = useState({
        ctaTitle: 'Ready to Get Started?',
        ctaSubtitle: 'Please feel free to contact us. We’re super happy to talk to you. Feel free to ask anything.',
        description: 'A trusted Direct Selling Agent (DSA) providing loan assistance in Rajkot, Gujarat. Fast approvals, minimal documentation.'
    });

    useEffect(() => {
        async function fetchFooter() {
            try {
                const { data, error } = await supabase.from('site_content').select('*').eq('section_key', 'footer').single();
                if (!error && data) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (err) {
                const localData = localStorage.getItem('mock_site_content');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (parsed.footer) setContent(prev => ({ ...prev, ...parsed.footer }));
                }
            }
        }
        fetchFooter();
    }, []);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (!error && data && data.length > 0) {
                    let loaded: any = {};
                    data.forEach((row: any) => {
                        loaded[row.key] = row.value;
                    });
                    setSettings(prev => ({ ...prev, ...loaded }));
                }
            } catch (err) { }
        }
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.message.trim() || form.rating === 0) {
            setErr('Please fill all required fields and choose a rating.');
            return;
        }
        setErr('');
        setSubmitting(true);

        const { error } = await supabase.from('reviews').insert([{
            customer_name: form.name,
            review_text: form.message,
            rating: form.rating,
            loan_type: form.loanType || 'General',
            approved: false
        }]);

        if (error) {
            console.error('Error saving review:', error);
            setErr('Could not submit review. Please try again.');
        } else {
            setSubmitted(true);
            invalidateSupabaseCache('reviews');
        }
        setSubmitting(false);
    };

    const inp: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8, padding: '0.6rem 0.85rem',
        color: '#fff', fontSize: '0.85rem',
        outline: 'none', fontFamily: 'Inter,sans-serif',
        transition: 'border-color 0.2s',
    };

    return (
        <footer style={{
            position: 'relative',
            background: `#1a3a6b url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070") center/cover no-repeat`,
            color: '#fff',
            fontFamily: 'Inter,sans-serif',
            overflow: 'hidden'
        }}>
            {/* Main Dark Overlay for Readability (Reduced Opacity to match header) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(26, 58, 107, 0.88) 0%, rgba(20, 46, 85, 0.95) 100%)',
                zIndex: 1
            }} />

            {/* All content must be relative and above z-index 1 */}
            <div style={{ position: 'relative', zIndex: 2 }}>

                {/* ── Wanna Talk To Us? (Original Banner) ──────────────── */}
                {location.pathname !== '/contact' && (
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="container" style={{
                            maxWidth: 1200,
                            margin: '0 auto',
                            padding: '5rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '2.5rem'
                        }}>
                            <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
                                <h2 style={{
                                    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                                    fontWeight: 800,
                                    marginBottom: '1.2rem',
                                    color: '#fff',
                                    fontFamily: "'Outfit', sans-serif"
                                }}>
                                    {content.ctaTitle.includes(' ') ? (
                                        <>
                                            {content.ctaTitle.split(' ').slice(0, -1).join(' ')} <span style={{ color: NAV_ACCENT }}>{content.ctaTitle.split(' ').slice(-1)}</span>
                                        </>
                                    ) : content.ctaTitle}
                                </h2>
                                <p style={{
                                    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                                    color: '#ff9f1c', // Vibrant orange/amber
                                    fontWeight: 600,
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    {content.ctaSubtitle}
                                </p>
                            </div>

                            <div style={{ flexShrink: 0 }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,159,28,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { window.scrollTo(0, 0); navigate('/contact'); }}
                                    style={{
                                        padding: '1.2rem 3.5rem',
                                        background: '#fff',
                                        color: '#1a3a6b',
                                        borderRadius: '50px',
                                        border: 'none',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Contact Us
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Main 4-Column Footer ────────────────────────────── */}
                <div style={{ padding: '5rem 0 4rem' }}>
                    <ScrollReveal
                        stagger={0.15}
                        direction="up"
                        className="container"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                            gap: '4rem',
                            alignItems: 'start',
                        }}
                    >
                        {/* COL 1 — Brand + Contact + Social ─────────────── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <Logo height={42} />
                            </Link>

                            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0, maxWidth: '300px' }}>
                                {content.description}
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                                    <MapPin size={18} color={NAV_ACCENT} style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem' }}>{settings.address}</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                    <Phone size={18} color={NAV_ACCENT} style={{ flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem' }}>{settings.phone}</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                    <Mail size={18} color={NAV_ACCENT} style={{ flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem' }}>{settings.email}</span>
                                </li>
                            </ul>

                            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                                {[
                                    { icon: Facebook, title: 'Facebook', url: settings.facebook },
                                    { icon: Instagram, title: 'Instagram', url: settings.instagram },
                                    {
                                        icon: ({ size = 18 }: any) => (
                                            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        ),
                                        title: 'WhatsApp',
                                        url: `https://wa.me/${(settings.whatsapp?.replace(/\D/g, '') || '9924542956').startsWith('91') ? (settings.whatsapp?.replace(/\D/g, '') || '9924542956') : '91' + (settings.whatsapp?.replace(/\D/g, '') || '9924542956')}`
                                    },
                                ].map((s, i) => (
                                    <a key={i} href={s.url} title={s.title} style={{
                                        width: 40, height: 40,
                                        background: 'rgba(255,255,255,0.08)', borderRadius: 10,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', textDecoration: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = NAV_ACCENT;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.borderColor = NAV_ACCENT;
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        }}
                                    >
                                        <s.icon size={18} strokeWidth={2} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* COL 2 — Our Services ─────────────────────────── */}
                        <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.8rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Our Services
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {SERVICES_DATA.map(item => (
                                    <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ width: 6, height: 6, background: NAV_ACCENT, borderRadius: '50%', flexShrink: 0 }} />
                                        <Link to="/services" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '1rem', transition: '0.3s' }}
                                            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                            onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                                        >{item.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COL 3 — Quick Links ──────────────────────────── */}
                        <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.8rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Quick Links
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {[
                                    ['About Us', '/about'],
                                    ['EMI Calculator', '/emi-calculator'],
                                    ['Apply Loan', '/contact'],
                                    ['Contact Us', '/contact']
                                ].map(([label, href]) => (
                                    <li key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ width: 6, height: 6, background: '#ff9f1c', borderRadius: '50%', flexShrink: 0 }} />
                                        <Link to={href} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '1rem', transition: '0.3s' }}
                                            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                            onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                                        >{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COL 4 — Leave a Review ────────────────────────── */}
                        <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.6rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Leave a Review
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>
                                Share your experience with us
                            </p>

                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '1.5rem',
                                            background: 'rgba(46,196,182,0.1)',
                                            border: '1px solid rgba(46,196,182,0.25)',
                                            borderRadius: 16,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <CheckCircle size={40} color={NAV_ACCENT} style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Thanks, {form.name}!</p>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Your review is pending moderation and will appear once approved.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        <input
                                            type="text" placeholder="Your name *"
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            style={inp}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(46,196,182,0.5)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                                        />
                                        <select
                                            value={form.loanType}
                                            onChange={e => setForm(f => ({ ...f, loanType: e.target.value }))}
                                            style={{ ...inp, cursor: 'pointer', appearance: 'none', color: form.loanType ? '#fff' : 'rgba(255,255,255,0.4)' }}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(46,196,182,0.5)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                                        >
                                            <option value="" disabled style={{ background: NAV_BLUE_DARK }}>Loan service taken</option>
                                            {SERVICES_DATA.map(s => (
                                                <option key={s.id} value={s.title} style={{ background: NAV_BLUE_DARK, color: '#fff' }}>{s.title}</option>
                                            ))}
                                        </select>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.35rem' }}>Rating *</div>
                                            <StarRating value={form.rating} onChange={n => setForm(f => ({ ...f, rating: n }))} />
                                        </div>
                                        <textarea
                                            placeholder="Your review *"
                                            rows={3}
                                            value={form.message}
                                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                            style={{ ...inp, resize: 'vertical' }}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(46,196,182,0.5)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                                        />
                                        {err && <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0 }}>{err}</p>}
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                            disabled={submitting}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                                                padding: '0.65rem 1rem', borderRadius: 8,
                                                background: 'var(--primary-color)',
                                                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                                                border: 'none', cursor: submitting ? 'wait' : 'pointer',
                                                opacity: submitting ? 0.7 : 1,
                                                fontFamily: 'Inter,sans-serif',
                                            }}
                                        >
                                            <Send size={14} />
                                            {submitting ? 'Submitting…' : 'Submit Review'}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollReveal>
                </div>

                {/* ── Bottom Bar ─────────────────────────────────────── */}
                <div style={{ padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="container" style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '1.5rem',
                    }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} GrowUp Finance Corporation. All rights reserved. | Licensed DSA
                        </div>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {[
                                ['Privacy Policy', '/privacy-policy'],
                                ['Terms of Service', '/terms-of-service'],
                                ['Disclaimer', '/disclaimer']
                            ].map(([label, path]) => (
                                <Link key={label} to={path} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', transition: '0.3s' }}
                                    onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                                >{label}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
