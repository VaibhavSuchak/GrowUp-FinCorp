import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Edit, Trash2, Plus, X, Save,
    Briefcase, Activity, Palette,
    CheckCircle2, AlertCircle, Zap, Type, FileText, List, AlignLeft, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';
import { invalidateSupabaseCache } from '../../hooks/useSupabaseQuery';

// ── Sub-components moved outside to prevent re-mounting focus issues ────────

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text", isTextArea = false, textMut, BRAND, border, inputBg, textMain }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: textMut, display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ color: BRAND.secondary }}><Icon size={14} strokeWidth={2.5} /></div> {label}
        </label>
        {isTextArea ? (
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                style={{
                    width: '100%', padding: '1.2rem', borderRadius: '18px', border: `1px solid ${border}`,
                    fontSize: '1rem', background: inputBg, outline: 'none', transition: 'all 0.3s',
                    resize: 'vertical', color: textMain, fontFamily: "'Inter', sans-serif"
                }}
                onFocus={e => (e.target.style.borderColor = BRAND.secondary, e.target.style.boxShadow = `0 0 15px ${BRAND.secondary}20`)}
                onBlur={e => (e.target.style.borderColor = border, e.target.style.boxShadow = 'none')}
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: '1.2rem', borderRadius: '18px', border: `1px solid ${border}`,
                    fontSize: '1rem', background: inputBg, outline: 'none', transition: 'all 0.3s',
                    color: textMain, fontWeight: 500, fontFamily: "'Inter', sans-serif"
                }}
                onFocus={e => (e.target.style.borderColor = BRAND.secondary, e.target.style.boxShadow = `0 0 15px ${BRAND.secondary}20`)}
                onBlur={e => (e.target.style.borderColor = border, e.target.style.boxShadow = 'none')}
            />
        )}
    </div>
);

