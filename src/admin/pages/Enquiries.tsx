import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Eye, X, Phone, Mail, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';
import { formatDate } from '../../utils/timeUtils';

const STATUSES = ['All', 'New', 'Contacted', 'Pending', 'Completed'];
const STATUS = { New: { bg: '#dbeafe', text: '#1e40af' }, Contacted: { bg: '#dcfce7', text: '#15803d' }, Pending: { bg: '#fef3c7', text: '#92400e' }, Completed: { bg: '#ede9fe', text: '#6d28d9' } };

export default function Enquiries() {
    const card = '#fff';
    const border = BRAND.border;
    const text = BRAND.text;
    const muted = BRAND.muted;

    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selected, setSelected] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
                setEnquiries(data || []);
            } catch { setEnquiries([]); }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        let r = enquiries;
        if (statusFilter !== 'All') r = r.filter(e => e.status === statusFilter);
        if (search) { const q = search.toLowerCase(); r = r.filter(e => (e.name || '').toLowerCase().includes(q) || (e.phone || '').includes(q) || (e.email || '').toLowerCase().includes(q)); }
        setFiltered(r);
    }, [enquiries, search, statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
        if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
        try { await supabase.from('enquiries').update({ status }).eq('id', id); } catch { }
    };

    const deleteEnquiry = async (id: string) => {
        setEnquiries(prev => prev.filter(e => e.id !== id));
        setSelected(null);
        try { await supabase.from('enquiries').delete().eq('id', id); } catch { }
    };

    const inputStyle: React.CSSProperties = { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: text };
    const pillBtn = (active: boolean) => ({ padding: '0.45rem 0.9rem', borderRadius: '8px', border: `1px solid ${active ? BRAND.primary : border}`, background: active ? `${BRAND.primary}12` : card, color: active ? BRAND.primary : muted, fontSize: '0.8rem', fontWeight: active ? 700 : 500, cursor: 'pointer', transition: '0.15s' });

    return (
        <div>
            <div style={{ marginBottom: '1.8rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>CRM & LEADS</div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: text, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Enquiry Management</h1>
                <p style={{ color: muted, fontSize: '0.85rem', margin: '0.3rem 0 0' }}>{filtered.length} enquiries</p>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: card, border: `1px solid ${border}`, padding: '0.5rem 1rem', borderRadius: '10px', flex: 1, minWidth: '200px' }}>
                    <Search size={15} color={muted} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, email..." style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {STATUSES.map(s => <button key={s} onClick={() => setStatusFilter(s)} style={pillBtn(statusFilter === s)}>{s}</button>)}
                </div>
            </div>

            <div style={{ background: card, borderRadius: '14px', border: `1px solid ${border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {/* Desktop Table View */}
                <div style={{ overflowX: 'auto', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${border}`, background: '#f8fafc' }}>
                                {['Name', 'Phone', 'Email', 'Loan Type', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: muted }}>Loading...</td></tr>
                                : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: muted }}>No enquiries found.</td></tr>
                                    : filtered.map((eq, idx) => (
                                        <motion.tr key={eq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                                            style={{ borderBottom: `1px solid ${border}` }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '0.85rem 1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${BRAND.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: BRAND.primary, flexShrink: 0 }}>
                                                        {(eq.name || 'N')[0].toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: text }}>{eq.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.83rem', color: muted }}>{eq.phone || '—'}</td>
                                            <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.83rem', color: muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.email || '—'}</td>
                                            <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.83rem', color: muted }}>{eq.loan_type || '—'}</td>
                                            <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.8rem', color: muted, whiteSpace: 'nowrap' }}>{formatDate(eq.created_at)}</td>
                                            <td style={{ padding: '0.85rem 1.2rem' }}>
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <select value={eq.status || 'New'} onChange={e => updateStatus(eq.id, e.target.value)}
                                                        style={{ padding: '3px 22px 3px 8px', borderRadius: '20px', border: 'none', background: (STATUS as any)[eq.status]?.bg || '#f1f5f9', color: (STATUS as any)[eq.status]?.text || '#374151', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', appearance: 'none', outline: 'none' }}>
                                                        {['New', 'Contacted', 'Pending', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <ChevronDown size={11} style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: (STATUS as any)[eq.status]?.text }} />
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.2rem' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button onClick={() => setSelected(eq)} style={{ width: 30, height: 30, borderRadius: '7px', background: `${BRAND.primary}12`, border: 'none', color: BRAND.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14} /></button>
                                                    <button onClick={() => deleteEnquiry(eq.id)} style={{ width: 30, height: 30, borderRadius: '7px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div style={{ display: window.innerWidth < 768 ? 'block' : 'none', padding: '1rem' }}>
                    {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: muted }}>Loading...</div>
                        : filtered.length === 0 ? <div style={{ padding: '2rem', textAlign: 'center', color: muted }}>No enquiries found.</div>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filtered.map((eq) => (
                                    <div key={eq.id} style={{ padding: '1.25rem', borderRadius: '12px', background: '#f8fafc', border: `1px solid ${border}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${BRAND.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: BRAND.primary }}>
                                                    {(eq.name || 'N')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: text }}>{eq.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: muted }}>{formatDate(eq.created_at)}</div>
                                                </div>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <select value={eq.status || 'New'} onChange={e => updateStatus(eq.id, e.target.value)}
                                                    style={{ padding: '4px 24px 4px 10px', borderRadius: '20px', border: 'none', background: (STATUS as any)[eq.status]?.bg || '#f1f5f9', color: (STATUS as any)[eq.status]?.text || '#374151', fontSize: '0.75rem', fontWeight: 700, appearance: 'none' }}>
                                                    {['New', 'Contacted', 'Pending', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: (STATUS as any)[eq.status]?.text }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: '2px' }}>Loan Type</div>
                                                <div style={{ fontSize: '0.85rem', color: text, fontWeight: 500 }}>{eq.loan_type}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: muted, textTransform: 'uppercase', marginBottom: '2px' }}>Phone</div>
                                                <div style={{ fontSize: '0.85rem', color: text, fontWeight: 500 }}>{eq.phone}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
                                            <button onClick={() => setSelected(eq)} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: `${BRAND.primary}10`, border: 'none', color: BRAND.primary, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Eye size={14} /> Details
                                            </button>
                                            <button onClick={() => deleteEnquiry(eq.id)} style={{ width: 40, height: 40, borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,32,80,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}
                        onClick={e => e.target === e.currentTarget && setSelected(null)}>
                        <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
                            style={{ background: card, borderRadius: '18px', width: '100%', maxWidth: '500px', border: `1px solid ${border}`, boxShadow: '0 40px 80px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.4rem 1.5rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: text }}>Enquiry Details</h2>
                                    <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: muted }}>{formatDate(selected.created_at)}</p>
                                </div>
                                <button onClick={() => setSelected(null)} style={{ background: '#e2e8f0', border: 'none', borderRadius: '7px', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
                                    <X size={14} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ width: 50, height: 50, borderRadius: '12px', background: `${BRAND.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: BRAND.primary, marginBottom: '1rem' }}>
                                    {(selected.name || 'N')[0].toUpperCase()}
                                </div>
                                <h3 style={{ margin: '0 0 1.2rem', fontSize: '1.2rem', fontWeight: 800, color: text }}>{selected.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {[{ icon: Phone, label: 'Phone', val: selected.phone }, { icon: Mail, label: 'Email', val: selected.email }, { icon: Calendar, label: 'Date', val: formatDate(selected.created_at) }, { icon: MessageSquare, label: 'Message', val: selected.message }].filter(f => f.val).map(f => (
                                        <div key={f.label} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#f8fafc', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <f.icon size={14} color={muted} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{f.label}</div>
                                                <div style={{ fontSize: '0.875rem', color: text, marginTop: '0.1rem', lineHeight: 1.5 }}>{f.val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.4rem' }}>
                                    <select value={selected.status || 'New'} onChange={e => updateStatus(selected.id, e.target.value)}
                                        style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '9px', border: `1px solid ${border}`, background: '#f8fafc', color: text, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                                        {['New', 'Contacted', 'Pending', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button onClick={() => deleteEnquiry(selected.id)} style={{ padding: '0.65rem 1rem', borderRadius: '9px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
