import { FC } from 'react';

interface LogoProps {
    height?: number;
    className?: string;
    dark?: boolean;
    hideText?: boolean;
}

const BankMark: FC<{ size: number; dark?: boolean }> = ({ size, dark }) => {
    const accentColor = '#00F5FF';
    const baseColor = dark ? '#1a3a6b' : 'white';

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0, display: 'block' }}
        >
            {/* 1. Triangular Roof */}
            <path d="M10 42L50 18L90 42" fill={accentColor} />

            {/* 2. Sparkle/Star on the Roof */}
            <path d="M76 30L78 26L80 30L84 32L80 34L78 38L76 34L72 32L76 30Z" fill={baseColor} opacity={0.9} />

            {/* 3. Top Horizontal Bar */}
            <rect x="15" y="44" width="70" height="6" rx="3" fill={baseColor} opacity={0.95} />

            {/* 4. Four Vertical Columns (Pills) */}
            <rect x="22" y="54" width="8" height="22" rx="4" fill={baseColor} opacity={0.85} />
            <rect x="38" y="54" width="8" height="22" rx="4" fill={baseColor} opacity={0.85} />
            <rect x="54" y="54" width="8" height="22" rx="4" fill={baseColor} opacity={0.85} />
            <rect x="70" y="54" width="8" height="22" rx="4" fill={baseColor} opacity={0.85} />

            {/* 5. Base Horizontal Bar */}
            <rect x="15" y="80" width="70" height="6" rx="3" fill={baseColor} opacity={0.95} />
        </svg>
    );
};

const Logo: FC<LogoProps> = ({ height = 45, className = '', hideText = false, dark = false }) => {
    const iconSize = Math.round(height * 0.85);
    const fontSize = Math.round(height * 0.5);
    const sloganSize = Math.round(height * 0.22);

    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                userSelect: 'none'
            }}
        >
            <BankMark size={iconSize} dark={dark} />

            {!hideText && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900,
                            fontSize: fontSize,
                            color: dark ? '#1a3a6b' : 'white',
                            letterSpacing: '-1px'
                        }}>GROWUP</span>

                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 500,
                            fontSize: fontSize,
                            color: '#00F5FF',
                            letterSpacing: '1px'
                        }}>FINCORP</span>
                    </div>

                    <div style={{
                        fontSize: sloganSize,
                        fontWeight: 700,
                        color: dark ? '#1a3a6b' : '#FFA500',
                        fontFamily: "'Inter', sans-serif",
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        opacity: dark ? 0.7 : 1
                    }}>
                        Empowering Your Dreams with the Right Loan
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logo;