const ArrayInputGroup = ({ label, icon: Icon, items, onChange, BRAND, border, inputBg, textMain, textMut }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: textMut, display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ color: BRAND.primary }}><Icon size={14} strokeWidth={2.5} /></div> {label}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(items || []).map((item: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        value={item}
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx] = e.target.value;
                            onChange(newItems);
                        }}
                        style={{
                            flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px', border: `1px solid ${border}`,
                            background: inputBg, color: textMain, fontSize: '0.9rem', outline: 'none'
                        }}
                    />
                    <button type="button" onClick={() => onChange(items.filter((_: any, i: number) => i !== idx))} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: '12px', width: '42px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                </div>
            ))}
            <button type="button" onClick={() => onChange([...(items || []), ''])} style={{ padding: '0.8rem', background: 'transparent', border: `1px dashed ${BRAND.secondary}`, color: BRAND.secondary, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Item
            </button>
        </div>
    </div>
);

const StatsInputGroup = ({ label, items, onChange, border, inputBg, textMain, textMut }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: textMut, display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ color: '#ea580c' }}><Activity size={14} strokeWidth={2.5} /></div> {label}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(items || []).map((stat: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        value={stat.label || ''}
                        placeholder="Label (e.g. Starting Rate)"
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx] = { ...stat, label: e.target.value };
                            onChange(newItems);
                        }}
                        style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '0.9rem', outline: 'none' }}
                    />
                    <input
                        value={stat.val || ''}
                        placeholder="Value (e.g. 8.5%)"
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx] = { ...stat, val: e.target.value };
                            onChange(newItems);
                        }}
                        style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '0.9rem', outline: 'none' }}
                    />
                    <button type="button" onClick={() => onChange(items.filter((_: any, i: number) => i !== idx))} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: '12px', width: '42px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                </div>
            ))}
            <button type="button" onClick={() => onChange([...(items || []), { label: '', val: '' }])} style={{ padding: '0.8rem', background: 'transparent', border: `1px dashed #ea580c`, color: '#ea580c', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Stat Pair
            </button>
        </div>
    </div>
);

export default function ServicesManager() {
    const cardBg = '#ffffff';
    const border = '#e2e8f0';
    const textMain = '#0f172a';
    const textMut = '#64748b';
    const inputBg = '#f8fafc';
    const rowHover = '#f8fafc';

    const [services, setServices] = useState<any[]>(() => {
        const cached = sessionStorage.getItem('admin_cache_services');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!services.length);
    const [editingService, setEditingService] = useState<any | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (editingService) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [editingService]);

    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            setServices(data);
            sessionStorage.setItem('admin_cache_services', JSON.stringify(data));
        } else if (error) {
            console.error('Error fetching services:', error);
        }
        setLoading(false);
    };

    const handleSave = async (e: any) => {
        if (e) e.preventDefault();
        const { error } = await supabase.from('services').upsert([editingService]);

        if (!error) {
            invalidateSupabaseCache('services');
            fetchServices();
            setEditingService(null);
            toast.success('Service saved successfully.');
        } else {
            alert('Error saving service: ' + error.message);
        }
    };

    const deleteService = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this service from the catalog?')) return;
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) {
            invalidateSupabaseCache('services');
            // Update sessionStorage cache
            const cached = sessionStorage.getItem('supabase_cache_services');
            if (cached) {
                const parsed = JSON.parse(cached);
                const filtered = parsed.filter((s: any) => s.id !== id);
                sessionStorage.setItem('supabase_cache_services', JSON.stringify(filtered));
            }
            setServices(services.filter(s => s.id !== id));
            toast.success('Service removed successfully.');
        } else {
            alert('Error deleting service: ' + error.message);
        }
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from('services').update({ active: !current }).eq('id', id);
        invalidateSupabaseCache('services');
        setServices(services.map(s => s.id === id ? { ...s, active: !current } : s));
    };

    return (
        <div style={{ position: 'relative' }}>
            <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: BRAND.primary, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        <Zap size={16} /> Solutions Portfolio
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: textMain, margin: 0, letterSpacing: '-1px' }}>Service <span style={{ color: BRAND.primary }}>Catalog</span></h1>
                    <p style={{ color: textMut, margin: '0.5rem 0 0', fontSize: '1.1rem' }}>Define and refine the financial loan products GrowUp FinCorp offers.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#1d3a94' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingService({ title: '', tagline: '', description: '', icon_or_image: '', image_url: '', features: [], stats: [], docs: [], active: true, accent: '#1a3a6b' })}
                    style={{
                        background: BRAND.primary, color: '#ffffff', border: 'none', padding: '1rem 2.2rem',
                        borderRadius: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '0.8rem', boxShadow: `0 4px 12px ${BRAND.primary}40`
                    }}
                >
                    <Plus size={20} strokeWidth={3} /> Register New Service
                </motion.button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: cardBg, borderRadius: '32px', border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: inputBg }}>
                                <th style={{ padding: '1.5rem', fontWeight: 800, color: textMut, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${border}` }}>Identity</th>
                                <th style={{ padding: '1.5rem', fontWeight: 800, color: textMut, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${border}` }}>Content Specs</th>
                                <th style={{ padding: '1.5rem', fontWeight: 800, color: textMut, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${border}` }}>Visibility</th>
                                <th style={{ padding: '1.5rem', fontWeight: 800, color: textMut, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `1px solid ${border}`, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ padding: '5rem', textAlign: 'center' }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>
                                        <Zap size={32} color={BRAND.primary} />
                                    </motion.div>
                                </td></tr>
                            ) : services.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: '5rem', textAlign: 'center', color: textMut, fontWeight: 600 }}>No services defined yet. Globalize your first solution!</td></tr>
                            ) : (
                                services.map((svc, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                        key={svc.id}
                                        style={{ borderBottom: `1px solid ${border}`, cursor: 'pointer', transition: '0.2s', background: cardBg }}
                                        whileHover={{ background: rowHover }}
                                        onClick={() => setEditingService(svc)}
                                    >
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${svc.accent || BRAND.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${svc.accent || BRAND.primary}30`, color: svc.accent || BRAND.primary }}>
                                                    {svc.image_url ? (
                                                        <img src={svc.image_url} alt="Icon" style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{svc.icon_or_image?.substring(0, 4) || 'SVC'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: textMain, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{svc.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: textMut }}>{svc.tagline || 'No Tagline'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: textMain, fontWeight: 600 }}>
                                                    {svc.features?.length || 0} Features
                                                </div>
                                                <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: textMain, fontWeight: 600 }}>
                                                    {svc.stats?.length || 0} Stats
                                                </div>
                                                <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: textMain, fontWeight: 600 }}>
                                                    {svc.docs?.length || 0} Docs
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleActive(svc.id, svc.active); }}
                                                style={{
                                                    background: svc.active ? '#ecfdf5' : inputBg,
                                                    color: svc.active ? '#10b981' : textMut,
                                                    border: `1px solid ${svc.active ? '#10b981' : textMut}40`,
                                                    padding: '0.5rem 1.2rem', borderRadius: '30px', fontSize: '0.75rem',
                                                    fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                                }}
                                            >
                                                {svc.active ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                                {svc.active ? 'MARKET LIVE' : 'DRAFT'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: '#f0f4ff' }}
                                                    onClick={(e) => { e.stopPropagation(); setEditingService(svc); }}
                                                    style={{ background: 'transparent', border: `1px solid ${border}`, padding: '0.75rem', borderRadius: '14px', cursor: 'pointer', color: BRAND.primary }}
                                                >
                                                    <Edit size={18} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: '#fff1f2' }}
                                                    onClick={(e) => { e.stopPropagation(); deleteService(svc.id); }}
                                                    style={{ background: 'transparent', border: `1px solid ${border}`, padding: '0.75rem', borderRadius: '14px', cursor: 'pointer', color: '#f43f5e' }}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Service Modal */}
            <AnimatePresence>
                {editingService && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditingService(null)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            style={{
                                background: cardBg,
                                padding: '3.5rem',
                                borderRadius: '40px',
                                border: `1px solid ${border}`,
                                width: '100%',
                                maxWidth: '1000px',
                                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '90vh'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '2rem', right: '2.5rem' }}>
                                <button onClick={() => setEditingService(null)} style={{ background: inputBg, border: `1px solid ${border}`, width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMut, transition: '0.2s' }}><X size={24} /></button>
                            </div>

                            <header style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: BRAND.primary, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                                    <Activity size={16} /> Solution Forge
                                </div>
                                <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: textMain, letterSpacing: '-1px' }}>
                                    {editingService.id && !editingService.id.toString().startsWith('mock-') ? 'Refine Product' : 'Register Solution'}
                                </h2>
                            </header>

                            <form onSubmit={handleSave} data-lenis-prevent style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                                {/* Base Information grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <InputGroup label="Service Title" icon={Briefcase} value={editingService.title} onChange={(v: string) => setEditingService({ ...editingService, title: v })} placeholder="E.g. Home Loans" textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                    <InputGroup label="Catchy Tagline" icon={Type} value={editingService.tagline} onChange={(v: string) => setEditingService({ ...editingService, tagline: v })} placeholder="E.g. Your Dream Home, Realized" textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                </div>

                                <InputGroup label="Full Description" icon={AlignLeft} isTextArea={true} value={editingService.description} onChange={(v: string) => setEditingService({ ...editingService, description: v })} placeholder="Detailed multi-line explanation..." textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <InputGroup label="Lucide Icon Name" icon={Activity} value={editingService.icon_or_image} onChange={(v: string) => setEditingService({ ...editingService, icon_or_image: v })} placeholder="Home, Briefcase, Car, etc." textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                    <InputGroup label="Interest Rate p.a." icon={Zap} value={editingService.rate} onChange={(v: string) => setEditingService({ ...editingService, rate: v })} placeholder="E.g. 8.50%" textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <InputGroup label="Background Image URL" icon={ImageIcon} value={editingService.image_url} onChange={(v: string) => setEditingService({ ...editingService, image_url: v })} placeholder="https://unsplash.com/..." textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                    <InputGroup label="Brand Palette (Accent)" icon={Palette} value={editingService.accent} onChange={(v: string) => setEditingService({ ...editingService, accent: v })} placeholder="#1e40af" textMut={textMut} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} />
                                </div>

                                <hr style={{ border: 0, height: '1px', background: border, margin: '1rem 0' }} />

                                {/* Dynamic Arrays */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                    <ArrayInputGroup label="Key Features" icon={List} items={editingService.features} onChange={(v: string[]) => setEditingService({ ...editingService, features: v })} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} textMut={textMut} />
                                    <ArrayInputGroup label="Required Documents" icon={FileText} items={editingService.docs} onChange={(v: string[]) => setEditingService({ ...editingService, docs: v })} BRAND={BRAND} border={border} inputBg={inputBg} textMain={textMain} textMut={textMut} />
                                </div>

                                <hr style={{ border: 0, height: '1px', background: border, margin: '1rem 0' }} />

                                <StatsInputGroup label="Important Statistics (e.g. Rates, Max Amounts)" items={editingService.stats} onChange={(v: any[]) => setEditingService({ ...editingService, stats: v })} border={border} inputBg={inputBg} textMain={textMain} textMut={textMut} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '2rem', background: inputBg, borderRadius: '24px', border: `1px solid ${border}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: textMut, textTransform: 'uppercase', letterSpacing: '1px' }}>AVAILABILITY</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.3rem', color: textMain }}>Market Visibility</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEditingService({ ...editingService, active: !editingService.active })}
                                            style={{
                                                background: editingService.active ? '#ecfdf5' : cardBg,
                                                color: editingService.active ? '#10b981' : textMut,
                                                border: `1px solid ${editingService.active ? '#10b981' : textMut}40`,
                                                padding: '0.8rem 1.4rem',
                                                borderRadius: '16px', fontWeight: 800, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '0.6rem', transition: '0.3s'
                                            }}
                                        >
                                            {editingService.active ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            {editingService.active ? 'ACTIVE' : 'DRAFT'}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <button type="button" onClick={() => setEditingService(null)} style={{ padding: '0.8rem 1.8rem', borderRadius: '16px', border: 'none', background: 'transparent', color: textMut, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Discard</button>
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: '#1d3a94' }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 3rem',
                                                background: BRAND.primary, color: '#ffffff', border: 'none', borderRadius: '18px',
                                                fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 12px ${BRAND.primary}40`
                                            }}
                                        >
                                            <Save size={18} /> Deploy Service
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
}
