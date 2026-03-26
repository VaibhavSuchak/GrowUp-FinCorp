import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, ChevronDown, ChevronUp, Table2, BarChart3 } from 'lucide-react';
import { useLoadingContext } from '../../contexts/LoadingContext';
import { supabase } from '../../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const start = displayValue;
        const end = value;
        const duration = 400;
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setDisplayValue(progress * (end - start) + start);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);

    return (
        <span>
            {prefix}
            {new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(decimals === 0 ? Math.round(displayValue) : displayValue)}
            {suffix}
        </span>
    );
};

const EditableNumericInput = ({ value, onChange, min, max, prefix = "", suffix = "", decimals = 0 }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value.toString());

    useEffect(() => {
        if (!isEditing) {
            setTempValue(value.toString());
        }
    }, [value, isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        let num = parseFloat(tempValue);
        if (isNaN(num)) num = value;
        if (num < min) num = min;
        if (num > max) num = max;
        onChange(num);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    return (
        isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)', fontWeight: 900, fontSize: '1.4rem', fontFamily: "'Outfit', sans-serif" }}>
                {prefix}
                <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{
                        width: `${Math.max(tempValue.length, 1) + 2}ch`,
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        color: 'inherit',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '2px dashed var(--primary-color)',
                        outline: 'none',
                        textAlign: 'right',
                        padding: 0,
                        margin: 0
                    }}
                />
                <span style={{ marginLeft: '0.2rem' }}>{suffix.trim()}</span>
            </div>
        ) : (
            <div
                onClick={() => setIsEditing(true)}
                style={{
                    cursor: 'text',
                    color: 'var(--primary-color)',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    fontFamily: "'Outfit', sans-serif",
                    borderBottom: '2px dashed #93c5fd',
                    transition: 'border-color 0.2s',
                    display: 'inline-block'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderBottom = '2px dashed var(--primary-color)'}
                onMouseOut={(e) => e.currentTarget.style.borderBottom = '2px dashed #93c5fd'}
                title="Click to type value manually"
            >
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix ? ` ${suffix.trim()}` : ''} decimals={decimals} />
            </div>
        )
    );
};

// SVG Circle component for the ROI/Dial effect
const DonutChart = ({ percentage, color }: { percentage: number, color: string }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ transform: 'rotate(-90deg)', WebkitTransform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="35" cy="35" r={radius} stroke="var(--bg-primary)" strokeWidth="6" fill="none" />
                <motion.circle
                    cx="35" cy="35" r={radius}
                    stroke={color} strokeWidth="6" fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: color, fontWeight: 800, fontSize: '0.9rem' }}>{Math.round(percentage)}%</span>
                <span style={{ fontSize: '0.4rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interest</span>
            </div>
        </div>
    );
};

