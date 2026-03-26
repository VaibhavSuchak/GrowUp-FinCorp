import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Clock, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';
import { formatTimeAgo } from '../../utils/timeUtils';
import { Link } from 'react-router-dom';

const getFreshDailyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
            date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            fullDate: d.toISOString().split('T')[0],
            enquiries: 0
        });
    }
    return data;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    New: { bg: '#dbeafe', text: '#1e40af' }, Contacted: { bg: '#dcfce7', text: '#15803d' },
    Pending: { bg: '#fef3c7', text: '#92400e' }, Completed: { bg: '#ede9fe', text: '#6d28d9' },
};

export default function Dashboard() {
    const card = '#ffffff';
    const border = BRAND.border;
    const text = BRAND.text;
    const muted = BRAND.muted;

    const [adminName, setAdminName] = useState('Admin');
    const [stats, setStats] = useState({ totalEnquiries: 0, totalReviews: 0, pendingEnquiries: 0 });
    const [trends, setTrends] = useState({ enquiriesChange: '+0%', enquiriesUp: true, reviewsChange: '+0%', reviewsUp: true, pendingChange: '0%', pendingUp: true });
    const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [dailyData, setDailyData] = useState(getFreshDailyData());

    useEffect(() => {
        const load = async () => {
            try {
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
                const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

                const { data: { session } } = await supabase.auth.getSession();
                if (session && session.user) {
                    setAdminName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin');
                } else if (localStorage.getItem('admin_login')) {
                    setAdminName('Admin');
                }

                const [eqAll, eq, rv, eqCurrent30, eqPrev30, rvCurrent30, rvPrev30] = await Promise.all([
                    supabase.from('enquiries').select('created_at').gte('created_at', thirtyDaysAgo),
                    supabase.from('enquiries').select('id, name, phone, status, created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
                    supabase.from('reviews').select('id, customer_name, rating, review_text, approved, created_at', { count: 'exact' }).order('created_at', { ascending: false }).limit(4),
                    supabase.from('enquiries').select('id', { count: 'exact' }).gte('created_at', thirtyDaysAgo),
                    supabase.from('enquiries').select('id', { count: 'exact' }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
                    supabase.from('reviews').select('id', { count: 'exact' }).gte('created_at', thirtyDaysAgo),
                    supabase.from('reviews').select('id', { count: 'exact' }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
                ]);

                // Update Daily Data
                if (eqAll.data) {
                    const counts: Record<string, number> = {};
                    eqAll.data.forEach(item => {
                        const d = item.created_at.split('T')[0];
                        counts[d] = (counts[d] || 0) + 1;
                    });
                    setDailyData(prev => prev.map(day => ({
                        ...day,
                        enquiries: counts[day.fullDate] || 0
                    })));
                }

                const pending = eq.data?.filter(e => e.status === 'New' || e.status === 'Pending').length || 0;
                setStats({ totalEnquiries: eq.count || 0, totalReviews: rv.count || 0, pendingEnquiries: pending });

                const calcTrend = (curr: number, prev: number) => {
                    if (prev === 0 && curr === 0) return { change: '0%', up: true };
                    if (prev === 0) return { change: '+100%', up: true };
                    const diff = curr - prev;
                    const percent = (diff / prev) * 100;
                    return {
                        change: `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`,
                        up: percent >= 0
                    };
                };

                const eqTrend = calcTrend(eqCurrent30.count || 0, eqPrev30.count || 0);
                const rvTrend = calcTrend(rvCurrent30.count || 0, rvPrev30.count || 0);

                setTrends({
                    enquiriesChange: eqTrend.change, enquiriesUp: eqTrend.up,
                    reviewsChange: rvTrend.change, reviewsUp: rvTrend.up,
                    pendingChange: '-', pendingUp: true
                });

                setRecentEnquiries(eq.data || []);
                setRecentReviews(rv.data || []);
            } catch {
                setStats({ totalEnquiries: 0, totalReviews: 0, pendingEnquiries: 0 });
                setRecentEnquiries([]);
                setRecentReviews([]);
            }
        };
        load();
    }, []);

    const STAT_CARDS = [
        { label: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, change: trends.enquiriesChange, up: trends.enquiriesUp, color: BRAND.primary, link: '/admin/enquiries' },
        { label: 'Total Reviews', value: stats.totalReviews, icon: Star, change: trends.reviewsChange, up: trends.reviewsUp, color: '#f59e0b', link: '/admin/reviews' },
        { label: 'Pending Enquiries', value: stats.pendingEnquiries, icon: Clock, change: trends.pendingChange, up: trends.pendingUp, color: '#ef4444', link: '/admin/enquiries' },
    ];

    const tooltipStyle = { background: '#fff', border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: '0.8rem' };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.35rem' }}>GROWUP FINCORP</div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: text, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Welcome back, {adminName}!</h1>
                <p style={{ color: muted, fontSize: '0.88rem', margin: '0.3rem 0 0' }}>Here's what's happening with your platform today.</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                {STAT_CARDS.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Link to={s.link} style={{ textDecoration: 'none' }}>
                            <div style={{ background: card, borderRadius: '14px', padding: '1.4rem', border: `1px solid ${border}`, cursor: 'pointer', transition: '0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(30,64,175,0.1)`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '11px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <s.icon size={20} color={s.color} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.up ? BRAND.success : '#ef4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.change}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: text, lineHeight: 1, marginBottom: '0.3rem', fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
                                <div style={{ fontSize: '0.82rem', color: muted, fontWeight: 500 }}>{s.label}</div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Middle Row: Recent Enquiries + Recent Reviews (Moved Above Graph) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                {/* Recent Enquiries */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ background: card, borderRadius: '14px', padding: '1.5rem', border: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: text }}>Recent Enquiries</h3>
                        <Link to="/admin/enquiries" style={{ fontSize: '0.78rem', color: BRAND.secondary, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {recentEnquiries.map(eq => (
                            <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.65rem 0.8rem', borderRadius: '10px', background: '#f8fafc' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${BRAND.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: BRAND.primary, flexShrink: 0 }}>
                                    {(eq.name || 'N')[0].toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: muted }}>{eq.phone} · {formatTimeAgo(eq.created_at)}</div>
                                </div>
                                <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: STATUS_COLORS[eq.status]?.bg || '#f1f5f9', color: STATUS_COLORS[eq.status]?.text || '#374151', flexShrink: 0 }}>
                                    {eq.status || 'New'}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Reviews */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ background: card, borderRadius: '14px', padding: '1.5rem', border: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: text }}>Recent Reviews</h3>
                        <Link to="/admin/reviews" style={{ fontSize: '0.78rem', color: BRAND.secondary, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {recentReviews.map(rv => (
                            <div key={rv.id} style={{ padding: '0.75rem 0.8rem', borderRadius: '10px', background: '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: text }}>{rv.customer_name || rv.name}</div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: rv.approved ? '#dcfce7' : '#fef3c7', color: rv.approved ? '#15803d' : '#92400e' }}>
                                        {rv.approved ? '✓ Live' : '⏳ Pending'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 2, marginBottom: '0.3rem' }}>
                                    {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= (rv.rating || 5) ? '#f59e0b' : '#e2e8f0', fontSize: '0.85rem' }}>★</span>)}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rv.review_text || rv.message}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row: Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ background: card, borderRadius: '14px', padding: '1.5rem', border: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: text }}>Daily Enquiry Trends</h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: muted }}>Last 30 days active enquiries</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', fontWeight: 600, color: muted }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: BRAND.primary, display: 'inline-block' }} /> Enquiries</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={dailyData} barSize={12} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} axisLine={false} tickLine={false} interval={2} />
                            <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(30,64,175,0.04)' }} />
                            <Bar dataKey="enquiries" fill={BRAND.primary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}

