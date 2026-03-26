import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// Fixed social media floating buttons on the right side of the screen
const FloatingSocial = () => {
    const [settings, setSettings] = useState({
        whatsapp: '9924542956',
        facebook: 'https://facebook.com',
        instagram: 'https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ=='
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (!error && data && data.length > 0) {
                    let loaded: any = {};
                    data.forEach((row: any) => {
                        loaded[row.key] = row.value;
                    });
                    setSettings(prev => ({ ...prev, ...loaded }));
                }
            } catch (err) {
                console.error("Failed to fetch settings for social buttons");
            }
        }
        fetchSettings();
    }, []);

    // Ensure WhatsApp number is formatted correctly (remove spaces, symbols)
    const cleanWaNum = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '9924542956';
    const finalWaNum = cleanWaNum.startsWith('91') ? cleanWaNum : `91${cleanWaNum}`;

    const FLOAT_BUTTONS = [
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            tooltip: 'Chat on WhatsApp',
            href: `https://wa.me/${finalWaNum}?text=Hello%20GrowUp%20Fincorp%2C%20I%20am%20interested%20in%20a%20loan.`,
            background: '#25D366',
            hoverBg: '#128C7E',
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            )
        },
        {
            id: 'instagram',
            label: 'Instagram',
            tooltip: 'Follow on Instagram',
            href: settings.instagram || 'https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ==',
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            hoverBg: '#bc1888',
            icon: (
                <svg viewBox="0 0 32 32" width="24" height="24" fill="#fff">
                    <path d="M16 0C11.648 0 11.1 0.02 9.4 0.1 7.7 0.18 6.534 0.46 5.52 0.87c-1.05.408-1.94.956-2.826 1.844C1.806 3.6 1.258 4.49.85 5.54.44 6.555.158 7.72.078 9.42.018 11.12 0 11.67 0 16c0 4.33.018 4.88.078 6.58.08 1.7.362 2.865.772 3.88.408 1.05.956 1.94 1.844 2.826.886.888 1.776 1.436 2.826 1.844 1.015.41 2.18.692 3.88.772C11.1 31.982 11.648 32 16 32c4.352 0 4.9-.018 6.6-.098 1.7-.08 2.865-.362 3.88-.772 1.05-.408 1.94-.956 2.826-1.844.888-.886 1.436-1.776 1.844-2.826.41-1.015.692-2.18.772-3.88.06-1.7.078-2.25.078-6.58 0-4.33-.018-4.88-.078-6.58-.08-1.7-.362-2.866-.772-3.88-.408-1.05-.956-1.94-1.844-2.826C28.44 1.806 27.55 1.258 26.5.85 25.485.44 24.32.158 22.62.078 20.9.018 20.352 0 16 0zm0 2.88c4.273 0 4.782.016 6.474.094 1.562.072 2.41.334 2.972.554.747.29 1.28.637 1.84 1.196.56.56.906 1.093 1.196 1.84.22.562.482 1.41.554 2.972.078 1.692.094 2.2.094 6.474 0 4.273-.016 4.782-.094 6.474-.072 1.562-.334 2.41-.554 2.972-.29.747-.637 1.28-1.196 1.84-.56.56-1.093.906-1.84 1.196-.562.22-1.41.482-2.972.554-1.692.078-2.2.094-6.474.094-4.273 0-4.782-.016-6.474-.094-1.562-.072-2.41-.334-2.972-.554-.747-.29-1.28-.637-1.84-1.196-.56-.56-.906-1.093-1.196-1.84-.22-.562-.482-1.41-.554-2.972C2.896 20.782 2.88 20.273 2.88 16c0-4.273.016-4.782.094-6.474.072-1.562.334-2.41.554-2.972.29-.747.637-1.28 1.196-1.84.56-.56 1.093-.906 1.84-1.196.562-.22 1.41-.482 2.972-.554C11.218 2.896 11.727 2.88 16 2.88zM16 8a8 8 0 1 0 0 16A8 8 0 0 0 16 8zm0 13.2a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4zM25.28 7.6a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                </svg>
            )
        },
        {
            id: 'facebook',
            label: 'Facebook',
            tooltip: 'Like us on Facebook',
            href: settings.facebook || 'https://facebook.com/growupfincorp',
            background: '#1877f2',
            hoverBg: '#0a56ce',
            icon: (
                <svg viewBox="0 0 32 32" width="24" height="24" fill="#fff">
                    <path d="M29 0H3C1.344 0 0 1.344 0 3v26c0 1.656 1.344 3 3 3h13.968V19.656h-3.8V15.2h3.8v-3.312c0-3.768 2.3-5.82 5.664-5.82 1.61 0 2.994.12 3.4.174V10.2l-2.33.001c-1.83 0-2.184.87-2.184 2.146V15.2h4.37l-.57 4.456h-3.8V32H29c1.656 0 3-1.344 3-3V3c0-1.656-1.344-3-3-3z" />
                </svg>
            )
        }
    ];

    return (
        <div
            style={{
                position: 'fixed',
                right: 0,
                bottom: '30px', /* Moved more down */
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
            }}
        >
            {FLOAT_BUTTONS.map((btn, idx) => (
                <div key={btn.id} style={{ position: 'relative' }} className={`float-btn-wrapper float-btn-${btn.id}`}>
                    <motion.a
                        href={btn.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={btn.label}
                        initial={{ x: 80 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 120 }}
                        whileHover={{ x: -4, scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '52px',
                            height: '52px',
                            background: typeof btn.background === 'string' && btn.background.startsWith('linear') ? btn.background : btn.background,
                            borderRadius: idx === 0 ? '12px 0 0 0' : idx === FLOAT_BUTTONS.length - 1 ? '0 0 0 12px' : '0',
                            textDecoration: 'none',
                            boxShadow: '-4px 4px 20px rgba(0,0,0,0.25)',
                            borderBottom: idx < FLOAT_BUTTONS.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                        }}
                    >
                        {btn.icon}
                    </motion.a>
                    {/* Tooltip on hover */}
                    <style>{`
                        .float-btn-${btn.id}:hover .float-tooltip-${btn.id} {
                            opacity: 1 !important;
                            transform: translate(-100%, -50%) translateX(-10px) !important;
                        }
                        .float-tooltip-${btn.id} {
                            opacity: 0;
                            transition: opacity 0.2s, transform 0.2s;
                            transform: translate(-100%, -50%) translateX(0px);
                        }
                    `}</style>
                    <div
                        className={`float-tooltip-${btn.id}`}
                        style={{
                            position: 'absolute',
                            right: '52px',
                            top: '50%',
                            background: 'rgba(15,23,42,0.9)',
                            color: '#fff',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        }}
                    >
                        {btn.tooltip}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloatingSocial;
