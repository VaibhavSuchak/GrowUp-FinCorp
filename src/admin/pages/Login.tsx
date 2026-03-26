import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';
import Logo from '../../components/ui/Logo';

export default function Login({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
            if (authErr) {
                setError('Invalid email or password. Please try again.');
            } else {
                onLogin();
            }
        } catch {
            setError('Connection error. Please check your credentials.');
        }
        setLoading(false);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.85rem 1rem 0.85rem 3rem',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        background: '#fff',
        color: '#1a3a6b',
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02) inset'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            backgroundImage: `
                radial-gradient(circle at 0% 0%, rgba(26, 58, 107, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(0, 245, 255, 0.05) 0%, transparent 50%)
            `,
            fontFamily: "'Inter', sans-serif",
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Decorative Elements */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${BRAND.primary}10, transparent 70%)`, borderRadius: '50%' }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '600px', height: '600px', background: `radial-gradient(circle, ${BRAND.secondary}08, transparent 70%)`, borderRadius: '50%' }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
            >
                {/* Main Card */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '28px',
                    padding: '3rem 2.5rem',
                    boxShadow: '0 25px 70px rgba(26, 58, 107, 0.12), 0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    backdropFilter: 'blur(20px)'
                }}>

                    {/* Header Section - Vertical Logo Stack */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.8rem'
                        }}>
                            <Logo height={80} dark={true} hideText={true} />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                                <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 900,
                                    fontSize: '2rem',
                                    color: '#1a3a6b',
                                    letterSpacing: '-1px'
                                }}>
                                    GROWUP
                                </span>
                                <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '2rem',
                                    color: '#00F5FF',
                                    letterSpacing: '2px'
                                }}>
                                    FINCORP
                                </span>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            color: '#1a3a6b',
                            opacity: 0.6
                        }}>
                            <ShieldCheck size={16} />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                letterSpacing: '2px',
                                textTransform: 'uppercase'
                            }}>
                                Secure Admin Access
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                        {/* Email Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    placeholder="Your email"
                                    required
                                    autoComplete="off"
                                    style={inputStyle}
                                    onFocus={e => {
                                        e.target.style.borderColor = BRAND.primary;
                                        e.target.style.boxShadow = `0 0 0 4px ${BRAND.primary}10`;
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02) inset';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Your password"
                                    required
                                    autoComplete="new-password"
                                    style={{ ...inputStyle, paddingRight: '3.5rem' }}
                                    onFocus={e => {
                                        e.target.style.borderColor = BRAND.primary;
                                        e.target.style.boxShadow = `0 0 0 4px ${BRAND.primary}10`;
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02) inset';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        display: 'flex',
                                        padding: '0.5rem',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.color = BRAND.primary}
                                    onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{
                                        padding: '0.85rem 1rem',
                                        borderRadius: '12px',
                                        background: '#fff1f2',
                                        border: '1px solid #fecaca',
                                        color: '#be123c',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#be123c' }} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: `linear-gradient(135deg, ${BRAND.primary} 0%, #2ec4b6 100%)`,
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: loading ? 'wait' : 'pointer',
                                boxShadow: `0 10px 25px ${BRAND.primary}30`,
                                opacity: loading ? 0.8 : 1,
                                marginTop: '0.5rem',
                                fontFamily: "'Outfit', sans-serif",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {loading ? (
                                <div style={{
                                    width: 20, height: 20,
                                    border: '2.5px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'admin-spin 0.8s linear infinite'
                                }} />
                            ) : (
                                <>Sign In to Dashboard →</>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer Info */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
                        © 2026 Admin Portal · <span style={{ color: BRAND.primary }}>GrowUp FinCorp</span>
                    </p>
                </div>
            </motion.div>

            <style>{`
                @keyframes admin-spin { to { transform: rotate(360deg); } }
                input::placeholder { color: #cbd5e1; }
            `}</style>
        </div>
    );
}
