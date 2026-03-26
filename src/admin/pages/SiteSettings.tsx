import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, Save, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { BRAND } from '../AdminContext';

const DEFAULTS = {
    phone: '+91 99245 42956', email: 'growupfincorp@gmail.com',
    address: 'Rajkot, Gujarat - 360001',
    whatsapp: '9924542956',
    facebook: 'https://facebook.com/growupfincorp',
    instagram: 'https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ==',
};

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => {
    const card = '#fff';
    const border = BRAND.border;
    const text = BRAND.text;

    return (
        <div style={{ background: card, borderRadius: '14px', border: `1px solid ${border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: '1.4rem' }}>
            <div style={{ padding: '1.1rem 1.4rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '0.7rem', background: '#f8fafc' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${BRAND.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={BRAND.primary} />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: text }}>{title}</h3>
            </div>
            <div style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {children}
            </div>
        </div>
    );
};

const Field = ({ label, value, onChange, type = 'text', ph = '', icon }: { label: string; value: string; onChange: (val: string) => void; type?: string; ph?: string; icon?: any }) => {
    const border = BRAND.border;
    const muted = BRAND.muted;
    const bg = '#f8fafc';
    const text = BRAND.text;

    const inputStyle: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.9rem 0.7rem 2.5rem',
        borderRadius: '10px', border: `1.5px solid ${border}`,
        background: bg, color: text, fontSize: '0.875rem', outline: 'none',
        fontFamily: "'Inter', sans-serif", transition: 'border-color 0.18s',
    };

    return (
        <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: muted }}>
                    {icon}
                </div>
                <input type={type} value={value} placeholder={ph} onChange={e => onChange(e.target.value)}
                    style={inputStyle} onFocus={e => e.target.style.borderColor = BRAND.primary} onBlur={e => e.target.style.borderColor = border} />
            </div>
        </div>
    );
};

export default function SiteSettings() {
    const text = BRAND.text;
    const muted = BRAND.muted;

    const [settings, setSettings] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (error) throw error;
                if (data?.length) {
                    const obj: any = {};
                    data.forEach((r: any) => { obj[r.key] = r.value; });
                    setSettings(prev => ({ ...prev, ...obj }));
                }
            } catch (err: any) {
                console.error('Fetch Error:', err);
                setMsg({ type: 'error', text: 'Error fetching settings: ' + err.message });
            }
            setLoading(false);
        })();
    }, []);

    const saveSettings = async () => {
        setSaving(true);
        setMsg(null);
        try {
            const { error } = await supabase.from('site_settings').upsert(
                Object.entries(settings).map(([key, value]) => ({ key, value: String(value) })),
                { onConflict: 'key' }
            );

            if (error) throw error;

            setMsg({ type: 'success', text: 'Settings saved successfully and are now live.' });
            setSaved(true);
        } catch (err: any) {
            console.error('Save Error:', err);
            setMsg({ type: 'error', text: 'Failed to save: ' + (err.message || 'Check database permissions') });
        }
        setSaving(false);
        setTimeout(() => { setSaved(false); setMsg(null); }, 4000);
    };


    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: muted }}>Loading settings...</div>;

    return (
        <div>
            <div style={{ marginBottom: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>SETTINGS</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: text, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Site Settings</h1>
                    <p style={{ color: muted, fontSize: '0.85rem', margin: '0.3rem 0 0' }}>Manage website content and admin profile.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {msg && (
                        <div style={{ padding: '0.7rem 1rem', borderRadius: '8px', background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#166534' : '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>
                            {msg.text}
                        </div>
                    )}
                    <motion.button onClick={saveSettings} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.2rem', borderRadius: '10px', border: 'none', background: saved ? BRAND.success : BRAND.primary, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: `0 4px 14px ${saved ? BRAND.success : BRAND.primary}35`, transition: 'background 0.3s' }}>
                        {saved ? <><CheckCircle size={16} /> Saved!</> : saving ? 'Saving...' : <><Save size={16} /> Save Settings</>}
                    </motion.button>
                </div>
            </div>


            <Section icon={Phone} title="Contact Information">
                <Field label="Phone Number" icon={<Phone size={16} />} value={settings.phone} onChange={val => setSettings(s => ({ ...s, phone: val }))} />
                <Field label="Email Address" icon={<Mail size={16} />} value={settings.email} onChange={val => setSettings(s => ({ ...s, email: val }))} />
                <div style={{ gridColumn: '1/-1' }}>
                    <Field label="Office Address" icon={<Globe size={16} />} value={settings.address} onChange={val => setSettings(s => ({ ...s, address: val }))} />
                </div>
            </Section>

            <Section icon={Globe} title="Social Media">
                <Field label="WhatsApp Number (e.g. 9924542956)" icon={<Phone size={16} />} value={settings.whatsapp} onChange={val => setSettings(s => ({ ...s, whatsapp: val }))} ph="9924542956" />
                <Field label="Facebook Page" icon={<Globe size={16} />} value={settings.facebook} onChange={val => setSettings(s => ({ ...s, facebook: val }))} ph="https://facebook.com/your-page" />
                <Field label="Instagram Profile" icon={<Globe size={16} />} value={settings.instagram} onChange={val => setSettings(s => ({ ...s, instagram: val }))} ph="https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ==" />
            </Section>
        </div>
    );
}
