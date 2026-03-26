import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

// ── Brand palette matching main website ──────────────────────────
export const BRAND = {
    primary: '#1a3a6b',
    secondary: '#00F5FF',
    accent: '#2ec4b6',
    bg: '#f8fafc',
    sidebar: '#1a3a6b',
    sidebarHover: 'rgba(59,130,246,0.12)',
    sidebarActive: 'rgba(59,130,246,0.18)',
    border: '#e2e8f0',
    text: '#0f172a',
    muted: '#64748b',
    white: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
};

interface Notification { id: string; type: string; message: string; is_read: boolean; created_at: string; }
interface AdminCtx {
    notifications: Notification[];
    unreadCount: number;
    markAllRead: () => void;
    markRead: (id: string) => void;
    t: typeof BRAND;
    profile: { name: string; photo: string; email: string };
    updateProfile: (p: { name: string; photo: string; email: string }) => void;
}

const AdminContext = createContext<AdminCtx | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [profile, setProfile] = useState({
        name: 'Admin',
        photo: '',
        email: localStorage.getItem('admin_email') || ''
    });

    const t = BRAND;

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(20);
                if (data?.length) setNotifications(data);
                else throw new Error('empty');
            } catch {
                setNotifications([]);
            }
        };
        load();

        const sub = supabase.channel('admin_notifs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, payload => {
                setNotifications(prev => [payload.new as Notification, ...prev]);
            }).subscribe();
        return () => { sub.unsubscribe(); };
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        try { await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false); } catch { }
    };

    const markRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        try { await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id); } catch { }
    };

    const updateProfile = (p: { name: string; photo: string; email: string }) => {
        setProfile(p);
        localStorage.setItem('admin_email', p.email);
    };

    return (
        <AdminContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, t, profile, updateProfile }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
    return ctx;
}
