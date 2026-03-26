import { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, MessageSquare, Settings,
    Globe2, Bell,
    Menu, ChevronDown, LogOut, ExternalLink,
    X, Star
} from 'lucide-react';
import { useAdmin, BRAND } from './AdminContext';
import { supabase } from '../supabaseClient';
import Logo from '../components/ui/Logo';
import { formatTimeAgo } from '../utils/timeUtils';

type NavItem = {
    to: string;
    label: string;
    icon: any;
    exact?: boolean;
};

type NavGroup = {
    group: string;
    items: NavItem[];
};

const NAV: NavGroup[] = [
    {
        group: 'OVERVIEW',
        items: [
            { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        ]
    },
    {
        group: 'CRM & ENQUIRIES',
        items: [
            { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
            { to: '/admin/reviews', label: 'Reviews', icon: Star },
        ]
    },
    {
        group: 'SETTINGS',
        items: [
            { to: '/admin/seo', label: 'SEO Settings', icon: Globe2 },
            { to: '/admin/settings', label: 'Site Settings', icon: Settings },
        ]
    }
];

// ── Sidebar Content Component (Defined Outside to Prevent Remounting) ──────
const SidebarContent = ({
    sidebarOpen,
    isDrawer = false,
    onClose,
    onNavClick,
    isActive
}: {
    sidebarOpen: boolean;
    isDrawer?: boolean;
    onClose: () => void;
    onNavClick: () => void;
    isActive: (to: string, exact?: boolean) => boolean;
}) => (
    <>
        {/* Brand Section */}
        <div style={{
            padding: '0.5rem 1rem',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isDrawer ? 'space-between' : 'flex-start'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
                {(sidebarOpen || isDrawer) ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Logo height={36} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
                        <Logo height={28} hideText={true} />
                    </div>
                )}
            </div>
            {isDrawer && (
                <button onClick={onClose}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                    <X size={16} />
                </button>
            )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.75rem 0', scrollbarWidth: 'thin' }}>
            {NAV.map(group => (
                <div key={group.group} style={{ marginBottom: '0.25rem' }}>
                    {(sidebarOpen || isDrawer) && (
                        <div style={{ padding: '0.8rem 1.2rem 0.35rem', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {group.group}
                        </div>
                    )}
                    {group.items.map(item => {
                        const active = isActive(item.to, item.exact);
                        return (
                            <Link key={item.to} to={item.to} onClick={onNavClick}
                                title={!sidebarOpen && !isDrawer ? item.label : undefined}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', margin: '0.1rem 0.5rem', borderRadius: '9px', color: active ? '#fff' : 'rgba(255,255,255,0.55)', background: active ? BRAND.sidebarActive : 'transparent', textDecoration: 'none', fontSize: '0.85rem', fontWeight: active ? 700 : 500, transition: '0.15s', whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative', borderLeft: active ? `3px solid ${BRAND.secondary}` : '3px solid transparent' }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = BRAND.sidebarHover; e.currentTarget.style.color = '#fff'; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}>
                                <item.icon size={17} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0, color: active ? BRAND.secondary : 'inherit' }} />
                                {(sidebarOpen || isDrawer) && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <a href="/" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.5rem', borderRadius: '9px', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                <ExternalLink size={15} style={{ flexShrink: 0 }} />
                {(sidebarOpen || isDrawer) && <span style={{ whiteSpace: 'nowrap' }}>View Website</span>}
            </a>
        </div>
    </>
);

export default function AdminLayout({ onLogout }: { onLogout: () => void }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { notifications, unreadCount, markAllRead, markRead, profile } = useAdmin();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    // Track window width for responsiveness
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setMobileSidebar(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isActive = useCallback((to: string, exact?: boolean) => {
        if (exact) return location.pathname === to || location.pathname === '/admin/';
        return location.pathname.startsWith(to) && to !== '/admin';
    }, [location.pathname]);

    const SIDEBAR_W = isMobile ? 0 : (sidebarOpen ? 240 : 68);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout();
        navigate('/admin/login');
    };

    const handleNavClick = () => {
        if (isMobile) setMobileSidebar(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Mobile Drawer Overlay ──────────────────────────── */}
            <AnimatePresence>
                {mobileSidebar && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setMobileSidebar(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400, backdropFilter: 'blur(3px)' }} />
                )}
            </AnimatePresence>

            {/* ── Mobile Drawer Sidebar ──────────────────────────── */}
            <AnimatePresence>
                {mobileSidebar && (
                    <motion.aside
                        initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{
                            width: 260,
                            minHeight: '100vh',
                            background: BRAND.sidebar,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            top: 0, left: 0, bottom: 0,
                            zIndex: 500,
                            overflowX: 'hidden',
                            boxShadow: '4px 0 30px rgba(0,0,0,0.3)',
                        }}>
                        <SidebarContent
                            sidebarOpen={sidebarOpen}
                            isDrawer={true}
                            onClose={() => setMobileSidebar(false)}
                            onNavClick={handleNavClick}
                            isActive={isActive}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Desktop Sidebar ────────────────────────────────── */}
            {!isMobile && (
                <motion.aside
                    animate={{ width: SIDEBAR_W }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{
                        width: SIDEBAR_W,
                        minHeight: '100vh',
                        background: BRAND.sidebar,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'fixed',
                        top: 0, left: 0, bottom: 0,
                        zIndex: 300,
                        overflowX: 'hidden',
                        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                    }}>
                    <SidebarContent
                        sidebarOpen={sidebarOpen}
                        onClose={() => { }}
                        onNavClick={() => { }}
                        isActive={isActive}
                    />
                </motion.aside>
            )}

            {/* ── Main Content ───────────────────────────────────── */}
            <div style={{ flex: 1, marginLeft: SIDEBAR_W, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.22s ease', minWidth: 0 }}>

                {/* ── Header ─────────────────────────────────────── */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 450,
                    background: '#fff',
                    borderBottom: `1px solid ${BRAND.border}`,
                    padding: '0 1rem',
                    height: '64px',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                }}>
                    {/* Mobile hamburger / Desktop collapse */}
                    <button
                        onClick={() => isMobile ? setMobileSidebar(v => !v) : setSidebarOpen(v => !v)}
                        style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${BRAND.border}`, background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.muted, flexShrink: 0 }}>
                        {mobileSidebar ? <X size={16} /> : <Menu size={16} />}
                    </button>

                    <div style={{ flex: 1 }} />

                    {/* Notifications */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button onClick={() => setShowNotifs(v => !v)}
                            style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${BRAND.border}`, background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: BRAND.muted }}>
                            <Bell size={15} />
                            {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: BRAND.danger, borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.15 }}
                                    style={{ position: 'absolute', right: isMobile ? '-40px' : 0, top: 46, width: 300, maxWidth: 'calc(100vw - 2rem)', background: '#fff', border: `1px solid ${BRAND.border}`, borderRadius: 14, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 500, overflow: 'hidden' }}>
                                    <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${BRAND.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: BRAND.text }}>Notifications</span>
                                        {unreadCount > 0 && <button onClick={markAllRead} style={{ border: 'none', background: 'none', color: BRAND.secondary, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Mark all read</button>}
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: BRAND.muted, fontSize: '0.85rem' }}>No notifications</div>
                                    ) : (
                                        notifications.slice(0, 5).map(n => (
                                            <div key={n.id} onClick={() => markRead(n.id)}
                                                style={{ padding: '0.9rem 1.2rem', borderBottom: `1px solid ${BRAND.border}`, display: 'flex', gap: '0.8rem', alignItems: 'flex-start', cursor: 'pointer', background: n.is_read ? 'transparent' : '#f0f7ff', transition: '0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : '#f0f7ff'}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? 'transparent' : BRAND.secondary, marginTop: 6, flexShrink: 0 }} />
                                                <div>
                                                    <div style={{ fontSize: '0.83rem', color: BRAND.text, fontWeight: n.is_read ? 400 : 600 }}>{n.message}</div>
                                                    <div style={{ fontSize: '0.72rem', color: BRAND.muted, marginTop: '0.2rem' }}>{formatTimeAgo(n.created_at)}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Menu */}
                    <div ref={userRef} style={{ position: 'relative' }}>
                        <button onClick={() => setShowUserMenu(v => !v)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.6rem', borderRadius: 10, border: `1px solid ${BRAND.border}`, background: '#f8fafc', cursor: 'pointer' }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>
                                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <ChevronDown size={13} color={BRAND.muted} />
                        </button>
                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                                    style={{ position: 'absolute', right: 0, top: 46, width: 190, background: '#fff', border: `1px solid ${BRAND.border}`, borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.12)', zIndex: 500, overflow: 'hidden' }}>
                                    <div style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${BRAND.border}` }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: BRAND.text }}>{profile?.name || 'Admin'}</div>
                                        <div style={{ fontSize: '0.72rem', color: BRAND.muted }}>{profile?.email || 'Portal Admin'}</div>
                                    </div>
                                    <button onClick={handleLogout}
                                        style={{ width: '100%', padding: '0.8rem 1rem', border: 'none', background: 'none', color: BRAND.danger, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', textAlign: 'left' }}>
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* ── Page Content ───────────────────────────────── */}
                <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflowX: 'hidden' }}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                @media (max-width: 480px) {
                    main { padding: 0.75rem !important; }
                }
            `}</style>
        </div>
    );
}
