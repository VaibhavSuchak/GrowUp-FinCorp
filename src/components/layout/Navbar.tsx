import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Facebook, Instagram, ArrowRight, Settings, Home, Briefcase, Building2, Car, FileText, PiggyBank, MapPin, Mail, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import Logo from '../ui/Logo';

/* ─── Shared Theme Constants ─────────────────────────── */
const NAV_BLUE = '#1a3a6b';      // Corporate Navy
const NAV_ACCENT = '#2ec4b6';    // Greenish-Cyan
const TOP_BAR_H = 42;
const MAIN_NAV_H = 75;

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    const getInitialSettings = () => {
        const saved = localStorage.getItem('site_settings');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return {
            phone: '+91 99245 42956',
            email: 'growupfincorp@gmail.com',
            address: 'Rajkot, Gujarat - 360001',
            facebook: '#',
            instagram: '#',
            whatsapp: '919924542956'
        };
    };

    const [settings, setSettings] = useState(getInitialSettings());

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchSettings = async () => {
            try {
                // Fetch settings with specific columns to avoid schema issues
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('key, value');

                if (error) {
                    console.error('[Navbar] Fetch Error:', error);
                    return;
                }

                if (data && mounted) {
                    const s: any = {};
                    data.forEach(r => s[r.key] = r.value);
                    const newSettings = { ...settings, ...s };
                    setSettings(newSettings);
                    localStorage.setItem('site_settings', JSON.stringify(newSettings));
                }
            } catch (err: any) {
                console.error('[Navbar] Exception:', err);
            }
        };

        fetchSettings();

        // Subscribe to real-time changes — the final solution to the sync bug
        const channel = supabase.channel('site_settings_updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'site_settings' },
                () => { fetchSettings(); }
            ).subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        {
            name: 'Services',
            path: '/services',
            dropdown: [
                { name: 'Home Loan', path: '/services#home-loans', icon: Home },
                { name: 'Business Loan', path: '/services#business-loans', icon: Briefcase },
                { name: 'Personal Loan', path: '/services#personal-loans', icon: PiggyBank },
                { name: 'Loan Against Property', path: '/services#loan-property', icon: FileText },
                { name: 'Auto Loan', path: '/services#auto-loans', icon: Car },
                { name: 'Machinery Loan', path: '/services#machinery-loans', icon: Settings },
                { name: 'Project Finance', path: '/services#project-loans', icon: Building2 },
            ]
        },
        { name: 'EMI Calculator', path: '/emi-calculator' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;
    const isHome = location.pathname === '/';

    return (
        <>
            {/* 1. Top Bar — Address, Contact & Social */}
            <motion.div
                initial={{ y: 0 }}
                animate={{
                    y: scrolled ? -TOP_BAR_H : 0,
                    backgroundColor: NAV_BLUE,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    height: TOP_BAR_H,
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ width: '100%', maxWidth: 'none', padding: isMobile ? '0 1rem' : '0 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left Side: Address, Gmail, Number */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                            <MapPin size={14} color={NAV_ACCENT} />
                            <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{settings.address}</span>
                        </div>

                        {!isMobile && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                                    <Mail size={14} color={NAV_ACCENT} />
                                    <span style={{ fontWeight: 600 }}>{settings.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                                    <Phone size={14} color={NAV_ACCENT} />
                                    <span style={{ fontWeight: 600 }}>{settings.phone}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side: WhatsApp, Instagram, Facebook */}
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <a href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '') || ''}`}
                            target="_blank" rel="noreferrer"
                            style={{ color: '#fff', opacity: 0.8, transition: '0.3s' }}
                            onMouseOver={e => e.currentTarget.style.color = NAV_ACCENT}
                            onMouseOut={e => e.currentTarget.style.color = '#fff'}
                            title="WhatsApp"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </a>
                        <a href={settings.instagram} target="_blank" rel="noreferrer" style={{ color: '#fff', opacity: 0.8, transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.color = NAV_ACCENT} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                            <Instagram size={18} />
                        </a>
                        <a href={settings.facebook} target="_blank" rel="noreferrer" style={{ color: '#fff', opacity: 0.8, transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.color = NAV_ACCENT} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* 2. Main Navigation Bar */}
            <motion.nav
                initial={{ y: 0 }}
                animate={{
                    y: scrolled ? -TOP_BAR_H : 0,
                    backgroundColor: (scrolled) ? 'rgba(26, 58, 107, 0.95)' : 'transparent',
                    backdropFilter: (scrolled) ? 'blur(12px)' : 'none',
                    boxShadow: (scrolled) ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    position: 'fixed',
                    top: TOP_BAR_H,
                    left: 0, right: 0,
                    height: MAIN_NAV_H,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: (scrolled || !isHome) ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                }}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', maxWidth: 'none', padding: isMobile ? '0 1.5rem' : '0 4vw'
                }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Logo height={isMobile ? 36 : 48} />
                    </Link>

                    {!isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    style={{ position: 'relative' }}
                                    onMouseEnter={e => {
                                        if (link.dropdown) {
                                            const menu = e.currentTarget.querySelector('.dropdown-menu') as HTMLElement;
                                            if (menu) {
                                                menu.style.opacity = '1';
                                                menu.style.visibility = 'visible';
                                                menu.style.transform = 'translateY(0)';
                                            }
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (link.dropdown) {
                                            const menu = e.currentTarget.querySelector('.dropdown-menu') as HTMLElement;
                                            if (menu) {
                                                menu.style.opacity = '0';
                                                menu.style.visibility = 'hidden';
                                                menu.style.transform = 'translateY(10px)';
                                            }
                                        }
                                    }}
                                >
                                    <Link
                                        to={link.path}
                                        style={{
                                            padding: '0.8rem 1.2rem',
                                            color: isActive(link.path) ? NAV_ACCENT : '#fff',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            transition: '0.3s',
                                            borderRadius: '8px'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        {link.name}
                                        {link.dropdown && <ChevronDown size={14} opacity={0.5} />}
                                    </Link>

                                    {link.dropdown && (
                                        <div
                                            className="dropdown-menu"
                                            style={{
                                                position: 'absolute', top: '110%', left: '50%',
                                                transform: 'translateX(-50%) translateY(10px)',
                                                minWidth: '300px', background: 'rgba(15, 23, 42, 0.95)',
                                                backdropFilter: 'blur(12px)',
                                                borderRadius: '24px', padding: '1.2rem',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                                opacity: 0, visibility: 'hidden',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                zIndex: 100, border: '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                                {link.dropdown.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={sub.path}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                                            padding: '0.85rem 1.1rem', color: 'rgba(255,255,255,0.9)',
                                                            textDecoration: 'none', fontSize: '0.9rem',
                                                            fontWeight: 700, transition: 'all 0.3s ease',
                                                            borderRadius: '16px',
                                                            border: '1px solid rgba(255,255,255,0.05)',
                                                            background: 'rgba(255,255,255,0.02)',
                                                            fontFamily: "'Outfit', sans-serif"
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = 'rgba(46, 196, 182, 0.1)';
                                                            e.currentTarget.style.borderColor = NAV_ACCENT;
                                                            e.currentTarget.style.color = '#fff';
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            const iconBox = e.currentTarget.querySelector('.icon-box') as HTMLElement;
                                                            if (iconBox) {
                                                                iconBox.style.background = NAV_ACCENT;
                                                                iconBox.style.color = '#fff';
                                                                iconBox.style.transform = 'scale(1.1)';
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                                            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            const iconBox = e.currentTarget.querySelector('.icon-box') as HTMLElement;
                                                            if (iconBox) {
                                                                iconBox.style.background = 'rgba(255,255,255,0.05)';
                                                                iconBox.style.color = NAV_ACCENT;
                                                                iconBox.style.transform = 'scale(1)';
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            className="icon-box"
                                                            style={{
                                                                width: '38px', height: '38px',
                                                                background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: NAV_ACCENT, transition: 'all 0.3s ease',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {sub.icon && <sub.icon size={20} strokeWidth={2.5} />}
                                                        </div>
                                                        <span>{sub.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    )}

                    {isMobile && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}
                        >
                            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: 'fixed', top: MAIN_NAV_H, left: 0, right: 0,
                                background: NAV_BLUE, padding: '2rem',
                                display: 'flex', flexDirection: 'column', gap: '1rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                maxHeight: 'calc(100vh - 120px)', overflowY: 'auto'
                            }}
                        >
                            <AnimatePresence>
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            style={{
                                                color: isActive(link.path) ? NAV_ACCENT : '#fff',
                                                padding: '1rem', fontSize: '1.1rem', fontWeight: 700,
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '12px', textDecoration: 'none',
                                                display: 'flex', justifyContent: 'space-between',
                                                borderLeft: isActive(link.path) ? `4px solid ${NAV_ACCENT}` : 'none'
                                            }}
                                        >
                                            {link.name}
                                            <ArrowRight size={20} opacity={0.3} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )
                    }
                </AnimatePresence >
            </motion.nav >

            {/* Spacer removed to allow transparent overlay on all pages */}
            <motion.div
                animate={{ height: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />

            <style>{`
                .container { width: 100%; max-width: 1600px; margin: 0 auto; padding: 0 2.5rem; }
            `}</style>
        </>
    );
};

export default Navbar;
