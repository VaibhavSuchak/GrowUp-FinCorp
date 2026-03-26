import { motion } from 'framer-motion';

interface PageHeroProps {
    title: string;
    subtitle: string;
    badge?: string;
    bgImage?: string;
}

export default function PageHero({ title, subtitle, badge, bgImage }: PageHeroProps) {
    return (
        <section style={{
            padding: 'clamp(8rem, 15vw, 12rem) 0 clamp(4rem, 8vw, 6rem)',
            background: bgImage
                ? `linear-gradient(135deg, rgba(26,58,107,0.85) 0%, rgba(15,23,42,0.95) 100%), url(${bgImage}) center/cover no-repeat`
                : 'linear-gradient(135deg, #1a3a6b 0%, #0f172a 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {badge && (
                        <div style={{
                            display: 'inline-block',
                            padding: '0.4rem 1.2rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '100px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '1.5rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#2ec4b6'
                        }}>
                            {badge}
                        </div>
                    )}

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        letterSpacing: '-1px',
                        fontFamily: "'Outfit', sans-serif",
                        marginBottom: '1.5rem',
                    }}>
                        {title}
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        margin: '0 auto',
                        fontWeight: 400
                    }}>
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
