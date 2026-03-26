import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { invalidateSupabaseCache } from '../../hooks/useSupabaseQuery';
import { BRAND } from '../AdminContext';
import { formatDate } from '../../utils/timeUtils';

// Normalize a review object from any source into a consistent shape
function normalizeReview(r: any) {
    return {
        id: r.id,
        customer_name: r.customer_name || r.name || 'Anonymous',
        rating: r.rating || 5,
        review_text: r.review_text || r.comment || r.message || '',
        loan_type: r.loan_type || r.service || r.loanType || '',
        approved: r.approved ?? false,
        created_at: r.created_at || new Date().toISOString(),
    };
}

export default function ReviewsManager() {
    const card = '#fff';
    const border = BRAND.border;
    const text = BRAND.text;
    const muted = BRAND.muted;

    const [reviews, setReviews] = useState<any[]>(() => {
        const cached = sessionStorage.getItem('admin_cache_reviews');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!reviews.length);
    const [search, setSearch] = useState('');

    const loadReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error) {
                const normalized = (data || []).map(normalizeReview);
                setReviews(normalized);
                if (normalized.length > 0) {
                    sessionStorage.setItem('admin_cache_reviews', JSON.stringify(normalized));
                } else {
                    sessionStorage.removeItem('admin_cache_reviews');
                }
            }
        } catch (err) {
            console.error('Error loading reviews:', err);
        }
        setLoading(false);
    };

    const toggleApprove = async (id: string, currentlyApproved: boolean) => {
        try {
            const { error } = await supabase.from('reviews').update({ approved: !currentlyApproved }).eq('id', id);
            if (!error) {
                setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !currentlyApproved } : r));
                invalidateSupabaseCache('reviews');
            }
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

    const deleteReview = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', id);
            if (!error) {
                setReviews(prev => prev.filter(r => r.id !== id));
                invalidateSupabaseCache('reviews');
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const clearAllReviews = async () => {
        if (!window.confirm('WARNING: This will permanently delete ALL reviews. Are you sure?')) return;
        try {
            const { error } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (!error) {
                setReviews([]);
                invalidateSupabaseCache('reviews');
                sessionStorage.removeItem('admin_cache_reviews');
            }
        } catch (err) {
            console.error('Clear error:', err);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const filtered = reviews.filter(r => {
        if (search && !r.customer_name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const approvedCount = reviews.filter(r => r.approved).length;
    const pendingCount = reviews.length - approvedCount;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div>
            <div style={{ marginBottom: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>CONTENT</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: text, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Testimonials & Reviews</h1>
                    <p style={{ color: muted, fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
                        {reviews.length === 0 ? 'No reviews submitted yet.' : `${approvedCount} approved · ${pendingCount} pending approval`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={clearAllReviews}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', borderRadius: '9px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Trash2 size={14} /> Clear All
                    </button>
                    <button onClick={() => loadReviews()} disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', borderRadius: '9px', border: `1px solid ${border}`, background: card, color: muted, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Reviews', val: reviews.length, color: BRAND.primary, suffix: '' },
                    { label: 'Avg Rating', val: avgRating, color: '#f59e0b', suffix: ' / 5.0' }
                ].map(s => (
                    <div key={s.label} style={{ background: card, borderRadius: '12px', padding: '1rem 1.2rem', border: `1px solid ${border}`, borderTop: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: "'Outfit', sans-serif" }}>
                            {s.val}<span style={{ fontSize: '1rem', opacity: 0.7, fontWeight: 600 }}>{s.suffix}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: muted, fontWeight: 500 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: card, border: `1px solid ${border}`, padding: '0.5rem 0.9rem', borderRadius: '10px' }}>
                    <Search size={15} color={muted} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: text, width: '180px' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: muted, padding: '3rem' }}>Loading reviews...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: muted, padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: text, marginBottom: '0.3rem' }}>
                            {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filter'}
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                            {reviews.length === 0
                                ? 'Reviews submitted from the website will appear here.'
                                : 'Try changing the tab or search term.'}
                        </div>
                    </div>
                ) : (
                    filtered.map((rv, idx) => (
                        <motion.div key={rv.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            style={{ background: card, borderRadius: '14px', padding: '1.3rem', border: `1px solid ${border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '9px', background: `${BRAND.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.88rem', color: BRAND.primary, flexShrink: 0 }}>
                                        {rv.customer_name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: text }}>{rv.customer_name}</div>
                                        <div style={{ fontSize: '0.7rem', color: muted }}>{rv.loan_type && <span style={{ color: BRAND.primary, fontWeight: 600 }}>{rv.loan_type} · </span>}{formatDate(rv.created_at)}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: rv.approved ? '#dcfce7' : '#fef3c7', color: rv.approved ? '#15803d' : '#92400e' }}>
                                        {rv.approved ? '✓ Live' : '⏳ Pending'}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <button
                                            onClick={() => toggleApprove(rv.id, rv.approved)}
                                            title={rv.approved ? "Set to Pending" : "Approve Review"}
                                            style={{
                                                width: 30, height: 30, borderRadius: '7px',
                                                background: rv.approved ? '#dcfce7' : '#f8fafc',
                                                border: `1px solid ${rv.approved ? '#bbf7d0' : '#e2e8f0'}`,
                                                color: rv.approved ? '#15803d' : muted, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteReview(rv.id)}
                                            title="Delete Review"
                                            style={{
                                                width: 30, height: 30, borderRadius: '7px', background: '#fef2f2',
                                                border: 'none', color: '#ef4444', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '0.7rem' }}>
                                {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= rv.rating ? '#f59e0b' : '#e2e8f0', fontSize: '1rem' }}>★</span>)}
                                <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: muted }}>{rv.rating}.0</span>
                            </div>
                            <p style={{ fontSize: '0.83rem', color: muted, lineHeight: 1.6, margin: '0' }}>{rv.review_text}</p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