const EMICalculator = () => {
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoadingContext();
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(10);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleView, setScheduleView] = useState<'chart' | 'table'>('chart');
    const [content, setContent] = useState({ title: 'EMI Estimator' });

    useEffect(() => {
        async function fetchEMIContent() {
            try {
                const { data, error } = await supabase.from('site_content').select('*').eq('section_key', 'emi_calculator').single();
                if (!error && data) {
                    setContent(prev => ({ ...prev, ...JSON.parse(data.content) }));
                }
            } catch (err) {
                const localData = localStorage.getItem('mock_site_content');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (parsed.emi_calculator) setContent(prev => ({ ...prev, ...parsed.emi_calculator }));
                }
            }
        }
        fetchEMIContent();
    }, []);

    const { emi, totalInterest, totalPayment, interestRatio, principalRatio, scheduleData } = useMemo(() => {
        const p = amount;
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const e = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || 0;
        const tp = e * n;
        const ti = tp - p;
        const iR = (ti / tp) * 100;
        const pR = (p / tp) * 100;

        // Amortization Schedule Calculation (Yearly Aggregation)
        let balance = p;
        const schedule = [];
        let currentYearInterest = 0;
        let currentYearPrincipal = 0;

        for (let month = 1; month <= n; month++) {
            const interestForMonth = balance * r;
            const principalForMonth = e - interestForMonth;
            balance -= principalForMonth;
            currentYearInterest += interestForMonth;
            currentYearPrincipal += principalForMonth;

            if (month % 12 === 0 || month === n) {
                schedule.push({
                    year: `Year ${Math.ceil(month / 12)}`,
                    principal: Math.round(currentYearPrincipal),
                    interest: Math.round(currentYearInterest),
                    totalPayment: Math.round(currentYearPrincipal + currentYearInterest),
                    balance: balance > 0 ? Math.round(balance) : 0
                });
                currentYearInterest = 0;
                currentYearPrincipal = 0;
            }
        }

        return { emi: e, totalInterest: ti, totalPayment: tp, interestRatio: iR, principalRatio: pR, scheduleData: schedule };
    }, [amount, rate, tenure]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</p>
                    <p style={{ color: 'var(--accent-teal)', margin: '0.2rem 0' }}>Principal: ₹{new Intl.NumberFormat('en-IN').format(payload[0].value)}</p>
                    <p style={{ color: 'var(--secondary-color)', margin: '0.2rem 0' }}>Interest: ₹{new Intl.NumberFormat('en-IN').format(payload[1].value)}</p>
                    <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0', fontWeight: 600, borderTop: '1px solid var(--glass-border)', paddingTop: '0.3rem', marginTop: '0.3rem' }}>Balance: ₹{new Intl.NumberFormat('en-IN').format(payload[0].payload.balance)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="emi-calc-container"
            >
                <style>{`
                    .emi-calc-container {
                        background: var(--bg-secondary);
                        border-radius: 20px;
                        border: 1px solid var(--glass-border);
                        display: grid;
                        grid-template-columns: 1.2fr 1fr;
                        font-family: 'Inter', sans-serif;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                        color: var(--text-primary);
                        width: 100%;
                    }
                    
                    .emi-left-panel {
                        padding: clamp(2rem, 4vw, 3rem);
                        border-right: 1px solid var(--glass-border);
                        background: #ffffff;
                    }
                    
                    .emi-right-panel {
                        padding: clamp(2rem, 4vw, 3rem);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        background: var(--bg-secondary);
                    }

                    @media (max-width: 900px) {
                        .emi-calc-container {
                            grid-template-columns: 1fr;
                        }
                        .emi-left-panel {
                            border-right: none;
                            border-bottom: 1px solid var(--glass-border);
                        }
                    }

                    .step-label {
                        display: flex;
                        align-items: center;
                        gap: 0.8rem;
                        color: var(--text-secondary);
                        font-size: 0.85rem;
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        margin-bottom: 0.8rem;
                    }

                    .step-number {
                        background: #eff6ff;
                        color: var(--primary-color);
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.8rem;
                        font-weight: 800;
                    }

                    .calc-slider {
                        -webkit-appearance: none;
                        width: 100%;
                        height: 8px;
                        background: var(--bg-primary);
                        border-radius: 4px;
                        outline: none;
                        margin-top: 1.5rem;
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
                    }

                    .calc-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: var(--primary-color);
                        cursor: pointer;
                        box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
                        border: 4px solid #ffffff;
                        transition: transform 0.1s;
                    }

                    .calc-slider::-webkit-slider-thumb:hover {
                        transform: scale(1.15);
                    }

                    .value-display {
                        color: var(--primary-color);
                        font-weight: 900;
                        font-size: 1.4rem;
                        font-family: "'Outfit', sans-serif";
                    }

                    .bar-row { margin-bottom: 1.5rem; }
                    .bar-header { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.6rem; font-weight: 600; }
                    .bar-track { height: 10px; background: var(--bg-primary); border-radius: 5px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
                    
                    /* Table Styles */
                    .amortization-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 1rem; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
                    .amortization-table th { background: #1e3a8a; padding: 1.2rem 1rem; text-align: right; color: #ffffff; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
                    .amortization-table th:first-child { text-align: left; }
                    .amortization-table td { padding: 1rem; text-align: right; border-bottom: 1px solid #f1f5f9; color: var(--text-primary); font-weight: 600; font-variant-numeric: tabular-nums; }
                    .amortization-table td:first-child { text-align: left; font-weight: 800; color: #1e3a8a; }
                    .amortization-table tr:last-child td { border-bottom: none; }
                    .amortization-table tr:nth-child(even) td { background: #f8fafc; }
                    .amortization-table tr:hover td { background: #eff6ff; }
                `}</style>

                {/* Left Panel - Inputs */}
                <div className="emi-left-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
                        <div style={{ padding: '0.6rem', background: '#eff6ff', borderRadius: '12px', color: '#2563eb' }}>
                            <Briefcase size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>{content.title}</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {/* Amount */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="step-label">
                                    <div className="step-number">01</div> LOAN AMOUNT
                                </div>
                                <div className="value-display"><EditableNumericInput value={amount} onChange={setAmount} min={10000} max={100000000} prefix="₹" /></div>
                            </div>
                            <input
                                type="range" min="100000" max="10000000" step="50000" value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="calc-slider"
                                style={{ background: `linear-gradient(to right, var(--primary-color) ${(amount - 100000) / (10000000 - 100000) * 100}%, var(--bg-primary) ${(amount - 100000) / (10000000 - 100000) * 100}%)` }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '0.8rem', fontWeight: 500 }}>
                                <span>₹1 Lakh</span>
                                <span>₹1 Crore</span>
                            </div>
                        </div>

                        {/* Interest */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="step-label">
                                    <div className="step-number">02</div> INTEREST RATE
                                </div>
                                <div className="value-display"><EditableNumericInput value={rate} onChange={setRate} min={1} max={50} suffix="%" decimals={1} /></div>
                            </div>
                            <input
                                type="range" min="5" max="25" step="0.1" value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="calc-slider"
                                style={{ background: `linear-gradient(to right, var(--primary-color) ${(rate - 5) / (25 - 5) * 100}%, var(--bg-primary) ${(rate - 5) / (25 - 5) * 100}%)` }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '0.8rem', fontWeight: 500 }}>
                                <span>5%</span>
                                <span>25%</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="step-label">
                                    <div className="step-number">03</div> LOAN TENURE (YRS)
                                </div>
                                <div className="value-display"><EditableNumericInput value={tenure} onChange={setTenure} min={0.5} max={30} suffix="YRS" decimals={tenure % 1 !== 0 ? 1 : 0} /></div>
                            </div>
                            <input
                                type="range" min="0.5" max="30" step="0.5" value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="calc-slider"
                                style={{ background: `linear-gradient(to right, var(--primary-color) ${(tenure - 0.5) / (30 - 0.5) * 100}%, var(--bg-primary) ${(tenure - 0.5) / (30 - 0.5) * 100}%)` }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '0.8rem', fontWeight: 500 }}>
                                <span>1 Yr</span>
                                <span>30 Yrs</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '3.5rem',
                        padding: '1.2rem',
                        border: '1px solid #dcfce7',
                        borderRadius: '12px',
                        background: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem'
                    }}>
                        <div style={{ background: '#16a34a', color: '#fff', padding: '4px', borderRadius: '50%' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span style={{ color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>100% Free • Secure Processing • Instant Results</span>
                    </div>
                </div>

                {/* Right Panel - Results */}
                <div className="emi-right-panel">
                    <div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '3rem' }}>
                            <DonutChart percentage={interestRatio} color="var(--primary-color)" />
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>Loan Breakdown</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Principal vs Interest Allocation</div>
                            </div>
                        </div>

                        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 700 }}>WHERE YOUR MONEY GOES</div>

                            <div className="bar-row">
                                <div className="bar-header">
                                    <span style={{ color: 'var(--text-secondary)' }}>Principal Amount</span>
                                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}><AnimatedNumber value={amount} prefix="₹" /></span>
                                </div>
                                <div className="bar-track">
                                    <motion.div animate={{ width: `${principalRatio}%` }} style={{ height: '100%', background: '#2563eb', borderRadius: '5px' }} />
                                </div>
                            </div>

                            <div className="bar-row" style={{ marginBottom: 0 }}>
                                <div className="bar-header">
                                    <span style={{ color: 'var(--text-secondary)' }}>Total Interest Payable</span>
                                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}><AnimatedNumber value={totalInterest} prefix="₹" /></span>
                                </div>
                                <div className="bar-track">
                                    <motion.div animate={{ width: `${interestRatio}%` }} style={{ height: '100%', background: '#38bdf8', borderRadius: '5px' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid #bfdbfe', marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#1e3a8a', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 800 }}>ESTIMATED MONTHLY EMI</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1e40af', margin: '0.5rem 0', fontFamily: "'Outfit', sans-serif", textShadow: '0 2px 10px rgba(30, 64, 175, 0.1)' }}>
                                <AnimatedNumber value={emi} prefix="₹" />
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500, marginTop: '0.5rem' }}>Total payment <strong style={{ color: '#0f172a' }}><AnimatedNumber value={totalPayment} prefix="₹" /></strong> over {tenure} years</div>
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                showLoading('Preparing your personalized loan offer...', 'gradient');
                                setTimeout(() => {
                                    showLoading('Connecting to top lending partners...', 'financial');
                                    setTimeout(() => {
                                        navigate('/contact');
                                        setTimeout(() => hideLoading(), 500);
                                    }, 1000);
                                }, 1500);
                            }}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(to right, #1e3a8a, #2563eb)',
                                color: '#fff',
                                border: 'none',
                                padding: '1.2rem',
                                borderRadius: '100px',
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            Apply Now To Get Lowest Rates <ArrowRight size={20} />
                        </motion.button>

                        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
                            Results are indicative based on standard banking formulas. Actuals may vary.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Expander for Amortization Schedule */}
            <div style={{ width: '100%', textAlign: 'center' }}>
                <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    style={{
                        border: 'none',
                        color: 'var(--primary-color)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '1rem 2rem',
                        borderRadius: '100px',
                        transition: 'all 0.3s',
                        background: 'rgba(37, 99, 235, 0.05)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)'}
                >
                    {showSchedule ? 'Hide Repayment Schedule' : 'View Detailed Repayment Schedule'}
                    {showSchedule ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Amortization Table & Chart Container */}
            <AnimatePresence>
                {showSchedule && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            padding: 'clamp(1.5rem, 4vw, 3rem)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Yearly Repayment Schedule</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Comprehensive breakdown of your principal and interest over {tenure} years.</p>
                                </div>
                                <div style={{ display: 'flex', background: '#f8fafc', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <button
                                        onClick={() => setScheduleView('chart')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: scheduleView === 'chart' ? '#ffffff' : 'transparent', color: scheduleView === 'chart' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: scheduleView === 'chart' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
                                    >
                                        <BarChart3 size={18} /> Graph View
                                    </button>
                                    <button
                                        onClick={() => setScheduleView('table')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: scheduleView === 'table' ? '#ffffff' : 'transparent', color: scheduleView === 'table' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: scheduleView === 'table' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
                                    >
                                        <Table2 size={18} /> Table View
                                    </button>
                                </div>
                            </div>

                            {scheduleView === 'chart' ? (
                                <div style={{ width: '100%', height: '400px', marginTop: '2rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={scheduleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="principal" name="Principal Paid" stackId="a" fill="#2563eb" radius={[0, 0, 4, 4]} />
                                            <Bar dataKey="interest" name="Interest Paid" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <table className="amortization-table">
                                        <thead>
                                            <tr>
                                                <th>Year</th>
                                                <th>Principal Paid</th>
                                                <th>Interest Paid</th>
                                                <th>Total Payment</th>
                                                <th>Closing Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scheduleData.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td>{row.year}</td>
                                                    <td style={{ color: '#2563eb' }}>₹{new Intl.NumberFormat('en-IN').format(row.principal)}</td>
                                                    <td style={{ color: '#38bdf8' }}>₹{new Intl.NumberFormat('en-IN').format(row.interest)}</td>
                                                    <td>₹{new Intl.NumberFormat('en-IN').format(row.totalPayment)}</td>
                                                    <td style={{ fontWeight: 800, color: '#1e3a8a' }}>₹{new Intl.NumberFormat('en-IN').format(row.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EMICalculator;
