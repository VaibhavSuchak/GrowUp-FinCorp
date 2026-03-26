import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Search, Edit, X, Globe, Compass, Terminal, Sparkles } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';

// ── Sub-components moved outside to prevent re-mounting focus issues ────────

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text", isTextArea = false, maxLength, muted, BRAND, inputStyle, border }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Icon size={14} color={BRAND.primary} /> {label}
            </label>
            {maxLength && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: value?.length > maxLength ? '#ef4444' : muted }}>
                    {value?.length || 0} / {maxLength}
                </span>
            )}
        </div>
        {isTextArea ? (
            <textarea
                value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} maxLength={maxLength}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = border}
            />
        ) : (
            <input
                type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = border}
            />
        )}
    </div>
);

export default function SEOSettings() {
    const card = '#ffffff';
    const border = BRAND.border;
    const text = BRAND.text;
    const muted = BRAND.muted;

    const [seoData, setSeoData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSeo, setEditingSeo] = useState<any | null>(null);

    useEffect(() => {
        fetchSeo();
    }, []);

    useEffect(() => {
        if (editingSeo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [editingSeo]);

    const fetchSeo = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('seo_settings').select('*');
        if (error || !data || data.length === 0) {
            setSeoData([
                { page: '/', title: 'GrowUp FinCorp | Enterprise Loan Advisory', description: 'Expert loan advisory for home, business, and personal loans. Partnered with Tier-1 banks.', keywords: 'loan advisory, msme loans, home loans india' },
                { page: '/about', title: 'About Us | GrowUp FinCorp', description: 'Learn about our mission to democratize capital access.', keywords: 'about GrowUp FinCorp, financial consultants' },
                { page: '/services', title: 'Our Services | GrowUp FinCorp', description: 'Explore our wide range of business and personal funding products.', keywords: 'financial services, business loans, personal loans' },
                { page: '/contact', title: 'Contact Us | GrowUp FinCorp', description: 'Get in touch for a premium financial consultation.', keywords: 'contact growup, loan consultation' },
            ]);
        } else {
            setSeoData(data);
        }
        setLoading(false);
    };

    const handleSave = async (e: any) => {
        if (e) e.preventDefault();
        let newSeo = { ...editingSeo };
        const { error } = await supabase.from('seo_settings').upsert([newSeo]);

        if (!error) {
            fetchSeo();
            setEditingSeo(null);
        } else {
            setSeoData(seoData.map(s => s.page === editingSeo.page ? newSeo : s));
            setEditingSeo(null);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
        border: `1.5px solid ${border}`, background: '#f8fafc',
        color: text, fontSize: '0.9rem', outline: 'none', fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.2s', boxSizing: 'border-box'
    };

    return (
        <div style={{ position: 'relative' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>SETTINGS</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: text, margin: 0, fontFamily: "'Outfit', sans-serif" }}>SEO Settings</h1>
                    <p style={{ color: muted, fontSize: '0.85rem', margin: '0.3rem 0 0' }}>Manage meta titles, descriptions, and keywords for better search engine rankings.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: card, border: `1px solid ${border}`, padding: '0.6rem 1.2rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', color: muted, fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <Globe size={14} color={BRAND.primary} /> Indexed: <span style={{ color: text }}>{seoData.length} Routes</span>
                    </div>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: card, borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: `1px solid ${border}` }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deployment Route</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Discovery Title</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Metadata Snippet</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: muted }}>Loading SEO data...</td></tr>
                            ) : (
                                seoData.map((seo, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                        key={seo.page}
                                        style={{ borderBottom: `1px solid ${border}`, transition: '0.2s', cursor: 'pointer' }}
                                        whileHover={{ background: '#f8fafc' }}
                                        onClick={() => setEditingSeo(seo)}
                                    >
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${BRAND.primary}15`, color: BRAND.primary, padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                                                <Compass size={12} /> {seo.page}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 700, color: text, fontSize: '0.9rem' }}>{seo.title}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.5, maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {seo.description}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                onClick={(e) => { e.stopPropagation(); setEditingSeo(seo); }}
                                                style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: BRAND.primary, fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                                            >
                                                <Edit size={12} /> Edit
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Optimization Modal */}
            <AnimatePresence>
                {editingSeo && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditingSeo(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            style={{
                                background: card,
                                padding: '2rem',
                                borderRadius: '20px',
                                border: `1px solid ${border}`,
                                width: '100%',
                                maxWidth: '700px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '90vh'
                            }}
                        >
                            <button onClick={() => setEditingSeo(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}><X size={16} /></button>

                            <header style={{ marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: text, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${BRAND.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.primary }}><Sparkles size={16} /></div>
                                    Optimize Route: <span style={{ color: BRAND.primary }}>{editingSeo.page}</span>
                                </h2>
                            </header>

                            <form onSubmit={handleSave} data-lenis-prevent style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <InputGroup label="Meta Title" icon={Edit} value={editingSeo.title} onChange={(v: string) => setEditingSeo({ ...editingSeo, title: v })} placeholder="Competitive Title..." maxLength={60} muted={muted} BRAND={BRAND} inputStyle={inputStyle} border={border} />
                                <InputGroup label="Meta Description" icon={Terminal} isTextArea={true} value={editingSeo.description} onChange={(v: string) => setEditingSeo({ ...editingSeo, description: v })} placeholder="High-performance meta description..." maxLength={160} muted={muted} BRAND={BRAND} inputStyle={inputStyle} border={border} />
                                <InputGroup label="Focus Keywords" icon={Compass} value={editingSeo.keywords} onChange={(v: string) => setEditingSeo({ ...editingSeo, keywords: v })} placeholder="comma, separated, tags" muted={muted} BRAND={BRAND} inputStyle={inputStyle} border={border} />

                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: `1px solid ${border}`, marginTop: '0.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <Search size={14} color={BRAND.primary} /> Search Engine Preview
                                    </div>
                                    <div style={{ color: '#1a0dab', fontSize: '1.1rem', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem', fontFamily: 'arial, sans-serif' }}>{editingSeo.title || 'Page Title'}</div>
                                    <div style={{ color: '#006621', fontSize: '0.85rem', marginBottom: '0.3rem', fontFamily: 'arial, sans-serif' }}>https://growupfincorp.com{editingSeo.page === '/' ? '' : editingSeo.page}</div>
                                    <div style={{ color: '#545454', fontSize: '0.85rem', lineHeight: 1.5, fontFamily: 'arial, sans-serif' }}>{editingSeo.description || 'Page description preview...'}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}` }}>
                                    <button type="button" onClick={() => setEditingSeo(null)} style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: text, fontWeight: 700, cursor: 'pointer' }}>Discard</button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem',
                                            background: BRAND.primary, color: '#fff', border: 'none', borderRadius: '10px',
                                            fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${BRAND.primary}35`
                                        }}
                                    >
                                        <Save size={16} /> Save SEO Settings
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
